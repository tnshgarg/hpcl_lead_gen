import { pipeline, type Pipeline } from '@xenova/transformers';
import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { getCached, setCached } from '../db/redis.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Embedding model configuration.
 */
export interface EmbeddingConfig {
  model: string;
  batchSize: number;
  cacheEnabled: boolean;
  cacheTTLSeconds: number;
}

/**
 * Default embedding configuration.
 */
const DEFAULT_CONFIG: EmbeddingConfig = {
  model: env.EMBEDDING_MODEL,
  batchSize: env.EMBEDDING_BATCH_SIZE,
  cacheEnabled: true,
  cacheTTLSeconds: 86400 * 7, // 7 days
};

/**
 * Embedding result.
 */
export interface EmbeddingResult {
  id: string;
  text: string;
  vector: number[];
  modelVersion: string;
  createdAt: Date;
}

/**
 * Singleton embedding pipeline instance.
 */
let embeddingPipeline: Pipeline | null = null;
let currentModel: string | null = null;

/**
 * Get the embedding model version string.
 */
export function getModelVersion(): string {
  return currentModel || env.EMBEDDING_MODEL;
}

/**
 * Initialize the embedding pipeline.
 */
export async function initEmbeddingPipeline(
  model: string = env.EMBEDDING_MODEL
): Promise<Pipeline> {
  if (embeddingPipeline && currentModel === model) {
    return embeddingPipeline;
  }

  logger.info('Initializing embedding pipeline...', { model });

  try {
    // Use feature-extraction for embeddings
    embeddingPipeline = await pipeline('feature-extraction', model, {
      quantized: true, // Use quantized model for better performance
    });
    currentModel = model;

    logger.info('Embedding pipeline initialized', { model });
    return embeddingPipeline;
  } catch (error) {
    logger.error('Failed to initialize embedding pipeline', {
      model,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get cache key for embedding.
 */
function getEmbeddingCacheKey(text: string, model: string): string {
  const hash = crypto.createHash('sha256').update(text).digest('hex').slice(0, 32);
  return `emb:${model}:${hash}`;
}

/**
 * Mean pooling for sentence embeddings.
 * Averages token embeddings to create a single sentence embedding.
 */
function meanPooling(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return [];
  
  const dim = embeddings[0]?.length ?? 0;
  const result = new Array(dim).fill(0);
  
  for (const embedding of embeddings) {
    for (let i = 0; i < dim; i++) {
      result[i] += embedding[i] ?? 0;
    }
  }
  
  for (let i = 0; i < dim; i++) {
    result[i] /= embeddings.length;
  }
  
  return result;
}

/**
 * Normalize vector to unit length.
 */
function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;
  return vector.map((val) => val / magnitude);
}

/**
 * Generate embedding for a single text.
 */
export async function generateEmbedding(
  text: string,
  config: Partial<EmbeddingConfig> = {}
): Promise<EmbeddingResult> {
  const opts = { ...DEFAULT_CONFIG, ...config };
  const traceId = getTraceId();
  const startTime = Date.now();

  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot generate embedding for empty text');
  }

  // Check cache
  if (opts.cacheEnabled) {
    const cacheKey = getEmbeddingCacheKey(text, opts.model);
    const cached = await getCached<number[]>(cacheKey);
    
    if (cached) {
      logger.debug('Embedding cache hit', { traceId });
      return {
        id: uuidv4(),
        text,
        vector: cached,
        modelVersion: opts.model,
        createdAt: new Date(),
      };
    }
  }

  // Initialize pipeline if needed
  const pipe = await initEmbeddingPipeline(opts.model);

  try {
    // For e5 models, prefix with "query: " for better results
    const prefixedText = opts.model.includes('e5') ? `query: ${text}` : text;
    
    // Generate embedding
    const output = await pipe(prefixedText, {
      pooling: 'mean',
      normalize: true,
    });

    // Extract vector from output
    let vector: number[];
    if (Array.isArray(output.data)) {
      vector = Array.from(output.data as number[]);
    } else if (output.tolist) {
      const nested = output.tolist() as number[][];
      vector = nested[0] ?? [];
    } else {
      throw new Error('Unexpected embedding output format');
    }

    // Normalize if not already normalized
    vector = normalizeVector(vector);

    const durationMs = Date.now() - startTime;

    // Cache the result
    if (opts.cacheEnabled) {
      const cacheKey = getEmbeddingCacheKey(text, opts.model);
      await setCached(cacheKey, vector, opts.cacheTTLSeconds);
    }

    // Log artifact
    const inputHash = crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
    const resultId = uuidv4();
    
    logArtifact('embedding', resultId, inputHash, resultId.slice(0, 16), {
      model: opts.model,
      dimension: vector.length,
      durationMs,
    });

    logger.debug('Embedding generated', {
      textLength: text.length,
      dimension: vector.length,
      durationMs,
      traceId,
    });

    return {
      id: resultId,
      text,
      vector,
      modelVersion: opts.model,
      createdAt: new Date(),
    };
  } catch (error) {
    logger.error('Failed to generate embedding', {
      textLength: text.length,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batches.
 */
export async function generateEmbeddings(
  texts: string[],
  config: Partial<EmbeddingConfig> = {}
): Promise<EmbeddingResult[]> {
  const opts = { ...DEFAULT_CONFIG, ...config };
  const traceId = getTraceId();
  const startTime = Date.now();

  logger.info('Generating embeddings batch', {
    count: texts.length,
    batchSize: opts.batchSize,
    traceId,
  });

  const results: EmbeddingResult[] = [];

  // Process in batches
  for (let i = 0; i < texts.length; i += opts.batchSize) {
    const batch = texts.slice(i, i + opts.batchSize);
    
    // Generate embeddings for batch (sequentially for now, since model is single-threaded)
    const batchResults = await Promise.all(
      batch.map((text) => generateEmbedding(text, opts))
    );
    
    results.push(...batchResults);

    logger.debug('Batch processed', {
      batchIndex: Math.floor(i / opts.batchSize),
      batchSize: batch.length,
      totalProcessed: results.length,
      traceId,
    });
  }

  const durationMs = Date.now() - startTime;
  
  logger.info('Embeddings batch completed', {
    count: results.length,
    durationMs,
    avgTimePerEmbedding: durationMs / results.length,
    traceId,
  });

  return results;
}

/**
 * Calculate cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    const aVal = a[i] ?? 0;
    const bVal = b[i] ?? 0;
    dotProduct += aVal * bVal;
    magnitudeA += aVal * aVal;
    magnitudeB += bVal * bVal;
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Get embedding dimension for current model.
 */
export function getEmbeddingDimension(): number {
  // e5-small produces 384-dimensional embeddings
  if (currentModel?.includes('e5-small')) {
    return 384;
  }
  // e5-base produces 768-dimensional embeddings
  if (currentModel?.includes('e5-base')) {
    return 768;
  }
  // Default for unknown models
  return 384;
}

/**
 * Clear embedding cache for a specific text.
 */
export async function clearEmbeddingCache(
  text: string,
  model: string = env.EMBEDDING_MODEL
): Promise<void> {
  const cacheKey = getEmbeddingCacheKey(text, model);
  const { deleteCached } = await import('../db/redis.js');
  await deleteCached(cacheKey);
  logger.debug('Embedding cache cleared', { model });
}
