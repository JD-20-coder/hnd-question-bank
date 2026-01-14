import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded .env from', envPath);
} else {
  console.warn('⚠️ .env not found at', envPath);
}

async function run() {
  // Create connection without specifying database (so we can create it first)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log('Running', file);
    try {
      // Split SQL by ; and execute each statement separately
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        await connection.query(statement);
      }
      console.log('✅ OK', file);
    } catch (err) {
      console.error('❌ Failed', file, err);
      process.exit(1);
    }
  }

  console.log('✅ Migrations complete');
  await connection.end();
  process.exit(0);
}

run();
