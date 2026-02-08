/**
 * Quick signal detection test - no AI calls
 */

import { 
  loadHPCLConfig, 
  detectIndustries, 
  detectSignalConfidence,
} from '../config/hpcl-config.js';

const TEST_CASES = [
  {
    name: 'Cement Tender (should be HIGH)',
    expected: 'high',
    text: `TENDER NOTICE - UltraTech Cement Limited invites bids for supply of Furnace Oil. Last Date for Submission: 28th Feb.`
  },
  {
    name: 'Steel Expansion (should be MEDIUM)',
    expected: 'medium',
    text: `JSW Steel announces expansion at Vijayanagar. Rs 15000 crore investment for new blast furnace. 3 MTPA capacity addition by Q4 FY2027.`
  },
  {
    name: 'NHAI RFQ (should be HIGH)',
    expected: 'high',
    text: `Request for Quotation for supply of Bitumen. RFQ Reference: NHAI/2026/1234. Bid Submission Deadline: 15th March.`
  },
  {
    name: 'Edible Oil Company (should be MEDIUM or LOW)',
    expected: 'medium',
    text: `Adani Wilmar announces expansion at Mundra facility. New solvent extraction plant with 500 TPD capacity under construction.`
  },
  {
    name: 'Shipping Fleet Update (should be LOW or null)',
    expected: 'low',
    text: `SCI fleet size increases to 60 vessels. Our facilities across Mumbai and Chennai ports. Interested suppliers may contact.`
  },
  {
    name: 'Generic News (should be null)',
    expected: null,
    text: `India industrial sector growth in Q3. Manufacturing activities picking up across sectors.`
  },
];

console.log('\n🔍 SIGNAL DETECTION TEST (No AI)\n');
console.log('Testing updated keywords from hpcl-products.json...\n');

// Show the loaded keywords
const config = loadHPCLConfig();
console.log('HIGH confidence keywords (sample):', config.signalTaxonomy.high_confidence.keywords.slice(0, 5).join(', '));
console.log('MEDIUM confidence keywords (sample):', config.signalTaxonomy.medium_confidence.keywords.slice(0, 5).join(', '));
console.log('');

let passed = 0;
for (const test of TEST_CASES) {
  const detected = detectSignalConfidence(test.text);
  const industries = detectIndustries(test.text);
  const isCorrect = detected === test.expected || 
    (test.expected === 'medium' && (detected === 'medium' || detected === 'low')) ||
    (test.expected === 'low' && (detected === 'low' || detected === null));
  const status = isCorrect ? '✅' : '❌';
  
  console.log(`${status} ${test.name}`);
  console.log(`   Signal: ${detected || 'null'} (expected: ${test.expected || 'null'})`);
  console.log(`   Industries: ${industries.join(', ') || 'None'}`);
  console.log('');
  
  if (isCorrect) passed++;
}

console.log(`Result: ${passed}/${TEST_CASES.length} passed\n`);
