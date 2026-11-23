import { Router } from "express";
import { body, query } from "express-validator";
import { prisma } from "../utils/prisma";
import { authenticate, requireEditor, requirePublikasi } from "../middleware/auth";
import { uploadPublication } from "../middleware/upload";
import { validate } from "../middleware/validate";
import slugify from "slugify";
import { Prisma, type PublicationFormat, type PublicationType } from "@prisma/client";
import { inferFormat, publicationValidation, typeForFormat, uploadedCoverRatio, coverRatioValid } from "../services/publicationFormat";

const router = Router();

function jsonArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("Format daftar tidak valid");
  return parsed;
}

function formatData(body: Record<string, any>): Record<string, any> {
  const fields = ["department", "attribution", "argumentSummary", "dataUrl", "policyProblem", "decisionMakers", "executiveSummary", "evidence", "policyOptions", "implementationNotes", "seriesNumber", "feedbackUrl", "followUpResearchUrl"];
  const data: Record<string, any> = {};
  for (const key of fields) if (body[key] !== undefined) data[key] = body[key] || null;
  for (const key of ["references", "recommendations", "attachments"]) if (body[key] !== undefined) data[key] = jsonArray(body[key]);
  for (const key of ["imageFocusX", "imageFocusY"]) if (body[key] !== undefined) data[key] = body[key] === "" ? null : Number(body[key]);
  return data;
}

function resolvedFormat(body: Record<string, any>): PublicationFormat {
  if (body.format) {
    if (!["EDITORIAL_NOTE", "RESEARCH_PAPER", "PERSPECTIVE", "POLICY_BRIEF", "WORKING_PAPER"].includes(body.format))
      throw new Error("Format publikasi tidak tersedia");
    return body.format as PublicationFormat;
  }
  return inferFormat(body.type as PublicationType, body.articleSubtype, body.paperSubtype);
}

const ALLOWED_PUBLICATION_TOPICS = new Set([
  "Constitutional & Institutional Law", "Legislative & Regulatory Studies", "Administrative & Governance Law", "Economic & Business Law", "Law, Society & Human Rights", "Environmental & Natural Resources Law",
  "Political Institutions & Democracy", "Public Policy & Governance", "Political Economy", "Electoral & Political Behavior", "Civil Society & Social Movements", "Geopolitics & International Relations",
  "Macroeconomics & Monetary Studies", "Fiscal & Public Economics", "Industrial & Structural Transformation", "Development & Inclusive Economics", "Energy & Environmental Economics", "Financial & Investment Studies",
  // Legacy values remain accepted while editors reclassify existing work.
  "Media Studies", "Economic Discourse", "Politic & Social Discourse", "Human Ecology", "Law and Public Policy",
]);

function parsePublicationTopics(value: string): string[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  return [...new Set(parsed.filter((topic): topic is string =>
    typeof topic === "string" && ALLOWED_PUBLICATION_TOPICS.has(topic)
  ))];
}

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

// PostgreSQL sequences allocate unique, non-reusable numbers under concurrent requests.
function publicationCodeFamily(type: string, articleSubtype?: string, paperSubtype?: string): string {
  if (type === "ARTICLE") return articleSubtype === "COMMENTARY" ? "COM" : "ART";
  if (type === "JOURNAL") return "JRN";
  switch (paperSubtype) {
    case "POLICY_BRIEF": return "PB";
    case "WORKING_PAPER": return "WP";
    case "RESEARCH_REPORT": return "RR";
    case "WHITE_PAPER": return "WHT";
    case "RESEARCH_NOTE": return "RN";
    default: return "RP";
  }
}

async function nextPublicationCode(type: string, articleSubtype?: string, paperSubtype?: string): Promise<string> {
  const family = publicationCodeFamily(type, articleSubtype, paperSubtype);
  const sequence = `publication_code_seq_${family.toLowerCase()}`;
  const rows = await prisma.$queryRawUnsafe<{ value: bigint }[]>(
    `SELECT nextval('public.${sequence}') AS value`
  );
  return `MNR-${family}-${String(rows[0].value).padStart(4, "0")}`;
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
    where.status = "PUBLISHED";
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
router.get("/admin/all", authenticate, requirePublikasi, async (req: any, res) => {
  try {
    const { type, format, search, limit = "50", page = "1" } = req.query as any;
    const where: any = {};
    if (type) where.type = type;
    if (format) where.format = format;
    if (req.user.role === "PUBLIKASI_WRITER") where.authorId = req.user.id;
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

router.get("/admin/:id", authenticate, requirePublikasi, async (req: any, res) => {
  const pub = await prisma.publication.findUnique({ where: { id: req.params.id }, include: { versions: { orderBy: { number: "desc" } } } });
  if (!pub || (req.user.role === "PUBLIKASI_WRITER" && pub.authorId !== req.user.id))
    return res.status(404).json({ message: "Publikasi tidak ditemukan" });
  return res.json({ success: true, data: pub });
});

router.post("/:id/versions", authenticate, requirePublikasi,
  uploadPublication.fields([{ name: "cover", maxCount: 1 }, { name: "pdf", maxCount: 1 }]),
  async (req: any, res) => {
    try {
      const pub = await prisma.publication.findUnique({ where: { id: req.params.id } });
      if (!pub || pub.format !== "WORKING_PAPER") return res.status(404).json({ message: "Working Paper tidak ditemukan" });
      if (req.user.role === "PUBLIKASI_WRITER" && pub.authorId !== req.user.id) return res.status(403).json({ message: "Akses ditolak" });
      const files = req.files as any;
      const ratio = await uploadedCoverRatio(files?.cover?.[0]);
      const version = await prisma.$transaction(async tx => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${pub.id}))`;
        const last = await tx.publicationVersion.findFirst({ where: { publicationId: pub.id }, orderBy: { number: "desc" } });
        return tx.publicationVersion.create({ data: {
          publicationId: pub.id, number: (last?.number || 0) + 1,
          versionDate: req.body.versionDate ? new Date(req.body.versionDate) : new Date(),
          coverImage: files?.cover?.[0]?.path || null, coverRatio: ratio,
          pdfUrl: files?.pdf?.[0]?.path || null,
          changeSummary: req.body.changeSummary || null,
        } });
      });
      return res.status(201).json({ success: true, data: version });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
  });

router.put("/:id/versions/:versionId", authenticate, requirePublikasi,
  uploadPublication.fields([{ name: "cover", maxCount: 1 }, { name: "pdf", maxCount: 1 }]),
  async (req: any, res) => {
    try {
      const pub = await prisma.publication.findUnique({ where: { id: req.params.id } });
      const current = await prisma.publicationVersion.findUnique({ where: { id: req.params.versionId } });
      if (!pub || !current || current.publicationId !== pub.id || pub.format !== "WORKING_PAPER") return res.status(404).json({ message: "Versi tidak ditemukan" });
      if (req.user.role === "PUBLIKASI_WRITER" && (pub.authorId !== req.user.id || req.body.publish === "true")) return res.status(403).json({ message: "Akses ditolak" });
      if (current.isPublished) return res.status(409).json({ message: "Versi terbit bersifat permanen" });
      const files = req.files as any;
      const coverRatio = files?.cover?.[0] ? await uploadedCoverRatio(files.cover[0]) : current.coverRatio;
      const next = {
        coverImage: files?.cover?.[0]?.path || current.coverImage,
        coverRatio, pdfUrl: files?.pdf?.[0]?.path || current.pdfUrl,
        versionDate: req.body.versionDate ? new Date(req.body.versionDate) : current.versionDate,
        changeSummary: req.body.changeSummary !== undefined ? req.body.changeSummary : current.changeSummary,
      };
      if (req.body.publish !== "true") {
        const saved = await prisma.publicationVersion.update({ where: { id: current.id }, data: next });
        return res.json({ success: true, data: saved });
      }
      if (!next.coverImage || !next.pdfUrl || !coverRatioValid("WORKING_PAPER", next.coverRatio))
        return res.status(422).json({ message: "Versi perlu cover A4 dan PDF", fields: { cover: "Cover A4 wajib", pdf: "PDF wajib" } });
      if (current.number > 1 && !String(next.changeSummary || "").trim())
        return res.status(422).json({ message: "Ringkasan perubahan wajib untuk versi berikutnya", fields: { changeSummary: "Ringkasan perubahan wajib" } });
      const staged = pub.draftData && typeof pub.draftData === "object" ? pub.draftData as Record<string, any> : {};
      const proposed = { ...pub, ...staged, hasCurrentVersion: true };
      const errors = publicationValidation(proposed.format, proposed);
      if (Object.keys(errors).length) return res.status(422).json({ message: "Lengkapi metadata sebelum terbit", fields: errors });
      const published = await prisma.$transaction(async tx => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${pub.id}))`;
        await tx.publicationVersion.updateMany({ where: { publicationId: pub.id, isCurrent: true }, data: { isCurrent: false } });
        const version = await tx.publicationVersion.update({ where: { id: current.id }, data: { ...next, isPublished: true, isCurrent: true } });
        await tx.publication.update({ where: { id: pub.id }, data: {
          ...staged, status: "PUBLISHED", draftData: Prisma.DbNull,
          publishedAt: pub.publishedAt || new Date(), coverImage: next.coverImage, pdfUrl: next.pdfUrl,
        } });
        return version;
      });
      return res.json({ success: true, data: published });
    } catch (err: any) { return res.status(500).json({ message: err.message }); }
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

      const chosenFormat = resolvedFormat(req.body);
      if (chosenFormat === "JOURNAL") return res.status(422).json({ message: "Manara Journal masih dalam persiapan" });
      const resolvedType = typeForFormat(chosenFormat);

      const slug = await makeSlug(title);

      const pub = await prisma.publication.create({
        data: {
          type: resolvedType,
          format: chosenFormat,
          ...formatData(req.body),
          topics: req.body.topics ? parsePublicationTopics(req.body.topics) : [],
          coverRatio: await uploadedCoverRatio(files?.cover?.[0]),
          publicationCode: await nextPublicationCode(resolvedType,
            chosenFormat === "PERSPECTIVE" ? "COMMENTARY" : articleSubtype,
            chosenFormat === "POLICY_BRIEF" ? "POLICY_BRIEF" : chosenFormat === "WORKING_PAPER" ? "WORKING_PAPER" : paperSubtype),
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

// ── GET /api/publications/code/:code ── (published short-link resolver)
router.get("/code/:code", async (req, res) => {
  const code = req.params.code.toUpperCase();
  if (!/^MNR-[A-Z]{2,5}-\d{4,}$/.test(code)) {
    return res.status(404).json({ message: "Publikasi tidak ditemukan" });
  }

  try {
    const publication = await prisma.publication.findFirst({
      where: { publicationCode: { equals: code, mode: "insensitive" }, status: "PUBLISHED" },
      select: { publicationCode: true, type: true, slug: true },
    });
    if (!publication) return res.status(404).json({ message: "Publikasi tidak ditemukan" });
    return res.json({ success: true, data: publication });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /api/publications/:slug ──
router.get("/:slug", async (req, res) => {
  try {
    const pub = await prisma.publication.findFirst({
      where: { slug: req.params.slug, status: "PUBLISHED" },
      include: {
        author: { select: { id: true, name: true, avatar: true, } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        versions: { where: { isPublished: true }, orderBy: { number: "desc" } },
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
        authors, keywords, topics, institutions,
        volume, issue, year, doi, reviewers, citations, issn,
      } = req.body;

      const chosenFormat = resolvedFormat(req.body);
      if (chosenFormat === "JOURNAL") return res.status(422).json({ message: "Manara Journal masih dalam persiapan" });
      const resolvedType = typeForFormat(chosenFormat);
      const coverRatio = await uploadedCoverRatio(files?.cover?.[0]);
      const parsedTopics = topics ? parsePublicationTopics(topics) : [];
      const parsedAuthors = jsonArray(authors);
      const parsedKeywords = jsonArray(keywords);
      const specifics = formatData(req.body);
      const publicationDate = req.body.publishedAt ? new Date(req.body.publishedAt) : null;
      if (publicationDate && Number.isNaN(publicationDate.getTime()))
        return res.status(422).json({ message: "Tanggal terbit tidak valid", fields: { publishedAt: "Periksa tanggal terbit" } });

      // Writer cuma boleh DRAFT atau REVIEW — nggak bisa publish/arsip sendiri,
      // meski dia kirim status lain lewat request manual.
      let status = requestedStatus || "DRAFT";
      if (isWriter && !["DRAFT", "REVIEW"].includes(status)) status = "DRAFT";
      if (status === "PUBLISHED") {
        const errors = publicationValidation(chosenFormat, {
          ...req.body, ...specifics, topics: parsedTopics, authors: parsedAuthors,
          keywords: parsedKeywords, coverImage: files?.cover?.[0]?.path,
          pdfUrl: files?.pdf?.[0]?.path, coverRatio, hasCurrentVersion: false,
        });
        if (Object.keys(errors).length) return res.status(422).json({ message: "Lengkapi kolom publikasi sebelum terbit", fields: errors });
      }

      // isFeatured itu keputusan editorial, Writer nggak boleh set sendiri.
      const featured = isEditorPlus ? isFeatured === "true" : false;

      const safeTitle = String(title || "").trim() || "Tanpa judul";
      const slug = await makeSlug(safeTitle);

      const pub = await prisma.publication.create({
        data: {
          type: resolvedType,
          format: chosenFormat,
          ...specifics,
          coverRatio,
          publicationCode: await nextPublicationCode(resolvedType,
            chosenFormat === "PERSPECTIVE" ? "COMMENTARY" : articleSubtype,
            chosenFormat === "POLICY_BRIEF" ? "POLICY_BRIEF" : chosenFormat === "WORKING_PAPER" ? "WORKING_PAPER" : paperSubtype),
          slug,
          title: safeTitle,
          excerpt: excerpt || null,
          content: content || null,
          abstract: abstract || null,
          coverImage: files?.cover?.[0]?.path || null,
          pdfUrl: files?.pdf?.[0]?.path || null,
          status,
          isFeatured: featured,
          authorId: req.user.id,
          categoryId: categoryId || null,
          publishedAt: publicationDate || (status === "PUBLISHED" ? new Date() : null),
          articleSubtype: chosenFormat === "PERSPECTIVE" ? "COMMENTARY" : articleSubtype || null,
          paperSubtype: chosenFormat === "POLICY_BRIEF" ? "POLICY_BRIEF" : chosenFormat === "WORKING_PAPER" ? "WORKING_PAPER" : paperSubtype || null,
          authors: parsedAuthors,
          keywords: parsedKeywords,
          topics: parsedTopics,
          institutions: institutions ? JSON.parse(institutions) : [],
          downloadCount: 0,
          volume: volume ? parseInt(volume) : null,
          issue: issue ? parseInt(issue) : null,
          year: year ? parseInt(year) : null,
          doi: doi || null,
          reviewers: reviewers ? JSON.parse(reviewers) : [],
          citations: citations ? JSON.parse(citations) : [],
          issn: issn || null,
          versions: chosenFormat === "WORKING_PAPER" && files?.cover?.[0] && files?.pdf?.[0] ? { create: {
            number: 1, versionDate: req.body.versionDate ? new Date(req.body.versionDate) : new Date(),
            coverImage: files.cover[0].path, coverRatio, pdfUrl: files.pdf[0].path,
          } } : undefined,
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
        authors, keywords, topics, institutions,
        volume, issue, year, doi, reviewers, citations, issn,
      } = req.body;
      const publicationDate = req.body.publishedAt ? new Date(req.body.publishedAt) : null;
      if (publicationDate && Number.isNaN(publicationDate.getTime()))
        return res.status(422).json({ message: "Tanggal terbit tidak valid", fields: { publishedAt: "Periksa tanggal terbit" } });

      let data: any = {};

      if (title && title !== existing.title) {
        data.title = title;
        data.slug = await makeSlug(title, req.params.id);
      }
      if (publicationDate) data.publishedAt = publicationDate;
      if (excerpt !== undefined) data.excerpt = excerpt || null;
      if (content !== undefined) data.content = content || null;
      if (abstract !== undefined) data.abstract = abstract || null;
      if (files?.cover?.[0]?.path) data.coverImage = files.cover[0].path;
      if (files?.cover?.[0]) data.coverRatio = await uploadedCoverRatio(files.cover[0]);
      if (files?.pdf?.[0]?.path) data.pdfUrl = files.pdf[0].path;

      if (req.body.format !== undefined) {
        const chosenFormat = resolvedFormat(req.body);
        data.format = chosenFormat;
        data.type = typeForFormat(chosenFormat);
        if (chosenFormat === "PERSPECTIVE") data.articleSubtype = "COMMENTARY";
        if (chosenFormat === "POLICY_BRIEF") data.paperSubtype = "POLICY_BRIEF";
        if (chosenFormat === "WORKING_PAPER") data.paperSubtype = "WORKING_PAPER";
      }
      Object.assign(data, formatData(req.body));

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
      if (topics !== undefined) data.topics = parsePublicationTopics(topics);
      if (institutions !== undefined) data.institutions = JSON.parse(institutions);
      if (volume !== undefined) data.volume = volume ? parseInt(volume) : null;
      if (issue !== undefined) data.issue = issue ? parseInt(issue) : null;
      if (year !== undefined) data.year = year ? parseInt(year) : null;
      if (doi !== undefined) data.doi = doi || null;
      if (reviewers !== undefined) data.reviewers = JSON.parse(reviewers);
      if (citations !== undefined) data.citations = JSON.parse(citations);
      if (issn !== undefined) data.issn = issn || null;

      if (existing.status === "PUBLISHED" && requestedStatus === "DRAFT") {
        const draftData = { ...(existing.draftData as Record<string, any> || {}), ...data };
        const saved = await prisma.publication.update({ where: { id: existing.id }, data: { draftData } });
        return res.json({ success: true, data: { ...saved, ...draftData, status: "DRAFT" } });
      }
      if (requestedStatus === "PUBLISHED" && existing.draftData) {
        data = { ...(existing.draftData as Record<string, any>), ...data };
      }
      if (requestedStatus === "PUBLISHED") {
        const proposed = { ...existing, ...data, hasCurrentVersion: !!(await prisma.publicationVersion.findFirst({ where: { publicationId: existing.id, isCurrent: true, isPublished: true } })) };
        const errors = publicationValidation(proposed.format, proposed);
        if (Object.keys(errors).length) return res.status(422).json({ message: "Lengkapi kolom publikasi sebelum terbit", fields: errors });
        data.draftData = Prisma.DbNull;
      }

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
      select: { id: true, pdfUrl: true, title: true, status: true, format: true,
        versions: { where: { isCurrent: true, isPublished: true }, select: { pdfUrl: true } } },
    });

    if (!pub || pub.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Publikasi tidak ditemukan" });
    }

    const downloadUrl = pub.format === "WORKING_PAPER" ? pub.versions[0]?.pdfUrl || pub.pdfUrl : pub.pdfUrl;
    if (!downloadUrl) {
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
      url: downloadUrl,
      title: pub.title,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
