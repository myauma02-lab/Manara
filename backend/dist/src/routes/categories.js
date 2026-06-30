"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/categories.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
// GET /api/categories — public
router.get("/", async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { articles: true, researchPapers: true } } },
        });
        res.json({ success: true, data: categories });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
// GET /api/categories/:slug
router.get("/:slug", async (req, res) => {
    try {
        const category = await prisma_1.prisma.category.findUnique({
            where: { slug: req.params.slug },
            include: { _count: { select: { articles: true } } },
        });
        if (!category)
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        res.json({ success: true, data: category });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
// POST /api/categories — admin
router.post("/", auth_1.authenticate, auth_1.requireEditor, (0, express_validator_1.body)("name").notEmpty().withMessage("Nama kategori wajib diisi"), validate_1.validate, async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        const existing = await prisma_1.prisma.category.findUnique({ where: { slug } });
        if (existing)
            return res.status(400).json({ message: "Kategori dengan nama ini sudah ada" });
        const category = await prisma_1.prisma.category.create({
            data: { name, slug, description, color: color || "#266c87" },
        });
        res.status(201).json({ success: true, data: category });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// PUT /api/categories/:id — admin
router.put("/:id", auth_1.authenticate, auth_1.requireEditor, async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const data = { description, color };
        if (name) {
            data.name = name;
            data.slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        }
        const category = await prisma_1.prisma.category.update({
            where: { id: req.params.id },
            data,
        });
        res.json({ success: true, data: category });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
// DELETE /api/categories/:id — admin
router.delete("/:id", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        // Unlink articles first
        await prisma_1.prisma.article.updateMany({
            where: { categoryId: req.params.id },
            data: { categoryId: null },
        });
        await prisma_1.prisma.category.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: "Kategori dihapus" });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map