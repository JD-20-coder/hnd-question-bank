"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const [usersRows] = await db_1.pool.query(`SELECT COUNT(*) as cnt FROM users`);
        const [banksRows] = await db_1.pool.query(`SELECT COUNT(*) as cnt FROM question_banks`);
        const [questionsRows] = await db_1.pool.query(`SELECT COUNT(*) as cnt FROM questions`);
        // @ts-ignore
        const users = usersRows[0].cnt;
        // @ts-ignore
        const banks = banksRows[0].cnt;
        // @ts-ignore
        const questions = questionsRows[0].cnt;
        res.json({ users, banks, questions });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});
exports.default = router;
//# sourceMappingURL=stats.js.map