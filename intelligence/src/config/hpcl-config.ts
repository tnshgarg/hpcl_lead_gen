/**
 * HPCL Configuration Loader
 * 
 * Loads and provides access to the HPCL products configuration.
 * This is the single source of truth for all HPCL product data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
export interface HPCLProduct {
  code: string;
  name: string;
  description: string;
  targetIndustries: string[];
  keywords: string[];
}

export interface IndustryMapping {
  primaryProducts: string[];
  secondaryProducts: string[];
  keywords: string[];
}

export interface SignalConfig {
  description: string;
  weight: number;
  keywords: string[];
}

export interface HPCLConfig {
  version: string;
  lastUpdated: string;
  description: string;
  products: {
    industrial_fuels: HPCLProduct[];
    specialty_solvents: HPCLProduct[];
    infrastructure_petrochemicals: HPCLProduct[];
  };
  industryMapping: Record<string, IndustryMapping>;
  signalTaxonomy: {
    high_confidence: SignalConfig;
    medium_confidence: SignalConfig;
    low_confidence: SignalConfig;
  };
  scoringRules: {
    tender_explicit: { minScore: number; maxScore: number };
    expansion_news: { minScore: number; maxScore: number };
    company_profile: { minScore: number; maxScore: number };
    recency_bonus: { within_7_days: number; within_30_days: number; older: number };
    company_size_bonus: { large: number; medium: number; small: number };
  };
  blockedIndustries: string[];
}

// Singleton config instance
let configInstance: HPCLConfig | null = null;

/**
 * Load HPCL configuration from JSON file
 */
export function loadHPCLConfig(): HPCLConfig {
  if (configInstance) {
    return configInstance;
  }

  const configPath = path.join(__dirname, '../../config/hpcl-products.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  configInstance = JSON.parse(configData) as HPCLConfig;
  
  return configInstance;
}

/**
 * Get all products as a flat array
 */
export function getAllProducts(): HPCLProduct[] {
  const config = loadHPCLConfig();
  return [
    ...config.products.industrial_fuels,
    ...config.products.specialty_solvents,
    ...config.products.infrastructure_petrochemicals,
  ];
}

/**
 * Get product by code
 */
export function getProductByCode(code: string): HPCLProduct | undefined {
  return getAllProducts().find(p => p.code === code);
}

/**
 * Get products for an industry
 */
export function getProductsForIndustry(industry: string): { primary: HPCLProduct[]; secondary: HPCLProduct[] } {
  const config = loadHPCLConfig();
  const mapping = config.industryMapping[industry.toLowerCase().replace(/\s+/g, '_')];
  
  if (!mapping) {
    return { primary: [], secondary: [] };
  }

  const allProducts = getAllProducts();
  return {
    primary: mapping.primaryProducts.map(code => allProducts.find(p => p.code === code)).filter(Boolean) as HPCLProduct[],
    secondary: mapping.secondaryProducts.map(code => allProducts.find(p => p.code === code)).filter(Boolean) as HPCLProduct[],
  };
}

/**
 * Detect industries from text using config keywords
 */
export function detectIndustries(text: string): string[] {
  const config = loadHPCLConfig();
  const lowerText = text.toLowerCase();
  const detected: string[] = [];

  for (const [industry, mapping] of Object.entries(config.industryMapping)) {
    for (const keyword of mapping.keywords) {
      if (lowerText.includes(keyword)) {
        detected.push(industry);
        break;
      }
    }
  }

  return detected;
}

/**
 * Detect signal confidence level from text
 */
export function detectSignalConfidence(text: string): 'high' | 'medium' | 'low' | null {
  const config = loadHPCLConfig();
  const lowerText = text.toLowerCase();

  // Check high confidence first
  for (const keyword of config.signalTaxonomy.high_confidence.keywords) {
    if (lowerText.includes(keyword)) {
      return 'high';
    }
  }

  // Check medium confidence
  for (const keyword of config.signalTaxonomy.medium_confidence.keywords) {
    if (lowerText.includes(keyword)) {
      return 'medium';
    }
  }

  // Check low confidence
  for (const keyword of config.signalTaxonomy.low_confidence.keywords) {
    if (lowerText.includes(keyword)) {
      return 'low';
    }
  }

  return null;
}

/**
 * Check if an industry is blocked (irrelevant)
 */
export function isBlockedIndustry(text: string): boolean {
  const config = loadHPCLConfig();
  const lowerText = text.toLowerCase();

  for (const blocked of config.blockedIndustries) {
    if (lowerText.includes(blocked)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all product keywords for filtering
 */
export function getAllProductKeywords(): string[] {
  const products = getAllProducts();
  const keywords = new Set<string>();

  for (const product of products) {
    for (const keyword of product.keywords) {
      keywords.add(keyword);
    }
  }

  return Array.from(keywords);
}

/**
 * Calculate lead score based on config rules
 */
export function calculateLeadScore(
  signalType: 'tender' | 'expansion' | 'profile',
  recencyDays: number,
  companySize: 'large' | 'medium' | 'small' = 'medium'
): number {
  const config = loadHPCLConfig();
  const rules = config.scoringRules;

  // Base score
  let baseMin = rules.company_profile.minScore;
  let baseMax = rules.company_profile.maxScore;

  if (signalType === 'tender') {
    baseMin = rules.tender_explicit.minScore;
    baseMax = rules.tender_explicit.maxScore;
  } else if (signalType === 'expansion') {
    baseMin = rules.expansion_news.minScore;
    baseMax = rules.expansion_news.maxScore;
  }

  // Midpoint of range
  let score = (baseMin + baseMax) / 2;

  // Recency bonus
  if (recencyDays <= 7) {
    score += rules.recency_bonus.within_7_days;
  } else if (recencyDays <= 30) {
    score += rules.recency_bonus.within_30_days;
  }

  // Company size bonus
  score += rules.company_size_bonus[companySize];

  return Math.min(100, Math.round(score));
}

/**
 * Recommend top products based on detected signals
 */
export function recommendProducts(
  text: string,
  limit: number = 3
): { product: HPCLProduct; reason: string; confidence: number }[] {
  const industries = detectIndustries(text);
  const signalConfidence = detectSignalConfidence(text);
  const config = loadHPCLConfig();
  
  const recommendations: { product: HPCLProduct; reason: string; confidence: number }[] = [];
  const addedCodes = new Set<string>();

  // Get products from detected industries
  for (const industry of industries) {
    const { primary, secondary } = getProductsForIndustry(industry);
    
    for (const product of primary) {
      if (!addedCodes.has(product.code)) {
        const confidence = signalConfidence === 'high' ? 90 :
                          signalConfidence === 'medium' ? 70 : 50;
        recommendations.push({
          product,
          reason: `Primary match for ${industry.replace('_', ' ')}`,
          confidence,
        });
        addedCodes.add(product.code);
      }
    }

    for (const product of secondary) {
      if (!addedCodes.has(product.code) && recommendations.length < limit + 2) {
        recommendations.push({
          product,
          reason: `Secondary match for ${industry.replace('_', ' ')}`,
          confidence: 40,
        });
        addedCodes.add(product.code);
      }
    }
  }

  // Sort by confidence and return top N
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
}
