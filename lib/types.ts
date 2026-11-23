export interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewQuestion {
  id: number;
  category: string; // e.g. "Technical Architecture" or "Behavioral Leadership"
  type: "technical" | "behavioral";
  question: string;
  sampleAnswer: StarAnswer | string;
  criteria?: string;
  proTip?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface TailoredResume {
  fullName: string;
  targetTitle: string;
  contact: string;
  summary: string;
  skills: {
    technical: string;
    methodologies: string;
    leadership: string;
  };
  experience: ExperienceItem[];
  education: string;
}

export interface KeywordGapItem {
  keyword: string;
  description?: string; // Short actionable tip on how to make it good
  status?: string;      // e.g. "Critical Gap", "Needs Improvement", "Easy Fix"
  isGood?: boolean;     // Whether it's a good match or bad gap
}

export interface KitData {
  atsScore: number;
  scoreCategory?: string;
  missingKeywords: Array<string | KeywordGapItem>;
  tailoredResume: TailoredResume;
  interviewQuestions: InterviewQuestion[];
}

export interface GenerateRequest {
  resume: string;
  jobDescription: string;
}

export interface ProPassData {
  utr: string;
  activatedAt: number;
  expiresAt: number;
  dailyUsage: {
    date: string; // YYYY-MM-DD
    count: number; // 0 to 10
  };
}

export interface GenerateResponse {
  success: boolean;
  data?: KitData;
  error?: string;
  proPass?: {
    isPro: boolean;
    remainingToday: number;
    expiresAt: number;
    dayNumber: number;
  };
}
