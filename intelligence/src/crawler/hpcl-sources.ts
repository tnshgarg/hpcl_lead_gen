/**
 * HPCL Lead Generation - Data Source Configuration
 * 
 * Contains 10+ real data sources for scraping potential leads
 * for HPCL Direct Sales products (HSD, FO, Hexane, Bitumen, etc.)
 */

/**
 * HPCL Products for Direct Sales
 */
export const HPCL_PRODUCTS = {
  // Industrial Fuels
  HSD: 'High Speed Diesel',
  FO: 'Furnace Oil',
  LSHS: 'Low Sulphur Heavy Stock',
  LDO: 'Light Diesel Oil',
  MS: 'Motor Spirit',
  SKO: 'Superior Kerosene Oil',
  
  // Specialty Solvents
  HEXANE_FOOD: 'Hexane (Food Grade)',
  HEXANE_TECH: 'Hexane (Technical)',
  SOLVENT_1425: 'Solvent 1425',
  MTO: 'Mineral Turpentine Oil',
  JBO: 'Jute Batch Oil',
  
  // Infrastructure & Petrochemicals
  BITUMEN: 'Bitumen',
  MARINE_FUELS: 'Marine Fuels (MGO/LSFO)',
  SULPHUR: 'Sulphur',
  PROPYLENE: 'Propylene',
} as const;

export type HPCLProduct = keyof typeof HPCL_PRODUCTS;

/**
 * Industry categories that map to HPCL products
 */
export const INDUSTRY_PRODUCT_MAP: Record<string, HPCLProduct[]> = {
  // Edible Oil Extraction → Hexane (Food Grade)
  'edible_oil': ['HEXANE_FOOD'],
  'solvent_extraction': ['HEXANE_FOOD', 'HEXANE_TECH'],
  
  // Jute Processing → JBO
  'jute_processing': ['JBO'],
  'jute_mills': ['JBO'],
  
  // Paints & Coatings → Solvents
  'paints_coatings': ['SOLVENT_1425', 'MTO', 'HEXANE_TECH'],
  'inks_printing': ['SOLVENT_1425', 'MTO'],
  
  // Captive Power Plants → Heavy Fuels
  'captive_power': ['FO', 'LSHS', 'HSD'],
  'power_generation': ['FO', 'LSHS', 'HSD'],
  
  // Road Construction → Bitumen
  'road_construction': ['BITUMEN'],
  'infrastructure': ['BITUMEN', 'HSD'],
  'highways': ['BITUMEN'],
  
  // Shipping & Ports → Marine Fuels
  'shipping': ['MARINE_FUELS'],
  'ports': ['MARINE_FUELS'],
  'maritime': ['MARINE_FUELS'],
  
  // Cement → Furnace Oil
  'cement': ['FO', 'LSHS'],
  'cement_manufacturing': ['FO', 'LSHS'],
  
  // Steel → Furnace Oil
  'steel': ['FO'],
  'steel_rerolling': ['FO'],
  'metallurgy': ['FO'],
  
  // Fertilizers → LSHS, Sulphur
  'fertilizers': ['LSHS', 'SULPHUR'],
  'chemicals': ['LSHS', 'HEXANE_TECH', 'SKO'],
  
  // Plastics & Polymers → Propylene
  'plastics': ['PROPYLENE'],
  'polymers': ['PROPYLENE'],
  'petrochemicals': ['PROPYLENE', 'HEXANE_TECH'],
  
  // Transport & Logistics → HSD
  'logistics': ['HSD', 'MS'],
  'transport': ['HSD', 'MS'],
  'fleet': ['HSD', 'MS'],
  'mining': ['HSD'],
  'construction': ['HSD', 'BITUMEN'],
  
  // Pharma → Hexane
  'pharma': ['HEXANE_TECH'],
  'pharmaceuticals': ['HEXANE_TECH'],
};

/**
 * Signal keywords for intent detection
 */
export const SIGNAL_KEYWORDS = {
  // High Confidence - Explicit Procurement (Tender signals)
  high: [
    'tender', 'rfq', 'request for quotation', 'eoi', 'expression of interest',
    'procurement', 'bid invitation', 'supply of', 'purchase of', 'contract for',
    'nit', 'notice inviting tender', 'enquiry for', 'quotation for',
    'annual rate contract', 'arc', 'rate contract',
  ],
  
  // Medium Confidence - Expansion signals
  medium: [
    'capacity expansion', 'new plant', 'greenfield', 'brownfield',
    'expansion project', 'new unit', 'commissioning', 'upcoming plant',
    'under construction', 'project announcement', 'capex', 'investment',
    'new factory', 'manufacturing unit', 'production capacity',
    'boiler installation', 'kiln', 'furnace upgrade',
  ],
  
  // Low-Medium Confidence - Operational signals
  low: [
    'manufacturer', 'operates', 'fleet size', 'production facility',
    'industrial unit', 'company profile', 'about us', 'our facilities',
    'plant location', 'manufacturing capacity', 'annual production',
  ],
};

/**
 * Data source type
 */
export type SourceType = 'rss' | 'html' | 'api';
export type SourceCategory = 'tender' | 'news' | 'directory' | 'regulatory' | 'industry';

/**
 * HPCL Data Source Configuration
 */
export interface HPCLDataSource {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  category: SourceCategory;
  relevantProducts: HPCLProduct[];
  relevantIndustries: string[];
  scrapeFrequency: 'hourly' | 'daily' | 'weekly';
  priority: number; // 1-10, higher = more important
  enabled: boolean;
  description: string;
}

/**
 * HPCL Data Sources - 12 Real Sources
 */
export const HPCL_DATA_SOURCES: HPCLDataSource[] = [
  // ============================================
  // NEWS RSS FEEDS
  // ============================================
  {
    id: 'et-industry',
    name: 'Economic Times - Industry',
    type: 'rss',
    url: 'https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS', 'BITUMEN'],
    relevantIndustries: ['cement', 'steel', 'infrastructure', 'power_generation'],
    scrapeFrequency: 'daily',
    priority: 9,
    enabled: true,
    description: 'Economic Times industry news covering cement, steel, power sectors',
  },
  {
    id: 'livemint-industry',
    name: 'Livemint - Industry',
    type: 'rss',
    url: 'https://www.livemint.com/rss/industry',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'BITUMEN', 'HEXANE_FOOD'],
    relevantIndustries: ['infrastructure', 'captive_power', 'chemicals'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'Livemint industry news for business expansion signals',
  },
  {
    id: 'cemnet-news',
    name: 'CemNet - Cement Industry News',
    type: 'rss',
    url: 'https://www.cemnet.com/news/rss',
    category: 'industry',
    relevantProducts: ['FO', 'LSHS'],
    relevantIndustries: ['cement', 'cement_manufacturing'],
    scrapeFrequency: 'daily',
    priority: 9,
    enabled: true,
    description: 'Global cement industry news, plant expansions, procurement',
  },
  {
    id: 'global-cement',
    name: 'Global Cement News',
    type: 'rss',
    url: 'https://www.globalcement.com/news?format=feed&type=rss',
    category: 'industry',
    relevantProducts: ['FO', 'LSHS'],
    relevantIndustries: ['cement', 'cement_manufacturing'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'Global cement industry updates and expansion news',
  },
  {
    id: 'worldsteel',
    name: 'World Steel Association',
    type: 'rss',
    url: 'https://worldsteel.org/feed/',
    category: 'industry',
    relevantProducts: ['FO'],
    relevantIndustries: ['steel', 'steel_rerolling', 'metallurgy'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'World Steel Association news and industry updates',
  },
  {
    id: 'shanghai-metals',
    name: 'Shanghai Metals Market - Industry',
    type: 'rss',
    url: 'https://rss.metal.com/news/industry_news.xml',
    category: 'industry',
    relevantProducts: ['FO', 'HSD'],
    relevantIndustries: ['steel', 'metallurgy', 'mining'],
    scrapeFrequency: 'daily',
    priority: 6,
    enabled: true,
    description: 'Metals market news covering steel and industrial sectors',
  },
  {
    id: 'et-energy',
    name: 'Economic Times - Energy',
    type: 'rss',
    url: 'https://economictimes.indiatimes.com/industry/energy/rssfeeds/13358361.cms',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS', 'BITUMEN'],
    relevantIndustries: ['power_generation', 'oil_gas', 'renewables'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'ET Energy news covering conventional and renewable energy',
  },
  {
    id: 'et-transport',
    name: 'Economic Times - Transportation/Logistics',
    type: 'rss',
    url: 'https://economictimes.indiatimes.com/industry/transportation/rssfeeds/13352329.cms',
    category: 'news',
    relevantProducts: ['HSD', 'MS', 'BITUMEN'],
    relevantIndustries: ['logistics', 'transport', 'shipping', 'railways'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'ET Transportation news covering logistics, fleet, and infrastructure',
  },
  {
    id: 'et-auto',
    name: 'Economic Times - Auto',
    type: 'rss',
    url: 'https://economictimes.indiatimes.com/industry/auto/rssfeeds/13352306.cms',
    category: 'news',
    relevantProducts: ['HSD', 'MS', 'LDO'],
    relevantIndustries: ['auto_manufacturing', 'transport'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'ET Auto news for fleet and manufacturing signals',
  },
  {
    id: 'bs-companies',
    name: 'Business Standard - Companies',
    type: 'rss',
    url: 'https://www.business-standard.com/rss/companies-101.rss',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS'],
    relevantIndustries: ['manufacturing', 'corporate', 'infrastructure'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'Business Standard corporate news and expansion updates',
  },
  {
    id: 'fe-industry',
    name: 'Financial Express - Industry',
    type: 'rss',
    url: 'https://www.financialexpress.com/feed/rss/industry',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS', 'BITUMEN'],
    relevantIndustries: ['infrastructure', 'manufacturing', 'power_generation'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'Financial Express industry news and reliable market signals',
  },
  {
    id: 'hbl-logistics',
    name: 'Hindu Business Line - Logistics',
    type: 'rss',
    url: 'https://www.thehindubusinessline.com/economy/logistics/?service=rss',
    category: 'news',
    relevantProducts: ['HSD', 'MARINE_FUELS'],
    relevantIndustries: ['logistics', 'shipping', 'transport'],
    scrapeFrequency: 'daily',
    priority: 8,
    enabled: true,
    description: 'HBL Logistics news for fleet and shipping leads',
  },
  {
    id: 'moneycontrol-business',
    name: 'Moneycontrol - Business',
    type: 'rss',
    url: 'https://www.moneycontrol.com/rss/business.xml',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS'],
    relevantIndustries: ['corporate', 'manufacturing', 'infrastructure'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'Moneycontrol business news feed',
  },
  {
    id: 'toi-business',
    name: 'Times of India - Business',
    type: 'rss',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
    category: 'news',
    relevantProducts: ['HSD', 'MS', 'FO'],
    relevantIndustries: ['business', 'economy', 'manufacturing'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'Times of India business section',
  },
  {
    id: 'construction-world',
    name: 'Construction World',
    type: 'rss',
    url: 'https://www.constructionworld.in/rss/latest-news',
    category: 'industry',
    relevantProducts: ['BITUMEN', 'HSD', 'FO'],
    relevantIndustries: ['construction', 'infrastructure', 'cement'],
    scrapeFrequency: 'daily',
    priority: 9,
    enabled: true,
    description: 'Construction World magazine news feed',
  },
  {
    id: 'cnbc-business',
    name: 'CNBC TV18 - Business',
    type: 'rss',
    url: 'https://www.cnbctv18.com/commonfeeds/v1/cne/rss/business.xml',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS'],
    relevantIndustries: ['corporate', 'manufacturing'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'CNBC TV18 business news',
  },
  {
    id: 'zeebiz-companies',
    name: 'Zee Business - Companies',
    type: 'rss',
    url: 'https://www.zeebiz.com/companies.xml',
    category: 'news',
    relevantProducts: ['HSD', 'FO'],
    relevantIndustries: ['corporate', 'manufacturing'],
    scrapeFrequency: 'daily',
    priority: 6,
    enabled: true,
    description: 'Zee Business corporate news',
  },
  {
    id: 'livemint-companies',
    name: 'Livemint - Companies',
    type: 'rss',
    url: 'https://www.livemint.com/rss/companies',
    category: 'news',
    relevantProducts: ['HSD', 'FO', 'LSHS'],
    relevantIndustries: ['corporate', 'manufacturing', 'infrastructure'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'Livemint companies news section',
  },
  {
    id: 'ndtv-profit',
    name: 'NDTV Profit',
    type: 'rss',
    url: 'https://feeds.feedburner.com/ndtvprofit-latest',
    category: 'news',
    relevantProducts: ['HSD', 'FO'],
    relevantIndustries: ['business', 'markets'],
    scrapeFrequency: 'daily',
    priority: 6,
    enabled: true,
    description: 'NDTV Profit business news',
  },
  {
    id: 'indian-express-business',
    name: 'Indian Express - Business',
    type: 'rss',
    url: 'https://indianexpress.com/section/business/feed/',
    category: 'news',
    relevantProducts: ['HSD', 'MS', 'FO'],
    relevantIndustries: ['economy', 'policy', 'industry'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'Indian Express business news',
  },
  {
    id: 'outlook-business',
    name: 'Outlook Business',
    type: 'rss',
    url: 'https://www.outlookbusiness.com/rss/feed',
    category: 'news',
    relevantProducts: ['HSD', 'FO'],
    relevantIndustries: ['business', 'strategy'],
    scrapeFrequency: 'daily',
    priority: 6,
    enabled: true,
    description: 'Outlook Business magazine feed',
  },
  {
    id: 'india-today-business',
    name: 'India Today - Business',
    type: 'rss',
    url: 'https://www.indiatoday.in/rss/1206578',
    category: 'news',
    relevantProducts: ['HSD', 'MS', 'FO'],
    relevantIndustries: ['economy', 'business'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'India Today business news',
  },
  {
    id: 'news18-business',
    name: 'News18 - Business',
    type: 'rss',
    url: 'https://www.news18.com/commonfeeds/v1/eng/rss/business.xml',
    category: 'news',
    relevantProducts: ['HSD', 'FO'],
    relevantIndustries: ['economy', 'markets'],
    scrapeFrequency: 'daily',
    priority: 7,
    enabled: true,
    description: 'News18 business news feed',
  },
  {
    id: 'projects-today',
    name: 'Projects Today',
    type: 'rss',
    url: 'https://www.projectstoday.com/rss/news',
    category: 'industry',
    relevantProducts: ['BITUMEN', 'HSD', 'FO', 'LSHS'],
    relevantIndustries: ['projects', 'infrastructure', 'construction'],
    scrapeFrequency: 'daily',
    priority: 9,
    enabled: true,
    description: 'Projects Today - New project announcements',
  },
  
  // ============================================
  // GOVERNMENT TENDER PORTALS
  // ============================================
  {
    id: 'cppp-tenders',
    name: 'Central Public Procurement Portal',
    type: 'html',
    url: 'https://eprocure.gov.in/cppp/latestactivetendersnew/cpppdata',
    category: 'tender',
    relevantProducts: ['HSD', 'FO', 'BITUMEN', 'LSHS'],
    relevantIndustries: ['infrastructure', 'road_construction', 'power_generation'],
    scrapeFrequency: 'hourly',
    priority: 10,
    enabled: true,
    description: 'Central Government tenders - petroleum, roads, infrastructure',
  },
  {
    id: 'gem-petroleum',
    name: 'GeM - Government e-Marketplace',
    type: 'html',
    url: 'https://gem.gov.in/view_contracts?cat_id=petroleum',
    category: 'tender',
    relevantProducts: ['HSD', 'MS', 'LDO'],
    relevantIndustries: ['logistics', 'transport', 'power_generation'],
    scrapeFrequency: 'hourly',
    priority: 10,
    enabled: true,
    description: 'GeM contracts for petroleum products procurement',
  },
  {
    id: 'nhai-tenders',
    name: 'NHAI - Road Tenders',
    type: 'html',
    url: 'https://nhai.gov.in/tenders',
    category: 'tender',
    relevantProducts: ['BITUMEN', 'HSD'],
    relevantIndustries: ['road_construction', 'infrastructure', 'highways'],
    scrapeFrequency: 'daily',
    priority: 9,
    enabled: true,
    description: 'National Highway Authority tenders for bitumen and road construction',
  },
  
  // ============================================
  // INDUSTRY DIRECTORIES
  // ============================================
  {
    id: 'indiamart-cement',
    name: 'IndiaMART - Cement Manufacturers',
    type: 'html',
    url: 'https://www.indiamart.com/impcat/cement-plant.html',
    category: 'directory',
    relevantProducts: ['FO', 'LSHS'],
    relevantIndustries: ['cement', 'cement_manufacturing'],
    scrapeFrequency: 'weekly',
    priority: 6,
    enabled: true,
    description: 'B2B directory of cement manufacturers and plants',
  },
  {
    id: 'indiamart-edibleoil',
    name: 'IndiaMART - Edible Oil Manufacturers',
    type: 'html',
    url: 'https://www.indiamart.com/impcat/edible-oil-plants.html',
    category: 'directory',
    relevantProducts: ['HEXANE_FOOD'],
    relevantIndustries: ['edible_oil', 'solvent_extraction'],
    scrapeFrequency: 'weekly',
    priority: 7,
    enabled: true,
    description: 'B2B directory of edible oil extraction plants',
  },
  {
    id: 'indiamart-paints',
    name: 'IndiaMART - Paint Manufacturers',
    type: 'html',
    url: 'https://www.indiamart.com/impcat/paint-manufacturing.html',
    category: 'directory',
    relevantProducts: ['SOLVENT_1425', 'MTO', 'HEXANE_TECH'],
    relevantIndustries: ['paints_coatings', 'inks_printing'],
    scrapeFrequency: 'weekly',
    priority: 6,
    enabled: true,
    description: 'B2B directory of paint and coating manufacturers',
  },
];

/**
 * Get enabled data sources
 */
export function getEnabledSources(): HPCLDataSource[] {
  return HPCL_DATA_SOURCES.filter(source => source.enabled);
}

/**
 * Get sources by category
 */
export function getSourcesByCategory(category: SourceCategory): HPCLDataSource[] {
  return HPCL_DATA_SOURCES.filter(source => source.enabled && source.category === category);
}

/**
 * Get sources by type
 */
export function getSourcesByType(type: SourceType): HPCLDataSource[] {
  return HPCL_DATA_SOURCES.filter(source => source.enabled && source.type === type);
}

/**
 * Get products for an industry
 */
export function getProductsForIndustry(industry: string): HPCLProduct[] {
  const normalizedIndustry = industry.toLowerCase().replace(/[\s-]/g, '_');
  return INDUSTRY_PRODUCT_MAP[normalizedIndustry] || [];
}

/**
 * Detect signal confidence level from text
 */
export function detectSignalConfidence(text: string): 'high' | 'medium' | 'low' | null {
  const lowerText = text.toLowerCase();
  
  // Check high confidence first
  for (const keyword of SIGNAL_KEYWORDS.high) {
    if (lowerText.includes(keyword)) {
      return 'high';
    }
  }
  
  // Check medium confidence
  for (const keyword of SIGNAL_KEYWORDS.medium) {
    if (lowerText.includes(keyword)) {
      return 'medium';
    }
  }
  
  // Check low confidence
  for (const keyword of SIGNAL_KEYWORDS.low) {
    if (lowerText.includes(keyword)) {
      return 'low';
    }
  }
  
  return null;
}

/**
 * Detect industries mentioned in text
 */
export function detectIndustries(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detectedIndustries: string[] = [];
  
  const industryKeywords: Record<string, string[]> = {
    'cement': ['cement', 'clinker', 'kiln', 'limestone'],
    'steel': ['steel', 'iron', 'blast furnace', 'rolling mill', 're-rolling'],
    'edible_oil': ['edible oil', 'solvent extraction', 'oil mill', 'vegetable oil', 'groundnut oil', 'soybean oil'],
    'paints_coatings': ['paint', 'coating', 'pigment', 'varnish', 'lacquer'],
    'road_construction': ['road', 'highway', 'nhai', 'bitumen', 'asphalt', 'tar'],
    'fertilizers': ['fertilizer', 'urea', 'dap', 'ammonia', 'fertiliser'],
    'shipping': ['shipping', 'port', 'vessel', 'maritime', 'bunker', 'ship'],
    'captive_power': ['captive power', 'cpp', 'boiler', 'steam generation', 'thermal'],
    'jute_processing': ['jute', 'jute mill', 'jute processing'],
    'logistics': ['logistics', 'fleet', 'truck', 'transport', 'trucking'],
    'pharma': ['pharma', 'pharmaceutical', 'drug manufacturing', 'api manufacturing'],
    'plastics': ['plastic', 'polymer', 'polypropylene', 'pp plant', 'petrochemical'],
  };
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        if (!detectedIndustries.includes(industry)) {
          detectedIndustries.push(industry);
        }
        break;
      }
    }
  }
  
  return detectedIndustries;
}
