// src/middleware/upload.ts
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

const createStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
      folder: `manara/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    }),
  });

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'manara/papers',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
  }),
});

const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'manara/applications',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
  }),
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Format file tidak didukung'));
};

export const uploadImage = (folder: string) =>
  multer({ storage: createStorage(folder), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export const uploadPDF = multer({
  storage: pdfStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Hanya file PDF yang diizinkan'));
  },
});

export const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Hanya PDF/DOC yang diizinkan'));
  },
});
