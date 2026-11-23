"use client";

import React, { useEffect } from "react";
import {
  X,
  Check,
  X as XIcon,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface PricingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaywall: () => void;
  isUnlocked?: boolean;
}

export default function PricingDrawer({
  isOpen,
  onClose,
  onOpenPaywall,
  isUnlocked = false,
}: PricingDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleUpgradeClick = () => {
    onClose();
    onOpenPaywall();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Dark Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Right Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 w-full max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-brand-50/30 to-indigo-50/30 flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 text-brand-800 mb-1">
              <Sparkles className="w-3 h-3 text-brand-600" />
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Compare Plans
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Free preview vs. 10-day unlimited interview kit
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-6 text-slate-800">
          {/* ========================================================= */}
          {/* 1. FREE PREVIEW CARD (₹0) */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between transition">
            <div>
              <div className="flex items-start justify-between pb-3.5 border-b border-slate-200">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 mb-1">
                    Free Tier
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Free Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Instant ATS benchmark &amp; keyword gaps
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">₹0</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Free Forever</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="mt-4 space-y-2.5 text-xs">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-slate-700">
                    <strong>Instant ATS Match Score</strong> (0–100%)
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-slate-700">
                    <strong>Top 5 Missing Job Keywords</strong>
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-slate-700">
                    <strong>First 2 Tailored Interview Q&amp;As</strong>
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-slate-700">
                    <strong>3 Free Previews per Hour</strong>
                  </span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <XIcon className="w-3 h-3" />
                  </div>
                  <span>Full AI-Rewritten ATS Resume (Locked)</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <XIcon className="w-3 h-3" />
                  </div>
                  <span>Complete 6-Question Interview Kit (Locked)</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <XIcon className="w-3 h-3" />
                  </div>
                  <span>Clean Printable PDF Download (Locked)</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 text-center">
              <span className="text-[11px] font-medium text-slate-500">
                Active on your browser • No sign-up needed
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. 10-DAY PRO PASS CARD (₹49 ONE-TIME) */}
          {/* ========================================================= */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-gradient-to-b from-brand-50/70 via-white to-indigo-50/40 p-5 shadow-lg shadow-brand-500/10 flex flex-col justify-between">
            {/* Top Badge */}
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm uppercase tracking-wider">
                🔥 MOST POPULAR • NO AUTO-RENEWAL
              </span>
            </div>

            <div>
              <div className="flex items-start justify-between pb-3.5 border-b border-brand-200">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-100 text-brand-800 mb-1">
                    10-Day Pro Pass
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Full Interview-Ready Kit
                  </h3>
                  <p className="text-[11px] text-brand-800 font-medium">
                    Tailored resume, 6 Q&amp;As, PDF export &amp; 10/day
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl sm:text-3xl font-black text-brand-700">₹49</span>
                    <span className="text-xs text-slate-400 line-through">₹499</span>
                  </div>
                  <span className="block text-[10px] text-emerald-700 font-bold">One-Time UPI</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="mt-4 space-y-2.5 text-xs">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-800">
                    <strong>Everything in Free Preview</strong> (Score &amp; Gaps)
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-900 font-medium">
                    <strong>Full AI-Rewritten ATS Resume</strong> tailored for every job
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-900 font-medium">
                    <strong>All 6 Role-Specific &amp; Behavioral Q&amp;As</strong> with STAR answers
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-900 font-medium">
                    <strong>Unlimited Clean PDF Downloads &amp; 1-Click Copy</strong>
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                  </div>
                  <span className="text-brand-950 font-bold bg-brand-100/60 px-1 rounded">
                    10 Tailored Resumes Per Day for 10 Full Days (Up to 100 kits!)
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-800">
                    <strong>Zero Subscriptions</strong> — Pay ₹49 once via UPI, never charged again
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-200">
              {isUnlocked ? (
                <div className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>✅ Active on Your Device (10 Resumes/Day)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  className="w-full py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-700 hover:to-indigo-800 active:scale-[0.99] transition shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <span>Get 10-Day Pro Pass for ₹49</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <p className="text-center text-[10px] text-brand-800 mt-2 font-medium">
                Instant UPI QR activation via GPay, PhonePe, Paytm, or BHIM
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer Reassurance */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 shrink-0">
          <span>🔒 Privacy First • No Card Required • Instant ₹49 UPI Unlock</span>
        </div>
      </aside>
    </div>
  );
}