// src/routes/users.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/users — admin only
router.get("/", authenticate, requireAdmin, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, avatar: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users — super admin only
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua kolom wajib diisi" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "EDITOR" },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });

    res.status(201).json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id — admin only
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, role, isActive, bio } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (bio !== undefined) data.bio = bio;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;