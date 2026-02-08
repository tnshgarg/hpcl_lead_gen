import { setTimeout } from 'timers/promises';

const API_BASE = 'http://localhost:3000/api/v1';

async function verifyFlow() {
  console.log('Starting verification flow...');

  // 1. Submit URL
  const url = 'https://example.com';
  console.log(`Submitting URL: ${url}`);
  
  const submitRes = await fetch(`${API_BASE}/urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, sourceType: 'html', priority: 10 }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Failed to submit URL: ${submitRes.status} ${text}`);
  }

  const submitData = await submitRes.json();
  console.log('Job submitted:', submitData);

  // 2. Poll for dossier
  console.log('Polling for dossier...');
  let dossierId: string | null = null;
  const maxAttempts = 30; // 30 seconds (assuming 1s delay)
  
  for (let i = 0; i < maxAttempts; i++) {
    await setTimeout(1000);
    
    const listRes = await fetch(`${API_BASE}/dossiers?limit=1&status=review_needed`);
    if (!listRes.ok) {
        console.error(`Failed to fetch dossiers: ${listRes.status} ${await listRes.text()}`);
        continue;
    }

    const listData = await listRes.json();
    if (listData.dossiers && listData.dossiers.length > 0) {
      // Check if it's the one we just submitted (by checking recent creation time or just taking the latest)
      const latest = listData.dossiers[0];
      const created = new Date(latest.createdAt);
      if (Date.now() - created.getTime() < 60000) { // Created in last minute
         dossierId = latest.id;
         console.log('Dossier found:', latest.id);
         break;
      }
    }
    process.stdout.write('.');
  }
  process.stdout.write('\n');

  if (!dossierId) {
    throw new Error('Timeout waiting for dossier generation');
  }

  // 3. Fetch full dossier
  console.log('Fetching full dossier...');
  const dossierRes = await fetch(`${API_BASE}/dossiers/${dossierId}`);
  if (!dossierRes.ok) {
      throw new Error(`Failed to fetch dossier ${dossierId}: ${dossierRes.status}`);
  }
  
  const dossier = await dossierRes.json();
  console.log('Dossier retrieved successfully');
  console.log('Summary:', dossier.humanSummary);
  console.log('Sections:', dossier.sections.length);
  console.log('Recommendations:', dossier.recommendations.length);

  if (!dossier.sections || dossier.sections.length === 0) {
      throw new Error('Dossier has no sections');
  }
  
  console.log('VERIFICATION SUCCESSFUL');
}

verifyFlow().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
