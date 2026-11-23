import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";
import { KitData } from "@/lib/types";

// Character limits per input box
const MAX_CHARACTERS = 15000;
const MIN_CHARACTERS = 50;

export async function POST(req: NextRequest) {
  try {
    // 1. In-Memory IP Rate Limiting (5 requests per IP per hour to protect tokens)
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Hourly rate limit exceeded. To protect server capacity, you may make up to 5 generations per hour. Please try again in ${rateCheck.resetInMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Inputs
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

    if (!resume || typeof resume !== "string" || resume.trim().length < MIN_CHARACTERS) {
      return NextResponse.json(
        {
          success: false,
          error: `Current Resume is too short. Please provide at least ${MIN_CHARACTERS} characters (experience, job history, skills).`,
        },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < MIN_CHARACTERS) {
      return NextResponse.json(
        {
          success: false,
          error: `Target Job Description is too short. Please provide at least ${MIN_CHARACTERS} characters (role requirements, responsibilities).`,
        },
        { status: 400 }
      );
    }

    if (resume.length > MAX_CHARACTERS) {
      return NextResponse.json(
        {
          success: false,
          error: `Resume exceeds the maximum allowable length of ${MAX_CHARACTERS} characters.`,
        },
        { status: 400 }
      );
    }

    if (jobDescription.length > MAX_CHARACTERS) {
      return NextResponse.json(
        {
          success: false,
          error: `Job Description exceeds the maximum allowable length of ${MAX_CHARACTERS} characters.`,
        },
        { status: 400 }
      );
    }

    // 3. Verify Server LLM / Llama API Configuration
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

    // 4. Construct System Prompt & JSON Instructions
    const systemPrompt = `You are an expert Executive Career Coach and Senior ATS (Applicant Tracking System) Specialist.
Analyze the provided candidate resume against the target job description and generate an ATS Career Kit.

OUTPUT INSTRUCTIONS:
You MUST respond with valid, parseable JSON only matching this exact schema:
{
  "atsScore": 76,
  "scoreCategory": "Strong Contender",
  "missingKeywords": [
    "Keyword 1",
    "Keyword 2",
    "Keyword 3",
    "Keyword 4"
  ],
  "tailoredResume": {
    "fullName": "Candidate Full Name from resume",
    "targetTitle": "Target Title from job description",
    "contact": "Email | Phone | Location | Links from resume",
    "summary": "Compelling 3-4 sentence professional summary tailored to target role.",
    "skills": {
      "technical": "Comma separated technical skills and tools",
      "methodologies": "Comma separated methodologies and workflows",
      "leadership": "Comma separated soft skills and collaboration traits"
    },
    "experience": [
      {
        "role": "Role Title",
        "company": "Company Name",
        "period": "Date Range",
        "bullets": [
          "Action-oriented bullet 1 with quantifiable metrics and keywords",
          "Action-oriented bullet 2 with quantifiable metrics and keywords",
          "Action-oriented bullet 3 with quantifiable metrics and keywords"
        ]
      }
    ],
    "education": "Degree, Major, Institution from resume"
  },
  "interviewQuestions": [
    {
      "id": 1,
      "category": "Technical Architecture",
      "type": "technical",
      "question": "Role-specific technical question tailored to candidate and job?",
      "criteria": "Interviewer evaluation criteria",
      "sampleAnswer": {
        "situation": "Specific past scenario...",
        "task": "The technical obstacle or problem...",
        "action": "Actions taken with relevant tools...",
        "result": "Measurable outcome achieved..."
      },
      "proTip": "Expert pro tip"
    }
  ]
}

STRICT EVALUATION CONSTRAINTS:
1. Realistically evaluate keyword overlap: score 20–45 if mostly mismatched, 50–70 if partial match with gaps, 75–92 if strong.
2. Identify 3 to 5 genuinely missing or under-represented keywords/technologies from the job description.
3. Tailor resume strictly to provided facts without inventing fake companies or degrees.
4. Provide exactly 8 interview questions (ids 1 to 8: exactly 4 technical and 4 behavioral) with multi-sentence STAR answers.
5. Return JSON ONLY. Do not wrap in markdown or include conversational intro/outro text.`;

    const userPrompt = `CANDIDATE RESUME:
${resume.trim()}

TARGET JOB DESCRIPTION:
${jobDescription.trim()}`;

    // 5. Query Llama via OpenAI-compatible endpoint
    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
    } catch (apiErr: unknown) {
      // Some providers/models may not support response_format: { type: "json_object" }
      const err = apiErr as Error;
      if (/response_format|json_object|unsupported/i.test(err.message)) {
        console.warn("Retrying without response_format json_object...");
        completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
        });
      } else {
        throw apiErr;
      }
    }

    const rawText = completion.choices[0]?.message?.content;
    if (!rawText) {
      throw new Error("Llama API returned an empty response.");
    }

    // 6. Safe JSON Extraction
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

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("API /api/generate Error:", error);

    const isRateLimit = /rate limit|429|quota/i.test(error.message);
    const friendlyMessage = isRateLimit
      ? "Llama API rate limit reached. Please wait a moment and try again."
      : error.message || "An error occurred while generating your career kit.";

    return NextResponse.json(
      {
        success: false,
        error: friendlyMessage,
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
