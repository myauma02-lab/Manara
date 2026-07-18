import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

/**
 * Public
 * Submit interest
 */
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      expertise,
      linkedin,
      portfolioLink,
      motivation,
    } = req.body;

    const existing = await (prisma as any).interest.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        message: "Email sudah terdaftar di Talent Pool.",
      });
    }

    const interest = await (prisma as any).interest.create({
      data: {
        fullName,
        email,
        phone,
        expertise,
        linkedin,
        portfolioLink,
        motivation,
      },
    });

    res.status(201).json({
      success: true,
      data: interest,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * Admin
 * List semua talent
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  async (_req, res) => {
    const data = await (prisma as any).interest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data,
    });
  }
);

/**
 * Admin
 * Delete
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    await (prisma as any).interest.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
    });
  }
);

export default router;
