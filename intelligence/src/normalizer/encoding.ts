import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';

/**
 * Encoding normalization utilities.
 * Ensures all text is properly UTF-8 encoded.
 */

/**
 * Common character encoding replacements.
 */
const ENCODING_REPLACEMENTS: Array<[RegExp, string]> = [
  // Windows-1252 to UTF-8 common mappings
  [/\u0091/g, "'"], // Left single quote
  [/\u0092/g, "'"], // Right single quote
  [/\u0093/g, '"'], // Left double quote
  [/\u0094/g, '"'], // Right double quote
  [/\u0095/g, '•'], // Bullet
  [/\u0096/g, '–'], // En dash
  [/\u0097/g, '—'], // Em dash
  [/\u0085/g, '...'], // Ellipsis
  [/\u00A0/g, ' '], // Non-breaking space
  [/\u00AD/g, ''], // Soft hyphen

  // Smart quotes to regular quotes
  [/[\u2018\u2019\u201A\u201B]/g, "'"],
  [/[\u201C\u201D\u201E\u201F]/g, '"'],

  // Various dashes to standard dash
  [/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, '-'],

  // Ellipsis
  [/\u2026/g, '...'],

  // Replacement character (failed decode)
  [/\uFFFD/g, ''],

  // Zero-width characters
  [/[\u200B\u200C\u200D\uFEFF]/g, ''],

  // Control characters (except newline and tab)
  [/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''],
];

/**
 * Unicode normalization forms.
 */
export type NormalizationForm = 'NFC' | 'NFD' | 'NFKC' | 'NFKD';

/**
 * Normalize text encoding to UTF-8.
 */
export function normalizeEncoding(text: string): string {
  const traceId = getTraceId();

  try {
    let normalized = text;

    // Apply character replacements
    for (const [pattern, replacement] of ENCODING_REPLACEMENTS) {
      normalized = normalized.replace(pattern, replacement);
    }

    // Apply Unicode NFC normalization (composed form)
    normalized = normalized.normalize('NFC');

    logger.debug('Encoding normalized', {
      inputLength: text.length,
      outputLength: normalized.length,
      traceId,
    });

    return normalized;
  } catch (error) {
    logger.error('Encoding normalization failed', {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    return text;
  }
}

/**
 * Detect probable encoding issues in text.
 */
export function hasEncodingIssues(text: string): boolean {
  // Check for replacement characters
  if (text.includes('\uFFFD')) {
    return true;
  }

  // Check for common mojibake patterns
  const mojibakePatterns = [
    /Ã¢/,
    /Ã©/,
    /Ã¨/,
    /Ã´/,
    /Ã¼/,
    /â€/,
    /Â /,
    /â€™/,
    /â€œ/,
  ];

  for (const pattern of mojibakePatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }

  return false;
}

/**
 * Attempt to fix mojibake (encoding corruption).
 */
export function fixMojibake(text: string): string {
  const traceId = getTraceId();

  // Common UTF-8 interpreted as Latin-1 patterns
  const mojibakeMap: Array<[string, string]> = [
    ['â€™', "'"],
    ['â€œ', '"'],
    ['â€', '"'],
    ['Ã©', 'é'],
    ['Ã¨', 'è'],
    ['Ã ', 'à'],
    ['Ã¢', 'â'],
    ['Ã´', 'ô'],
    ['Ã»', 'û'],
    ['Ã§', 'ç'],
    ['Ã¯', 'ï'],
    ['Ã¼', 'ü'],
    ['Ã¶', 'ö'],
    ['Ã¤', 'ä'],
    ['Ã±', 'ñ'],
    ['â€"', '–'],
    ['â€"', '—'],
    ['â€¦', '…'],
    ['Â ', ' '],
    ['Â·', '·'],
  ];

  let fixed = text;
  for (const [corrupt, correct] of mojibakeMap) {
    fixed = fixed.split(corrupt).join(correct);
  }

  if (fixed !== text) {
    logger.debug('Fixed mojibake in text', { traceId });
  }

  return fixed;
}

/**
 * Convert HTML entities to characters.
 */
export function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
  };

  let decoded = text;

  // Named entities
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }

  // Numeric entities (decimal)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => {
    return String.fromCharCode(parseInt(num, 10));
  });

  // Numeric entities (hex)
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

/**
 * Remove or replace non-printable characters.
 */
export function removePrintableChars(text: string): string {
  return text
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove other control characters except newline, tab, carriage return
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove private use area characters
    .replace(/[\uE000-\uF8FF]/g, '')
    // Remove unassigned characters
    .replace(/[\uFDD0-\uFDEF]/g, '');
}

/**
 * Normalize line endings to Unix style (LF).
 */
export function normalizeLineEndings(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Windows
    .replace(/\r/g, '\n'); // Old Mac
}

/**
 * Full text normalization pipeline.
 */
export function normalizeText(text: string): string {
  let normalized = text;

  // Fix line endings
  normalized = normalizeLineEndings(normalized);

  // Fix encoding issues
  if (hasEncodingIssues(normalized)) {
    normalized = fixMojibake(normalized);
  }

  // Decode HTML entities
  normalized = decodeHTMLEntities(normalized);

  // Normalize encoding
  normalized = normalizeEncoding(normalized);

  // Remove non-printable characters
  normalized = removePrintableChars(normalized);

  return normalized;
}

/**
 * Detect text direction (LTR or RTL).
 */
export function detectTextDirection(text: string): 'ltr' | 'rtl' {
  // RTL Unicode ranges
  const rtlChars = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

  // Count RTL characters
  let rtlCount = 0;
  let ltrCount = 0;

  for (const char of text) {
    if (rtlChars.test(char)) {
      rtlCount++;
    } else if (/[A-Za-z]/.test(char)) {
      ltrCount++;
    }
  }

  return rtlCount > ltrCount ? 'rtl' : 'ltr';
}
