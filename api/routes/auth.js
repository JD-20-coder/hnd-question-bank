"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const sendEmail_1 = require("../utils/sendEmail");
const router = express_1.default.Router();
const JWT_SECRET = (process.env.JWT_SECRET || 'change_this_secret');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function signRefreshToken(payload) {
    // use same secret for now
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}
const validate_1 = require("../middleware/validate");
router.post('/register', (0, validate_1.requireFields)('email', 'password'), (0, validate_1.simpleEmailValidator)('email'), async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        const existing = await (0, user_1.findByEmail)(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        const userId = await (0, user_1.createUser)(email, hash, full_name);
        const accessToken = signAccessToken({ userId });
        const refreshToken = signRefreshToken({ userId });
        // store refresh token
        const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await (0, user_1.saveRefreshToken)(userId, refreshToken, expiresAt);
        res.json({ accessToken, refreshToken });
    }
    catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: err.message || 'Registration failed' });
    }
});
router.post('/login', (0, validate_1.requireFields)('email', 'password'), (0, validate_1.simpleEmailValidator)('email'), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, user_1.findByEmail)(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const ok = await bcrypt_1.default.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const accessToken = signAccessToken({ userId: user.id });
        const refreshToken = signRefreshToken({ userId: user.id });
        const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await (0, user_1.saveRefreshToken)(user.id, refreshToken, expiresAt);
        res.json({ accessToken, refreshToken });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message || 'Login failed' });
    }
});
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refreshToken' });
    }
    const stored = await (0, user_1.findRefreshToken)(refreshToken);
    if (!stored) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
        const accessToken = signAccessToken({ userId: payload.userId });
        res.json({ accessToken });
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});
router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        await (0, user_1.removeRefreshToken)(refreshToken);
    }
    res.json({ ok: true });
});
// forgot password: send reset link with short-lived JWT
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    }
    const user = await (0, user_1.findByEmail)(email);
    if (!user) {
        return res.status(200).json({ ok: true }); // don't reveal
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    try {
        await (0, sendEmail_1.sendEmail)(email, 'Password reset', `Reset your password: ${resetUrl}`);
        res.json({ ok: true });
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to send email' });
    }
});
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Missing token or newPassword' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const hash = await bcrypt_1.default.hash(newPassword, 10);
        await (0, user_1.updatePassword)(payload.userId, hash);
        res.json({ ok: true });
    }
    catch (err) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map