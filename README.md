# 🚀 ReadyResume — Production ATS Career Kit Suite

**ReadyResume** is a 100% self-service, production-ready web application built with **Next.js (App Router)** and **Tailwind CSS**. It empowers job seekers to transform any job description into an interview-ready resume and prepare for interviews with tailored STAR responses in seconds, without requiring user signups or API keys.

---

## ✨ Features

### 1. 🔒 Secure Server-Side LLM Backend (`/api/generate`)
- **Server-Only API Key**: Read strictly via `LLM_API_KEY` (or `LLAMA_API_KEY`) on the server. Never exposed to the browser.
- **OpenAI-Compatible Engine**: Works seamlessly with Groq (`llama-3.3-70b-versatile`), Together AI, Cerebras, Meta Llama API, or local FreeLLMAPI.
- **Strict Structured JSON Schema**:
  - `atsScore` (Realistic 0–100% calculation based on keyword and seniority overlap).
  - `missingKeywords` (3–5 specific missing skills or terms).
  - `tailoredResume` (Professional, ATS-formatted resume with quantifiable bullets).
  - `interviewQuestions` (Exactly 8 questions: 4 role-specific/technical and 4 behavioral with 4-part STAR answers).

### 2. 💸 Real Dynamic UPI QR Code & ₹49 Unlock Flow
- **Scannable Dynamic QR Code**: Powered by `qrcode.react`, generating standard NPCI UPI payment links on the fly (`upi://pay?...`).
- **One-Tap Mobile UPI Intent**: `<a href={upiUri}>` button enables mobile users on GPay, PhonePe, Paytm, or BHIM to open their app directly with ₹49 pre-filled.
- **12-Digit UTR Verification & Anti-Cheat**: Users submit their 12-digit transaction reference number, validated against repetitive digits and deduplicated in storage to prevent re-use.
- **Dev-Only Test Unlock**: Subtle test unlock link visible only in local development (`NODE_ENV === "development"`), automatically stripped on live production builds.

### 3. 📄 High-Resolution Multi-Page PDF Kit
- Formats both the tailored resume and the 8-question interview prep guide into a clean, printable PDF ready for recruiters.

---

## 🔑 Environment Configuration (`.env.local`)

Create a `.env.local` file in the root folder with the following keys:

```env
# Server-Side LLM Configuration (e.g. Groq, Together AI, Cerebras, or local provider)
LLM_API_KEY=your_llm_api_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile

# Public Dynamic UPI Payment Configuration
NEXT_PUBLIC_UPI_ID=yourname@okaxis
NEXT_PUBLIC_MERCHANT_NAME=ReadyResume
NEXT_PUBLIC_UNLOCK_PRICE=49
```

---

## 🚢 Deploy to Vercel (Free)

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit of ReadyResume"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/readyresume.git
git push -u origin main
```

### 2. Import into Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select your `readyresume` GitHub repository.
3. In **Environment Variables**, add:
   - `LLM_API_KEY`: Your Groq or cloud LLM provider API key
   - `LLM_BASE_URL`: `https://api.groq.com/openai/v1`
   - `LLM_MODEL`: `llama-3.3-70b-versatile`
   - `NEXT_PUBLIC_UPI_ID`: Your UPI ID (e.g., `yourname@okaxis` or `phone@paytm`)
   - `NEXT_PUBLIC_MERCHANT_NAME`: `ReadyResume`
   - `NEXT_PUBLIC_UNLOCK_PRICE`: `49`
4. Click **Deploy**. Your site is live worldwide!
