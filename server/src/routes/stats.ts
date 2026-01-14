import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try{
    const [usersRows] = await pool.query(`SELECT COUNT(*) as cnt FROM users`);
    const [banksRows] = await pool.query(`SELECT COUNT(*) as cnt FROM question_banks`);
    const [questionsRows] = await pool.query(`SELECT COUNT(*) as cnt FROM questions`);
    // @ts-ignore
    const users = (usersRows as any)[0].cnt;
    // @ts-ignore
    const banks = (banksRows as any)[0].cnt;
    // @ts-ignore
    const questions = (questionsRows as any)[0].cnt;
    res.json({ users, banks, questions });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
});

export default router;
