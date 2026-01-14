import { pool } from "../db";

export type User = {
  id?: number;
  email: string;
  password_hash: string;
  full_name?: string;
  role?: 'student' | 'instructor' | 'admin';
  is_verified?: boolean;
};

export async function createUser(email: string, password_hash: string, full_name?: string) {
  const [result] = await pool.execute(
    `INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)`,
    [email, password_hash, full_name || null]
  );
  // @ts-ignore
  return (result as any).insertId;
}

export async function findByEmail(email: string) {
  const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
  // @ts-ignore
  return (rows as any)[0] || null;
}

export async function findById(id: number) {
  const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
  // @ts-ignore
  return (rows as any)[0] || null;
}

export async function saveRefreshToken(userId: number, token: string, expiresAt: string) {
  await pool.execute(`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`, [userId, token, expiresAt]);
}

export async function findRefreshToken(token: string) {
  const [rows] = await pool.execute(`SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`, [token]);
  // @ts-ignore
  return (rows as any)[0] || null;
}

export async function removeRefreshToken(token: string) {
  await pool.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
}

export async function updatePassword(userId: number, password_hash: string) {
  await pool.execute(`UPDATE users SET password_hash = ? WHERE id = ?`, [password_hash, userId]);
}
