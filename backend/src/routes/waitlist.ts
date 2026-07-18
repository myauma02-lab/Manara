import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate } from "../middleware/auth";
import {
  sendContactConfirmation,
} from "../services/emailService";

const router = Router();

// POST /api/waitlist — daftar waitlist (publik)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, interest, message, source } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Nama dan email wajib diisi",
      });
    }

    // Cek sudah terdaftar
    const existing = await (prisma as any).waitlistEntry.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        message: "Email ini sudah terdaftar di waitlist kami. Kami akan menghubungimu saat rekrutmen dibuka! 🙏",
      });
    }

    const entry = await (prisma as any).waitlistEntry.create({
      data: { name, email, phone, interest, message, source },
    });

    // Kirim email konfirmasi
    sendContactConfirmation({ name, email }).catch(() => {});

    // Notif ke admin
    sendWaitlistNotification({ name, email, interest }).catch(() => {});

    res.status(201).json({
      success: true,
      message: "Berhasil masuk waitlist!",
      data: { id: entry.id },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/waitlist — list waitlist (admin)
router.get("/", authenticate, async (_req, res) => {
  try {
    const entries = await (prisma as any).waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({
      success: true,
      data: entries,
      total: entries.length,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/waitlist/:id — hapus entry (admin)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await (prisma as any).waitlistEntry.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Helper email notif waitlist
async function sendWaitlistNotification(data: {
  name: string;
  email: string;
  interest?: string;
}) {
  // Import dari emailService
  const { sendContactNotification } = await import("../services/emailService");
  await sendContactNotification({
    name: data.name,
    email: data.email,
    purpose: `Waitlist Manapeople — Minat: ${data.interest || "Umum"}`,
    message: `${data.name} (${data.email}) mendaftar ke waitlist Manapeople.`,
  });
}

export default router;