import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
}

/**
 * Small fixed-window limiter held in memory. Enough to stop a single client
 * from burning AI credits or spamming replies; it is per-instance, not a
 * distributed quota.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

export function ipFromHeaders(source: Headers): string {
  return (
    source.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    source.get("x-real-ip")?.trim() ||
    "local"
  );
}

/** Throws a user-facing message when the caller has used up its allowance. */
export async function enforceRateLimit(
  scope: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const requestHeaders = await headers();
  const { ok, retryAfterMs } = rateLimit(
    `${scope}:${ipFromHeaders(requestHeaders)}`,
    limit,
    windowMs,
  );

  if (!ok) {
    const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    throw new Error(`Too many requests — please try again in ${seconds}s.`);
  }
}
