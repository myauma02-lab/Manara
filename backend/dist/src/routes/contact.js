"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/contact.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = require("../utils/prisma");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
router.post("/", (0, express_validator_1.body)("name").notEmpty().withMessage("Nama wajib diisi"), (0, express_validator_1.body)("email").isEmail().withMessage("Email tidak valid"), (0, express_validator_1.body)("message").notEmpty().withMessage("Pesan wajib diisi"), validate_1.validate, async (req, res) => {
    try {
        const { name, email, purpose, message } = req.body;
        const id = `contact_${Date.now()}`;
        await prisma_1.prisma.siteSetting.create({
            data: {
                key: id,
                value: {
                    name, email,
                    purpose: purpose || "Umum",
                    message,
                    createdAt: new Date().toISOString(),
                    read: false,
                },
            },
        });
        // Kirim email notifikasi ke admin (non-blocking)
        (0, emailService_1.sendContactNotification)({ name, email, purpose, message }).catch(() => { });
        res.status(201).json({
            success: true,
            message: "Pesan berhasil dikirim! Kami akan segera menghubungimu.",
        });
    }
    catch {
        res.status(500).json({ message: "Gagal mengirim pesan" });
    }
});
router.get("/", auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
        orderBy: {
        createdAt: "desc",
        },
        });

        res.json({
        success: true,
        data: messages,
        });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
router.delete("/:key", auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    await prisma.contactMessage.delete({ where: { id: req.params.key } }).catch(() => { });
    res.json({ success: true, message: "Pesan dihapus" });
});
exports.default = router;
//# sourceMappingURL=contact.js.map