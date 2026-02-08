import { getQueue, addJob, createWorker, closeAllQueues, QUEUE_NAMES, type QueueName } from '../queue/bullmq.js';
import { fetchRSSFeed, feedItemsToCrawlResults } from '../crawler/rss.js';
import { fetchHTML } from '../crawler/html-scraper.js';
import { renderPage, closeBrowserPool, requiresJSRendering } from '../crawler/headless.js';
import { extractPDF, isPDFUrl, pdfToCrawlResult } from '../crawler/pdf-parser.js';
import { checkRobotsTxt } from '../crawler/robots.js';
import { acquireRateLimit } from '../crawler/rate-limiter.js';
import { stripHTML, extractTitle, extractDescription } from '../normalizer/html-strip.js';
import { extractMainContent, detectLanguage, countWords } from '../normalizer/boilerplate.js';
import { normalizeSpacing } from '../normalizer/segmenter.js';
import { normalizeText } from '../normalizer/encoding.js';
import { storeDocumentEmbedding } from '../embeddings/vector-store.js';
import { analyzeDocumentIntent } from '../ai/intent-engine.js';
import { analyzeForHPCL, type HPCLAnalysisResult } from '../ai/hpcl-analyzer.js';
import { generateDossier } from '../dossier/generator.js';
import { query } from '../db/postgres.js';
import { logger } from '../lib/logger.js';
import { withTrace, getTraceId } from '../lib/tracing.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { Job } from 'bullmq';
import type { 
  CrawlResult, 
  ScoringInputs,
  TrustLevel 
} from '../types/index.js';

/**
 * Crawl job data structure.
 */
interface CrawlJobData {
  url: string;
  sourceType: 'html' | 'rss' | 'pdf';
  priority: number;
  metadata?: Record<string, unknown>;
}

/**
 * Normalize job data structure.
 */
interface NormalizeJobData {
  crawlResult: CrawlResult;
  sourceTrust: TrustLevel;
  metadata?: Record<string, unknown>;
}

/**
 * Embed job data structure.
 */
interface EmbedJobData {
  documentId: string;
  text: string;
}

/**
 * Analyze job data structure.
 */
interface AnalyzeJobData {
  documentId: string;
  text: string;
}

/**
 * Stored document structure.
 */
interface StoredDocument {
  id: string;
  url: string;
  hash: string;
  text: string;
  title?: string | undefined;
  description?: string | undefined;
  sourceTrust: TrustLevel;
  language?: string | undefined;
  wordCount: number;
  fetchedAt: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Calculate content hash for deduplication.
 */
function calculateHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Determine source trust level.
 */
function determineSourceTrust(url: string): TrustLevel {
  const trustedDomains = [
    'gov', 'edu', 'nytimes.com', 'bbc.com', 'reuters.com',
    'bloomberg.com', 'wsj.com', 'ft.com', 'economist.com',
  ];
  
  const hostname = new URL(url).hostname.toLowerCase();
  
  if (trustedDomains.some((d) => hostname.includes(d))) {
    return 'high';
  }
  
  if (hostname.includes('wikipedia.org')) return 'medium';
  if (hostname.includes('medium.com')) return 'medium';
  if (hostname.includes('blog') || hostname.includes('wordpress')) return 'low';
  
  return 'unknown';
}

/**
 * Calculate freshness score (0-1, where 1 is very fresh).
 */
function calculateFreshness(fetchedAt: Date, maxAgeDays: number = 30): number {
  const ageMs = Date.now() - fetchedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - (ageDays / maxAgeDays));
}

/**
 * Calculate signal density (entities per 100 words).
 */
function calculateSignalDensity(text: string, entityCount: number): number {
  const wordCount = countWords(text);
  if (wordCount === 0) return 0;
  
  const density = (entityCount / wordCount) * 100;
  return Math.min(density / 5, 1);
}

/**
 * Store document in database.
 */
async function storeDocument(doc: Omit<StoredDocument, 'id'>): Promise<StoredDocument> {
  const id = uuidv4();
  
  const metadata = doc.metadata || {};
  metadata['hash'] = doc.hash;

  await query(
    `INSERT INTO documents (id, url, text, title, description, 
                            source_trust, language, word_count, fetched_at, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (url) DO UPDATE SET
       text = EXCLUDED.text,
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       fetched_at = EXCLUDED.fetched_at,
       metadata = documents.metadata || EXCLUDED.metadata`,
    [
      id,
      doc.url,
      doc.text,
      doc.title,
      doc.description,
      doc.sourceTrust,
      doc.language,
      doc.wordCount,
      doc.fetchedAt,
      metadata,
      new Date(),
    ]
  );

  return { id, ...doc };
}

// ============================================
// Pipeline Workers
// ============================================

/**
 * Crawl worker - fetches content from URLs.
 */
async function processCrawlJob(job: Job<CrawlJobData>): Promise<void> {
  await withTrace(async () => {
    const traceId = getTraceId();
    const { url, sourceType, priority, metadata } = job.data;

    logger.info('Processing crawl job', { jobId: job.id, url, sourceType, traceId });

    try {
      // Check robots.txt
      const robotsResult = await checkRobotsTxt(url);
      if (!robotsResult.allowed) {
        logger.warn('URL blocked by robots.txt', { url, traceId });
        return;
      }

      // Acquire rate limit
      await acquireRateLimit(url);

      let result: CrawlResult;

      // Determine crawl method
      if (isPDFUrl(url)) {
        const pdfResult = await extractPDF(url);
        result = pdfToCrawlResult(pdfResult);
      } else if (sourceType === 'rss') {
        const feed = await fetchRSSFeed(url);
        const items = feedItemsToCrawlResults(feed.feedUrl, feed.feed.items);
        // Queue each item for individual processing
        for (const item of items.slice(0, 50)) {
          await addJob(QUEUE_NAMES.CRAWL, 'crawl-html', {
            url: item.url,
            sourceType: 'html' as const,
            priority: priority || 5,
            metadata,
          });
        }
        return;
      } else {
        // Try static HTML first
        const htmlResult = await fetchHTML(url);
        
        // Check if JS rendering is needed
        if (await requiresJSRendering(htmlResult.content)) {
          logger.debug('Switching to headless rendering', { url, traceId });
          const headlessResult = await renderPage(url);
          result = headlessResult;
        } else {
          result = htmlResult;
        }
      }

      // Queue for normalization
      await addJob(QUEUE_NAMES.NORMALIZE, 'normalize', {
        crawlResult: result,
        sourceTrust: determineSourceTrust(url),
        metadata,
      });

      logger.info('Crawl job completed', { jobId: job.id, url, traceId });
    } catch (error) {
      logger.error('Crawl job failed', {
        jobId: job.id,
        url,
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
      throw error;
    }
  });
}

/**
 * Normalize worker - cleans and structures content.
 */
async function processNormalizeJob(job: Job<NormalizeJobData>): Promise<void> {
  await withTrace(async () => {
    const traceId = getTraceId();
    const { crawlResult, sourceTrust, metadata } = job.data;

    logger.info('Processing normalize job', { 
      jobId: job.id, 
      url: crawlResult.url, 
      traceId 
    });

    try {
      // Normalize encoding
      let content = normalizeText(crawlResult.content);

      // Extract main content (remove boilerplate)
      if (crawlResult.contentType.includes('html')) {
        content = extractMainContent(content);
      }

      // Strip HTML tags
      const text = stripHTML(content);

      // Extract metadata
      // Extract metadata (prefer existing metadata from RSS etc, fallback to extraction)
      const title = crawlResult.title || extractTitle(crawlResult.content);
      const description = crawlResult.description || extractDescription(crawlResult.content);
      const language = detectLanguage(crawlResult.content);

      // Normalize spacing
      const normalizedText = normalizeSpacing(text);
      const wordCount = countWords(normalizedText);

      // Calculate hash for deduplication
      const hash = calculateHash(normalizedText);

      // Check for duplicates

      const existing = await query<{ id: string; word_count: number }>(
        `SELECT id, word_count FROM documents WHERE hash = $1`,
        [hash]
      );

      if (existing.rows.length > 0) {
        logger.info('Duplicate document found, skipping', {
          url: crawlResult.url,
          documentId: existing.rows[0]?.id,
          traceId,
        });

        // Instead of processing, we assume its existing document ID for reference if needed
        // This function is void, so we just return.
        return;
      }

      // Store document
      const doc = await storeDocument({
        url: crawlResult.url,
        hash,
        text: normalizedText,
        title,
        description,
        sourceTrust,
        language,
        wordCount,
        fetchedAt: crawlResult.fetchedAt,
        metadata: {
          ...metadata,
          originalTitle: title,
        },
      });

      // Queue for embedding
      await addJob(QUEUE_NAMES.EMBED, 'embed', { documentId: doc.id, text: normalizedText });

      logger.info('Normalize job completed', {
        jobId: job.id,
        documentId: doc.id,
        wordCount,
        traceId,
      });
    } catch (error) {
      logger.error('Normalize job failed', {
        jobId: job.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        traceId,
      });
      throw error;
    }
  });
}

/**
 * Embed worker - generates and stores embeddings.
 */
async function processEmbedJob(job: Job<EmbedJobData>): Promise<void> {
  await withTrace(async () => {
    const traceId = getTraceId();
    const { documentId, text } = job.data;

    logger.info('Processing embed job', { jobId: job.id, documentId, traceId });

    try {
      // Generate and store embedding
      await storeDocumentEmbedding(documentId, text);

      // Queue for analysis
      await addJob(QUEUE_NAMES.ANALYZE, 'analyze', { documentId, text });

      logger.info('Embed job completed', { jobId: job.id, documentId, traceId });
    } catch (error) {
      logger.error('Embed job failed', {
        jobId: job.id,
        documentId,
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
      throw error;
    }
  });
}

/**
 * Analyze worker - runs intent analysis and generates dossiers.
 */
async function processAnalyzeJob(job: Job<AnalyzeJobData>): Promise<void> {
  await withTrace(async () => {
    const traceId = getTraceId();
    const { documentId, text } = job.data;

    logger.info('Processing analyze job', { jobId: job.id, documentId, traceId });

    try {
      // Get document metadata
      const docResult = await query<{
        url: string;
        source_trust: TrustLevel;
        fetched_at: Date;
        metadata: Record<string, unknown>;
      }>(
        'SELECT url, source_trust, fetched_at, metadata FROM documents WHERE id = $1',
        [documentId]
      );

      const doc = docResult.rows[0];
      if (!doc) {
        throw new Error(`Document not found: ${documentId}`);
      }

      // Analyze intent
      const intent = await analyzeDocumentIntent(documentId, text);

      // Build scoring inputs
      const scoringInputs: ScoringInputs = {
        llmOutput: {
          content: intent.summary,
          confidence: intent.confidence,
          modelVersion: 'gemini-2.0-flash-lite',
          promptVersion: 'v1.0.0',
        },
        sourceTrust: doc.source_trust,
        freshness: calculateFreshness(doc.fetched_at),
        signalDensity: calculateSignalDensity(text, intent.entities.length),
        embeddingSimilarity: 0.5,
      };

      // Run HPCL-specific analysis in parallel
      let hpclAnalysis: HPCLAnalysisResult | null = null;
      try {
        hpclAnalysis = await analyzeForHPCL(text, doc.url, 'news');
        logger.info('HPCL analysis completed', {
          jobId: job.id,
          documentId,
          leadScore: hpclAnalysis.leadScore,
          leadQuality: hpclAnalysis.leadQuality,
          traceId,
        });
      } catch (hpclError) {
        logger.warn('HPCL analysis failed, continuing with generic analysis', {
          jobId: job.id,
          documentId,
          error: hpclError instanceof Error ? hpclError.message : String(hpclError),
          traceId,
        });
      }

      // Generate dossier with HPCL recommendations if available
      const dossier = await generateDossier(
        documentId,
        text,
        doc.url,
        intent,
        scoringInputs,
        hpclAnalysis ?? undefined,
        { metadata: doc.metadata }
      );

      logger.info('Analyze job completed', {
        jobId: job.id,
        documentId,
        dossierId: dossier.id,
        traceId,
      });
    } catch (error) {
      logger.error('Analyze job failed', {
        jobId: job.id,
        documentId,
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
      throw error;
    }
  });
}

/**
 * Initialize all pipeline queues.
 */
export function initPipelineQueues(): void {
  // Just ensure queues exist by getting them
  getQueue(QUEUE_NAMES.CRAWL);
  getQueue(QUEUE_NAMES.NORMALIZE);
  getQueue(QUEUE_NAMES.EMBED);
  getQueue(QUEUE_NAMES.ANALYZE);
  logger.info('Pipeline queues initialized');
}

/**
 * Start all pipeline workers.
 */
export function startPipelineWorkers(concurrency: number = 3): void {
  createWorker(QUEUE_NAMES.CRAWL, processCrawlJob, { concurrency });
  createWorker(QUEUE_NAMES.NORMALIZE, processNormalizeJob, { concurrency });
  createWorker(QUEUE_NAMES.EMBED, processEmbedJob, { concurrency: 2 });
  createWorker(QUEUE_NAMES.ANALYZE, processAnalyzeJob, { concurrency: 2 });

  logger.info('Pipeline workers started', { concurrency });
}

/**
 * Submit a URL for processing.
 */
export async function submitUrl(
  url: string,
  options: {
    sourceType?: 'html' | 'rss' | 'pdf';
    priority?: number;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<string> {
  const job = await addJob(QUEUE_NAMES.CRAWL, 'crawl', {
    url,
    sourceType: options.sourceType || 'html',
    priority: options.priority || 5,
    metadata: options.metadata,
  });

  logger.info('URL submitted for processing', { url, jobId: job.id });

  return job.id ?? '';
}

/**
 * Submit multiple URLs for processing.
 */
export async function submitUrls(
  urls: string[],
  options: {
    sourceType?: 'html' | 'rss' | 'pdf';
    priority?: number;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<string[]> {
  const jobIds: string[] = [];

  for (const url of urls) {
    const jobId = await submitUrl(url, options);
    jobIds.push(jobId);
  }

  return jobIds;
}

/**
 * Shutdown pipeline gracefully.
 */
export async function shutdownPipeline(): Promise<void> {
  logger.info('Shutting down pipeline...');
  
  await closeAllQueues();
  await closeBrowserPool();
  
  logger.info('Pipeline shutdown complete');
}
