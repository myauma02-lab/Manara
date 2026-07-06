import { Router } from "express";
import { prisma } from "../utils/prisma";
import {
  sendNewsletterConfirmation,
  sendNewSubscriberNotification,
} from "../services/emailService";

const router = Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Email tidak valid" });
    }

    // Cek apakah sudah subscribe
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        message: "Email ini sudah terdaftar sebagai subscriber.",
      });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email, name: name || null },
    });

    // Kirim email konfirmasi (async, tidak block response)
    sendNewsletterConfirmation({ email, name }).catch(() => {});
    sendNewSubscriberNotification({ email, name }).catch(() => {});

    res.status(201).json({
      success: true,
      message: "Berhasil berlangganan!",
      data: subscriber,
    });
  } catch (err: any) {
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({ message: "Gagal berlangganan. Coba lagi." });
  }
});

// GET /api/newsletter/subscribers (admin only)
router.get("/subscribers", async (_req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: subscribers, total: subscribers.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;