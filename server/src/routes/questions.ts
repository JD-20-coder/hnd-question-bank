import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { createQuestion, getQuestionsByBank, getQuestionById, updateQuestion, deleteQuestion } from '../models/question';

const router = express.Router();

router.get('/bank/:bankId', async (req, res) => {
  const bankId = Number(req.params.bankId);
  const { limit = '50', offset = '0' } = req.query as any;
  const items = await getQuestionsByBank(bankId, Number(limit), Number(offset));
  res.json({ items });
});

// recent questions across all banks
router.get('/', async (req, res) => {
  const { limit = '50', offset = '0' } = req.query as any;
  try{
    const [rows] = await (await import('../db')).pool.execute(`SELECT * FROM questions ORDER BY created_at DESC LIMIT ? OFFSET ?`, [Number(limit), Number(offset)]);
    // parse attachments + answer fields similar to model helper
    // @ts-ignore
    const items = (rows as any[]).map(r => {
      try{ r.attachments = r.attachments ? JSON.parse(r.attachments) : null; }catch(e){ r.attachments = null; }
      try{ r.answer = r.answer ? JSON.parse(r.answer) : r.answer; }catch(e){ /* keep */ }
      return r;
    });
    res.json({ items });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { bankId, title, body, answer, type, difficulty, attachments } = req.body;
  if (!bankId || !title || !body) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const authorId = req.user?.id || null;
  const id = await createQuestion(Number(bankId), authorId, title, body, answer || null, type || 'mcq', difficulty || 'medium', attachments || null);
  res.json({ id });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const q = await getQuestionById(id);
  if (!q) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ question: q });
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const q = await getQuestionById(id);
  if (!q) {
    return res.status(404).json({ error: 'Not found' });
  }
  // only author or admin
  if (q.author_id && req.user?.id !== q.author_id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const fields = req.body;
  await updateQuestion(id, fields);
  res.json({ ok: true });
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const q = await getQuestionById(id);
  if (!q) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (q.author_id && req.user?.id !== q.author_id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await deleteQuestion(id);
  res.json({ ok: true });
});

export default router;
