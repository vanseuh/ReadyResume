import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkTierRateLimit, getClientIp, logActivity, logTransaction } from "@/lib/rateLimiter";
import { KitData } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Token-Conservation Constraints
const MAX_RESUME_CHARS = 8000;     // ~1,200 words / 2–3 pages
const MAX_JOB_CHARS = 5000;        // ~800 words
const MIN_CHARACTERS = 50;
const MIN_WORDS = 15;

// Cumulative token usage tracking across server invocations
let cumulativeTokensUsed = 0;
const TOTAL_TOKEN_BUDGET = 40_000_000;

function isGibberishOrSpam(text: string): { isSpam: boolean; reason?: string } {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length < MIN_WORDS) {
    return {
      isSpam: true,
      reason: `Text is too sparse (found ${words.length} words; minimum ${MIN_WORDS} words required for accurate analysis).`,
    };
  }

  // Check for repeated identical characters (e.g., 'aaaa...', 'xxxx...')
  if (/(.)\1{12,}/.test(text)) {
    return {
      isSpam: true,
      reason: "Input contains excessive repeated characters.",
    };
  }

  // Check for repeated short dummy words (e.g., 'test test test test')
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (words.length >= 20 && uniqueWords.size / words.length < 0.25) {
    return {
      isSpam: true,
      reason: "Input lacks sufficient variety or consists of repetitive placeholder text.",
    };
  }

  return { isSpam: false };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Dual-Tier Rate Limiting (Free: 3/hr | 10-Day Pro Pass: 10/day)
    const clientIp = getClientIp(req);
    const proUtrHeader = req.headers.get("x-pro-utr");
    const rateCheck = checkTierRateLimit(clientIp, proUtrHeader);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateCheck.message || "You have reached the preview limit. Please try again later.",
          proPass: rateCheck.isPro
            ? {
                isPro: true,
                remainingToday: rateCheck.remainingToday || 0,
                expiresAt: rateCheck.expiresAt || 0,
                dayNumber: rateCheck.dayNumber || 1,
              }
            : undefined,
        },
        { status: 429 }
      );
    }

    // 2. Parse Request Payload
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const { resume, jobDescription } = body || {};

    // Basic Character Length Checks
    if (!resume || typeof resume !== "string" || resume.trim().length < MIN_CHARACTERS) {
      return NextResponse.json(
        {
          success: false,
          error: `Current Resume is too short. Please provide at least ${MIN_CHARACTERS} characters.`,
        },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < MIN_CHARACTERS) {
      return NextResponse.json(
        {
          success: false,
          error: `Target Job Description is too short. Please provide at least ${MIN_CHARACTERS} characters.`,
        },
        { status: 400 }
      );
    }

    if (resume.length > MAX_RESUME_CHARS) {
      return NextResponse.json(
        {
          success: false,
          error: `Resume exceeds the maximum allowable cap of ${MAX_RESUME_CHARS.toLocaleString()} characters.`,
        },
        { status: 400 }
      );
    }

    if (jobDescription.length > MAX_JOB_CHARS) {
      return NextResponse.json(
        {
          success: false,
          error: `Job Description exceeds the maximum allowable cap of ${MAX_JOB_CHARS.toLocaleString()} characters.`,
        },
        { status: 400 }
      );
    }

    // Gibberish & Empty Input Filter
    const resumeSpamCheck = isGibberishOrSpam(resume);
    if (resumeSpamCheck.isSpam) {
      return NextResponse.json(
        { success: false, error: `Resume Error: ${resumeSpamCheck.reason}` },
        { status: 400 }
      );
    }

    const jobSpamCheck = isGibberishOrSpam(jobDescription);
    if (jobSpamCheck.isSpam) {
      return NextResponse.json(
        { success: false, error: `Job Description Error: ${jobSpamCheck.reason}` },
        { status: 400 }
      );
    }

    // 3. Verify Server LLM Configuration
    const apiKey = (process.env.LLM_API_KEY || process.env.LLAMA_API_KEY)?.trim();
    const baseURL = (process.env.LLM_BASE_URL || process.env.LLAMA_BASE_URL)?.trim() || "https://api.groq.com/openai/v1";
    const model = (process.env.LLM_MODEL || process.env.LLAMA_MODEL)?.trim() || "llama-3.3-70b-versatile";

    if (!apiKey) {
      console.error("Missing LLM_API_KEY or LLAMA_API_KEY on the server.");
      return NextResponse.json(
        {
          success: false,
          error: "Server Configuration Error: LLM_API_KEY is not configured in .env.local on the server.",
        },
        { status: 500 }
      );
    }

    // 4. Ultra-Concise, Token-Optimized System Prompt (Zero Fluff)
    const systemPrompt = `You are a Senior ATS Career Specialist. Output concise, punchy, high-impact career assets.
Be direct. Avoid conversational filler.

OUTPUT INSTRUCTIONS:
Respond with parseable JSON matching this schema:
{
  "atsScore": 75,
  "scoreCategory": "Strong Contender",
  "missingKeywords": [
    {
      "keyword": "PostgreSQL & Query Optimization",
      "description": "Missing in resume • Add query indexing metrics under Work Experience to turn this into a strong match.",
      "status": "Critical Gap",
      "isGood": false
    }
  ],
  "tailoredResume": {
    "fullName": "Name from resume",
    "targetTitle": "Target role title",
    "contact": "Contact line",
    "summary": "Crisp 2-3 sentence tailored summary.",
    "skills": {
      "technical": "Key technical skills",
      "methodologies": "Key methodologies",
      "leadership": "Key collaboration skills"
    },
    "experience": [
      {
        "role": "Role",
        "company": "Company",
        "period": "Dates",
        "bullets": [
          "Action-oriented bullet with metric",
          "Action-oriented bullet with metric"
        ]
      }
    ],
    "education": "Degree and institution"
  },
  "interviewQuestions": [
    {
      "id": 1,
      "category": "Domain",
      "type": "technical",
      "question": "Concise role-specific question?",
      "criteria": "Evaluation criteria",
      "sampleAnswer": {
        "situation": "Crisp 1-sentence situation.",
        "task": "Crisp 1-sentence task.",
        "action": "Crisp 1-2 sentence action taken.",
        "result": "Measurable quantifiable result."
      },
      "proTip": "Punchy 1-sentence tip"
    }
  ]
}

STRICT CONSTRAINTS:
1. ATS Score (0-100%): Realistic score based on skill overlap.
2. missingKeywords: Exactly 3 to 5 top critical missing keywords ranked by priority. Each is an object with "keyword", a short 1-sentence "description" on what to improve or how to make it good, "status" ("Critical Gap", "Needs Addition", or "Good Potential"), and "isGood" (boolean).
3. tailoredResume: Keep bullets punchy, direct, and metric-focused without fluff.
4. interviewQuestions: Provide exactly 6 questions (IDs 1 to 6: exactly 3 technical + 3 behavioral) with crisp 3-4 sentence total STAR answers.
5. Return JSON ONLY. No markdown wrapper, no preamble.`;

    const userPrompt = `RESUME:
${resume.trim()}

JOB DESCRIPTION:
${jobDescription.trim()}`;

    // 5. Query LLM with strict max_tokens cap and automatic retry for transient 503 spikes
    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    const callLlm = async (useJsonFormat: boolean) => {
      const options: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 2400,
      };
      if (useJsonFormat) {
        options.response_format = { type: "json_object" };
      }
      return await openai.chat.completions.create(options);
    };

    let completion;
    try {
      try {
        completion = await callLlm(true);
      } catch (firstErr: unknown) {
        const errStr = String((firstErr as Error)?.message || firstErr);
        // If unsupported response_format, try without it
        if (/response_format|json_object|unsupported/i.test(errStr)) {
          console.warn("Retrying without response_format json_object...");
          completion = await callLlm(false);
        } else if (/503|high demand|UNAVAILABLE|overloaded/i.test(errStr)) {
          // Automatic 1x retry on transient 503 spikes with a 2-second delay
          console.warn("Upstream 503 high demand detected. Retrying after 2 seconds...");
          await new Promise((r) => setTimeout(r, 2000));
          completion = await callLlm(true);
        } else {
          throw firstErr;
        }
      }
    } catch (apiErr: unknown) {
      throw apiErr;
    }

    // 6. Live Token Usage Tracker (Server Console Logs)
    const usage = completion.usage;
    if (usage) {
      cumulativeTokensUsed += usage.total_tokens;
      const remainingBudget = Math.max(0, TOTAL_TOKEN_BUDGET - cumulativeTokensUsed);
      const percentUsed = ((cumulativeTokensUsed / TOTAL_TOKEN_BUDGET) * 100).toFixed(4);
      const percentRemaining = (100 - parseFloat(percentUsed)).toFixed(4);

      console.log(`\n======================================================`);
      console.log(`📊 [ReadyResume Live Token Tracker]`);
      console.log(`Request Usage: Prompt=${usage.prompt_tokens} | Completion=${usage.completion_tokens} | Total=${usage.total_tokens}`);
      console.log(`Session Cumulative: ${cumulativeTokensUsed.toLocaleString()} tokens (${percentUsed}% of 40M)`);
      console.log(`Budget Remaining: ${remainingBudget.toLocaleString()} / ${TOTAL_TOKEN_BUDGET.toLocaleString()} tokens (${percentRemaining}%)`);
      console.log(`======================================================\n`);
    }

    const rawText = completion.choices[0]?.message?.content;
    if (!rawText) {
      throw new Error("LLM API returned an empty response.");
    }

    // 7. Safe JSON Extraction
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/g, "").trim();

    const startIdx = cleaned.indexOf("{");
    const endIdx = cleaned.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
    }

    const parsed: KitData = JSON.parse(cleaned);

    // Validate essential properties
    if (typeof parsed.atsScore !== "number") {
      parsed.atsScore = parseInt(String(parsed.atsScore), 10) || 72;
    }
    if (!Array.isArray(parsed.missingKeywords)) {
      parsed.missingKeywords = [];
    }
    if (!parsed.tailoredResume) {
      throw new Error("Response was missing tailoredResume object.");
    }
    if (!Array.isArray(parsed.interviewQuestions) || parsed.interviewQuestions.length === 0) {
      throw new Error("Response was missing interviewQuestions array.");
    }

    logActivity({
      timestamp: Date.now(),
      type: rateCheck.isPro ? "pro_generation" : "free_preview",
      ip: clientIp,
      utr: proUtrHeader || undefined,
    });

    if (rateCheck.isPro && proUtrHeader) {
      logTransaction({
        utr: proUtrHeader,
        timestamp: Date.now(),
        ip: clientIp,
        amount: 49,
        status: "verified",
      });
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      proPass: rateCheck.isPro
        ? {
            isPro: true,
            remainingToday: rateCheck.remainingToday ?? 10,
            expiresAt: rateCheck.expiresAt || 0,
            dayNumber: rateCheck.dayNumber || 1,
          }
        : undefined,
      tokenUsage: usage
        ? {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
          }
        : undefined,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("API /api/generate Error:", error);

    let rawMsg = error.message || "An unexpected error occurred.";
    let statusCode = 500;

    // Check if error message is wrapped in JSON (e.g. {"error": {"message": "..."}})
    try {
      const jsonStart = rawMsg.indexOf("{");
      const jsonEnd = rawMsg.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const parsedErr = JSON.parse(rawMsg.slice(jsonStart, jsonEnd + 1));
        if (parsedErr?.error?.message) {
          rawMsg = parsedErr.error.message;
        } else if (parsedErr?.message) {
          rawMsg = parsedErr.message;
        }
      }
    } catch {
      // Keep original rawMsg
    }

    let friendlyMessage = rawMsg;

    if (/hourly rate limit|5 generations per hour/i.test(rawMsg)) {
      statusCode = 429;
      friendlyMessage =
        "The upstream AI provider reached its hourly limit (5 requests/hour on free desktop proxy). Tip: Set a free Groq Cloud API key in .env.local for unlimited, instantaneous 300 token/sec generations!";
    } else if (/high demand|unavailable|503|overloaded/i.test(rawMsg)) {
      statusCode = 503;
      friendlyMessage =
        "The AI model is experiencing a momentary traffic spike. Please wait 10 seconds and try clicking 'Make My Resume Ready' again.";
    } else if (/rate limit|429|quota/i.test(rawMsg)) {
      statusCode = 429;
      friendlyMessage =
        "Upstream AI rate limit reached. Please wait a moment before submitting your next analysis.";
    }

    return NextResponse.json(
      {
        success: false,
        error: friendlyMessage,
      },
      { status: statusCode }
    );
  }
}
