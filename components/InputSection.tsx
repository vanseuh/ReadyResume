"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Clipboard,
  Info,
  Target,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Check,
  Zap,
  X,
  BookOpen,
} from "lucide-react";
import { SAMPLE_TEMPLATES } from "@/lib/sampleTemplates";

interface InputSectionProps {
  resume: string;
  setResume: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  cacheNotice?: string | null;
}

export const MAX_RESUME_CHARS = 8000;
export const MAX_JOB_CHARS = 5000;
export const MIN_CHARS = 50;
export const MIN_WORDS = 15;

export default function InputSection({
  resume,
  setResume,
  jobDescription,
  setJobDescription,
  onGenerate,
  isLoading,
  error,
  cacheNotice,
}: InputSectionProps) {
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedJob, setCopiedJob] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [sampleTip, setSampleTip] = useState<{ id: string; label: string } | null>(null);

  const rLen = resume.trim().length;
  const jLen = jobDescription.trim().length;

  const rWords = resume.trim().split(/\s+/).filter(w => w.length > 0).length;
  const jWords = jobDescription.trim().split(/\s+/).filter(w => w.length > 0).length;

  const isResumeLengthValid = rLen >= MIN_CHARS && rLen <= MAX_RESUME_CHARS;
  const isJobLengthValid = jLen >= MIN_CHARS && jLen <= MAX_JOB_CHARS;
  const isWordsValid = rWords >= MIN_WORDS && jWords >= MIN_WORDS;

  const isFormValid = isResumeLengthValid && isJobLengthValid && isWordsValid && !isLoading;

  const handlePasteResume = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setResume(text);
      setActiveSampleId(null);
      setSampleTip(null);
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 1500);
    } catch {
      // ignore clipboard error
    }
  };

  const handlePasteJob = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
      setActiveSampleId(null);
      setSampleTip(null);
      setCopiedJob(true);
      setTimeout(() => setCopiedJob(false), 1500);
    } catch {
      // ignore clipboard error
    }
  };

  const handleLoadSample = (key: string) => {
    const tmpl = SAMPLE_TEMPLATES[key];
    if (!tmpl) return;
    setResume(tmpl.resume);
    setJobDescription(tmpl.jobDescription);
    setActiveSampleId(key);
    setSampleTip({ id: key, label: tmpl.label });
  };

  const handleClear = () => {
    setResume("");
    setJobDescription("");
    setActiveSampleId(null);
    setSampleTip(null);
  };

  return (
    <section id="inputSection" className="mb-12">
      {/* HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Zero Configuration • Instant AI Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Turn Any Job Description Into an <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
            Interview-Ready Resume
          </span>{" "}
          in 30 Seconds.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Check your ATS match score for free. Unlock your rewritten resume and 6 tailored interview
          Q&As for a one-time ₹49 payment—no subscriptions, no signup.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-8 transition-all">
        {/* 1. TRY A SAMPLE RESUME & JOB BAR */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-50/30 to-indigo-50/30 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
              <BookOpen className="w-4 h-4 text-brand-600" />
              Don&apos;t have a resume handy? Try a sample:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.values(SAMPLE_TEMPLATES).map((tmpl) => {
                const isActive = activeSampleId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleLoadSample(tmpl.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-2xs border cursor-pointer ${
                      isActive
                        ? "bg-brand-600 text-white border-brand-600 shadow-brand-500/20 ring-2 ring-brand-300"
                        : "bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:text-brand-600"
                    }`}
                  >
                    {tmpl.pill}
                  </button>
                );
              })}
            </div>
          </div>

          {(resume || jobDescription) && (
            <button
              type="button"
              onClick={handleClear}
              className="self-end sm:self-auto px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer flex items-center gap-1 shrink-0 bg-white"
              title="Clear both boxes"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* 2. BLUE TIP BANNER WHEN SAMPLE LOADED */}
        {sampleTip && (
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 animate-fade-in flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>{sampleTip.label}</strong> sample loaded! Edit the details with your own name &amp; experience, or click <strong>&quot;Make My Resume Ready&quot;</strong> to test it.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSampleTip(null)}
              className="text-blue-500 hover:text-blue-800 p-1 cursor-pointer shrink-0"
              aria-label="Dismiss tip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Cache Hit Notification */}
        {cacheNotice && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-fade-in flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
              {cacheNotice}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-800 font-bold text-[10px]">
              0 TOKENS USED
            </span>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 animate-fade-in flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">Analysis Error</h4>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed font-mono whitespace-pre-wrap">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* RESUME INPUT */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="resumeInput" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Paste Your Current Resume
              </label>
              <div className="flex items-center gap-2 text-xs">
                {rLen > MAX_RESUME_CHARS ? (
                  <span className="text-[11px] text-rose-600 font-bold">
                    Exceeds 8,000 char cap ({rLen}/8,000)
                  </span>
                ) : rLen >= MIN_CHARS ? (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {rLen.toLocaleString()} / 8,000 chars
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {rLen} / {MIN_CHARS} chars min
                  </span>
                )}
              </div>
            </div>

            <div className="relative flex-grow">
              <textarea
                id="resumeInput"
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  setActiveSampleId(null);
                  setSampleTip(null);
                }}
                maxLength={MAX_RESUME_CHARS + 500}
                rows={12}
                disabled={isLoading}
                className={`w-full h-72 sm:h-80 p-4 text-xs sm:text-sm text-slate-800 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-2 transition resize-none placeholder:text-slate-400 font-mono leading-relaxed ${
                  rLen > MAX_RESUME_CHARS
                    ? "border-rose-400 focus:ring-rose-400"
                    : "border-slate-200 focus:ring-brand-500 focus:border-brand-500"
                }`}
                placeholder="Paste your current resume content here (summary, work experience, bullet points, skills, education)..."
              />
              <button
                type="button"
                onClick={handlePasteResume}
                className="absolute right-3 bottom-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-400 transition shadow-xs backdrop-blur-xs cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{copiedResume ? "Pasted!" : "Paste"}</span>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400" />
                Max 8,000 chars (~1,200 words)
              </span>
              <span>{rWords} words</span>
            </div>
          </div>

          {/* JOB DESCRIPTION INPUT */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="jobInput" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 inline-flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Paste Target Job Description
              </label>
              <div className="flex items-center gap-2 text-xs">
                {jLen > MAX_JOB_CHARS ? (
                  <span className="text-[11px] text-rose-600 font-bold">
                    Exceeds 5,000 char cap ({jLen}/5,000)
                  </span>
                ) : jLen >= MIN_CHARS ? (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {jLen.toLocaleString()} / 5,000 chars
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {jLen} / {MIN_CHARS} chars min
                  </span>
                )}
              </div>
            </div>

            <div className="relative flex-grow">
              <textarea
                id="jobInput"
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setActiveSampleId(null);
                  setSampleTip(null);
                }}
                maxLength={MAX_JOB_CHARS + 500}
                rows={12}
                disabled={isLoading}
                className={`w-full h-72 sm:h-80 p-4 text-xs sm:text-sm text-slate-800 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-2 transition resize-none placeholder:text-slate-400 font-mono leading-relaxed ${
                  jLen > MAX_JOB_CHARS
                    ? "border-rose-400 focus:ring-rose-400"
                    : "border-slate-200 focus:ring-brand-500 focus:border-brand-500"
                }`}
                placeholder="Paste the target job posting (responsibilities, required qualifications, technical stack, nice-to-haves)..."
              />
              <button
                type="button"
                onClick={handlePasteJob}
                className="absolute right-3 bottom-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-400 transition shadow-xs backdrop-blur-xs cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{copiedJob ? "Pasted!" : "Paste"}</span>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3 text-slate-400" />
                Max 5,000 chars (~800 words)
              </span>
              <span>{jWords} words</span>
            </div>
          </div>
        </div>

        {/* Validation Warning & Submit Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {rLen > MAX_RESUME_CHARS || jLen > MAX_JOB_CHARS ? (
              <span className="text-rose-600 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                Input exceeds character cap. Please trim to proceed.
              </span>
            ) : !isWordsValid ? (
              <span className="text-amber-700 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                Both boxes require at least 15 words of genuine content.
              </span>
            ) : !isResumeLengthValid || !isJobLengthValid ? (
              <span className="text-rose-600 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                Both boxes require at least 50 characters to run AI analysis.
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Inputs validated • 0-token duplicate cache active
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!isFormValid}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2.5 text-base cursor-pointer ${
              isFormValid
                ? "bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-[0.98] shadow-brand-500/25"
                : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Making Your Resume Ready...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Make My Resume Ready</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
