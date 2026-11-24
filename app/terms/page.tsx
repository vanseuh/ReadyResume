import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, FileCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | ReadyResume",
  description: "Terms and conditions for using ReadyResume ATS Resume Checker & Career Kit tools.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to ReadyResume</span>
          </Link>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold text-slate-600">Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex-grow space-y-8 leading-relaxed">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">User Agreement</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Terms of Service</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: November 24, 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="text-sm text-slate-600">
              By accessing or using ReadyResume (&quot;readyresume-in.vercel.app&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Description of Service</h2>
            <p className="text-sm text-slate-600">
              ReadyResume provides automated ATS score evaluations, keyword gap analysis, and tailored resume optimization suggestions using artificial intelligence. Results are advisory and designed to improve hiring outcomes; however, ReadyResume cannot guarantee interview invitations, placement, or hiring decisions by third-party employers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. 10-Day Pro Pass &amp; Payments</h2>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li>The ₹49 10-Day Pro Pass is a one-time non-recurring payment granting up to 10 resume generations per calendar day for 10 consecutive days.</li>
              <li>There are zero automatic renewals or hidden subscription fees.</li>
              <li>Passes are activated via verified 12-digit UPI transaction reference (UTR) numbers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Advertising &amp; Disclaimers</h2>
            <p className="text-sm text-slate-600">
              ReadyResume displays advertisements served by third-party advertising partners such as Google AdSense. We do not endorse products or services featured in third-party advertisements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p className="text-sm text-slate-600">
              ReadyResume and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use this service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} ReadyResume. All rights reserved.</p>
      </footer>
    </div>
  );
}
