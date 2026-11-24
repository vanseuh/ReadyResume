import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | MakeYourResume",
  description: "MakeYourResume Privacy Policy, data protection practices, and Google AdSense cookie disclosures.",
};

export default function PrivacyPage() {
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
            <span>Back to MakeYourResume</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600">Privacy &amp; Cookie Policy</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex-grow space-y-8 leading-relaxed">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Compliance &amp; Transparency</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: November 24, 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" />
              1. Information We Collect &amp; Process
            </h2>
            <p className="text-sm text-slate-600">
              MakeYourResume provides AI-powered resume analysis and tailoring. When you submit resume text, job descriptions, or uploaded PDF files to our platform:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li><strong>Resume Content:</strong> Processed in-memory solely to calculate ATS match scores, detect missing keywords, and produce tailored career kits.</li>
              <li><strong>Zero Permanent Database Storage:</strong> We do not store your full resume in any external permanent database. Your session data is cached locally in your own browser via <code>localStorage</code>.</li>
              <li><strong>Usage Metrics:</strong> Anonymous request counters and technical logs (IP address, user agent) are processed for abuse prevention and rate-limiting.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              2. Google AdSense &amp; Third-Party Advertising
            </h2>
            <p className="text-sm text-slate-600">
              We may display advertisements served by Google AdSense and affiliated advertising networks:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
              <p>
                • <strong>Google&apos;s Use of Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
              </p>
              <p>
                • <strong>Advertising Cookies:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve personalized or contextual ads to users based on their browsing activity.
              </p>
              <p>
                • <strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting Google&apos;s <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">aboutads.info</a>.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Cookies &amp; Browser Storage</h2>
            <p className="text-sm text-slate-600">
              MakeYourResume uses standard browser storage (<code>localStorage</code>) to remember your active 10-Day Pro Pass, session analysis, and usage counters without requiring sign-ins or password tracking. You can clear this anytime by clicking &quot;Reset Session&quot; in the footer or clearing your browser cache.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Payments &amp; UPI Security</h2>
            <p className="text-sm text-slate-600">
              All transactions for the ₹49 10-Day Pro Pass are processed directly through peer-to-peer or merchant UPI applications (Google Pay, PhonePe, Paytm, BHIM). MakeYourResume does not collect, store, or have access to your bank account numbers, UPI PINs, credit card numbers, or sensitive financial data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Contact &amp; Inquiries</h2>
            <p className="text-sm text-slate-600">
              If you have any questions regarding this Privacy Policy or our advertising practices, please contact us at: <a href="mailto:support@readyresume.in" className="text-brand-600 font-semibold underline">support@readyresume.in</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} MakeYourResume. All rights reserved.</p>
      </footer>
    </div>
  );
}
