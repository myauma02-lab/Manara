// src/routes/media.ts
import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireEditor } from '../middleware/auth';
import { uploadImage, cloudinary } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, requireEditor, async (req, res) => {
  const { folder } = req.query as any;
  const where: any = {};
  if (folder) where.folder = folder;
  const files = await prisma.mediaFile.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: files });
});

router.post('/upload', authenticate, requireEditor,
  uploadImage('library').single('file'),
  async (req, res) => {
    try {
      const file = req.file as any;
      const media = await prisma.mediaFile.create({
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
    } catch (err: any) { res.status(500).json({ message: err.message }); }
  }
);

router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const file = await prisma.mediaFile.findUnique({ where: { id: req.params.id } });
    if (!file) return res.status(404).json({ message: 'File tidak ditemukan' });
    await cloudinary.uploader.destroy(file.publicId);
    await prisma.mediaFile.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'File dihapus' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

export default router;
