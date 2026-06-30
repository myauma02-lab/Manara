"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/newsletter.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
router.post("/subscribe", (0, express_validator_1.body)("email").isEmail(), validate_1.validate, async (req, res) => {
    try {
        const { email, name } = req.body;
        const existing = await prisma_1.prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (existing) {
            if (existing.status === "ACTIVE") {
                return res.status(400).json({ message: "Email sudah terdaftar" });
            }
            await prisma_1.prisma.newsletterSubscriber.update({
                where: { email },
                data: { status: "ACTIVE", name },
            });
            return res.json({ success: true, message: "Langganan diaktifkan kembali!" });
        }
        await prisma_1.prisma.newsletterSubscriber.create({
            data: { email, name, status: "ACTIVE", confirmedAt: new Date() },
        });
        // Email konfirmasi (non-blocking)
        (0, emailService_1.sendNewsletterConfirmation)({ email, name }).catch(() => { });
        res.status(201).json({
            success: true,
            message: "Berhasil berlangganan Surat Manara!",
        });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/unsubscribe", (0, express_validator_1.body)("email").isEmail(), validate_1.validate, async (req, res) => {
    await prisma_1.prisma.newsletterSubscriber.update({
        where: { email: req.body.email },
        data: { status: "UNSUBSCRIBED" },
    }).catch(() => { });
    res.json({ success: true, message: "Berhasil berhenti berlangganan" });
});
router.get("/subscribers", auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    const subscribers = await prisma_1.prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: subscribers, total: subscribers.length });
});
exports.default = router;
//# sourceMappingURL=newsletter.js.map