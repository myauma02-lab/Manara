"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').notEmpty(), validate_1.validate, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive)
            return res.status(401).json({ message: 'Email atau password salah' });
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ message: 'Email atau password salah' });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token: accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
// GET /api/auth/me
router.get('/me', auth_1.authenticate, async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, createdAt: true },
        });
        res.json({ success: true, user });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// PUT /api/auth/profile
router.put('/profile', auth_1.authenticate, async (req, res) => {
    try {
        const { name, bio } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: { name, bio },
            select: { id: true, name: true, email: true, role: true, avatar: true, bio: true },
        });
        res.json({ success: true, user });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// PUT /api/auth/password
router.put('/password', auth_1.authenticate, (0, express_validator_1.body)('currentPassword').notEmpty(), (0, express_validator_1.body)('newPassword').isLength({ min: 8 }), validate_1.validate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ message: 'User tidak ditemukan' });
        const valid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!valid)
            return res.status(400).json({ message: 'Password lama tidak sesuai' });
        const hashed = await bcryptjs_1.default.hash(newPassword, 12);
        await prisma_1.prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
        res.json({ success: true, message: 'Password berhasil diubah' });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map