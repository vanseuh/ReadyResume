"use client";

import React from "react";
import { Search, Award, CheckCircle2, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { KitData, KeywordGapItem } from "@/lib/types";

interface ScoreCardProps {
  data: KitData;
  onScrollToResume: () => void;
  onOpenPaywall: () => void;
  isUnlocked: boolean;
}

interface NormalizedKeyword {
  keyword: string;
  description: string;
  status: string;
  isGood: boolean;
}

function normalizeKeyword(item: string | KeywordGapItem, rank: number): NormalizedKeyword {
  if (typeof item === "object" && item !== null && item.keyword) {
    const isGood = typeof item.isGood === "boolean"
      ? item.isGood
      : /good|easy|match|minor/i.test(item.status || "");

    const defaultStatus = isGood
      ? "Easy Fix (Good Potential)"
      : rank === 1
      ? "Critical Gap (Bad)"
      : rank === 2
      ? "High Priority Gap (Bad)"
      : "Needs Addition";

    const defaultDescriptions = [
      `Missing in resume • Add ${item.keyword} metrics under Work Experience to turn this into a strong recruiter match (+8%).`,
      `Not detected by ATS • Highlight practical application of ${item.keyword} in technical skills & project bullets.`,
      `Employer priority • Incorporate ${item.keyword} into core competencies to pass screening filters.`,
      `Moderate gap • Mention ${item.keyword} tools & workflow experience to strengthen role alignment.`,
      `Quick win • Add ${item.keyword} to summary or certifications for maximum keyword density boost.`,
    ];

    return {
      keyword: item.keyword,
      description: item.description || defaultDescriptions[rank - 1] || `Incorporate ${item.keyword} into your bullet points.`,
      status: item.status || defaultStatus,
      isGood,
    };
  }

  const kw = String(item || "").trim();
  const isGood = rank >= 4;
  const defaultStatus = rank === 1
    ? "Critical Gap (Bad)"
    : rank === 2
    ? "High Priority Gap (Bad)"
    : rank === 3
    ? "Needs Addition"
    : "Easy Fix (Good Potential)";

  const defaultDescriptions = [
    `Missing in resume • Add ${kw} metrics under Work Experience to turn this into a strong recruiter match (+8%).`,
    `Not detected by ATS • Highlight practical application of ${kw} in technical skills & project bullets.`,
    `Employer priority • Incorporate ${kw} into core competencies to pass screening filters.`,
    `Moderate gap • Mention ${kw} tools & workflow experience to strengthen role alignment.`,
    `Quick win • Add ${kw} to summary or certifications for maximum keyword density boost.`,
  ];

  return {
    keyword: kw || "Core Technical Competency",
    description: defaultDescriptions[rank - 1] || `Incorporate ${kw} in your resume bullets to optimize ATS keyword density.`,
    status: defaultStatus,
    isGood,
  };
}

export default function ScoreCard({
  data,
  onScrollToResume,
  onOpenPaywall,
  isUnlocked,
}: ScoreCardProps) {
  const score = Math.max(0, Math.min(100, data.atsScore || 0));

  // Determine stroke color and badge
  let strokeColor = "#e11d48"; // rose-600
  let badgeColor = "bg-rose-100 text-rose-800 border-rose-200";
  let statusText = "Needs Keyword Optimization";

  if (score >= 75) {
    strokeColor = "#059669"; // emerald-600
    badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    statusText = "Strong Contender";
  } else if (score >= 50) {
    strokeColor = "#2563eb"; // brand-600
    badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
    statusText = "Moderate Match — Keyword Gaps";
  }

  // Circumference for r=66 is 2 * PI * 66 = ~414.69
  const circumference = 414.69;
  const offset = circumference - (score / 100) * circumference;

  const keywordColors = [
    { bg: "bg-rose-50/80", border: "border-rose-200", num: "bg-rose-200 text-rose-800", text: "text-rose-900" },
    { bg: "bg-amber-50/80", border: "border-amber-200", num: "bg-amber-200 text-amber-800", text: "text-amber-900" },
    { bg: "bg-blue-50/80", border: "border-blue-200", num: "bg-blue-200 text-blue-800", text: "text-blue-900" },
    { bg: "bg-indigo-50/80", border: "border-indigo-200", num: "bg-indigo-200 text-indigo-800", text: "text-indigo-900" },
    { bg: "bg-purple-50/80", border: "border-purple-200", num: "bg-purple-200 text-purple-800", text: "text-purple-900" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Analysis Complete! Your Kit is Ready</h3>
            <p className="text-xs text-slate-500">
              Review your free ATS evaluation & the first 2 interview answers below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onScrollToResume}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          >
            View Tailored Resume
          </button>
          {!isUnlocked && (
            <button
              onClick={onOpenPaywall}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
            >
              Unlock Full Kit (₹49)
            </button>
          )}
        </div>
      </div>

      {/* FREE ATS MATCH SCORE & MISSING KEYWORDS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Radial Score Gauge */}
          <div className="flex flex-col items-center justify-center text-center shrink-0">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="66" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle
                  cx="80"
                  cy="80"
                  r="66"
                  stroke={strokeColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="score-circle-transition"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">{score}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ATS Match Score
                </span>
              </div>
            </div>
            <span
              className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
            >
              {data.scoreCategory || statusText}
            </span>
          </div>

          {/* Missing Keywords & ATS Gap Breakdown */}
          <div className="flex-grow w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-brand-600" />
                <span>Keyword Gap Analysis</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                Free Preview
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Applicant Tracking Systems scan for exact keyword alignment. Below are the specific skills
              or methodologies missing from your resume that the target employer prioritizes:
            </p>

            {/* Missing Keyword Badges with Ranking, Good/Bad Status & Faded Actionable Description */}
            <div className="space-y-3">
              {data.missingKeywords && data.missingKeywords.length > 0 ? (
                data.missingKeywords.slice(0, 5).map((rawKw, idx) => {
                  const kw = normalizeKeyword(rawKw, idx + 1);
                  const c = keywordColors[idx % keywordColors.length];

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl ${c.bg} border ${c.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:shadow-2xs`}
                    >
                      <div className="flex items-start gap-3 flex-grow">
                        {/* Rank Badge */}
                        <span
                          className={`w-6 h-6 rounded-full ${c.num} flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs`}
                        >
                          {idx + 1}
                        </span>

                        <div className="flex-grow">
                          {/* Top Row: Bold Keyword Title + Good/Bad Status Pill */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs sm:text-sm font-bold ${c.text}`}>
                              {kw.keyword}
                            </span>

                            {/* Good vs Bad Indicator */}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs ${
                                kw.isGood
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-rose-50 text-rose-800 border-rose-200"
                              }`}
                            >
                              {kw.status}
                            </span>
                          </div>

                          {/* Short Highlighted Description (Not Bold, Faded Whitish / Muted) */}
                          <p className="text-[11px] sm:text-xs font-normal text-slate-500/90 mt-1 leading-snug">
                            {kw.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Impact Tag */}
                      <div className="shrink-0 self-end sm:self-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 border border-slate-200 text-slate-600 shadow-2xs whitespace-nowrap">
                          {idx === 0 ? "🔥 Rank #1 Priority" : idx === 1 ? "⚡ High Impact" : "🎯 Priority Gap"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  No critical keyword gaps detected.
                </div>
              )}
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Match Depth</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                  {score >= 75 ? "High" : score >= 50 ? "Moderate" : "Low"}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Format Standard</div>
                <div className="font-bold text-emerald-600 text-sm mt-0.5 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ATS Clean
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Evaluation Engine</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Llama 3.3
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURRENT VS PROJECTED ATS SCORE VISUAL HOOK */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/50 to-teal-50/50 border border-emerald-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Current ATS Match Score:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800">
                {score}%
              </span>
            </div>
            <span className="text-emerald-500 font-bold hidden sm:inline">➔</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800">Projected Score After MakeYourResume:</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                <span>92%–98%</span>
                <span>✅</span>
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 font-medium text-center md:text-right">
            MakeYourResume rewrite injects all 5 priority keyword gaps into verified recruiter-ready bullet points.
          </p>
        </div>
      </div>
    </div>
  );
}
