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

export interface KitData {
  atsScore: number;
  scoreCategory?: string;
  missingKeywords: string[];
  tailoredResume: TailoredResume;
  interviewQuestions: InterviewQuestion[];
}

export interface GenerateRequest {
  resume: string;
  jobDescription: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: KitData;
  error?: string;
}
