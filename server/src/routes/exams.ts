import express from 'express';
import { pool } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT * FROM exams ORDER BY created_at DESC LIMIT 100');
    res.json({ items: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Create exam
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, duration_minutes } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }
    
    const result = await pool.execute(
      'INSERT INTO exams (title, duration_minutes, created_by) VALUES (?, ?, ?)',
      [title, duration_minutes || 60, req.user?.id || null]
    );
    
    res.json({ exam: { id: (result as any)[0].insertId, title, duration_minutes: duration_minutes || 60 } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Get exam details
router.get('/:id', async (req, res) => {
  try {
    const examId = Number(req.params.id);
    const [exams] = await pool.execute('SELECT * FROM exams WHERE id = ?', [examId]);
    if (!exams || (exams as any[]).length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    const exam = (exams as any[])[0];
    const [questions] = await pool.execute('SELECT question_id FROM exam_questions WHERE exam_id = ?', [examId]);
    exam.questions = (questions as any[]).map(q => q.question_id);
    
    res.json({ exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Add questions to exam
router.post('/:id/questions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const examId = Number(req.params.id);
    const { question_ids } = req.body;
    
    if (!Array.isArray(question_ids) || question_ids.length === 0) {
      return res.status(400).json({ error: 'Question IDs required' });
    }
    
    for (const qid of question_ids) {
      await pool.execute(
        'INSERT IGNORE INTO exam_questions (exam_id, question_id) VALUES (?, ?)',
        [examId, qid]
      );
    }
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add questions' });
  }
});

// Remove question from exam
router.delete('/:id/questions/:qid', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const examId = Number(req.params.id);
    const questionId = Number(req.params.qid);
    
    await pool.execute('DELETE FROM exam_questions WHERE exam_id = ? AND question_id = ?', [examId, questionId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove question' });
  }
});

// Delete exam
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const examId = Number(req.params.id);
    
    // Delete questions first
    await pool.execute('DELETE FROM exam_questions WHERE exam_id = ?', [examId]);
    await pool.execute('DELETE FROM exams WHERE id = ?', [examId]);
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

export default router;
