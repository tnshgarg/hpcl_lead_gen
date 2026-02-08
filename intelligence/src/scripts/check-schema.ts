import pg from '../../node_modules/@types/pg/index.js';

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'web_intelligence',
  user: process.env.POSTGRES_USER || 'wil',
  password: process.env.POSTGRES_PASSWORD || 'wil_secure_password',
});

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check documents table columns
    const documentsColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'documents'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Documents Table Columns:');
    documentsColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    const requiredDocColumns = ['title', 'description', 'language', 'word_count', 'hash'];
    const existingDocColumns = documentsColumns.rows.map(r => r.column_name);
    const missingDocColumns = requiredDocColumns.filter(c => !existingDocColumns.includes(c));
    
    if (missingDocColumns.length > 0) {
      console.log(`\n❌ Missing columns in documents: ${missingDocColumns.join(', ')}`);
    } else {
      console.log('\n✅ All required columns exist in documents table');
    }

    // Check if feedback table exists
    const feedbackExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'feedback'
      )
    `);
    
    if (feedbackExists.rows[0].exists) {
      console.log('✅ feedback table exists');
    } else {
      console.log('❌ feedback table MISSING');
    }

    // Check migrations table
    const migrations = await pool.query(`
      SELECT id, executed_at FROM migrations ORDER BY executed_at
    `);
    
    console.log('\n📋 Applied Migrations:');
    migrations.rows.forEach(row => {
      console.log(`   - ${row.id}`);
    });

    // Get queue status via Redis (if available)
    console.log('\n📋 Database Counts:');
    
    const docCount = await pool.query('SELECT COUNT(*) FROM documents');
    console.log(`   - Documents: ${docCount.rows[0].count}`);
    
    const leadCount = await pool.query('SELECT COUNT(*) FROM leads');
    console.log(`   - Leads: ${leadCount.rows[0].count}`);
    
    const dossierCount = await pool.query('SELECT COUNT(*) FROM dossiers');
    console.log(`   - Dossiers: ${dossierCount.rows[0].count}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
