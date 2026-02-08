import Redis from 'ioredis';
import { env, getRedisConnectionOptions } from '../config/env.js';
import { logger } from '../lib/logger.js';

/**
 * Redis client instance for caching and general operations.
 */
let redisClient: Redis | null = null;

/**
 * Subscriber client for pub/sub operations.
 */
let subscriberClient: Redis | null = null;

/**
 * Initialize the Redis client.
 */
export function initRedis(): Redis {
  if (redisClient) {
    return redisClient;
  }

  const options = getRedisConnectionOptions();
  redisClient = new Redis({
    ...options,
    retryStrategy: (times) => {
      const delay = Math.min(times * 500, 5000);
      logger.warn('Redis connection retry', { attempt: times, delay });
      return delay;
    },
    maxRetriesPerRequest: null, // Required for BullMQ
  });

  redisClient.on('connect', () => {
    logger.info('Redis client connected', {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    });
  });

  redisClient.on('error', (err) => {
    logger.error('Redis client error', { error: err.message });
  });

  redisClient.on('close', () => {
    logger.debug('Redis connection closed');
  });

  return redisClient;
}

/**
 * Get the Redis client instance.
 * Throws if not initialized.
 */
export function getRedis(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return redisClient;
}

/**
 * Initialize a separate subscriber client for pub/sub.
 */
export function initSubscriber(): Redis {
  if (subscriberClient) {
    return subscriberClient;
  }

  const options = getRedisConnectionOptions();
  subscriberClient = new Redis({
    ...options,
    maxRetriesPerRequest: null,
  });

  subscriberClient.on('connect', () => {
    logger.debug('Redis subscriber connected');
  });

  subscriberClient.on('error', (err) => {
    logger.error('Redis subscriber error', { error: err.message });
  });

  return subscriberClient;
}

/**
 * Get the subscriber client instance.
 */
export function getSubscriber(): Redis {
  if (!subscriberClient) {
    throw new Error('Redis subscriber not initialized. Call initSubscriber() first.');
  }
  return subscriberClient;
}

/**
 * Check Redis connection health.
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const client = getRedis();
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    logger.error('Redis health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Close all Redis connections.
 */
export async function closeRedis(): Promise<void> {
  if (subscriberClient) {
    await subscriberClient.quit();
    subscriberClient = null;
    logger.debug('Redis subscriber closed');
  }

  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis client closed');
  }
}

// ============================================
// Caching Utilities
// ============================================

/**
 * Get a cached value with automatic JSON parsing.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const client = getRedis();
  const value = await client.get(key);

  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

/**
 * Set a cached value with optional TTL.
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  const client = getRedis();
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  if (ttlSeconds) {
    await client.setex(key, ttlSeconds, serialized);
  } else {
    await client.set(key, serialized);
  }
}

/**
 * Delete a cached value.
 */
export async function deleteCached(key: string): Promise<void> {
  const client = getRedis();
  await client.del(key);
}

/**
 * Get or set a cached value with a factory function.
 */
export async function getOrSetCached<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  const cached = await getCached<T>(key);

  if (cached !== null) {
    return cached;
  }

  const value = await factory();
  await setCached(key, value, ttlSeconds);
  return value;
}
