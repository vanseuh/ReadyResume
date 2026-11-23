/**
 * In-Memory Sliding Window IP Rate Limiter for Next.js App Router
 * Limits each IP address to at most 5 requests per hour.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

// Automatic garbage collection every 10 minutes to avoid memory buildup
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < WINDOW_MS);
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMinutes: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  // Allow unrestricted testing on localhost / local development so the admin/developer is never locked out
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost" || ip.startsWith("192.168.")) {
    return {
      allowed: true,
      remaining: 999,
      resetInMinutes: 0,
    };
  }

  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  // Filter timestamps within the current sliding 1-hour window
  record.timestamps = record.timestamps.filter(t => now - t < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + WINDOW_MS;
    const resetInMinutes = Math.max(1, Math.ceil((resetTime - now) / 60000));

    return {
      allowed: false,
      remaining: 0,
      resetInMinutes,
    };
  }

  record.timestamps.push(now);
  const remaining = MAX_REQUESTS - record.timestamps.length;

  return {
    allowed: true,
    remaining,
    resetInMinutes: 60,
  };
}

export function getClientIp(req: Request): string {
  // Check standard proxy headers
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
