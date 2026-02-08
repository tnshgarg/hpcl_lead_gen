import pg from 'pg';

const config = {
  host: '127.0.0.1', // Force IPv4
  port: 5432,
  database: 'web_intelligence',
  user: 'wil',
  password: 'wil_secure_password',
};

async function checkSpecificHost() {
  console.log(`Testing connection to ${config.host}:${config.port}...`);
  const pool = new pg.Pool(config);

  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'documents' 
      AND column_name IN ('title', 'hash')
    `);

    console.log('Columns found on 127.0.0.1:', res.rows.map(r => r.column_name));
    
    if (res.rows.length !== 2) {
      console.log('❌ MISSING COLUMNS on 127.0.0.1');
    } else {
      console.log('✅ Columns exist on 127.0.0.1');
    }

  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

checkSpecificHost();
