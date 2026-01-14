import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);
console.log('.env exists:', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin',
    });
    console.log('✅ Connection successful!');
    console.log(`Connected to ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USER}`);
    await connection.end();
  } catch (err) {
    console.log('❌ Connection failed!');
    console.log('Error:', (err as any).message);
    console.log(`Attempted: ${process.env.DB_HOST}:${process.env.DB_PORT} user=${process.env.DB_USER}`);
  }
}

testConnection();
