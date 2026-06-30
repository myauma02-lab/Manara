"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/articles.ts
const express_1 = require("express");
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// GET /api/articles — public list
router.get('/', async (req, res) => {
    try {
        const { page = '1', limit = '12', category, tag, mediaType, featured, search, sort = 'publishedAt', } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = { status: 'PUBLISHED' };
        if (category)
            where.category = { slug: category };
        if (mediaType)
            where.mediaType = mediaType;
        if (featured === 'true')
            where.isFeatured = true;
        if (tag)
            where.tags = { some: { tag: { slug: tag } } };
        if (search)
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ];
        const [articles, total] = await Promise.all([
            prisma_1.prisma.article.findMany({
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
            prisma_1.prisma.article.count({ where }),
        ]);
        res.json({
            success: true,
            data: articles,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
// GET /api/articles/:slug — public detail
router.get('/:slug', async (req, res) => {
    try {
        const article = await prisma_1.prisma.article.findUnique({
            where: { slug: req.params.slug, status: 'PUBLISHED' },
            include: {
                author: { select: { id: true, name: true, avatar: true, bio: true } },
                category: true,
                tags: { include: { tag: true } },
            },
        });
        if (!article)
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        // increment view count
        await prisma_1.prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } });
        // related articles
        const related = await prisma_1.prisma.article.findMany({
            where: { status: 'PUBLISHED', categoryId: article.categoryId, id: { not: article.id } },
            take: 3,
            orderBy: { publishedAt: 'desc' },
            include: { author: { select: { id: true, name: true } }, category: true },
        });
        res.json({ success: true, data: { ...article, related } });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// ─── ADMIN ROUTES ────────────────────────────────────────────────
// GET /api/articles/admin/all
router.get('/admin/all', auth_1.authenticate, auth_1.requireEditor, async (_req, res) => {
    try {
        const articles = await prisma_1.prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true } },
                category: true,
                tags: { include: { tag: true } },
            },
        });
        res.json({ success: true, data: articles });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// POST /api/articles — create
router.post('/', auth_1.authenticate, auth_1.requireEditor, (0, upload_1.uploadImage)('articles').single('cover'), async (req, res) => {
    try {
        const { title, excerpt, content, categoryId, tags, mediaType, status, isFeatured } = req.body;
        const file = req.file;
        const slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const article = await prisma_1.prisma.article.create({
            data: {
                title, slug, excerpt, content,
                coverImage: file?.path || null,
                coverPublicId: file?.filename || null,
                status: status || 'DRAFT',
                isFeatured: isFeatured === 'true',
                mediaType: mediaType || 'JOURNAL',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                readTime: Math.ceil(content.split(' ').length / 200),
                authorId: req.user.id,
                categoryId: categoryId || null,
                tags: tags ? {
                    create: JSON.parse(tags).map((tagId) => ({ tag: { connect: { id: tagId } } })),
                } : undefined,
            },
            include: { author: { select: { id: true, name: true } }, category: true },
        });
        res.status(201).json({ success: true, data: article });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Server error' });
    }
});
// PUT /api/articles/:id
router.put('/:id', auth_1.authenticate, auth_1.requireEditor, (0, upload_1.uploadImage)('articles').single('cover'), async (req, res) => {
    try {
        const { title, excerpt, content, categoryId, status, isFeatured, mediaType } = req.body;
        const file = req.file;
        const data = { title, excerpt, content, status, isFeatured: isFeatured === 'true', mediaType };
        if (title)
            data.slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        if (file) {
            data.coverImage = file.path;
            data.coverPublicId = file.filename;
        }
        if (categoryId !== undefined)
            data.categoryId = categoryId || null;
        if (status === 'PUBLISHED')
            data.publishedAt = new Date();
        if (content)
            data.readTime = Math.ceil(content.split(' ').length / 200);
        const article = await prisma_1.prisma.article.update({
            where: { id: req.params.id },
            data,
            include: { author: { select: { id: true, name: true } }, category: true },
        });
        res.json({ success: true, data: article });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// DELETE /api/articles/:id
router.delete('/:id', auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    try {
        await prisma_1.prisma.article.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Artikel dihapus' });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=articles.js.map