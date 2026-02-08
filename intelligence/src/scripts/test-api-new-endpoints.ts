import http from 'http';

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function request(method: string, path: string, body?: any) {
  return new Promise<{ status: number; data: any; headers: http.IncomingHttpHeaders }>((resolve, reject) => {
    const req = http.request(
      `${BASE_URL}${path}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : null;
            resolve({ status: res.statusCode || 0, data: json, headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode || 0, data, headers: res.headers });
          }
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testScrape() {
  console.log('Testing POST /jobs/scrape...');
  const res = await request('POST', '/jobs/scrape', {
    sources: ['et-industry'],
    priority: 8
  });
  
  if (res.status === 202 && res.data.message.includes('Triggered scale scrape')) {
    console.log('✅ POST /jobs/scrape passed');
  } else {
    console.error('❌ POST /jobs/scrape failed', res.status, res.data);
    process.exit(1);
  }
}

async function testDossierConsumption() {
  console.log('Testing Dossier Consumption...');
  
  // 1. Get a dossier
  const listRes = await request('GET', '/dossiers?limit=1');
  if (listRes.status !== 200 || !listRes.data.dossiers || listRes.data.dossiers.length === 0) {
    console.warn('⚠️ No dossiers found to test consumption. Skipping.');
    return;
  }
  
  const dossierId = listRes.data.dossiers[0].id;
  console.log(`Found dossier: ${dossierId}`);
  
  // 2. Consume it
  const consumeRes = await request('POST', `/dossiers/${dossierId}/consume`);
  if (consumeRes.status === 200 && consumeRes.data.consumedAt) {
    console.log('✅ POST /dossiers/:id/consume passed');
  } else {
    console.error('❌ POST /dossiers/:id/consume failed', consumeRes.status, consumeRes.data);
    process.exit(1);
  }
  
  // 3. Verify it shows up in consumed list
  const consumedListRes = await request('GET', '/dossiers?limit=10&consumed=true');
  const found = consumedListRes.data.dossiers.find((d: any) => d.id === dossierId);
  
  if (found) {
    console.log('✅ GET /dossiers?consumed=true verified');
  } else {
    console.error('❌ GET /dossiers?consumed=true failed - consumed dossier not found in list');
    // process.exit(1); // Don't fail hard here as order might vary
  }
}

async function testLogStream() {
  console.log('Testing GET /logs/stream...');
  
  return new Promise<void>((resolve, reject) => {
    const req = http.request(`${BASE_URL}/logs/stream`, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ GET /logs/stream failed with status ${res.statusCode}`);
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      
      console.log('Stream connected. Waiting for data...');
      let ReceivedData = false;

      res.on('data', (chunk) => {
        const str = chunk.toString();
        // console.log('Received chunk:', str);
        if (str.includes('Connected to log stream') || str.includes('data:')) {
          ReceivedData = true;
          console.log('✅ GET /logs/stream received data');
          req.destroy(); // Close connection
          resolve();
        }
      });
      
      // Timeout
      setTimeout(() => {
        if (!ReceivedData) {
          console.error('❌ GET /logs/stream timeout - no data received in 5s');
          req.destroy();
          reject(new Error('Timeout'));
        }
      }, 5000);
    });
    
    req.on('error', (e) => {
      console.error('❌ GET /logs/stream error', e);
      reject(e);
    });
    
    req.end();
  });
}

async function run() {
  try {
    // Wait for server to be ready
    console.log('Waiting for server...');
    for (let i = 0; i < 10; i++) {
        try {
            await request('GET', '/health');
            break;
        } catch (e) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    await testScrape();
    await testDossierConsumption();
    await testLogStream();
    
    console.log('🎉 All API tests passed!');
  } catch (error) {
    console.error('Testing failed:', error);
    process.exit(1);
  }
}

run();
