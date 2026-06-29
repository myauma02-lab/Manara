// src/routes/projects.ts
import { Router } from 'express';
import slugify from 'slugify';
import { prisma } from '../utils/prisma';
import { authenticate, requireEditor } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';

const router = Router();

router.get('/', async (req, res) => {
  const { status, featured } = req.query as any;
  const where: any = {};
  if (status) where.status = status;
  if (featured === 'true') where.isFeatured = true;
  const projects = await prisma.project.findMany({
    where, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  });
  res.json({ success: true, data: projects });
});

router.get('/:slug', async (req, res) => {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
  if (!project) return res.status(404).json({ message: 'Proyek tidak ditemukan' });
  res.json({ success: true, data: project });
});

router.post('/', authenticate, requireEditor, uploadImage('projects').single('cover'), async (req, res) => {
  try {
    const { title, description, status, category, tags, startDate, endDate, isFeatured, order } = req.body;
    const file = req.file as any;
    const project = await prisma.project.create({
      data: {
        title, slug: slugify(title, { lower: true, strict: true }), description,
        coverImage: file?.path || null, coverPublicId: file?.filename || null,
        status: status || 'UPCOMING', category,
        tags: tags ? JSON.parse(tags) : [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isFeatured: isFeatured === 'true',
        order: parseInt(order) || 0,
      }
    });
    res.status(201).json({ success: true, data: project });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authenticate, requireEditor, uploadImage('projects').single('cover'), async (req, res) => {
  try {
    const { title, description, status, category, tags, startDate, endDate, isFeatured, order } = req.body;
    const file = req.file as any;
    const data: any = { description, status, category, isFeatured: isFeatured === 'true' };
    if (title) { data.title = title; data.slug = slugify(title, { lower: true, strict: true }); }
    if (file) { data.coverImage = file.path; data.coverPublicId = file.filename; }
    if (tags) data.tags = JSON.parse(tags);
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);
    if (order) data.order = parseInt(order);
    const project = await prisma.project.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: project });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Proyek dihapus' });
});

export default router;
