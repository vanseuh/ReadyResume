"use client";

import React from "react";
import { Check, Lock, Sparkles, Zap, ShieldCheck } from "lucide-react";

interface PricingComparisonProps {
  variant?: "full" | "condensed";
  onOpenPaywall?: () => void;
  isUnlocked?: boolean;
}

export default function PricingComparison({
  variant = "full",
  onOpenPaywall,
  isUnlocked = false,
}: PricingComparisonProps) {
  const comparisonRows = [
    {
      feature: "ATS Match Score & Missing Keywords",
      free: "Included (Instant breakdown)",
      freeIncluded: true,
      pro: "Included (Instant breakdown)",
      proIncluded: true,
    },
    {
      feature: "Tailored Interview Q&As",
      free: "First 2 questions only",
      freeIncluded: true,
      freeNote: "Q1 & Q2 free",
      pro: "All 6 role-specific & behavioral Q&As",
      proIncluded: true,
    },
    {
      feature: "AI-Rewritten ATS Resume",
      free: "Locked / Blurred",
      freeIncluded: false,
      pro: "Full custom resume for every job",
      proIncluded: true,
    },
    {
      feature: "Clean Printable PDF Download",
      free: "Locked",
      freeIncluded: false,
      pro: "Unlimited instant multi-page PDF exports",
      proIncluded: true,
    },
    {
      feature: "Daily Generation Limit",
      free: "3 tries / hour",
      freeIncluded: true,
      freeNote: "Rate limited",
      pro: "10 tailored resumes/day for 10 full days",
      proIncluded: true,
      proHighlight: true,
    },
    {
      feature: "Subscription / Hidden Fees",
      free: "None (100% Free preview)",
      freeIncluded: true,
      pro: "One-time ₹49 UPI payment (No recurring fees)",
      proIncluded: true,
      proHighlight: true,
    },
  ];

  if (variant === "condensed") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden text-xs">
        <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between font-bold text-slate-800">
          <span>What Unlocks with Pro Pass:</span>
          <span className="text-brand-600 font-extrabold">₹49 One-Time</span>
        </div>
        <div className="p-3 space-y-2 text-slate-700">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>All 6 STAR Interview Q&amp;As</strong> (unlocks remaining 4 behavioral &amp; technical answers)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Full Rewritten ATS Resume</strong> optimized with target keywords &amp; metrics
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Clean Printable Multi-Page PDF Kit</strong> for recruiters &amp; print
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>10 Tailored Resumes/Day for 10 Days</strong> (100 total generations allowed)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Subscriptions:</strong> One-time UPI payment directly to bank account
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-5 sm:p-8 overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Transparent Pricing • No Hidden Costs</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Free Preview vs. 10-Day Pro Pass
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Start for free to test your ATS match score, then unlock the full kit &amp; 10 daily tailored resumes whenever you&apos;re ready.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* COLUMN 1: FREE PREVIEW */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tier 1
                </span>
                <h4 className="text-lg font-bold text-slate-900">Free Preview</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">₹0</span>
                <span className="block text-[10px] text-slate-400 font-medium">Free Forever</span>
              </div>
            </div>

            <ul className="mt-4 space-y-3.5 text-xs">
              {comparisonRows.map((row, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  {row.freeIncluded ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-800">{row.feature}: </span>
                    <span className={row.freeIncluded ? "text-slate-600" : "text-slate-400 italic"}>
                      {row.free}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <span className="text-xs font-medium text-slate-500">
              Current active view (ATS score &amp; 2 free STAR Q&amp;As)
            </span>
          </div>
        </div>

        {/* COLUMN 2: 10-DAY PRO PASS (HIGHLIGHTED) */}
        <div className="rounded-2xl border-2 border-brand-500 bg-gradient-to-b from-brand-50/60 via-white to-indigo-50/30 p-5 sm:p-6 relative shadow-md shadow-brand-500/10 flex flex-col justify-between">
          {/* Badge */}
          <div className="absolute -top-3 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-600 text-white shadow-sm uppercase tracking-wide">
              ⚡ Most Popular • No Auto-Renewal
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-brand-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Full Access
                </span>
                <h4 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                  10-Day Pro Pass
                </h4>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-2xl font-black text-brand-700">₹49</span>
                  <span className="text-xs text-slate-400 line-through">₹499</span>
                </div>
                <span className="block text-[10px] text-emerald-700 font-bold">One-Time Payment</span>
              </div>
            </div>

            <ul className="mt-4 space-y-3.5 text-xs">
              {comparisonRows.map((row, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{row.feature}: </span>
                    <span className={row.proHighlight ? "text-brand-900 font-bold" : "text-slate-700 font-medium"}>
                      {row.pro}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-200">
            {isUnlocked ? (
              <div className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>10-Day Pro Pass Unlocked</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-[0.99] transition shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Unlock Full Kit + 10-Day Pro Pass (₹49)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
