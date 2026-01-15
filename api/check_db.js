"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function run() {
    try {
        const [rows] = await db_1.pool.query('SELECT COUNT(*) as cnt FROM users');
        console.log('users count:', rows[0].cnt);
        process.exit(0);
    }
    catch (err) {
        console.error('DB error:', err);
        process.exit(1);
    }
}
run();
//# sourceMappingURL=check_db.js.map