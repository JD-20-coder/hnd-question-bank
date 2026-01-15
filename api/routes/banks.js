"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const questionBank_1 = require("../models/questionBank");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const { limit = '20', offset = '0' } = req.query;
    const items = await (0, questionBank_1.getBanks)(Number(limit), Number(offset));
    res.json({ items });
});
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Missing title' });
    }
    const ownerId = req.user?.id || null;
    const id = await (0, questionBank_1.createBank)(title, description || null, ownerId);
    res.json({ id });
});
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const bank = await (0, questionBank_1.getBankById)(id);
    if (!bank) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.json({ bank });
});
router.put('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const bank = await (0, questionBank_1.getBankById)(id);
    if (!bank) {
        return res.status(404).json({ error: 'Not found' });
    }
    // simple ownership check (owner or admin)
    if (bank.owner_id && req.user?.id !== bank.owner_id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, description } = req.body;
    await (0, questionBank_1.updateBank)(id, title || bank.title, description || bank.description);
    res.json({ ok: true });
});
router.delete('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const bank = await (0, questionBank_1.getBankById)(id);
    if (!bank) {
        return res.status(404).json({ error: 'Not found' });
    }
    if (bank.owner_id && req.user?.id !== bank.owner_id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    await (0, questionBank_1.deleteBank)(id);
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=banks.js.map