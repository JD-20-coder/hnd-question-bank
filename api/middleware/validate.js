"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFields = requireFields;
exports.simpleEmailValidator = simpleEmailValidator;
function requireFields(...fields) {
    return (req, res, next) => {
        for (const f of fields) {
            if (req.body[f] === undefined || req.body[f] === null) {
                return res.status(400).json({ error: `Missing field ${f}` });
            }
        }
        next();
    };
}
function simpleEmailValidator(field = 'email') {
    return (req, res, next) => {
        const val = req.body[field];
        if (!val || typeof val !== 'string' || !/^\S+@\S+\.\S+$/.test(val)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        next();
    };
}
//# sourceMappingURL=validate.js.map