import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Environment configuration schema with Zod validation.
 * All thresholds configurable - no magic constants.
 */
const envSchema = z.object({
  // Database Configuration
  POSTGRES_HOST: z.string().default('127.0.0.1'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().default('wil'),
  POSTGRES_PASSWORD: z.string().default('wil_secure_password'),
  POSTGRES_DB: z.string().default('web_intelligence'),

  // Redis Configuration
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Qdrant Configuration
  QDRANT_HOST: z.string().default('127.0.0.1'),
  QDRANT_PORT: z.coerce.number().default(6333),
  QDRANT_API_KEY: z.string().optional(),

  // Google Gemini Configuration
  GEMINI_API_KEY: z.string().optional(),

  // Application Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  PORT: z.coerce.number().default(3000),

  // Crawler Configuration
  MAX_CONCURRENT_CRAWLS: z.coerce.number().default(5),
  CRAWL_TIMEOUT_MS: z.coerce.number().default(30000),
  MAX_PAGE_SIZE_BYTES: z.coerce.number().default(5 * 1024 * 1024), // 5MB

  // Rate Limiting
  DEFAULT_RATE_LIMIT_PER_DOMAIN: z.coerce.number().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  // Embedding Configuration
  EMBEDDING_MODEL: z.string().default('Xenova/multilingual-e5-small'),
  EMBEDDING_BATCH_SIZE: z.coerce.number().default(32),

  // Queue Configuration
  QUEUE_CONCURRENCY: z.coerce.number().default(10),
  JOB_RETRY_ATTEMPTS: z.coerce.number().default(3),
  JOB_RETRY_DELAY_MS: z.coerce.number().default(5000),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Parse and validate environment configuration.
 * Fails fast with clear error messages if config is invalid.
 */
function parseEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`Environment configuration validation failed:\n${errors}`);
  }

  return result.data;
}

/**
 * Singleton environment configuration instance.
 * Type-safe access to all configuration values.
 */
export const env = parseEnv();

/**
 * Get PostgreSQL connection string.
 */
export function getPostgresConnectionString(): string {
  return `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
}

/**
 * Get Redis connection options.
 */
export function getRedisConnectionOptions() {
  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Required for BullMQ
  };
}

/**
 * Get Qdrant connection options.
 */
export function getQdrantConnectionOptions() {
  return {
    host: env.QDRANT_HOST,
    port: env.QDRANT_PORT,
    apiKey: env.QDRANT_API_KEY || undefined,
  };
}

/**
 * Check if running in production mode.
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

/**
 * Check if running in development mode.
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}
