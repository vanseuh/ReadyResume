import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  FileText,
  Target,
  Search,
  MessageSquare,
  Download,
  Shield,
  Zap,
  ArrowRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Complete Tutorial: How to Use ReadyResume to Pass ATS Filters",
  description: "Step-by-step tutorial guide on checking your ATS resume score, fixing keyword gaps, and generating interview prep kits with ReadyResume.",
};

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tool</span>
          </Link>
          <div className="flex items-center gap-2">
            <img
              src="/icon.svg"
              alt="ReadyResume Logo"
              width={28}
              height={28}
              className="w-7 h-7 rounded-lg object-contain shadow-xs"
            />
            <span className="font-bold text-slate-900 text-sm hidden sm:inline">ReadyResume Tutorial Guide</span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition shadow-sm"
          >
            Launch Tool
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 py-12 sm:py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Step-by-Step Walkthrough</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How to Beat the ATS &amp; Land 3x More Interviews with{" "}
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              ReadyResume
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Over 75% of resumes are automatically filtered out by Applicant Tracking Systems (ATS) on Naukri,
            LinkedIn, and Indeed. Here is how to use ReadyResume to optimize your resume in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Main Walkthrough Steps */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow space-y-12">
        {/* STEP 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
              1
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Paste Your Resume &amp; Target Job Description
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Open <Link href="/" className="text-brand-600 font-bold underline">readyresume-in.vercel.app</Link>. You will see two input boxes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="space-y-1">
              <strong className="text-slate-900 flex items-center gap-1.5 font-bold">
                <FileText className="w-4 h-4 text-brand-600" /> Left Box: Current Resume
              </strong>
              <p className="text-slate-500 leading-normal">
                Paste your existing resume text (experience, summary, skills) or click <strong>&quot;Upload PDF&quot;</strong> to extract text instantly.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-slate-900 flex items-center gap-1.5 font-bold">
                <Target className="w-4 h-4 text-brand-600" /> Right Box: Target Job Description
              </strong>
              <p className="text-slate-500 leading-normal">
                Copy the job description directly from Naukri, LinkedIn, or Indeed (responsibilities, required qualifications, tools).
              </p>
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Quick Pro Tip:</strong> If you don&apos;t have a job description handy, click any of the 4 role chips (IT/Tech, Banking, Marketing, Fresher) to load a real sample!</span>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
              2
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Click &quot;Make My Resume Ready&quot; (Instant 0–100% Evaluation)
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hit the large purple gradient button at the bottom. In less than 15 seconds, ReadyResume analyzes your profile and displays:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Overall ATS Match Score (0–100%):</strong> An objective assessment of how closely your resume aligns with the job requirements.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Keyword Gap Matrix:</strong> Specific hard skills, frameworks, and soft skills present in the job posting but missing from your resume, tagged by severity (High, Medium, Low).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Key Strengths &amp; Action Items:</strong> Actionable advice on what to emphasize and what to modify before submitting.</span>
            </li>
          </ul>
        </div>

        {/* STEP 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
              3
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Review 6 Role-Specific STAR Interview Q&amp;As
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Interviews in 2026 evaluate candidate responses using the <strong>STAR method (Situation, Task, Action, Result)</strong>.
            ReadyResume crafts 6 custom behavioral and technical interview questions specifically derived from your target job description and your past work history.
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block">✨ What you get:</span>
            <p>• The first 2 questions and answers are completely free.</p>
            <p>• The remaining 4 advanced questions and complete STAR scripts are unlocked with the 10-Day Pro Pass.</p>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
              4
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Export Clean ATS PDF or Unlock 10-Day Pro Pass (₹49)
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Need the complete AI-rewritten resume formatted in a verified, single-column ATS structure with quantifiable metrics?
          </p>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-slate-800 space-y-2">
            <strong className="text-emerald-950 font-bold block text-sm">
              🎟️ The ₹49 10-Day Pro Pass:
            </strong>
            <p className="text-slate-600">
              Pay ₹49 once via UPI (Google Pay, PhonePe, Paytm). You get:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>10 tailored resumes per day for 10 full days (up to 100 job applications).</li>
              <li>Complete rewritten resume text tailored to every individual vacancy.</li>
              <li>1-click clean PDF downloads.</li>
              <li>Zero recurring fees, zero subscription traps.</li>
            </ul>
          </div>
        </div>

        {/* Call to Action Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-950 text-white text-center space-y-4 shadow-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs inline-block">
            Ready to check your ATS score?
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Try ReadyResume Free — 3 Free Tries Every Day!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            No credit card, no registration required. Discover your match percentage in 30 seconds.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg text-sm"
            >
              <span>Go to ReadyResume Tool</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <Link href="/" className="font-bold text-slate-800 hover:text-brand-600 transition">
            ReadyResume
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
