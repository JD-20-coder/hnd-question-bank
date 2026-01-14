import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth';
import banksRoutes from '../src/routes/banks';
import questionsRoutes from '../src/routes/questions';
import usersRoutes from '../src/routes/users';

dotenv.config({ path: '../../.env' });

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/banks', banksRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);

export default app;
