import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';
import { logger, logArtifact } from '../lib/logger.js';
import { withRetry, isNetworkError, isRateLimitError } from '../lib/retry.js';
import { getTraceId } from '../lib/tracing.js';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { LLMResponse } from '../types/index.js';

/**
 * Gemini client configuration.
 */
export interface GeminiConfig {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
  timeoutMs: number;
}

/**
 * Default Gemini configuration.
 * Temperature near zero for stability as per implementation plan.
 */
const DEFAULT_CONFIG: GeminiConfig = {
  model: 'gemini-2.0-flash-lite',
  temperature: 0.1, // Near zero for deterministic outputs
  maxOutputTokens: 4096,
  topP: 0.95,
  topK: 40,
  timeoutMs: 60000,
};

/**
 * Singleton Gemini client instance.
 */
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let currentConfig: GeminiConfig | null = null;

/**
 * Initialize the Gemini client.
 */
export function initGeminiClient(config: Partial<GeminiConfig> = {}): GenerativeModel {
  const opts = { ...DEFAULT_CONFIG, ...config };

  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  if (model && currentConfig && 
      currentConfig.model === opts.model &&
      currentConfig.temperature === opts.temperature) {
    return model;
  }

  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  
  model = genAI.getGenerativeModel({
    model: opts.model,
    generationConfig: {
      temperature: opts.temperature,
      maxOutputTokens: opts.maxOutputTokens,
      topP: opts.topP,
      topK: opts.topK,
    } as GenerationConfig,
  });

  currentConfig = opts;

  logger.info('Gemini client initialized', {
    model: opts.model,
    temperature: opts.temperature,
  });

  return model;
}

/**
 * Get the current Gemini model instance.
 */
export function getGeminiModel(): GenerativeModel {
  if (!model) {
    return initGeminiClient();
  }
  return model;
}

/**
 * Generate content with Gemini.
 */
export async function generateContent<T = unknown>(
  prompt: string,
  options: {
    systemInstruction?: string;
    jsonMode?: boolean;
    config?: Partial<GeminiConfig>;
  } = {}
): Promise<LLMResponse<T>> {
  const traceId = getTraceId();
  const startTime = Date.now();
  const requestId = uuidv4();

  logger.debug('Generating content with Gemini', {
    promptLength: prompt.length,
    jsonMode: options.jsonMode,
    requestId,
    traceId,
  });

  const geminiModel = options.config 
    ? initGeminiClient(options.config)
    : getGeminiModel();

  try {
    const result = await withRetry(
      async () => {
        const fullPrompt = options.systemInstruction
          ? `${options.systemInstruction}\n\n${prompt}`
          : prompt;

        const response = await geminiModel.generateContent(fullPrompt);
        return response;
      },
      {
        maxAttempts: 3,
        baseDelayMs: 2000,
        isRetryable: (error) => isNetworkError(error) || isRateLimitError(error),
      }
    );

    const text = result.response.text();
    const durationMs = Date.now() - startTime;

    // Parse JSON if in JSON mode
    let content: T;
    let parseSuccess = true;

    if (options.jsonMode) {
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || 
                          text.match(/\{[\s\S]*\}/) ||
                          text.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch?.[1] || jsonMatch?.[0] || text;
        content = JSON.parse(jsonStr) as T;
      } catch (parseError) {
        logger.warn('Failed to parse JSON response, returning raw text', {
          requestId,
          error: parseError instanceof Error ? parseError.message : String(parseError),
          traceId,
        });
        content = text as unknown as T;
        parseSuccess = false;
      }
    } else {
      content = text as unknown as T;
    }

    // Log artifact
    const inputHash = crypto.createHash('sha256').update(prompt).digest('hex').slice(0, 16);
    const outputHash = crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);

    logArtifact('llm-response', requestId, inputHash, outputHash, {
      model: currentConfig?.model,
      promptLength: prompt.length,
      responseLength: text.length,
      durationMs,
      jsonMode: options.jsonMode,
      parseSuccess,
    });

    logger.debug('Content generated successfully', {
      requestId,
      responseLength: text.length,
      durationMs,
      traceId,
    });

    return {
      content,
      confidence: parseSuccess ? 0.9 : 0.5, // Lower confidence if parse failed
      modelVersion: currentConfig?.model || DEFAULT_CONFIG.model,
      promptVersion: 'inline', // Will be updated when using versioned prompts
      tokensUsed: undefined, // Gemini doesn't expose this directly
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;

    logger.error('Failed to generate content', {
      requestId,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });

    throw error;
  }
}

/**
 * Generate structured JSON output with schema validation.
 */
export async function generateStructuredOutput<T>(
  prompt: string,
  schema: {
    description: string;
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  },
  options: {
    systemInstruction?: string;
    config?: Partial<GeminiConfig>;
  } = {}
): Promise<LLMResponse<T>> {
  const schemaPrompt = `
You must respond with valid JSON that matches this schema:
${JSON.stringify(schema, null, 2)}

Important:
- Respond ONLY with the JSON object, no markdown, no explanation
- All required fields must be present
- Follow the exact property names and types

${prompt}
`;

  return generateContent<T>(schemaPrompt, {
    ...options,
    jsonMode: true,
  });
}

/**
 * Analyze text intent.
 */
export async function analyzeIntent(
  text: string,
  context?: string
): Promise<LLMResponse<{
  primaryIntent: string;
  confidence: number;
  entities: Array<{ name: string; type: string; value: string }>;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
}>> {
  const prompt = `
Analyze the following text and extract:
1. Primary intent/purpose
2. Key entities (people, organizations, locations, products, dates)
3. Overall sentiment
4. A brief summary

${context ? `Context: ${context}\n` : ''}

Text to analyze:
"""
${text}
"""

Respond with JSON in this exact format:
{
  "primaryIntent": "string describing the main purpose",
  "confidence": 0.0-1.0,
  "entities": [{"name": "entity name", "type": "person|organization|location|product|date|other", "value": "extracted value"}],
  "sentiment": "positive|negative|neutral",
  "summary": "1-2 sentence summary"
}
`;

  return generateContent(prompt, {
    jsonMode: true,
    systemInstruction: 'You are an expert text analyst. Extract structured information accurately.',
  });
}

/**
 * Classify document relevance.
 */
export async function classifyRelevance(
  documentText: string,
  criteria: string[]
): Promise<LLMResponse<{
  isRelevant: boolean;
  matchedCriteria: string[];
  relevanceScore: number;
  reasoning: string;
}>> {
  const criteriaList = criteria.map((c, i) => `${i + 1}. ${c}`).join('\n');

  const prompt = `
Determine if this document is relevant based on the following criteria:

${criteriaList}

Document:
"""
${documentText.slice(0, 3000)}
"""

Respond with JSON:
{
  "isRelevant": true/false,
  "matchedCriteria": ["list of matched criteria"],
  "relevanceScore": 0.0-1.0,
  "reasoning": "brief explanation"
}
`;

  return generateContent(prompt, {
    jsonMode: true,
    systemInstruction: 'You are a document classifier. Be precise and consistent.',
  });
}

/**
 * Extract key information from document.
 */
export async function extractKeyInfo(
  documentText: string,
  fields: Array<{ name: string; description: string; type: string }>
): Promise<LLMResponse<Record<string, unknown>>> {
  const fieldDefs = fields
    .map((f) => `- ${f.name} (${f.type}): ${f.description}`)
    .join('\n');

  const prompt = `
Extract the following information from the document:

${fieldDefs}

Document:
"""
${documentText.slice(0, 4000)}
"""

Respond with a JSON object where keys are the field names and values are the extracted information.
If a field cannot be found, use null.
`;

  return generateContent(prompt, {
    jsonMode: true,
    systemInstruction: 'You are a precise information extractor. Only extract information that is explicitly stated.',
  });
}
