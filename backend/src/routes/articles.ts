// src/routes/articles.ts
import { Router } from 'express';
import slugify from 'slugify';
import { prisma } from '../utils/prisma';
import { authenticate, requireEditor, AuthRequest } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';

const router = Router();

// GET /api/articles — public list
router.get('/', async (req, res) => {
  try {
    const {
      page = '1', limit = '12', category, tag,
      mediaType, featured, search, sort = 'publishedAt',
    } = req.query as Record<string, string>;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = { status: 'PUBLISHED' };

    if (category) where.category = { slug: category };
    if (mediaType) where.mediaType = mediaType;
    if (featured === 'true') where.isFeatured = true;
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: sort === 'views' ? { viewCount: 'desc' } : { publishedAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/articles/:slug — public detail
router.get('/:slug', async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (!article) return res.status(404).json({ message: 'Artikel tidak ditemukan' });

    // increment view count
    await prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } });

    // related articles
    const related = await prisma.article.findMany({
      where: { status: 'PUBLISHED', categoryId: article.categoryId, id: { not: article.id } },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { id: true, name: true } }, category: true },
    });

    res.json({ success: true, data: { ...article, related } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────

// GET /api/articles/admin/all
router.get('/admin/all', authenticate, requireEditor, async (_req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
    res.json({ success: true, data: articles });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/articles — create
router.post('/', authenticate, requireEditor,
  uploadImage('articles').single('cover'),
  async (req: AuthRequest, res) => {
    try {
      const { title, excerpt, content, categoryId, tags, mediaType, status, isFeatured } = req.body;
      const file = req.file as any;

      const slug = slugify(title, { lower: true, strict: true });

      const article = await prisma.article.create({
        data: {
          title, slug, excerpt, content,
          coverImage: file?.path || null,
          coverPublicId: file?.filename || null,
          status: status || 'DRAFT',
          isFeatured: isFeatured === 'true',
          mediaType: mediaType || 'JOURNAL',
          publishedAt: status === 'PUBLISHED' ? new Date() : null,
          readTime: Math.ceil(content.split(' ').length / 200),
          authorId: req.user!.id,
          categoryId: categoryId || null,
          tags: tags ? {
            create: JSON.parse(tags).map((tagId: string) => ({ tag: { connect: { id: tagId } } })),
          } : undefined,
        },
        include: { author: { select: { id: true, name: true } }, category: true },
      });

      res.status(201).json({ success: true, data: article });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Server error' });
    }
  }
);

// PUT /api/articles/:id
router.put('/:id', authenticate, requireEditor,
  uploadImage('articles').single('cover'),
  async (req: AuthRequest, res) => {
    try {
      const { title, excerpt, content, categoryId, status, isFeatured, mediaType } = req.body;
      const file = req.file as any;

      const data: any = { title, excerpt, content, status, isFeatured: isFeatured === 'true', mediaType };
      if (title) data.slug = slugify(title, { lower: true, strict: true });
      if (file) { data.coverImage = file.path; data.coverPublicId = file.filename; }
      if (categoryId !== undefined) data.categoryId = categoryId || null;
      if (status === 'PUBLISHED') data.publishedAt = new Date();
      if (content) data.readTime = Math.ceil(content.split(' ').length / 200);

      const article = await prisma.article.update({
        where: { id: req.params.id },
        data,
        include: { author: { select: { id: true, name: true } }, category: true },
      });

      res.json({ success: true, data: article });
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /api/articles/:id
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    await prisma.article.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Artikel dihapus' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
