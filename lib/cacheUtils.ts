/**
 * Client-Side Hashing & Session Caching Utilities for ReadyResume
 * Guarantees 0-token duplicate execution when users submit identical inputs or reload the page.
 */

import { KitData, ProPassData } from "./types";

/**
 * Fast SHA-256 hash string for browser inputs
 */
export async function computeInputHash(resume: string, jobDescription: string): Promise<string> {
  const normalized = `${resume.trim()}:::${jobDescription.trim()}`;
  
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fallback below
    }
  }

  // Fast string hash fallback (DJB2)
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

const CACHE_PREFIX = "readyresume_cache_";

export function getCachedKit(hash: string): KitData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${hash}`);
    if (!raw) return null;
    return JSON.parse(raw) as KitData;
  } catch {
    return null;
  }
}

export function saveCachedKit(hash: string, data: KitData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CACHE_PREFIX}${hash}`, JSON.stringify(data));
  } catch {
    // LocalStorage quota may be reached in private browsing
  }
}

/**
 * Accurately extracts individual words from text.
 * Separates words by whitespace, slashes, commas, dashes, bullets, and punctuation.
 * Correctly counts lists without spaces (e.g. "React,Node,AWS"), hyphenated terms,
 * and ignores non-word symbols like bullets (•, -).
 */
export function extractWords(text: string): string[] {
  if (!text || typeof text !== "string") return [];
  const normalized = text
    .replace(/[\/\\,;:()[\]{}•*—–\-_|<>~`"?!+=#%^&$@\r\n\t]/g, " ")
    .replace(/\.(?=\s|$)/g, " ");
  return normalized.trim().split(/\s+/).filter(w => w.length > 0 && !/^[\W_]+$/.test(w));
}

export function countWords(text: string): number {
  return extractWords(text).length;
}

/**
 * Validates text against low word counts or repetitive gibberish.
 */
export function validateInputQuality(resume: string, jobDescription: string): { isValid: boolean; error?: string } {
  const rWords = extractWords(resume);
  const jWords = extractWords(jobDescription);

  if (rWords.length < 15) {
    return {
      isValid: false,
      error: `Your Resume is too brief (${rWords.length} words found). Please provide at least 15 words of work experience or skills.`,
    };
  }

  if (jWords.length < 15) {
    return {
      isValid: false,
      error: `The Job Description is too brief (${jWords.length} words found). Please provide at least 15 words of role requirements.`,
    };
  }

  // Check for repeated identical characters (e.g. 'aaaaa...', 'xxxxx...')
  if (/(.)\1{12,}/.test(resume)) {
    return {
      isValid: false,
      error: "Resume contains excessive repeated characters. Please enter genuine resume content.",
    };
  }

  if (/(.)\1{12,}/.test(jobDescription)) {
    return {
      isValid: false,
      error: "Job Description contains excessive repeated characters. Please enter genuine job posting details.",
    };
  }

  // Check for repetitive placeholder repetition (e.g. 'test test test')
  const rUnique = new Set(rWords.map(w => w.toLowerCase()));
  if (rWords.length >= 20 && rUnique.size / rWords.length < 0.25) {
    return {
      isValid: false,
      error: "Resume lacks sufficient variety. Please avoid repetitive placeholder phrases.",
    };
  }

  return { isValid: true };
}

// ==========================================
// FREE PREVIEWS LIMIT SYSTEM (Max 3 Previews/Day)
// ==========================================

const FREE_USAGE_KEY = "readyresume_free_usage_count";
export const FREE_LIMIT = 3;

export function getFreeUsageCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(FREE_USAGE_KEY);
    if (!raw) return 0;
    const today = new Date().toISOString().slice(0, 10);

    // Check if JSON { date: string, count: number }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.date === today) {
          return Math.max(0, parseInt(parsed.count, 10) || 0);
        } else {
          // Different calendar day: reset to 0
          localStorage.setItem(FREE_USAGE_KEY, JSON.stringify({ date: today, count: 0 }));
          return 0;
        }
      }
    } catch {
      // Legacy plain number format: migrate to today
      const legacyCount = parseInt(raw, 10) || 0;
      localStorage.setItem(FREE_USAGE_KEY, JSON.stringify({ date: today, count: legacyCount }));
      return legacyCount;
    }
    return 0;
  } catch {
    return 0;
  }
}

export function incrementFreeUsage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const current = getFreeUsageCount();
    const updated = Math.min(FREE_LIMIT, current + 1);
    localStorage.setItem(FREE_USAGE_KEY, JSON.stringify({ date: today, count: updated }));
    return updated;
  } catch {
    return 0;
  }
}

export function resetFreeUsage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FREE_USAGE_KEY);
  } catch {}
}

// ==========================================
// 10-DAY PRO PASS SYSTEM (10 generations/day)
// ==========================================

export const PRO_PASS_DURATION_MS = 10 * 24 * 60 * 60 * 1000; // 10 days
export const PRO_DAILY_LIMIT = 10;
const PRO_PASS_KEY = "readyresume_pro_pass";

export function activateProPass(utr: string): ProPassData {
  const now = Date.now();
  const todayKey = new Date().toISOString().slice(0, 10);
  const pass: ProPassData = {
    utr: utr.trim(),
    activatedAt: now,
    expiresAt: now + PRO_PASS_DURATION_MS,
    dailyUsage: {
      date: todayKey,
      count: 0,
    },
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PRO_PASS_KEY, JSON.stringify(pass));
      localStorage.setItem("readyresume_unlocked", "true");
    } catch {}
  }
  return pass;
}

export function getActiveProPass(): ProPassData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRO_PASS_KEY);
    if (!raw) return null;
    const pass = JSON.parse(raw) as ProPassData;
    const now = Date.now();

    // Check 10-day expiration
    if (now > pass.expiresAt) {
      localStorage.removeItem(PRO_PASS_KEY);
      localStorage.removeItem("readyresume_unlocked");
      return null;
    }

    // Rollover new day if date has changed
    const todayKey = new Date().toISOString().slice(0, 10);
    if (!pass.dailyUsage || pass.dailyUsage.date !== todayKey) {
      pass.dailyUsage = { date: todayKey, count: 0 };
      localStorage.setItem(PRO_PASS_KEY, JSON.stringify(pass));
    }

    return pass;
  } catch {
    return null;
  }
}

export function incrementProUsage(): ProPassData | null {
  const pass = getActiveProPass();
  if (!pass) return null;
  const todayKey = new Date().toISOString().slice(0, 10);
  if (pass.dailyUsage.date === todayKey) {
    pass.dailyUsage.count = Math.min(PRO_DAILY_LIMIT, pass.dailyUsage.count + 1);
  } else {
    pass.dailyUsage = { date: todayKey, count: 1 };
  }
  try {
    localStorage.setItem(PRO_PASS_KEY, JSON.stringify(pass));
  } catch {}
  return pass;
}

export function formatExpiryDate(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "10 days";
  }
}
