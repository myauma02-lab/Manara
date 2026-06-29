// src/routes/founders.ts
import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';

const router = Router();

router.get('/', async (_req, res) => {
  const founders = await prisma.founder.findMany({
    where: { isActive: true }, orderBy: { order: 'asc' }
  });
  res.json({ success: true, data: founders });
});

router.post('/', authenticate, requireAdmin, uploadImage('founders').single('photo'), async (req, res) => {
  try {
    const { name, role, bio, order, socialLinks } = req.body;
    const file = req.file as any;
    const founder = await prisma.founder.create({
      data: {
        name, role, bio,
        photo: file?.path || null,
        photoPublicId: file?.filename || null,
        order: parseInt(order) || 0,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : null,
      }
    });
    res.status(201).json({ success: true, data: founder });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authenticate, requireAdmin, uploadImage('founders').single('photo'), async (req, res) => {
  try {
    const { name, role, bio, order, isActive, socialLinks } = req.body;
    const file = req.file as any;
    const data: any = { name, role, bio, order: order ? parseInt(order) : undefined, isActive: isActive === 'true' };
    if (file) { data.photo = file.path; data.photoPublicId = file.filename; }
    if (socialLinks) data.socialLinks = JSON.parse(socialLinks);
    const founder = await prisma.founder.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: founder });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.founder.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Founder dihapus' });
});

export default router;
