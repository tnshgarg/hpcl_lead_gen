/**
 * HPCL Lead Generation - Intent Analyzer
 * 
 * HPCL-specific intent analysis with product recommendations
 * and buying signal detection.
 */

import { generateContent } from './gemini-client.js';
import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';
import {
  loadHPCLConfig,
  getAllProducts,
  getProductsForIndustry,
  detectSignalConfidence,
  detectIndustries,
  type HPCLProduct,
} from '../config/hpcl-config.js';

// Get product name by code from config
function getProductName(code: string): string {
  const allProducts = getAllProducts();
  const product = allProducts.find(p => p.code === code);
  return product?.name || code;
}

/**
 * HPCL-specific analysis result
 */
export interface HPCLAnalysisResult {
  // Signal Detection
  signalType: 'explicit_tender' | 'expansion' | 'operational' | 'none';
  signalConfidence: 'high' | 'medium' | 'low' | null;
  
  // Industry & Company
  detectedIndustries: string[];
  companyName: string | null;
  companyLocation: string | null;
  
  // Product Recommendations
  recommendedProducts: Array<{
    product: string;  // product code
    productName: string;
    confidence: number;
    reason: string;
  }>;
  
  // Lead Quality
  leadScore: number; // 0-100
  leadQuality: 'hot' | 'warm' | 'cold';
  
  // Summary
  summary: string;
  actionRecommendation: string;
}

/**
 * HPCL analysis prompt with explicit scoring guidelines
 */
const HPCL_ANALYSIS_PROMPT = `You are an expert B2B sales analyst for HPCL (Hindustan Petroleum Corporation Limited) Direct Sales division.

HPCL Products Available:
- Industrial Fuels: HSD (High Speed Diesel), FO (Furnace Oil), LSHS (Low Sulphur Heavy Stock), LDO (Light Diesel Oil), MS (Motor Spirit), SKO (Superior Kerosene Oil)
- Specialty Solvents: HEXANE_FOOD (Hexane Food Grade), HEXANE_TECH (Hexane Tech Grade), SOLVENT_1425 (Solvent 1425), MTO (Mineral Turpentine Oil), JBO (Jute Batch Oil)
- Infrastructure: BITUMEN, MARINE_FUELS (Marine Fuels MGO/LSFO), SULPHUR, PROPYLENE

Industry → Product Mapping:
- Cement/Steel Plants → FO, LSHS
- Edible Oil Extraction → HEXANE_FOOD
- Road Construction/NHAI → BITUMEN
- Paint/Coating Industry → SOLVENT_1425, MTO
- Captive Power Plants → FO, LSHS, HSD
- Shipping/Ports → MARINE_FUELS
- Fertilizers → LSHS, SULPHUR
- Logistics/Fleet → HSD, MS
- Jute Mills → JBO
- Pharma → HEXANE_TECH
- Plastics/Polymers → PROPYLENE

=== CRITICAL SCORING RULES (FOLLOW EXACTLY) ===

1. EXPLICIT TENDER/RFQ/EOI (Score: 80-95 → HOT lead)
   - Must contain: "tender", "RFQ", "request for quotation", "EOI", "expression of interest", "bid invitation", "procurement notice", "supply contract"
   - Score 95: Tender with specific quantities and deadline
   - Score 85: Generic tender notice
   - Score 80: EOI or pre-tender inquiry

2. EXPANSION/NEW PROJECT (Score: 50-70 → WARM lead)
   - Must contain: "new plant", "capacity expansion", "greenfield", "brownfield", "commissioning", "adding capacity"
   - Score 70: Expansion with timeline and location
   - Score 60: Expansion announcement without specifics
   - Score 50: General growth/expansion mention

3. COMPANY PROFILE/OPERATIONAL (Score: 20-45 → COLD lead)
   - Company profile, manufacturer listing, fleet info, general capability
   - Score 45: Profile with procurement contact
   - Score 35: Profile with relevant industry
   - Score 20: Generic company info

4. NOT RELEVANT (Score: 0-15 → REJECT)
   - No relevant industry, no procurement signal, generic news
   - Score 0: Completely irrelevant
   - Score 10: Tangentially related

=== YOUR TASK ===
Analyze the document and determine:
1. Signal Type (explicit_tender/expansion/operational/none)
2. Lead Score (use EXACT scoring rules above - DO NOT default to 80)
3. Recommended HPCL products (use product codes like HSD, FO, BITUMEN, etc.)
4. Actionable summary for sales team

Be STRICT with scoring. Most documents should NOT score above 70 unless they contain explicit tender/RFQ language.`;

/**
 * Analyze document for HPCL lead potential
 */
export async function analyzeForHPCL(
  documentText: string,
  documentUrl: string,
  sourceCategory: string
): Promise<HPCLAnalysisResult> {
  const traceId = getTraceId();
  
  // First, do quick rule-based detection
  const signalConfidence = detectSignalConfidence(documentText);
  const detectedIndustries = detectIndustries(documentText);
  
  logger.info('Analyzing document for HPCL', {
    url: documentUrl,
    signalConfidence,
    detectedIndustries,
    traceId,
  });
  
  // Get product recommendations from industry mapping
  const industryProducts: HPCLProduct[] = [];
  for (const industry of detectedIndustries) {
    const { primary, secondary } = getProductsForIndustry(industry);
    for (const product of [...primary, ...secondary]) {
      if (!industryProducts.find(p => p.code === product.code)) {
        industryProducts.push(product);
      }
    }
  }
  
  // Use LLM for deeper analysis
  const prompt = `${HPCL_ANALYSIS_PROMPT}

Source Category: ${sourceCategory}
URL: ${documentUrl}
Detected Industries (rule-based): ${detectedIndustries.join(', ') || 'None'}
Signal Confidence (rule-based): ${signalConfidence || 'None'}

Document Text:
"""
${documentText.slice(0, 4000)}
"""

Analyze this document and respond with JSON:
{
  "signalType": "explicit_tender" | "expansion" | "operational" | "none",
  "companyName": "extracted company name or null",
  "companyLocation": "city/state or null",
  "detectedIndustries": ["list of relevant industries"],
  "recommendedProducts": [
    {
      "product": "HSD|FO|LSHS|BITUMEN|HEXANE_FOOD|etc",
      "reason": "why this product is recommended"
    }
  ],
  "leadScore": 0-100,
  "summary": "2-3 sentence summary of the lead opportunity",
  "actionRecommendation": "what HPCL sales team should do"
}`;

  try {
    const response = await generateContent<{
      signalType: string;
      companyName: string | null;
      companyLocation: string | null;
      detectedIndustries: string[];
      recommendedProducts: Array<{ product: string; reason: string }>;
      leadScore: number;
      summary: string;
      actionRecommendation: string;
    }>(prompt, {
      jsonMode: true,
      systemInstruction: 'You are an HPCL sales intelligence analyst. Be precise and actionable.',
    });
    
    const content = response.content;
    
    // Map products to full info
    const recommendedProducts = (content.recommendedProducts || []).map(rec => {
      return {
        product: rec.product,
        productName: getProductName(rec.product),
        confidence: signalConfidence === 'high' ? 0.9 : 
                   signalConfidence === 'medium' ? 0.7 : 0.5,
        reason: rec.reason,
      };
    });
    
    // Also add rule-based product recommendations
    for (const product of industryProducts) {
      if (!recommendedProducts.find(r => r.product === product.code)) {
        recommendedProducts.push({
          product: product.code,
          productName: product.name,
          confidence: 0.6,
          reason: `Industry match: ${detectedIndustries.join(', ')}`,
        });
      }
    }
    
    // ==========================================
    // POST-LLM SCORE VALIDATION
    // Enforce scoring rules based on signal type
    // ==========================================
    let llmScore = content.leadScore || 0;
    const signalType = content.signalType?.toLowerCase() || 'none';
    
    // Validate and adjust score based on signal type
    if (signalType === 'explicit_tender') {
      // Tenders MUST score 80-95
      llmScore = Math.max(80, Math.min(95, llmScore));
    } else if (signalType === 'expansion') {
      // Expansion MUST score 50-70
      llmScore = Math.max(50, Math.min(70, llmScore));
    } else if (signalType === 'operational') {
      // Operational MUST score 20-45
      llmScore = Math.max(20, Math.min(45, llmScore));
    } else {
      // None/irrelevant MUST score 0-15
      llmScore = Math.min(15, llmScore);
    }
    
    // Final lead score with rule-based adjustment
    const leadScore = llmScore;
    
    // Lead quality thresholds (ALIGNED WITH SCORING RULES)
    // HOT: 80+ (explicit tenders only)
    // WARM: 50-79 (expansion news, interested profiles)
    // COLD: <50 (operational, profiles, irrelevant)
    const leadQuality: 'hot' | 'warm' | 'cold' = 
      leadScore >= 80 ? 'hot' :
      leadScore >= 50 ? 'warm' : 'cold';
    
    const result: HPCLAnalysisResult = {
      signalType: content.signalType as HPCLAnalysisResult['signalType'] || 'none',
      signalConfidence,
      detectedIndustries: content.detectedIndustries || detectedIndustries,
      companyName: content.companyName,
      companyLocation: content.companyLocation,
      recommendedProducts: recommendedProducts.slice(0, 5), // Top 5 products
      leadScore,
      leadQuality,
      summary: content.summary || '',
      actionRecommendation: content.actionRecommendation || '',
    };
    
    logger.info('HPCL analysis completed', {
      url: documentUrl,
      leadScore: result.leadScore,
      leadQuality: result.leadQuality,
      productCount: result.recommendedProducts.length,
      traceId,
    });
    
    return result;
    
  } catch (error) {
    logger.error('HPCL analysis failed, using rule-based fallback', {
      url: documentUrl,
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    
    // Fallback to rule-based analysis
    const leadScore = signalConfidence === 'high' ? 80 :
                     signalConfidence === 'medium' ? 50 :
                     signalConfidence === 'low' ? 30 : 10;
    
    return {
      signalType: signalConfidence === 'high' ? 'explicit_tender' :
                  signalConfidence === 'medium' ? 'expansion' :
                  signalConfidence === 'low' ? 'operational' : 'none',
      signalConfidence,
      detectedIndustries,
      companyName: null,
      companyLocation: null,
      recommendedProducts: industryProducts.map(product => ({
        product: product.code,
        productName: product.name,
        confidence: 0.5,
        reason: `Industry match: ${detectedIndustries.join(', ')}`,
      })),
      leadScore,
      leadQuality: leadScore >= 80 ? 'hot' : leadScore >= 50 ? 'warm' : 'cold',
      summary: `Document from ${sourceCategory} source detected with ${signalConfidence || 'no'} signal confidence.`,
      actionRecommendation: signalConfidence === 'high' 
        ? 'Immediate follow-up recommended' 
        : 'Add to pipeline for review',
    };
  }
}

/**
 * Quick relevance check without full LLM analysis
 */
export function quickHPCLRelevanceCheck(text: string): {
  isRelevant: boolean;
  confidence: 'high' | 'medium' | 'low' | null;
  industries: string[];
  products: HPCLProduct[];
} {
  const confidence = detectSignalConfidence(text);
  const industries = detectIndustries(text);
  
  const products: HPCLProduct[] = [];
  for (const industry of industries) {
    const { primary, secondary } = getProductsForIndustry(industry);
    for (const product of [...primary, ...secondary]) {
      if (!products.find(p => p.code === product.code)) {
        products.push(product);
      }
    }
  }
  
  const isRelevant = confidence !== null || industries.length > 0 || products.length > 0;
  
  return {
    isRelevant,
    confidence,
    industries,
    products,
  };
}

/**
 * Generate HPCL-specific dossier content
 */
export function generateHPCLDossierSections(
  analysis: HPCLAnalysisResult,
  documentUrl: string
): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];
  
  // Lead Overview
  sections.push({
    title: 'Lead Overview',
    content: `
**Lead Quality:** ${analysis.leadQuality.toUpperCase()} (Score: ${analysis.leadScore}/100)
**Signal Type:** ${analysis.signalType.replace('_', ' ').toUpperCase()}
**Confidence:** ${analysis.signalConfidence?.toUpperCase() || 'N/A'}

${analysis.summary}
`.trim(),
  });
  
  // Company Info (if available)
  if (analysis.companyName || analysis.companyLocation) {
    sections.push({
      title: 'Company Information',
      content: `
**Company:** ${analysis.companyName || 'Unknown'}
**Location:** ${analysis.companyLocation || 'Unknown'}
**Source:** ${documentUrl}
`.trim(),
    });
  }
  
  // Industry Analysis
  if (analysis.detectedIndustries.length > 0) {
    sections.push({
      title: 'Industry Analysis',
      content: `**Detected Industries:**
${analysis.detectedIndustries.map(i => `- ${i.replace('_', ' ').toUpperCase()}`).join('\n')}
`.trim(),
    });
  }
  
  // Product Recommendations
  if (analysis.recommendedProducts.length > 0) {
    const productList = analysis.recommendedProducts
      .map((p, i) => `${i + 1}. **${p.productName}** (${(p.confidence * 100).toFixed(0)}% confidence)\n   - ${p.reason}`)
      .join('\n');
    
    sections.push({
      title: 'HPCL Product Recommendations',
      content: productList,
    });
  }
  
  // Action Recommendation
  sections.push({
    title: 'Recommended Action',
    content: analysis.actionRecommendation,
  });
  
  return sections;
}
