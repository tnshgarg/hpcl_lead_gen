import { generateContent, analyzeIntent } from './gemini-client.js';
import { usePrompt } from './prompts/index.js';
import { searchSimilarDocuments } from '../embeddings/vector-store.js';
import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { v4 as uuidv4 } from 'uuid';
import type { LLMResponse, IntentResult, IntentClassification, NamedEntity, SentimentScore } from '../types/index.js';

/**
 * Intent Engine configuration.
 */
export interface IntentEngineConfig {
  useFallback: boolean;
  maxContextDocuments: number;
  minSimilarityScore: number;
  confidenceThreshold: number;
}

/**
 * Default intent engine configuration.
 */
const DEFAULT_CONFIG: IntentEngineConfig = {
  useFallback: true,
  maxContextDocuments: 5,
  minSimilarityScore: 0.7,
  confidenceThreshold: 0.6,
};

/**
 * RAG context structure.
 */
interface RAGContext {
  documents: Array<{
    id: string;
    text: string;
    score: number;
  }>;
  totalRetrieved: number;
}

/**
 * Retrieve relevant context documents for RAG.
 */
async function retrieveContext(
  query: string,
  config: IntentEngineConfig
): Promise<RAGContext> {
  const traceId = getTraceId();

  try {
    const similar = await searchSimilarDocuments(
      query,
      config.maxContextDocuments * 2 // Fetch more, then filter
    );

    // Filter by similarity score
    const relevant = similar.filter((doc) => doc.score >= config.minSimilarityScore);

    // Limit to max context documents
    const limited = relevant.slice(0, config.maxContextDocuments);

    logger.debug('RAG context retrieved', {
      query: query.slice(0, 100),
      retrieved: similar.length,
      afterFilter: relevant.length,
      used: limited.length,
      traceId,
    });

    return {
      documents: limited.map((doc) => ({
        id: doc.documentId,
        text: '', // Would fetch from database in real implementation
        score: doc.score,
      })),
      totalRetrieved: similar.length,
    };
  } catch (error) {
    logger.warn('Failed to retrieve RAG context', {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });

    return {
      documents: [],
      totalRetrieved: 0,
    };
  }
}

/**
 * Build RAG-augmented prompt.
 */
function buildRAGPrompt(
  basePrompt: string,
  context: RAGContext
): string {
  if (context.documents.length === 0) {
    return basePrompt;
  }

  const contextSection = context.documents
    .map((doc, i) => `[Context ${i + 1}] (relevance: ${doc.score.toFixed(2)})\n${doc.text}`)
    .join('\n\n');

  return `${basePrompt}

---
RELEVANT CONTEXT (Use this to inform your response):
${contextSection}
---`;
}

/**
 * Fallback lightweight intent classification.
 * Used when LLM is unavailable.
 */
function fallbackClassify(text: string): IntentResult {
  const traceId = getTraceId();
  logger.debug('Using fallback classifier', { traceId });

  // Simple keyword-based classification
  const keywords = {
    product: ['product', 'buy', 'purchase', 'price', 'cost', 'sale'],
    support: ['help', 'issue', 'problem', 'support', 'question', 'how to'],
    feedback: ['feedback', 'review', 'opinion', 'think', 'feel'],
    news: ['news', 'announce', 'update', 'release', 'launch'],
    research: ['research', 'study', 'analysis', 'report', 'data'],
  };

  const lowerText = text.toLowerCase();
  const intents: IntentClassification[] = [];

  for (const [intent, words] of Object.entries(keywords)) {
    const matches = words.filter((word) => lowerText.includes(word));
    if (matches.length > 0) {
      intents.push({
        name: intent,
        confidence: Math.min(matches.length * 0.2, 0.8),
        context: `Matched keywords: ${matches.join(', ')}`,
      });
    }
  }

  // Simple sentiment detection
  const positiveWords = ['good', 'great', 'excellent', 'love', 'amazing', 'best', 'happy'];
  const negativeWords = ['bad', 'terrible', 'hate', 'worst', 'angry', 'disappointed', 'poor'];

  const positiveCount = positiveWords.filter((w) => lowerText.includes(w)).length;
  const negativeCount = negativeWords.filter((w) => lowerText.includes(w)).length;

  let sentiment: SentimentScore = { positive: 0.33, negative: 0.33, neutral: 0.34 };
  if (positiveCount > negativeCount) {
    sentiment = { positive: 0.7, negative: 0.1, neutral: 0.2 };
  } else if (negativeCount > positiveCount) {
    sentiment = { positive: 0.1, negative: 0.7, neutral: 0.2 };
  }

  // Sort by confidence
  intents.sort((a, b) => b.confidence - a.confidence);

  return {
    documentId: uuidv4(),
    intents: intents.length > 0 ? intents : [{ name: 'unknown', confidence: 0.3 }],
    entities: [], // Fallback doesn't extract entities
    sentiment,
    summary: text.slice(0, 200) + (text.length > 200 ? '...' : ''),
    confidence: intents.length > 0 ? intents[0]!.confidence : 0.3,
  };
}

/**
 * Analyze document intent with RAG augmentation.
 */
export async function analyzeDocumentIntent(
  documentId: string,
  text: string,
  config: Partial<IntentEngineConfig> = {}
): Promise<IntentResult> {
  const opts = { ...DEFAULT_CONFIG, ...config };
  const traceId = getTraceId();
  const startTime = Date.now();

  logger.info('Analyzing document intent', {
    documentId,
    textLength: text.length,
    traceId,
  });

  try {
    // Retrieve RAG context
    const context = await retrieveContext(text, opts);

    // Try to use versioned prompt template
    let prompt: string;
    let promptVersion = 'inline';

    try {
      const promptResult = await usePrompt('intent-analysis', {
        document: text.slice(0, 4000),
        context: context.documents.length > 0 
          ? 'Related documents found in database'
          : '',
      });
      prompt = promptResult.prompt;
      promptVersion = promptResult.version;
    } catch {
      // Fallback to inline prompt
      prompt = text.slice(0, 4000);
    }

    // Build RAG-augmented prompt
    const ragPrompt = buildRAGPrompt(prompt, context);

    // Call LLM for intent analysis
    const llmResponse = await analyzeIntent(ragPrompt);

    const durationMs = Date.now() - startTime;

    // Build result
    const result: IntentResult = {
      documentId,
      intents: [
        {
          name: llmResponse.content.primaryIntent,
          confidence: llmResponse.content.confidence,
        },
      ],
      entities: llmResponse.content.entities.map((e) => ({
        text: e.name,
        type: e.type as NamedEntity['type'],
        confidence: 0.8,
      })),
      sentiment: {
        positive: llmResponse.content.sentiment === 'positive' ? 0.8 : 0.1,
        negative: llmResponse.content.sentiment === 'negative' ? 0.8 : 0.1,
        neutral: llmResponse.content.sentiment === 'neutral' ? 0.8 : 0.1,
      },
      summary: llmResponse.content.summary,
      confidence: llmResponse.confidence,
    };

    // Log artifact
    logArtifact('intent-analysis', documentId, documentId.slice(0, 16), uuidv4().slice(0, 16), {
      promptVersion,
      ragContextUsed: context.documents.length,
      confidence: result.confidence,
      durationMs,
    });

    logger.info('Document intent analyzed', {
      documentId,
      primaryIntent: result.intents[0]?.name,
      confidence: result.confidence,
      entitiesFound: result.entities.length,
      durationMs,
      traceId,
    });

    return result;
  } catch (error) {
    logger.error('LLM intent analysis failed', {
      documentId,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });

    // Use fallback if enabled
    if (opts.useFallback) {
      logger.info('Using fallback classifier', { documentId, traceId });
      const fallbackResult = fallbackClassify(text);
      fallbackResult.documentId = documentId;
      return fallbackResult;
    }

    throw error;
  }
}

/**
 * Batch analyze multiple documents.
 */
export async function batchAnalyzeIntent(
  documents: Array<{ id: string; text: string }>,
  config: Partial<IntentEngineConfig> = {}
): Promise<IntentResult[]> {
  const traceId = getTraceId();
  const results: IntentResult[] = [];

  logger.info('Batch analyzing intents', {
    count: documents.length,
    traceId,
  });

  // Process sequentially to avoid rate limits
  for (const doc of documents) {
    try {
      const result = await analyzeDocumentIntent(doc.id, doc.text, config);
      results.push(result);
    } catch (error) {
      logger.error('Failed to analyze document', {
        documentId: doc.id,
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
      // Add fallback result
      const fallback = fallbackClassify(doc.text);
      fallback.documentId = doc.id;
      results.push(fallback);
    }
  }

  logger.info('Batch analysis completed', {
    total: documents.length,
    successful: results.filter((r) => r.confidence > 0.5).length,
    traceId,
  });

  return results;
}

/**
 * Cross-check LLM confidence with embedding similarity.
 */
export async function crossCheckConfidence(
  documentId: string,
  text: string,
  llmConfidence: number
): Promise<number> {
  const traceId = getTraceId();

  try {
    // Find similar documents that have been verified
    const similar = await searchSimilarDocuments(text, 3);

    if (similar.length === 0) {
      // No reference documents, use LLM confidence as-is
      return llmConfidence;
    }

    // Average similarity score
    const avgSimilarity = similar.reduce((sum, s) => sum + s.score, 0) / similar.length;

    // Blend LLM confidence with embedding-based confidence
    const blendedConfidence = (llmConfidence * 0.7) + (avgSimilarity * 0.3);

    logger.debug('Confidence cross-checked', {
      documentId,
      llmConfidence,
      avgSimilarity,
      blendedConfidence,
      traceId,
    });

    return Math.min(blendedConfidence, 1);
  } catch (error) {
    logger.warn('Confidence cross-check failed, using LLM confidence', {
      documentId,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    return llmConfidence;
  }
}
