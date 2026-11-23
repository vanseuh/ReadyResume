"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, CheckCircle2, ShieldCheck, Zap, Target, BookOpen } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does ReadyResume calculate my ATS Match Score?",
    answer:
      "ReadyResume uses advanced LLM intelligence to evaluate your current resume against the target job description. It calculates a realistic 0–100% score based on keyword frequency, hard and soft skill overlap, seniority alignment, tool proficiency, and quantifiable impact metrics.",
  },
  {
    question: "Can I check my ATS resume score for free?",
    answer:
      "Yes, 100% free! Every visitor can run 3 free ATS score checks per hour. You immediately see your overall match percentage, top missing keywords with severity rankings, and the first 2 role-specific interview questions without providing any credit card or creating an account.",
  },
  {
    question: "Why do 75%+ of resumes get rejected by ATS software in India?",
    answer:
      "Most corporate recruiters and placement portals (Naukri, LinkedIn India, Indeed) receive hundreds of applications per opening and rely on Applicant Tracking Systems (ATS) to filter candidates. If your resume lacks the exact keywords, tools, or metrics mentioned in the job description, the ATS automatically drops your application before a human recruiter ever sees it.",
  },
  {
    question: "What is included in the ₹49 10-Day Pro Pass?",
    answer:
      "For a one-time payment of ₹49 via UPI (Google Pay, PhonePe, Paytm, BHIM), you unlock the complete AI-rewritten ATS resume tailored specifically to your target job, all 6 STAR behavioral & technical interview Q&As, instant clean PDF downloads, and up to 10 tailored resumes per day for 10 full days (up to 100 career kits). There are zero subscriptions and zero auto-renewals.",
  },
  {
    question: "How does the STAR method help in interview preparation?",
    answer:
      "The STAR framework (Situation, Task, Action, Result) is the industry standard for answering behavioral and technical interview questions. ReadyResume generates crisp, tailored STAR answers based on your experience and the target role so you can speak confidently with measurable results during interviews.",
  },
  {
    question: "Is my personal resume data stored or shared?",
    answer:
      "No. Privacy is our top priority. Your resume and job description text are parsed client-side in your browser, processed in memory on the server for generation, and never saved or stored in any database.",
  },
];

export default function SeoFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="mt-20 pt-16 border-t border-slate-200" aria-label="ATS Guide and Frequently Asked Questions">
      {/* Educational Guide Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ATS Career Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How to Beat the ATS (Applicant Tracking System) in 2026
        </h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Over 75% of Indian resumes are filtered out before reaching a hiring manager. Tailoring your resume to the exact job description increases interview callbacks by up to 4×.
        </p>
      </div>

      {/* 3 Pillars of ATS Success */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-4">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">1. Exact Keyword Density</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ATS scanners search for exact terminologies (e.g., &quot;PostgreSQL&quot; vs &quot;SQL databases&quot;). ReadyResume identifies critical keyword gaps and organically weaves them into your resume bullets.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">2. Quantifiable Impact Bullets</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Generic job descriptions fail ATS filters. ReadyResume turns passive duties into high-impact action bullets with quantifiable metrics (%, ₹, scale, speed, team size).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">3. Role-Specific STAR Answers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Passing the ATS is step one; passing the interview is step two. You receive 6 tailored STAR responses covering technical domains and behavioral scenarios for the specific role.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-slate-900 text-sm hover:text-brand-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 pr-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Updated for 2026 Indian Hiring Standards</span>
          </div>
          <span>Naukri • LinkedIn • Indeed</span>
        </div>
      </div>
    </section>
  );
}
