// src/routes/auth.ts

import { Router } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../utils/prisma";
import { validate } from "../middleware/validate";
import { authenticate, AuthRequest } from "../middleware/auth";

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

      if (!user || !user.isActive) {
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
        bio: true,
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
    const { name, bio } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        name,
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
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
      if (!["SUPER_ADMIN", "ADMIN"].includes(req.user.role)) {
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
      if (targetUser.role === "SUPER_ADMIN" && req.user.role !== "SUPER_ADMIN") {
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