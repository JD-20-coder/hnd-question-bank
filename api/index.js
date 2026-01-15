"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const banks_1 = __importDefault(require("./routes/banks"));
const questions_1 = __importDefault(require("./routes/questions"));
const users_1 = __importDefault(require("./routes/users"));
const stats_1 = __importDefault(require("./routes/stats"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const exams_1 = __importDefault(require("./routes/exams"));
const public_1 = __importDefault(require("./routes/public"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => res.json({ message: "HND Question Bank API" }));
// PUBLIC ROUTES - No authentication required
app.use('/api/public', public_1.default);
// PROTECTED ROUTES - Require authentication
app.use('/api/auth', auth_1.default);
app.use('/api/banks', banks_1.default);
app.use('/api/questions', questions_1.default);
app.use('/api/users', users_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/uploads', uploads_1.default);
app.use('/api/exams', exams_1.default);
// serve uploaded static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// serve client build in production (if present)
const clientDist = path_1.default.join(__dirname, '..', '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(clientDist));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(clientDist, 'index.html'));
    });
}
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});
// export app for testing; only start server when run directly
if (require.main === module) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map