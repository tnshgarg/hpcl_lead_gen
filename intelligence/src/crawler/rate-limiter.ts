import { getRedis } from '../db/redis.js';
import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';

/**
 * Rate limiter using Redis for distributed rate limiting.
 * Implements a sliding window log algorithm.
 */

/**
 * Rate limit configuration per domain.
 */
export interface RateLimitConfig {
  requestsPerWindow: number;
  windowMs: number;
}

/**
 * Rate limit result.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number; // milliseconds
}

/**
 * Default rate limit configuration.
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  requestsPerWindow: env.DEFAULT_RATE_LIMIT_PER_DOMAIN,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
};

/**
 * Custom rate limits per domain.
 */
const domainConfigs = new Map<string, RateLimitConfig>();

/**
 * Set custom rate limit for a domain.
 */
export function setDomainRateLimit(domain: string, config: Partial<RateLimitConfig>): void {
  domainConfigs.set(domain, {
    ...DEFAULT_CONFIG,
    ...config,
  });
  logger.info('Rate limit updated for domain', { domain, config });
}

/**
 * Get rate limit config for a domain.
 */
export function getDomainRateLimit(domain: string): RateLimitConfig {
  return domainConfigs.get(domain) || DEFAULT_CONFIG;
}

/**
 * Get the rate limit key for a domain.
 */
function getRateLimitKey(domain: string): string {
  return `ratelimit:${domain}`;
}

/**
 * Check if a request to a domain is allowed under rate limits.
 */
export async function checkRateLimit(url: string): Promise<RateLimitResult> {
  const traceId = getTraceId();
  
  let domain: string;
  try {
    domain = new URL(url).host;
  } catch {
    // Invalid URL - block it
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      retryAfter: 0,
    };
  }

  const config = getDomainRateLimit(domain);
  const redis = getRedis();
  const key = getRateLimitKey(domain);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Use a Lua script for atomic operations
  const luaScript = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local windowStart = tonumber(ARGV[2])
    local maxRequests = tonumber(ARGV[3])
    local windowMs = tonumber(ARGV[4])
    
    -- Remove old entries outside the window
    redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)
    
    -- Count current requests in window
    local count = redis.call('ZCARD', key)
    
    if count < maxRequests then
      -- Add new request
      redis.call('ZADD', key, now, now .. '-' .. math.random())
      redis.call('PEXPIRE', key, windowMs)
      return {1, maxRequests - count - 1, 0}
    else
      -- Get oldest entry to calculate retry time
      local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
      local retryAfter = 0
      if #oldest > 0 then
        retryAfter = tonumber(oldest[2]) + windowMs - now
      end
      return {0, 0, retryAfter}
    end
  `;

  const result = await redis.eval(
    luaScript,
    1,
    key,
    now.toString(),
    windowStart.toString(),
    config.requestsPerWindow.toString(),
    config.windowMs.toString()
  ) as [number, number, number];

  const allowed = result[0] === 1;
  const remaining = result[1] ?? 0;
  const retryAfter = result[2] ?? 0;
  const resetAt = new Date(now + config.windowMs);

  if (!allowed) {
    logger.warn('Rate limit exceeded', {
      domain,
      remaining,
      retryAfter,
      resetAt: resetAt.toISOString(),
      traceId,
    });
  } else {
    logger.debug('Rate limit check passed', {
      domain,
      remaining,
      traceId,
    });
  }

  return {
    allowed,
    remaining,
    resetAt,
    retryAfter: allowed ? undefined : Math.max(0, retryAfter),
  };
}

/**
 * Acquire a rate limit slot, waiting if necessary.
 */
export async function acquireRateLimit(
  url: string,
  maxWaitMs: number = 30000
): Promise<boolean> {
  const startTime = Date.now();
  const traceId = getTraceId();

  while (Date.now() - startTime < maxWaitMs) {
    const result = await checkRateLimit(url);

    if (result.allowed) {
      return true;
    }

    // Wait before retrying
    const waitTime = Math.min(result.retryAfter ?? 1000, maxWaitMs - (Date.now() - startTime));
    
    if (waitTime <= 0) {
      break;
    }

    logger.debug('Waiting for rate limit', {
      url,
      waitTime,
      traceId,
    });

    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  logger.warn('Rate limit acquisition timed out', {
    url,
    maxWaitMs,
    traceId,
  });

  return false;
}

/**
 * Get current rate limit status for a domain.
 */
export async function getRateLimitStatus(domain: string): Promise<{
  currentCount: number;
  limit: number;
  windowMs: number;
}> {
  const redis = getRedis();
  const key = getRateLimitKey(domain);
  const config = getDomainRateLimit(domain);
  const windowStart = Date.now() - config.windowMs;

  // Remove old entries and count current
  await redis.zremrangebyscore(key, '-inf', windowStart);
  const currentCount = await redis.zcard(key);

  return {
    currentCount,
    limit: config.requestsPerWindow,
    windowMs: config.windowMs,
  };
}

/**
 * Reset rate limit for a domain (admin function).
 */
export async function resetRateLimit(domain: string): Promise<void> {
  const redis = getRedis();
  const key = getRateLimitKey(domain);
  await redis.del(key);
  logger.info('Rate limit reset', { domain });
}

/**
 * Decorate a function with rate limiting.
 */
export function withRateLimit<T extends unknown[], R>(
  fn: (url: string, ...args: T) => Promise<R>,
  maxWaitMs: number = 30000
): (url: string, ...args: T) => Promise<R> {
  return async (url: string, ...args: T): Promise<R> => {
    const acquired = await acquireRateLimit(url, maxWaitMs);

    if (!acquired) {
      throw new Error(`Rate limit exceeded for ${new URL(url).host}`);
    }

    return fn(url, ...args);
  };
}
