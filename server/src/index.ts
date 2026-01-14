import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import banksRoutes from "./routes/banks";
import questionsRoutes from "./routes/questions";
import usersRoutes from "./routes/users";
import statsRoutes from "./routes/stats";
import uploadsRoutes from "./routes/uploads";
import examsRoutes from "./routes/exams";
import publicRoutes from "./routes/public";
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "HND Question Bank API" }));

// PUBLIC ROUTES - No authentication required
app.use('/api/public', publicRoutes);

// PROTECTED ROUTES - Require authentication
app.use('/api/auth', authRoutes);
app.use('/api/banks', banksRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/exams', examsRoutes);

// serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// serve client build in production (if present)
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}
app.use((err: any, req: any, res: any, next: any) => {
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

export default app;
