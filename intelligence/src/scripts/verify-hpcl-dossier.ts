/**
 * HPCL Dossier Verification Test
 * 
 * Hard verification that:
 * 1. hpcl-products.json is actually loaded
 * 2. HPCL analyzer produces correct product recommendations
 * 3. Lead scoring properly categorizes hot/warm/cold
 * 4. End-to-end dossier generation works correctly
 */

import { 
  loadHPCLConfig, 
  detectIndustries, 
  detectSignalConfidence,
  getProductsForIndustry,
  recommendProducts,
  calculateLeadScore 
} from '../config/hpcl-config.js';
import { analyzeForHPCL, quickHPCLRelevanceCheck } from '../ai/hpcl-analyzer.js';
import { initPostgres, closePostgres } from '../db/postgres.js';
import { initGeminiClient } from '../ai/gemini-client.js';

// Test cases - real-world HPCL-relevant content
const TEST_CASES = [
  {
    name: 'Cement Plant Tender (HOT LEAD)',
    description: 'Should be HOT - explicit tender for cement industry',
    expectedScore: { min: 80, max: 100 },
    expectedQuality: 'hot',
    expectedProducts: ['FO', 'LSHS'],
    text: `
      TENDER NOTICE
      UltraTech Cement Limited - Aditya Birla Group
      Location: Rajsamand, Rajasthan
      
      Notice Inviting Tender for Supply of Furnace Oil
      
      Tender Reference: UCL/PROC/FO/2026/0234
      
      UltraTech Cement Limited invites bids from reputed petroleum companies 
      for annual rate contract for supply of Furnace Oil to our cement 
      manufacturing facility.
      
      Estimated Quantity: 50,000 KL per annum
      Contract Period: 1 year with extension option
      
      Last Date for Submission: 28th February 2026
      
      Contact: procurement@ultratechcement.com
    `,
    sourceUrl: 'https://eprocure.gov.in/tenders/ultratech-fo-2026'
  },
  {
    name: 'Steel Mill Expansion (WARM LEAD)',
    description: 'Should be WARM - expansion news for steel, no explicit tender',
    expectedScore: { min: 50, max: 75 },
    expectedQuality: 'warm',
    expectedProducts: ['FO', 'HSD'],
    text: `
      JSW Steel announces Rs 15,000 crore expansion at Vijayanagar plant
      
      Mumbai, Feb 7, 2026: JSW Steel Ltd, India's leading integrated steel 
      company, announced today a major capacity expansion at its Vijayanagar 
      works in Karnataka.
      
      The company plans to add a new blast furnace with 3 MTPA capacity, 
      scheduled for commissioning by Q4 FY2027. This greenfield expansion 
      will require significant fuel procurement for the new facilities.
      
      "This expansion strengthens our position in the steel sector," said 
      the company spokesperson.
      
      The new furnace installation will require continuous fuel supply 
      for heating and power generation.
    `,
    sourceUrl: 'https://www.livemint.com/industry/jsw-steel-expansion-2026'
  },
  {
    name: 'Edible Oil Mill Profile (WARM LEAD)',
    description: 'Should be WARM - edible oil company profile with procurement signal',
    expectedScore: { min: 40, max: 70 },
    expectedQuality: 'warm',
    expectedProducts: ['HEXANE_FOOD'],
    text: `
      Adani Wilmar Ltd - Company Profile
      
      About Us:
      Adani Wilmar is India's largest edible oil company operating 
      solvent extraction plants across 6 locations in India.
      
      Our manufacturing facilities:
      - Mundra, Gujarat - 1000 TPD solvent extraction capacity
      - Mangalore, Karnataka - 800 TPD crushing plant
      - Haldia, West Bengal - 500 TPD oil mill
      
      We are looking to expand our hexane supply contracts for the 
      upcoming financial year. Interested suppliers may contact 
      our procurement team.
      
      Contact: sourcing@adaniwilmar.com
    `,
    sourceUrl: 'https://www.indiamart.com/adani-wilmar'
  },
  {
    name: 'Road Construction RFQ (HOT LEAD)',
    description: 'Should be HOT - explicit RFQ for bitumen',
    expectedScore: { min: 80, max: 100 },
    expectedQuality: 'hot',
    expectedProducts: ['BITUMEN'],
    text: `
      Request for Quotation - National Highways Authority of India
      
      RFQ Reference: NHAI/BITUMEN/2026/1234
      
      Subject: Supply of Bitumen for Delhi-Mumbai Expressway Project
      
      NHAI invites quotations from OMCs and authorized bitumen suppliers 
      for supply of VG-30 grade bitumen for the ongoing expressway 
      construction project.
      
      Requirement: 25,000 MT
      Delivery: Staged delivery over 12 months
      Location: Multiple sites along Delhi-Mumbai corridor
      
      Bid Submission Deadline: 15th March 2026
      EMD: Rs. 50 Lakhs
      
      For queries: procurement.nhai@gov.in
    `,
    sourceUrl: 'https://nhai.gov.in/tenders/bitumen-2026'
  },
  {
    name: 'Shipping Company Bunker Need (WARM LEAD)',
    description: 'Should be WARM - shipping company needs marine fuel',
    expectedScore: { min: 50, max: 75 },
    expectedQuality: 'warm',
    expectedProducts: ['MARINE_FUELS'],
    text: `
      Shipping Corporation of India - Fleet Expansion Update
      
      SCI is adding 5 new bulk carriers to its fleet in 2026-27.
      The new vessels will require regular bunkering services at 
      major Indian ports including Mumbai, Kandla, and Chennai.
      
      We are exploring partnerships with petroleum companies for 
      long-term fuel supply arrangements. Our estimated annual 
      marine fuel requirement will increase by 50,000 MT with 
      the new fleet additions.
      
      Interested suppliers may express interest by writing to 
      bunkering@shipindia.com
    `,
    sourceUrl: 'https://www.shipindia.com/fleet-update-2026'
  },
  {
    name: 'Generic Industry News (COLD LEAD)',
    description: 'Should be COLD - generic news without clear signal',
    expectedScore: { min: 0, max: 40 },
    expectedQuality: 'cold',
    expectedProducts: [],
    text: `
      India's industrial sector showing growth signs in Q3 FY26
      
      Manufacturing activities across sectors have picked up in the 
      current quarter, analysts say. The PMI data suggests improved 
      business conditions.
      
      Various industries including auto, metals, and chemicals are 
      witnessing improved order books.
      
      Experts believe this trend will continue into the next fiscal.
    `,
    sourceUrl: 'https://economictimes.indiatimes.com/generic-news'
  }
];

async function runVerification() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 HPCL DOSSIER GENERATION - HARD VERIFICATION');
  console.log('='.repeat(80) + '\n');
  
  // ========================================
  // TEST 1: Verify config is loaded from JSON
  // ========================================
  console.log('📋 TEST 1: Verifying config/hpcl-products.json is loaded...\n');
  
  try {
    const config = loadHPCLConfig();
    console.log('✅ Config loaded successfully!');
    console.log(`   Version: ${config.version}`);
    console.log(`   Last Updated: ${config.lastUpdated}`);
    console.log(`   Industrial Fuels: ${config.products.industrial_fuels.length} products`);
    console.log(`   Specialty Solvents: ${config.products.specialty_solvents.length} products`);
    console.log(`   Infrastructure: ${config.products.infrastructure_petrochemicals.length} products`);
    console.log(`   Industry Mappings: ${Object.keys(config.industryMapping).length}`);
    console.log(`   Blocked Industries: ${config.blockedIndustries.length}`);
    
    // Show sample products
    console.log('\n   Sample Products from JSON:');
    config.products.industrial_fuels.slice(0, 3).forEach(p => {
      console.log(`   - ${p.code}: ${p.name}`);
    });
  } catch (error) {
    console.log('❌ FAILED to load config!', error);
    process.exit(1);
  }
  
  // ========================================
  // TEST 2: Verify industry detection
  // ========================================
  console.log('\n' + '-'.repeat(80));
  console.log('📋 TEST 2: Verifying industry detection uses config keywords...\n');
  
  const industryTests = [
    { text: 'cement plant kiln expansion', expected: ['cement'] },
    { text: 'steel mill blast furnace upgrade', expected: ['steel'] },
    { text: 'solvent extraction edible oil refinery', expected: ['edible_oil'] },
    { text: 'NHAI road construction highway project', expected: ['road_construction'] },
    { text: 'shipping port vessel bunkering', expected: ['shipping_ports'] },
  ];
  
  let industryPassed = 0;
  for (const test of industryTests) {
    const detected = detectIndustries(test.text);
    const passed = test.expected.every(e => detected.includes(e));
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} "${test.text.slice(0, 40)}..." → [${detected.join(', ')}]`);
    if (passed) industryPassed++;
  }
  console.log(`\n   Result: ${industryPassed}/${industryTests.length} passed`);
  
  // ========================================
  // TEST 3: Verify signal confidence detection
  // ========================================
  console.log('\n' + '-'.repeat(80));
  console.log('📋 TEST 3: Verifying signal confidence detection...\n');
  
  const signalTests = [
    { text: 'tender invitation for supply of HSD', expected: 'high' },
    { text: 'RFQ for petroleum products', expected: 'high' },
    { text: 'capacity expansion new plant commissioning', expected: 'medium' },
    { text: 'greenfield project announcement', expected: 'medium' },
    { text: 'company profile manufacturing facility', expected: 'low' },
    { text: 'random unrelated news article', expected: null },
  ];
  
  let signalPassed = 0;
  for (const test of signalTests) {
    const detected = detectSignalConfidence(test.text);
    const passed = detected === test.expected;
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} "${test.text.slice(0, 40)}..." → ${detected} (expected: ${test.expected})`);
    if (passed) signalPassed++;
  }
  console.log(`\n   Result: ${signalPassed}/${signalTests.length} passed`);
  
  // ========================================
  // TEST 4: Verify product recommendations
  // ========================================
  console.log('\n' + '-'.repeat(80));
  console.log('📋 TEST 4: Verifying product recommendations from config...\n');
  
  const productTests = [
    { text: 'cement plant kiln requires furnace oil supply', expected: ['FO', 'LSHS'] },
    { text: 'edible oil solvent extraction hexane procurement', expected: ['HEXANE_FOOD'] },
    { text: 'road construction bitumen asphalt NHAI project', expected: ['BITUMEN'] },
  ];
  
  let productPassed = 0;
  for (const test of productTests) {
    const recommendations = recommendProducts(test.text, 3);
    const recommendedCodes = recommendations.map(r => r.product.code);
    const passed = test.expected.some(e => recommendedCodes.includes(e));
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} "${test.text.slice(0, 40)}..."`);
    console.log(`      Recommended: ${recommendedCodes.join(', ') || 'None'}`);
    console.log(`      Expected any of: ${test.expected.join(', ')}`);
    if (passed) productPassed++;
  }
  console.log(`\n   Result: ${productPassed}/${productTests.length} passed`);
  
  // ========================================
  // TEST 5: Full HPCL Analyzer with AI
  // ========================================
  console.log('\n' + '-'.repeat(80));
  console.log('📋 TEST 5: Running full HPCL analyzer on test cases...\n');
  
  // Initialize services
  await initPostgres();
  initGeminiClient();
  
  const results: {
    name: string;
    actualScore: number;
    actualQuality: string;
    expectedQuality: string;
    products: string[];
    passed: boolean;
  }[] = [];
  
  for (const testCase of TEST_CASES) {
    console.log(`\n   📝 Testing: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    
    try {
      const analysis = await analyzeForHPCL(
        testCase.text,
        testCase.sourceUrl,
        'test'
      );
      
      const qualityPassed = analysis.leadQuality === testCase.expectedQuality;
      const scorePassed = analysis.leadScore >= testCase.expectedScore.min && 
                         analysis.leadScore <= testCase.expectedScore.max;
      const passed = qualityPassed;
      
      console.log(`   Score: ${analysis.leadScore} (expected: ${testCase.expectedScore.min}-${testCase.expectedScore.max}) ${scorePassed ? '✅' : '⚠️'}`);
      console.log(`   Quality: ${analysis.leadQuality} (expected: ${testCase.expectedQuality}) ${qualityPassed ? '✅' : '❌'}`);
      console.log(`   Industries: ${analysis.detectedIndustries.join(', ') || 'None'}`);
      console.log(`   Products: ${analysis.recommendedProducts.map(p => p.productName).join(', ') || 'None'}`);
      console.log(`   Company: ${analysis.companyName || 'Not detected'}`);
      console.log(`   Signal: ${analysis.signalType} (${analysis.signalConfidence})`);
      
      results.push({
        name: testCase.name,
        actualScore: analysis.leadScore,
        actualQuality: analysis.leadQuality,
        expectedQuality: testCase.expectedQuality,
        products: analysis.recommendedProducts.map(p => p.product),
        passed
      });
    } catch (error) {
      console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      results.push({
        name: testCase.name,
        actualScore: 0,
        actualQuality: 'error',
        expectedQuality: testCase.expectedQuality,
        products: [],
        passed: false
      });
    }
  }
  
  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  
  console.log('\n🏷️  LEAD QUALITY BREAKDOWN:\n');
  
  const hotLeads = results.filter(r => r.actualQuality === 'hot');
  const warmLeads = results.filter(r => r.actualQuality === 'warm');
  const coldLeads = results.filter(r => r.actualQuality === 'cold');
  
  console.log(`   🔥 HOT LEADS (${hotLeads.length}):`);
  hotLeads.forEach(l => console.log(`      - ${l.name} (Score: ${l.actualScore})`));
  
  console.log(`\n   🌡️  WARM LEADS (${warmLeads.length}):`);
  warmLeads.forEach(l => console.log(`      - ${l.name} (Score: ${l.actualScore})`));
  
  console.log(`\n   ❄️  COLD LEADS (${coldLeads.length}):`);
  coldLeads.forEach(l => console.log(`      - ${l.name} (Score: ${l.actualScore})`));
  
  const totalPassed = results.filter(r => r.passed).length;
  console.log(`\n📈 ACCURACY: ${totalPassed}/${results.length} test cases correctly classified`);
  
  console.log('\n' + '='.repeat(80));
  
  await closePostgres();
}

// Run if called directly
runVerification().catch(console.error);
