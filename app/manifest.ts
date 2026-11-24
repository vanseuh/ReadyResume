import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MakeYourResume — AI ATS Resume Optimizer & Career Kit",
    short_name: "MakeYourResume",
    description: "Check your ATS match score for free. Tailor your resume to any job description and unlock 6 role-specific STAR interview answers with a one-time ₹49 Pro Pass.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
