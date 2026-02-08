import robotsParser from 'robots-parser';
import { logger } from '../lib/logger.js';
import { withRetry, isNetworkError } from '../lib/retry.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { getCached, setCached } from '../db/redis.js';

/**
 * Robots.txt cache TTL in seconds.
 */
const ROBOTS_CACHE_TTL = 3600; // 1 hour

/**
 * User agent for the crawler.
 */
const USER_AGENT = 'WIL-Crawler';

/**
 * Robots.txt parse result.
 */
export interface RobotsResult {
  allowed: boolean;
  crawlDelay?: number;
  sitemaps: string[];
}

/**
 * Get the robots.txt URL for a given page URL.
 */
export function getRobotsUrl(pageUrl: string): string {
  const url = new URL(pageUrl);
  return `${url.protocol}//${url.host}/robots.txt`;
}

/**
 * Cache key for robots.txt.
 */
function getRobotsCacheKey(domain: string): string {
  return `robots:${domain}`;
}

/**
 * Fetch robots.txt content from a domain.
 */
async function fetchRobotsTxt(robotsUrl: string): Promise<string | null> {
  const traceId = getTraceId();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.CRAWL_TIMEOUT_MS);

    const response = await withRetry(
      async () => {
        const res = await fetch(robotsUrl, {
          method: 'GET',
          headers: {
            'User-Agent': `${USER_AGENT}/1.0`,
            'Accept': 'text/plain',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (res.status === 404) {
            // No robots.txt - allow everything
            return null;
          }
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        return res.text();
      },
      {
        maxAttempts: 2,
        baseDelayMs: 500,
        isRetryable: isNetworkError,
      }
    );

    return response;
  } catch (error) {
    logger.warn('Failed to fetch robots.txt', {
      robotsUrl,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    // On error, assume crawling is allowed
    return null;
  }
}

/**
 * Check if a URL is allowed to be crawled according to robots.txt.
 */
export async function checkRobotsTxt(pageUrl: string): Promise<RobotsResult> {
  const traceId = getTraceId();
  const robotsUrl = getRobotsUrl(pageUrl);
  const domain = new URL(pageUrl).host;
  const cacheKey = getRobotsCacheKey(domain);

  // Check cache first
  const cached = await getCached<{
    content: string | null;
    fetchedAt: string;
  }>(cacheKey);

  let robotsTxt: string | null;

  if (cached) {
    logger.debug('Using cached robots.txt', { domain, traceId });
    robotsTxt = cached.content;
  } else {
    logger.debug('Fetching robots.txt', { robotsUrl, traceId });
    robotsTxt = await fetchRobotsTxt(robotsUrl);

    // Cache the result
    await setCached(
      cacheKey,
      { content: robotsTxt, fetchedAt: new Date().toISOString() },
      ROBOTS_CACHE_TTL
    );
  }

  // If no robots.txt, allow everything
  if (robotsTxt === null) {
    return {
      allowed: true,
      sitemaps: [],
    };
  }

  // Parse the robots.txt
  const robots = robotsParser(robotsUrl, robotsTxt);

  // Check if URL is allowed for our user agent
  const allowed = robots.isAllowed(pageUrl, USER_AGENT) ?? true;

  // Get crawl delay if specified
  const crawlDelay = robots.getCrawlDelay(USER_AGENT);

  // Extract sitemaps
  const sitemaps = robots.getSitemaps();

  logger.debug('Robots.txt check result', {
    domain,
    pageUrl,
    allowed,
    crawlDelay,
    sitemapCount: sitemaps.length,
    traceId,
  });

  return {
    allowed,
    crawlDelay: crawlDelay ?? undefined,
    sitemaps,
  };
}

/**
 * Check multiple URLs against robots.txt (grouped by domain).
 */
export async function checkRobotsTxtBatch(
  urls: string[]
): Promise<Map<string, RobotsResult>> {
  const results = new Map<string, RobotsResult>();

  // Group URLs by domain
  const domainUrls = new Map<string, string[]>();
  for (const url of urls) {
    try {
      const domain = new URL(url).host;
      const existing = domainUrls.get(domain) || [];
      existing.push(url);
      domainUrls.set(domain, existing);
    } catch {
      // Invalid URL, skip
      results.set(url, { allowed: false, sitemaps: [] });
    }
  }

  // Check each domain once, then apply to all URLs
  for (const [domain, domainUrlList] of domainUrls) {
    // Check with the first URL of this domain
    const firstUrl = domainUrlList[0];
    if (!firstUrl) continue;

    const robotsResult = await checkRobotsTxt(firstUrl);

    // Now check each specific URL path
    for (const url of domainUrlList) {
      // Re-check each URL since paths may have different rules
      const specificResult = await checkRobotsTxt(url);
      results.set(url, specificResult);
    }
  }

  return results;
}

/**
 * Filter URLs that are allowed by robots.txt.
 */
export async function filterAllowedUrls(urls: string[]): Promise<{
  allowed: string[];
  blocked: string[];
}> {
  const results = await checkRobotsTxtBatch(urls);

  const allowed: string[] = [];
  const blocked: string[] = [];

  for (const [url, result] of results) {
    if (result.allowed) {
      allowed.push(url);
    } else {
      blocked.push(url);
    }
  }

  logger.info('URLs filtered by robots.txt', {
    total: urls.length,
    allowed: allowed.length,
    blocked: blocked.length,
  });

  return { allowed, blocked };
}
