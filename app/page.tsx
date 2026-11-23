"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ScoreCard from "@/components/ScoreCard";
import InterviewQuestions from "@/components/InterviewQuestions";
import TailoredResume from "@/components/TailoredResume";
import PricingComparison from "@/components/PricingComparison";
import PaymentModal from "@/components/PaymentModal";
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
} from "@/lib/cacheUtils";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [kitData, setKitData] = useState<KitData | null>(null);
  const [proPass, setProPass] = useState<ProPassData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Restore 10-Day Pro Pass and Session from localStorage on mount (0 tokens)
  useEffect(() => {
    try {
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

  const handleGenerate = async () => {
    setError(null);
    setCacheNotice(null);

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
      try {
        localStorage.removeItem("readyresume_last_session");
        localStorage.removeItem("readyresume_unlocked");
        localStorage.removeItem("readyresume_pro_pass");
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
          setResume={setResume}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          cacheNotice={cacheNotice}
        />

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

            {/* Free vs. ₹49 Pro Pass Comparison Table */}
            <PricingComparison
              onOpenPaywall={() => setIsPaywallOpen(true)}
              isUnlocked={isUnlocked}
            />

            {/* Tailored ATS Resume (Locked behind ₹49 with blurred overlay) */}
            <TailoredResume
              data={kitData}
              isUnlocked={isUnlocked}
              onOpenPaywall={() => setIsPaywallOpen(true)}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
              R
            </div>
            <span className="font-bold text-slate-800">ReadyResume</span>
            <span>• Self-Service ATS Career Kit & 10-Day Pro Pass</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Server-side Llama AI</span>
            <span>•</span>
            <span>Zero Visitor Keys Required</span>
            <span>•</span>
            <button onClick={handleResetDemo} className="text-brand-600 hover:underline cursor-pointer">
              Reset Session
            </button>
          </div>
        </div>
      </footer>

      {/* ₹49 PAYWALL MODAL */}
      <PaymentModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onConfirmUnlock={handleConfirmUnlock}
      />
    </>
  );
}
