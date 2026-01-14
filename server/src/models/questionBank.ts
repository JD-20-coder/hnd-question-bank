import { pool } from "../db";

export async function createBank(title: string, description: string | null, ownerId: number | null) {
  const [result] = await pool.execute(`INSERT INTO question_banks (title, description, owner_id) VALUES (?, ?, ?)`,[title, description, ownerId]);
  // @ts-ignore
  return (result as any).insertId;
}

export async function getBanks(limit = 20, offset = 0) {
  const sql = `
    SELECT qb.*, IFNULL(qc.cnt, 0) AS questions_count
    FROM question_banks qb
    LEFT JOIN (
      SELECT bank_id, COUNT(*) as cnt FROM questions GROUP BY bank_id
    ) qc ON qc.bank_id = qb.id
    ORDER BY qb.created_at DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.execute(sql, [limit, offset]);
  // @ts-ignore
  return rows as any[];
}

export async function getBankById(id: number) {
  const sql = `
    SELECT qb.*, IFNULL(qc.cnt, 0) AS questions_count
    FROM question_banks qb
    LEFT JOIN (
      SELECT bank_id, COUNT(*) as cnt FROM questions GROUP BY bank_id
    ) qc ON qc.bank_id = qb.id
    WHERE qb.id = ? LIMIT 1
  `;
  const [rows] = await pool.execute(sql, [id]);
  // @ts-ignore
  return (rows as any)[0] || null;
}

export async function updateBank(id: number, title: string, description: string | null) {
  await pool.execute(`UPDATE question_banks SET title = ?, description = ? WHERE id = ?`, [title, description, id]);
}

export async function deleteBank(id: number) {
  await pool.execute(`DELETE FROM question_banks WHERE id = ?`, [id]);
}
