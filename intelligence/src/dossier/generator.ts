import { generateContent } from '../ai/gemini-client.js';
import { scoreLead } from '../scoring/decision-layer.js';
import { searchSimilarDocumentsWithData } from '../embeddings/vector-store.js';
import { logger, logArtifact } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import { query } from '../db/postgres.js';
import { v4 as uuidv4 } from 'uuid';
import type { HPCLAnalysisResult } from '../ai/hpcl-analyzer.js';
import type { 
  Dossier, 
  DossierSection, 
  ScoredLead, 
  IntentResult,
  ScoringInputs
} from '../types/index.js';

/**
 * Dossier generation configuration.
 */
export interface DossierConfig {
  includeRelatedDocuments: boolean;
  maxRelatedDocuments: number;
  generateSummary: boolean;
  includeScoringBreakdown: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Default dossier configuration.
 */
const DEFAULT_CONFIG: DossierConfig = {
  includeRelatedDocuments: true,
  maxRelatedDocuments: 5,
  generateSummary: true,
  includeScoringBreakdown: true,
};

/**
 * Generate action recommendations based on lead score and intent.
 */
function generateRecommendations(
  lead: ScoredLead,
  intent: IntentResult
): string[] {
  const recommendations: string[] = [];

  // Based on status
  if (lead.status === 'approved') {
    recommendations.push('PROCEED: Lead meets quality thresholds');
    recommendations.push('PRIORITY: Route to sales team for follow-up');
  } else if (lead.status === 'review_needed') {
    recommendations.push('REVIEW: Manual verification required');
    recommendations.push('ESCALATE: Flag for human review within 24 hours');
  } else {
    recommendations.push('ARCHIVE: Lead does not meet quality criteria');
    recommendations.push('MONITOR: Add source to watchlist');
  }

  // Based on reason codes
  if (lead.reasonCodes.includes('UNTRUSTED_SOURCE')) {
    recommendations.push('VERIFY: Cross-reference with trusted sources');
  }
  if (lead.reasonCodes.includes('STALE_CONTENT')) {
    recommendations.push('UPDATE: Check for more recent information');
  }
  if (lead.reasonCodes.includes('LOW_SIGNAL_DENSITY')) {
    recommendations.push('ENRICH: Gather additional data points');
  }
  if (lead.reasonCodes.includes('HIGH_SIMILARITY_TO_KNOWN')) {
    recommendations.push('MERGE: Consider deduplication with existing records');
  }

  // Based on intent
  if (intent.intents[0]?.name) {
    const primaryIntent = intent.intents[0].name.toLowerCase();
    
    if (primaryIntent.includes('urgent') || primaryIntent.includes('priority')) {
      recommendations.push('EXPEDITE: High priority content detected');
    }
    if (primaryIntent.includes('opportunity') || primaryIntent.includes('lead')) {
      recommendations.push('ACTION: Potential business opportunity identified');
    }
  }

  // Based on sentiment
  if (intent.sentiment && intent.sentiment.negative > 0.6) {
    recommendations.push('CAUTION: Negative sentiment detected');
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

/**
 * Generate HPCL-specific recommendations.
 */
function generateHPCLRecommendations(
  hpclAnalysis: HPCLAnalysisResult
): string[] {
  const recommendations: string[] = [];
  
  // Lead quality-based actions
  if (hpclAnalysis.leadQuality === 'hot') {
    recommendations.push(`🔥 HOT LEAD (Score: ${hpclAnalysis.leadScore}): Immediate sales contact recommended`);
  } else if (hpclAnalysis.leadQuality === 'warm') {
    recommendations.push(`🌡️ WARM LEAD (Score: ${hpclAnalysis.leadScore}): Add to nurture pipeline`);
  } else {
    recommendations.push(`❄️ COLD LEAD (Score: ${hpclAnalysis.leadScore}): Monitor for future signals`);
  }
  
  // Product recommendations
  if (hpclAnalysis.recommendedProducts.length > 0) {
    const topProducts = hpclAnalysis.recommendedProducts.slice(0, 3);
    for (const prod of topProducts) {
      recommendations.push(`PRODUCT: ${prod.productName} - ${prod.reason}`);
    }
  }
  
  // Action recommendation from analysis
  if (hpclAnalysis.actionRecommendation) {
    recommendations.push(`ACTION: ${hpclAnalysis.actionRecommendation}`);
  }
  
  // Industry-specific
  if (hpclAnalysis.detectedIndustries.length > 0) {
    recommendations.push(`INDUSTRY: Target ${hpclAnalysis.detectedIndustries.join(', ')} segment`);
  }
  
  return recommendations;
}

/**
 * Generate human-readable summary using LLM.
 */
async function generateHumanSummary(
  document: { text: string; url: string },
  intent: IntentResult,
  lead: ScoredLead
): Promise<string> {
  const traceId = getTraceId();

  // Extract company/source name from URL
  let sourceName = 'Unknown Source';
  try {
    const urlObj = new URL(document.url);
    sourceName = urlObj.hostname.replace('www.', '').split('.')[0];
    sourceName = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);
  } catch { /* keep default */ }

  // Determine lead quality label
  const scorePercent = Math.round(lead.score * 100);
  const qualityLabel = scorePercent >= 70 ? 'High-quality' : 
                       scorePercent >= 50 ? 'Moderate' : 'Low-priority';
  
  // Get primary intent
  const primaryIntent = intent.intents[0]?.name || 'business';
  
  // Get key entities (first 3)
  const keyEntities = intent.entities
    .filter(e => e.text && e.text.length > 2 && e.text.length < 50)
    .slice(0, 3)
    .map(e => e.text);

  try {
    // Clean document text - remove URLs, stock tickers, and garbage
    const cleanText = document.text
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/[A-Z]+\s*\d+[\d,.]*\s*[-+]?\d*\.?\d*/g, '') // Remove stock data
      .replace(/\{[\s\S]*?\}/g, '') // Remove JSON blocks
      .replace(/\n+/g, ' ') // Remove newlines
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim()
      .slice(0, 1500);

    const prompt = `
You are a business intelligence analyst. Generate a professional 2-3 sentence executive summary for a sales lead.

Source: ${sourceName}
Lead Score: ${scorePercent}% (${qualityLabel})
Primary Intent: ${primaryIntent}
Key Entities: ${keyEntities.length > 0 ? keyEntities.join(', ') : 'Not identified'}

Content excerpt:
"""
${cleanText || 'No content available'}
"""

Write a clear, actionable summary that:
1. Identifies the company or opportunity (use "${sourceName}" if no company found)
2. Explains why this is a ${qualityLabel.toLowerCase()} lead
3. Suggests next steps

Keep it concise and professional. Do NOT include raw URLs, stock data, or technical details.
`;

    const response = await generateContent<{ summary: string }>(prompt, {
      jsonMode: false,
    });

    const summary = typeof response.content === 'string' 
      ? response.content.slice(0, 500) // Limit length
      : null;
    
    if (summary && summary.length > 20) {
      return summary;
    }
    throw new Error('Empty or too short summary from LLM');
  } catch (error) {
    logger.warn('Failed to generate human summary via LLM, using structured fallback', {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    
    // Clean fallback - DO NOT include raw content
    const statusAction = lead.status === 'approved' 
      ? 'Ready for immediate sales follow-up.'
      : lead.status === 'review_needed'
      ? 'Requires manual review before outreach.'
      : 'Monitor for future opportunities.';
    
    const entityMention = keyEntities.length > 0 
      ? ` Key signals: ${keyEntities.slice(0, 2).join(', ')}.`
      : '';
    
    return `${qualityLabel} lead from ${sourceName} with ${scorePercent}% match score. Primary focus: ${primaryIntent}.${entityMention} ${statusAction}`;
  }
}

/**
 * Build dossier sections.
 */
function buildSections(
  document: { id: string; text: string; url: string; metadata?: Record<string, unknown> },
  intent: IntentResult,
  lead: ScoredLead,
  relatedDocs: Array<{ documentId: string; score: number }>,
  config: DossierConfig
): DossierSection[] {
  const sections: DossierSection[] = [];

  // Overview section
  sections.push({
    title: 'Overview',
    content: {
      documentId: document.id,
      sourceUrl: document.url,
      primaryIntent: intent.intents[0]?.name || 'Unknown',
      confidence: intent.confidence,
      fetchedAt: document.metadata?.['fetchedAt'] || new Date(),
    },
  });

  // Intent Analysis section
  sections.push({
    title: 'Intent Analysis',
    content: {
      intents: intent.intents,
      entities: intent.entities,
      sentiment: intent.sentiment,
      summary: intent.summary,
    },
  });

  // Scoring section
  if (config.includeScoringBreakdown) {
    sections.push({
      title: 'Scoring Breakdown',
      content: {
        finalScore: lead.score,
        status: lead.status,
        weights: lead.weights,
        reasonCodes: lead.reasonCodes,
      },
    });
  }

  // Related Documents section
  if (config.includeRelatedDocuments && relatedDocs.length > 0) {
    sections.push({
      title: 'Related Documents',
      content: {
        count: relatedDocs.length,
        documents: relatedDocs.map((d) => ({
          id: d.documentId,
          similarity: d.score,
        })),
      },
    });
  }

  return sections;
}

/**
 * Generate a complete dossier for a document.
 */
export async function generateDossier(
  documentId: string,
  documentText: string,
  documentUrl: string,
  intent: IntentResult,
  scoringInputs: ScoringInputs,
  hpclAnalysis?: HPCLAnalysisResult,
  config: Partial<DossierConfig> = {}
): Promise<Dossier> {
  const opts = { ...DEFAULT_CONFIG, ...config };
  const traceId = getTraceId();
  const startTime = Date.now();
  const dossierId = uuidv4();

  logger.info('Generating dossier', { dossierId, documentId, traceId });

  // Score the lead
  const lead = await scoreLead(documentId, scoringInputs, {
    ...(opts.metadata ? { metadata: opts.metadata } : {}),
  });

  // Find related documents
  let relatedDocs: Array<{ documentId: string; score: number }> = [];
  if (opts.includeRelatedDocuments) {
    try {
      const similar = await searchSimilarDocumentsWithData(
        documentText,
        opts.maxRelatedDocuments
      );
      relatedDocs = similar
        .filter((d) => d.documentId !== documentId)
        .map((d) => ({ documentId: d.documentId, score: d.score }));
    } catch (error) {
      logger.warn('Failed to fetch related documents', {
        documentId,
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
    }
  }

  // Build sections
  const sections = buildSections(
    { id: documentId, text: documentText, url: documentUrl },
    intent,
    lead,
    relatedDocs,
    opts
  );

  // Generate human summary
  let humanSummary = '';
  if (opts.generateSummary) {
    humanSummary = await generateHumanSummary(
      { text: documentText, url: documentUrl },
      intent,
      lead
    );
  }

  // Generate recommendations - prefer HPCL if available
  let recommendations: string[];
  if (hpclAnalysis && hpclAnalysis.leadScore > 0) {
    recommendations = generateHPCLRecommendations(hpclAnalysis);
  } else {
    recommendations = generateRecommendations(lead, intent);
  }

  // Extract company name - prefer HPCL analysis, fallback to URL
  let companyName: string | null = null;
  if (hpclAnalysis?.companyName) {
    companyName = hpclAnalysis.companyName;
  } else {
    try {
      const urlObj = new URL(documentUrl);
      const hostname = urlObj.hostname.replace('www.', '').split('.')[0];
      if (hostname && hostname.length > 0) {
        companyName = hostname.charAt(0).toUpperCase() + hostname.slice(1);
      }
    } catch { /* keep null */ }
  }

  const dossier: Dossier = {
    id: dossierId,
    leadId: lead.id,
    documentId,
    company: companyName,
    sections,
    humanSummary,
    recommendations,
    createdAt: new Date(),
    version: '1.0',
  };

  // Store in database
  try {
    await query(
      `INSERT INTO dossiers (id, lead_id, structured_data, human_summary, suggested_actions, generated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dossier.id,
        dossier.leadId,
        JSON.stringify(dossier.sections),
        dossier.humanSummary,
        JSON.stringify(dossier.recommendations),
        dossier.createdAt,
      ]
    );
  } catch (error) {
    logger.warn('Failed to store dossier in database', {
      dossierId,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
  }

  const durationMs = Date.now() - startTime;

  // Log artifact
  logArtifact('dossier', dossierId, documentId.slice(0, 16), dossierId.slice(0, 16), {
    leadScore: lead.score,
    status: lead.status,
    sectionCount: sections.length,
    recommendationCount: recommendations.length,
    durationMs,
  });

  logger.info('Dossier generated', {
    dossierId,
    documentId,
    leadScore: lead.score,
    status: lead.status,
    durationMs,
    traceId,
  });

  return dossier;
}

/**
 * Get dossier by ID.
 */
export async function getDossier(dossierId: string): Promise<Dossier | null> {
  const result = await query<{
    id: string;
    lead_id: string;
    document_id: string;
    structured_data: DossierSection[];
    human_summary: string;
    suggested_actions: string[];
    generated_at: Date;
    consumed_at?: Date;
  }>(
    `SELECT d.*, l.document_id 
     FROM dossiers d
     JOIN leads l ON d.lead_id = l.id
     WHERE d.id = $1`,
    [dossierId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0]!;
  return {
    id: row.id,
    leadId: row.lead_id,
    documentId: row.document_id,
    sections: row.structured_data,
    humanSummary: row.human_summary,
    recommendations: row.suggested_actions,
    createdAt: row.generated_at,
    ...(row.consumed_at ? { consumedAt: row.consumed_at } : {}),
    version: '1.0',
  };
}

/**
 * Get dossiers by lead status.
 */
export async function getDossiersByStatus(
  status: 'approved' | 'review_needed' | 'rejected',
  limit: number = 20,
  consumed?: boolean
): Promise<Dossier[]> {
  let querySql = `
    SELECT d.id as d_id, d.lead_id, l.document_id, d.structured_data as sections, d.human_summary, 
           d.suggested_actions as recommendations, d.generated_at as d_created_at, d.consumed_at
    FROM dossiers d
    JOIN leads l ON d.lead_id = l.id
    WHERE l.status = $1
  `;
  
  const params: any[] = [status];
  
  if (consumed !== undefined) {
    querySql += ` AND d.consumed_at IS ${consumed ? 'NOT NULL' : 'NULL'}`;
  }
  
  querySql += ` ORDER BY d.generated_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await query<{
    d_id: string;
    lead_id: string;
    document_id: string;
    sections: DossierSection[];
    human_summary: string;
    recommendations: string[];
    d_created_at: Date;
    consumed_at?: Date;
  }>(querySql, params);

  return result.rows.map((row) => ({
    id: row.d_id,
    leadId: row.lead_id,
    documentId: row.document_id,
    sections: row.sections,
    humanSummary: row.human_summary,
    recommendations: row.recommendations,

    createdAt: row.d_created_at,
    ...(row.consumed_at ? { consumedAt: row.consumed_at } : {}),
    version: '1.0',
  }));
}

/**
 * Get dossier by lead ID.
 */
export async function getDossierByLeadId(leadId: string): Promise<Dossier | null> {
  const result = await query<{
    d_id: string;
    lead_id: string;
    document_id: string;
    sections: DossierSection[];
    human_summary: string;
    recommendations: string[];
    d_created_at: Date;
  }>(
    `SELECT d.id as d_id, d.lead_id, l.document_id, d.structured_data as sections, d.human_summary, 
            d.suggested_actions as recommendations, d.generated_at as d_created_at
     FROM dossiers d
     JOIN leads l ON d.lead_id = l.id
     WHERE d.lead_id = $1`,
    [leadId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0]!;
  return {
    id: row.d_id,
    leadId: row.lead_id,
    documentId: row.document_id,
    sections: row.sections,
    humanSummary: row.human_summary,
    recommendations: row.recommendations,
    createdAt: row.d_created_at,
    version: '1.0',
  };
}

/**
 * Export dossier as JSON.
 */
export function exportDossierAsJSON(dossier: Dossier): string {
  return JSON.stringify(dossier, null, 2);
}

/**
 * Export dossier as markdown.
 */
export function exportDossierAsMarkdown(dossier: Dossier): string {
  const lines: string[] = [];

  lines.push(`# Dossier: ${dossier.id}`);
  lines.push('');
  lines.push(`**Document ID:** ${dossier.documentId}`);
  lines.push(`**Lead ID:** ${dossier.leadId}`);
  lines.push(`**Generated:** ${dossier.createdAt.toISOString()}`);
  lines.push('');

  // Human Summary
  if (dossier.humanSummary) {
    lines.push('## Summary');
    lines.push('');
    lines.push(dossier.humanSummary);
    lines.push('');
  }

  // Sections
  for (const section of dossier.sections) {
    lines.push(`## ${section.title}`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(section.content, null, 2));
    lines.push('```');
    lines.push('');
  }

  // Recommendations
  if (dossier.recommendations.length > 0) {
    lines.push('## Recommendations');
    lines.push('');
    for (const rec of dossier.recommendations) {
      lines.push(`- ${rec}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Mark a dossier as consumed.
 */
export async function markDossierAsConsumed(dossierId: string): Promise<Dossier | null> {
  const result = await query<{ id: string }>(
    `UPDATE dossiers SET consumed_at = NOW() WHERE id = $1 RETURNING id`,
    [dossierId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return getDossier(dossierId);
}
