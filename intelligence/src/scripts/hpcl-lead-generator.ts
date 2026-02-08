#!/usr/bin/env npx tsx
/**
 * HPCL Lead Generator - Main Entry Point
 * 
 * Scrapes all configured HPCL data sources, processes content
 * through the pipeline, and generates lead dossiers.
 * 
 * Usage:
 *   npx tsx src/scripts/hpcl-lead-generator.ts [options]
 * 
 * Options:
 *   --quick       Only scrape RSS sources (faster)
 *   --tenders     Only scrape tender sources
 *   --news        Only scrape news sources
 *   --wait        Wait for pipeline completion (default: 60s)
 */

import {
  scrapeAllSources,
  scrapeTenderSources,
  scrapeNewsSources,
  quickScrapeRSS,
  getScrapingSummary,
  type HPCLScrapingSession,
} from '../crawler/hpcl-scraper.js';
import { HPCL_DATA_SOURCES, HPCL_PRODUCTS } from '../crawler/hpcl-sources.js';
import { getDossierByLeadId } from '../dossier/generator.js';
import { getLeads, type Lead } from '../db/leads.js';
import { initPostgres } from '../db/postgres.js';
import { initGeminiClient } from '../ai/gemini-client.js';
import * as fs from 'fs';
import * as path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const isQuick = args.includes('--quick');
const isTenders = args.includes('--tenders');
const isNews = args.includes('--news');
const waitTimeArg = args.find(a => a.startsWith('--wait='));
const waitTime = waitTimeArg ? parseInt(waitTimeArg.split('=')[1]!) * 1000 : 60000;

/**
 * Wait for pipeline to process jobs
 */
async function waitForPipeline(waitMs: number): Promise<void> {
  console.log(`\n⏳ Waiting ${waitMs / 1000}s for pipeline to process...`);
  
  const checkInterval = 5000;
  const maxChecks = Math.ceil(waitMs / checkInterval);
  
  for (let i = 0; i < maxChecks; i++) {
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    process.stdout.write('.');
  }
  
  console.log(' Done!\n');
}

/**
  if (lowerUrl.includes('eprocure.gov.in') ||
      lowerUrl.includes('gem.gov.in') ||
      lowerUrl.includes('nhai.gov.in')) {
    return true;
  }
  
  // Accept IndiaMART
  if (lowerUrl.includes('indiamart.com')) {
    return true;
  }
  
  // For ET/Livemint, only if URL contains HPCL-relevant terms
  if (lowerUrl.includes('economictimes') || lowerUrl.includes('livemint')) {
    const hpclPathKeywords = [
      'cement', 'steel', 'metals', 'oil-gas', 'petroleum', 'energy',
      'infrastructure', 'road', 'highway', 'ports', 'shipping',
      'power', 'mining', 'chemicals', 'fertilizer', 'edible-oil',
      'manufacturing', 'auto-components', 'railways',
    ];
    
    for (const keyword of hpclPathKeywords) {
      if (lowerUrl.includes(keyword)) {
        return true;
      }
    }
    
    // Reject other ET/Livemint URLs
    return false;
  }
  
  return false;
}

/**
 * Export leads to JSON file - with HPCL filtering
 */
async function exportLeads(session: HPCLScrapingSession): Promise<string> {
  // Get leads for this session
  const leads = await getLeads({ 
    limit: 100, 
    metadata: { hpclSessionId: session.sessionId } 
  });
  
  // Get dossiers for these leads
  const dossiers = [];
  for (const lead of leads) {
    const dossier = await getDossierByLeadId(lead.id);
    if (dossier) {
      dossiers.push(dossier);
    }
  }
  
  const output = {
    generatedAt: new Date().toISOString(),
    session: {
      id: session.sessionId,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt.toISOString(),
      sourcesScraped: session.successfulSources,
      itemsSubmitted: session.totalItemsSubmitted,
    },
    sources: HPCL_DATA_SOURCES.filter(s => s.enabled).map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      relevantProducts: s.relevantProducts.map(p => HPCL_PRODUCTS[p]),
    })),
    leads: leads.map((lead: Lead) => ({
      id: lead.id,
      status: lead.status,
      score: lead.score,
      company: lead.metadata?.company || null,
      sourceUrl: lead.sourceUrl,
      createdAt: lead.createdAt,
    })),
    dossiers: dossiers.map(d => ({
      id: d.id,
      summary: d.humanSummary?.slice(0, 300),
      recommendations: d.recommendations?.slice(0, 3),
      createdAt: d.createdAt,
    })),
    summary: {
      totalLeads: leads.length,
      totalDossiers: dossiers.length,
      filteredOut: 0,
      hotLeads: leads.filter((l: Lead) => l.score >= 70).length,
      warmLeads: leads.filter((l: Lead) => l.score >= 40 && l.score < 70).length,
      coldLeads: leads.filter((l: Lead) => l.score < 40).length,
    },
  };
  
  const outputPath = path.join(process.cwd(), 'hpcl-leads-output.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  return outputPath;
}

/**
 * Print final summary
 */
function printSummary(session: HPCLScrapingSession, outputPath: string): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 HPCL LEAD GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(getScrapingSummary(session));
  console.log('\n📁 Output saved to:', outputPath);
  console.log('='.repeat(60));
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🚀 HPCL Lead Generator');
  console.log('='.repeat(60));
  console.log(`Mode: ${isQuick ? 'QUICK (RSS only)' : isTenders ? 'TENDERS only' : isNews ? 'NEWS only' : 'FULL'}`);
  console.log(`Wait time: ${waitTime / 1000}s`);
  console.log(`Enabled sources: ${HPCL_DATA_SOURCES.filter(s => s.enabled).length}`);
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
    console.error('   ❌ Failed to initialize Gemini:', error);
    console.log('   ⚠️  Continuing with rule-based analysis only');
  }
  
  // Run scraping based on mode
  console.log('\n📥 Starting data source scraping...\n');
  
  let session: HPCLScrapingSession;
  
  if (isQuick) {
    session = await quickScrapeRSS();
  } else if (isTenders) {
    session = await scrapeTenderSources();
  } else if (isNews) {
    session = await scrapeNewsSources();
  } else {
    session = await scrapeAllSources();
  }
  
  // Print scraping results
  console.log('\n📋 Scraping Results:');
  for (const result of session.results) {
    const icon = result.success ? '✅' : '❌';
    console.log(`   ${icon} ${result.sourceName}: ${result.itemsSubmitted} items submitted`);
    if (result.error) {
      console.log(`      Error: ${result.error}`);
    }
  }
  
  // Wait for pipeline
  if (session.totalItemsSubmitted > 0) {
    await waitForPipeline(waitTime);
  } else {
    console.log('\n⚠️  No items submitted to pipeline');
  }
  
  // Export leads
  console.log('\n📝 Exporting leads...');
  const outputPath = await exportLeads(session);
  
  // Print summary
  printSummary(session, outputPath);
  
  // Read and display some stats from output
  try {
    const output = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    console.log('\n📈 Lead Summary:');
    console.log(`   Total Leads: ${output.summary.totalLeads}`);
    console.log(`   🔥 Hot Leads: ${output.summary.hotLeads}`);
    console.log(`   🌡️  Warm Leads: ${output.summary.warmLeads}`);
    console.log(`   ❄️  Cold Leads: ${output.summary.coldLeads}`);
    console.log(`   Total Dossiers: ${output.summary.totalDossiers}`);
  } catch (e) {
    // Ignore if can't read
  }
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
