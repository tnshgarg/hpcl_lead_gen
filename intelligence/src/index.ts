import { initPostgres, closePostgres } from './db/postgres.js';
import { runMigrations } from './db/migrate.js';
import { initRedis, closeRedis } from './db/redis.js';
import { initQdrant, waitForQdrant } from './db/qdrant.js';
import { initVectorStore } from './embeddings/vector-store.js';
import { registerDefaultPrompts } from './ai/prompts/index.js';
import { initPipelineQueues, startPipelineWorkers, shutdownPipeline } from './pipeline/workers.js';
import { startAPIServer, stopAPIServer } from './api/server.js';
import { initDeadLetterWorker } from './queue/dead-letter.js';
import { logger } from './lib/logger.js';
import { generateTraceId, withTrace } from './lib/tracing.js';
import { env } from './config/env.js';

/**
 * Application state.
 */
let isShuttingDown = false;

/**
 * Initialize all infrastructure components.
 */
async function initInfrastructure(): Promise<void> {
  logger.info('Initializing infrastructure...');

  // Database connections
  await initPostgres();
  logger.info('PostgreSQL connected');

  await initRedis();
  logger.info('Redis connected');

  initQdrant();
  logger.info('Qdrant client initialized');
  
  // Wait for Qdrant to be ready
  await waitForQdrant();

  // Run database migrations
  try {
    await runMigrations();
    logger.info('Database migrations completed');
  } catch (error) {
    logger.error('Migration failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    // For now, we'll log and continue, but in production this might be fatal
    // depending on the error consistency
  }

  // Initialize vector store
  await initVectorStore();
  logger.info('Vector store initialized');

  // Register default prompts
  try {
    await registerDefaultPrompts();
    logger.info('Default prompts registered');
  } catch (error) {
    logger.warn('Failed to register default prompts', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  logger.info('Infrastructure initialization complete');
}

/**
 * Start all workers and services.
 */
function startServices(): void {
  logger.info('Starting services...');

  // Initialize queues
  initPipelineQueues();
  logger.info('Pipeline queues initialized');

  // Start workers
  startPipelineWorkers(env.QUEUE_CONCURRENCY);
  logger.info('Pipeline workers started');

  // Start dead letter worker
  initDeadLetterWorker();
  logger.info('Dead letter worker started');

  // Start API server
  startAPIServer({ port: env.PORT });
  logger.info(`API server started on port ${env.PORT}`);

  logger.info('All services started');
}

/**
 * Graceful shutdown handler.
 */
async function gracefulShutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress');
    return;
  }

  isShuttingDown = true;
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Stop accepting new requests
    await stopAPIServer();
    logger.info('API server stopped');

    // Stop workers and finish processing
    await shutdownPipeline();
    logger.info('Pipeline workers stopped');

    // Close database connections
    await closePostgres();
    logger.info('PostgreSQL connection closed');

    await closeRedis();
    logger.info('Redis connection closed');

    logger.info('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  const traceId = generateTraceId();

  await withTrace(async () => {
    logger.info('Starting Web Intelligence Layer...', { traceId });

    try {
      // Initialize infrastructure
      await initInfrastructure();

      // Start services
      startServices();

      // Register shutdown handlers
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

      // Handle uncaught errors
      process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception', {
          error: error.message,
          stack: error.stack,
        });
        gracefulShutdown('uncaughtException');
      });

      process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled rejection', {
          reason: reason instanceof Error ? reason.message : String(reason),
        });
      });

      logger.info('Web Intelligence Layer is running', {
        port: env.PORT,
        environment: env.NODE_ENV,
        traceId,
      });
    } catch (error) {
      logger.error('Failed to start application', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  });
}

// Run the application
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
