/**
 * In-Memory Sliding Window & Pro Pass Rate Limiter for MakeYourResume
 * 
 * Free Tier:
 * - 3 requests per IP address per day.
 * 
 * 10-Day Pro Pass Tier (via x-pro-utr header):
 * - Valid for 10 days from activation timestamp.
 * - Up to 10 generations per calendar day (resets every 24 hours).
 * - Friendly cap warning once 10/day is reached:
 *   "You've used all 10 Pro generations for today! Your daily limit resets tomorrow (Day X of 10)."
 */

const PRO_PASS_DURATION_MS = 10 * 24 * 60 * 60 * 1000; // 10 days in ms
const PRO_DAILY_LIMIT = 10;

interface ProPassRecord {
  utr: string;
  activatedAt: number;
  expiresAt: number;
  dailyUsage: Map<string, number>; // dateString (YYYY-MM-DD) -> count
}

const proPassMap = new Map<string, ProPassRecord>();

interface FreeTierRecord {
  hourlyTimestamps: number[];
  dailyTimestamps: number[];
}

const freeTierMap = new Map<string, FreeTierRecord>();

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const FREE_MAX_DAILY = 3;

// Periodic cleanup every 30 minutes
setInterval(() => {
  const now = Date.now();

  // Clean expired Pro passes
  for (const [utr, record] of proPassMap.entries()) {
    if (now > record.expiresAt + 24 * 60 * 60 * 1000) {
      proPassMap.delete(utr);
    }
  }

  // Clean Free tier records
  for (const [ip, record] of freeTierMap.entries()) {
    record.hourlyTimestamps = record.hourlyTimestamps.filter(t => now - t < HOUR_MS);
    record.dailyTimestamps = record.dailyTimestamps.filter(t => now - t < DAY_MS);
    if (record.dailyTimestamps.length === 0) {
      freeTierMap.delete(ip);
    }
  }
}, 30 * 60 * 1000);

export interface RateLimitCheckResult {
  allowed: boolean;
  isPro: boolean;
  remainingToday?: number;
  dayNumber?: number;
  expiresAt?: number;
  message?: string;
}

export function checkTierRateLimit(ip: string, proUtrHeader?: string | null): RateLimitCheckResult {
  const cleanUtr = proUtrHeader?.trim();

  // ==========================================
  // 1. PRO PASS TIER (x-pro-utr provided)
  // ==========================================
  if (cleanUtr && /^\d{12}$/.test(cleanUtr)) {
    const now = Date.now();
    let pass = proPassMap.get(cleanUtr);

    if (!pass) {
      // First generation with this verified UTR on this server instance
      pass = {
        utr: cleanUtr,
        activatedAt: now,
        expiresAt: now + PRO_PASS_DURATION_MS,
        dailyUsage: new Map(),
      };
      proPassMap.set(cleanUtr, pass);
    }

    // Check pass expiration (10 days)
    if (now > pass.expiresAt) {
      return {
        allowed: false,
        isPro: false,
        message: "Your 10-Day Pro Pass has expired. Please unlock a new pass to continue generating 10 tailored resumes per day.",
      };
    }

    // Calculate current day number in the 10-day lifecycle (1 to 10)
    const elapsedMs = Math.max(0, now - pass.activatedAt);
    const dayNumber = Math.min(10, Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1);

    // Get today's local date key (YYYY-MM-DD)
    const todayKey = new Date().toISOString().slice(0, 10);
    const currentCount = pass.dailyUsage.get(todayKey) || 0;

    // Enforce 10 generations per day
    if (currentCount >= PRO_DAILY_LIMIT) {
      return {
        allowed: false,
        isPro: true,
        remainingToday: 0,
        dayNumber,
        expiresAt: pass.expiresAt,
        message: `You've used all 10 Pro generations for today! Your daily limit resets tomorrow (Day ${dayNumber} of 10).`,
      };
    }

    // Record usage
    pass.dailyUsage.set(todayKey, currentCount + 1);
    const remainingToday = PRO_DAILY_LIMIT - (currentCount + 1);

    return {
      allowed: true,
      isPro: true,
      remainingToday,
      dayNumber,
      expiresAt: pass.expiresAt,
    };
  }

  // ==========================================
  // 2. FREE TIER (IP-based limit: 3/day)
  // ==========================================
  // Developer whitelist for localhost / local LAN testing
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost" || ip.startsWith("192.168.")) {
    return {
      allowed: true,
      isPro: false,
      remainingToday: 999,
    };
  }

  const now = Date.now();
  let record = freeTierMap.get(ip);

  if (!record) {
    record = { hourlyTimestamps: [], dailyTimestamps: [] };
    freeTierMap.set(ip, record);
  }

  record.dailyTimestamps = record.dailyTimestamps.filter(t => now - t < DAY_MS);

  if (record.dailyTimestamps.length >= FREE_MAX_DAILY) {
    return {
      allowed: false,
      isPro: false,
      message: "You have reached the free preview limit (3 requests per day). Unlock the 10-Day Pro Pass for 10 generations per day!",
    };
  }

  record.dailyTimestamps.push(now);

  return {
    allowed: true,
    isPro: false,
    remainingToday: FREE_MAX_DAILY - record.dailyTimestamps.length,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

// ==========================================
// 3. ADMIN ANALYTICS & AUDIT LOGGING
// ==========================================

export interface TransactionRecord {
  id: string;
  utr: string;
  timestamp: number;
  ip: string;
  amount: number;
  status: "verified" | "flagged";
}

export interface ActivityRecord {
  id: string;
  timestamp: number;
  type: "free_preview" | "pro_generation" | "pro_unlock";
  ip: string;
  utr?: string;
}

const transactions: TransactionRecord[] = [];
const activityList: ActivityRecord[] = [];
const seenIps = new Set<string>();

export function logTransaction(record: Omit<TransactionRecord, "id">) {
  const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  transactions.unshift({ ...record, id });
  if (transactions.length > 100) transactions.pop();
}

export function logActivity(record: Omit<ActivityRecord, "id">) {
  const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  activityList.unshift({ ...record, id });
  seenIps.add(record.ip);
  if (activityList.length > 200) activityList.pop();
}

export function getAdminStats() {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  const totalGenerations = activityList.filter(a => a.type === "free_preview" || a.type === "pro_generation").length;
  const todayGenerations = activityList.filter(a => a.timestamp >= todayTimestamp && (a.type === "free_preview" || a.type === "pro_generation")).length;
  const totalUnlocks = transactions.length;
  const todayUnlocks = transactions.filter(t => t.timestamp >= todayTimestamp).length;

  let activeProCount = 0;
  for (const [, pass] of proPassMap.entries()) {
    if (now <= pass.expiresAt) activeProCount++;
  }

  return {
    totalGenerations,
    todayGenerations,
    totalUnlocks,
    todayUnlocks,
    estimatedRevenue: totalUnlocks * 49,
    todayRevenue: todayUnlocks * 49,
    activeProPasses: activeProCount,
    uniqueVisitors: seenIps.size,
    recentTransactions: transactions.slice(0, 30),
    recentActivity: activityList.slice(0, 30),
  };
}
