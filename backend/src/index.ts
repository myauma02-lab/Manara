// src/index.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

console.log("STEP 1");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL prefix:",
  process.env.DATABASE_URL?.substring(0, 20)
);

import authRoutes from "./routes/auth";
import articleRoutes from "./routes/articles";
import projectRoutes from "./routes/projects";
import founderRoutes from "./routes/founders";
import researchRoutes from "./routes/research";
import newsletterRoutes from "./routes/newsletter";
import recruitmentRoutes from "./routes/recruitment";
import waitlistRoutes from "./routes/waitlist";
import mediaRoutes from "./routes/media";
import settingsRoutes from "./routes/settings";
import categoryRoutes from "./routes/categories";
import userRoutes from "./routes/users";
import contactRoutes from "./routes/contact";
import publicationRoutes from "./routes/publications";
import fellowRoutes from "./routes/fellows";
import infoRoutes from "./routes/info";
import financeRoutes from "./routes/finance";
import hrRoutes from "./routes/hr";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

console.log("STEP 2");

// ================= Security =================

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://manara-jet.vercel.app",
  "https://manara-n72q1osg2-yhauma-s-projects.vercel.app",
  "https://manara.my.id",
  "https://www.manara.my.id",
  // Domain baru
  "https://manarainstitute.id",
  "https://www.manarainstitute.id",
];

app.use(
  cors({
    origin(origin, callback) {
      // mengizinkan Postman, curl, health check
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} tidak diizinkan`));
    },
    credentials: true,
  })
);

app.options("*", cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

console.log("STEP 3");

// ================= Middleware =================

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// ================= Routes =================

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/founders", founderRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/fellows", fellowRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/hr", hrRoutes);
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ================= Error =================

app.use(errorHandler);

console.log("STEP 4");

app.listen(PORT, () => {
  console.log("STEP 5");
  console.log(`🏛️  Manara API running on port ${PORT}`);
  console.log(`📖 Environment: ${process.env.NODE_ENV}`);
});

export default app;