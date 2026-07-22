import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireKeuangan } from "../middleware/auth";
import { uploadPDF } from "../middleware/upload";

const router = Router();

// ── GET /api/finance/summary ──────────────────────────
router.get("/summary", authenticate, requireKeuangan, async (req, res) => {
  try {
    const { period } = req.query as any; // format: "2025-07"

    const whereDate = period ? {
      date: {
        gte: new Date(`${period}-01`),
        lte: new Date(new Date(`${period}-01`).getFullYear(), new Date(`${period}-01`).getMonth() + 1, 0),
      },
    } : {};

    const [incomeAgg, expenseAgg, recentTx, pendingCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "INCOME", status: "COMPLETED", ...whereDate },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE", status: "COMPLETED", ...whereDate },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      }),
      prisma.transaction.count({ where: { status: "PENDING" } }),
    ]);

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        cashflow: totalIncome - totalExpense,
        incomeCount: incomeAgg._count,
        expenseCount: expenseAgg._count,
        pendingCount,
        recentTransactions: recentTx,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/finance/monthly-chart ───────────────────
router.get("/monthly-chart", authenticate, requireKeuangan, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query as any;

    // Ambil data per bulan untuk tahun ini
    const months = Array.from({ length: 12 }, (_, i) => i);
    const data = await Promise.all(
      months.map(async (month) => {
        const start = new Date(Number(year), month, 1);
        const end = new Date(Number(year), month + 1, 0);
        const where = { date: { gte: start, lte: end }, status: "COMPLETED" as const };

        const [income, expense] = await Promise.all([
          prisma.transaction.aggregate({ where: { ...where, type: "INCOME" }, _sum: { amount: true } }),
          prisma.transaction.aggregate({ where: { ...where, type: "EXPENSE" }, _sum: { amount: true } }),
        ]);

        return {
          month: month + 1,
          income: income._sum.amount || 0,
          expense: expense._sum.amount || 0,
        };
      })
    );

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/finance/transactions ────────────────────
router.get("/transactions", authenticate, requireKeuangan, async (req, res) => {
  try {
    const {
      type, status, category, search,
      page = "1", limit = "20",
      dateFrom, dateTo,
    } = req.query as any;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (search) where.OR = [
      { description: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
    ];
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        take,
        skip,
        orderBy: { date: "desc" },
        include: { createdBy: { select: { name: true } } },
      }),
      prisma.transaction.count({ where }),
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

// ── POST /api/finance/transactions ───────────────────
router.post(
  "/transactions",
  authenticate, requireKeuangan,
  uploadPDF.single("attachment"),
  async (req: any, res) => {
    try {
      const {
        type, category, amount, description,
        date, status, reference, notes,
      } = req.body;

      if (!type || !category || !amount || !description || !date) {
        return res.status(400).json({ message: "Field wajib belum lengkap" });
      }

      let attachmentUrl: string | null = null;
      if (req.file) {
        const uploaded = await handleFileUploads(req, { attachment: "finance/attachments" });
        attachmentUrl = uploaded.attachment || null;
      }

      const tx = await prisma.transaction.create({
        data: {
          type,
          category,
          amount: parseFloat(amount),
          description,
          date: new Date(date),
          status: status || "COMPLETED",
          reference: reference || null,
          notes: notes || null,
          attachment: attachmentUrl,
          createdById: req.user.id,
        },
        include: { createdBy: { select: { name: true } } },
      });

      res.status(201).json({ success: true, data: tx });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── PUT /api/finance/transactions/:id ────────────────
router.put(
  "/transactions/:id",
  authenticate, requireKeuangan,
  uploadPDF.single("attachment"),
  async (req: any, res) => {
    try {
      const existing = await prisma.transaction.findUnique({
        where: { id: req.params.id },
      });
      if (!existing) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

      let attachmentUrl = existing.attachment;
      if (req.file) {
        const uploaded = await handleFileUploads(req, { attachment: "finance/attachments" });
        attachmentUrl = uploaded.attachment || existing.attachment;
      }

      const data: any = { ...req.body };
      if (data.amount) data.amount = parseFloat(data.amount);
      if (data.date) data.date = new Date(data.date);
      if (req.file) data.attachment = attachmentUrl;

      // Hapus field yang tidak boleh diupdate
      delete data.createdById;

      const updated = await prisma.transaction.update({
        where: { id: req.params.id },
        data,
        include: { createdBy: { select: { name: true } } },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── DELETE /api/finance/transactions/:id ─────────────
router.delete("/transactions/:id", authenticate, requireKeuangan, async (req, res) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/finance/categories ──────────────────────
router.get("/categories", authenticate, requireKeuangan, async (_req, res) => {
  try {
    const categories = await prisma.transaction.groupBy({
      by: ["category", "type"],
      _count: true,
      _sum: { amount: true },
    });
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── Budget routes ─────────────────────────────────────
router.get("/budgets", authenticate, requireKeuangan, async (req, res) => {
  try {
    const { period } = req.query as any;
    const where = period ? { period } : {};
    const budgets = await prisma.budget.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: budgets });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/budgets", authenticate, requireKeuangan, async (req, res) => {
  try {
    const { name, category, amount, period, notes } = req.body;
    const budget = await prisma.budget.create({
      data: { name, category, amount: parseFloat(amount), period, notes },
    });
    res.status(201).json({ success: true, data: budget });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/budgets/:id", authenticate, requireKeuangan, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.amount) data.amount = parseFloat(data.amount);
    const budget = await prisma.budget.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: budget });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/budgets/:id", authenticate, requireKeuangan, async (req, res) => {
  try {
    await prisma.budget.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

async function handleFileUploads(req: any, arg1: { attachment: string; }) {
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  const fileUrl = req.file.path || req.file.secure_url || req.file.location || req.file.url;
  if (!fileUrl) {
    throw new Error("Uploaded file does not contain a valid URL");
  }

  return {
    attachment: fileUrl,
  };
}
