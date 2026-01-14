import { pool } from "../db";

export async function createQuestion(bankId: number, authorId: number | null, title: string, body: string, answer: string | null, type = 'mcq', difficulty = 'medium', attachments: any = null){
  const [result] = await pool.execute(`INSERT INTO questions (bank_id, author_id, title, body, answer, type, difficulty, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [bankId, authorId, title, body, answer, type, difficulty, attachments ? JSON.stringify(attachments) : null]);
  // @ts-ignore
  return (result as any).insertId;
}

export async function getQuestionsByBank(bankId: number, limit = 50, offset = 0){
  const [rows] = await pool.execute(`SELECT * FROM questions WHERE bank_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`, [bankId, limit, offset]);
  // @ts-ignore
  const items = (rows as any[]).map(r => {
    try{ r.attachments = r.attachments ? JSON.parse(r.attachments) : null; }catch(e){ r.attachments = null; }
    try{ r.answer = r.answer ? JSON.parse(r.answer) : r.answer; }catch(e){ /* keep as-is */ }
    return r;
  });
  return items;
}

export async function getQuestionById(id: number){
  const [rows] = await pool.execute(`SELECT * FROM questions WHERE id = ? LIMIT 1`, [id]);
  // @ts-ignore
  const row = (rows as any)[0] || null;
  if (!row) return null;
  try{ row.attachments = row.attachments ? JSON.parse(row.attachments) : null; }catch(e){ row.attachments = null; }
  try{ row.answer = row.answer ? JSON.parse(row.answer) : row.answer; }catch(e){ /* keep as-is */ }
  return row;
}

export async function updateQuestion(id: number, fields: any){
  const sets: string[] = [];
  const vals: any[] = [];
  for (const k of Object.keys(fields)){
    if (k === 'attachments'){
      sets.push(`${k} = ?`);
      vals.push(fields[k] ? JSON.stringify(fields[k]) : null);
    } else {
      sets.push(`${k} = ?`);
      vals.push((fields as any)[k]);
    }
  }
  if (sets.length === 0) return;
  vals.push(id);
  const sql = `UPDATE questions SET ${sets.join(', ')} WHERE id = ?`;
  await pool.execute(sql, vals);
}

export async function deleteQuestion(id: number){
  await pool.execute(`DELETE FROM questions WHERE id = ?`, [id]);
}
