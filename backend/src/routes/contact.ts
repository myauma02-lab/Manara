// src/routes/contact.ts
import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../utils/prisma";
import { validate } from "../middleware/validate";
import { authenticate, requireAdmin } from "../middleware/auth";
import { sendContactConfirmation, sendContactNotification } from "../services/emailService";

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

      const client: any = prisma;
      await client.contactMessage.create({
        data: {
          id,
          name,
          email,
          purpose: purpose || "Umum",
          message,
        },
      });

      // Kirim email notifikasi ke admin (non-blocking)
      sendContactNotification({ name, email, purpose, message }).catch(() => {});
      sendContactConfirmation({ name, email }).catch(() => {});
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
    // prisma.contactMessage may not be typed on the generated client in some setups;
    // cast to any to avoid TS errors while still using the runtime client.
    const client: any = prisma;
    const messages = await client.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: messages.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        purpose: m.purpose,
        message: m.message,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  const client: any = prisma;
  await client.contactMessage.delete({ where: { id: req.params.id } }).catch(() => {});
  res.json({ success: true, message: "Pesan dihapus" });
});

export default router;