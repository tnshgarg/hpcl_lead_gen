import * as cheerio from 'cheerio';
import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';

/**
 * Boilerplate removal options.
 */
export interface BoilerplateOptions {
  minBlockLength?: number;
  minLinkDensity?: number;
  removeNavigation?: boolean;
  removeFooter?: boolean;
  removeHeader?: boolean;
  removeSidebar?: boolean;
}

/**
 * Default boilerplate options.
 */
const DEFAULT_OPTIONS: BoilerplateOptions = {
  minBlockLength: 50,
  minLinkDensity: 0.5,
  removeNavigation: true,
  removeFooter: true,
  removeHeader: true,
  removeSidebar: true,
};

/**
 * Common boilerplate selectors.
 */
const BOILERPLATE_SELECTORS = {
  navigation: [
    'nav',
    '[role="navigation"]',
    '.nav',
    '.navbar',
    '.navigation',
    '.menu',
    '.main-menu',
    '#nav',
    '#navigation',
    '#menu',
  ],
  header: [
    'header',
    '[role="banner"]',
    '.header',
    '.site-header',
    '.page-header',
    '#header',
  ],
  footer: [
    'footer',
    '[role="contentinfo"]',
    '.footer',
    '.site-footer',
    '.page-footer',
    '#footer',
  ],
  sidebar: [
    'aside',
    '[role="complementary"]',
    '.sidebar',
    '.side-bar',
    '.widget-area',
    '#sidebar',
  ],
  other: [
    '.cookie-banner',
    '.cookie-notice',
    '.popup',
    '.modal',
    '.advertisement',
    '.ad',
    '.ads',
    '.social-share',
    '.share-buttons',
    '.breadcrumb',
    '.breadcrumbs',
    '.comments',
    '.comment-section',
    '.related-posts',
    '.recommended',
    '.newsletter',
    '.subscribe',
    '#comments',
  ],
};

/**
 * Content selectors (likely to contain main content).
 */
const CONTENT_SELECTORS = [
  'article',
  '[role="main"]',
  'main',
  '.content',
  '.main-content',
  '.post-content',
  '.article-content',
  '.entry-content',
  '.post-body',
  '.article-body',
  '#content',
  '#main-content',
  '#main',
];

/**
 * Calculate text-to-link ratio for an element.
 */
function calculateLinkDensity($: cheerio.CheerioAPI, element: cheerio.Element): number {
  const $el = $(element);
  const text = $el.text();
  const textLength = text.length;

  if (textLength === 0) return 1;

  let linkTextLength = 0;
  $el.find('a').each((_, link) => {
    linkTextLength += $(link).text().length;
  });

  return linkTextLength / textLength;
}

/**
 * Score a block element based on content signals.
 */
function scoreBlock($: cheerio.CheerioAPI, element: cheerio.Element): number {
  const $el = $(element);
  let score = 0;

  // Text length bonus
  const text = $el.text().trim();
  score += Math.min(text.length / 100, 10);

  // Paragraph bonus
  score += $el.find('p').length * 2;

  // Link density penalty
  const linkDensity = calculateLinkDensity($, element);
  score -= linkDensity * 10;

  // Header presence bonus
  if ($el.find('h1, h2, h3').length > 0) {
    score += 3;
  }

  // Short text penalty
  if (text.length < 100) {
    score -= 5;
  }

  // Class/ID hints
  const classId = ($el.attr('class') || '') + ' ' + ($el.attr('id') || '');
  const classIdLower = classId.toLowerCase();

  if (/article|content|post|entry|text|body|main/i.test(classIdLower)) {
    score += 5;
  }
  if (/nav|menu|sidebar|footer|header|ad|comment|share/i.test(classIdLower)) {
    score -= 5;
  }

  return score;
}

/**
 * Remove boilerplate elements from HTML.
 */
export function removeBoilerplate(
  html: string,
  options: BoilerplateOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const traceId = getTraceId();

  try {
    const $ = cheerio.load(html);

    // Remove navigation
    if (opts.removeNavigation) {
      for (const selector of BOILERPLATE_SELECTORS.navigation) {
        $(selector).remove();
      }
    }

    // Remove header
    if (opts.removeHeader) {
      for (const selector of BOILERPLATE_SELECTORS.header) {
        $(selector).remove();
      }
    }

    // Remove footer
    if (opts.removeFooter) {
      for (const selector of BOILERPLATE_SELECTORS.footer) {
        $(selector).remove();
      }
    }

    // Remove sidebar
    if (opts.removeSidebar) {
      for (const selector of BOILERPLATE_SELECTORS.sidebar) {
        $(selector).remove();
      }
    }

    // Remove other boilerplate
    for (const selector of BOILERPLATE_SELECTORS.other) {
      $(selector).remove();
    }

    // Try to extract main content container
    for (const selector of CONTENT_SELECTORS) {
      const $content = $(selector);
      if ($content.length > 0 && $content.text().trim().length > 200) {
        logger.debug('Found main content container', { selector, traceId });
        return $.html($content);
      }
    }

    // If no content container found, return cleaned body
    return $.html('body') || $.html();
  } catch (error) {
    logger.error('Failed to remove boilerplate', {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    return html;
  }
}

/**
 * Extract main content using scoring algorithm.
 */
export function extractMainContent(html: string): string {
  const traceId = getTraceId();

  try {
    const $ = cheerio.load(html);

    // First, try known content selectors
    for (const selector of CONTENT_SELECTORS) {
      const $content = $(selector);
      if ($content.length > 0) {
        const text = $content.text().trim();
        if (text.length > 300) {
          logger.debug('Found main content via selector', { selector, traceId });
          return $.html($content);
        }
      }
    }

    // Score all major block elements
    const candidates: Array<{ element: cheerio.Element; score: number }> = [];

    $('div, article, section, main').each((_, element) => {
      const score = scoreBlock($, element);
      candidates.push({ element, score });
    });

    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);

    // Return the highest scoring block
    const best = candidates[0];
    if (best && best.score > 0) {
      logger.debug('Found main content via scoring', {
        score: best.score,
        traceId,
      });
      return $.html(best.element);
    }

    // Fallback: return body without known boilerplate
    return removeBoilerplate(html);
  } catch (error) {
    logger.error('Failed to extract main content', {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    return html;
  }
}

/**
 * Detect language from HTML content.
 */
export function detectLanguage(html: string): string | undefined {
  const $ = cheerio.load(html);

  // Try lang attribute
  const htmlLang = $('html').attr('lang');
  if (htmlLang) return htmlLang.split('-')[0];

  // Try Content-Language meta
  const metaLang = $('meta[http-equiv="content-language"]').attr('content');
  if (metaLang) return metaLang.split('-')[0];

  // Try og:locale
  const ogLocale = $('meta[property="og:locale"]').attr('content');
  if (ogLocale) return ogLocale.split('_')[0];

  return undefined;
}

/**
 * Count words in text content.
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}
