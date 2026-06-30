"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/users.ts
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/users — admin only
router.get("/", auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, isActive: true, avatar: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        });
        res.json({ success: true, data: users });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
// POST /api/users — super admin only
router.post("/", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Semua kolom wajib diisi" });
        }
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email sudah terdaftar" });
        const hashed = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: { name, email, password: hashed, role: role || "EDITOR" },
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
        });
        res.status(201).json({ success: true, data: user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// PUT /api/users/:id — admin only
router.put("/:id", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { name, role, isActive, bio } = req.body;
        const data = {};
        if (name !== undefined)
            data.name = name;
        if (role !== undefined)
            data.role = role;
        if (isActive !== undefined)
            data.isActive = isActive;
        if (bio !== undefined)
            data.bio = bio;
        const user = await prisma_1.prisma.user.update({
            where: { id: req.params.id },
            data,
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
        });
        res.json({ success: true, data: user });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map