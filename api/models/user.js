"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findByEmail = findByEmail;
exports.findById = findById;
exports.saveRefreshToken = saveRefreshToken;
exports.findRefreshToken = findRefreshToken;
exports.removeRefreshToken = removeRefreshToken;
exports.updatePassword = updatePassword;
const db_1 = require("../db");
async function createUser(email, password_hash, full_name) {
    const [result] = await db_1.pool.execute(`INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)`, [email, password_hash, full_name || null]);
    // @ts-ignore
    return result.insertId;
}
async function findByEmail(email) {
    const [rows] = await db_1.pool.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    // @ts-ignore
    return rows[0] || null;
}
async function findById(id) {
    const [rows] = await db_1.pool.execute(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
    // @ts-ignore
    return rows[0] || null;
}
async function saveRefreshToken(userId, token, expiresAt) {
    await db_1.pool.execute(`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`, [userId, token, expiresAt]);
}
async function findRefreshToken(token) {
    const [rows] = await db_1.pool.execute(`SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`, [token]);
    // @ts-ignore
    return rows[0] || null;
}
async function removeRefreshToken(token) {
    await db_1.pool.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
}
async function updatePassword(userId, password_hash) {
    await db_1.pool.execute(`UPDATE users SET password_hash = ? WHERE id = ?`, [password_hash, userId]);
}
//# sourceMappingURL=user.js.map