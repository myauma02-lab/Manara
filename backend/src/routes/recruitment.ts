import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";
import {
  sendApplicationNotification,
  sendApplicationConfirmation,
  sendStatusUpdateEmail,
} from "../services/emailService";
import { uploadCV, uploadImage } from "../middleware/upload";
// Fallback for missing ../utils/handleUpload module.
// Provide minimal implementation used by this route: returns uploaded file paths keyed by field.
const handleFileUploads = async (req: any, paths: Record<string, string>) => {
  const result: Record<string, string | null> = {};
  // If multer single upload was used, file is in req.file
  if (req.file) {
    // try common properties
    const filePath = req.file.path || req.file.filename || req.file.location || null;
    // map first key to this path
    const key = Object.keys(paths)[0];
    result[key] = filePath;
    return result;
  }
  // If multiple files, multer puts them in req.files
  if (req.files && typeof req.files === "object") {
    for (const key of Object.keys(paths)) {
      const fileEntry = req.files[key];
      if (Array.isArray(fileEntry) && fileEntry[0]) {
        result[key] = fileEntry[0].path || fileEntry[0].filename || fileEntry[0].location || null;
      } else if (fileEntry) {
        result[key] = fileEntry.path || fileEntry.filename || fileEntry.location || null;
      } else {
        result[key] = null;
      }
    }
    return result;
  }

  return result;
};

const router = Router();

// ── GET /api/recruitment/active — batch aktif (publik) ──
router.get("/active", async (_req, res) => {
  try {
    const active = await (prisma.recruitment as any).findFirst({
      // cast to any because generated Prisma WhereInput may differ from runtime fields
      where: ({ isActive: true } as any),
      include: {
        positions: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: active || null });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/recruitment — semua batch (admin) ──────────
router.get("/", authenticate, async (_req, res) => {
  try {
    const batches = await (prisma.recruitment as any).findMany({
      include: {
        positions: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: batches });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/recruitment — buat batch baru (admin) ─────
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      batchName,
      description,
      isActive,
      startDate,
      endDate,
      positions, // JSON string array
    } = req.body;

    if (!batchName) {
      return res.status(400).json({ message: "Nama batch wajib diisi" });
    }

    // Kalau batch baru aktif, nonaktifkan yang lain
    if (isActive === "true" || isActive === true) {
      await prisma.recruitment.updateMany({
        where: ({ isActive: true } as any),
        data: { isActive: false },
      });
    }

    // Parse positions
    let parsedPositions: any[] = [];
    if (positions) {
      try {
        parsedPositions = typeof positions === "string"
          ? JSON.parse(positions)
          : positions;
      } catch {
        parsedPositions = [];
      }
    }

    // cast data to any to avoid mismatches between runtime fields and generated Prisma types
    const batch = await (prisma.recruitment as any).create({
      data: ({
        batchName,
        description: description || null,
        isActive: isActive === "true" || isActive === true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        positions: {
          create: parsedPositions.map((p: any) => ({
            name: p.name,
            description: p.description || null,
            requirements: Array.isArray(p.requirements) ? p.requirements : [],
            slots: p.slots ? parseInt(p.slots) : null,
          })),
        },
      } as any),
      include: { positions: true },
    });

    res.status(201).json({ success: true, data: batch });
  } catch (err: any) {
    console.error("Create batch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/recruitment/:id — update batch (admin) ─────
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      batchName,
      description,
      isActive,
      startDate,
      endDate,
      positions,
    } = req.body;

    // Kalau diaktifkan, nonaktifkan yang lain
    if (isActive === "true" || isActive === true) {
      await prisma.recruitment.updateMany({
        where: ({
          isActive: true,
          id: { not: req.params.id },
        } as any),
        data: { isActive: false },
      });
    }

    // Update positions kalau ada
    if (positions !== undefined) {
      let parsedPositions: any[] = [];
      try {
        parsedPositions = typeof positions === "string"
          ? JSON.parse(positions)
          : positions;
      } catch {
        parsedPositions = [];
      }

      // Hapus positions lama, buat yang baru
      await (prisma as any).position.deleteMany({
        where: { recruitmentId: req.params.id },
      });

      if (parsedPositions.length > 0) {
        await (prisma as any).position.createMany({
          data: parsedPositions.map((p: any) => ({
            name: p.name,
            description: p.description || null,
            requirements: Array.isArray(p.requirements) ? p.requirements : [],
            slots: p.slots ? parseInt(p.slots) : null,
            recruitmentId: req.params.id,
          })),
        });
      }
    }

    const updated = await (prisma.recruitment as any).update({
      where: { id: req.params.id },
      data: {
        ...(batchName && { batchName }),
        ...(description !== undefined && { description: description || null }),
        ...(isActive !== undefined && { isActive: isActive === "true" || isActive === true }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
      include: { positions: true },
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/recruitment/:id — hapus batch (admin) ───
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.recruitment.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/recruitment/:id/apply — kirim lamaran ─────
router.post(
  "/:id/apply",
  uploadCV.single("cv"),
  async (req: any, res) => {
    try {
      const batch = await prisma.recruitment.findUnique({
        where: { id: req.params.id },
      });

      if (!batch || !batch.isOpen) {
        return res.status(400).json({
          message: "Batch rekrutmen tidak aktif atau tidak ditemukan",
        });
      }

      const { fullName, email, phone, position, motivation, portfolioLink } = req.body;

      if (!fullName || !email || !position || !motivation) {
        return res.status(400).json({
          message: "Nama, email, posisi, dan motivasi wajib diisi",
        });
      }

      // Upload CV kalau ada
      let cvUrl: string | null = null;
      if (req.file) {
        const uploaded = await handleFileUploads(req, { cv: "applications/cv" });
        cvUrl = uploaded.cv || null;
      }

      const application = await prisma.application.create({
        data: {
          recruitmentId: req.params.id,
          fullName,
          email,
          phone: phone || null,
          position,
          motivation,
          portfolioLink: portfolioLink || null,
          cvUrl,
        },
      });

      // Kirim email
      sendApplicationNotification({
        fullName,
        email,
        position,
        batchName: batch.batchName,
        appId: application.id,
      }).catch(() => {});

      sendApplicationConfirmation({
        fullName,
        email,
        position,
        appId: application.id,
      }).catch(() => {});

      res.status(201).json({
        success: true,
        message: "Lamaran berhasil dikirim!",
        data: { id: application.id },
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── GET /api/recruitment/:id/applications — list lamaran ─
router.get("/:id/applications", authenticate, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { recruitmentId: req.params.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: applications });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/recruitment/applications/:appId — update status
router.put(
  "/applications/:appId",
  authenticate,
  async (req, res) => {
    try {
      const { status, adminNotes } = req.body;

      const app = await prisma.application.findUnique({
        where: { id: req.params.appId },
        include: { recruitment: true },
      });

      if (!app) {
        return res.status(404).json({ message: "Lamaran tidak ditemukan" });
      }

      const updated = await prisma.application.update({
        where: { id: req.params.appId },
        data: {
          status,
          adminNotes: adminNotes || null,
        },
      });

      // Kirim notif ke pelamar
      sendStatusUpdateEmail({
        fullName: app.fullName,
        email: app.email,
        position: app.position,
        status,
        adminNotes,
      }).catch(() => {});

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;