import { pool } from './db';

async function run() {
  try {
    const [rows]: any = await pool.query('SELECT COUNT(*) as cnt FROM users');
    console.log('users count:', rows[0].cnt);
    process.exit(0);
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
}

run();
