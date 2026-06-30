"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/founders.ts
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const founders = await prisma_1.prisma.founder.findMany({
        where: { isActive: true }, orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: founders });
});
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (0, upload_1.uploadImage)('founders').single('photo'), async (req, res) => {
    try {
        const { name, role, bio, order, socialLinks } = req.body;
        const file = req.file;
        const founder = await prisma_1.prisma.founder.create({
            data: {
                name, role, bio,
                photo: file?.path || null,
                photoPublicId: file?.filename || null,
                order: parseInt(order) || 0,
                socialLinks: socialLinks ? JSON.parse(socialLinks) : null,
            }
        });
        res.status(201).json({ success: true, data: founder });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, (0, upload_1.uploadImage)('founders').single('photo'), async (req, res) => {
    try {
        const { name, role, bio, order, isActive, socialLinks } = req.body;
        const file = req.file;
        const data = { name, role, bio, order: order ? parseInt(order) : undefined, isActive: isActive === 'true' };
        if (file) {
            data.photo = file.path;
            data.photoPublicId = file.filename;
        }
        if (socialLinks)
            data.socialLinks = JSON.parse(socialLinks);
        const founder = await prisma_1.prisma.founder.update({ where: { id: req.params.id }, data });
        res.json({ success: true, data: founder });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    await prisma_1.prisma.founder.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Founder dihapus' });
});
exports.default = router;
//# sourceMappingURL=founders.js.map