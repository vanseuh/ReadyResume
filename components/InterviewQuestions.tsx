"use client";

import React from "react";
import {
  HelpCircle,
  Unlock,
  Lock,
  Award,
  Eye,
  Lightbulb,
  ChevronRight,
  Check,
} from "lucide-react";
import { InterviewQuestion } from "@/lib/types";

interface InterviewQuestionsProps {
  questions: InterviewQuestion[];
  isUnlocked: boolean;
  onOpenPaywall: () => void;
}

export default function InterviewQuestions({
  questions,
  isUnlocked,
  onOpenPaywall,
}: InterviewQuestionsProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-600" />
            Tailored Interview Questions & STAR Coaching
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            6 custom questions (3 Technical & 3 Behavioral) tailored strictly to your resume and the target role.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            <Unlock className="w-3 h-3" /> 2 Free Questions
          </span>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              <Check className="w-3 h-3" /> All 6 Questions Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
              <Lock className="w-3 h-3" /> 4 Pro Questions (Locked)
            </span>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isFree = idx < 2;
          const shouldBlur = !isFree && !isUnlocked;
          const sa = typeof q.sampleAnswer === "object" && q.sampleAnswer !== null ? q.sampleAnswer : null;

          return (
            <div
              key={q.id || idx}
              className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/60 transition-all relative overflow-hidden"
            >
              {/* Question Header Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ${
                      isFree ? "bg-brand-600 text-white" : isUnlocked ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    Q{q.id || idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {q.type === "technical" ? "Technical / Domain" : "Behavioral / Leadership"}
                    {q.category ? ` • ${q.category}` : ""}
                  </span>
                </div>

                <div>
                  {isFree ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Free Question
                    </span>
                  ) : isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Unlocked Pro
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Lock className="w-3 h-3 text-amber-700" /> Locked (₹49)
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-3">
                {q.question}
              </h4>

              {/* Answer Body (Blurred if locked) */}
              <div className={`mt-4 space-y-3 transition-all ${shouldBlur ? "locked-blur" : "unlocked-content"}`}>
                {/* Interviewer Criteria */}
                {q.criteria && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-brand-700 flex items-center gap-1.5 mb-1">
                      <Eye className="w-3.5 h-3.5" /> What Interviewers Look For:
                    </span>
                    <p className="text-slate-600">{q.criteria}</p>
                  </div>
                )}

                {/* STAR Answer */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" /> High-Scoring STAR Model Answer:
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Situation • Task • Action • Result
                    </span>
                  </div>

                  {sa ? (
                    <div className="grid grid-cols-1 gap-2 pt-1 text-slate-700">
                      <p>
                        <strong className="text-slate-900 font-semibold">[Situation]</strong> {sa.situation}
                      </p>
                      <p>
                        <strong className="text-slate-900 font-semibold">[Task]</strong> {sa.task}
                      </p>
                      <p>
                        <strong className="text-slate-900 font-semibold">[Action]</strong> {sa.action}
                      </p>
                      <p>
                        <strong className="text-emerald-800 font-semibold">[Result]</strong> {sa.result}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-700 leading-relaxed pt-1">
                      {typeof q.sampleAnswer === "string" ? q.sampleAnswer : ""}
                    </p>
                  )}
                </div>

                {/* Coach Pro Tip */}
                {q.proTip && (
                  <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-xs text-brand-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Coach Pro Tip:</span> {q.proTip}
                    </div>
                  </div>
                )}
              </div>

              {/* Locked CTA Overlay Footer */}
              {shouldBlur && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    STAR Model Breakdown & metrics locked behind Pro Kit
                  </span>
                  <button
                    onClick={onOpenPaywall}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-100/90 hover:bg-brand-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-2xs"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Unlock for ₹49
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unlock Banner at Bottom if not unlocked */}
      {!isUnlocked && (
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-brand-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Unlock all 6 tailored interview answers & STAR coaching</h4>
              <p className="text-xs text-brand-200">
                Prepare for technical architecture, behavioral curveballs, and salary negotiation.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPaywall}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition shadow-md shadow-brand-500/30 flex items-center gap-2 cursor-pointer"
          >
            <span>Unlock 10-Day Pro Pass (₹49)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
