#!/usr/bin/env npx tsx
/**
 * Regenerate Dossier Summaries
 * 
 * Updates all existing dossiers with the new clean human summary format.
 * 
 * Usage:
 *   npx tsx src/scripts/regenerate-summaries.ts
 */

import { query, initPostgres, closePostgres } from '../db/postgres.js';
import { generateContent, initGeminiClient } from '../ai/gemini-client.js';
import { logger } from '../lib/logger.js';

interface DossierRow {
  id: string;
  lead_id: string;
  structured_data: string;
  human_summary: string;
  generated_at: Date;
}

interface LeadRow {
  id: string;
  score: number;
  status: string;
  source_url: string;
}

/**
 * Generate a clean human summary
 */
async function generateCleanSummary(
  sourceUrl: string,
  score: number,
  status: string,
  sections: unknown[]
): Promise<string> {
  // Extract company/source name from URL
  let sourceName = 'Unknown Source';
  try {
    const urlObj = new URL(sourceUrl);
    sourceName = urlObj.hostname.replace('www.', '').split('.')[0];
    sourceName = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);
  } catch { /* keep default */ }

  // Determine lead quality label
  const scorePercent = Math.round(score * 100);
  const qualityLabel = scorePercent >= 70 ? 'High-quality' : 
                       scorePercent >= 50 ? 'Moderate' : 'Low-priority';
  
  // Get primary intent from sections
  let primaryIntent = 'business';
  const overviewSection = (sections as Array<{type?: string; content?: {primaryIntent?: string}}>)
    .find(s => s.type === 'overview');
  if (overviewSection?.content?.primaryIntent) {
    primaryIntent = overviewSection.content.primaryIntent;
  }

  try {
    const prompt = `
You are a business intelligence analyst. Generate a professional 2-3 sentence executive summary for a sales lead.

Source: ${sourceName}
Lead Score: ${scorePercent}% (${qualityLabel})
Primary Intent: ${primaryIntent}

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
      ? response.content.slice(0, 500)
      : null;
    
    if (summary && summary.length > 20) {
      return summary;
    }
    throw new Error('Empty or too short summary from LLM');
  } catch (error) {
    logger.warn('LLM failed, using structured fallback', {
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Clean fallback
    const statusAction = status === 'approved' 
      ? 'Ready for immediate sales follow-up.'
      : status === 'review_needed'
      ? 'Requires manual review before outreach.'
      : 'Monitor for future opportunities.';
    
    return `${qualityLabel} lead from ${sourceName} with ${scorePercent}% match score. Primary focus: ${primaryIntent}. ${statusAction}`;
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🔄 Regenerate Dossier Summaries');
  console.log('='.repeat(60));
  
  // Initialize database
  console.log('\n🔌 Initializing database...');
  initPostgres();
  console.log('   ✅ Database connected');
  
  // Initialize Gemini client
  console.log('\n📡 Initializing AI client...');
  try {
    initGeminiClient();
    console.log('   ✅ Gemini client ready');
  } catch (error) {
    console.log('   ⚠️  Gemini not available, will use fallback summaries');
  }

  // Get all dossiers
  console.log('\n📚 Fetching dossiers...');
  const dossiersResult = await query<DossierRow>(
    `SELECT d.id, d.lead_id, d.structured_data, d.human_summary, d.generated_at
     FROM dossiers d
     ORDER BY d.generated_at DESC`
  );

  const dossiers = dossiersResult.rows;
  console.log(`   Found ${dossiers.length} dossiers to update`);

  if (dossiers.length === 0) {
    console.log('\n✅ No dossiers to update!');
    await closePostgres();
    return;
  }

  // Process each dossier
  let updated = 0;
  let failed = 0;

  for (const dossier of dossiers) {
    try {
      // Get the lead info
      const leadResult = await query<LeadRow>(
        `SELECT id, score, status, source_url FROM leads WHERE id = $1`,
        [dossier.lead_id]
      );

      if (leadResult.rows.length === 0) {
        console.log(`   ⚠️  Lead not found for dossier ${dossier.id.slice(0, 8)}, skipping`);
        continue;
      }

      const lead = leadResult.rows[0]!;

      // Generate new summary directly from lead data (don't rely on sections)
      process.stdout.write(`   Processing ${dossier.id.slice(0, 8)}... `);
      
      const newSummary = await generateCleanSummary(
        lead.source_url,
        lead.score,
        lead.status,
        [] // Empty sections - we'll use lead data only
      );

      // Update in database
      await query(
        `UPDATE dossiers SET human_summary = $1 WHERE id = $2`,
        [newSummary, dossier.id]
      );

      console.log('✅');
      console.log(`      Old: ${dossier.human_summary?.slice(0, 60)}...`);
      console.log(`      New: ${newSummary.slice(0, 60)}...`);
      updated++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log('❌');
      console.error(`      Error: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 REGENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📚 Total: ${dossiers.length}`);
  console.log('='.repeat(60));

  await closePostgres();
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
