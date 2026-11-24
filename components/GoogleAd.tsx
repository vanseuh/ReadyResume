"use client";

import React, { useEffect, useRef } from "react";

interface GoogleAdProps {
  adSlot?: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function GoogleAd({
  adSlot = "1234567890",
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  const clientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    if (isPushed.current) return;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (err) {
      // AdSense push errors caught gracefully
    }
  }, []);

  return (
    <div
      className={`w-full my-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-50/70 border border-dashed border-slate-200/90 p-3 transition-all ${className}`}
    >
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 self-start sm:self-center">
        Advertisement
      </span>

      <div className="w-full min-h-[90px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", textAlign: "center" }}
          data-ad-client={clientId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
