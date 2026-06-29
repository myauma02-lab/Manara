// src/routes/newsletter.ts
import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendNewsletterConfirmation } from "../services/emailService";

const router = Router();

router.post("/subscribe",
  body("email").isEmail(),
  validate,
  async (req, res) => {
    try {
      const { email, name } = req.body;
      const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

      if (existing) {
        if (existing.status === "ACTIVE") {
          return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { status: "ACTIVE", name },
        });
        return res.json({ success: true, message: "Langganan diaktifkan kembali!" });
      }

      await prisma.newsletterSubscriber.create({
        data: { email, name, status: "ACTIVE", confirmedAt: new Date() },
      });

      // Email konfirmasi (non-blocking)
      sendNewsletterConfirmation({ email, name }).catch(() => {});

      res.status(201).json({
        success: true,
        message: "Berhasil berlangganan Surat Manara!",
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/unsubscribe",
  body("email").isEmail(),
  validate,
  async (req, res) => {
    await prisma.newsletterSubscriber.update({
      where: { email: req.body.email },
      data: { status: "UNSUBSCRIBED" },
    }).catch(() => {});
    res.json({ success: true, message: "Berhasil berhenti berlangganan" });
  }
);

router.get("/subscribers", authenticate, requireAdmin, async (_req, res) => {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: subscribers, total: subscribers.length });
});

export default router;