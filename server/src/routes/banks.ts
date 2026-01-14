import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { createBank, getBanks, getBankById, updateBank, deleteBank } from '../models/questionBank';

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = '20', offset = '0' } = req.query as any;
  const items = await getBanks(Number(limit), Number(offset));
  res.json({ items });
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Missing title' });
  }
  const ownerId = req.user?.id || null;
  const id = await createBank(title, description || null, ownerId);
  res.json({ id });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const bank = await getBankById(id);
  if (!bank) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ bank });
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const bank = await getBankById(id);
  if (!bank) {
    return res.status(404).json({ error: 'Not found' });
  }
  // simple ownership check (owner or admin)
  if (bank.owner_id && req.user?.id !== bank.owner_id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { title, description } = req.body;
  await updateBank(id, title || bank.title, description || bank.description);
  res.json({ ok: true });
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const bank = await getBankById(id);
  if (!bank) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (bank.owner_id && req.user?.id !== bank.owner_id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await deleteBank(id);
  res.json({ ok: true });
});

export default router;
