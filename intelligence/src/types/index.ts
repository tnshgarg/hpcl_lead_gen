/**
 * Core type definitions for the Web Intelligence Layer.
 * No untyped objects allowed - everything is strictly typed.
 */

import { z } from 'zod';

// ============================================
// Trust & Scoring Types
// ============================================

/**
 * Source trust levels.
 */
export type TrustLevel = 'high' | 'medium' | 'low' | 'unknown';

/**
 * Confidence score (0-1).
 */
export type ConfidenceScore = number;

// ============================================
// Document Types
// ============================================

/**
 * Document record as defined in the implementation plan.
 */
export interface DocumentRecord {
  id: string;
  url: string;
  text: string;
  rawText?: string;
  metadata: DocumentMetadata;
  sourceTrust: TrustLevel;
  fetchedAt: Date;
  normalizedAt?: Date;
  embeddingVersion?: string;
}

/**
 * Document metadata structure.
 */
export interface DocumentMetadata {
  title?: string;
  description?: string;
  author?: string;
  publishedAt?: Date;
  language?: string;
  contentType?: string;
  wordCount?: number;
  domain?: string;
  [key: string]: unknown;
}

// ============================================
// Crawl Types
// ============================================

/**
 * Crawl job for queue processing.
 */
export interface CrawlJob {
  id: string;
  url: string;
  priority: number;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Crawl result after successful fetch.
 */
export interface CrawlResult {
  id: string;
  url: string;
  content: string;
  contentType: string;
  statusCode: number;
  headers: Record<string, string>;
  fetchedAt: Date;
  responseTimeMs: number;
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Crawl error artifact.
 */
export interface CrawlError {
  id: string;
  url: string;
  errorType: 'network' | 'timeout' | 'rate_limit' | 'robots_blocked' | 'parse' | 'unknown';
  message: string;
  statusCode?: number;
  retryable: boolean;
  timestamp: Date;
}

// ============================================
// Normalization Types
// ============================================

/**
 * Normalization result.
 */
export interface NormalizationResult {
  documentId: string;
  cleanedText: string;
  sentences: string[];
  paragraphs: string[];
  structuredData: Record<string, unknown>;
  metadata: DocumentMetadata;
}

// ============================================
// Embedding Types
// ============================================

/**
 * Embedding record.
 */
export interface EmbeddingRecord {
  documentId: string;
  vector: number[];
  modelVersion: string;
  createdAt: Date;
}

/**
 * Similar document result.
 */
export interface SimilarDocument {
  documentId: string;
  score: number;
  document?: DocumentRecord;
}

// ============================================
// LLM & Intent Types
// ============================================

/**
 * LLM response structure.
 */
export interface LLMResponse<T = unknown> {
  content: T;
  confidence: ConfidenceScore;
  reasoning?: string;
  modelVersion: string;
  promptVersion: string;
  tokensUsed?: number;
}

/**
 * Prompt template definition.
 */
export interface PromptTemplate {
  id: string;
  version: string;
  name: string;
  template: string;
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  createdAt: Date;
  isActive: boolean;
}

/**
 * Intent analysis result.
 */
export interface IntentResult {
  documentId: string;
  intents: IntentClassification[];
  entities: NamedEntity[];
  sentiment?: SentimentScore;
  summary?: string;
  confidence: ConfidenceScore;
}

/**
 * Intent classification.
 */
export interface IntentClassification {
  name: string;
  confidence: ConfidenceScore;
  context?: string;
}

/**
 * Named entity.
 */
export interface NamedEntity {
  text: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'product' | 'other';
  confidence: ConfidenceScore;
  startIndex?: number;
  endIndex?: number;
}

/**
 * Sentiment score.
 */
export interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
}

// ============================================
// Decision & Scoring Types
// ============================================

/**
 * Scoring inputs for decision layer.
 */
export interface ScoringInputs {
  llmOutput: LLMResponse;
  sourceTrust: TrustLevel;
  freshness: number; // 0-1, based on age
  signalDensity: number; // 0-1, information richness
  embeddingSimilarity: number; // 0-1, similarity to known leads
}

/**
 * Scored lead result.
 */
export interface ScoredLead {
  id: string;
  documentId: string;
  score: number;
  weights: ScoringWeights;
  status: 'approved' | 'review_needed' | 'rejected';
  reasonCodes: string[];
  createdAt: Date;
}

/**
 * Scoring weights for transparency.
 */
export interface ScoringWeights {
  llmConfidence: number;
  sourceTrust: number;
  freshness: number;
  signalDensity: number;
  embeddingSimilarity: number;
}

// ============================================
// Dossier Types
// ============================================

/**
 * Dossier section structure.
 */
export interface DossierSection {
  title: string;
  content: Record<string, unknown>;
}

/**
 * Generated dossier structure.
 */
export interface Dossier {
  id: string;
  leadId: string;
  documentId: string;
  company?: string | null;
  sections: DossierSection[];
  humanSummary: string;
  recommendations: string[];
  createdAt: Date;
  consumedAt?: Date;
  version: string;
}

/**
 * Suggested action for a dossier.
 */
export interface SuggestedAction {
  type: 'contact' | 'research' | 'follow_up' | 'escalate' | 'archive';
  priority: 'high' | 'medium' | 'low';
  description: string;
  deadline?: Date;
}

// ============================================
// Feedback & Learning Types
// ============================================

/**
 * Feedback type.
 */
export type FeedbackType = 'positive' | 'negative' | 'correction';

/**
 * Feedback item.
 */
export interface FeedbackItem {
  id: string;
  dossierId: string;
  type: FeedbackType;
  score: number;
  comment?: string;
  userId?: string;
  createdAt: Date;
}

/**
 * User feedback on a lead.
 */
export interface LeadFeedback {
  leadId: string;
  outcome: 'accepted' | 'rejected' | 'converted';
  reason?: string;
  submittedBy: string;
  submittedAt: Date;
}

/**
 * Model performance metrics.
 */
export interface ModelMetrics {
  modelVersion: string;
  period: { start: Date; end: Date };
  totalPredictions: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgConfidence: number;
}

// ============================================
// Pipeline Types
// ============================================

/**
 * Pipeline stage status.
 */
export type PipelineStage =
  | 'crawl'
  | 'normalize'
  | 'embed'
  | 'analyze'
  | 'score'
  | 'dossier';

/**
 * Pipeline execution record.
 */
export interface PipelineExecution {
  id: string;
  documentId: string;
  stages: PipelineStageResult[];
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'partial';
}

/**
 * Individual stage result.
 */
export interface PipelineStageResult {
  stage: PipelineStage;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
  inputHash?: string;
  outputHash?: string;
  error?: string;
}

// ============================================
// Error Types
// ============================================

/**
 * Application error with structured context.
 */
export class WILError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'WILError';
  }
}

/**
 * Create common error types.
 */
export const Errors = {
  networkError: (message: string, context?: Record<string, unknown>) =>
    new WILError(message, 'NETWORK_ERROR', context, true),

  timeoutError: (message: string, context?: Record<string, unknown>) =>
    new WILError(message, 'TIMEOUT_ERROR', context, true),

  validationError: (message: string, context?: Record<string, unknown>) =>
    new WILError(message, 'VALIDATION_ERROR', context, false),

  llmError: (message: string, context?: Record<string, unknown>) =>
    new WILError(message, 'LLM_ERROR', context, true),

  databaseError: (message: string, context?: Record<string, unknown>) =>
    new WILError(message, 'DATABASE_ERROR', context, true),
};
