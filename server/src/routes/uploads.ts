import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fname = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, fname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  // return accessible URL
  const url = `${process.env.SERVER_BASE_URL || ''}/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

export default router;
