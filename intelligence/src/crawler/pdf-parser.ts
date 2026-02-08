import pdf from 'pdf-parse';
import { logger, logArtifact } from '../lib/logger.js';
import { withRetry, isNetworkError } from '../lib/retry.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { CrawlResult, CrawlError } from '../types/index.js';

/**
 * PDF extraction result.
 */
export interface PDFExtractResult {
  id: string;
  url: string;
  text: string;
  numPages: number;
  metadata: PDFMetadata;
  fetchedAt: Date;
  extractionTimeMs: number;
}

/**
 * PDF metadata structure.
 */
export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

/**
 * Fetch PDF from URL.
 */
async function fetchPDFBuffer(url: string): Promise<Buffer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.CRAWL_TIMEOUT_MS);

  try {
    const response = await withRetry(
      async () => {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'WIL-Crawler/1.0 (Web Intelligence Layer)',
            'Accept': 'application/pdf',
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        // Check content type
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('pdf')) {
          throw new Error(`Expected PDF but got ${contentType}`);
        }

        // Check size limit
        const contentLength = res.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > env.MAX_PAGE_SIZE_BYTES) {
          throw new Error(`PDF too large: ${contentLength} bytes`);
        }

        return res.arrayBuffer();
      },
      {
        maxAttempts: 3,
        baseDelayMs: 1000,
        isRetryable: isNetworkError,
      }
    );

    clearTimeout(timeoutId);
    return Buffer.from(response);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Parse PDF metadata from pdf-parse output.
 */
function parsePDFMetadata(info: Record<string, unknown>): PDFMetadata {
  const metadata: PDFMetadata = {};

  if (typeof info['Title'] === 'string') metadata.title = info['Title'];
  if (typeof info['Author'] === 'string') metadata.author = info['Author'];
  if (typeof info['Subject'] === 'string') metadata.subject = info['Subject'];
  if (typeof info['Keywords'] === 'string') metadata.keywords = info['Keywords'];
  if (typeof info['Creator'] === 'string') metadata.creator = info['Creator'];
  if (typeof info['Producer'] === 'string') metadata.producer = info['Producer'];

  // Parse dates if present
  if (typeof info['CreationDate'] === 'string') {
    try {
      metadata.creationDate = parsePDFDate(info['CreationDate']);
    } catch { /* ignore */ }
  }
  if (typeof info['ModDate'] === 'string') {
    try {
      metadata.modificationDate = parsePDFDate(info['ModDate']);
    } catch { /* ignore */ }
  }

  return metadata;
}

/**
 * Parse PDF date string (D:YYYYMMDDHHmmss format).
 */
function parsePDFDate(dateStr: string): Date {
  // PDF dates are in format: D:YYYYMMDDHHmmssOHH'mm'
  const cleaned = dateStr.replace(/^D:/, '');
  const year = parseInt(cleaned.slice(0, 4), 10);
  const month = parseInt(cleaned.slice(4, 6), 10) - 1;
  const day = parseInt(cleaned.slice(6, 8), 10);
  const hour = parseInt(cleaned.slice(8, 10), 10) || 0;
  const minute = parseInt(cleaned.slice(10, 12), 10) || 0;
  const second = parseInt(cleaned.slice(12, 14), 10) || 0;

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Extract text and metadata from a PDF URL.
 */
export async function extractPDF(url: string): Promise<PDFExtractResult> {
  const startTime = Date.now();
  const traceId = getTraceId();
  const extractionId = uuidv4();

  logger.info('Extracting PDF', { url, extractionId, traceId });

  try {
    // Fetch PDF buffer
    const buffer = await fetchPDFBuffer(url);

    // Parse PDF
    const data = await pdf(buffer, {
      // Options to speed up parsing
      max: 0, // No page limit
    });

    const result: PDFExtractResult = {
      id: extractionId,
      url,
      text: data.text,
      numPages: data.numpages,
      metadata: parsePDFMetadata(data.info as Record<string, unknown>),
      fetchedAt: new Date(),
      extractionTimeMs: Date.now() - startTime,
    };

    // Log artifact
    const inputHash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
    const outputHash = crypto.createHash('sha256').update(data.text).digest('hex').slice(0, 16);

    logArtifact('pdf-extract', extractionId, inputHash, outputHash, {
      url,
      numPages: result.numPages,
      textLength: result.text.length,
      extractionTimeMs: result.extractionTimeMs,
    });

    logger.info('PDF extracted successfully', {
      url,
      extractionId,
      numPages: result.numPages,
      textLength: result.text.length,
      extractionTimeMs: result.extractionTimeMs,
      traceId,
    });

    return result;
  } catch (error) {
    const extractionTimeMs = Date.now() - startTime;

    logger.error('Failed to extract PDF', {
      url,
      extractionId,
      extractionTimeMs,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });

    throw error;
  }
}

/**
 * Convert PDF extraction result to a crawl result.
 */
export function pdfToCrawlResult(pdfResult: PDFExtractResult): CrawlResult {
  return {
    id: pdfResult.id,
    url: pdfResult.url,
    content: pdfResult.text,
    contentType: 'application/pdf',
    statusCode: 200,
    headers: {
      'x-source': 'pdf',
      'x-num-pages': String(pdfResult.numPages),
    },
    fetchedAt: pdfResult.fetchedAt,
    responseTimeMs: pdfResult.extractionTimeMs,
  };
}

/**
 * Create crawl error for PDF failures.
 */
export function createPDFError(url: string, error: Error): CrawlError {
  return {
    id: uuidv4(),
    url,
    errorType: isNetworkError(error) ? 'network' : 'parse',
    message: error.message,
    retryable: isNetworkError(error),
    timestamp: new Date(),
  };
}

/**
 * Check if a URL points to a PDF.
 */
export function isPDFUrl(url: string): boolean {
  const lowercaseUrl = url.toLowerCase();
  return lowercaseUrl.endsWith('.pdf') || lowercaseUrl.includes('/pdf/');
}

/**
 * Batch extract multiple PDFs.
 */
export async function batchExtractPDF(
  urls: string[],
  concurrency: number = 3
): Promise<{ results: PDFExtractResult[]; errors: CrawlError[] }> {
  const results: PDFExtractResult[] = [];
  const errors: CrawlError[] = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((url) => extractPDF(url))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const url = batch[j];

      if (!url) continue;

      if (result?.status === 'fulfilled') {
        results.push(result.value);
      } else if (result?.status === 'rejected') {
        errors.push(createPDFError(url, result.reason));
      }
    }
  }

  logger.info('Batch PDF extraction completed', {
    total: urls.length,
    success: results.length,
    failed: errors.length,
  });

  return { results, errors };
}
