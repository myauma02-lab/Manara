# 🏛️ Manara — Panduan Instalasi & Deployment

## Struktur Proyek

```
manara/
├── frontend/                    # Next.js 14 App
│   ├── app/                     # App Router pages
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root layout
│   │   ├── artikel/             # Artikel listing & detail
│   │   ├── media/               # Media ecosystem
│   │   ├── riset/               # Research & papers
│   │   ├── manapeople/          # Recruitment page
│   │   └── admin/               # Admin dashboard
│   │       ├── page.tsx         # Dashboard home
│   │       ├── login/           # Admin login
│   │       ├── artikel/         # Artikel management
│   │       ├── media/           # Media management
│   │       ├── founder/         # Founders management
│   │       ├── project/         # Projects management
│   │       ├── research/        # Research papers
│   │       ├── newsletter/      # Newsletter subscribers
│   │       ├── recruitment/     # Manapeople applications
│   │       └── settings/        # Site settings
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── sections/            # Homepage sections
│   │   ├── shared/              # Reusable components
│   │   └── admin/               # Admin-specific components
│   ├── lib/
│   │   ├── api.ts               # Axios API client
│   │   └── store/               # Zustand state stores
│   └── styles/                  # Global CSS
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── routes/              # All API routes
│   │   ├── middleware/          # Auth, upload, error handling
│   │   └── utils/               # Prisma client, helpers
│   └── prisma/
│       ├── schema.prisma        # Database schema
│       └── seed.ts              # Database seeder
│
└── docker-compose.yml           # Docker local setup
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (atau Docker)
- Akun Cloudinary (gratis: cloudinary.com)
- pnpm atau npm

---

## 1. Setup Database (PostgreSQL)

### Opsi A — Docker (Direkomendasikan untuk development)
```bash
docker run -d \
  --name manara_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=manara_db \
  -p 5432:5432 \
  postgres:16-alpine
```

### Opsi B — Install PostgreSQL lokal
```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql-16
sudo systemctl start postgresql
```

---

## 2. Setup Backend

```bash
cd manara/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Edit .env dengan nilai yang sesuai

# Generate Prisma client
npm run db:generate

# Jalankan migrasi database
npm run db:migrate

# Seed data awal (admin user + default data)
npm run db:seed

# Jalankan development server
npm run dev
```

Backend berjalan di: `http://localhost:5000`

**Kredensial Admin Default:**
- Email: `admin@manara.id`
- Password: `Manara@2024!`

---

## 3. Setup Frontend

```bash
cd manara/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# → Pastikan NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Jalankan development server
npm run dev
```

Frontend berjalan di: `http://localhost:3000`

---

## 4. Konfigurasi Cloudinary

1. Daftar di [cloudinary.com](https://cloudinary.com) (gratis)
2. Buka Dashboard → Settings → API Keys
3. Copy Cloud Name, API Key, dan API Secret
4. Tambahkan ke `.env` backend:
   ```
   CLOUDINARY_CLOUD_NAME=xxxx
   CLOUDINARY_API_KEY=xxxx
   CLOUDINARY_API_SECRET=xxxx
   ```

---

## 5. API Endpoints Lengkap

```
# Auth
POST   /api/auth/login              Login admin
GET    /api/auth/me                 Get current user
PUT    /api/auth/profile            Update profile
PUT    /api/auth/password           Change password

# Artikel (Public)
GET    /api/articles                List artikel (filter: page,limit,category,mediaType,featured,search)
GET    /api/articles/:slug          Detail artikel

# Artikel (Admin)
GET    /api/articles/admin/all      Semua artikel
POST   /api/articles                Buat artikel baru (multipart)
PUT    /api/articles/:id            Edit artikel (multipart)
DELETE /api/articles/:id            Hapus artikel

# Founders
GET    /api/founders                List founders (public)
POST   /api/founders                Tambah founder (admin, multipart)
PUT    /api/founders/:id            Edit founder (admin, multipart)
DELETE /api/founders/:id            Hapus founder (admin)

# Projects
GET    /api/projects                List proyek (filter: status,featured)
GET    /api/projects/:slug          Detail proyek
POST   /api/projects                Tambah proyek (admin, multipart)
PUT    /api/projects/:id            Edit proyek (admin)
DELETE /api/projects/:id            Hapus proyek (admin)

# Research Papers
GET    /api/research                List paper (filter: page,category,year,search)
GET    /api/research/:slug          Detail paper
GET    /api/research/:slug/download Download PDF (increment counter)
POST   /api/research                Upload paper (admin, multipart: pdf+cover)
PUT    /api/research/:id            Edit paper (admin)
DELETE /api/research/:id            Hapus paper (admin)

# Newsletter
POST   /api/newsletter/subscribe    Subscribe email
POST   /api/newsletter/unsubscribe  Unsubscribe
GET    /api/newsletter/subscribers  List subscribers (admin)

# Recruitment
GET    /api/recruitment/active      Batch rekrutmen aktif (public)
POST   /api/recruitment/apply       Kirim lamaran (public, multipart: cv+portfolio)
GET    /api/recruitment/status/:id  Cek status lamaran
GET    /api/recruitment             List semua batch (admin)
POST   /api/recruitment             Buat batch baru (admin)
GET    /api/recruitment/:id/applications  Lamaran per batch (admin)
PUT    /api/recruitment/applications/:id  Update status lamaran (admin)

# Media Library
GET    /api/media                   List file (admin)
POST   /api/media/upload            Upload file (admin, multipart)
DELETE /api/media/:id               Hapus file (admin)

# Settings
GET    /api/settings                Semua settings (public)
PUT    /api/settings/:key           Update setting (admin)
GET    /api/settings/admin/stats    Dashboard stats (admin)
```

---

## 6. Admin Dashboard

Akses admin di: `http://localhost:3000/admin`

### Fitur Admin:
| Halaman | Fungsi |
|---|---|
| `/admin` | Dashboard stats & quick actions |
| `/admin/artikel` | List, buat, edit, hapus artikel |
| `/admin/artikel/new` | Editor artikel dengan rich text & image upload |
| `/admin/founder` | Kelola data founders + foto |
| `/admin/project` | Kelola proyek & status |
| `/admin/research` | Upload & kelola paper PDF |
| `/admin/newsletter` | List subscriber newsletter |
| `/admin/recruitment` | Kelola lamaran Manapeople |
| `/admin/gallery` | Media library |
| `/admin/settings` | Pengaturan website |

---

## 7. Deployment Production

### Backend — Railway / Render / VPS

```bash
# Build
npm run build

# Set environment variables di platform deployment
# Jalankan migrasi di production
npx prisma migrate deploy

# Start
npm start
```

### Frontend — Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables di Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://api.manara.id/api
```

### Full Stack dengan Docker

```bash
# Di root folder
cp .env.example .env
# Edit .env sesuai kebutuhan production

docker-compose up -d --build

# Jalankan migrasi
docker exec manara_api npx prisma migrate deploy
docker exec manara_api npx ts-node prisma/seed.ts
```

---

## 8. Database Schema Ringkas

```
users           → Admin & contributors
founders        → Data 5 founders Manara
articles        → Artikel & jurnal (semua media type)
categories      → Kategori konten
tags            → Tag artikel
projects        → Proyek & program Manara
research_papers → Paper PDF yang bisa diunduh
newsletter_subscribers → Subscriber Surat Manara
recruitments    → Batch rekrutmen Manapeople
applications    → Lamaran masuk
media_files     → Library gambar/file
site_settings   → Pengaturan homepage
```

---

## 9. Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand, SWR |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| File Storage | Cloudinary |
| Auth | JWT |
| Deployment | Vercel (FE) + Railway/Render (BE) |

---

## 10. Troubleshooting

**Database connection error:**
```bash
# Pastikan PostgreSQL berjalan
docker ps
# atau
sudo systemctl status postgresql
```

**Prisma client error:**
```bash
cd backend && npm run db:generate
```

**CORS error:**
```bash
# Pastikan FRONTEND_URL di .env backend sesuai
FRONTEND_URL=http://localhost:3000
```

**Image upload gagal:**
```bash
# Periksa kredensial Cloudinary di .env backend
# Pastikan folder 'manara' ada di Cloudinary dashboard
```

---

*Manara CMS v1.0 — Shaping Ideas for the Public Sphere*
