import { Router } from "express";
import { body, query } from "express-validator";
import { prisma } from "../utils/prisma";
import { authenticate, requireEditor, requirePublikasi } from "../middleware/auth";
import { uploadPublication } from "../middleware/upload";
import { validate } from "../middleware/validate";
import slugify from "slugify";

const router = Router();

// ── Helper generate slug unik ──
async function makeSlug(title: string, excludeId?: string): Promise<string> {
  let base = slugify(title, { lower: true, strict: true }).substring(0, 80);
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.publication.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

// ── GET /api/publications ──
router.get("/", async (req, res) => {
  try {
    const {
      type, status, category, search,
      featured, limit = "10", page = "1",
      author,
    } = req.query as any;

    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    else where.status = "PUBLISHED"; // default hanya tampilkan yang published
    if (featured === "true") where.isFeatured = true;
    if (author) where.authorId = author;

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const take = Math.min(parseInt(limit), 50);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        take,
        skip,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          author: {
            select: { id: true, name: true, avatar: true, },
          },
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
        },
      }),
      prisma.publication.count({ where }),
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

// ── GET /api/publications/admin/all ── (tanpa filter status)
router.get("/admin/all", authenticate, async (req, res) => {
  try {
    const { type, search, limit = "50", page = "1" } = req.query as any;
    const where: any = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        take,
        skip,
        orderBy: { updatedAt: "desc" },
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.publication.count({ where }),
    ]);

    res.json({ success: true, data, pagination: { total, pages: Math.ceil(total / take) } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/publications/submit ── (siapa pun yang login, langsung masuk antrian REVIEW)
router.post("/submit",
  authenticate,
  uploadPublication.fields([
    { name: "cover", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  body("title").notEmpty().withMessage("Judul wajib diisi"),
  body("type").isIn(["ARTICLE", "PAPER", "JOURNAL"]).withMessage("Tipe tidak valid"),
  validate,
  async (req: any, res) => {
    try {
      const files = req.files as any;
      const {
        title, type, excerpt, content, abstract, categoryId,
        articleSubtype, paperSubtype, authors, keywords, institutions,
        volume, issue, year, doi, issn,
      } = req.body;

      const slug = await makeSlug(title);

      const pub = await prisma.publication.create({
        data: {
          type,
          slug,
          title,
          excerpt: excerpt || null,
          content: content || null,
          abstract: abstract || null,
          coverImage: files?.cover?.[0]?.path || null,
          pdfUrl: files?.pdf?.[0]?.path || null,
          status: "REVIEW", // dipaksa, apapun yang dikirim client diabaikan
          isFeatured: false,
          authorId: req.user.id,
          categoryId: categoryId || null,
          articleSubtype: articleSubtype || null,
          paperSubtype: paperSubtype || null,
          authors: authors ? JSON.parse(authors) : [],
          keywords: keywords ? JSON.parse(keywords) : [],
          institutions: institutions ? JSON.parse(institutions) : [],
          volume: volume ? parseInt(volume) : null,
          issue: issue ? parseInt(issue) : null,
          year: year ? parseInt(year) : null,
          doi: doi || null,
          issn: issn || null,
        },
      });

      res.status(201).json({ success: true, data: pub, message: "Tulisan kamu terkirim ke tim editor untuk ditinjau." });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── GET /api/publications/:slug ──
router.get("/:slug", async (req, res) => {
  try {
    const pub = await prisma.publication.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, avatar: true, } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });

    if (!pub) return res.status(404).json({ message: "Publikasi tidak ditemukan" });

    // Increment view count
    await prisma.publication.update({
      where: { id: pub.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    res.json({ success: true, data: pub });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/publications ── (Writer bisa create draft/review, Editor+ bebas)
router.post("/",
  authenticate, requirePublikasi,
  uploadPublication.fields([
    { name: "cover", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  body("title").notEmpty().withMessage("Judul wajib diisi"),
  body("type").isIn(["ARTICLE", "PAPER", "JOURNAL"]).withMessage("Tipe tidak valid"),
  validate,
  async (req: any, res) => {
    try {
      const files = req.files as any;
      const isWriter = req.user.role === "PUBLIKASI_WRITER";
      const editorRoles = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"];
      const isEditorPlus = editorRoles.includes(req.user.role);

      const {
        title, type, excerpt, content, abstract,
        status: requestedStatus, isFeatured, categoryId,
        articleSubtype, paperSubtype,
        authors, keywords, institutions,
        volume, issue, year, doi, reviewers, citations, issn,
      } = req.body;

      // Writer cuma boleh DRAFT atau REVIEW — nggak bisa publish/arsip sendiri,
      // meski dia kirim status lain lewat request manual.
      let status = requestedStatus || "DRAFT";
      if (isWriter && !["DRAFT", "REVIEW"].includes(status)) status = "DRAFT";

      // isFeatured itu keputusan editorial, Writer nggak boleh set sendiri.
      const featured = isEditorPlus ? isFeatured === "true" : false;

      const slug = await makeSlug(title);

      const pub = await prisma.publication.create({
        data: {
          type,
          slug,
          title,
          excerpt: excerpt || null,
          content: content || null,
          abstract: abstract || null,
          coverImage: files?.cover?.[0]?.path || null,
          pdfUrl: files?.pdf?.[0]?.path || null,
          status,
          isFeatured: featured,
          authorId: req.user.id,
          categoryId: categoryId || null,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          articleSubtype: articleSubtype || null,
          paperSubtype: paperSubtype || null,
          authors: authors ? JSON.parse(authors) : [],
          keywords: keywords ? JSON.parse(keywords) : [],
          institutions: institutions ? JSON.parse(institutions) : [],
          downloadCount: 0,
          volume: volume ? parseInt(volume) : null,
          issue: issue ? parseInt(issue) : null,
          year: year ? parseInt(year) : null,
          doi: doi || null,
          reviewers: reviewers ? JSON.parse(reviewers) : [],
          citations: citations ? JSON.parse(citations) : [],
          issn: issn || null,
        },
      });

      res.status(201).json({ success: true, data: pub });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── PUT /api/publications/:id ── (Writer: hanya draft miliknya, Editor+: bebas)
router.put("/:id",
  authenticate, requirePublikasi,
  uploadPublication.fields([
    { name: "cover", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req: any, res) => {
    try {
      const files = req.files as any;
      const existing = await prisma.publication.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ message: "Tidak ditemukan" });

      const isWriter = req.user.role === "PUBLIKASI_WRITER";
      const editorRoles = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"];
      const isEditorPlus = editorRoles.includes(req.user.role);

      // Writer cuma boleh sentuh miliknya sendiri, dan cuma selama masih DRAFT.
      if (isWriter && (existing.authorId !== req.user.id || existing.status !== "DRAFT")) {
        return res.status(403).json({ message: "Kamu tidak punya akses untuk mengubah publikasi ini" });
      }

      const {
        title, excerpt, content, abstract,
        status: requestedStatus, isFeatured, categoryId,
        articleSubtype, paperSubtype,
        authors, keywords, institutions,
        volume, issue, year, doi, reviewers, citations, issn,
      } = req.body;

      const data: any = {};

      if (title && title !== existing.title) {
        data.title = title;
        data.slug = await makeSlug(title, req.params.id);
      }
      if (excerpt !== undefined) data.excerpt = excerpt || null;
      if (content !== undefined) data.content = content || null;
      if (abstract !== undefined) data.abstract = abstract || null;
      if (files?.cover?.[0]?.path) data.coverImage = files.cover[0].path;
      if (files?.pdf?.[0]?.path) data.pdfUrl = files.pdf[0].path;

      if (requestedStatus !== undefined) {
        // Writer cuma boleh transisi ke DRAFT atau REVIEW.
        data.status = isWriter && !["DRAFT", "REVIEW"].includes(requestedStatus)
          ? existing.status
          : requestedStatus;
        if (data.status === "PUBLISHED" && !existing.publishedAt) {
          data.publishedAt = new Date();
        }
      }

      // isFeatured cuma boleh diubah Editor ke atas.
      if (isFeatured !== undefined && isEditorPlus) data.isFeatured = isFeatured === "true";

      if (categoryId !== undefined) data.categoryId = categoryId || null;
      if (articleSubtype !== undefined) data.articleSubtype = articleSubtype || null;
      if (paperSubtype !== undefined) data.paperSubtype = paperSubtype || null;
      if (authors !== undefined) data.authors = JSON.parse(authors);
      if (keywords !== undefined) data.keywords = JSON.parse(keywords);
      if (institutions !== undefined) data.institutions = JSON.parse(institutions);
      if (volume !== undefined) data.volume = volume ? parseInt(volume) : null;
      if (issue !== undefined) data.issue = issue ? parseInt(issue) : null;
      if (year !== undefined) data.year = year ? parseInt(year) : null;
      if (doi !== undefined) data.doi = doi || null;
      if (reviewers !== undefined) data.reviewers = JSON.parse(reviewers);
      if (citations !== undefined) data.citations = JSON.parse(citations);
      if (issn !== undefined) data.issn = issn || null;

      const updated = await prisma.publication.update({
        where: { id: req.params.id },
        data,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ── PUT /api/publications/:id ── (admin)
router.put("/:id",
  authenticate, requireEditor,
  uploadPublication.fields([
    { name: "cover", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req: any, res) => {
    try {
      const files = req.files as any;
      const existing = await prisma.publication.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ message: "Tidak ditemukan" });

      const {
        title, excerpt, content, abstract,
        status, isFeatured, categoryId,
        articleSubtype, paperSubtype,
        authors, keywords, institutions,
        volume, issue, year, doi, reviewers, citations, issn,
      } = req.body;

      const data: any = {};

      if (title && title !== existing.title) {
        data.title = title;
        data.slug = await makeSlug(title, req.params.id);
      }
      if (excerpt !== undefined) data.excerpt = excerpt || null;
      if (content !== undefined) data.content = content || null;
      if (abstract !== undefined) data.abstract = abstract || null;
      if (files?.cover?.[0]?.path) data.coverImage = files.cover[0].path;
      if (files?.pdf?.[0]?.path) data.pdfUrl = files.pdf[0].path;
      if (status !== undefined) {
        data.status = status;
        if (status === "PUBLISHED" && !existing.publishedAt) {
          data.publishedAt = new Date();
        }
      }
      if (isFeatured !== undefined) data.isFeatured = isFeatured === "true";
      if (categoryId !== undefined) data.categoryId = categoryId || null;

      // Article fields
      if (articleSubtype !== undefined) data.articleSubtype = articleSubtype || null;

      // Paper & Journal fields
      if (paperSubtype !== undefined) data.paperSubtype = paperSubtype || null;
      if (authors !== undefined) data.authors = JSON.parse(authors);
      if (keywords !== undefined) data.keywords = JSON.parse(keywords);
      if (institutions !== undefined) data.institutions = JSON.parse(institutions);

      // Journal fields
      if (volume !== undefined) data.volume = volume ? parseInt(volume) : null;
      if (issue !== undefined) data.issue = issue ? parseInt(issue) : null;
      if (year !== undefined) data.year = year ? parseInt(year) : null;
      if (doi !== undefined) data.doi = doi || null;
      if (reviewers !== undefined) data.reviewers = JSON.parse(reviewers);
      if (citations !== undefined) data.citations = JSON.parse(citations);
      if (issn !== undefined) data.issn = issn || null;

      const updated = await prisma.publication.update({
        where: { id: req.params.id },
        data,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── DELETE /api/publications/:id ── (admin)
router.delete("/:id", authenticate, requireEditor, async (req, res) => {
  try {
    await prisma.publication.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Publikasi dihapus" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/publications/:slug/download ── (paper & journal)
router.get("/:slug/download", async (req, res) => {
  try {
    const pub = await prisma.publication.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, pdfUrl: true, title: true },
    });

    if (!pub) {
      return res.status(404).json({ message: "Publikasi tidak ditemukan" });
    }

    if (!pub.pdfUrl) {
      return res.status(404).json({ message: "File PDF tidak tersedia" });
    }

    // Increment download count
    await prisma.publication.update({
      where: { id: pub.id },
      data: { downloadCount: { increment: 1 } },
    }).catch(() => {});

    // Return URL saja — biarkan frontend yang handle redirect
    res.json({
      success: true,
      url: pub.pdfUrl,
      title: pub.title,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;