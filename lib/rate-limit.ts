/**
 * Simple in-memory rate limiter for the AI generation endpoints.
 *
 * Tracks the number of AI generations per user per calendar day.
 * For production, replace with a Redis-backed store (e.g. Upstash).
 *
 * Free plan: 3 generations/day
 * Pro plan:  unlimited
 */

interface BucketEntry {
  count: number;
  resetAt: number; // Unix ms timestamp for midnight of current day
}

const store = new Map<string, BucketEntry>();

function getMidnight(): number {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

export function checkRateLimit(
  userId: string,
  isPro: boolean
): { allowed: boolean; remaining: number; limit: number } {
  const limit = isPro ? Infinity : 3;

  if (isPro) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const now = Date.now();
  let entry = store.get(userId);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: getMidnight() };
    store.set(userId, entry);
  }

  const remaining = Math.max(0, limit - entry.count);

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  entry.count += 1;
  store.set(userId, entry);

  return { allowed: true, remaining: remaining - 1, limit };
}
