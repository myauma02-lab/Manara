import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// GET /api/founders
router.get("/", async (_req, res) => {
  try {
    const founders = await prisma.founder.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: founders });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/founders — tambah founder baru
router.post("/",
  authenticate, requireAdmin,
  upload.single("photo"),
  async (req: any, res) => {
    try {
      const { name, role, bio, order } = req.body;
      const founder = await prisma.founder.create({
        data: {
          name,
          role: role || "Co-Founder",
          bio: bio || null,
          order: parseInt(order) || 0,
          photo: req.file?.path || null,
        },
      });
      res.status(201).json({ success: true, data: founder });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /api/founders/:id — edit founder
router.put("/:id",
  authenticate, requireAdmin,
  upload.single("photo"),
  async (req: any, res) => {
    try {
      const { name, role, bio, order } = req.body;
      const data: any = {};

      if (name !== undefined) data.name = name;
      if (role !== undefined) data.role = role;
      if (bio !== undefined) data.bio = bio;
      if (order !== undefined) data.order = parseInt(order);

      // Hanya update foto kalau ada file baru yang diupload
      if (req.file?.path) {
        data.photo = req.file.path;
      }

      const founder = await prisma.founder.update({
        where: { id: req.params.id },
        data,
      });

      res.json({ success: true, data: founder });
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Founder tidak ditemukan" });
      }
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /api/founders/:id
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.founder.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Founder dihapus" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;