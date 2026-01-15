"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBank = createBank;
exports.getBanks = getBanks;
exports.getBankById = getBankById;
exports.updateBank = updateBank;
exports.deleteBank = deleteBank;
const db_1 = require("../db");
async function createBank(title, description, ownerId) {
    const [result] = await db_1.pool.execute(`INSERT INTO question_banks (title, description, owner_id) VALUES (?, ?, ?)`, [title, description, ownerId]);
    // @ts-ignore
    return result.insertId;
}
async function getBanks(limit = 20, offset = 0) {
    const sql = `
    SELECT qb.*, IFNULL(qc.cnt, 0) AS questions_count
    FROM question_banks qb
    LEFT JOIN (
      SELECT bank_id, COUNT(*) as cnt FROM questions GROUP BY bank_id
    ) qc ON qc.bank_id = qb.id
    ORDER BY qb.created_at DESC
    LIMIT ? OFFSET ?
  `;
    const [rows] = await db_1.pool.execute(sql, [limit, offset]);
    // @ts-ignore
    return rows;
}
async function getBankById(id) {
    const sql = `
    SELECT qb.*, IFNULL(qc.cnt, 0) AS questions_count
    FROM question_banks qb
    LEFT JOIN (
      SELECT bank_id, COUNT(*) as cnt FROM questions GROUP BY bank_id
    ) qc ON qc.bank_id = qb.id
    WHERE qb.id = ? LIMIT 1
  `;
    const [rows] = await db_1.pool.execute(sql, [id]);
    // @ts-ignore
    return rows[0] || null;
}
async function updateBank(id, title, description) {
    await db_1.pool.execute(`UPDATE question_banks SET title = ?, description = ? WHERE id = ?`, [title, description, id]);
}
async function deleteBank(id) {
    await db_1.pool.execute(`DELETE FROM question_banks WHERE id = ?`, [id]);
}
//# sourceMappingURL=questionBank.js.map