"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed() {
    console.log('Seeding...');
    const conn = db_1.pool;
    // create a sample admin and user
    const adminPass = await bcrypt_1.default.hash('Admin123!', 10);
    const userPass = await bcrypt_1.default.hash('Student123!', 10);
    await conn.query(`INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (1,'admin@hnd.local',?, 'Admin User','admin', true)`, [adminPass]);
    await conn.query(`INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (2,'student@hnd.local',?, 'Student User','student', true)`, [userPass]);
    // create a sample bank
    const [res] = await conn.query(`SELECT id FROM question_banks WHERE title = 'Sample Bank' LIMIT 1`);
    // @ts-ignore
    if (res.length === 0) {
        await conn.query(`INSERT INTO question_banks (title, description, owner_id) VALUES ('Sample Bank','A sample bank for testing',1)`);
    }
    // add questions
    const [q] = await conn.query(`SELECT id FROM questions WHERE title = 'Sample Question' LIMIT 1`);
    // @ts-ignore
    if (q.length === 0) {
        // get bank id
        const [b] = await conn.query(`SELECT id FROM question_banks WHERE title = 'Sample Bank' LIMIT 1`);
        // @ts-ignore
        const bankId = b[0].id;
        await conn.query(`INSERT INTO questions (bank_id, author_id, title, body, answer, type, difficulty) VALUES (?,?,?,?,?,?,?)`, [bankId, 1, 'Sample Question', 'What is 2+2?', '4', 'short', 'easy']);
    }
    console.log('Seed complete');
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=seed.js.map