import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// ── Verifikasi JWT ──────────────────────────────────
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Tidak terautentikasi" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Akun tidak aktif atau tidak ditemukan" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// ── Role Guards ─────────────────────────────────────

// Hanya superadmin
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "SUPERADMIN") {
    return res.status(403).json({ message: "Akses ditolak: Super Admin only" });
  }
  next();
};

// Superadmin atau Sekjen
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowed = ["SUPERADMIN", "SEKJEN"];
  if (!allowed.includes(req.user?.role || "")) {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};

// Tim Publikasi (semua level)
export const requirePublikasi = (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowed = [
    "SUPERADMIN", "SEKJEN",
    "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR", "PUBLIKASI_WRITER",
  ];
  if (!allowed.includes(req.user?.role || "")) {
    return res.status(403).json({ message: "Akses ditolak: Tim Publikasi only" });
  }
  next();
};

// Editor ke atas (bisa approve)
export const requireEditor = (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowed = [
    "SUPERADMIN", "SEKJEN",
    "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR",
  ];
  if (!allowed.includes(req.user?.role || "")) {
    return res.status(403).json({ message: "Akses ditolak: Editor only" });
  }
  next();
};

// Tim HR
export const requireHR = (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowed = ["SUPERADMIN", "SEKJEN", "HR"];
  if (!allowed.includes(req.user?.role || "")) {
    return res.status(403).json({ message: "Akses ditolak: Tim HR only" });
  }
  next();
};

// Tim Operasional
export const requireOps = (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowed = ["SUPERADMIN", "SEKJEN", "OPERASIONAL"];
  if (!allowed.includes(req.user?.role || "")) {
    return res.status(403).json({ message: "Akses ditolak: Tim Operasional only" });
  }
  next();
};

// Tim Keuangan
export const requireKeuangan = (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowed = ["SUPERADMIN", "SEKJEN", "KEUANGAN"];
  if (!allowed.includes(req.user?.role || "")) {
    return res.status(403).json({ message: "Akses ditolak: Tim Keuangan only" });
  }
  next();
};

// Helper: cek apakah user adalah writer only
export const isWriterOnly = (role: string) => role === "PUBLIKASI_WRITER";