/**
 * Client-Side Hashing & Session Caching Utilities for ReadyResume
 * Guarantees 0-token duplicate execution when users submit identical inputs or reload the page.
 */

import { KitData } from "./types";

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
 * Validates text against low word counts or repetitive gibberish.
 */
export function validateInputQuality(resume: string, jobDescription: string): { isValid: boolean; error?: string } {
  const rWords = resume.trim().split(/\s+/).filter(w => w.length > 0);
  const jWords = jobDescription.trim().split(/\s+/).filter(w => w.length > 0);

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
