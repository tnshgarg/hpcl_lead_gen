import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import { getRedisConnectionOptions, env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { withTrace } from '../lib/tracing.js';

/**
 * Queue names used throughout the application.
 */
export const QUEUE_NAMES = {
  CRAWL: 'crawl',
  NORMALIZE: 'normalize',
  EMBED: 'embed',
  ANALYZE: 'analyze',
  DEAD_LETTER: 'dead-letter',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/**
 * Queue instances registry.
 */
const queues = new Map<string, Queue>();
const workers = new Map<string, Worker>();
const queueEvents = new Map<string, QueueEvents>();

/**
 * Get Redis connection options for BullMQ.
 */
function getBullMQConnection() {
  const options = getRedisConnectionOptions();
  return {
    host: options.host,
    port: options.port,
    password: options.password,
  };
}

/**
 * Create or get a queue instance.
 */
export function getQueue(name: QueueName): Queue {
  let queue = queues.get(name);

  if (!queue) {
    queue = new Queue(name, {
      connection: getBullMQConnection(),
      defaultJobOptions: {
        attempts: env.JOB_RETRY_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: env.JOB_RETRY_DELAY_MS,
        },
        removeOnComplete: {
          age: 3600 * 24, // Keep completed jobs for 24 hours
          count: 1000,
        },
        removeOnFail: false, // Keep failed jobs for inspection
      },
    });

    queues.set(name, queue);
    logger.info('Queue created', { queueName: name });
  }

  return queue;
}

/**
 * Add a job to a queue with tracing.
 */
export async function addJob<T>(
  queueName: QueueName,
  jobName: string,
  data: T,
  options?: {
    priority?: number;
    delay?: number;
    jobId?: string;
  }
): Promise<Job<T>> {
  const queue = getQueue(queueName);

  const job = await queue.add(jobName, data, {
    priority: options?.priority,
    delay: options?.delay,
    jobId: options?.jobId,
  });

  logger.info('Job added to queue', {
    queueName,
    jobName,
    jobId: job.id,
    priority: options?.priority,
  });

  return job;
}

/**
 * Job processor function type.
 */
export type JobProcessor<T, R = void> = (job: Job<T>) => Promise<R>;

/**
 * Create a worker for processing jobs from a queue.
 */
export function createWorker<T, R = void>(
  queueName: QueueName,
  processor: JobProcessor<T, R>,
  options?: {
    concurrency?: number;
  }
): Worker<T, R> {
  // Check if worker already exists and close it
  const existingWorker = workers.get(queueName);
  if (existingWorker) {
    void existingWorker.close();
  }

  const worker = new Worker<T, R>(
    queueName,
    async (job) => {
      // Wrap job processing in trace context
      return withTrace(
        async () => {
          const startTime = Date.now();
          logger.info('Job processing started', {
            queueName,
            jobName: job.name,
            jobId: job.id,
            attempt: job.attemptsMade + 1,
          });

          try {
            const result = await processor(job);
            const duration = Date.now() - startTime;

            logger.info('Job processing completed', {
              queueName,
              jobName: job.name,
              jobId: job.id,
              duration,
            });

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;

            logger.error('Job processing failed', {
              queueName,
              jobName: job.name,
              jobId: job.id,
              duration,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            });

            throw error;
          }
        },
        job.id ?? undefined,
        { queueName, jobName: job.name }
      ) as Promise<R>;
    },
    {
      connection: getBullMQConnection(),
      concurrency: options?.concurrency ?? env.QUEUE_CONCURRENCY,
    }
  );

  // Worker event handlers
  worker.on('completed', (job) => {
    logger.debug('Worker completed job', { jobId: job.id, jobName: job.name });
  });

  worker.on('failed', (job, error) => {
    logger.warn('Worker job failed', {
      jobId: job?.id,
      jobName: job?.name,
      error: error.message,
      attempts: job?.attemptsMade,
    });
  });

  worker.on('error', (error) => {
    logger.error('Worker error', { queueName, error: error.message });
  });

  workers.set(queueName, worker);
  logger.info('Worker created', { queueName, concurrency: options?.concurrency ?? env.QUEUE_CONCURRENCY });

  return worker;
}

/**
 * Get queue events for monitoring.
 */
export function getQueueEvents(queueName: QueueName): QueueEvents {
  let events = queueEvents.get(queueName);

  if (!events) {
    events = new QueueEvents(queueName, {
      connection: getBullMQConnection(),
    });
    queueEvents.set(queueName, events);
  }

  return events;
}

/**
 * Get queue statistics.
 */
export async function getQueueStats(queueName: QueueName) {
  const queue = getQueue(queueName);

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return { waiting, active, completed, failed, delayed };
}

/**
 * Close all queues and workers gracefully.
 */
export async function closeAllQueues(): Promise<void> {
  logger.info('Closing all queues and workers...');

  // Close workers first
  for (const [name, worker] of workers) {
    await worker.close();
    logger.debug('Worker closed', { queueName: name });
  }
  workers.clear();

  // Close queue events
  for (const [name, events] of queueEvents) {
    await events.close();
    logger.debug('Queue events closed', { queueName: name });
  }
  queueEvents.clear();

  // Close queues
  for (const [name, queue] of queues) {
    await queue.close();
    logger.debug('Queue closed', { queueName: name });
  }
  queues.clear();

  logger.info('All queues and workers closed');
}
