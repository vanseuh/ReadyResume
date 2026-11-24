"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send, Mail, Linkedin } from "lucide-react";

interface ShareBarProps {
  compact?: boolean;
}

export default function ShareBar({ compact = false }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://readyresume.vercel.app";
  };

  const shareText = "Turn any job description into an interview-ready resume & ATS score in 30 seconds with MakeYourResume: ";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "MakeYourResume — Interview-Make Your Resumes in 30 Seconds",
          text: "Check your ATS match score for free and get tailored STAR interview questions.",
          url: getShareUrl(),
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const shareUrl = getShareUrl();
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check your resume ATS match score in 30 seconds with MakeYourResume")}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent("Check your resume ATS score with MakeYourResume")}&body=${encodeURIComponent("Hey! Check your ATS match score for free and unlock a tailored resume with MakeYourResume:\n\n" + shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5 text-brand-600" /> Share MakeYourResume:
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
          title="Share on Telegram"
        >
          <Send className="w-3.5 h-3.5" />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </a>
        <a
          href={mailUrl}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          title="Share via Email"
        >
          <Mail className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={handleCopyLink}
          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer flex items-center gap-1"
          title="Copy Link"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-6 text-center animate-fade-in">
      <div className="max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
          <Share2 className="w-3.5 h-3.5 text-brand-600" />
          <span>Pay It Forward</span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-slate-900">
          Share MakeYourResume with Job-Hunting Friends
        </h4>
        <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
          Help colleagues and batchmates beat the recruiter ATS filter with free instant resume scoring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition shadow-2xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1d8bc0] text-white font-semibold text-xs transition shadow-2xs"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </a>

          {/* LinkedIn */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs transition shadow-2xs"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>

          {/* Email */}
          <a
            href={mailUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition border border-slate-200"
          >
            <Mail className="w-4 h-4 text-slate-600" />
            <span>Email</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition border border-slate-300 shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Native Mobile Share if supported */}
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs transition border border-brand-200 cursor-pointer sm:hidden"
            >
              <Share2 className="w-4 h-4" />
              <span>More...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}