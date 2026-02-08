import pg from 'pg';
import { env, getPostgresConnectionString } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { withRetry, isNetworkError } from '../lib/retry.js';

const { Pool } = pg;

/**
 * PostgreSQL connection pool instance.
 * Configured with sensible defaults and health checking.
 */
let pool: pg.Pool | null = null;

/**
 * Initialize the PostgreSQL connection pool.
 */
export function initPostgres(): pg.Pool {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: getPostgresConnectionString(),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Log connection events
  pool.on('connect', () => {
    logger.debug('PostgreSQL client connected');
  });

  pool.on('error', (err) => {
    logger.error('PostgreSQL pool error', { error: err.message });
  });

  pool.on('remove', () => {
    logger.debug('PostgreSQL client removed from pool');
  });

  logger.info('PostgreSQL connection pool initialized', {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
  });

  return pool;
}

/**
 * Get the PostgreSQL pool instance.
 * Throws if not initialized.
 */
export function getPool(): pg.Pool {
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized. Call initPostgres() first.');
  }
  return pool;
}

/**
 * Execute a query with automatic retry on network errors.
 */
export async function query<T extends pg.QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  const currentPool = getPool();

  return withRetry(
    async () => {
      const start = Date.now();
      const result = await currentPool.query<T>(text, params);
      const duration = Date.now() - start;

      logger.debug('Query executed', {
        query: text.slice(0, 100),
        duration,
        rows: result.rowCount,
      });

      return result;
    },
    {
      maxAttempts: 3,
      baseDelayMs: 500,
      isRetryable: isNetworkError,
    }
  );
}

/**
 * Execute multiple queries in a transaction.
 */
export async function transaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const currentPool = getPool();
  const client = await currentPool.connect();

  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check PostgreSQL connection health.
 */
export async function checkPostgresHealth(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as health');
    return result.rows.length === 1;
  } catch (error) {
    logger.error('PostgreSQL health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Close the PostgreSQL connection pool.
 */
export async function closePostgres(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('PostgreSQL connection pool closed');
  }
}
