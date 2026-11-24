import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ReadyResume — Free ATS Resume Checker & Job Tailoring Tool";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
          color: "white",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            RR
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              ReadyResume
            </span>
            <span style={{ fontSize: "16px", color: "#94a3b8" }}>
              AI ATS Career Kit & Interview Prep
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
            }}
          >
            Turn Any Job Description Into An{" "}
            <span style={{ color: "#38bdf8" }}>Interview-Ready Resume</span> In 30 Seconds.
          </div>
          <p style={{ fontSize: "22px", color: "#94a3b8", lineHeight: 1.4 }}>
            Free instant ATS match score, keyword gap analysis, and 6 role-specific STAR interview answers.
          </p>
        </div>

        {/* Feature Badges Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34d399",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            ✓ Free ATS Score Preview (0-100%)
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#60a5fa",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            ✓ ₹49 One-Time 10-Day Pro Pass
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#e2e8f0",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Naukri • LinkedIn • Indeed
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
