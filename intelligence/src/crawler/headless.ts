import puppeteer, { Browser, Page } from 'puppeteer';
import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { CrawlResult, CrawlError } from '../types/index.js';

/**
 * Browser pool for managing Puppeteer instances.
 */
let browserPool: Browser | null = null;
let browserRefs = 0;

/**
 * Headless rendering options.
 */
export interface HeadlessOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  timeout?: number;
  waitForSelector?: string;
  waitMs?: number;
  userAgent?: string;
  viewport?: { width: number; height: number };
  takeScreenshot?: boolean;
}

/**
 * Headless rendering result.
 */
export interface HeadlessResult extends CrawlResult {
  screenshot?: Buffer;
  finalUrl: string;
  jsEnabled: boolean;
}

/**
 * Default headless options.
 */
const DEFAULT_OPTIONS: HeadlessOptions = {
  waitUntil: 'networkidle2',
  timeout: env.CRAWL_TIMEOUT_MS,
  userAgent: 'WIL-Crawler/1.0 (Web Intelligence Layer)',
  viewport: { width: 1920, height: 1080 },
  takeScreenshot: false,
};

/**
 * Initialize or get the browser pool.
 */
async function getBrowser(): Promise<Browser> {
  if (!browserPool || !browserPool.connected) {
    logger.info('Launching headless browser...');
    browserPool = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ],
    });
    logger.info('Headless browser launched');
  }
  browserRefs++;
  return browserPool;
}

/**
 * Release browser reference.
 */
function releaseBrowser(): void {
  browserRefs--;
}

/**
 * Close the browser pool.
 */
export async function closeBrowserPool(): Promise<void> {
  if (browserPool && browserPool.connected) {
    await browserPool.close();
    browserPool = null;
    browserRefs = 0;
    logger.info('Browser pool closed');
  }
}

/**
 * Render a page with JavaScript execution.
 */
export async function renderPage(
  url: string,
  options: HeadlessOptions = {}
): Promise<HeadlessResult> {
  const startTime = Date.now();
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const traceId = getTraceId();
  const crawlId = uuidv4();

  logger.info('Rendering page with headless browser', { url, crawlId, traceId });

  const browser = await getBrowser();
  let page: Page | null = null;

  try {
    page = await browser.newPage();

    // Set viewport
    if (opts.viewport) {
      await page.setViewport(opts.viewport);
    }

    // Set user agent
    if (opts.userAgent) {
      await page.setUserAgent(opts.userAgent);
    }

    // Navigate to URL
    const response = await page.goto(url, {
      waitUntil: opts.waitUntil,
      timeout: opts.timeout,
    });

    if (!response) {
      throw new Error('No response received');
    }

    // Wait for specific selector if provided
    if (opts.waitForSelector) {
      await page.waitForSelector(opts.waitForSelector, {
        timeout: opts.timeout,
      });
    }

    // Additional wait if specified
    if (opts.waitMs) {
      await new Promise((resolve) => setTimeout(resolve, opts.waitMs));
    }

    // Get page content after JS execution
    const content = await page.content();
    const finalUrl = page.url();

    // Validate content size
    if (content.length > env.MAX_PAGE_SIZE_BYTES) {
      throw new Error(`Content too large: ${content.length} bytes`);
    }

    // Take screenshot if requested
    let screenshot: Buffer | undefined;
    if (opts.takeScreenshot) {
      screenshot = Buffer.from(await page.screenshot({
        type: 'png',
        fullPage: false,
      }));
    }

    // Get response headers
    const headers: Record<string, string> = {};
    const responseHeaders = response.headers();
    for (const [key, value] of Object.entries(responseHeaders)) {
      headers[key] = value;
    }

    const durationMs = Date.now() - startTime;

    const result: HeadlessResult = {
      id: crawlId,
      url,
      content,
      contentType: headers['content-type'] || 'text/html',
      statusCode: response.status(),
      headers,
      fetchedAt: new Date(),
      responseTimeMs: durationMs,
      screenshot,
      finalUrl,
      jsEnabled: true,
    };

    // Log artifact
    const inputHash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
    const outputHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);

    logArtifact('headless-render', crawlId, inputHash, outputHash, {
      url,
      finalUrl,
      statusCode: result.statusCode,
      contentLength: content.length,
      durationMs,
      hadRedirect: url !== finalUrl,
    });

    logger.info('Page rendered successfully', {
      url,
      finalUrl,
      crawlId,
      statusCode: result.statusCode,
      contentLength: content.length,
      durationMs,
      traceId,
    });

    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;

    logger.error('Failed to render page', {
      url,
      crawlId,
      durationMs,
  error: error instanceof Error ? error.message : String(error),
      traceId,
    });

    throw error;
  } finally {
    if (page) {
      // Remove all listeners to prevent memory leaks
      page.removeAllListeners();
      await page.close().catch((err) => {
        logger.warn('Failed to close page', { error: err.message, traceId });
      });
    }
    releaseBrowser();
  }
}

/**
 * Check if a page requires JavaScript rendering.
 * Uses heuristics to detect SPA/dynamic content.
 */
export async function requiresJSRendering(html: string): Promise<boolean> {
  // Check for common SPA frameworks
  const spaIndicators = [
    'ng-app',
    'ng-controller',
    'data-reactroot',
    'data-reactid',
    '__NEXT_DATA__',
    '__NUXT__',
    'v-app',
    'data-v-',
    'id="app"',
    'id="root"',
  ];

  const lowercaseHtml = html.toLowerCase();

  // Check if body is nearly empty (SPA placeholder)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1]?.replace(/<script[\s\S]*?<\/script>/gi, '').trim() || '';
    if (bodyContent.length < 500) {
      return true;
    }
  }

  // Check for SPA framework indicators
  for (const indicator of spaIndicators) {
    if (lowercaseHtml.includes(indicator.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Create crawl error for headless failures.
 */
export function createHeadlessError(url: string, error: Error): CrawlError {
  let errorType: CrawlError['errorType'] = 'unknown';

  const message = error.message.toLowerCase();
  if (message.includes('timeout')) {
    errorType = 'timeout';
  } else if (message.includes('net::') || message.includes('network')) {
    errorType = 'network';
  }

  return {
    id: uuidv4(),
    url,
    errorType,
    message: error.message,
    retryable: errorType === 'timeout' || errorType === 'network',
    timestamp: new Date(),
  };
}

/**
 * Batch render multiple pages.
 */
export async function batchRenderPages(
  urls: string[],
  options: HeadlessOptions & { concurrency?: number } = {}
): Promise<{ results: HeadlessResult[]; errors: CrawlError[] }> {
  const concurrency = options.concurrency ?? 3; // Lower for headless
  const results: HeadlessResult[] = [];
  const errors: CrawlError[] = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((url) => renderPage(url, options))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const url = batch[j];

      if (!url) continue;

      if (result?.status === 'fulfilled') {
        results.push(result.value);
      } else if (result?.status === 'rejected') {
        errors.push(createHeadlessError(url, result.reason));
      }
    }
  }

  logger.info('Batch headless rendering completed', {
    total: urls.length,
    success: results.length,
    failed: errors.length,
  });

  return { results, errors };
}
