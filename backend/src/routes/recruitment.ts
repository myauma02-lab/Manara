// src/routes/recruitment.ts
import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";
import multer from "multer";
import {
  sendApplicationNotification,
  sendApplicationConfirmation,
  sendStatusUpdateEmail,
} from "../services/emailService";

const router = Router();
const upload = multer();

// Public: get active recruitment
router.get("/active", async (_req, res) => {
  const recruitment = await prisma.recruitment.findFirst({
    where: { isOpen: true },
    orderBy: { createdAt: "desc" },
  });

  if (!recruitment) {
    return res.json({
      success: true,
      mode: "INTEREST",
      data: null,
    });
  }

  return res.json({
    success: true,
    mode: "RECRUITMENT",
    data: recruitment,
  });
});

// Public: apply
router.post("/apply",
  upload.fields([{ name: "cv", maxCount: 1 }, { name: "portfolio", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { recruitmentId, fullName, email, phone, position, motivation, portfolioLink } = req.body;
      const files = req.files as any;

      const existing = await prisma.application.findFirst({
        where: { recruitmentId, email },
      });
      if (existing) {
        return res.status(400).json({ message: "Email ini sudah mendaftar untuk batch ini" });
      }

      const recruitment = await prisma.recruitment.findUnique({
        where: { id: recruitmentId },
      });

      const application = await prisma.application.create({
        data: {
          recruitmentId, fullName, email, phone, position, motivation,
          cvUrl: files?.cv?.[0]?.path || null,
          portfolioUrl: files?.portfolio?.[0]?.path || null,
          portfolioLink,
          status: "PENDING",
        },
      });

      // Email ke admin + konfirmasi ke pelamar (non-blocking)
      if (recruitment) {
        sendApplicationNotification({
       fullName,
        email,
        position,
        batchName: recruitment.batchName,
        appId: application.id,
}).catch(() => {});
      }

      sendApplicationConfirmation({
        fullName, email, position,
        appId: application.id,
      }).catch(() => {});

      res.status(201).json({
        success: true,
        message: "Lamaran berhasil dikirim! Cek email-mu untuk konfirmasi.",
        data: { id: application.id },
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Check status
router.get("/status/:id", async (req, res) => {
  const app = await prisma.application.findUnique({
    where: { id: req.params.id },
    select: { id: true, fullName: true, position: true, status: true, createdAt: true },
  });
  if (!app) return res.status(404).json({ message: "Lamaran tidak ditemukan" });
  res.json({ success: true, data: app });
});

// Admin: list recruitments
router.get("/", authenticate, requireAdmin, async (_req, res) => {
  const recruitments = await prisma.recruitment.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: recruitments });
});

// Admin: create batch
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { batchName, description, positions, isOpen, openDate, closeDate } = req.body;
    const recruitment = await prisma.recruitment.create({
      data: {
        batchName, description,
        isOpen: isOpen !== false,
        positions: positions || [],
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null,
      },
    });
    res.status(201).json({ success: true, data: recruitment });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: applications per batch
router.get("/:id/applications", authenticate, requireAdmin, async (req, res) => {
  const { status } = req.query as any;
  const where: any = { recruitmentId: req.params.id };
  if (status) where.status = status;
  const applications = await prisma.application.findMany({
    where, orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: applications });
});

// Admin: update application status
router.put("/applications/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { status, adminNotes, reviewedAt: new Date() },
    });

    // Kirim email update status ke pelamar
    sendStatusUpdateEmail({
      fullName: application.fullName,
      email: application.email,
      position: application.position,
      status,
      adminNotes,
    }).catch(() => {});

    res.json({ success: true, data: application });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;