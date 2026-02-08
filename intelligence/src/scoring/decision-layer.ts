import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { query } from '../db/postgres.js';
import { v4 as uuidv4 } from 'uuid';
import type { ScoringInputs, ScoredLead, ScoringWeights, TrustLevel, LLMResponse } from '../types/index.js';

/**
 * Scoring thresholds configuration.
 */
export interface ScoringThresholds {
  approvalThreshold: number;
  rejectionThreshold: number;
  highConfidence: number;
  lowConfidence: number;
}

/**
 * Default scoring thresholds.
 */
const DEFAULT_THRESHOLDS: ScoringThresholds = {
  approvalThreshold: 0.75,
  rejectionThreshold: 0.3,
  highConfidence: 0.8,
  lowConfidence: 0.4,
};

/**
 * Weight configuration for scoring formula.
 */
export interface WeightConfig {
  llmConfidence: number;
  sourceTrust: number;
  freshness: number;
  signalDensity: number;
  embeddingSimilarity: number;
}

/**
 * Default weights for scoring.
 */
const DEFAULT_WEIGHTS: WeightConfig = {
  llmConfidence: 0.3,
  sourceTrust: 0.2,
  freshness: 0.15,
  signalDensity: 0.15,
  embeddingSimilarity: 0.2,
};

/**
 * Convert trust level to numeric score.
 */
function trustToScore(trust: TrustLevel): number {
  switch (trust) {
    case 'high':
      return 1.0;
    case 'medium':
      return 0.7;
    case 'low':
      return 0.4;
    case 'unknown':
    default:
      return 0.2;
  }
}

/**
 * Calculate weighted score from inputs.
 */
export function calculateScore(
  inputs: ScoringInputs,
  weights: WeightConfig = DEFAULT_WEIGHTS
): { score: number; breakdown: ScoringWeights } {
  const trustScore = trustToScore(inputs.sourceTrust);

  const breakdown: ScoringWeights = {
    llmConfidence: inputs.llmOutput.confidence * weights.llmConfidence,
    sourceTrust: trustScore * weights.sourceTrust,
    freshness: inputs.freshness * weights.freshness,
    signalDensity: inputs.signalDensity * weights.signalDensity,
    embeddingSimilarity: inputs.embeddingSimilarity * weights.embeddingSimilarity,
  };

  const totalScore =
    breakdown.llmConfidence +
    breakdown.sourceTrust +
    breakdown.freshness +
    breakdown.signalDensity +
    breakdown.embeddingSimilarity;

  return {
    score: Math.min(Math.max(totalScore, 0), 1), // Clamp to [0, 1]
    breakdown,
  };
}

/**
 * Determine lead status based on score.
 */
export function determineStatus(
  score: number,
  thresholds: ScoringThresholds = DEFAULT_THRESHOLDS
): 'approved' | 'review_needed' | 'rejected' {
  if (score >= thresholds.approvalThreshold) {
    return 'approved';
  } else if (score <= thresholds.rejectionThreshold) {
    return 'rejected';
  }
  return 'review_needed';
}

/**
 * Generate reason codes for the score.
 */
function generateReasonCodes(
  inputs: ScoringInputs,
  breakdown: ScoringWeights,
  thresholds: ScoringThresholds
): string[] {
  const codes: string[] = [];

  // LLM confidence reasons
  if (inputs.llmOutput.confidence >= thresholds.highConfidence) {
    codes.push('HIGH_LLM_CONFIDENCE');
  } else if (inputs.llmOutput.confidence <= thresholds.lowConfidence) {
    codes.push('LOW_LLM_CONFIDENCE');
  }

  // Source trust reasons
  if (inputs.sourceTrust === 'high') {
    codes.push('TRUSTED_SOURCE');
  } else if (inputs.sourceTrust === 'low' || inputs.sourceTrust === 'unknown') {
    codes.push('UNTRUSTED_SOURCE');
  }

  // Freshness reasons
  if (inputs.freshness >= 0.8) {
    codes.push('RECENT_CONTENT');
  } else if (inputs.freshness <= 0.2) {
    codes.push('STALE_CONTENT');
  }

  // Signal density reasons
  if (inputs.signalDensity >= 0.7) {
    codes.push('HIGH_SIGNAL_DENSITY');
  } else if (inputs.signalDensity <= 0.3) {
    codes.push('LOW_SIGNAL_DENSITY');
  }

  // Embedding similarity reasons
  if (inputs.embeddingSimilarity >= 0.8) {
    codes.push('HIGH_SIMILARITY_TO_KNOWN');
  } else if (inputs.embeddingSimilarity <= 0.3) {
    codes.push('LOW_SIMILARITY_TO_KNOWN');
  }

  return codes;
}

/**
 * Score a lead and produce a decision.
 */
export async function scoreLead(
  documentId: string,
  inputs: ScoringInputs,
  options: {
    weights?: Partial<WeightConfig>;
    thresholds?: Partial<ScoringThresholds>;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<ScoredLead> {
  const traceId = getTraceId();
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };
  const thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds };

  logger.debug('Scoring lead', { documentId, traceId });

  // Calculate score
  const { score, breakdown } = calculateScore(inputs, weights);

  // Determine status
  const status = determineStatus(score, thresholds);

  // Generate reason codes
  const reasonCodes = generateReasonCodes(inputs, breakdown, thresholds);

  const leadId = uuidv4();

  const lead: ScoredLead = {
    id: leadId,
    documentId,
    score,
    weights: breakdown,
    status,
    reasonCodes,
    createdAt: new Date(),
  };

  // Store in database
  try {
    await query(
      `INSERT INTO leads (id, document_id, score, weights, status, reason_codes, created_at, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        lead.id,
        lead.documentId,
        lead.score,
        JSON.stringify(lead.weights),
        lead.status,
        lead.reasonCodes,
        lead.createdAt,
        options.metadata || {},
      ]
    );
  } catch (error) {
    logger.warn('Failed to store lead in database', {
      leadId,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
  }

  // Log artifact
  logArtifact('lead-score', leadId, documentId.slice(0, 16), leadId.slice(0, 16), {
    score,
    status,
    reasonCodes,
  });

  logger.info('Lead scored', {
    leadId,
    documentId,
    score,
    status,
    reasonCodes,
    traceId,
  });

  return lead;
}

/**
 * Batch score multiple leads.
 */
export async function batchScoreLeads(
  leads: Array<{
    documentId: string;
    inputs: ScoringInputs;
  }>,
  options?: {
    weights?: Partial<WeightConfig>;
    thresholds?: Partial<ScoringThresholds>;
  }
): Promise<ScoredLead[]> {
  const traceId = getTraceId();

  logger.info('Batch scoring leads', { count: leads.length, traceId });

  const results = await Promise.all(
    leads.map((lead) => scoreLead(lead.documentId, lead.inputs, options))
  );

  const statusCounts = {
    approved: results.filter((r) => r.status === 'approved').length,
    review_needed: results.filter((r) => r.status === 'review_needed').length,
    rejected: results.filter((r) => r.status === 'rejected').length,
  };

  logger.info('Batch scoring completed', { ...statusCounts, traceId });

  return results;
}

/**
 * Get leads by status.
 */
export async function getLeadsByStatus(
  status: 'approved' | 'review_needed' | 'rejected',
  limit: number = 50,
  offset: number = 0
): Promise<ScoredLead[]> {
  const result = await query<{
    id: string;
    document_id: string;
    score: number;
    weights: ScoringWeights;
    status: string;
    reason_codes: string[];
    created_at: Date;
  }>(
    `SELECT * FROM leads WHERE status = $1 ORDER BY score DESC LIMIT $2 OFFSET $3`,
    [status, limit, offset]
  );

  return result.rows.map((row) => ({
    id: row.id,
    documentId: row.document_id,
    score: row.score,
    weights: row.weights,
    status: row.status as ScoredLead['status'],
    reasonCodes: row.reason_codes,
    createdAt: row.created_at,
  }));
}

/**
 * Update scoring thresholds (admin function).
 */
export function updateThresholds(newThresholds: Partial<ScoringThresholds>): ScoringThresholds {
  const updated = { ...DEFAULT_THRESHOLDS, ...newThresholds };
  logger.info('Scoring thresholds updated', updated);
  return updated;
}

/**
 * Update scoring weights (admin function).
 */
export function updateWeights(newWeights: Partial<WeightConfig>): WeightConfig {
  const updated = { ...DEFAULT_WEIGHTS, ...newWeights };

  // Validate weights sum to 1
  const sum = Object.values(updated).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.001) {
    logger.warn('Scoring weights do not sum to 1', { sum, weights: updated });
  }

  logger.info('Scoring weights updated', updated);
  return updated;
}
