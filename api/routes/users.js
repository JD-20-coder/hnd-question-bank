"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const user_1 = require("../models/user");
const router = express_1.default.Router();
router.get('/me', authMiddleware_1.authMiddleware, async (req, res) => {
    const user = await (0, user_1.findById)(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'Not found' });
    }
    // hide sensitive fields
    delete user.password_hash;
    res.json({ user });
});
router.get('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const user = await (0, user_1.findById)(id);
    if (!user) {
        return res.status(404).json({ error: 'Not found' });
    }
    delete user.password_hash;
    res.json({ user });
});
exports.default = router;
//# sourceMappingURL=users.js.map