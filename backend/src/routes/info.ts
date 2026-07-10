import { Router } from "express";
import { prisma } from "../utils/prisma";
import { authenticate, requireEditor } from "../middleware/auth";
import { uploadImage } from "../middleware/upload";
import slugify from "slugify";

const router = Router();

async function makeSlug(title: string, excludeId?: string): Promise<string> {
  let base = slugify(title, { lower: true, strict: true }).substring(0, 80);
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await (prisma as any).infoItem.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

// ── GET /api/info — publik ───────────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      type, search, featured,
      limit = "12", page = "1",
    } = req.query as any;

    const where: any = { status: "PUBLISHED" };
    if (type) where.type = type;
    if (featured === "true") where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const take = Math.min(parseInt(limit), 50);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      (prisma as any).infoItem.findMany({
        where,
        take,
        skip,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
      }),
      (prisma as any).infoItem.count({ where }),
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

// ── GET /api/info/counts — jumlah per type ───────────
router.get("/counts", async (_req, res) => {
  try {
    const counts = await (prisma as any).infoItem.groupBy({
      by: ["type"],
      where: { status: "PUBLISHED" },
      _count: true,
    });
    const result: Record<string, number> = {};
    counts.forEach((c: any) => { result[c.type] = c._count; });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/info/admin/all — admin ─────────────────
router.get("/admin/all", authenticate, async (req, res) => {
  try {
    const { type, status, search, limit = "50", page = "1" } = req.query as any;
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) where.OR = [{ title: { contains: search, mode: "insensitive" } }];

    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      (prisma as any).infoItem.findMany({ where, take, skip, orderBy: { updatedAt: "desc" } }),
      (prisma as any).infoItem.count({ where }),
    ]);

    res.json({ success: true, data, pagination: { total, pages: Math.ceil(total / take) } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/info/:slug ──────────────────────────────
router.get("/:slug", async (req, res) => {
  try {
    const item = await (prisma as any).infoItem.findFirst({
      where: { OR: [{ slug: req.params.slug }, { id: req.params.slug }] },
    });
    if (!item) return res.status(404).json({ message: "Tidak ditemukan" });

    await (prisma as any).infoItem.update({
      where: { id: item.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/info — admin ───────────────────────────
router.post("/",
  authenticate, requireEditor,
  uploadImage("info").fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]),
  async (req: any, res) => {
    try {
      const {
        type, title, excerpt, content, status,
        isFeatured, isHighlight, tags,
        source, externalUrl,
        awardGiver, awardYear, awardCategory,
        issueNumber, issueYear,
        eventDate, eventEndDate, eventLocation, eventType,
      } = req.body;

      if (!title || !type) return res.status(400).json({ message: "Judul dan tipe wajib diisi" });

      const slug = await makeSlug(title);
      const files = req.files as any;

      const item = await (prisma as any).infoItem.create({
        data: {
          type,
          slug,
          title,
          excerpt: excerpt || null,
          content: content || null,
          status: status || "DRAFT",
          isFeatured: isFeatured === "true",
          isHighlight: isHighlight === "true",
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          coverImage: files?.cover?.[0]?.path || null,
          fileUrl: files?.file?.[0]?.path || null,
          tags: tags ? JSON.parse(tags) : [],
          // NEWS
          source: source || null,
          externalUrl: externalUrl || null,
          // AWARD
          awardGiver: awardGiver || null,
          awardYear: awardYear ? parseInt(awardYear) : null,
          awardCategory: awardCategory || null,
          // MAGAZINE
          issueNumber: issueNumber || null,
          issueYear: issueYear ? parseInt(issueYear) : null,
          // AGENDA
          eventDate: eventDate ? new Date(eventDate) : null,
          eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
          eventLocation: eventLocation || null,
          eventType: eventType || null,
        },
      });

      res.status(201).json({ success: true, data: item });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── PUT /api/info/:id — admin ────────────────────────
router.put("/:id",
  authenticate, requireEditor,
  uploadImage("info").fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]),
  async (req: any, res) => {
    try {
      const existing = await (prisma as any).infoItem.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ message: "Tidak ditemukan" });

      const files = req.files as any;
      const data: any = { ...req.body };

      if (req.body.title && req.body.title !== existing.title) {
        data.slug = await makeSlug(req.body.title, req.params.id);
      }
      if (files?.cover?.[0]?.path) data.coverImage = files.cover[0].path;
      if (files?.file?.[0]?.path) data.fileUrl = files.file[0].path;
      if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === "true";
      if (data.isHighlight !== undefined) data.isHighlight = data.isHighlight === "true";
      if (data.tags) data.tags = JSON.parse(data.tags);
      if (data.awardYear) data.awardYear = parseInt(data.awardYear);
      if (data.issueYear) data.issueYear = parseInt(data.issueYear);
      if (data.eventDate) data.eventDate = new Date(data.eventDate);
      if (data.eventEndDate) data.eventEndDate = new Date(data.eventEndDate);
      if (data.status === "PUBLISHED" && !existing.publishedAt) {
        data.publishedAt = new Date();
      }

      // Hapus field yang tidak ada di model
      delete data.type; // type tidak boleh diubah setelah dibuat

      const updated = await (prisma as any).infoItem.update({
        where: { id: req.params.id },
        data,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── DELETE /api/info/:id — admin ─────────────────────
router.delete("/:id", authenticate, requireEditor, async (req, res) => {
  try {
    await (prisma as any).infoItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Item dihapus" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;