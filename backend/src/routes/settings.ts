// src/routes/settings.ts
import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]));
  res.json({ success: true, data: map });
});

router.put('/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: req.params.key },
      update: { value: req.body.value },
      create: { key: req.params.key, value: req.body.value },
    });
    res.json({ success: true, data: setting });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Admin stats dashboard
router.get('/admin/stats', authenticate, requireAdmin, async (_req, res) => {
  const [articles, founders, projects, subscribers, applications] = await Promise.all([
    prisma.article.count(),
    prisma.founder.count(),
    prisma.project.count(),
    prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.application.count({ where: { status: 'PENDING' } }),
  ]);
  res.json({ success: true, data: { articles, founders, projects, subscribers, pendingApplications: applications } });
});

export default router;
