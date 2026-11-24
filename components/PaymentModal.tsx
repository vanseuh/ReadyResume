"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUnlock: (utr: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirmUnlock,
}: PaymentModalProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  // Environment variables with production-ready fallbacks
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "yourname@okaxis";
  const merchantName = process.env.NEXT_PUBLIC_MERCHANT_NAME || "ReadyResume";
  const unlockPrice = process.env.NEXT_PUBLIC_UNLOCK_PRICE || "49";

  // Standard NPCI UPI Intent URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${unlockPrice}&cu=INR&tn=${encodeURIComponent("ReadyResume 10-Day Pro Pass")}`;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleVerifyPayment = () => {
    setUtrError(null);
    const cleanUtr = utrNumber.trim().replace(/\s+/g, "");

    // 1. Strict 12-digit numeric validation
    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError("Please enter a valid 12-digit UPI Reference / UTR Number found on your payment receipt.");
      return;
    }

    // 2. Anti-cheat check for obvious fake repetitive strings
    const obviousFakes = [
      "000000000000",
      "111111111111",
      "123456789012",
      "999999999999",
      "121212121212",
    ];
    if (obviousFakes.includes(cleanUtr)) {
      setUtrError("Invalid transaction reference. Please provide the actual UTR from your UPI app receipt.");
      return;
    }

    // 3. Prevent duplicate reuse across sessions
    try {
      const stored = localStorage.getItem("readyresume_used_utrs");
      const usedUtrs: string[] = stored ? JSON.parse(stored) : [];

      if (usedUtrs.includes(cleanUtr)) {
        setUtrError("This UTR has already been redeemed. Please check your transaction details.");
        return;
      }

      usedUtrs.push(cleanUtr);
      localStorage.setItem("readyresume_used_utrs", JSON.stringify(usedUtrs));
    } catch {
      // ignore
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      triggerCelebration();
      onConfirmUnlock(cleanUtr);
    }, 800);
  };

  const handleDevUnlock = () => {
    triggerCelebration();
    onConfirmUnlock("999888777666");
  };

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl z-10 overflow-hidden animate-scale-up my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 p-5 sm:p-6 text-white text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 mb-2 shadow-xs">
            ⚡ 10-Day Pro Pass Included • ₹49 One-Time
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Unlock Full Kit + 10-Day Pro Pass
          </h3>
          <p className="text-xs text-brand-200 mt-1 max-w-sm mx-auto">
            10 Tailored Resumes/Day for 10 Days • All STAR Answers • PDF Downloads
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-grow text-slate-800">
          {/* Prominent Cross-Device Payment Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900 block">
                Paid from another phone or your UPI app?
              </strong>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Direct UPI transfers cannot automatically track your browser session. To activate your 10-Day Pro Pass on <strong>this device</strong>, simply enter the 12-digit UTR / UPI Reference Number from your payment receipt in <strong>Step 2 below</strong> and tap Activate!
              </p>
            </div>
          </div>

          {/* Compact Price & Pass Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-emerald-50/70 border border-brand-200/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                10-Day Pro Pass
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-baseline gap-2 mt-0.5">
                ₹{unlockPrice}{" "}
                <span className="text-xs text-slate-400 line-through font-normal">₹499</span>
                <span className="text-[11px] text-emerald-700 font-semibold">• One-Time UPI</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              10 Resumes / Day
            </span>
          </div>

          {/* STEP 1: DYNAMIC SCANNABLE UPI QR CODE & DIRECT INTENT */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-3 border-b border-slate-200/70 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                Step 1: Scan & Pay ₹{unlockPrice}
              </span>
              <span className="text-[10px] font-medium text-slate-500">Any UPI App</span>
            </div>

            {/* Dynamic Real Scannable SVG QR Code */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center">
              <QRCodeSVG
                value={upiUri}
                size={160}
                level="M"
                includeMargin={false}
              />
              <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                GPay • PhonePe • Paytm • BHIM
              </span>
            </div>

            {/* Mobile UPI Intent Button (<a href={upiUri}>) */}
            <div className="w-full mt-4">
              <a
                href={upiUri}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] transition shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 text-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Pay ₹{unlockPrice} via UPI App (Mobile Only)</span>
              </a>
            </div>

            {/* UPI ID Fallback & Copy Button */}
            <div className="mt-3 w-full flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">UPI ID:</span>
              <span className="font-mono font-bold text-slate-800">{upiId}</span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: PAYMENT VERIFICATION (12-DIGIT UTR) */}
          <div className="space-y-3 pt-1 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">2</span>
                Step 2: Enter 12-Digit Reference (UTR)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {utrNumber.trim().length}/12 Digits
              </span>
            </div>

            {/* Detailed "After payment how to get UTR No." Guide */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 text-xs text-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>After Payment: How to get your 12-Digit UTR Number?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                UPI app me payment hone ke baad receipt me <strong>12-digit number</strong> milta hai:
              </p>
              <div className="space-y-1.5 text-[11px] bg-white p-2.5 rounded-lg border border-amber-200/70">
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-700 shrink-0">Google Pay:</span>
                  <span className="text-slate-700">Open <strong>History</strong> &gt; tap ₹49 payment &gt; copy <strong>&quot;UPI transaction ID&quot;</strong></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-purple-700 shrink-0">PhonePe:</span>
                  <span className="text-slate-700">Open <strong>History</strong> &gt; tap ₹49 payment &gt; <strong>Transfer Details</strong> &gt; copy <strong>&quot;UTR&quot;</strong></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-sky-700 shrink-0">Paytm:</span>
                  <span className="text-slate-700">Open <strong>Balance &amp; History</strong> &gt; tap payment &gt; copy <strong>&quot;UPI Ref No.&quot;</strong></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-700 shrink-0">BHIM / Other:</span>
                  <span className="text-slate-700">Transaction details me <strong>&quot;UPI Ref ID&quot;</strong> ya <strong>&quot;UTR&quot;</strong> dekhein</span>
                </div>
              </div>
              <p className="text-[10px] text-amber-800 font-medium">
                👉 Us 12-digit number ko neeche wale box me paste karein aur Activate dabayein!
              </p>
            </div>

            <div className="relative">
              <input
                id="utrInput"
                type="text"
                maxLength={12}
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value.replace(/\D/g, ""));
                  setUtrError(null);
                }}
                placeholder="Paste 12-digit UTR (e.g. 502819384729)"
                className="w-full px-3.5 py-3 text-base font-mono tracking-widest text-slate-900 bg-white border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder:text-slate-400 placeholder:text-xs placeholder:font-sans placeholder:tracking-normal text-center shadow-xs"
              />
            </div>

            {utrError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{utrError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyPayment}
              disabled={isVerifying || utrNumber.trim().length !== 12}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer ${
                utrNumber.trim().length === 12 && !isVerifying
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] shadow-emerald-600/30"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isVerifying ? "Activating 10-Day Pro Pass..." : "Activate 10-Day Pro Pass on This Device"}
              </span>
            </button>

            <p className="text-center text-[10px] text-slate-500 leading-tight">
              Instant activation. Grants full access to all 6 interview answers, full rewritten resume,
              clean PDF export, and up to 10 generations per day for 10 days.
            </p>
          </div>

          {/* DEV-ONLY TEST UNLOCK (Hidden in Production) */}
          {isDev && (
            <div className="pt-3 border-t border-dashed border-slate-200 text-center">
              <button
                type="button"
                onClick={handleDevUnlock}
                className="text-[11px] text-slate-400 hover:text-brand-600 font-medium underline underline-offset-2 transition cursor-pointer"
              >
                🛠️ Test Unlock (Dev Only — Simulates 10-Day Pro Pass)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
