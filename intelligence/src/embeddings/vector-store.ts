import {
  initQdrant,
  getQdrant,
  createCollection,
  upsertVectors,
  searchSimilar,
  deleteVectors,
  getCollectionInfo,
  DEFAULT_COLLECTION,
} from '../db/qdrant.js';
import { generateEmbedding, generateEmbeddings, getModelVersion, getEmbeddingDimension } from './e5-service.js';
import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { query } from '../db/postgres.js';
import { v4 as uuidv4 } from 'uuid';
import type { DocumentRecord, EmbeddingRecord, SimilarDocument } from '../types/index.js';

/**
 * Vector store configuration.
 */
export interface VectorStoreConfig {
  collectionName: string;
  dimension: number;
  distance: 'Cosine' | 'Euclid' | 'Dot';
}

/**
 * Default vector store config.
 */
const DEFAULT_CONFIG: VectorStoreConfig = {
  collectionName: DEFAULT_COLLECTION,
  dimension: 384, // e5-small
  distance: 'Cosine',
};

/**
 * Initialize the vector store.
 */
export async function initVectorStore(
  config: Partial<VectorStoreConfig> = {}
): Promise<void> {
  const opts = { ...DEFAULT_CONFIG, ...config };
  
  initQdrant();
  await createCollection(opts.collectionName, opts.dimension);
  
  logger.info('Vector store initialized', {
    collection: opts.collectionName,
    dimension: opts.dimension,
  });
}

/**
 * Store a document embedding.
 */
export async function storeDocumentEmbedding(
  documentId: string,
  text: string,
  metadata: Record<string, unknown> = {}
): Promise<EmbeddingRecord> {
  const traceId = getTraceId();
  const startTime = Date.now();

  logger.debug('Storing document embedding', { documentId, traceId });

  // Generate embedding
  const embedding = await generateEmbedding(text);
  const modelVersion = getModelVersion();

  // Store in Qdrant
  await upsertVectors(DEFAULT_COLLECTION, [
    {
      id: documentId,
      vector: embedding.vector,
      payload: {
        documentId,
        modelVersion,
        textPreview: text.slice(0, 200),
        createdAt: new Date().toISOString(),
        ...metadata,
      },
    },
  ]);

  // Store metadata in PostgreSQL
  try {
    await query(
      `INSERT INTO embeddings (document_id, vector_id, model_version, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (document_id) 
       DO UPDATE SET vector_id = $2, model_version = $3, created_at = $4`,
      [documentId, documentId, modelVersion, new Date()]
    );
  } catch (error) {
    // Log but don't fail - vector is already stored
    logger.warn('Failed to store embedding metadata in PostgreSQL', {
      documentId,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
  }

  const durationMs = Date.now() - startTime;

  logArtifact('vector-store', documentId, documentId.slice(0, 16), embedding.id.slice(0, 16), {
    modelVersion,
    dimension: embedding.vector.length,
    durationMs,
  });

  logger.info('Document embedding stored', {
    documentId,
    modelVersion,
    durationMs,
    traceId,
  });

  return {
    documentId,
    vector: embedding.vector,
    modelVersion,
    createdAt: new Date(),
  };
}

/**
 * Store multiple document embeddings.
 */
export async function storeDocumentEmbeddings(
  documents: Array<{ id: string; text: string; metadata?: Record<string, unknown> }>
): Promise<EmbeddingRecord[]> {
  const traceId = getTraceId();
  const startTime = Date.now();

  logger.info('Storing document embeddings batch', {
    count: documents.length,
    traceId,
  });

  // Generate all embeddings
  const texts = documents.map((d) => d.text);
  const embeddings = await generateEmbeddings(texts);
  const modelVersion = getModelVersion();

  // Prepare vectors for Qdrant
  const points = documents.map((doc, index) => ({
    id: doc.id,
    vector: embeddings[index]?.vector ?? [],
    payload: {
      documentId: doc.id,
      modelVersion,
      textPreview: doc.text.slice(0, 200),
      createdAt: new Date().toISOString(),
      ...doc.metadata,
    },
  }));

  // Store in Qdrant
  await upsertVectors(DEFAULT_COLLECTION, points);

  // Store metadata in PostgreSQL
  const insertPromises = documents.map((doc) =>
    query(
      `INSERT INTO embeddings (document_id, vector_id, model_version, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (document_id) 
       DO UPDATE SET vector_id = $2, model_version = $3, created_at = $4`,
      [doc.id, doc.id, modelVersion, new Date()]
    ).catch((error) => {
      logger.warn('Failed to store embedding metadata', {
        documentId: doc.id,
        error: error instanceof Error ? error.message : String(error),
      });
    })
  );

  await Promise.all(insertPromises);

  const durationMs = Date.now() - startTime;

  logger.info('Document embeddings batch stored', {
    count: documents.length,
    durationMs,
    avgTimePerDoc: durationMs / documents.length,
    traceId,
  });

  return documents.map((doc, index) => ({
    documentId: doc.id,
    vector: embeddings[index]?.vector ?? [],
    modelVersion,
    createdAt: new Date(),
  }));
}

/**
 * Search for similar documents.
 */
export async function searchSimilarDocuments(
  queryText: string,
  limit: number = 10,
  filter?: Record<string, unknown>
): Promise<SimilarDocument[]> {
  const traceId = getTraceId();
  const startTime = Date.now();

  logger.debug('Searching similar documents', {
    queryLength: queryText.length,
    limit,
    traceId,
  });

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(queryText);

  // Search in Qdrant
  const results = await searchSimilar(
    DEFAULT_COLLECTION,
    queryEmbedding.vector,
    limit,
    filter
  );

  const durationMs = Date.now() - startTime;

  logger.debug('Similar documents found', {
    resultCount: results.length,
    topScore: results[0]?.score,
    durationMs,
    traceId,
  });

  return results.map((r) => ({
    documentId: r.payload['documentId'] as string || r.id,
    score: r.score,
  }));
}

/**
 * Search for similar documents with full document data.
 */
export async function searchSimilarDocumentsWithData(
  queryText: string,
  limit: number = 10
): Promise<SimilarDocument[]> {
  const traceId = getTraceId();

  // Get similar document IDs
  const similar = await searchSimilarDocuments(queryText, limit);

  if (similar.length === 0) {
    return [];
  }

  // Fetch full documents from PostgreSQL
  const docIds = similar.map((s) => s.documentId);
  const placeholders = docIds.map((_, i) => `$${i + 1}`).join(',');

  const result = await query<{
    id: string;
    url: string;
    text: string;
    metadata: Record<string, unknown>;
    source_trust: string;
    fetched_at: Date;
  }>(
    `SELECT id, url, text, metadata, source_trust, fetched_at 
     FROM documents 
     WHERE id = ANY(ARRAY[${placeholders}]::uuid[])`,
    docIds
  );

  // Map results back with scores
  const docMap = new Map(result.rows.map((row) => [row.id, row]));

  return similar.map((s) => {
    const doc = docMap.get(s.documentId);
    return {
      ...s,
      document: doc
        ? {
            id: doc.id,
            url: doc.url,
            text: doc.text,
            metadata: doc.metadata,
            sourceTrust: doc.source_trust as 'high' | 'medium' | 'low' | 'unknown',
            fetchedAt: doc.fetched_at,
          }
        : undefined,
    };
  });
}

/**
 * Delete document embedding.
 */
export async function deleteDocumentEmbedding(documentId: string): Promise<void> {
  const traceId = getTraceId();

  logger.debug('Deleting document embedding', { documentId, traceId });

  // Delete from Qdrant
  await deleteVectors(DEFAULT_COLLECTION, [documentId]);

  // Delete from PostgreSQL
  await query('DELETE FROM embeddings WHERE document_id = $1', [documentId]);

  logger.info('Document embedding deleted', { documentId, traceId });
}

/**
 * Get vector store statistics.
 */
export async function getVectorStoreStats(): Promise<{
  vectorCount: number;
  dimension: number;
  indexedPercentage: number;
}> {
  const info = await getCollectionInfo(DEFAULT_COLLECTION);

  return {
    vectorCount: info.points_count ?? 0,
    dimension: getEmbeddingDimension(),
    indexedPercentage: info.indexed_vectors_count 
      ? (info.indexed_vectors_count / (info.points_count || 1)) * 100 
      : 100,
  };
}

/**
 * Reindex all documents with new embedding model.
 */
export async function reindexAllDocuments(
  batchSize: number = 100
): Promise<{ processed: number; errors: number }> {
  const traceId = getTraceId();
  let processed = 0;
  let errors = 0;
  let offset = 0;

  logger.info('Starting full reindex', { traceId });

  while (true) {
    // Fetch batch of documents
    const result = await query<{ id: string; text: string }>(
      `SELECT id, text FROM documents ORDER BY id LIMIT $1 OFFSET $2`,
      [batchSize, offset]
    );

    if (result.rows.length === 0) {
      break;
    }

    // Store embeddings for batch
    try {
      await storeDocumentEmbeddings(
        result.rows.map((row) => ({ id: row.id, text: row.text }))
      );
      processed += result.rows.length;
    } catch (error) {
      logger.error('Error during reindex batch', {
        offset,
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
      errors += result.rows.length;
    }

    offset += batchSize;

    logger.debug('Reindex progress', {
      processed,
      errors,
      traceId,
    });
  }

  logger.info('Reindex completed', { processed, errors, traceId });

  return { processed, errors };
}
