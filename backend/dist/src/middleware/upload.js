"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCV = exports.uploadPDF = exports.uploadImage = exports.cloudinary = void 0;
// src/middleware/upload.ts
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createStorage = (folder) => new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (_req, file) => ({
        folder: `manara/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    }),
});
const pdfStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (_req, file) => ({
        folder: 'manara/papers',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    }),
});
const cvStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (_req, file) => ({
        folder: 'manara/applications',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw',
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    }),
});
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error('Format file tidak didukung'));
};
const uploadImage = (folder) => (0, multer_1.default)({ storage: createStorage(folder), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadImage = uploadImage;
exports.uploadPDF = (0, multer_1.default)({
    storage: pdfStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf')
            cb(null, true);
        else
            cb(new Error('Hanya file PDF yang diizinkan'));
    },
});
exports.uploadCV = (0, multer_1.default)({
    storage: cvStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowed.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Hanya PDF/DOC yang diizinkan'));
    },
});
//# sourceMappingURL=upload.js.map