"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/recruitment.ts
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
// Public: get active recruitment
router.get("/active", async (_req, res) => {
    const recruitment = await prisma_1.prisma.recruitment.findFirst({
        where: { isOpen: true },
        orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: recruitment });
});
// Public: apply
router.post("/apply", upload.fields([{ name: "cv", maxCount: 1 }, { name: "portfolio", maxCount: 1 }]), async (req, res) => {
    try {
        const { recruitmentId, fullName, email, phone, position, motivation, portfolioLink } = req.body;
        const files = req.files;
        const existing = await prisma_1.prisma.application.findFirst({
            where: { recruitmentId, email },
        });
        if (existing) {
            return res.status(400).json({ message: "Email ini sudah mendaftar untuk batch ini" });
        }
        const recruitment = await prisma_1.prisma.recruitment.findUnique({
            where: { id: recruitmentId },
        });
        const application = await prisma_1.prisma.application.create({
            data: {
                recruitmentId, fullName, email, phone, position, motivation,
                cvUrl: files?.cv?.[0]?.path || null,
                portfolioUrl: files?.portfolio?.[0]?.path || null,
                portfolioLink,
                status: "PENDING",
            },
        });
        // Email ke admin + konfirmasi ke pelamar (non-blocking)
        if (recruitment) {
            (0, emailService_1.sendApplicationNotification)({
                fullName, email, position,
                batchName: recruitment.batchName,
            }).catch(() => { });
        }
        (0, emailService_1.sendApplicationConfirmation)({
            fullName, email, position,
            appId: application.id,
        }).catch(() => { });
        res.status(201).json({
            success: true,
            message: "Lamaran berhasil dikirim! Cek email-mu untuk konfirmasi.",
            data: { id: application.id },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Check status
router.get("/status/:id", async (req, res) => {
    const app = await prisma_1.prisma.application.findUnique({
        where: { id: req.params.id },
        select: { id: true, fullName: true, position: true, status: true, createdAt: true },
    });
    if (!app)
        return res.status(404).json({ message: "Lamaran tidak ditemukan" });
    res.json({ success: true, data: app });
});
// Admin: list recruitments
router.get("/", auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    const recruitments = await prisma_1.prisma.recruitment.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: recruitments });
});
// Admin: create batch
router.post("/", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { batchName, description, positions, isOpen, openDate, closeDate } = req.body;
        const recruitment = await prisma_1.prisma.recruitment.create({
            data: {
                batchName, description,
                isOpen: isOpen !== false,
                positions: positions || [],
                openDate: openDate ? new Date(openDate) : null,
                closeDate: closeDate ? new Date(closeDate) : null,
            },
        });
        res.status(201).json({ success: true, data: recruitment });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Admin: applications per batch
router.get("/:id/applications", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    const { status } = req.query;
    const where = { recruitmentId: req.params.id };
    if (status)
        where.status = status;
    const applications = await prisma_1.prisma.application.findMany({
        where, orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: applications });
});
// Admin: update application status
router.put("/applications/:id", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const application = await prisma_1.prisma.application.update({
            where: { id: req.params.id },
            data: { status, adminNotes, reviewedAt: new Date() },
        });
        // Kirim email update status ke pelamar
        (0, emailService_1.sendStatusUpdateEmail)({
            fullName: application.fullName,
            email: application.email,
            position: application.position,
            status,
            adminNotes,
        }).catch(() => { });
        res.json({ success: true, data: application });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=recruitment.js.map