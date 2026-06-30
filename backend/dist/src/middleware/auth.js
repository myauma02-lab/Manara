"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEditor = exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Token tidak ditemukan' });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user || !user.isActive)
            return res.status(401).json({ message: 'Unauthorized' });
        req.user = { id: user.id, role: user.role, email: user.email };
        next();
    }
    catch {
        return res.status(401).json({ message: 'Token tidak valid' });
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, res, next) => {
    if (!req.user || !['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireEditor = (req, res, next) => {
    if (!req.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
};
exports.requireEditor = requireEditor;
//# sourceMappingURL=auth.js.map