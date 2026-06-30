"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/research.ts
const express_1 = require("express");
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/', async (req, res) => {
    const { page = '1', limit = '10', category, year, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { status: 'PUBLISHED' };
    if (category)
        where.category = { slug: category };
    if (year)
        where.year = parseInt(year);
    if (search)
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { abstract: { contains: search, mode: 'insensitive' } },
        ];
    const [papers, total] = await Promise.all([
        prisma_1.prisma.researchPaper.findMany({
            where, skip, take: parseInt(limit),
            orderBy: { publishedAt: 'desc' },
            include: { category: true, uploadedBy: { select: { id: true, name: true } } },
        }),
        prisma_1.prisma.researchPaper.count({ where }),
    ]);
    res.json({ success: true, data: papers, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
});
router.get('/:slug', async (req, res) => {
    const paper = await prisma_1.prisma.researchPaper.findUnique({
        where: { slug: req.params.slug },
        include: { category: true, uploadedBy: { select: { id: true, name: true } } },
    });
    if (!paper)
        return res.status(404).json({ message: 'Paper tidak ditemukan' });
    res.json({ success: true, data: paper });
});
router.get('/:slug/download', async (req, res) => {
    const paper = await prisma_1.prisma.researchPaper.findUnique({ where: { slug: req.params.slug } });
    if (!paper?.pdfUrl)
        return res.status(404).json({ message: 'File tidak tersedia' });
    await prisma_1.prisma.researchPaper.update({ where: { id: paper.id }, data: { downloadCount: { increment: 1 } } });
    res.json({ success: true, url: paper.pdfUrl });
});
router.post('/', auth_1.authenticate, auth_1.requireEditor, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, abstract, authors, volume, issue, year, doi, keywords, categoryId, status } = req.body;
        const files = req.files;
        const paper = await prisma_1.prisma.researchPaper.create({
            data: {
                title, slug: (0, slugify_1.default)(title, { lower: true, strict: true }), abstract,
                authors: authors ? JSON.parse(authors) : [],
                pdfUrl: files?.pdf?.[0]?.path || null,
                pdfPublicId: files?.pdf?.[0]?.filename || null,
                coverImage: files?.cover?.[0]?.path || null,
                volume, issue, year: year ? parseInt(year) : null, doi,
                keywords: keywords ? JSON.parse(keywords) : [],
                status: status || 'DRAFT',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                uploadedById: req.user.id,
                categoryId: categoryId || null,
            },
        });
        res.status(201).json({ success: true, data: paper });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.put('/:id', auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    try {
        const { title, abstract, authors, status, volume, issue, year, doi, keywords } = req.body;
        const data = { abstract, status, volume, issue, doi };
        if (title) {
            data.title = title;
            data.slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        }
        if (authors)
            data.authors = JSON.parse(authors);
        if (year)
            data.year = parseInt(year);
        if (keywords)
            data.keywords = JSON.parse(keywords);
        if (status === 'PUBLISHED')
            data.publishedAt = new Date();
        const paper = await prisma_1.prisma.researchPaper.update({ where: { id: req.params.id }, data });
        res.json({ success: true, data: paper });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    await prisma_1.prisma.researchPaper.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Paper dihapus' });
});
exports.default = router;
//# sourceMappingURL=research.js.map