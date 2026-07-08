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
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

// ── GET /api/projects — publik ──────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      status, category, search, featured,
      limit = "12", page = "1",
    } = req.query as any;

    const where: any = { isPublic: true };
    if (status) where.status = status;
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (featured === "true") where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const take = Math.min(parseInt(limit), 50);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        take,
        skip,
        orderBy: [
          { isFeatured: "desc" },
          { status: "asc" },
          { startDate: "desc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/projects/admin/all — admin ─────────────
router.get("/admin/all", authenticate, async (req, res) => {
  try {
    const { status, search, limit = "50", page = "1" } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where, take, skip,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ success: true, data, pagination: { total, pages: Math.ceil(total / take) } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/projects/:slug ──────────────────────────
router.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { slug: req.params.slug },
          { id: req.params.slug },
        ],
      },
    });
    if (!project) return res.status(404).json({ message: "Proyek tidak ditemukan" });
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/projects — admin ───────────────────────
router.post("/",
  authenticate, requireEditor,
  uploadImage("projects").single("cover"),
  async (req: any, res) => {
    try {
      const {
        title, description, status, category, tags,
        startDate, endDate, progress, isFeatured, isPublic,
        teamMembers, outputs, milestones,
        reportUrl, dataUrl, relatedPubs,
        client, location,
      } = req.body;

      if (!title) return res.status(400).json({ message: "Judul wajib diisi" });

      const slug = await makeSlug(title);

      const project = await prisma.project.create({
        data: {
          title,
          slug,
          description: description || null,
          coverImage: req.file?.path || null,
          status: status || "UPCOMING",
          category: category || null,
          tags: tags ? JSON.parse(tags) : [],
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          progress: parseInt(progress) || 0,
          isFeatured: isFeatured === "true",
          isPublic: isPublic !== "false",
          teamMembers: teamMembers ? JSON.parse(teamMembers) : [],
          outputs: outputs ? JSON.parse(outputs) : [],
          milestones: milestones ? JSON.parse(milestones) : [],
          reportUrl: reportUrl || null,
          dataUrl: dataUrl || null,
          relatedPubs: relatedPubs ? JSON.parse(relatedPubs) : [],
          client: client || null,
          location: location || null,
        },
      });

      res.status(201).json({ success: true, data: project });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── PUT /api/projects/:id — admin ────────────────────
router.put("/:id",
  authenticate, requireEditor,
  uploadImage("projects").single("cover"),
  async (req: any, res) => {
    try {
      const existing = await prisma.project.findUnique({
        where: { id: req.params.id },
      });
      if (!existing) return res.status(404).json({ message: "Proyek tidak ditemukan" });

      const {
        title, description, status, category, tags,
        startDate, endDate, progress, isFeatured, isPublic,
        teamMembers, outputs, milestones,
        reportUrl, dataUrl, relatedPubs,
        client, location,
      } = req.body;

      const data: any = {};

      if (title !== undefined && title !== existing.title) {
        data.title = title;
        data.slug = await makeSlug(title, req.params.id);
      }
      if (description !== undefined) data.description = description || null;
      if (req.file?.path) data.coverImage = req.file.path;
      if (status !== undefined) data.status = status;
      if (category !== undefined) data.category = category || null;
      if (tags !== undefined) data.tags = JSON.parse(tags);
      if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
      if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
      if (progress !== undefined) data.progress = parseInt(progress);
      if (isFeatured !== undefined) data.isFeatured = isFeatured === "true";
      if (isPublic !== undefined) data.isPublic = isPublic !== "false";
      if (teamMembers !== undefined) data.teamMembers = JSON.parse(teamMembers);
      if (outputs !== undefined) data.outputs = JSON.parse(outputs);
      if (milestones !== undefined) data.milestones = JSON.parse(milestones);
      if (reportUrl !== undefined) data.reportUrl = reportUrl || null;
      if (dataUrl !== undefined) data.dataUrl = dataUrl || null;
      if (relatedPubs !== undefined) data.relatedPubs = JSON.parse(relatedPubs);
      if (client !== undefined) data.client = client || null;
      if (location !== undefined) data.location = location || null;

      const updated = await prisma.project.update({
        where: { id: req.params.id },
        data,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── DELETE /api/projects/:id — admin ─────────────────
router.delete("/:id", authenticate, requireEditor, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Proyek dihapus" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;