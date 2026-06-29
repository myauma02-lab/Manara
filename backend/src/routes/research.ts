// src/routes/research.ts
import { Router } from 'express';
import slugify from 'slugify';
import { prisma } from '../utils/prisma';
import { authenticate, requireEditor, AuthRequest } from '../middleware/auth';
import { uploadPDF, uploadImage } from '../middleware/upload';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/', async (req, res) => {
  const { page = '1', limit = '10', category, year, search } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = { status: 'PUBLISHED' };
  if (category) where.category = { slug: category };
  if (year) where.year = parseInt(year);
  if (search) where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { abstract: { contains: search, mode: 'insensitive' } },
  ];
  const [papers, total] = await Promise.all([
    prisma.researchPaper.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { publishedAt: 'desc' },
      include: { category: true, uploadedBy: { select: { id: true, name: true } } },
    }),
    prisma.researchPaper.count({ where }),
  ]);
  res.json({ success: true, data: papers, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
});

router.get('/:slug', async (req, res) => {
  const paper = await prisma.researchPaper.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, uploadedBy: { select: { id: true, name: true } } },
  });
  if (!paper) return res.status(404).json({ message: 'Paper tidak ditemukan' });
  res.json({ success: true, data: paper });
});

router.get('/:slug/download', async (req, res) => {
  const paper = await prisma.researchPaper.findUnique({ where: { slug: req.params.slug } });
  if (!paper?.pdfUrl) return res.status(404).json({ message: 'File tidak tersedia' });
  await prisma.researchPaper.update({ where: { id: paper.id }, data: { downloadCount: { increment: 1 } } });
  res.json({ success: true, url: paper.pdfUrl });
});

router.post('/', authenticate, requireEditor,
  upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  async (req: AuthRequest, res) => {
    try {
      const { title, abstract, authors, volume, issue, year, doi, keywords, categoryId, status } = req.body;
      const files = req.files as any;
      const paper = await prisma.researchPaper.create({
        data: {
          title, slug: slugify(title, { lower: true, strict: true }), abstract,
          authors: authors ? JSON.parse(authors) : [],
          pdfUrl: files?.pdf?.[0]?.path || null,
          pdfPublicId: files?.pdf?.[0]?.filename || null,
          coverImage: files?.cover?.[0]?.path || null,
          volume, issue, year: year ? parseInt(year) : null, doi,
          keywords: keywords ? JSON.parse(keywords) : [],
          status: status || 'DRAFT',
          publishedAt: status === 'PUBLISHED' ? new Date() : null,
          uploadedById: req.user!.id,
          categoryId: categoryId || null,
        },
      });
      res.status(201).json({ success: true, data: paper });
    } catch (err: any) { res.status(500).json({ message: err.message }); }
  }
);

router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const { title, abstract, authors, status, volume, issue, year, doi, keywords } = req.body;
    const data: any = { abstract, status, volume, issue, doi };
    if (title) { data.title = title; data.slug = slugify(title, { lower: true, strict: true }); }
    if (authors) data.authors = JSON.parse(authors);
    if (year) data.year = parseInt(year);
    if (keywords) data.keywords = JSON.parse(keywords);
    if (status === 'PUBLISHED') data.publishedAt = new Date();
    const paper = await prisma.researchPaper.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: paper });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  await prisma.researchPaper.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Paper dihapus' });
});

export default router;
