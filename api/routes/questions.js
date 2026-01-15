"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const question_1 = require("../models/question");
const router = express_1.default.Router();
router.get('/bank/:bankId', async (req, res) => {
    const bankId = Number(req.params.bankId);
    const { limit = '50', offset = '0' } = req.query;
    const items = await (0, question_1.getQuestionsByBank)(bankId, Number(limit), Number(offset));
    res.json({ items });
});
// recent questions across all banks
router.get('/', async (req, res) => {
    const { limit = '50', offset = '0' } = req.query;
    try {
        const [rows] = await (await Promise.resolve().then(() => __importStar(require('../db')))).pool.execute(`SELECT * FROM questions ORDER BY created_at DESC LIMIT ? OFFSET ?`, [Number(limit), Number(offset)]);
        // parse attachments + answer fields similar to model helper
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
            catch (e) { /* keep */ }
            return r;
        });
        res.json({ items });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    const { bankId, title, body, answer, type, difficulty, attachments } = req.body;
    if (!bankId || !title || !body) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const authorId = req.user?.id || null;
    const id = await (0, question_1.createQuestion)(Number(bankId), authorId, title, body, answer || null, type || 'mcq', difficulty || 'medium', attachments || null);
    res.json({ id });
});
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const q = await (0, question_1.getQuestionById)(id);
    if (!q) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.json({ question: q });
});
router.put('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const q = await (0, question_1.getQuestionById)(id);
    if (!q) {
        return res.status(404).json({ error: 'Not found' });
    }
    // only author or admin
    if (q.author_id && req.user?.id !== q.author_id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const fields = req.body;
    await (0, question_1.updateQuestion)(id, fields);
    res.json({ ok: true });
});
router.delete('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const q = await (0, question_1.getQuestionById)(id);
    if (!q) {
        return res.status(404).json({ error: 'Not found' });
    }
    if (q.author_id && req.user?.id !== q.author_id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    await (0, question_1.deleteQuestion)(id);
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=questions.js.map