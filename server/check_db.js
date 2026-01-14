const mysql = require('mysql2/promise');
const host = process.env.DB_HOST || '127.0.0.1';
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'hnd_question_bank';
(async ()=>{
  try{
    const pool = mysql.createPool({ host, port, user, password, database, connectionLimit: 5 });
    const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM users');
    console.log('users count:', rows[0].cnt);
    await pool.end();
    process.exit(0);
  }catch(err){
    console.error('DB error:', err.message || err);
    process.exit(1);
  }
})();
