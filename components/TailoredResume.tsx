"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Download,
  Lock,
  Check,
  Zap,
} from "lucide-react";
import { KitData } from "@/lib/types";
import { generatePdfKit } from "@/lib/pdfGenerator";

interface TailoredResumeProps {
  data: KitData;
  isUnlocked: boolean;
  onOpenPaywall: () => void;
}

export default function TailoredResume({
  data,
  isUnlocked,
  onOpenPaywall,
}: TailoredResumeProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const r = data.tailoredResume;

  const handleCopyText = async () => {
    if (!isUnlocked) {
      onOpenPaywall();
      return;
    }

    let text = `${r.fullName}\n${r.targetTitle}\n${r.contact}\n\n`;
    text += `PROFESSIONAL SUMMARY\n${r.summary}\n\n`;
    text += `CORE COMPETENCIES & KEYWORDS\n• Technical: ${r.skills?.technical}\n• Methodologies: ${r.skills?.methodologies}\n• Leadership: ${r.skills?.leadership}\n\n`;
    text += `PROFESSIONAL EXPERIENCE\n`;
    (r.experience || []).forEach((exp) => {
      text += `\n${exp.role} — ${exp.company} (${exp.period})\n`;
      (exp.bullets || []).forEach((b) => (text += `• ${b}\n`));
    });
    text += `\nEDUCATION\n${r.education}\n`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadPdf = () => {
    if (!isUnlocked) {
      onOpenPaywall();
      return;
    }

    setIsExporting(true);
    try {
      generatePdfKit(data);
    } catch (err) {
      console.error("PDF export error:", err);
      window.print();
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <div id="resumeSection" className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 mb-2">
            <Sparkles className="w-3 h-3 text-brand-600" /> ATS-Optimized Rewrite
          </div>
          <h3 className="text-xl font-bold text-slate-900">Tailored Resume (Clean ATS Format)</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Re-engineered with action verbs, quantifiable metrics, and target job keywords.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Building PDF..." : "Download Complete PDF Kit"}</span>
          </button>
        </div>
      </div>

      {/* Content Wrapper with Paywall Blur */}
      <div className="relative min-h-[450px]">
        {/* PAYWALL OVERLAY WHEN LOCKED */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-white/75 backdrop-blur-md border border-slate-200/80 transition-all duration-300">
            <div className="max-w-md mx-auto p-6 sm:p-8 bg-white/95 rounded-3xl border border-brand-200 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Lock className="w-7 h-7 text-brand-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
                🔒 Premium Kit Locked
              </span>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Unlock Full Kit + 10-Day Pro Pass
              </h4>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Unlock Full Kit + 10-Day Pro Pass (10 Tailored Resumes/Day) — ₹49 One-Time. Includes all 6 STAR interview answers and multi-page printable PDF export.
              </p>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-5 text-left text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full ATS-formatted rewritten resume text</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All 6 behavioral & technical STAR answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>10-Day Pro Pass (10 tailored resumes / day)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-page printable PDF Career Kit export</span>
                </div>
              </div>

              <button
                onClick={onOpenPaywall}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-700 hover:to-indigo-800 transition shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Unlock Full Kit + 10-Day Pro Pass (₹49)</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>One-time unlock • Instant test mode simulation available</span>
              </div>
            </div>
          </div>
        )}

        {/* RESUME PREVIEW (Blurred if locked) */}
        <div
          className={`transition-all duration-300 ${
            !isUnlocked ? "filter blur-[6px] select-none pointer-events-none" : "unlocked-content"
          }`}
        >
          <div className="bg-white p-6 sm:p-10 border border-slate-200 rounded-2xl shadow-xs text-slate-800 max-w-4xl mx-auto font-sans text-xs sm:text-sm leading-relaxed">
            {/* Resume Header */}
            <div className="border-b-2 border-brand-900 pb-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
                {r.fullName || "CANDIDATE NAME"}
              </h2>
              <div className="text-sm sm:text-base font-bold text-brand-600 mt-1">
                {r.targetTitle || "Professional Specialist"}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {r.contact || "contact@email.com | +91 98765 43210 | Portfolio"}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                {r.summary}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 border-b border-slate-200 pb-1 mb-2">
                Core Competencies & ATS Keywords
              </h3>
              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <strong>Key Technical Skills:</strong> {r.skills?.technical}
                </div>
                <div>
                  <strong>Methodologies & Execution:</strong> {r.skills?.methodologies}
                </div>
                <div>
                  <strong>Leadership & Collaboration:</strong> {r.skills?.leadership}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 border-b border-slate-200 pb-1 mb-3">
                Professional Experience
              </h3>
              <div className="space-y-4">
                {(r.experience || []).map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-slate-900">
                        {exp.role} — <span className="text-brand-600">{exp.company}</span>
                      </span>
                      <span className="text-slate-500 font-medium text-xs">{exp.period}</span>
                    </div>
                    <ul className="mt-2 list-disc list-inside space-y-1.5 text-xs text-slate-700">
                      {(exp.bullets || []).map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed pl-1">
                          <span className="ml-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 border-b border-slate-200 pb-1 mb-2">
                Education & Credentials
              </h3>
              <div className="text-xs text-slate-700">{r.education}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
