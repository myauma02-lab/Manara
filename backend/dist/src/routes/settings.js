"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/settings.ts
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const settings = await prisma_1.prisma.siteSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ success: true, data: map });
});
router.put('/:key', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const setting = await prisma_1.prisma.siteSetting.upsert({
            where: { key: req.params.key },
            update: { value: req.body.value },
            create: { key: req.params.key, value: req.body.value },
        });
        res.json({ success: true, data: setting });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// Admin stats dashboard
router.get('/admin/stats', auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    const [articles, founders, projects, subscribers, applications] = await Promise.all([
        prisma_1.prisma.article.count(),
        prisma_1.prisma.founder.count(),
        prisma_1.prisma.project.count(),
        prisma_1.prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
        prisma_1.prisma.application.count({ where: { status: 'PENDING' } }),
    ]);
    res.json({ success: true, data: { articles, founders, projects, subscribers, pendingApplications: applications } });
});
exports.default = router;
//# sourceMappingURL=settings.js.map