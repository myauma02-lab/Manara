// src/routes/auth.ts
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { validate } from '../middleware/validate';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.isActive) return res.status(401).json({ message: 'Email atau password salah' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Email atau password salah' });

      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token: accessToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      });
    } 
    catch (err) {
  console.error("===== LOGIN ERROR =====");
  console.error(err);

  res.status(500).json({
    message: "Server error",
    error: err instanceof Error ? err.message : String(err),
  });
}
  }
);

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, createdAt: true },
    });
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, bio } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, bio },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true },
    });
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticate,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
  validate,
  async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ message: 'Password lama tidak sesuai' });

      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
      res.json({ success: true, message: 'Password berhasil diubah' });
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
