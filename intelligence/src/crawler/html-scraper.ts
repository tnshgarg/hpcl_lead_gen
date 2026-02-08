import { logger, logArtifact } from '../lib/logger.js';
import { withRetry, isNetworkError } from '../lib/retry.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { CrawlResult, CrawlError } from '../types/index.js';

/**
 * Fetch options for HTML scraping.
 */
export interface FetchOptions {
  timeout?: number;
  headers?: Record<string, string>;
  followRedirects?: boolean;
  maxSize?: number;
}

/**
 * Default fetch options.
 */
const DEFAULT_OPTIONS: FetchOptions = {
  timeout: env.CRAWL_TIMEOUT_MS,
  followRedirects: true,
  maxSize: env.MAX_PAGE_SIZE_BYTES,
  headers: {
    'User-Agent': 'WIL-Crawler/1.0 (Web Intelligence Layer)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
  },
};

/**
 * URL hash cache for deduplication.
 */
const urlHashCache = new Set<string>();

/**
 * Generate a hash for URL deduplication.
 */
export function hashURL(url: string): string {
  // Normalize URL before hashing
  const normalized = url.toLowerCase().replace(/\/$/, '');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Check if URL has been crawled (deduplication).
 */
export function isURLCrawled(url: string): boolean {
  return urlHashCache.has(hashURL(url));
}

/**
 * Mark URL as crawled.
 */
export function markURLCrawled(url: string): void {
  urlHashCache.add(hashURL(url));
}

/**
 * Clear the URL hash cache.
 */
export function clearURLCache(): void {
  urlHashCache.clear();
}

/**
 * Validate content length against max size limit.
 */
function validateContentLength(
  headers: Headers,
  maxSize: number
): { valid: boolean; size?: number } {
  const contentLength = headers.get('content-length');
  
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > maxSize) {
      return { valid: false, size };
    }
    return { valid: true, size };
  }
  
  return { valid: true };
}

/**
 * Create an AbortController with timeout.
 */
function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  clear: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    controller,
    clear: () => clearTimeout(timeoutId),
  };
}

/**
 * Fetch HTML content from a URL.
 */
export async function fetchHTML(
  url: string,
  options: FetchOptions = {}
): Promise<CrawlResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  const traceId = getTraceId();
  const crawlId = uuidv4();

  // Check for deduplication
  if (isURLCrawled(url)) {
    logger.debug('URL already crawled, skipping', { url, traceId });
    throw new Error(`URL already crawled: ${url}`);
  }

  logger.info('Fetching HTML', { url, crawlId, traceId });

  const { controller, clear } = createTimeoutController(opts.timeout!);

  try {
    const response = await withRetry(
      async () => {
        const res = await fetch(url, {
          method: 'GET',
          headers: opts.headers,
          redirect: opts.followRedirects ? 'follow' : 'manual',
          signal: controller.signal,
        });

        // Validate content length before reading body
        const validation = validateContentLength(res.headers, opts.maxSize!);
        if (!validation.valid) {
          throw new Error(`Content too large: ${validation.size} bytes exceeds ${opts.maxSize} limit`);
        }

        return res;
      },
      {
        maxAttempts: 3,
        baseDelayMs: 1000,
        isRetryable: (error) => {
          if (error instanceof Error && error.name === 'AbortError') {
            return false; // Don't retry timeouts
          }
          return isNetworkError(error);
        },
      }
    );

    clear(); // Clear timeout

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Read body with size limit
    const content = await response.text();

    if (content.length > opts.maxSize!) {
      throw new Error(`Content too large: ${content.length} bytes exceeds ${opts.maxSize} limit`);
    }

    const durationMs = Date.now() - startTime;

    // Mark as crawled for deduplication
    markURLCrawled(url);

    // Extract headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const result: CrawlResult = {
      id: crawlId,
      url,
      content,
      contentType: response.headers.get('content-type') || 'text/html',
      statusCode: response.status,
      headers,
      fetchedAt: new Date(),
      responseTimeMs: durationMs,
    };

    // Log artifact
    const inputHash = hashURL(url).slice(0, 16);
    const outputHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
    
    logArtifact('html-crawl', crawlId, inputHash, outputHash, {
      url,
      contentType: result.contentType,
      statusCode: result.statusCode,
      contentLength: content.length,
      durationMs,
    });

    logger.info('HTML fetched successfully', {
      url,
      crawlId,
      statusCode: result.statusCode,
      contentLength: content.length,
      durationMs,
      traceId,
    });

    return result;
  } catch (error) {
    clear(); // Clear timeout

    const durationMs = Date.now() - startTime;
    
    logger.error('Failed to fetch HTML', {
      url,
      crawlId,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });

    throw error;
  }
}

/**
 * Create a crawl error for failed operations.
 */
export function createCrawlError(
  url: string,
  error: Error,
  statusCode?: number
): CrawlError {
  let errorType: CrawlError['errorType'] = 'unknown';

  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    errorType = 'timeout';
  } else if (isNetworkError(error)) {
    errorType = 'network';
  } else if (error.message.includes('rate limit') || error.message.includes('429')) {
    errorType = 'rate_limit';
  } else if (error.message.includes('parse') || error.message.includes('Content too large')) {
    errorType = 'parse';
  }

  const crawlError: CrawlError = {
    id: uuidv4(),
    url,
    errorType,
    message: error.message,
    retryable: errorType === 'network' || errorType === 'timeout' || errorType === 'retry_limit',
    timestamp: new Date(),
  };

  if (statusCode !== undefined) {
    crawlError.statusCode = statusCode;
  }

  return crawlError;
}

/**
 * Batch fetch multiple URLs.
 */
export async function batchFetchHTML(
  urls: string[],
  options: FetchOptions & { concurrency?: number } = {}
): Promise<{ results: CrawlResult[]; errors: CrawlError[] }> {
  const concurrency = options.concurrency ?? env.MAX_CONCURRENT_CRAWLS;
  const results: CrawlResult[] = [];
  const errors: CrawlError[] = [];

  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((url) => fetchHTML(url, options))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const url = batch[j];

      if (!url) continue;

      if (result?.status === 'fulfilled') {
        results.push(result.value);
      } else if (result?.status === 'rejected') {
        errors.push(createCrawlError(url, result.reason));
      }
    }
  }

  logger.info('Batch fetch completed', {
    total: urls.length,
    success: results.length,
    failed: errors.length,
  });

  return { results, errors };
}
