"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ScoreCard from "@/components/ScoreCard";
import InterviewQuestions from "@/components/InterviewQuestions";
import TailoredResume from "@/components/TailoredResume";
import PaymentModal from "@/components/PaymentModal";
import { KitData, GenerateResponse } from "@/lib/types";
import { computeInputHash, getCachedKit, saveCachedKit, validateInputQuality } from "@/lib/cacheUtils";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [kitData, setKitData] = useState<KitData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Restore session from localStorage on mount (0 tokens on refresh)
  useEffect(() => {
    try {
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
      if (localStorage.getItem("readyresume_unlocked") === "true") {
        setIsUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleGenerate = async () => {
    setError(null);
    setCacheNotice(null);

    // 1. Frontend Quality & Anti-Gibberish Validation (Min 15 words)
    const quality = validateInputQuality(resume, jobDescription);
    if (!quality.isValid) {
      setError(quality.error || "Please provide valid inputs.");
      return;
    }

    // 2. Client-Side Hash Caching: 0-Token Instant Hit
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

    // 3. If cache miss, invoke server API
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handleConfirmUnlock = () => {
    setIsUnlocked(true);
    setIsPaywallOpen(false);
    try {
      localStorage.setItem("readyresume_unlocked", "true");
    } catch {}
  };

  const handleResetDemo = () => {
    if (confirm("Reset current session and clear cached form data?")) {
      setKitData(null);
      setIsUnlocked(false);
      setResume("");
      setJobDescription("");
      setError(null);
      setCacheNotice(null);
      try {
        localStorage.removeItem("readyresume_last_session");
        localStorage.removeItem("readyresume_unlocked");
      } catch {}
    }
  };

  return (
    <>
      <Header
        isUnlocked={isUnlocked}
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
            <span>• Self-Service ATS Career Kit</span>
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
