"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ScoreCard from "@/components/ScoreCard";
import InterviewQuestions from "@/components/InterviewQuestions";
import TailoredResume from "@/components/TailoredResume";
import PaymentModal from "@/components/PaymentModal";
import { KitData, GenerateResponse } from "@/lib/types";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kitData, setKitData] = useState<KitData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const handleGenerate = async () => {
    if (resume.trim().length < 50 || jobDescription.trim().length < 50) {
      setError("Please ensure both your Current Resume and Target Job Description have at least 50 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

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
  };

  const handleResetDemo = () => {
    if (confirm("Reset demo session?")) {
      setKitData(null);
      setIsUnlocked(false);
      setResume("");
      setJobDescription("");
      setError(null);
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

            {/* 8 Tailored Interview Questions (Q1 & Q2 Free, Q3-Q8 Locked behind ₹49) */}
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
            <span>Server-side Llama 3.3 AI</span>
            <span>•</span>
            <span>Zero Visitor Keys Required</span>
            <span>•</span>
            <button onClick={handleResetDemo} className="text-brand-600 hover:underline">
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
