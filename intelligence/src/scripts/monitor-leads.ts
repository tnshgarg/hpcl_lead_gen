
import { query, initPostgres, closePostgres } from '../db/postgres.js';

const SESSION_ID = 'hpcl-1770495861264';

async function main() {
  await initPostgres();
  
  console.log(`Monitoring leads for session: ${SESSION_ID}`);
  console.log('Press Ctrl+C to stop.\n');
  
  while (true) {
    const leadResult = await query<{ count: string }>(`
      SELECT COUNT(*) as count 
      FROM leads 
      WHERE metadata->>'hpclSessionId' = $1
    `, [SESSION_ID]);

    const docResult = await query<{ count: string }>(`
      SELECT COUNT(*) as count 
      FROM documents 
      WHERE metadata->>'hpclSessionId' = $1
    `, [SESSION_ID]);
    
    const leadCount = parseInt(leadResult.rows[0].count, 10);
    const docCount = parseInt(docResult.rows[0].count, 10);
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`[${timestamp}] Documents: ${docCount}, Leads: ${leadCount}`);
    
    if (leadCount >= 50) {
      console.log('\n✅ Reached 50 leads!');
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  await closePostgres();
}

main().catch(console.error);
