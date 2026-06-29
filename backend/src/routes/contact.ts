// src/routes/contact.ts
import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../utils/prisma";
import { validate } from "../middleware/validate";
import { authenticate, requireAdmin } from "../middleware/auth";
import { sendContactNotification } from "../services/emailService";

const router = Router();

router.post("/",
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email").isEmail().withMessage("Email tidak valid"),
  body("message").notEmpty().withMessage("Pesan wajib diisi"),
  validate,
  async (req, res) => {
    try {
      const { name, email, purpose, message } = req.body;
      const id = `contact_${Date.now()}`;

      await prisma.siteSetting.create({
        data: {
          key: id,
          value: {
            name, email,
            purpose: purpose || "Umum",
            message,
            createdAt: new Date().toISOString(),
            read: false,
          },
        },
      });

      // Kirim email notifikasi ke admin (non-blocking)
      sendContactNotification({ name, email, purpose, message }).catch(() => {});

      res.status(201).json({
        success: true,
        message: "Pesan berhasil dikirim! Kami akan segera menghubungimu.",
      });
    } catch {
      res.status(500).json({ message: "Gagal mengirim pesan" });
    }
  }
);

router.get("/", authenticate, requireAdmin, async (_req, res) => {
  try {
    const messages = await prisma.siteSetting.findMany({
      where: { key: { startsWith: "contact_" } },
      orderBy: { updatedAt: "desc" },
    });
    res.json({
      success: true,
      data: messages.map(m => ({ id: m.key, ...(m.value as any) })),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:key", authenticate, requireAdmin, async (req, res) => {
  await prisma.siteSetting.delete({ where: { key: req.params.key } }).catch(() => {});
  res.json({ success: true, message: "Pesan dihapus" });
});

export default router;