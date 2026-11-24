"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ScoreCard from "@/components/ScoreCard";
import InterviewQuestions from "@/components/InterviewQuestions";
import TailoredResume from "@/components/TailoredResume";
import PricingDrawer from "@/components/PricingDrawer";
import PaymentModal from "@/components/PaymentModal";
import ShareBar from "@/components/ShareBar";
import SeoFaqSection from "@/components/SeoFaqSection";
import GoogleAd from "@/components/GoogleAd";
import Link from "next/link";
import { KitData, GenerateResponse, ProPassData } from "@/lib/types";
import {
  computeInputHash,
  getCachedKit,
  saveCachedKit,
  validateInputQuality,
  getActiveProPass,
  activateProPass,
  incrementProUsage,
  formatExpiryDate,
  getFreeUsageCount,
  incrementFreeUsage,
  resetFreeUsage,
  FREE_LIMIT,
} from "@/lib/cacheUtils";
import { AlertCircle, Sparkles } from "lucide-react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [kitData, setKitData] = useState<KitData | null>(null);
  const [proPass, setProPass] = useState<ProPassData | null>(null);
  const [freeUsageCount, setFreeUsageCount] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Restore 10-Day Pro Pass and Session from localStorage on mount (0 tokens)
  useEffect(() => {
    try {
      // 0. Check Free usage count
      setFreeUsageCount(getFreeUsageCount());

      // 1. Check active Pro Pass
      const activePass = getActiveProPass();
      if (activePass) {
        setProPass(activePass);
        setIsUnlocked(true);
      } else if (localStorage.getItem("readyresume_unlocked") === "true") {
        setIsUnlocked(true);
      }

      // 2. Check saved session
      const savedSession = localStorage.getItem("readyresume_last_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.resume) setResume(parsed.resume);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
        if (parsed.kitData) {
          setKitData(parsed.kitData);
          setCacheNotice("Session restored from local storage (0 tokens used).");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // When input changes, clear outdated analysis below so user always sees fresh data
  const handleResumeChange = (val: string) => {
    setResume(val);
    if (kitData) {
      setKitData(null);
      setCacheNotice(null);
    }
  };

  const handleJobChange = (val: string) => {
    setJobDescription(val);
    if (kitData) {
      setKitData(null);
      setCacheNotice(null);
    }
  };

  const handleClearAll = () => {
    setResume("");
    setJobDescription("");
    setKitData(null);
    setError(null);
    setCacheNotice(null);
    try {
      localStorage.removeItem("readyresume_last_session");
    } catch {}
  };

  const handleGenerate = async () => {
    setError(null);
    setCacheNotice(null);

    // 0. Strict 3-Free-Try Cap Enforcement: If non-paying visitor has used 3 tries, halt & prompt payment
    if (!isUnlocked && !proPass) {
      const currentFreeUsed = getFreeUsageCount();
      if (currentFreeUsed >= FREE_LIMIT) {
        setError(
          "⚠️ Aapne aaj ke apne 3 Free Resume Previews use kar liye hain! Naya resume tailor karne ke liye pehle ₹49 ka 10-Day Pro Pass unlock kariye."
        );
        setIsPaywallOpen(true);
        return;
      }
    }

    // 1. Enforce Daily 10/day Pro Pass Cap if active
    if (proPass) {
      const todayKey = new Date().toISOString().slice(0, 10);
      const todayCount = proPass.dailyUsage?.date === todayKey ? proPass.dailyUsage.count : 0;
      if (todayCount >= 10) {
        const elapsedMs = Math.max(0, Date.now() - proPass.activatedAt);
        const dayNumber = Math.min(10, Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1);
        setError(
          `You've used all 10 Pro generations for today! Your daily limit resets tomorrow (Day ${dayNumber} of 10).`
        );
        return;
      }
    }

    // 2. Frontend Quality & Anti-Gibberish Validation (Min 15 words)
    const quality = validateInputQuality(resume, jobDescription);
    if (!quality.isValid) {
      setError(quality.error || "Please provide valid inputs.");
      return;
    }

    // 3. Client-Side Hash Caching: 0-Token Instant Hit
    const inputHash = await computeInputHash(resume, jobDescription);
    const cachedKit = getCachedKit(inputHash);

    if (cachedKit) {
      // Consume 1 of 3 free previews for non-paying users
      if (!isUnlocked && !proPass) {
        const updatedCount = incrementFreeUsage();
        setFreeUsageCount(updatedCount);
      }

      setKitData(cachedKit);
      setCacheNotice("Exact match found in cache: Loaded instantly with 0 API tokens consumed!");
      try {
        localStorage.setItem(
          "readyresume_last_session",
          JSON.stringify({ resume, jobDescription, kitData: cachedKit })
        );
      } catch {}

      setTimeout(() => {
        const resultsEl = document.getElementById("resultsArea");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
      return;
    }

    // 4. Invoke server API with x-pro-utr header if Pro user
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (proPass?.utr) {
        headers["x-pro-utr"] = proPass.utr;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          resume: resume.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      const result: GenerateResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || `Server returned error (${response.status})`);
      }

      setKitData(result.data);

      // Consume 1 of 3 free previews for non-paying users
      if (!isUnlocked && !proPass) {
        const updatedCount = incrementFreeUsage();
        setFreeUsageCount(updatedCount);
      }

      // Increment Pro Pass daily usage if active
      if (proPass) {
        const updatedPass = incrementProUsage();
        if (updatedPass) {
          setProPass({ ...updatedPass });
        }
      }

      // Save to client-side hash cache & active session
      saveCachedKit(inputHash, result.data);
      try {
        localStorage.setItem(
          "readyresume_last_session",
          JSON.stringify({ resume, jobDescription, kitData: result.data })
        );
      } catch {}

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById("resultsArea");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: unknown) {
      const e = err as Error;
      console.error("Kit Generation Error:", e);
      setError(e.message || "Failed to generate kit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToResume = () => {
    const resumeEl = document.getElementById("resumeSection");
    if (resumeEl) {
      resumeEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConfirmUnlock = (utr: string) => {
    const newPass = activateProPass(utr);
    setProPass(newPass);
    setIsUnlocked(true);
    setIsPaywallOpen(false);
  };

  const handleResetDemo = () => {
    if (confirm("Reset current session and clear cached form data?")) {
      setKitData(null);
      setIsUnlocked(false);
      setProPass(null);
      setResume("");
      setJobDescription("");
      setError(null);
      setCacheNotice(null);
      resetFreeUsage();
      setFreeUsageCount(0);
      try {
        localStorage.removeItem("readyresume_last_session");
        localStorage.removeItem("readyresume_unlocked");
        localStorage.removeItem("readyresume_pro_pass");
        localStorage.removeItem("readyresume_free_usage_count");
      } catch {}
    }
  };

  const remainingToday = proPass
    ? Math.max(0, 10 - (proPass.dailyUsage?.count || 0))
    : 0;

  return (
    <>
      <Header
        isUnlocked={isUnlocked}
        proPass={proPass}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Pro Daily Cap Warning Banner */}
        {proPass && remainingToday === 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3 animate-fade-in text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Daily Limit Reached:</strong> You&apos;ve used all 10 Pro generations for today!
                Your daily quota resets tomorrow.
              </span>
            </div>
            <span className="font-semibold text-amber-800 shrink-0 text-xs">
              Expires on {formatExpiryDate(proPass.expiresAt)}
            </span>
          </div>
        )}

        {/* INPUT STAGE */}
        <InputSection
          resume={resume}
          setResume={handleResumeChange}
          jobDescription={jobDescription}
          setJobDescription={handleJobChange}
          onClear={handleClearAll}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          cacheNotice={cacheNotice}
          freeTriesRemaining={Math.max(0, FREE_LIMIT - freeUsageCount)}
          isUnlocked={isUnlocked || !!proPass}
          onOpenPaywall={() => setIsPaywallOpen(true)}
        />

        {/* Responsive Google AdSense Banner Slot */}
        <GoogleAd adSlot="3948201948" className="max-w-4xl mx-auto my-6" />

        {/* RESULTS STAGE (Rendered once generated) */}
        {kitData && (
          <div id="resultsArea" className="space-y-10 animate-fade-in">
            {/* ATS Score & Missing Keywords (Free Immediate Value) */}
            <ScoreCard
              data={kitData}
              onScrollToResume={handleScrollToResume}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              isUnlocked={isUnlocked}
            />

            {/* 6 Tailored Interview Questions (Q1 & Q2 Free, Q3-Q6 Locked behind ₹49) */}
            <InterviewQuestions
              questions={kitData.interviewQuestions}
              isUnlocked={isUnlocked}
              onOpenPaywall={() => setIsPaywallOpen(true)}
            />

            {/* Tailored ATS Resume (Locked behind ₹49 with blurred overlay) */}
            <TailoredResume
              data={kitData}
              isUnlocked={isUnlocked}
              onOpenPaywall={() => setIsPaywallOpen(true)}
            />

            {/* Multi-Platform Share Bar (Post-Analysis & Post-Unlock) */}
            <ShareBar />
          </div>
        )}

        {/* SEO Educational Knowledge Base & FAQ Section for Google Ranking */}
        <SeoFaqSection />

        {/* Bottom Responsive Google AdSense Banner Slot */}
        <GoogleAd adSlot="7892145321" className="max-w-4xl mx-auto mt-8" />
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Subtle Compact Share Bar in Footer */}
          <div className="py-2 border-b border-slate-100">
            <ShareBar compact={true} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/icon.svg"
                alt="MakeYourResume Logo"
                width={24}
                height={24}
                className="w-6 h-6 rounded-md shadow-xs object-contain"
              />
              <span className="font-bold text-slate-800">MakeYourResume</span>
              <span>• Self-Service ATS Career Kit & 10-Day Pro Pass</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 flex-wrap justify-center">
              <Link href="/tutorial" className="text-brand-600 hover:text-brand-800 font-semibold transition underline underline-offset-2">
                Tutorial Guide
              </Link>
              <span>•</span>
              <Link href="/privacy" className="text-slate-600 hover:text-brand-600 transition underline underline-offset-2">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="text-slate-600 hover:text-brand-600 transition underline underline-offset-2">
                Terms of Service
              </Link>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsPricingOpen(true)}
                className="text-brand-600 hover:underline font-semibold cursor-pointer"
              >
                Compare Plans
              </button>
              <span>•</span>
              <button onClick={handleResetDemo} className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer">
                Reset Session
              </button>
            </div>
          </div>

          {/* Privacy & Trust Assurance Notice */}
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-50 flex items-center justify-center gap-1.5 flex-wrap">
            <span>🔒 Privacy First: Your resume data is processed securely and never stored on our servers</span>
            <span>•</span>
            <span>Instant ₹49 UPI Unlock</span>
            <span>•</span>
            <span>No Auto-Renewal</span>
          </div>
        </div>
      </footer>

      {/* LEFT-SIDEBAR PLAN COMPARISON DRAWER */}
      <PricingDrawer
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onOpenPaywall={() => {
          setIsPricingOpen(false);
          setIsPaywallOpen(true);
        }}
        isUnlocked={isUnlocked}
      />

      {/* ₹49 PAYWALL MODAL */}
      <PaymentModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onConfirmUnlock={handleConfirmUnlock}
      />
    </>
  );
}
