// src/routes/auth.ts

import { Router } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../utils/prisma";
import { validate } from "../middleware/validate";
import { authenticate, AuthRequest, requireSuperAdmin, requireAdmin } from "../middleware/auth";

const router = Router();

/* ============================================================
   LOGIN
============================================================ */

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  validate,
  async (req, res) => {
    try {
      console.log("LOGIN STEP 1");

      const { email, password } = req.body;

      console.log("LOGIN STEP 2", email);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      console.log("LOGIN STEP 3", !!user);

      if (!user) {
        return res.status(401).json({
          message: "Email atau password salah",
        });
      }

      const valid = await bcrypt.compare(password, user.password);

      console.log("LOGIN STEP 4", valid);

      if (!valid) {
        return res.status(401).json({
          message: "Email atau password salah",
        });
      }

      console.log("LOGIN STEP 5");
      console.log("JWT exists:", !!process.env.JWT_SECRET);

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      console.log("LOGIN STEP 6");

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (err: any) {
      console.error("===== LOGIN ERROR =====");
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err?.message,
      });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────
router.get("/me", authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/users — daftar semua user (admin) ──
router.get("/users", authenticate, requireAdmin, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        isActive: true, lastLoginAt: true, createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/users — buat user baru (superadmin) ─
router.post("/users", authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    res.status(201).json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/users/:id — update user ────────────
router.put("/users/:id", authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { name, role, isActive } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/users/:id/reset-password ──────────
router.post(
  "/users/:id/reset-password",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Password minimal 6 karakter" });
      }
      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: req.params.id },
        data: { password: hashed },
      });
      res.json({ success: true, message: "Password berhasil direset" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── POST /api/auth/change-password ───────────────────
router.post("/change-password", authenticate, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Password lama tidak sesuai" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password baru minimal 6 karakter" });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    res.json({ success: true, message: "Password berhasil diubah" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/auth/users/:id ────────────────────────
router.delete("/users/:id", authenticate, requireSuperAdmin, async (req: any, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Tidak bisa menghapus akun sendiri" });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


/* ============================================================
   GET CURRENT USER
============================================================ */

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
      error: err?.message,
    });
  }
});

/* ============================================================
   UPDATE PROFILE
============================================================ */

router.put("/profile", authenticate, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    return res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
      error: err?.message,
    });
  }
});

/* ============================================================
   CHANGE PASSWORD
============================================================ */
router.post("/change-password",
  authenticate,
  body("currentPassword").notEmpty().withMessage("Password lama wajib diisi"),
  body("newPassword").isLength({ min: 8 }).withMessage("Password baru minimal 8 karakter"),
  body("confirmPassword").notEmpty().withMessage("Konfirmasi password wajib diisi"),
  validate,
  async (req: any, res: any) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.id;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Password baru dan konfirmasi tidak cocok" });
      }

      // Ambil user dengan password
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      // Verifikasi password lama
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Password lama tidak benar" });
      }

      // Pastikan password baru berbeda
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({ message: "Password baru tidak boleh sama dengan password lama" });
      }

      // Hash & simpan password baru
      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      res.json({ success: true, message: "Password berhasil diubah" });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/reset-password/:userId — Super Admin reset password user lain
router.post("/reset-password/:userId",
  authenticate,
  body("newPassword").isLength({ min: 8 }).withMessage("Password minimal 8 karakter"),
  validate,
  async (req: any, res: any) => {
    try {
      // Hanya Super Admin & Admin yang boleh
      if (!["SUPERADMIN", "ADMIN"].includes(req.user.role)) {
        return res.status(403).json({ message: "Tidak memiliki akses" });
      }

      const { newPassword } = req.body;
      const targetUser = await prisma.user.findUnique({
        where: { id: req.params.userId },
      });

      if (!targetUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Admin tidak bisa reset password Super Admin lain
      if (targetUser.role === "SUPERADMIN" && req.user.role !== "SUPERADMIN") {
        return res.status(403).json({ message: "Tidak dapat mereset password Super Admin" });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: req.params.userId },
        data: { password: hashed },
      });

      res.json({ success: true, message: `Password ${targetUser.name} berhasil direset` });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/change-password — user ganti password sendiri
router.post("/change-password",
  authenticate,
  body("currentPassword").notEmpty().withMessage("Password lama wajib diisi"),
  body("newPassword").isLength({ min: 8 }).withMessage("Password baru minimal 8 karakter"),
  body("confirmPassword").notEmpty().withMessage("Konfirmasi password wajib diisi"),
  validate,
  async (req: any, res: any) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.id;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Password baru dan konfirmasi tidak cocok" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Password lama tidak benar" });
      }

      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({ message: "Password baru tidak boleh sama dengan password lama" });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      res.json({ success: true, message: "Password berhasil diubah" });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/reset-password/:userId — Admin reset password user lain
router.post("/reset-password/:userId",
  authenticate,
  body("newPassword").isLength({ min: 8 }).withMessage("Password minimal 8 karakter"),
  validate,
  async (req: any, res: any) => {
    try {
      if (!["SUPERADMIN", "ADMIN"].includes(req.user.role)) {
        return res.status(403).json({ message: "Tidak memiliki akses" });
      }

      const { newPassword } = req.body;
      const targetUser = await prisma.user.findUnique({
        where: { id: req.params.userId },
      });

      if (!targetUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      if (targetUser.role === "SUPERADMIN" && req.user.role !== "SUPERADMIN") {
        return res.status(403).json({ message: "Tidak dapat mereset password Super Admin" });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: req.params.userId },
        data: { password: hashed },
      });

      res.json({ success: true, message: `Password ${targetUser.name} berhasil direset` });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);
export default router;