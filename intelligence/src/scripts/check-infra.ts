import { initPostgres, checkPostgresHealth, closePostgres } from '../db/postgres.js';
import { initRedis, checkRedisHealth, closeRedis } from '../db/redis.js';
import { initQdrant, checkQdrantHealth } from '../db/qdrant.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

/**
 * Check all infrastructure connections.
 */
async function checkInfrastructure(): Promise<void> {
  logger.info('Checking infrastructure connections...');
  logger.info('Configuration', {
    postgres: `${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
    redis: `${env.REDIS_HOST}:${env.REDIS_PORT}`,
    qdrant: `${env.QDRANT_HOST}:${env.QDRANT_PORT}`,
  });

  const results: Record<string, boolean> = {};

  // Check PostgreSQL
  try {
    initPostgres();
    results['postgres'] = await checkPostgresHealth();
    logger.info('PostgreSQL', { connected: results['postgres'] });
  } catch (error) {
    results['postgres'] = false;
    logger.error('PostgreSQL connection failed', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Check Redis
  try {
    initRedis();
    results['redis'] = await checkRedisHealth();
    logger.info('Redis', { connected: results['redis'] });
  } catch (error) {
    results['redis'] = false;
    logger.error('Redis connection failed', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Check Qdrant
  try {
    initQdrant();
    results['qdrant'] = await checkQdrantHealth();
    logger.info('Qdrant', { connected: results['qdrant'] });
  } catch (error) {
    results['qdrant'] = false;
    logger.error('Qdrant connection failed', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Summary
  const allHealthy = Object.values(results).every(Boolean);
  
  console.log('\n=== Infrastructure Status ===');
  console.log(`PostgreSQL: ${results['postgres'] ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Redis:      ${results['redis'] ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Qdrant:     ${results['qdrant'] ? '✅ Connected' : '❌ Failed'}`);
  console.log('=============================\n');

  // Cleanup
  await closeRedis();
  await closePostgres();

  if (!allHealthy) {
    console.log('⚠️  Some infrastructure components are not available.');
    console.log('   Make sure Docker containers are running: docker-compose up -d');
    process.exit(1);
  } else {
    console.log('✅ All infrastructure components are healthy!');
    process.exit(0);
  }
}

// Run check
checkInfrastructure().catch((error) => {
  logger.error('Infrastructure check failed', { error });
  process.exit(1);
});
