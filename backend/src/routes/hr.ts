import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireHR } from "../middleware/auth";

const router = Router();

// ─────────────────────────────────────────────────────
// EMPLOYEES
// ─────────────────────────────────────────────────────

router.get("/employees", authenticate, requireHR, async (req, res) => {
  try {
    const { status, department, search, page = "1", limit = "20" } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (department) where.department = department;
    if (search) where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { position: { contains: search, mode: "insensitive" } },
    ];

    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where, take, skip,
        orderBy: { joinDate: "desc" },
        include: { notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 3 } },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      success: true,
      data,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / take) },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/employees/stats", authenticate, requireHR, async (_req, res) => {
  try {
    const [total, byStatus, byDept] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.groupBy({ by: ["status"], _count: true }),
      prisma.employee.groupBy({ by: ["department"], _count: true }),
    ]);
    res.json({ success: true, data: { total, byStatus, byDept } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/employees/:id", authenticate, requireHR, async (req, res) => {
  try {
    const emp = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        notes: {
          include: { author: { select: { name: true, role: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!emp) return res.status(404).json({ message: "Anggota tidak ditemukan" });
    res.json({ success: true, data: emp });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/employees", authenticate, requireHR, async (req: any, res) => {
  try {
    const {
      applicationId, fullName, email, phone,
      position, department, joinDate, status,
      address, emergencyContact,
    } = req.body;

    if (!fullName || !email || !position || !department || !joinDate) {
      return res.status(400).json({ message: "Field wajib belum lengkap" });
    }

    const employee = await prisma.employee.create({
      data: {
        applicationId: applicationId || null,
        fullName, email,
        phone: phone || null,
        position, department,
        joinDate: new Date(joinDate),
        status: status || "PROBATION",
        address: address || null,
        emergencyContact: emergencyContact || null,
      },
    });

    // Update status application jadi ACCEPTED kalau ada applicationId
    if (applicationId) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "ACCEPTED" },
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: employee });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Email sudah terdaftar sebagai anggota" });
    }
    res.status(500).json({ message: err.message });
  }
});

router.put("/employees/:id", authenticate, requireHR, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.joinDate) data.joinDate = new Date(data.joinDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    delete data.id;

    const updated = await prisma.employee.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────
// HR NOTES
// ─────────────────────────────────────────────────────

router.post("/employees/:id/notes", authenticate, requireHR, async (req: any, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Konten catatan wajib diisi" });

    const note = await prisma.hRNote.create({
      data: {
        employeeId: req.params.id,
        content,
        authorId: req.user.id,
      },
      include: { author: { select: { name: true, role: true } } },
    });

    res.status(201).json({ success: true, data: note });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/employees/notes/:noteId", authenticate, requireHR, async (req, res) => {
  try {
    await prisma.hRNote.delete({ where: { id: req.params.noteId } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────
// INTERVIEW SCHEDULE
// ─────────────────────────────────────────────────────

router.get("/interviews", authenticate, requireHR, async (req, res) => {
  try {
    const { result, upcoming } = req.query as any;
    const where: any = {};
    if (result) where.result = result;
    if (upcoming === "true") where.scheduledAt = { gte: new Date() };

    const interviews = await prisma.interviewSchedule.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
      include: {
        application: {
          select: { fullName: true, email: true, position: true, phone: true },
        },
      },
    });
    res.json({ success: true, data: interviews });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/interviews", authenticate, requireHR, async (req, res) => {
  try {
    const {
      applicationId, scheduledAt, durationMinutes,
      location, meetLink, interviewerName, notes,
    } = req.body;

    if (!applicationId || !scheduledAt) {
      return res.status(400).json({ message: "applicationId dan scheduledAt wajib diisi" });
    }

    const schedule = await prisma.interviewSchedule.create({
      data: {
        applicationId,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: parseInt(durationMinutes) || 60,
        location: location || null,
        meetLink: meetLink || null,
        interviewerName: interviewerName || null,
        notes: notes || null,
      },
      include: {
        application: { select: { fullName: true, email: true, position: true } },
      },
    });

    // Update status applicant jadi SHORTLISTED otomatis
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "SHORTLISTED" },
    }).catch(() => {});

    res.status(201).json({ success: true, data: schedule });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/interviews/:id", authenticate, requireHR, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
    if (data.durationMinutes) data.durationMinutes = parseInt(data.durationMinutes);

    const updated = await prisma.interviewSchedule.update({
      where: { id: req.params.id },
      data,
      include: {
        application: { select: { fullName: true, email: true, position: true } },
      },
    });

    // Kalau result PASSED → otomatis suggest jadi employee
    // (Frontend yang handle, backend hanya update)
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/interviews/:id", authenticate, requireHR, async (req, res) => {
  try {
    await prisma.interviewSchedule.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────
// RECRUITMENT PIPELINE (overview untuk HR)
// ─────────────────────────────────────────────────────

router.get("/pipeline", authenticate, requireHR, async (_req, res) => {
  try {
    const [batches, appsByStatus, recentApps] = await Promise.all([
      prisma.recruitment.findMany({
        include: {
          positions: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.application.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { recruitment: { select: { batchName: true } } },
      }),
    ]);

    res.json({
      success: true,
      data: { batches, appsByStatus, recentApps },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;