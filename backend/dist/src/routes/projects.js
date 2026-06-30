"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/projects.ts
const express_1 = require("express");
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const { status, featured } = req.query;
    const where = {};
    if (status)
        where.status = status;
    if (featured === 'true')
        where.isFeatured = true;
    const projects = await prisma_1.prisma.project.findMany({
        where, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
    res.json({ success: true, data: projects });
});
router.get('/:slug', async (req, res) => {
    const project = await prisma_1.prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project)
        return res.status(404).json({ message: 'Proyek tidak ditemukan' });
    res.json({ success: true, data: project });
});
router.post('/', auth_1.authenticate, auth_1.requireEditor, (0, upload_1.uploadImage)('projects').single('cover'), async (req, res) => {
    try {
        const { title, description, status, category, tags, startDate, endDate, isFeatured, order } = req.body;
        const file = req.file;
        const project = await prisma_1.prisma.project.create({
            data: {
                title, slug: (0, slugify_1.default)(title, { lower: true, strict: true }), description,
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.put('/:id', auth_1.authenticate, auth_1.requireEditor, (0, upload_1.uploadImage)('projects').single('cover'), async (req, res) => {
    try {
        const { title, description, status, category, tags, startDate, endDate, isFeatured, order } = req.body;
        const file = req.file;
        const data = { description, status, category, isFeatured: isFeatured === 'true' };
        if (title) {
            data.title = title;
            data.slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        }
        if (file) {
            data.coverImage = file.path;
            data.coverPublicId = file.filename;
        }
        if (tags)
            data.tags = JSON.parse(tags);
        if (startDate)
            data.startDate = new Date(startDate);
        if (endDate)
            data.endDate = new Date(endDate);
        if (order)
            data.order = parseInt(order);
        const project = await prisma_1.prisma.project.update({ where: { id: req.params.id }, data });
        res.json({ success: true, data: project });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    await prisma_1.prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Proyek dihapus' });
});
exports.default = router;
//# sourceMappingURL=projects.js.map