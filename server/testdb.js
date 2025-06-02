import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  database: 'postgres',
  password: 'shashipreetham',  // <- must match what Supabase gave you
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected! Server time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
})();
