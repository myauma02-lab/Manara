// src/routes/contact.ts
import { Router } from "express";
import { body } from "express-validator";
import { prisma } from "../utils/prisma";
import { validate } from "../middleware/validate";
import { authenticate, requireAdmin } from "../middleware/auth";
import { sendContactConfirmation, sendContactNotification, createTransporter } from "../services/emailService";

const router = Router();
const transporter = createTransporter();

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

router.post(
  "/reply/:key",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { subject, message } = req.body;
      const client: any = prisma;

      const item = await client.contactMessage.findUnique({
        where: {
          id: req.params.key,
        },
      });

      if (!item) {
        return res.status(404).json({
          message: "Pesan tidak ditemukan",
        });
      }

      if (!transporter) {
        return res.status(500).json({
          message: "Layanan email tidak tersedia",
        });
      }

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: item.email,
        subject,
        html: `
          <p>Halo <strong>${item.name}</strong>,</p>

          <p>${message}</p>

          <br/>

          <p>
            Salam hangat,<br/>
            <strong>Tim Manara</strong>
          </p>
        `,
      });

      res.json({
        success: true,
        message: "Email berhasil dikirim",
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Gagal mengirim email",
      });
    }
  }
);

export default router;