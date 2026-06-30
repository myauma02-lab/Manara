// src/index.ts
console.log("STEP 1");
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

console.log("STEP 2");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL prefix:", process.env.DATABASE_URL?.substring(0, 20));

import authRoutes from './routes/auth';
import articleRoutes from './routes/articles';
import projectRoutes from './routes/projects';
import founderRoutes from './routes/founders';
import researchRoutes from './routes/research';
import newsletterRoutes from './routes/newsletter';
import recruitmentRoutes from './routes/recruitment';
import mediaRoutes from './routes/media';
import settingsRoutes from './routes/settings';
import categoryRoutes from "./routes/categories";
import userRoutes from "./routes/users";
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.set("trust proxy", 1);
app.options("*", cors());
console.log("STEP 3");
const PORT = process.env.PORT || 5000;

// ─── Security ───────────────────────────────────────────────────
console.log("STEP 4");
app.use(helmet());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://manara-n72q1osg2-yhauma-s-projects.vercel.app",
        "https://manara-jet.vercel.app"
    ],
    credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ─── Middleware ──────────────────────────────────────────────────
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ─────────────────────────────────────────────────────
import contactRoutes from "./routes/contact";
// ... di bagian app.use:
app.use("/api/contact", contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/founders', founderRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───────────────────────────────────────────────
app.use(errorHandler);

console.log("STEP 5");
app.listen(PORT, () => {
  console.log("STEP 6");
  console.log(`\n🏛️  Manara API running on http://localhost:${PORT}`);
  console.log(`📖  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
