"use client";

import React from "react";
import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ProPassData } from "@/lib/types";
import { formatExpiryDate } from "@/lib/cacheUtils";

interface HeaderProps {
  isUnlocked: boolean;
  proPass: ProPassData | null;
  onOpenPaywall: () => void;
  onOpenPricing?: () => void;
}

export default function Header({
  isUnlocked,
  proPass,
  onOpenPaywall,
  onOpenPricing,
}: HeaderProps) {
  const remainingToday = proPass
    ? Math.max(0, 10 - (proPass.dailyUsage?.count || 0))
    : 0;

  return (
    <>
      {/* Top Banner — Dynamic Pro Status vs Free Banner */}
      {proPass ? (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-white text-xs sm:text-sm py-2 px-4 text-center border-b border-emerald-700/50 flex flex-wrap items-center justify-center gap-2 animate-fade-in">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> 10-Day Pro Pass Active
          </span>
          <span className="font-semibold text-emerald-200">
            • {remainingToday}/10 generations left today
          </span>
          <span className="text-emerald-300/80">
            • Expires on {formatExpiryDate(proPass.expiresAt)}
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white text-xs sm:text-sm py-2 px-4 text-center border-b border-brand-700/50 flex items-center justify-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ⚡ Powered by Llama 3.3 AI
          </span>
          <span>Instant ATS keyword optimization & 10-Day Pro Pass available!</span>
        </div>
      )}

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Ready<span className="text-brand-600">Resume</span>
              </span>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none">
                ATS Resume & Interview Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenPricing && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-brand-700 transition px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer shadow-2xs"
                title="View Free vs 10-Day Pro Pass comparison"
              >
                <span>Compare Plans</span>
              </button>
            )}

            {proPass || isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>
                  {proPass
                    ? `10-Day Pro Pass (${remainingToday}/10 today)`
                    : "Pro Kit Unlocked"}
                </span>
              </span>
            ) : (
              <button
                onClick={onOpenPaywall}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlock 10-Day Pro Pass (₹49)</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
