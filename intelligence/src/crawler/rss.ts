import RSSParser from 'rss-parser';
import { logger, logArtifact } from '../lib/logger.js';
import { withRetry, isNetworkError } from '../lib/retry.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { CrawlResult, CrawlError } from '../types/index.js';

/**
 * RSS feed item structure.
 */
export interface RSSFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  categories?: string[];
  guid?: string;
}

/**
 * RSS feed structure.
 */
export interface RSSFeed {
  title?: string;
  description?: string;
  link?: string;
  language?: string;
  lastBuildDate?: string;
  items: RSSFeedItem[];
}

/**
 * RSS ingestion result.
 */
export interface RSSIngestionResult {
  feedUrl: string;
  feed: RSSFeed;
  itemCount: number;
  fetchedAt: Date;
  durationMs: number;
}

// Create RSS parser instance
const parser = new RSSParser({
  timeout: env.CRAWL_TIMEOUT_MS,
  headers: {
    'User-Agent': 'WIL-Crawler/1.0 (Web Intelligence Layer)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
});

/**
 * Fetch and parse an RSS feed.
 */
export async function fetchRSSFeed(feedUrl: string): Promise<RSSIngestionResult> {
  const startTime = Date.now();
  const traceId = getTraceId();

  logger.info('Fetching RSS feed', { feedUrl, traceId });

  try {
    const feed = await withRetry(
      async () => {
        return parser.parseURL(feedUrl);
      },
      {
        maxAttempts: 3,
        baseDelayMs: 1000,
        isRetryable: isNetworkError,
      }
    );

    const result: RSSIngestionResult = {
      feedUrl,
      feed: {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        language: feed.language,
        lastBuildDate: feed.lastBuildDate,
        items: feed.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.content,
          contentSnippet: item.contentSnippet,
          creator: item.creator,
          categories: item.categories,
          guid: item.guid,
        })),
      },
      itemCount: feed.items.length,
      fetchedAt: new Date(),
      durationMs: Date.now() - startTime,
    };

    // Log artifact for reproducibility
    const inputHash = crypto.createHash('sha256').update(feedUrl).digest('hex').slice(0, 16);
    const outputHash = crypto.createHash('sha256').update(JSON.stringify(result.feed)).digest('hex').slice(0, 16);
    
    logArtifact('rss-feed', uuidv4(), inputHash, outputHash, {
      feedUrl,
      itemCount: result.itemCount,
      durationMs: result.durationMs,
    });

    logger.info('RSS feed fetched successfully', {
      feedUrl,
      itemCount: result.itemCount,
      durationMs: result.durationMs,
      traceId,
    });

    return result;
  } catch (error) {
    logger.error('Failed to fetch RSS feed', {
      feedUrl,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    throw error;
  }
}

/**
 * Extract URLs from RSS feed items.
 */
export function extractURLsFromFeed(feed: RSSFeed): string[] {
  return feed.items
    .map((item) => item.link)
    .filter((link): link is string => Boolean(link));
}

/**
 * Convert RSS feed items to crawl results for processing.
 */
export function feedItemsToCrawlResults(
  feedUrl: string,
  items: RSSFeedItem[]
): CrawlResult[] {
  return items
    .filter((item) => item.link && (item.content || item.contentSnippet))
    .map((item) => ({
      id: uuidv4(),
      url: item.link!,
      content: item.content || item.contentSnippet || '',
      contentType: 'text/html',
      statusCode: 200,
      headers: {
        'x-source': 'rss',
        'x-feed-url': feedUrl,
      },
      fetchedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      responseTimeMs: 0,
    }));
}

/**
 * Create a crawl error for failed RSS operations.
 */
export function createRSSError(
  feedUrl: string,
  error: Error
): CrawlError {
  return {
    id: uuidv4(),
    url: feedUrl,
    errorType: isNetworkError(error) ? 'network' : 'parse',
    message: error.message,
    retryable: isNetworkError(error),
    timestamp: new Date(),
  };
}
