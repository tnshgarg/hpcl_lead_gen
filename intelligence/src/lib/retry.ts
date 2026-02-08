import { logger } from './logger.js';
import { getTraceId } from './tracing.js';

/**
 * Retry configuration options.
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Base delay in milliseconds between retries */
  baseDelayMs: number;
  /** Maximum delay in milliseconds */
  maxDelayMs: number;
  /** Multiplier for exponential backoff */
  backoffMultiplier: number;
  /** Whether to add random jitter to delays */
  jitter: boolean;
  /** Optional function to determine if error is retryable */
  isRetryable?: (error: unknown) => boolean;
  /** Optional callback for each retry attempt */
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

/**
 * Default retry options with sensible defaults.
 */
export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitter: true,
  isRetryable: () => true,
};

/**
 * Calculate delay for a given attempt using exponential backoff.
 */
export function calculateDelay(
  attempt: number,
  options: Pick<RetryOptions, 'baseDelayMs' | 'maxDelayMs' | 'backoffMultiplier' | 'jitter'>
): number {
  // Exponential backoff: baseDelay * (multiplier ^ attempt)
  const exponentialDelay = options.baseDelayMs * Math.pow(options.backoffMultiplier, attempt - 1);
  
  // Cap at max delay
  let delay = Math.min(exponentialDelay, options.maxDelayMs);
  
  // Add jitter (±25% randomness)
  if (options.jitter) {
    const jitterRange = delay * 0.25;
    delay = delay + (Math.random() * jitterRange * 2 - jitterRange);
  }
  
  return Math.floor(delay);
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with exponential backoff retry logic.
 * 
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns The result of the successful function execution
 * @throws The last error if all retries are exhausted
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  const traceId = getTraceId();

  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (opts.isRetryable && !opts.isRetryable(error)) {
        logger.warn('Non-retryable error encountered', {
          traceId,
          attempt,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }

      // If this was the last attempt, throw
      if (attempt >= opts.maxAttempts) {
        logger.error('All retry attempts exhausted', {
          traceId,
          attempts: opts.maxAttempts,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }

      // Calculate delay for next retry
      const delayMs = calculateDelay(attempt, opts);

      // Log retry attempt
      logger.warn('Retry attempt scheduled', {
        traceId,
        attempt,
        nextAttempt: attempt + 1,
        delayMs,
        error: error instanceof Error ? error.message : String(error),
      });

      // Call optional retry callback
      if (opts.onRetry) {
        opts.onRetry(attempt, error, delayMs);
      }

      // Wait before retrying
      await sleep(delayMs);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Create a retry wrapper with preset options.
 */
export function createRetrier(presetOptions: Partial<RetryOptions>) {
  return <T>(fn: () => Promise<T>, overrideOptions?: Partial<RetryOptions>) => {
    return withRetry(fn, { ...presetOptions, ...overrideOptions });
  };
}

/**
 * Check if an error is a network/timeout error that should be retried.
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('econnrefused') ||
      message.includes('econnreset') ||
      message.includes('etimedout') ||
      message.includes('enotfound') ||
      message.includes('socket hang up') ||
      message.includes('network') ||
      message.includes('timeout')
    );
  }
  return false;
}

/**
 * Check if an error is a rate limit error.
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('rate limit') || message.includes('429') || message.includes('too many requests');
  }
  return false;
}
