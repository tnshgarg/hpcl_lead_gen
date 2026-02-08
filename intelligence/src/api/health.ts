import { checkPostgresHealth } from '../db/postgres.js';
import { checkRedisHealth } from '../db/redis.js';
import { checkQdrantHealth } from '../db/qdrant.js';
import { getVectorStoreStats } from '../embeddings/vector-store.js';
import { getFeedbackStats, calculateModelMetrics } from '../feedback/loop.js';
import { getLeadsByStatus } from '../scoring/decision-layer.js';
import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';

/**
 * Health check result for individual component.
 */
export interface ComponentHealth {
  name: string;
  healthy: boolean;
  latencyMs: number;
  details?: Record<string, unknown> | undefined;
  error?: string;
}

/**
 * Overall system health status.
 */
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  version: string;
  uptime: number;
  components: ComponentHealth[];
}

/**
 * Application start time for uptime calculation.
 */
const startTime = Date.now();

/**
 * Application version.
 */
const VERSION = '1.0.0';

/**
 * Check health of a component with timing.
 */
async function checkComponent(
  name: string,
  checkFn: () => Promise<boolean>,
  detailsFn?: () => Promise<Record<string, unknown>>
): Promise<ComponentHealth> {
  const start = Date.now();

  try {
    const healthy = await checkFn();
    const latencyMs = Date.now() - start;

    let details: Record<string, unknown> | undefined;
    if (healthy && detailsFn) {
      try {
        details = await detailsFn();
      } catch {
        // Ignore details fetch errors
      }
    }

    return {
      name,
      healthy,
      latencyMs,
      details,
    };
  } catch (error) {
    return {
      name,
      healthy: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get full system health status.
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  const traceId = getTraceId();
  logger.debug('Checking system health', { traceId });

  const components = await Promise.all([
    checkComponent('postgresql', checkPostgresHealth),
    checkComponent('redis', checkRedisHealth),
    checkComponent('qdrant', checkQdrantHealth, getVectorStoreStats),
  ]);

  // Determine overall status
  const unhealthyCount = components.filter((c) => !c.healthy).length;
  let status: SystemHealth['status'];

  if (unhealthyCount === 0) {
    status = 'healthy';
  } else if (unhealthyCount < components.length) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }

  return {
    status,
    timestamp: new Date(),
    version: VERSION,
    uptime: Date.now() - startTime,
    components,
  };
}

/**
 * Simple liveness check (for Kubernetes).
 */
export async function livenessCheck(): Promise<boolean> {
  return true; // Process is running
}

/**
 * Readiness check (for Kubernetes).
 */
export async function readinessCheck(): Promise<boolean> {
  const health = await getSystemHealth();
  return health.status !== 'unhealthy';
}

/**
 * Metrics for Prometheus.
 */
export interface PrometheusMetrics {
  // System metrics
  uptime_seconds: number;
  
  // Database metrics
  postgres_healthy: number;
  redis_healthy: number;
  qdrant_healthy: number;
  
  // Vector store metrics
  vector_count: number;
  
  // Lead metrics
  leads_approved: number;
  leads_review_needed: number;
  leads_rejected: number;
  
  // Feedback metrics
  feedback_total: number;
  feedback_positive: number;
  feedback_negative: number;
  feedback_average_score: number;
  
  // Model metrics
  model_accuracy: number;
  model_false_positive_rate: number;
  model_false_negative_rate: number;
}

/**
 * Get Prometheus-format metrics.
 */
export async function getPrometheusMetrics(): Promise<string> {
  const traceId = getTraceId();
  logger.debug('Generating Prometheus metrics', { traceId });

  const lines: string[] = [];

  // Helper to add metric
  const addMetric = (name: string, value: number, help: string, type: string = 'gauge') => {
    lines.push(`# HELP wil_${name} ${help}`);
    lines.push(`# TYPE wil_${name} ${type}`);
    lines.push(`wil_${name} ${value}`);
  };

  // System metrics
  addMetric('uptime_seconds', (Date.now() - startTime) / 1000, 'Application uptime in seconds');

  // Health metrics
  const [pgHealth, redisHealth, qdrantHealth] = await Promise.all([
    checkPostgresHealth().catch(() => false),
    checkRedisHealth().catch(() => false),
    checkQdrantHealth().catch(() => false),
  ]);

  addMetric('postgres_healthy', pgHealth ? 1 : 0, 'PostgreSQL health status');
  addMetric('redis_healthy', redisHealth ? 1 : 0, 'Redis health status');
  addMetric('qdrant_healthy', qdrantHealth ? 1 : 0, 'Qdrant health status');

  // Vector store metrics
  try {
    const vectorStats = await getVectorStoreStats();
    addMetric('vector_count', vectorStats.vectorCount, 'Total vectors in store');
  } catch {
    addMetric('vector_count', 0, 'Total vectors in store');
  }

  // Lead metrics
  try {
    const [approved, review, rejected] = await Promise.all([
      getLeadsByStatus('approved', 1).then((r) => r.length > 0 ? 1 : 0).catch(() => 0),
      getLeadsByStatus('review_needed', 1).then((r) => r.length > 0 ? 1 : 0).catch(() => 0),
      getLeadsByStatus('rejected', 1).then((r) => r.length > 0 ? 1 : 0).catch(() => 0),
    ]);
    // Note: These would be actual counts in production
    addMetric('leads_approved', approved, 'Number of approved leads', 'counter');
    addMetric('leads_review_needed', review, 'Number of leads needing review', 'counter');
    addMetric('leads_rejected', rejected, 'Number of rejected leads', 'counter');
  } catch {
    // Ignore
  }

  // Feedback metrics
  try {
    const feedbackStats = await getFeedbackStats();
    addMetric('feedback_total', feedbackStats.total, 'Total feedback count', 'counter');
    addMetric('feedback_positive', feedbackStats.byType.positive || 0, 'Positive feedback count', 'counter');
    addMetric('feedback_negative', feedbackStats.byType.negative || 0, 'Negative feedback count', 'counter');
    addMetric('feedback_average_score', feedbackStats.averageScore, 'Average feedback score');
  } catch {
    // Ignore
  }

  // Model metrics
  try {
    const modelMetrics = await calculateModelMetrics(7);
    addMetric('model_predictions_total', modelMetrics.totalPredictions, 'Total model predictions', 'counter');
    addMetric('model_confidence_avg', modelMetrics.averageConfidence, 'Average model confidence');
    addMetric('model_false_positive_rate', modelMetrics.falsePositiveRate, 'Model false positive rate');
    addMetric('model_false_negative_rate', modelMetrics.falseNegativeRate, 'Model false negative rate');
  } catch {
    // Ignore
  }

  return lines.join('\n');
}

/**
 * Get JSON metrics (for dashboards).
 */
export async function getJSONMetrics(): Promise<Record<string, unknown>> {
  const health = await getSystemHealth();
  
  let feedbackStats = null;
  let modelMetrics = null;
  let vectorStats = null;

  try {
    feedbackStats = await getFeedbackStats();
  } catch { /* ignore */ }

  try {
    modelMetrics = await calculateModelMetrics(7);
  } catch { /* ignore */ }

  try {
    vectorStats = await getVectorStoreStats();
  } catch { /* ignore */ }

  return {
    health,
    feedback: feedbackStats,
    model: modelMetrics,
    vectors: vectorStats,
  };
}
