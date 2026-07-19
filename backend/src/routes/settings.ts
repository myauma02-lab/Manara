// src/routes/settings.ts
import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadImage } from "../middleware/upload";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { key } = req.query as any;
    if (key) {
      const setting = await prisma.siteSetting.findUnique({ where: { key } });
      return res.json({ success: true, data: setting?.value || null });
    }
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json({ success: true, data: map });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/// POST /api/settings — upsert satu key (JSON/text)
router.post("/", authenticate, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ message: "Key wajib diisi" });
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    res.json({ success: true, data: setting });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/settings/bulk — upsert banyak key
router.post("/bulk", authenticate, async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ message: "Format tidak valid" });
    }
    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );
    res.json({ success: true, data: results.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/upload-image",
  authenticate,
  uploadImage("hero-backgrounds").single("image"),
  async (req: any, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ message: "Key wajib diisi" });
      if (!req.file) return res.status(400).json({ message: "File gambar wajib diupload" });

      const imageUrl = req.file.path || req.file.filename || (req.file as any).location;
      if (!imageUrl) return res.status(500).json({ message: "Gagal upload gambar" });

      const setting = await prisma.siteSetting.upsert({
        where: { key },
        update: { value: imageUrl },
        create: { key, value: imageUrl },
      });

      res.json({ success: true, data: { key, url: imageUrl } });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /api/settings/:key — hapus setting
router.delete("/:key", authenticate, async (req, res) => {
  try {
    await prisma.siteSetting.delete({ where: { key: req.params.key } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
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
