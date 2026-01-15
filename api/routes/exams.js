"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get all exams
router.get('/', async (req, res) => {
    try {
        const [results] = await db_1.pool.execute('SELECT * FROM exams ORDER BY created_at DESC LIMIT 100');
        res.json({ items: results });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
});
// Create exam
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { title, duration_minutes } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title required' });
        }
        const result = await db_1.pool.execute('INSERT INTO exams (title, duration_minutes, created_by) VALUES (?, ?, ?)', [title, duration_minutes || 60, req.user?.id || null]);
        res.json({ exam: { id: result[0].insertId, title, duration_minutes: duration_minutes || 60 } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create exam' });
    }
});
// Get exam details
router.get('/:id', async (req, res) => {
    try {
        const examId = Number(req.params.id);
        const [exams] = await db_1.pool.execute('SELECT * FROM exams WHERE id = ?', [examId]);
        if (!exams || exams.length === 0) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        const exam = exams[0];
        const [questions] = await db_1.pool.execute('SELECT question_id FROM exam_questions WHERE exam_id = ?', [examId]);
        exam.questions = questions.map(q => q.question_id);
        res.json({ exam });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch exam' });
    }
});
// Add questions to exam
router.post('/:id/questions', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const examId = Number(req.params.id);
        const { question_ids } = req.body;
        if (!Array.isArray(question_ids) || question_ids.length === 0) {
            return res.status(400).json({ error: 'Question IDs required' });
        }
        for (const qid of question_ids) {
            await db_1.pool.execute('INSERT IGNORE INTO exam_questions (exam_id, question_id) VALUES (?, ?)', [examId, qid]);
        }
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add questions' });
    }
});
// Remove question from exam
router.delete('/:id/questions/:qid', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const examId = Number(req.params.id);
        const questionId = Number(req.params.qid);
        await db_1.pool.execute('DELETE FROM exam_questions WHERE exam_id = ? AND question_id = ?', [examId, questionId]);
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove question' });
    }
});
// Delete exam
router.delete('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const examId = Number(req.params.id);
        // Delete questions first
        await db_1.pool.execute('DELETE FROM exam_questions WHERE exam_id = ?', [examId]);
        await db_1.pool.execute('DELETE FROM exams WHERE id = ?', [examId]);
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete exam' });
    }
});
exports.default = router;
//# sourceMappingURL=exams.js.map