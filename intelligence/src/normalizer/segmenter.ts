import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';

/**
 * Segmentation options.
 */
export interface SegmentationOptions {
  minSentenceLength?: number;
  maxSentenceLength?: number;
  preserveWhitespace?: boolean;
}

/**
 * Default segmentation options.
 */
const DEFAULT_OPTIONS: SegmentationOptions = {
  minSentenceLength: 10,
  maxSentenceLength: 1000,
  preserveWhitespace: false,
};

/**
 * Common abbreviations that don't end sentences.
 */
const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'vs', 'etc', 'inc', 'ltd', 'corp',
  'st', 'ave', 'blvd', 'rd', 'ft', 'mt', 'fig', 'no', 'vol', 'pp', 'ed', 'eds',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
  'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
  'i.e', 'e.g', 'cf', 'al', 'ca', 'approx',
]);

/**
 * Check if a word is an abbreviation.
 */
function isAbbreviation(word: string): boolean {
  const cleaned = word.toLowerCase().replace(/\.$/, '');
  return ABBREVIATIONS.has(cleaned);
}

/**
 * Check if character is a sentence-ending punctuation.
 */
function isSentenceEnd(char: string): boolean {
  return char === '.' || char === '!' || char === '?';
}

/**
 * Split text into sentences.
 */
export function splitSentences(
  text: string,
  options: SegmentationOptions = {}
): string[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const traceId = getTraceId();

  if (!text || text.trim().length === 0) {
    return [];
  }

  const sentences: string[] = [];
  let current = '';
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    
    if (!char) {
      i++;
      continue;
    }
    
    current += char;

    // Check for sentence-ending punctuation
    if (isSentenceEnd(char)) {
      const nextChar = text[i + 1];
      const prevWord = current.trim().split(/\s+/).pop() || '';

      // Check if this is actually a sentence end
      const isEnd =
        // Next char is space/newline/end or uppercase letter
        (!nextChar ||
          /\s/.test(nextChar) ||
          /[A-Z]/.test(nextChar)) &&
        // Previous word is not an abbreviation
        !isAbbreviation(prevWord) &&
        // Not part of a number with decimal
        !/\d$/.test(prevWord.slice(0, -1));

      if (isEnd) {
        // Handle quotes/parentheses that follow
        while (text[i + 1] && /["'\)\]]/.test(text[i + 1] as string)) {
          i++;
          current += text[i];
        }

        const sentence = opts.preserveWhitespace
          ? current
          : current.trim();

        if (
          sentence.length >= (opts.minSentenceLength ?? 0) &&
          sentence.length <= (opts.maxSentenceLength ?? Infinity)
        ) {
          sentences.push(sentence);
        }
        current = '';
      }
    }
    // Handle newlines as potential sentence boundaries
    else if (char === '\n') {
      const trimmed = current.trim();
      // If current content looks like a complete sentence
      if (trimmed.length > 50 && /[.!?]$/.test(trimmed)) {
        sentences.push(trimmed);
        current = '';
      } else if (text[i + 1] === '\n') {
        // Double newline = paragraph break
        if (trimmed.length >= (opts.minSentenceLength ?? 0)) {
          sentences.push(trimmed);
        }
        current = '';
        // Skip additional newlines
        while (text[i + 1] === '\n') {
          i++;
        }
      }
    }

    i++;
  }

  // Handle remaining text
  const remaining = opts.preserveWhitespace ? current : current.trim();
  if (
    remaining.length >= (opts.minSentenceLength ?? 0) &&
    remaining.length <= (opts.maxSentenceLength ?? Infinity)
  ) {
    sentences.push(remaining);
  }

  logger.debug('Text segmented into sentences', {
    inputLength: text.length,
    sentenceCount: sentences.length,
    traceId,
  });

  return sentences;
}

/**
 * Split text into paragraphs.
 */
export function splitParagraphs(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split on double newlines or paragraph-like breaks
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs;
}

/**
 * Chunk text into segments of approximately equal size.
 */
export function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    // If adding this sentence exceeds chunk size
    if (current.length + sentence.length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      // Start new chunk with overlap
      const words = current.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlap / 5));
      current = overlapWords.join(' ') + ' ';
    }
    current += sentence + ' ';
  }

  // Add remaining content
  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Split text for embedding (optimized chunk sizes for vector search).
 */
export function splitForEmbedding(
  text: string,
  maxTokens: number = 512
): string[] {
  // Rough estimate: 1 token ≈ 4 characters
  const chunkSize = maxTokens * 4;
  const overlap = Math.floor(chunkSize * 0.1);

  return chunkText(text, chunkSize, overlap);
}

/**
 * Clean and normalize text spacing.
 */
export function normalizeSpacing(text: string): string {
  return text
    // Replace multiple spaces with single space
    .replace(/[ \t]+/g, ' ')
    // Replace multiple newlines with double newline
    .replace(/\n{3,}/g, '\n\n')
    // Remove spaces before punctuation
    .replace(/ +([.,!?;:])/g, '$1')
    // Add space after punctuation if missing
    .replace(/([.,!?;:])([A-Za-z])/g, '$1 $2')
    // Trim lines
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

/**
 * Extract key phrases from text (simple implementation).
 */
export function extractKeyPhrases(text: string, limit: number = 10): string[] {
  // Tokenize and count word frequencies
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 4); // Skip short words

  const wordCounts = new Map<string, number>();
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }

  // Sort by frequency
  const sorted = [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);

  return sorted;
}
