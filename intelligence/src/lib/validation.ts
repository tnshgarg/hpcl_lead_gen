import { z, ZodError, ZodSchema } from 'zod';
import { logger } from './logger.js';
import { getTraceId } from './tracing.js';

/**
 * Validation result type for explicit error handling.
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

/**
 * Structured validation error.
 */
export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

/**
 * Convert Zod errors to structured validation errors.
 */
function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
    code: e.code,
  }));
}

/**
 * Validate data against a Zod schema.
 * Returns a discriminated union for explicit error handling.
 */
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = formatZodErrors(result.error);
  logger.warn('Validation failed', {
    traceId: getTraceId(),
    errors,
  });

  return { success: false, errors };
}

/**
 * Validate data and throw if invalid.
 * Use only when failure should stop execution.
 */
export function validateOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  const errors = formatZodErrors(result.error);
  const errorMessage = errors.map((e) => `${e.path}: ${e.message}`).join('; ');
  const fullMessage = context
    ? `Validation failed for ${context}: ${errorMessage}`
    : `Validation failed: ${errorMessage}`;

  logger.error('Validation error', {
    traceId: getTraceId(),
    context,
    errors,
  });

  throw new Error(fullMessage);
}

// ============================================
// Common Schema Patterns
// ============================================

/**
 * Non-empty string schema.
 */
export const nonEmptyString = z.string().min(1, 'String cannot be empty');

/**
 * URL schema with validation.
 */
export const urlSchema = z.string().url('Invalid URL format');

/**
 * Positive integer schema.
 */
export const positiveInt = z.number().int().positive();

/**
 * Non-negative integer schema.
 */
export const nonNegativeInt = z.number().int().nonnegative();

/**
 * Timestamp schema (ISO 8601 string or Date).
 */
export const timestamp = z.union([z.string().datetime(), z.date()]).transform((val) => {
  return typeof val === 'string' ? new Date(val) : val;
});

/**
 * UUID schema.
 */
export const uuid = z.string().uuid();

/**
 * Email schema.
 */
export const email = z.string().email();

/**
 * Score between 0 and 1.
 */
export const score = z.number().min(0).max(1);

/**
 * Trust level enum.
 */
export const trustLevel = z.enum(['high', 'medium', 'low', 'unknown']);

// ============================================
// Document Schemas
// ============================================

/**
 * Document record schema as defined in the implementation plan.
 */
export const documentRecordSchema = z.object({
  id: uuid,
  url: urlSchema,
  text: z.string(),
  rawText: z.string().optional(),
  metadata: z.record(z.unknown()),
  sourceTrust: trustLevel,
  fetchedAt: timestamp,
  normalizedAt: timestamp.optional(),
  embeddingVersion: z.string().optional(),
});

export type DocumentRecord = z.infer<typeof documentRecordSchema>;

/**
 * Crawl job schema for queue processing.
 */
export const crawlJobSchema = z.object({
  id: uuid,
  url: urlSchema,
  priority: z.number().int().min(0).max(10).default(5),
  retryCount: nonNegativeInt.default(0),
  maxRetries: positiveInt.default(3),
  createdAt: timestamp,
  metadata: z.record(z.unknown()).optional(),
});

export type CrawlJob = z.infer<typeof crawlJobSchema>;

/**
 * LLM response schema with confidence scoring.
 */
export const llmResponseSchema = z.object({
  content: z.unknown(),
  confidence: score,
  reasoning: z.string().optional(),
  modelVersion: z.string(),
  promptVersion: z.string(),
  tokensUsed: positiveInt.optional(),
});

export type LLMResponse = z.infer<typeof llmResponseSchema>;

/**
 * Embedding record schema.
 */
export const embeddingRecordSchema = z.object({
  documentId: uuid,
  vector: z.array(z.number()),
  modelVersion: z.string(),
  createdAt: timestamp,
});

export type EmbeddingRecord = z.infer<typeof embeddingRecordSchema>;

// ============================================
// Schema Factory Utilities
// ============================================

/**
 * Create a paginated response schema.
 */
export function paginatedSchema<T extends ZodSchema>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: nonNegativeInt,
    page: positiveInt,
    pageSize: positiveInt,
    hasMore: z.boolean(),
  });
}

/**
 * Create an API response wrapper schema.
 */
export function apiResponseSchema<T extends ZodSchema>(dataSchema: T) {
  return z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: dataSchema,
      traceId: uuid.optional(),
    }),
    z.object({
      success: z.literal(false),
      error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.unknown()).optional(),
      }),
      traceId: uuid.optional(),
    }),
  ]);
}
