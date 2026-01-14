import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { findById } from '../models/user';

const router = express.Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  const user = await findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }
  // hide sensitive fields
  delete user.password_hash;
  res.json({ user });
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const user = await findById(id);
  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }
  delete user.password_hash;
  res.json({ user });
});

export default router;
