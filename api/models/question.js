"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestion = createQuestion;
exports.getQuestionsByBank = getQuestionsByBank;
exports.getQuestionById = getQuestionById;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
const db_1 = require("../db");
async function createQuestion(bankId, authorId, title, body, answer, type = 'mcq', difficulty = 'medium', attachments = null) {
    const [result] = await db_1.pool.execute(`INSERT INTO questions (bank_id, author_id, title, body, answer, type, difficulty, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [bankId, authorId, title, body, answer, type, difficulty, attachments ? JSON.stringify(attachments) : null]);
    // @ts-ignore
    return result.insertId;
}
async function getQuestionsByBank(bankId, limit = 50, offset = 0) {
    const [rows] = await db_1.pool.execute(`SELECT * FROM questions WHERE bank_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`, [bankId, limit, offset]);
    // @ts-ignore
    const items = rows.map(r => {
        try {
            r.attachments = r.attachments ? JSON.parse(r.attachments) : null;
        }
        catch (e) {
            r.attachments = null;
        }
        try {
            r.answer = r.answer ? JSON.parse(r.answer) : r.answer;
        }
        catch (e) { /* keep as-is */ }
        return r;
    });
    return items;
}
async function getQuestionById(id) {
    const [rows] = await db_1.pool.execute(`SELECT * FROM questions WHERE id = ? LIMIT 1`, [id]);
    // @ts-ignore
    const row = rows[0] || null;
    if (!row)
        return null;
    try {
        row.attachments = row.attachments ? JSON.parse(row.attachments) : null;
    }
    catch (e) {
        row.attachments = null;
    }
    try {
        row.answer = row.answer ? JSON.parse(row.answer) : row.answer;
    }
    catch (e) { /* keep as-is */ }
    return row;
}
async function updateQuestion(id, fields) {
    const sets = [];
    const vals = [];
    for (const k of Object.keys(fields)) {
        if (k === 'attachments') {
            sets.push(`${k} = ?`);
            vals.push(fields[k] ? JSON.stringify(fields[k]) : null);
        }
        else {
            sets.push(`${k} = ?`);
            vals.push(fields[k]);
        }
    }
    if (sets.length === 0)
        return;
    vals.push(id);
    const sql = `UPDATE questions SET ${sets.join(', ')} WHERE id = ?`;
    await db_1.pool.execute(sql, vals);
}
async function deleteQuestion(id) {
    await db_1.pool.execute(`DELETE FROM questions WHERE id = ?`, [id]);
}
//# sourceMappingURL=question.js.map