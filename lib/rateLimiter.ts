/**
 * In-Memory Sliding Window IP Rate Limiter for Next.js App Router
 * Limits each IP address to at most 3 requests per hour and 10 requests per day.
 */

interface RateLimitRecord {
  hourlyTimestamps: number[];
  dailyTimestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const MAX_HOURLY = 3;
const MAX_DAILY = 10;

// Periodic cleanup every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    record.hourlyTimestamps = record.hourlyTimestamps.filter(t => now - t < HOUR_MS);
    record.dailyTimestamps = record.dailyTimestamps.filter(t => now - t < DAY_MS);
    if (record.dailyTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remainingHourly: number;
  remainingDaily: number;
  message?: string;
}

export function checkRateLimit(ip: string): RateLimitResult {
  // Developer whitelist for localhost / local LAN testing
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost" || ip.startsWith("192.168.")) {
    return {
      allowed: true,
      remainingHourly: 999,
      remainingDaily: 999,
    };
  }

  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { hourlyTimestamps: [], dailyTimestamps: [] };
    rateLimitMap.set(ip, record);
  }

  // Filter within sliding windows
  record.hourlyTimestamps = record.hourlyTimestamps.filter(t => now - t < HOUR_MS);
  record.dailyTimestamps = record.dailyTimestamps.filter(t => now - t < DAY_MS);

  // Check limits
  if (record.hourlyTimestamps.length >= MAX_HOURLY || record.dailyTimestamps.length >= MAX_DAILY) {
    return {
      allowed: false,
      remainingHourly: Math.max(0, MAX_HOURLY - record.hourlyTimestamps.length),
      remainingDaily: Math.max(0, MAX_DAILY - record.dailyTimestamps.length),
      message: "You have reached the free preview limit. Please try again later.",
    };
  }

  // Record request
  record.hourlyTimestamps.push(now);
  record.dailyTimestamps.push(now);

  return {
    allowed: true,
    remainingHourly: MAX_HOURLY - record.hourlyTimestamps.length,
    remainingDaily: MAX_DAILY - record.dailyTimestamps.length,
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
