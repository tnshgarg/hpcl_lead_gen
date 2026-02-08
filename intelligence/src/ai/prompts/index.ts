import { query } from '../../db/postgres.js';
import { logger } from '../../lib/logger.js';
import { getTraceId } from '../../lib/tracing.js';
import { v4 as uuidv4 } from 'uuid';
import { z, ZodSchema } from 'zod';

/**
 * Prompt template structure.
 */
export interface PromptTemplate {
  id: string;
  version: string;
  name: string;
  template: string;
  inputSchema: ZodSchema;
  outputSchema: ZodSchema;
  isActive: boolean;
  createdAt: Date;
}

/**
 * In-memory prompt cache.
 */
const promptCache = new Map<string, PromptTemplate>();

/**
 * Prompt registry for quick lookup.
 */
const promptRegistry = new Map<string, PromptTemplate>();

/**
 * Create a new prompt template.
 */
export async function createPromptTemplate(
  name: string,
  template: string,
  inputSchema: ZodSchema,
  outputSchema: ZodSchema,
  version?: string
): Promise<PromptTemplate> {
  const id = uuidv4();
  const promptVersion = version || generateVersion();
  const traceId = getTraceId();

  logger.info('Creating prompt template', { name, version: promptVersion, traceId });

  // Validate template has placeholders
  if (!template.includes('{{') && !template.includes('${')) {
    logger.warn('Prompt template has no placeholders', { name, traceId });
  }

  const prompt: PromptTemplate = {
    id,
    version: promptVersion,
    name,
    template,
    inputSchema,
    outputSchema,
    isActive: true,
    createdAt: new Date(),
  };

  // Store in database
  try {
    await query(
      `INSERT INTO prompts (id, version, name, template, input_schema, output_schema, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        prompt.id,
        prompt.version,
        prompt.name,
        prompt.template,
        JSON.stringify(inputSchema),
        JSON.stringify(outputSchema),
        prompt.isActive,
        prompt.createdAt,
      ]
    );
  } catch (error) {
    // Handle duplicate or store in cache only
    logger.warn('Failed to store prompt in database, using cache only', {
      name,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
  }

  // Update cache and registry
  const cacheKey = `${name}:${promptVersion}`;
  promptCache.set(cacheKey, prompt);
  promptRegistry.set(name, prompt); // Latest version

  logger.info('Prompt template created', { id, name, version: promptVersion, traceId });

  return prompt;
}

/**
 * Get a prompt template by name (latest version).
 */
export async function getPromptTemplate(name: string): Promise<PromptTemplate | null> {
  const traceId = getTraceId();

  // Check registry first
  const cached = promptRegistry.get(name);
  if (cached) {
    return cached;
  }

  // Try database
  try {
    const result = await query<{
      id: string;
      version: string;
      name: string;
      template: string;
      input_schema: unknown;
      output_schema: unknown;
      is_active: boolean;
      created_at: Date;
    }>(
      `SELECT * FROM prompts 
       WHERE name = $1 AND is_active = true 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [name]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0]!;
    const prompt: PromptTemplate = {
      id: row.id,
      version: row.version,
      name: row.name,
      template: row.template,
      inputSchema: z.object({}) as ZodSchema, // Would need to reconstruct from JSON
      outputSchema: z.object({}) as ZodSchema,
      isActive: row.is_active,
      createdAt: row.created_at,
    };

    promptRegistry.set(name, prompt);
    return prompt;
  } catch (error) {
    logger.warn('Failed to fetch prompt from database', {
      name,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    return null;
  }
}

/**
 * Get a specific version of a prompt template.
 */
export async function getPromptTemplateVersion(
  name: string,
  version: string
): Promise<PromptTemplate | null> {
  const cacheKey = `${name}:${version}`;

  // Check cache
  const cached = promptCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Try database
  try {
    const result = await query<{
      id: string;
      version: string;
      name: string;
      template: string;
      is_active: boolean;
      created_at: Date;
    }>(
      `SELECT * FROM prompts WHERE name = $1 AND version = $2`,
      [name, version]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0]!;
    const prompt: PromptTemplate = {
      id: row.id,
      version: row.version,
      name: row.name,
      template: row.template,
      inputSchema: z.object({}) as ZodSchema,
      outputSchema: z.object({}) as ZodSchema,
      isActive: row.is_active,
      createdAt: row.created_at,
    };

    promptCache.set(cacheKey, prompt);
    return prompt;
  } catch (error) {
    logger.warn('Failed to fetch prompt version from database', { name, version });
    return null;
  }
}

/**
 * Render a prompt template with variables.
 */
export function renderPrompt(
  template: string,
  variables: Record<string, string | number | boolean>
): string {
  let rendered = template;

  // Handle {{variable}} syntax
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    rendered = rendered.replace(regex, String(value));
  }

  // Handle ${variable} syntax
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g');
    rendered = rendered.replace(regex, String(value));
  }

  return rendered;
}

/**
 * Use a prompt template by name.
 */
export async function usePrompt(
  name: string,
  variables: Record<string, string | number | boolean>
): Promise<{ prompt: string; version: string }> {
  const template = await getPromptTemplate(name);

  if (!template) {
    throw new Error(`Prompt template not found: ${name}`);
  }

  const rendered = renderPrompt(template.template, variables);

  return {
    prompt: rendered,
    version: template.version,
  };
}

/**
 * Deactivate a prompt template.
 */
export async function deactivatePrompt(name: string, version?: string): Promise<void> {
  const traceId = getTraceId();

  if (version) {
    await query(
      `UPDATE prompts SET is_active = false WHERE name = $1 AND version = $2`,
      [name, version]
    );
    promptCache.delete(`${name}:${version}`);
  } else {
    await query(
      `UPDATE prompts SET is_active = false WHERE name = $1`,
      [name]
    );
  }

  promptRegistry.delete(name);
  logger.info('Prompt template deactivated', { name, version, traceId });
}

/**
 * List all prompt templates.
 */
export async function listPromptTemplates(): Promise<Array<{
  name: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
}>> {
  const result = await query<{
    name: string;
    version: string;
    is_active: boolean;
    created_at: Date;
  }>(
    `SELECT name, version, is_active, created_at FROM prompts ORDER BY name, created_at DESC`
  );

  return result.rows.map((row) => ({
    name: row.name,
    version: row.version,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
}

/**
 * Generate version string (timestamp-based).
 */
function generateVersion(): string {
  const now = new Date();
  return `v${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.${Date.now() % 10000}`;
}

// ============================================
// Built-in Prompt Templates
// ============================================

/**
 * Register default prompt templates.
 */
export async function registerDefaultPrompts(): Promise<void> {
  const traceId = getTraceId();
  logger.info('Registering default prompt templates', { traceId });

  // Intent Analysis Prompt
  await createPromptTemplate(
    'intent-analysis',
    `Analyze the following document and extract intent information.

Document:
"""
{{document}}
"""

{{#if context}}
Additional Context: {{context}}
{{/if}}

Respond with JSON containing:
- primaryIntent: The main purpose or topic
- secondaryIntents: Array of secondary topics
- confidence: 0.0-1.0 confidence score
- entities: Array of {name, type, value}
- sentiment: positive, negative, or neutral
- summary: 1-2 sentence summary`,
    z.object({
      document: z.string(),
      context: z.string().optional(),
    }),
    z.object({
      primaryIntent: z.string(),
      secondaryIntents: z.array(z.string()),
      confidence: z.number(),
      entities: z.array(z.object({
        name: z.string(),
        type: z.string(),
        value: z.string(),
      })),
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      summary: z.string(),
    }),
    'v1.0.0'
  );

  // Relevance Scoring Prompt
  await createPromptTemplate(
    'relevance-scoring',
    `Evaluate this document's relevance to the given criteria.

Criteria:
{{criteria}}

Document:
"""
{{document}}
"""

Respond with JSON:
- isRelevant: boolean
- score: 0.0-1.0
- matchedCriteria: Array of matched criteria
- reasoning: Brief explanation`,
    z.object({
      document: z.string(),
      criteria: z.string(),
    }),
    z.object({
      isRelevant: z.boolean(),
      score: z.number(),
      matchedCriteria: z.array(z.string()),
      reasoning: z.string(),
    }),
    'v1.0.0'
  );

  // Summarization Prompt
  await createPromptTemplate(
    'summarization',
    `Summarize the following document in {{length}} format.

Document:
"""
{{document}}
"""

Requirements:
- Be concise and accurate
- Preserve key information
- Use clear language`,
    z.object({
      document: z.string(),
      length: z.enum(['brief', 'detailed', 'bullet-points']),
    }),
    z.object({
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
    'v1.0.0'
  );

  logger.info('Default prompt templates registered', { traceId });
}
