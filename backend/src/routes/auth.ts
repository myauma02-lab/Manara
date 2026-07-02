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

router.put(
  "/password",
  authenticate,
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }),
  validate,
  async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: req.user!.id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }

      const valid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!valid) {
        return res.status(400).json({
          message: "Password lama tidak sesuai",
        });
      }

      const hashed = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashed,
        },
      });

      return res.json({
        success: true,
        message: "Password berhasil diubah",
      });
    } catch (err: any) {
      console.error(err);

      return res.status(500).json({
        message: "Server error",
        error: err?.message,
      });
    }
  }
);

export default router;