import * as cheerio from 'cheerio';
import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';

/**
 * HTML stripping options.
 */
export interface StripOptions {
  preserveLinks?: boolean;
  preserveImages?: boolean;
  preserveHeadings?: boolean;
  preserveLists?: boolean;
  collapseWhitespace?: boolean;
}

/**
 * Default strip options.
 */
const DEFAULT_OPTIONS: StripOptions = {
  preserveLinks: false,
  preserveImages: false,
  preserveHeadings: true,
  preserveLists: true,
  collapseWhitespace: true,
};

/**
 * Tags to always remove (including their content).
 */
const REMOVE_TAGS = [
  'script',
  'style',
  'noscript',
  'iframe',
  'object',
  'embed',
  'applet',
  'meta',
  'link',
  'svg',
  'canvas',
  'video',
  'audio',
];

/**
 * Block-level tags that should add newlines.
 */
const BLOCK_TAGS = [
  'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'div', 'dl', 'dt',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre',
  'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
];

/**
 * Strip HTML tags and extract text content.
 */
export function stripHTML(html: string, options: StripOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const traceId = getTraceId();

  try {
    const $ = cheerio.load(html);

    // Remove unwanted tags completely
    for (const tag of REMOVE_TAGS) {
      $(tag).remove();
    }

    // Remove hidden elements
    $('[style*="display: none"]').remove();
    $('[style*="display:none"]').remove();
    $('[hidden]').remove();
    $('.hidden').remove();

    // Handle links if not preserving
    if (!opts.preserveLinks) {
      $('a').each((_, el) => {
        $(el).replaceWith($(el).text());
      });
    } else {
      // Convert links to markdown format
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (href && text) {
          $(el).replaceWith(`[${text}](${href})`);
        } else {
          $(el).replaceWith(text);
        }
      });
    }

    // Handle images if preserving
    if (opts.preserveImages) {
      $('img').each((_, el) => {
        const alt = $(el).attr('alt') || '';
        const src = $(el).attr('src') || '';
        if (alt || src) {
          $(el).replaceWith(`[Image: ${alt}]`);
        }
      });
    } else {
      $('img').remove();
    }

    // Handle headings if preserving
    if (opts.preserveHeadings) {
      $('h1, h2, h3, h4, h5, h6').each((_, el) => {
        const level = parseInt(el.tagName.charAt(1), 10);
        const prefix = '#'.repeat(level);
        $(el).replaceWith(`\n\n${prefix} ${$(el).text().trim()}\n\n`);
      });
    }

    // Handle lists if preserving
    if (opts.preserveLists) {
      $('li').each((_, el) => {
        $(el).prepend('• ');
        $(el).append('\n');
      });
    }

    // Add newlines for block elements
    for (const tag of BLOCK_TAGS) {
      $(tag).each((_, el) => {
        $(el).prepend('\n');
        $(el).append('\n');
      });
    }

    // Get final text content
    let text = $('body').text() || $.text();

    // Normalize whitespace
    if (opts.collapseWhitespace) {
      // Replace multiple spaces with single space
      text = text.replace(/[ \t]+/g, ' ');
      // Replace more than 2 consecutive newlines with 2
      text = text.replace(/\n{3,}/g, '\n\n');
      // Trim lines
      text = text
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
    }

    // Final trim
    text = text.trim();

    logger.debug('HTML stripped', {
      inputLength: html.length,
      outputLength: text.length,
      traceId,
    });

    return text;
  } catch (error) {
    logger.error('Failed to strip HTML', {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    // Fallback: basic regex stripping
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Extract text content while preserving structure.
 */
export function extractStructuredText(html: string): {
  text: string;
  headings: string[];
  links: Array<{ text: string; href: string }>;
} {
  const $ = cheerio.load(html);

  // Remove unwanted tags
  for (const tag of REMOVE_TAGS) {
    $(tag).remove();
  }

  // Extract headings
  const headings: string[] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      headings.push(text);
    }
  });

  // Extract links
  const links: Array<{ text: string; href: string }> = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && text && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push({ text, href });
    }
  });

  // Get text
  const text = stripHTML(html);

  return { text, headings, links };
}

/**
 * Clean malformed HTML before processing.
 */
export function cleanMalformedHTML(html: string): string {
  // Fix common issues
  let cleaned = html
    // Fix unclosed tags
    .replace(/<br>/gi, '<br/>')
    .replace(/<hr>/gi, '<hr/>')
    .replace(/<img([^>]*)>/gi, '<img$1/>')
    // Remove null bytes
    .replace(/\0/g, '')
    // Fix encoding issues
    .replace(/\uFFFD/g, '');

  return cleaned;
}

/**
 * Extract title from HTML.
 */
export function extractTitle(html: string): string | undefined {
  const $ = cheerio.load(html);

  // Try title tag first
  const title = $('title').text().trim();
  if (title) return title;

  // Try og:title
  const ogTitle = $('meta[property="og:title"]').attr('content');
  if (ogTitle) return ogTitle.trim();

  // Try h1
  const h1 = $('h1').first().text().trim();
  if (h1) return h1;

  return undefined;
}

/**
 * Extract meta description from HTML.
 */
export function extractDescription(html: string): string | undefined {
  const $ = cheerio.load(html);

  // Try meta description
  const metaDesc = $('meta[name="description"]').attr('content');
  if (metaDesc) return metaDesc.trim();

  // Try og:description
  const ogDesc = $('meta[property="og:description"]').attr('content');
  if (ogDesc) return ogDesc.trim();

  return undefined;
}
