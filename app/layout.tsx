import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadyResume — Turn Any Job Description Into an Interview-Ready Resume in 30 Seconds",
  description: "Check your ATS match score for free. Unlock your rewritten resume and 8 tailored interview Q&As for a one-time ₹49 payment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
