import express from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { createUser, findByEmail, saveRefreshToken, findRefreshToken, removeRefreshToken, updatePassword } from '../models/user';
import { sendEmail } from '../utils/sendEmail';

const router = express.Router();

const JWT_SECRET = (process.env.JWT_SECRET || 'change_this_secret') as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

function signAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

function signRefreshToken(payload: object): string {
  // use same secret for now
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES } as SignOptions);
}

import { requireFields, simpleEmailValidator } from '../middleware/validate';

router.post('/register', requireFields('email', 'password'), simpleEmailValidator('email'), async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = await createUser(email, hash, full_name);

    const accessToken = signAccessToken({ userId });
    const refreshToken = signRefreshToken({ userId });

    // store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    await saveRefreshToken(userId, refreshToken, expiresAt);

    res.json({ accessToken, refreshToken });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

router.post('/login', requireFields('email', 'password'), simpleEmailValidator('email'), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    await saveRefreshToken(user.id, refreshToken, expiresAt);

    res.json({ accessToken, refreshToken });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing refreshToken' });
  }

  const stored = await findRefreshToken(refreshToken);
  if (!stored) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as any;
    const accessToken = signAccessToken({ userId: payload.userId });
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await removeRefreshToken(refreshToken);
  }
  res.json({ ok: true });
});

// forgot password: send reset link with short-lived JWT
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }
  const user = await findByEmail(email);
  if (!user) {
    return res.status(200).json({ ok: true }); // don't reveal
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' } as SignOptions);
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  try {
    await sendEmail(email, 'Password reset', `Reset your password: ${resetUrl}`);
    res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Missing token or newPassword' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const hash = await bcrypt.hash(newPassword, 10);
    await updatePassword(payload.userId, hash);
    res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
});

export default router;
