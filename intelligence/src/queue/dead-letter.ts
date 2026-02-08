import { Job } from 'bullmq';
import { getQueue, addJob, createWorker, QUEUE_NAMES } from './bullmq.js';
import { logger, logArtifact } from '../lib/logger.js';
import { query } from '../db/postgres.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Dead letter record structure for failed jobs.
 */
export interface DeadLetterRecord {
  id: string;
  originalQueue: string;
  jobName: string;
  jobId: string;
  data: unknown;
  error: string;
  stack?: string;
  attemptsMade: number;
  createdAt: Date;
  processedAt?: Date;
  resolution?: 'retried' | 'discarded' | 'manual';
}

/**
 * Move a failed job to the dead-letter queue.
 * This is called when a job exhausts all retry attempts.
 */
export async function moveToDeadLetter(
  originalQueue: string,
  job: Job,
  error: Error
): Promise<void> {
  const deadLetterRecord: DeadLetterRecord = {
    id: uuidv4(),
    originalQueue,
    jobName: job.name,
    jobId: job.id ?? 'unknown',
    data: job.data,
    error: error.message,
    stack: error.stack,
    attemptsMade: job.attemptsMade,
    createdAt: new Date(),
  };

  // Store in database for persistence
  try {
    await query(
      `INSERT INTO dead_letter_queue 
       (id, original_queue, job_name, job_id, data, error, stack, attempts_made, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        deadLetterRecord.id,
        deadLetterRecord.originalQueue,
        deadLetterRecord.jobName,
        deadLetterRecord.jobId,
        JSON.stringify(deadLetterRecord.data),
        deadLetterRecord.error,
        deadLetterRecord.stack,
        deadLetterRecord.attemptsMade,
        deadLetterRecord.createdAt,
      ]
    );
  } catch (dbError) {
    // If DB insert fails, still add to queue
    logger.error('Failed to persist dead letter to database', {
      deadLetterId: deadLetterRecord.id,
      error: dbError instanceof Error ? dbError.message : String(dbError),
    });
  }

  // Also add to dead-letter queue for processing
  await addJob(QUEUE_NAMES.DEAD_LETTER, 'dead-letter', deadLetterRecord);

  // Log artifact for traceability
  logArtifact(
    'dead-letter',
    deadLetterRecord.id,
    job.id ?? 'unknown',
    deadLetterRecord.id,
    {
      originalQueue,
      jobName: job.name,
      error: error.message,
    }
  );

  logger.warn('Job moved to dead-letter queue', {
    deadLetterId: deadLetterRecord.id,
    originalQueue,
    jobName: job.name,
    jobId: job.id,
    attemptsMade: job.attemptsMade,
  });
}

/**
 * Initialize the dead-letter worker.
 * This worker can be used to alert, retry, or discard failed jobs.
 */
export function initDeadLetterWorker(): void {
  createWorker<DeadLetterRecord>(
    QUEUE_NAMES.DEAD_LETTER,
    async (job) => {
      const record = job.data;

      logger.error('Dead letter received', {
        deadLetterId: record.id,
        originalQueue: record.originalQueue,
        jobName: record.jobName,
        error: record.error,
        attempts: record.attemptsMade,
      });

      // In a production system, you might:
      // 1. Send an alert (email, Slack, PagerDuty)
      // 2. Store metrics for monitoring
      // 3. Attempt automatic resolution based on error type

      // For now, we just log it
      // The job stays in the dead-letter storage for manual review
    },
    { concurrency: 1 } // Process dead letters sequentially
  );

  logger.info('Dead-letter worker initialized');
}

/**
 * Get dead-letter records from the database.
 */
export async function getDeadLetterRecords(options?: {
  originalQueue?: string;
  limit?: number;
  offset?: number;
  unprocessedOnly?: boolean;
}): Promise<DeadLetterRecord[]> {
  let queryText = 'SELECT * FROM dead_letter_queue WHERE 1=1';
  const params: unknown[] = [];
  let paramIndex = 1;

  if (options?.originalQueue) {
    queryText += ` AND original_queue = $${paramIndex}`;
    params.push(options.originalQueue);
    paramIndex++;
  }

  if (options?.unprocessedOnly) {
    queryText += ' AND processed_at IS NULL';
  }

  queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(options?.limit ?? 50, options?.offset ?? 0);

  const result = await query<{
    id: string;
    original_queue: string;
    job_name: string;
    job_id: string;
    data: string;
    error: string;
    stack: string | null;
    attempts_made: number;
    created_at: Date;
    processed_at: Date | null;
    resolution: string | null;
  }>(queryText, params);

  return result.rows.map((row) => ({
    id: row.id,
    originalQueue: row.original_queue,
    jobName: row.job_name,
    jobId: row.job_id,
    data: JSON.parse(row.data),
    error: row.error,
    stack: row.stack ?? undefined,
    attemptsMade: row.attempts_made,
    createdAt: row.created_at,
    processedAt: row.processed_at ?? undefined,
    resolution: row.resolution as DeadLetterRecord['resolution'],
  }));
}

/**
 * Retry a dead-letter job by re-adding it to the original queue.
 */
export async function retryDeadLetter(deadLetterId: string): Promise<boolean> {
  const records = await getDeadLetterRecords();
  const record = records.find((r) => r.id === deadLetterId);

  if (!record) {
    logger.warn('Dead letter not found for retry', { deadLetterId });
    return false;
  }

  // Re-add to original queue
  const queue = getQueue(record.originalQueue as typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES]);
  await queue.add(record.jobName, record.data);

  // Mark as processed
  await query(
    `UPDATE dead_letter_queue SET processed_at = $1, resolution = 'retried' WHERE id = $2`,
    [new Date(), deadLetterId]
  );

  logger.info('Dead letter retried', {
    deadLetterId,
    originalQueue: record.originalQueue,
    jobName: record.jobName,
  });

  return true;
}

/**
 * Discard a dead-letter job (mark as intentionally not retried).
 */
export async function discardDeadLetter(deadLetterId: string): Promise<void> {
  await query(
    `UPDATE dead_letter_queue SET processed_at = $1, resolution = 'discarded' WHERE id = $2`,
    [new Date(), deadLetterId]
  );

  logger.info('Dead letter discarded', { deadLetterId });
}

/**
 * SQL to create the dead_letter_queue table.
 */
export const CREATE_DEAD_LETTER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id UUID PRIMARY KEY,
  original_queue VARCHAR(100) NOT NULL,
  job_name VARCHAR(255) NOT NULL,
  job_id VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  error TEXT NOT NULL,
  stack TEXT,
  attempts_made INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  resolution VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_dlq_original_queue ON dead_letter_queue(original_queue);
CREATE INDEX IF NOT EXISTS idx_dlq_created_at ON dead_letter_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_dlq_unprocessed ON dead_letter_queue(processed_at) WHERE processed_at IS NULL;
`;
