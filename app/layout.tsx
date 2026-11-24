import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = "https://readyresume-in.vercel.app";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ReadyResume — Free ATS Resume Checker & AI Job Tailoring Tool",
    template: "%s | ReadyResume",
  },
  description:
    "Check your ATS match score for free in 30 seconds. Tailor your resume to any job description (Naukri, LinkedIn, Indeed), fix keyword gaps, and get custom STAR interview answers. One-time ₹49 10-Day Pro Pass.",
  keywords: [
    "ATS resume checker free",
    "resume match score calculator",
    "ATS resume builder India",
    "tailor resume to job description",
    "Naukri resume optimizer",
    "LinkedIn resume ATS keywords",
    "STAR interview questions generator",
    "fresher resume maker",
    "AI resume rewrite online",
    "ATS friendly resume format 2026",
    "free resume score checker India",
  ],
  authors: [{ name: "ReadyResume", url: siteUrl }],
  creator: "ReadyResume",
  publisher: "ReadyResume",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": siteUrl,
      "en-US": siteUrl,
      en: siteUrl,
    },
  },
  openGraph: {
    title: "ReadyResume — Turn Any Job Description Into an Interview-Ready Resume in 30 Seconds",
    description:
      "Check your ATS score for free. Get an AI-tailored resume with quantifiable bullets, keyword gap analysis, and 6 role-specific STAR interview answers.",
    url: siteUrl,
    siteName: "ReadyResume",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadyResume — Free ATS Resume Checker & AI Job Tailoring Tool",
    description:
      "Turn any job description into an ATS-optimized resume & STAR interview prep kit in 30 seconds. Instant ₹49 UPI Pro Pass.",
    creator: "@ReadyResume",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "_UZbb7Y13fcJnNV5dRTfQS2H9KnCTP5CHjDv3tVL6bM",
  },
  category: "Career & Employment",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ReadyResume",
      "url": siteUrl,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": [
        {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
          "name": "Free ATS Score Preview",
          "description": "3 free ATS score analyses per day with keyword gaps and 2 interview Q&As.",
        },
        {
          "@type": "Offer",
          "price": "49",
          "priceCurrency": "INR",
          "name": "10-Day Pro Pass",
          "description": "One-time ₹49 UPI payment for 10 tailored resumes per day for 10 full days with clean PDF downloads.",
        },
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1480",
        "bestRating": "5",
        "worstRating": "1",
      },
      "description":
        "Free ATS resume checker and AI job-tailoring career kit for Indian job seekers on Naukri, LinkedIn, and Indeed.",
    },
    {
      "@type": "Organization",
      "name": "ReadyResume",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.ico`,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does ReadyResume calculate my ATS Match Score?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "ReadyResume analyzes your resume against the specific job description by checking keyword overlap, required tools, seniority level, and quantifiable metrics to provide an accurate 0-100% ATS score.",
          },
        },
        {
          "@type": "Question",
          "name": "Is the ATS resume check really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes! You can check your ATS score, discover missing critical keywords, and view the first 2 tailored STAR interview questions 100% free with no signup or credit card required.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the 10-Day Pro Pass for ₹49?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "For a one-time UPI payment of ₹49 (no auto-renewal, no recurring fees), you unlock the full AI-rewritten ATS resume, all 6 STAR interview answers, instant PDF downloads, and up to 10 tailored resumes per day for 10 days.",
          },
        },
        {
          "@type": "Question",
          "name": "Does ReadyResume work for Indian job portals like Naukri, LinkedIn, and Indeed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. ReadyResume is tuned specifically for Indian hiring standards across software development, sales, marketing, banking, and fresher campus placements.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="_UZbb7Y13fcJnNV5dRTfQS2H9KnCTP5CHjDv3tVL6bM" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Google AdSense Integration */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"
          }`}
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
