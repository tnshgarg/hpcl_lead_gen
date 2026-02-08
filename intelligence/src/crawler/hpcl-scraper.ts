/**
 * HPCL Lead Generation - Web Scraper Engine
 * 
 * Main orchestrator that scrapes all configured data sources
 * and submits content to the processing pipeline.
 */

import { fetchRSSFeed, feedItemsToCrawlResults } from './rss.js';
import { fetchHTML } from './html-scraper.js';
import { submitUrl } from '../pipeline/workers.js';
import { logger } from '../lib/logger.js';
import { getTraceId, withTrace } from '../lib/tracing.js';
import {
  HPCL_DATA_SOURCES,
  getEnabledSources,
  getSourcesByType,
  detectSignalConfidence,
  detectIndustries,
  getProductsForIndustry,
  HPCL_PRODUCTS,
  type HPCLDataSource,
  type HPCLProduct,
} from './hpcl-sources.js';

/**
 * Scrape result for a single source
 */
export interface HPCLScrapeResult {
  sourceId: string;
  sourceName: string;
  sourceType: 'rss' | 'html';
  category: string;
  success: boolean;
  itemsFound: number;
  itemsSubmitted: number;
  jobIds: string[];
  duration: number;
  error?: string;
}

/**
 * Scraped item with HPCL relevance info
 */
export interface HPCLScrapedItem {
  url: string;
  title: string;
  content: string;
  sourceId: string;
  signalConfidence: 'high' | 'medium' | 'low' | null;
  detectedIndustries: string[];
  recommendedProducts: HPCLProduct[];
  publishedAt?: Date;
}

/**
 * Full scraping session result
 */
export interface HPCLScrapingSession {
  sessionId: string;
  startedAt: Date;
  completedAt: Date;
  totalSources: number;
  successfulSources: number;
  failedSources: number;
  totalItemsFound: number;
  totalItemsSubmitted: number;
  results: HPCLScrapeResult[];
}

/**
 * STRICT filter for HPCL relevance - only allows content genuinely relevant to HPCL products
 */
export function isHPCLRelevant(text: string, source: HPCLDataSource): boolean {
  const lowerText = text.toLowerCase();
  
  // BLOCKLIST - Explicitly reject irrelevant industries
  const blockedKeywords = [
    'telecom', '5g rollout', 'arpu', 'spectrum auction',
    'banking', 'rbi', 'repo rate', 'npa', 'credit line', 'loan',
    'insurance', 'fdi', 'lic', 'mutual fund',
    'aviation', 'airline', 'aircraft', 'boeing', 'airbus',
    'entertainment', 'media', 'dth', 'streaming', 'ott',
    'cricket', 'sports', 'ipl',
    'jewellery', 'fashion', 'cosmetics', 'luxury',
    'hotel', 'hospitality', 'tourism', 'restaurant',
    'real estate', 'township', 'housing', 'realty',
    'it services', 'software', 'data centre',
  ];
  
  for (const blocked of blockedKeywords) {
    if (lowerText.includes(blocked)) {
      return false;
    }
  }
  
  // MUST have HPCL-relevant keywords
  const hpclKeywords = [
    // Direct HPCL products
    'diesel', 'hsd', 'high speed diesel',
    'furnace oil', 'fuel oil',
    'bitumen', 'asphalt',
    'lshs', 'low sulphur heavy stock',
    'hexane', 'solvent extraction',
    'kerosene', 'sko',
    'propylene', 'petrochemical',
    'marine fuel', 'bunker fuel', 'bunkering', 'mgo', 'lsfo',
    'ldo', 'light diesel oil',
    'mto', 'mineral turpentine',
    'jbo', 'jute batch oil',
    
    // Target industries (HPCL customers)
    'cement plant', 'cement manufacturing', 'cement capacity', 'clinker',
    'steel plant', 'steel mill', 'blast furnace', 'rolling mill',
    'edible oil', 'solvent extraction plant', 'oil mill', 'refinery',
    'road construction', 'highway', 'nhai', 'expressway', 'road project',
    'captive power', 'power plant', 'thermal power', 'dg set',
    'shipping', 'port', 'vessel', 'maritime', 'cargo ship',
    'paint', 'coating', 'ink', 'pigment',
    'jute mill', 'jute processing',
    'fertilizer', 'urea', 'dap',
    'polymer', 'plastic', 'petrochemical',
    
    // Procurement signals
    'tender', 'rfq', 'request for quotation',
    'procurement', 'supply of fuel', 'rate contract',
    'eoi', 'expression of interest', 'bid',
    
    // Expansion signals for target industries
    'capacity expansion', 'new plant', 'greenfield', 'brownfield',
    'kiln', 'furnace upgrade', 'boiler',
  ];
  
  let matchCount = 0;
  for (const keyword of hpclKeywords) {
    if (lowerText.includes(keyword)) {
      matchCount++;
    }
  }
  
  // Require at least 1 strong match
  return matchCount >= 1;
}

/**
 * Scrape an RSS data source
 */
async function scrapeRSSSource(source: HPCLDataSource, sessionId: string): Promise<HPCLScrapeResult> {
  const startTime = Date.now();
  const result: HPCLScrapeResult = {
    sourceId: source.id,
    sourceName: source.name,
    sourceType: 'rss',
    category: source.category,
    success: false,
    itemsFound: 0,
    itemsSubmitted: 0,
    jobIds: [],
    duration: 0,
  };

  try {
    logger.info('Scraping RSS source', { sourceId: source.id, url: source.url });
    
    const feedResult = await fetchRSSFeed(source.url);
    result.itemsFound = feedResult.itemCount;
    
    // Convert to crawl results and filter for relevance
    const items = feedItemsToCrawlResults(source.url, feedResult.feed.items);
    
    for (const item of items) {
      // Check HPCL relevance
      const text = `${item.url} ${item.content}`;
      
      if (isHPCLRelevant(text, source)) {
        // Submit to pipeline with high priority for tender sources
        const priority = source.category === 'tender' ? 10 : 
                        source.category === 'news' ? 7 : 5;
        
        const jobId = await submitUrl(item.url, {
          sourceType: 'html',
          priority,
          metadata: { hpclSessionId: sessionId },
        });
        
        result.jobIds.push(jobId);
        result.itemsSubmitted++;
        
        logger.debug('Submitted HPCL-relevant item', {
          sourceId: source.id,
          url: item.url,
          jobId,
        });
      }
    }
    
    result.success = true;
    logger.info('RSS source scraped successfully', {
      sourceId: source.id,
      itemsFound: result.itemsFound,
      itemsSubmitted: result.itemsSubmitted,
    });
    
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    logger.error('Failed to scrape RSS source', {
      sourceId: source.id,
      error: result.error,
    });
  }
  
  result.duration = Date.now() - startTime;
  return result;
}

/**
 * Scrape an HTML data source
 */
async function scrapeHTMLSource(source: HPCLDataSource, sessionId: string): Promise<HPCLScrapeResult> {
  const startTime = Date.now();
  const result: HPCLScrapeResult = {
    sourceId: source.id,
    sourceName: source.name,
    sourceType: 'html',
    category: source.category,
    success: false,
    itemsFound: 0,
    itemsSubmitted: 0,
    jobIds: [],
    duration: 0,
  };

  try {
    logger.info('Scraping HTML source', { sourceId: source.id, url: source.url });
    
    // For HTML sources, we submit the main page URL to the pipeline
    // The pipeline will crawl and extract content
    const priority = source.category === 'tender' ? 10 : 
                    source.category === 'directory' ? 6 : 5;
    
    const jobId = await submitUrl(source.url, {
      sourceType: 'html',
      priority,
      metadata: { hpclSessionId: sessionId },
    });
    
    result.jobIds.push(jobId);
    result.itemsFound = 1;
    result.itemsSubmitted = 1;
    result.success = true;
    
    logger.info('HTML source submitted successfully', {
      sourceId: source.id,
      jobId,
    });
    
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    logger.error('Failed to scrape HTML source', {
      sourceId: source.id,
      error: result.error,
    });
  }
  
  result.duration = Date.now() - startTime;
  return result;
}

/**
 * Scrape a single data source
 */
async function scrapeSource(source: HPCLDataSource, sessionId: string): Promise<HPCLScrapeResult> {
  if (source.type === 'rss') {
    return scrapeRSSSource(source, sessionId);
  } else if (source.type === 'html') {
    return scrapeHTMLSource(source, sessionId);
  } else {
    return {
      sourceId: source.id,
      sourceName: source.name,
      sourceType: source.type as 'rss',
      category: source.category,
      success: false,
      itemsFound: 0,
      itemsSubmitted: 0,
      jobIds: [],
      duration: 0,
      error: `Unsupported source type: ${source.type}`,
    };
  }
}

/**
 * Scrape all enabled HPCL data sources
 */
export async function scrapeAllSources(
  options: {
    categories?: string[];
    maxConcurrent?: number;
  } = {}
): Promise<HPCLScrapingSession> {
  const sessionId = `hpcl-${Date.now()}`;
  const startedAt = new Date();
  
  return withTrace(async () => {
    const traceId = getTraceId();
    logger.info('Starting HPCL scraping session', { sessionId, traceId });
    
    // Get sources to scrape
    let sources = getEnabledSources();
    
    // Filter by category if specified
    if (options.categories && options.categories.length > 0) {
      sources = sources.filter(s => options.categories!.includes(s.category));
    }
    
    // Sort by priority (highest first)
    sources.sort((a, b) => b.priority - a.priority);
    
    logger.info('Scraping sources', {
      sessionId,
      totalSources: sources.length,
      sources: sources.map(s => s.id),
    });
    
    const results: HPCLScrapeResult[] = [];
    const maxConcurrent = options.maxConcurrent || 3;
    
    // Process sources in batches
    for (let i = 0; i < sources.length; i += maxConcurrent) {
      const batch = sources.slice(i, i + maxConcurrent);
      const batchResults = await Promise.all(
        batch.map(source => scrapeSource(source, sessionId))
      );
      results.push(...batchResults);
      
      // Small delay between batches to be respectful to servers
      if (i + maxConcurrent < sources.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const completedAt = new Date();
    const session: HPCLScrapingSession = {
      sessionId,
      startedAt,
      completedAt,
      totalSources: sources.length,
      successfulSources: results.filter(r => r.success).length,
      failedSources: results.filter(r => !r.success).length,
      totalItemsFound: results.reduce((sum, r) => sum + r.itemsFound, 0),
      totalItemsSubmitted: results.reduce((sum, r) => sum + r.itemsSubmitted, 0),
      results,
    };
    
    logger.info('HPCL scraping session completed', {
      sessionId,
      duration: completedAt.getTime() - startedAt.getTime(),
      totalSources: session.totalSources,
      successfulSources: session.successfulSources,
      totalItemsSubmitted: session.totalItemsSubmitted,
      traceId,
    });
    
    return session;
  }, sessionId) as Promise<HPCLScrapingSession>;
}

/**
 * Scrape only tender sources (high priority)
 */
export async function scrapeTenderSources(): Promise<HPCLScrapingSession> {
  return scrapeAllSources({ categories: ['tender'] });
}

/**
 * Scrape only news sources
 */
export async function scrapeNewsSources(): Promise<HPCLScrapingSession> {
  return scrapeAllSources({ categories: ['news', 'industry'] });
}

/**
 * Scrape only directory sources
 */
export async function scrapeDirectorySources(): Promise<HPCLScrapingSession> {
  return scrapeAllSources({ categories: ['directory'] });
}

/**
 * Quick scrape - only RSS sources (faster, less resource intensive)
 */
export async function quickScrapeRSS(): Promise<HPCLScrapingSession> {
  const sessionId = `hpcl-quick-${Date.now()}`;
  const startedAt = new Date();
  
  const rssSources = getSourcesByType('rss');
  const results: HPCLScrapeResult[] = [];
  
  for (const source of rssSources) {
    const result = await scrapeRSSSource(source, sessionId);
    results.push(result);
  }
  
  const completedAt = new Date();
  return {
    sessionId,
    startedAt,
    completedAt,
    totalSources: rssSources.length,
    successfulSources: results.filter(r => r.success).length,
    failedSources: results.filter(r => !r.success).length,
    totalItemsFound: results.reduce((sum, r) => sum + r.itemsFound, 0),
    totalItemsSubmitted: results.reduce((sum, r) => sum + r.itemsSubmitted, 0),
    results,
  };
}

/**
 * Get scraping status summary
 */
export function getScrapingSummary(session: HPCLScrapingSession): string {
  const duration = session.completedAt.getTime() - session.startedAt.getTime();
  
  return `
HPCL Scraping Session Summary
=============================
Session ID: ${session.sessionId}
Duration: ${(duration / 1000).toFixed(2)}s

Sources:
  Total: ${session.totalSources}
  Successful: ${session.successfulSources}
  Failed: ${session.failedSources}

Items:
  Found: ${session.totalItemsFound}
  Submitted to Pipeline: ${session.totalItemsSubmitted}

Results by Source:
${session.results.map(r => 
  `  - ${r.sourceName}: ${r.success ? '✅' : '❌'} (${r.itemsSubmitted}/${r.itemsFound} submitted)`
).join('\n')}
`.trim();
}
