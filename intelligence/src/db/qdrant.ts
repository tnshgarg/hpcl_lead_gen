import { QdrantClient } from '@qdrant/js-client-rest';
import { env, getQdrantConnectionOptions } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { withRetry, isNetworkError } from '../lib/retry.js';

/**
 * Qdrant client instance for vector operations.
 */
let qdrantClient: QdrantClient | null = null;

/**
 * Default collection name for document embeddings.
 */
export const DEFAULT_COLLECTION = 'documents';

/**
 * Initialize the Qdrant client.
 */
export function initQdrant(): QdrantClient {
  if (qdrantClient) {
    return qdrantClient;
  }

  const options = getQdrantConnectionOptions();
  qdrantClient = new QdrantClient({
    host: options.host,
    port: options.port,
    ...(options.apiKey ? { apiKey: options.apiKey } : {}),
  });

  logger.info('Qdrant client initialized', {
    host: env.QDRANT_HOST,
    port: env.QDRANT_PORT,
  });

  return qdrantClient;
}

/**
 * Get the Qdrant client instance.
 * Throws if not initialized.
 */
export function getQdrant(): QdrantClient {
  if (!qdrantClient) {
    throw new Error('Qdrant client not initialized. Call initQdrant() first.');
  }
  return qdrantClient;
}

/**
 * Check Qdrant connection health.
 * Returns true if healthy, false otherwise.
 * If an error occurs, it returns false and logs the error message.
 */
export async function checkQdrantHealth(): Promise<{ healthy: boolean; error?: string }> {
  try {
    const client = getQdrant();
    await client.getCollections();
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Wait for Qdrant to be ready.
 */
export async function waitForQdrant(
  maxAttempts: number = 30, // Wait up to 60 seconds
  delayMs: number = 2000
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    logger.info(`Waiting for Qdrant (attempt ${attempt}/${maxAttempts})...`);
    const health = await checkQdrantHealth();
    if (health.healthy) {
      logger.info('Qdrant is ready');
      return;
    }
    
    if (attempt % 5 === 0) {
      logger.warn('Qdrant health check failed', {
        attempt,
        error: health.error,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error('Qdrant failed to become ready');
}

/**
 * Create a collection for document embeddings.
 */
export async function createCollection(
  collectionName: string,
  vectorSize: number = 384 // e5-small default
): Promise<void> {
  const client = getQdrant();

  // Check if collection exists
  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === collectionName);

  if (exists) {
    logger.debug('Collection already exists', { collectionName });
    return;
  }

  await withRetry(
    async () => {
      await client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });
    },
    {
      maxAttempts: 3,
      isRetryable: isNetworkError,
    }
  );

  logger.info('Collection created', { collectionName, vectorSize });
}

/**
 * Upsert vectors into a collection.
 */
export async function upsertVectors(
  collectionName: string,
  points: Array<{
    id: string;
    vector: number[];
    payload?: Record<string, unknown>;
  }>
): Promise<void> {
  const client = getQdrant();

  await withRetry(
    async () => {
      await client.upsert(collectionName, {
        wait: true,
        points: points.map((p) => ({
          id: p.id,
          vector: p.vector,
          payload: p.payload ?? {},
        })),
      });
    },
    {
      maxAttempts: 3,
      isRetryable: isNetworkError,
    }
  );

  logger.debug('Vectors upserted', {
    collectionName,
    count: points.length,
  });
}

/**
 * Search for similar vectors.
 */
export async function searchSimilar(
  collectionName: string,
  queryVector: number[],
  limit: number = 10,
  filter?: Record<string, unknown>
): Promise<
  Array<{
    id: string;
    score: number;
    payload: Record<string, unknown>;
  }>
> {
  const client = getQdrant();

  const results = await withRetry(
    async () => {
      return client.search(collectionName, {
        vector: queryVector,
        limit,
        with_payload: true,
        filter: filter as never,
      });
    },
    {
      maxAttempts: 3,
      isRetryable: isNetworkError,
    }
  );

  return results.map((r) => ({
    id: String(r.id),
    score: r.score,
    payload: (r.payload ?? {}) as Record<string, unknown>,
  }));
}

/**
 * Delete vectors by IDs.
 */
export async function deleteVectors(
  collectionName: string,
  ids: string[]
): Promise<void> {
  const client = getQdrant();

  await client.delete(collectionName, {
    wait: true,
    points: ids,
  });

  logger.debug('Vectors deleted', { collectionName, count: ids.length });
}

/**
 * Get collection info.
 */
export async function getCollectionInfo(collectionName: string) {
  const client = getQdrant();
  return client.getCollection(collectionName);
}
