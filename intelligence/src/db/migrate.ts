import { query } from './postgres.js';
import { logger } from '../lib/logger.js';
import { CREATE_DEAD_LETTER_TABLE_SQL } from '../queue/dead-letter.js';

/**
 * Database migrations for the Web Intelligence Layer.
 * Each migration has an ID and SQL to execute.
 */
const migrations = [
  {
    id: '001_create_migrations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(100) PRIMARY KEY,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    id: '002_create_documents_table',
    sql: `
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY,
        url TEXT NOT NULL UNIQUE,
        text TEXT NOT NULL,
        raw_text TEXT,
        metadata JSONB DEFAULT '{}',
        source_trust VARCHAR(20) NOT NULL DEFAULT 'unknown',
        fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
        normalized_at TIMESTAMP WITH TIME ZONE,
        embedding_version VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_documents_url ON documents(url);
      CREATE INDEX IF NOT EXISTS idx_documents_fetched_at ON documents(fetched_at);
      CREATE INDEX IF NOT EXISTS idx_documents_source_trust ON documents(source_trust);
    `,
  },
  {
    id: '003_create_crawl_jobs_table',
    sql: `
      CREATE TABLE IF NOT EXISTS crawl_jobs (
        id UUID PRIMARY KEY,
        url TEXT NOT NULL,
        priority INTEGER DEFAULT 5,
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        status VARCHAR(20) DEFAULT 'pending',
        error TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE
      );

      CREATE INDEX IF NOT EXISTS idx_crawl_jobs_status ON crawl_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_crawl_jobs_created_at ON crawl_jobs(created_at);
    `,
  },
  {
    id: '004_create_embeddings_table',
    sql: `
      CREATE TABLE IF NOT EXISTS embeddings (
        document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
        vector_id VARCHAR(255) NOT NULL,
        model_version VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_embeddings_model_version ON embeddings(model_version);
    `,
  },
  {
    id: '005_create_prompts_table',
    sql: `
      CREATE TABLE IF NOT EXISTS prompts (
        id UUID PRIMARY KEY,
        version VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        template TEXT NOT NULL,
        input_schema JSONB NOT NULL,
        output_schema JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(name, version)
      );

      CREATE INDEX IF NOT EXISTS idx_prompts_name ON prompts(name);
      CREATE INDEX IF NOT EXISTS idx_prompts_active ON prompts(is_active) WHERE is_active = true;
    `,
  },
  {
    id: '006_create_leads_table',
    sql: `
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY,
        document_id UUID NOT NULL REFERENCES documents(id),
        score DECIMAL(5,4) NOT NULL,
        weights JSONB NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'review_needed',
        reason_codes TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_leads_document_id ON leads(document_id);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
    `,
  },
  {
    id: '007_create_dossiers_table',
    sql: `
      CREATE TABLE IF NOT EXISTS dossiers (
        id UUID PRIMARY KEY,
        lead_id UUID NOT NULL REFERENCES leads(id),
        structured_data JSONB NOT NULL,
        human_summary TEXT NOT NULL,
        reason_codes TEXT[] DEFAULT '{}',
        confidence_explanation TEXT,
        suggested_actions JSONB DEFAULT '[]',
        source_documents UUID[] DEFAULT '{}',
        generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_dossiers_lead_id ON dossiers(lead_id);
    `,
  },
  {
    id: '008_create_feedback_table',
    sql: `
      CREATE TABLE IF NOT EXISTS lead_feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID NOT NULL REFERENCES leads(id),
        outcome VARCHAR(20) NOT NULL,
        reason TEXT,
        submitted_by VARCHAR(255) NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_feedback_lead_id ON lead_feedback(lead_id);
      CREATE INDEX IF NOT EXISTS idx_feedback_outcome ON lead_feedback(outcome);
    `,
  },
  {
    id: '009_create_dead_letter_queue',
    sql: CREATE_DEAD_LETTER_TABLE_SQL,
  },
  {
    id: '010_create_pipeline_executions_table',
    sql: `
      CREATE TABLE IF NOT EXISTS pipeline_executions (
        id UUID PRIMARY KEY,
        document_id UUID REFERENCES documents(id),
        stages JSONB NOT NULL DEFAULT '[]',
        status VARCHAR(20) NOT NULL DEFAULT 'running',
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );

      CREATE INDEX IF NOT EXISTS idx_pipeline_document_id ON pipeline_executions(document_id);
      CREATE INDEX IF NOT EXISTS idx_pipeline_status ON pipeline_executions(status);
    `,
  },
  {
    id: '011_fix_schema_mismatches',
    sql: `
      ALTER TABLE documents ADD COLUMN IF NOT EXISTS title TEXT;
      ALTER TABLE documents ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE documents ADD COLUMN IF NOT EXISTS language VARCHAR(10);
      ALTER TABLE documents ADD COLUMN IF NOT EXISTS word_count INTEGER;
      ALTER TABLE documents ADD COLUMN IF NOT EXISTS hash TEXT;
      
      CREATE INDEX IF NOT EXISTS idx_documents_hash ON documents(hash);
    `,
  },
  {
    id: '012_create_feedback_table',
    sql: `
      CREATE TABLE IF NOT EXISTS feedback (
        id UUID PRIMARY KEY,
        dossier_id UUID NOT NULL REFERENCES dossiers(id),
        type VARCHAR(20) NOT NULL,
        score REAL NOT NULL,
        comment TEXT,
        user_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_feedback_dossier_id ON feedback(dossier_id);
      CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
    `,
  },
  {
    id: '013_add_leads_score_breakdown',
    sql: `
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS score_breakdown JSONB DEFAULT '{}';
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_url TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
      
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    `,
  },
  {
    id: '014_add_dossier_consumed_at',
    sql: `
      ALTER TABLE dossiers ADD COLUMN IF NOT EXISTS consumed_at TIMESTAMP WITH TIME ZONE;
      CREATE INDEX IF NOT EXISTS idx_dossiers_consumed_at ON dossiers(consumed_at);
    `,
  },
];

/**
 * Check if a migration has been executed.
 */
async function isMigrationExecuted(migrationId: string): Promise<boolean> {
  try {
    const result = await query<{ id: string }>(
      'SELECT id FROM migrations WHERE id = $1',
      [migrationId]
    );
    return result.rows.length > 0;
  } catch {
    // Table doesn't exist yet
    return false;
  }
}

/**
 * Mark a migration as executed.
 */
async function markMigrationExecuted(migrationId: string): Promise<void> {
  await query('INSERT INTO migrations (id) VALUES ($1)', [migrationId]);
}

/**
 * Run all pending migrations.
 */
export async function runMigrations(): Promise<void> {
  logger.info('Running database migrations...');

  for (const migration of migrations) {
    const executed = await isMigrationExecuted(migration.id);

    if (executed) {
      logger.debug('Migration already executed', { migrationId: migration.id });
      continue;
    }

    logger.info('Executing migration', { migrationId: migration.id });

    try {
      await query(migration.sql);
      await markMigrationExecuted(migration.id);
      logger.info('Migration completed', { migrationId: migration.id });
    } catch (error) {
      logger.error('Migration failed', {
        migrationId: migration.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  logger.info('All migrations completed');
}

// Run migrations if this file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  import('./postgres.js').then(({ initPostgres }) => {
    initPostgres();
    runMigrations()
      .then(() => {
        logger.info('Migration script completed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Migration script failed', { error });
        process.exit(1);
      });
  });
}
