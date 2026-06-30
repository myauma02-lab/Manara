"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/media.ts
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    const { folder } = req.query;
    const where = {};
    if (folder)
        where.folder = folder;
    const files = await prisma_1.prisma.mediaFile.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: files });
});
router.post('/upload', auth_1.authenticate, auth_1.requireEditor, (0, upload_1.uploadImage)('library').single('file'), async (req, res) => {
    try {
        const file = req.file;
        const media = await prisma_1.prisma.mediaFile.create({
            data: {
                filename: file.originalname,
                url: file.path,
                publicId: file.filename,
                mimeType: file.mimetype,
                size: file.size,
                folder: req.body.folder || 'library',
                alt: req.body.alt || null,
            }
        });
        res.status(201).json({ success: true, data: media });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete('/:id', auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    try {
        const file = await prisma_1.prisma.mediaFile.findUnique({ where: { id: req.params.id } });
        if (!file)
            return res.status(404).json({ message: 'File tidak ditemukan' });
        await upload_1.cloudinary.uploader.destroy(file.publicId);
        await prisma_1.prisma.mediaFile.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'File dihapus' });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=media.js.map