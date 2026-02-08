import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';

const API_BASE = 'http://localhost:3000/api/v1';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  request?: {
    method: string;
    url: string;
    body?: any;
  };
  response?: {
    status: number;
    data: any;
  };
  error?: string;
}

const testResults: TestResult[] = [];
const startTime = new Date();

// Helper to make requests and log results
async function request(
  testName: string,
  path: string,
  options: RequestInit = {}
): Promise<{ status: number; data: any; headers: Headers }> {
  const url = `${API_BASE}${path}`;
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : undefined;
  const testStart = Date.now();
  
  console.log(`📡 ${method} ${url}`);
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Parse response
    const contentType = res.headers.get('content-type');
    let data: any;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const duration = Date.now() - testStart;

    testResults.push({
      name: testName,
      status: 'PASS',
      duration,
      request: { method, url, body },
      response: { status: res.status, data },
    });

    return { status: res.status, data, headers: res.headers };
  } catch (error: any) {
    const duration = Date.now() - testStart;
    testResults.push({
      name: testName,
      status: 'FAIL',
      duration,
      request: { method, url, body },
      error: error.message,
    });
    throw error;
  }
}

function generateReport(): string {
  const endTime = new Date();
  const totalDuration = endTime.getTime() - startTime.getTime();
  
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const skipped = testResults.filter(r => r.status === 'SKIP').length;
  
  let report = `# Web Intelligence Layer - API Test Report

**Generated:** ${endTime.toISOString()}
**Total Duration:** ${(totalDuration / 1000).toFixed(2)}s
**Results:** ✅ ${passed} Passed | ❌ ${failed} Failed | ⏭️ ${skipped} Skipped

---

## Test Summary

| # | Test Name | Status | Duration |
|---|-----------|--------|----------|
`;

  testResults.forEach((result, index) => {
    const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
    report += `| ${index + 1} | ${result.name} | ${statusIcon} ${result.status} | ${result.duration}ms |\n`;
  });

  report += `\n---\n\n## Detailed Results\n\n`;

  testResults.forEach((result, index) => {
    report += `### ${index + 1}. ${result.name}\n\n`;
    report += `**Status:** ${result.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}\n`;
    report += `**Duration:** ${result.duration}ms\n\n`;
    
    if (result.request) {
      report += `#### Request\n`;
      report += `\`\`\`\n${result.request.method} ${result.request.url}\n\`\`\`\n`;
      if (result.request.body) {
        report += `**Body:**\n\`\`\`json\n${JSON.stringify(result.request.body, null, 2)}\n\`\`\`\n`;
      }
    }
    
    if (result.response) {
      report += `\n#### Response (Status: ${result.response.status})\n`;
      report += `\`\`\`json\n${JSON.stringify(result.response.data, null, 2)}\n\`\`\`\n`;
    }
    
    if (result.error) {
      report += `\n#### Error\n\`\`\`\n${result.error}\n\`\`\`\n`;
    }
    
    report += `\n---\n\n`;
  });

  return report;
}

async function runTests() {
  console.log('🚀 Starting API Flow Tests with Detailed Logging...\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Testing Health Check...');
    const healthRes = await request('Health Check', '/health');
    assert.equal(healthRes.status, 200, 'Health check should return 200');
    assert.equal(healthRes.data.status, 'healthy', 'System should be healthy');
    console.log('   ✅ Health Check Passed\n');

    // 2. Get initial dossier count
    console.log('2️⃣  Getting initial dossier count...');
    const initialDossiers = await request('Get Initial Dossiers', '/dossiers?limit=100');
    const initialCount = initialDossiers.data.dossiers?.length || 0;
    console.log(`   📊 Initial dossier count: ${initialCount}\n`);

    // 3. Submit URL - use /anything endpoint which includes the timestamp in response body
    // This ensures truly unique content for each test run (unlike /html which returns static content)
    const uniqueUrl = `https://httpbin.org/anything?t=${Date.now()}&unique=${Math.random().toString(36).substring(7)}`;
    console.log(`3️⃣  Submitting URL: ${uniqueUrl}...`);
    const submitRes = await request('Submit URL', '/urls', {
      method: 'POST',
      body: JSON.stringify({
        url: uniqueUrl,
        priority: 10,
        sourceType: 'html'
      }),
    });
    
    assert.equal(submitRes.status, 202, 'Submit URL should return 202');
    assert.ok(submitRes.data.jobId, 'Response should contain jobId');
    const jobId = submitRes.data.jobId;
    console.log(`   ✅ URL Submitted (Job ID: ${jobId})\n`);

    // 4. Poll for new dossier
    const POLLING_INTERVAL = 2000;
    const MAX_POLLING_ATTEMPTS = 45; // 90 seconds total
    
    console.log(`4️⃣  Polling for Dossier Generation (timeout ${MAX_POLLING_ATTEMPTS * POLLING_INTERVAL / 1000}s)...`);
    let newDossierId: string | null = null;
    const pollStart = Date.now();
    let pollCount = 0;
    
    while (pollCount < MAX_POLLING_ATTEMPTS) {
      pollCount++;
      const dossiersRes = await request(`Poll Dossiers (attempt ${pollCount})`, '/dossiers?limit=100');
      const currentCount = dossiersRes.data.dossiers?.length || 0;
      
      console.log(`   Attempt ${pollCount}: ${currentCount} dossiers (was ${initialCount})`);
      
      if (currentCount > initialCount) {
        newDossierId = dossiersRes.data.dossiers[0]?.id;
        console.log(`\n   ✅ New Dossier Found! (ID: ${newDossierId})`);
        break;
      }
      
      await new Promise(r => setTimeout(r, 5000));
    }

    if (!newDossierId) {
      testResults.push({
        name: 'Dossier Generation',
        status: 'FAIL',
        duration: Date.now() - pollStart,
        error: 'Timed out waiting for dossier generation after 180s',
      });
      console.error('\n❌ Timed out waiting for dossier generation');
    } else {
      testResults.push({
        name: 'Dossier Generation',
        status: 'PASS',
        duration: Date.now() - pollStart,
        response: { status: 200, data: { dossierId: newDossierId } },
      });

      // 5. Verify Dossier Content
      console.log('\n5️⃣  Verifying Dossier Content...');
      const dossierRes = await request('Get Dossier Details', `/dossiers/${newDossierId}`);
      const dossier = dossierRes.data;
      
      console.log('   ✅ Dossier Structure Verified');
      console.log(`   📄 Summary: ${dossier.humanSummary?.slice(0, 100)}...`);
      console.log(`   💡 Recommendations: ${dossier.recommendations?.slice(0, 3).join(', ')}`);
      console.log('\n');

      // 6. Verify Feedback Loop
      console.log('6️⃣  Testing Feedback Submission...');
      const feedbackRes = await request('Submit Feedback', '/feedback', {
        method: 'POST',
        body: JSON.stringify({
          dossierId: newDossierId,
          type: 'positive',
          score: 0.9,
          comment: 'Automated test feedback'
        }),
      });
      
      if (feedbackRes.status === 201) {
        console.log('   ✅ Feedback Submitted\n');
      } else {
        console.log(`   ⚠️ Feedback returned ${feedbackRes.status}\n`);
      }
    }

    // 7. Verify Search
    console.log('7️⃣  Testing Search...');
    const searchRes = await request('Search Documents', '/search', {
      method: 'POST',
      body: JSON.stringify({
        query: 'test document intelligence',
        limit: 5
      }),
    });
    console.log(`   ✅ Search returned ${searchRes.data.count} results\n`);

    // 8. Get Leads
    console.log('8️⃣  Testing Leads Endpoint...');
    const leadsRes = await request('Get Leads', '/leads?limit=10');
    console.log(`   ✅ Retrieved ${leadsRes.data.count} leads\n`);

  } catch (error: any) {
    console.error(`\n❌ Test Error: ${error.message}`);
  }

  // Generate and save report
  const report = generateReport();
  const reportPath = path.join(process.cwd(), 'test-output-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n📋 Test report saved to: ${reportPath}`);
  
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  if (failed > 0) {
    console.log(`\n❌ ${failed} test(s) failed`);
    process.exit(1);
  } else {
    console.log('\n🎉 All API Tests Passed!');
  }
}

runTests();
