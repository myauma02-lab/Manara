// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }
  next();
};

export const requireEditor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }
  next();
};
