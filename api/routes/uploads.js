"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, '..', '..', 'uploads');
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const fname = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
        cb(null, fname);
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file' });
    // return accessible URL
    const url = `${process.env.SERVER_BASE_URL || ''}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
});
exports.default = router;
//# sourceMappingURL=uploads.js.map