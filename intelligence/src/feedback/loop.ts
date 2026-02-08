import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { query } from '../db/postgres.js';
import { v4 as uuidv4 } from 'uuid';
import type { FeedbackItem, FeedbackType } from '../types/index.js';

/**
 * Feedback statistics.
 */
export interface FeedbackStats {
  total: number;
  byType: Record<FeedbackType, number>;
  averageScore: number;
  recentCount: number;
}

/**
 * Record user feedback on a dossier or lead.
 */
export async function recordFeedback(
  dossierId: string,
  type: FeedbackType,
  score: number,
  comment?: string,
  userId?: string
): Promise<FeedbackItem> {
  const traceId = getTraceId();
  const feedbackId = uuidv4();

  // Validate score
  if (score < 0 || score > 1) {
    throw new Error('Score must be between 0 and 1');
  }

  logger.info('Recording feedback', {
    feedbackId,
    dossierId,
    type,
    score,
    traceId,
  });

  const feedback: FeedbackItem = {
    id: feedbackId,
    dossierId,
    type,
    score,
    comment: comment?.slice(0, 1000), // Limit comment length
    userId,
    createdAt: new Date(),
  };

  // Store in database
  await query(
    `INSERT INTO feedback (id, dossier_id, type, score, comment, user_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      feedback.id,
      feedback.dossierId,
      feedback.type,
      feedback.score,
      feedback.comment,
      feedback.userId,
      feedback.createdAt,
    ]
  );

  // Log artifact for tracking
  logArtifact('feedback', feedbackId, dossierId.slice(0, 16), feedbackId.slice(0, 16), {
    type,
    score,
  });

  logger.info('Feedback recorded', { feedbackId, dossierId, type, score, traceId });

  return feedback;
}

/**
 * Get feedback for a dossier.
 */
export async function getDossierFeedback(dossierId: string): Promise<FeedbackItem[]> {
  const result = await query<{
    id: string;
    dossier_id: string;
    type: FeedbackType;
    score: number;
    comment: string | null;
    user_id: string | null;
    created_at: Date;
  }>(
    `SELECT * FROM feedback WHERE dossier_id = $1 ORDER BY created_at DESC`,
    [dossierId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    dossierId: row.dossier_id,
    type: row.type,
    score: row.score,
    comment: row.comment || undefined,
    userId: row.user_id || undefined,
    createdAt: row.created_at,
  }));
}

/**
 * Get feedback statistics.
 */
export async function getFeedbackStats(
  sinceDays: number = 30
): Promise<FeedbackStats> {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);

  // Get counts by type
  const typeResult = await query<{ type: FeedbackType; count: string }>(
    `SELECT type, COUNT(*) as count 
     FROM feedback 
     WHERE created_at >= $1 
     GROUP BY type`,
    [since]
  );

  const byType: Record<FeedbackType, number> = {
    positive: 0,
    negative: 0,
    correction: 0,
  };

  let total = 0;
  for (const row of typeResult.rows) {
    byType[row.type] = parseInt(row.count, 10);
    total += byType[row.type];
  }

  // Get average score
  const avgResult = await query<{ avg: string }>(
    `SELECT AVG(score) as avg FROM feedback WHERE created_at >= $1`,
    [since]
  );

  const averageScore = avgResult.rows[0]?.avg 
    ? parseFloat(avgResult.rows[0].avg) 
    : 0;

  // Get recent count (last 24 hours)
  const recentDate = new Date();
  recentDate.setHours(recentDate.getHours() - 24);

  const recentResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM feedback WHERE created_at >= $1`,
    [recentDate]
  );

  const recentCount = parseInt(recentResult.rows[0]?.count || '0', 10);

  return {
    total,
    byType,
    averageScore,
    recentCount,
  };
}

/**
 * Model performance metrics.
 */
export interface ModelMetrics {
  totalPredictions: number;
  accuracyByIntent: Record<string, number>;
  averageConfidence: number;
  confidenceCalibration: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
}

/**
 * Calculate model performance metrics based on feedback.
 */
export async function calculateModelMetrics(
  sinceDays: number = 30
): Promise<ModelMetrics> {
  const traceId = getTraceId();
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);

  logger.info('Calculating model metrics', { sinceDays, traceId });

  // Get all feedback with lead scores
  const result = await query<{
    feedback_type: FeedbackType;
    feedback_score: number;
    lead_score: number;
    lead_status: string;
  }>(
    `SELECT f.type as feedback_type, f.score as feedback_score, 
            l.score as lead_score, l.status as lead_status
     FROM feedback f
     JOIN dossiers d ON f.dossier_id = d.id
     JOIN leads l ON d.lead_id = l.id
     WHERE f.created_at >= $1`,
    [since]
  );

  const rows = result.rows;
  const totalPredictions = rows.length;

  if (totalPredictions === 0) {
    return {
      totalPredictions: 0,
      accuracyByIntent: {},
      averageConfidence: 0,
      confidenceCalibration: 0,
      falsePositiveRate: 0,
      falseNegativeRate: 0,
    };
  }

  // Calculate average confidence
  const avgConfidence = rows.reduce((sum, r) => sum + r.lead_score, 0) / totalPredictions;

  // Calculate false positive/negative rates
  const approved = rows.filter((r) => r.lead_status === 'approved');
  const rejected = rows.filter((r) => r.lead_status === 'rejected');

  const falsePositives = approved.filter((r) => r.feedback_type === 'negative').length;
  const falseNegatives = rejected.filter((r) => r.feedback_type === 'positive').length;

  const falsePositiveRate = approved.length > 0 ? falsePositives / approved.length : 0;
  const falseNegativeRate = rejected.length > 0 ? falseNegatives / rejected.length : 0;

  // Calculate calibration (how well confidence matches accuracy)
  const positiveFeedback = rows.filter((r) => r.feedback_type === 'positive');
  const accuracy = positiveFeedback.length / totalPredictions;
  const confidenceCalibration = 1 - Math.abs(avgConfidence - accuracy);

  logger.info('Model metrics calculated', {
    totalPredictions,
    avgConfidence,
    falsePositiveRate,
    falseNegativeRate,
    confidenceCalibration,
    traceId,
  });

  return {
    totalPredictions,
    accuracyByIntent: {}, // Would need intent data to populate
    averageConfidence: avgConfidence,
    confidenceCalibration,
    falsePositiveRate,
    falseNegativeRate,
  };
}

/**
 * Shadow mode evaluation result.
 */
export interface ShadowEvaluation {
  experimentId: string;
  controlScore: number;
  experimentScore: number;
  improvementPercent: number;
  sampleSize: number;
  significanceLevel: number;
}

/**
 * Run shadow mode A/B evaluation.
 */
export async function runShadowEvaluation(
  experimentId: string,
  controlPredictions: Array<{ id: string; score: number }>,
  experimentPredictions: Array<{ id: string; score: number }>,
  groundTruth: Array<{ id: string; isPositive: boolean }>
): Promise<ShadowEvaluation> {
  const traceId = getTraceId();

  logger.info('Running shadow evaluation', {
    experimentId,
    sampleSize: groundTruth.length,
    traceId,
  });

  const truthMap = new Map(groundTruth.map((t) => [t.id, t.isPositive]));

  // Calculate control accuracy
  let controlCorrect = 0;
  for (const pred of controlPredictions) {
    const isCorrect = (pred.score >= 0.5) === truthMap.get(pred.id);
    if (isCorrect) controlCorrect++;
  }
  const controlScore = controlCorrect / controlPredictions.length;

  // Calculate experiment accuracy
  let experimentCorrect = 0;
  for (const pred of experimentPredictions) {
    const isCorrect = (pred.score >= 0.5) === truthMap.get(pred.id);
    if (isCorrect) experimentCorrect++;
  }
  const experimentScore = experimentCorrect / experimentPredictions.length;

  // Calculate improvement
  const improvementPercent = ((experimentScore - controlScore) / controlScore) * 100;

  // Simple significance calculation (would use proper statistical test in production)
  const sampleSize = groundTruth.length;
  const significanceLevel = sampleSize >= 100 ? 0.95 : sampleSize >= 30 ? 0.9 : 0.8;

  const result: ShadowEvaluation = {
    experimentId,
    controlScore,
    experimentScore,
    improvementPercent,
    sampleSize,
    significanceLevel,
  };

  // Log artifact
  logArtifact('shadow-eval', experimentId, experimentId.slice(0, 16), uuidv4().slice(0, 16), result);

  logger.info('Shadow evaluation completed', {
    experimentId,
    controlScore,
    experimentScore,
    improvementPercent,
    traceId,
  });

  return result;
}

/**
 * Log prompt refinement for tracking.
 */
export async function logPromptRefinement(
  promptName: string,
  oldVersion: string,
  newVersion: string,
  reason: string,
  metrics: Record<string, number>
): Promise<void> {
  const traceId = getTraceId();
  const refinementId = uuidv4();

  logger.info('Logging prompt refinement', {
    refinementId,
    promptName,
    oldVersion,
    newVersion,
    reason,
    traceId,
  });

  await query(
    `INSERT INTO prompt_refinements (id, prompt_name, old_version, new_version, reason, metrics, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [refinementId, promptName, oldVersion, newVersion, reason, JSON.stringify(metrics), new Date()]
  ).catch((error) => {
    // Table might not exist, just log
    logger.warn('Failed to log prompt refinement', {
      error: error instanceof Error ? error.message : String(error),
    });
  });

  logArtifact('prompt-refinement', refinementId, promptName, refinementId.slice(0, 16), {
    oldVersion,
    newVersion,
    reason,
    ...metrics,
  });
}
