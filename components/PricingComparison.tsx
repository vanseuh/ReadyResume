"use client";

import React from "react";
import { Check, X as XIcon, Zap, ShieldCheck, Sparkles, ArrowRight, ArrowUp } from "lucide-react";

interface PricingComparisonProps {
  onOpenPaywall?: () => void;
  isUnlocked?: boolean;
}

export default function PricingComparison({
  onOpenPaywall,
  isUnlocked = false,
}: PricingComparisonProps) {
  const handleScrollToInput = () => {
    const el = document.getElementById("inputSection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricingSection" className="mb-14 scroll-mt-20">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Simple, Transparent Pricing • No Subscriptions</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Simple, Transparent Pricing —{" "}
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
            No Subscriptions
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Test your ATS score completely free. Unlock unlimited custom resumes and complete interview answers for a single ₹49 UPI payment.
        </p>
      </div>

      {/* 2-CARD SIDE-BY-SIDE COMPARISON WINDOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
        {/* ========================================================= */}
        {/* LEFT CARD: FREE PREVIEW (₹0) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mb-1.5">
                  Starter Tier
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Free Preview — Test Your Score
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instant benchmark against recruiter screening filters
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">₹0</span>
                <span className="block text-[11px] text-slate-400 font-medium">Free Forever</span>
              </div>
            </div>

            {/* Feature List */}
            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700">
                  <strong>Instant ATS Match Score</strong> (0–100%)
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700">
                  <strong>Top 5 Missing Job Keywords</strong> gap breakdown
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700">
                  <strong>First 2 Tailored Interview Q&amp;As</strong> with STAR answers
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700">
                  <strong>3 Free Previews per Hour</strong> (Instant evaluation)
                </span>
              </li>

              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                  <XIcon className="w-3.5 h-3.5" />
                </div>
                <span>Full AI-Rewritten ATS Resume (Locked)</span>
              </li>

              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                  <XIcon className="w-3.5 h-3.5" />
                </div>
                <span>Complete 6-Question Interview Kit (Locked)</span>
              </li>

              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                  <XIcon className="w-3.5 h-3.5" />
                </div>
                <span>Clean Printable PDF Download (Locked)</span>
              </li>
            </ul>
          </div>

          {/* CTA Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleScrollToInput}
              className="w-full py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 text-slate-500" />
              <span>Use Free Preview Above</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
              No credit card, no sign-up, no hidden strings
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: 10-DAY PRO PASS (₹49 ONE-TIME) */}
        {/* ========================================================= */}
        <div className="relative bg-gradient-to-b from-brand-50/80 via-white to-indigo-50/40 rounded-3xl border-2 border-brand-500 p-6 sm:p-8 shadow-xl shadow-brand-500/10 flex flex-col justify-between">
          {/* Top Badge */}
          <div className="absolute -top-3.5 right-6">
            <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md uppercase tracking-wider">
              🔥 MOST POPULAR • NO AUTO-RENEWAL
            </span>
          </div>

          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-brand-200/80 gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-100 text-brand-800 mb-1.5">
                  10-Day Pro Pass
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Full Interview-Ready Kit
                </h3>
                <p className="text-xs text-brand-800/80 mt-0.5 font-medium">
                  Everything you need to apply &amp; clear recruiter rounds
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-3xl sm:text-4xl font-black text-brand-700">₹49</span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through">₹499</span>
                </div>
                <span className="block text-[11px] text-emerald-700 font-bold">One-Time UPI Payment</span>
              </div>
            </div>

            {/* Feature List */}
            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-800">
                  <strong>Everything in Free Preview</strong> (Score &amp; Keyword Gap breakdown)
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-900">
                  <strong>Full AI-Rewritten ATS Resume</strong> tailored specifically for every job
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-900">
                  <strong>All 6 Role-Specific &amp; Behavioral Interview Q&amp;As</strong> with full STAR responses
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-900">
                  <strong>Unlimited Clean PDF Downloads &amp; 1-Click Copy</strong> for instant submissions
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                </div>
                <span className="text-brand-950 font-bold bg-brand-100/50 px-1 rounded">
                  10 Tailored Resumes Per Day for 10 Full Days (Up to 100 kits!)
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-800">
                  <strong>Zero Subscriptions</strong> — Pay ₹49 once via UPI, never charged again
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Footer */}
          <div className="mt-8 pt-5 border-t border-brand-200/80">
            {isUnlocked ? (
              <div className="py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>✅ Active on Your Device (10 Generations / Day)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full py-3.5 px-5 rounded-xl font-extrabold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-700 hover:to-indigo-800 active:scale-[0.99] transition shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <span>Get 10-Day Pro Pass for ₹49</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <p className="text-center text-[11px] text-brand-800/80 mt-2 font-medium">
              Instant activation via GPay, PhonePe, Paytm, or BHIM UPI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}