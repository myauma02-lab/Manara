import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";
import { uploadImage } from "../middleware/upload";

const router = Router();

// Helper slug
function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 80);
}

// GET /api/fellows — publik
router.get("/", async (_req, res) => {
  try {
    const fellows = await prisma.fellow.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: fellows });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/fellows/all — admin (termasuk non-aktif)
router.get("/all", authenticate, async (_req, res) => {
  try {
    const fellows = await prisma.fellow.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: fellows });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/fellows/:slug
router.get("/:slug", async (req, res) => {
  try {
    const fellow = await prisma.fellow.findFirst({
      where: {
        OR: [{ slug: req.params.slug }, { id: req.params.slug }],
      },
    });
    if (!fellow) return res.status(404).json({ message: "Fellow tidak ditemukan" });
    res.json({ success: true, data: fellow });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/fellows — admin
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadImage("fellows").single("photo"),
  async (req: any, res) => {
    try {
      const {
        name, title, position, institution,
        bio, email, order, isActive,
        expertise, socialLinks,
      } = req.body;

      if (!name) return res.status(400).json({ message: "Nama wajib diisi" });

      // Generate slug unik
      let slug = makeSlug(name);
      let counter = 1;
      while (await prisma.fellow.findUnique({ where: { slug } })) {
        slug = `${makeSlug(name)}-${counter}`;
        counter++;
      }

      const fellow = await prisma.fellow.create({
        data: {
          name,
          slug,
          title: title || null,
          position: position || null,
          institution: institution || null,
          bio: bio || null,
          email: email || null,
          photo: req.file?.path || null,
          order: parseInt(order) || 0,
          isActive: isActive !== "false",
          expertise: expertise ? JSON.parse(expertise) : [],
          socialLinks: socialLinks ? JSON.parse(socialLinks) : null,
        },
      });

      res.status(201).json({ success: true, data: fellow });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /api/fellows/:id — admin
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  uploadImage("fellows").single("photo"),
  async (req: any, res) => {
    try {
      const {
        name, title, position, institution,
        bio, email, order, isActive,
        expertise, socialLinks,
      } = req.body;

      const existing = await prisma.fellow.findUnique({
        where: { id: req.params.id },
      });
      if (!existing) return res.status(404).json({ message: "Fellow tidak ditemukan" });

      const data: any = {};
      if (name !== undefined) data.name = name;
      if (title !== undefined) data.title = title || null;
      if (position !== undefined) data.position = position || null;
      if (institution !== undefined) data.institution = institution || null;
      if (bio !== undefined) data.bio = bio || null;
      if (email !== undefined) data.email = email || null;
      if (order !== undefined) data.order = parseInt(order);
      if (isActive !== undefined) data.isActive = isActive !== "false";
      if (expertise !== undefined) data.expertise = JSON.parse(expertise);
      if (socialLinks !== undefined) data.socialLinks = JSON.parse(socialLinks);
      if (req.file?.path) data.photo = req.file.path;

      const updated = await prisma.fellow.update({
        where: { id: req.params.id },
        data,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /api/fellows/:id — admin
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.fellow.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Fellow dihapus" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;