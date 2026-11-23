"use client";

import React from "react";
import { Search, Award, CheckCircle2, TrendingUp } from "lucide-react";
import { KitData } from "@/lib/types";

interface ScoreCardProps {
  data: KitData;
  onScrollToResume: () => void;
  onOpenPaywall: () => void;
  isUnlocked: boolean;
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

            {/* Missing Keyword Badges */}
            <div className="space-y-2.5">
              {data.missingKeywords && data.missingKeywords.length > 0 ? (
                data.missingKeywords.slice(0, 5).map((kw, idx) => {
                  const c = keywordColors[idx % keywordColors.length];
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${c.bg} border ${c.border} flex items-center justify-between gap-3`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full ${c.num} flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          {idx + 1}
                        </span>
                        <span className={`text-xs sm:text-sm font-bold ${c.text}`}>{kw}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/90 border border-slate-200 text-slate-600">
                        Priority Gap
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
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
      </div>
    </div>
  );
}
