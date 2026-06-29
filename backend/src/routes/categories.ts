// src/routes/categories.ts
import { Router } from "express";
import { body } from "express-validator";
import slugify from "slugify";
import { prisma } from "../utils/prisma";
import { authenticate, requireEditor, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

// GET /api/categories — public
router.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true, researchPapers: true } } },
    });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/categories/:slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { _count: { select: { articles: true } } },
    });
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.json({ success: true, data: category });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/categories — admin
router.post("/",
  authenticate, requireEditor,
  body("name").notEmpty().withMessage("Nama kategori wajib diisi"),
  validate,
  async (req, res) => {
    try {
      const { name, description, color } = req.body;
      const slug = slugify(name, { lower: true, strict: true });

      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) return res.status(400).json({ message: "Kategori dengan nama ini sudah ada" });

      const category = await prisma.category.create({
        data: { name, slug, description, color: color || "#266c87" },
      });
      res.status(201).json({ success: true, data: category });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /api/categories/:id — admin
router.put("/:id", authenticate, requireEditor, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const data: any = { description, color };
    if (name) {
      data.name = name;
      data.slug = slugify(name, { lower: true, strict: true });
    }
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: category });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/categories/:id — admin
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    // Unlink articles first
    await prisma.article.updateMany({
      where: { categoryId: req.params.id },
      data: { categoryId: null },
    });
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Kategori dihapus" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;