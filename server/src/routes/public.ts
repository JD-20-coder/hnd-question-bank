import express from 'express';
import { pool } from '../db';

const router = express.Router();

/**
 * PUBLIC ROUTES - No authentication required
 * These endpoints allow visitors to browse and search questions
 */

// Get all fields of study (categories)
router.get('/fields', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT DISTINCT field_of_study 
      FROM question_banks 
      WHERE is_public = true
      ORDER BY field_of_study ASC
    `);
    res.json({ fields: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fields' });
  }
});

// Get question banks by field of study
router.get('/banks/by-field/:field', async (req, res) => {
  try {
    const { field } = req.params;
    const { limit = '20', offset = '0' } = req.query as any;
    
    const [rows] = await pool.execute(`
      SELECT id, title, description, field_of_study, question_count
      FROM question_banks 
      WHERE is_public = true 
      AND field_of_study = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [field, Number(limit), Number(offset)]);
    
    res.json({ banks: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

// Get public questions with search and filter
router.get('/questions/search', async (req, res) => {
  try {
    const { 
      q = '', 
      field = '', 
      type = '', 
      difficulty = '',
      limit = '50', 
      offset = '0' 
    } = req.query as any;
    
    let query = `
      SELECT q.id, q.title, q.body, q.type, q.difficulty, 
             qb.field_of_study, qb.title as bank_title,
             q.created_at
      FROM questions q
      JOIN question_banks qb ON q.bank_id = qb.id
      WHERE qb.is_public = true
    `;
    
    const params: any[] = [];
    
    if (q) {
      query += ` AND (q.title LIKE ? OR q.body LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }
    
    if (field) {
      query += ` AND qb.field_of_study = ?`;
      params.push(field);
    }
    
    if (type) {
      query += ` AND q.type = ?`;
      params.push(type);
    }
    
    if (difficulty) {
      query += ` AND q.difficulty = ?`;
      params.push(difficulty);
    }
    
    query += ` ORDER BY q.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    
    const [rows] = await pool.execute(query, params);
    
    // Parse attachments
    // @ts-ignore
    const items = (rows as any[]).map(r => {
      try {
        r.attachments = r.attachments ? JSON.parse(r.attachments) : null;
      } catch (e) {
        r.attachments = null;
      }
      return r;
    });
    
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get question detail (public)
router.get('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT q.*, qb.field_of_study, qb.title as bank_title, qb.is_public
      FROM questions q
      JOIN question_banks qb ON q.bank_id = qb.id
      WHERE q.id = ? AND qb.is_public = true
    `, [Number(id)]);
    
    if (!rows || (rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const question = (rows as any[])[0];
    try {
      question.attachments = question.attachments ? JSON.parse(question.attachments) : null;
    } catch (e) {
      question.attachments = null;
    }
    
    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Get bank detail (public)
router.get('/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT * FROM question_banks 
      WHERE id = ? AND is_public = true
    `, [Number(id)]);
    
    if (!rows || (rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Bank not found' });
    }
    
    const bank = (rows as any[])[0];
    
    // Get questions in this bank
    const [questions] = await pool.execute(`
      SELECT id, title, type, difficulty, created_at
      FROM questions
      WHERE bank_id = ?
      ORDER BY created_at DESC
    `, [Number(id)]);
    
    res.json({ bank, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bank' });
  }
});

// Get statistics (public)
router.get('/stats', async (req, res) => {
  try {
    const [totalBanks] = await pool.execute('SELECT COUNT(*) as count FROM question_banks WHERE is_public = true');
    const [totalQuestions] = await pool.execute('SELECT COUNT(*) as count FROM questions');
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [fields] = await pool.execute('SELECT COUNT(DISTINCT field_of_study) as count FROM question_banks WHERE is_public = true');
    
    res.json({
      banks: (totalBanks as any[])[0].count,
      questions: (totalQuestions as any[])[0].count,
      users: (totalUsers as any[])[0].count,
      fields: (fields as any[])[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
