/**
 * Leads Database Module
 * 
 * Functions for querying and managing leads
 */

import { query } from './postgres.js';
import { logger } from '../lib/logger.js';

/**
 * Lead from database
 */
export interface Lead {
  id: string;
  documentId: string;
  status: 'approved' | 'review_needed' | 'rejected';
  score: number;
  scoreBreakdown: Record<string, number>;
  sourceUrl: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Get leads with optional filters
 */
export async function getLeads(options: {
  status?: 'approved' | 'review_needed' | 'rejected';
  limit?: number;
  minScore?: number;
  metadata?: Record<string, string | number | boolean>;
} = {}): Promise<Lead[]> {
  const { status, limit = 20, minScore, metadata } = options;
  
  let sql = `
    SELECT l.id, l.document_id, l.status, l.score, l.score_breakdown, 
           d.url as source_url, d.metadata, l.created_at
    FROM leads l
    JOIN documents d ON l.document_id = d.id
    WHERE 1=1
  `;
  
  const params: unknown[] = [];
  let paramIndex = 1;
  
  if (status) {
    sql += ` AND l.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }
  
  if (minScore !== undefined) {
    sql += ` AND l.score >= $${paramIndex}`;
    params.push(minScore);
    paramIndex++;
  }

  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      sql += ` AND l.metadata->>$${paramIndex} = $${paramIndex + 1}`;
      params.push(key, String(value));
      paramIndex += 2;
    }
  }
  
  sql += ` ORDER BY l.created_at DESC LIMIT $${paramIndex}`;
  params.push(limit);
  
  try {
    const result = await query<{
      id: string;
      document_id: string;
      status: 'approved' | 'review_needed' | 'rejected';
      score: number;
      score_breakdown: Record<string, number>;
      source_url: string;
      metadata: Record<string, unknown>;
      created_at: Date;
    }>(sql, params);
    
    return result.rows.map(row => ({
      id: row.id,
      documentId: row.document_id,
      status: row.status,
      score: row.score,
      scoreBreakdown: row.score_breakdown || {},
      sourceUrl: row.source_url,
      metadata: row.metadata || {},
      createdAt: row.created_at,
    }));
  } catch (error) {
    logger.error('Failed to get leads', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Get lead count by status
 */
export async function getLeadCounts(): Promise<{
  total: number;
  approved: number;
  review_needed: number;
  rejected: number;
}> {
  try {
    const result = await query<{
      status: string;
      count: string;
    }>(`
      SELECT status, COUNT(*) as count
      FROM leads
      GROUP BY status
    `);
    
    const counts = {
      total: 0,
      approved: 0,
      review_needed: 0,
      rejected: 0,
    };
    
    for (const row of result.rows) {
      const count = parseInt(row.count, 10);
      counts.total += count;
      if (row.status === 'approved') counts.approved = count;
      if (row.status === 'review_needed') counts.review_needed = count;
      if (row.status === 'rejected') counts.rejected = count;
    }
    
    return counts;
  } catch (error) {
    logger.error('Failed to get lead counts', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { total: 0, approved: 0, review_needed: 0, rejected: 0 };
  }
}

/**
 * Get hot leads (score >= 70)
 */
export async function getHotLeads(limit: number = 10): Promise<Lead[]> {
  return getLeads({ minScore: 70, limit });
}

/**
 * Get leads needing review
 */
export async function getLeadsForReview(limit: number = 20): Promise<Lead[]> {
  return getLeads({ status: 'review_needed', limit });
}
