"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const articles_1 = __importDefault(require("./routes/articles"));
const projects_1 = __importDefault(require("./routes/projects"));
const founders_1 = __importDefault(require("./routes/founders"));
const research_1 = __importDefault(require("./routes/research"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const recruitment_1 = __importDefault(require("./routes/recruitment"));
const media_1 = __importDefault(require("./routes/media"));
const settings_1 = __importDefault(require("./routes/settings"));
const categories_1 = __importDefault(require("./routes/categories"));
const users_1 = __importDefault(require("./routes/users"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
// ─── Security ───────────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip;
  }
}));
// ─── Middleware ──────────────────────────────────────────────────
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// ─── Routes ─────────────────────────────────────────────────────
const contact_1 = __importDefault(require("./routes/contact"));
// ... di bagian app.use:
app.use("/api/contact", contact_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/articles', articles_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/founders', founders_1.default);
app.use('/api/research', research_1.default);
app.use('/api/newsletter', newsletter_1.default);
app.use('/api/recruitment', recruitment_1.default);
app.use('/api/media', media_1.default);
app.use('/api/settings', settings_1.default);
app.use("/api/users", users_1.default);
app.use("/api/categories", categories_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});
// ─── Error Handler ───────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`\n🏛️  Manara API running on http://localhost:${PORT}`);
    console.log(`📖  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map