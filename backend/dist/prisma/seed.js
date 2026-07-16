"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Super Admin
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@manara.id' },
        update: {},
        create: {
            email: 'admin@manara.id',
            password: await bcryptjs_1.default.hash('Manara@2024!', 12),
            name: 'Super Admin Manara',
            role: 'SUPER_ADMIN',
        },
    });
    console.log('✅ Admin user created:', superAdmin.email);
    // Categories
    const categories = await Promise.all([
        prisma.category.upsert({ where: { slug: 'kebijakan-publik' }, update: {}, create: { name: 'Kebijakan Publik', slug: 'kebijakan-publik', color: '#266c87' } }),
        prisma.category.upsert({ where: { slug: 'media-literasi' }, update: {}, create: { name: 'Literasi Media', slug: 'media-literasi', color: '#5F8F8A' } }),
        prisma.category.upsert({ where: { slug: 'budaya-urban' }, update: {}, create: { name: 'Budaya Urban', slug: 'budaya-urban', color: '#A4AA7A' } }),
        prisma.category.upsert({ where: { slug: 'wacana-muda' }, update: {}, create: { name: 'Wacana Muda', slug: 'wacana-muda', color: '#C6AD8A' } }),
    ]);
    console.log('✅ Categories created:', categories.length);
    // Founders
    const founders = [
        { name: 'Mutamimul Yhauma', role: 'Co-Founder', order: 1 },
        { name: 'Oca Aulia Putri Nofianti', role: 'Co-Founder', order: 2 },
        { name: 'Shalsa Bila Agustina', role: 'Co-Founder', order: 3 },
        { name: 'Firstamarya Diffa Oktavinanti', role: 'Co-Founder', order: 4 },
        { name: 'Sultan Isjad Ubaidillah', role: 'Co-Founder', order: 5 },
    ];
    for (const f of founders) {
        await prisma.founder.upsert({
            where: { id: f.name.toLowerCase().replace(/ /g, '-') },
            update: {},
            create: { id: f.name.toLowerCase().replace(/ /g, '-'), ...f },
        }).catch(() => prisma.founder.create({ data: f }));
    }
    console.log('✅ Founders seeded');
    // Active Recruitment
    await prisma.recruitment.upsert({
        where: { id: 'manapeople-2026' },
        update: {},
        create: {
            id: 'manapeople-2026',
            batchName: 'Manapeople 2026 — Batch Pertama',
            description: 'Bergabunglah dengan kolektif intelektual Manara. Kami membuka ruang bagi individu yang percaya gagasan dapat mengubah ruang publik.',
            isOpen: true,
            positions: [
                { id: 'peneliti', name: 'Peneliti & Analis', quota: 5 },
                { id: 'konten', name: 'Kreator Konten & Editor', quota: 5 },
                { id: 'desainer', name: 'Desainer Visual & Media', quota: 5 },
                { id: 'koordinator', name: 'Koordinator Program', quota: 5 },
                { id: 'kontributor', name: 'Kontributor Esai & Opini', quota: 5 },
            ],
        },
    }).catch(() => { });
    console.log('✅ Recruitment seeded');
    // Site Settings
    const defaultSettings = [
        { key: 'site_title', value: 'Manara' },
        { key: 'site_tagline', value: 'Shaping Ideas for the Public Sphere' },
        { key: 'hero_headline', value: 'Di mana gagasan menemukan cahayanya.' },
        { key: 'hero_subheadline', value: 'Ruang intelektual, kreatif, dan berpengetahuan — dibangun oleh dan untuk generasi yang berpikir dengan kedalaman.' },
        { key: 'contact_email', value: 'manararesearch@gmail.com' },
        { key: 'social_instagram', value: 'https://instagram.com/manara_institute' },
        { key: 'social_twitter', value: 'https://x.com/manara_institute' },
        { key: 'social_youtube', value: 'https://youtube.com/@ManaraInstitute' },
    ];
    for (const s of defaultSettings) {
        await prisma.siteSetting.upsert({
            where: { key: s.key }, update: {}, create: { key: s.key, value: s.value }
        });
    }
    console.log('✅ Settings seeded');
    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin login: admin@manara.id');
    console.log('🔑 Password: Manara@2024!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map