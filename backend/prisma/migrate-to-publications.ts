import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 100);
}

async function migrateArticles() {
  console.log("📄 Migrasi articles → publications...");

  const articles = await (prisma as any).article.findMany({
    include: { tags: { include: { tag: true } } },
  });

  console.log(`   Ditemukan ${articles.length} artikel`);

  for (const article of articles) {
    // Cek apakah sudah dimigrasi
    const existing = await prisma.publication.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      console.log(`   ⏭ Skip (sudah ada): ${article.title}`);
      continue;
    }

    // Tentukan subtype berdasarkan mediaType lama
    let articleSubtype = "OTHER" as any;
    const mtUpper = (article.mediaType || "").toUpperCase();
    if (mtUpper === "OPINION") articleSubtype = "OPINION";
    else if (mtUpper === "ESSAY") articleSubtype = "ESSAY";
    else if (mtUpper === "ANALYSIS") articleSubtype = "ANALYSIS";
    else if (mtUpper === "COMMENTARY") articleSubtype = "COMMENTARY";

    try {
      const pub = await prisma.publication.create({
        data: {
          type: "ARTICLE",
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt || null,
          content: article.content || null,
          coverImage: article.coverImage || null,
          status: article.status || "DRAFT",
          isFeatured: article.isFeatured || false,
          viewCount: article.viewCount || 0,
          publishedAt: article.publishedAt || null,
          createdAt: article.createdAt,
          authorId: article.authorId,
          categoryId: article.categoryId || null,
          articleSubtype,
        },
      });

      // Migrasi tags
      if (article.tags?.length > 0) {
        for (const articleTag of article.tags) {
          if (!articleTag.tagId) continue;
          await prisma.publicationTag.create({
            data: {
              publicationId: pub.id,
              tagId: articleTag.tagId,
            },
          }).catch(() => {}); // Skip kalau duplicate
        }
      }

      console.log(`   ✓ Artikel: ${article.title}`);
    } catch (err: any) {
      console.error(`   ✗ Gagal: ${article.title} — ${err.message}`);
    }
  }

  console.log("   ✅ Migrasi artikel selesai\n");
}

async function migrateResearch() {
  console.log("📚 Migrasi research → publications...");

  const papers = await (prisma as any).researchPaper.findMany().catch(
    () => (prisma as any).research.findMany().catch(() => [])
  );

  console.log(`   Ditemukan ${papers.length} paper/research`);

  for (const paper of papers) {
    const existing = await prisma.publication.findUnique({
      where: { slug: paper.slug },
    });

    if (existing) {
      console.log(`   ⏭ Skip (sudah ada): ${paper.title}`);
      continue;
    }

    // Tentukan type: kalau punya volume/DOI → JOURNAL, sisanya → PAPER
    const type = (paper.volume || paper.doi || paper.issn) ? "JOURNAL" : "PAPER";

    try {
      await prisma.publication.create({
        data: {
          type: type as any,
          slug: paper.slug,
          title: paper.title,
          abstract: paper.abstract || null,
          content: null,
          coverImage: paper.coverImage || null,
          status: paper.status || "DRAFT",
          isFeatured: false,
          viewCount: 0,
          downloadCount: paper.downloadCount || 0,
          publishedAt: paper.publishedAt || paper.createdAt || null,
          createdAt: paper.createdAt,
          authorId: paper.authorId,
          categoryId: paper.categoryId || null,
          authors: paper.authors || [],
          keywords: paper.keywords || [],
          pdfUrl: paper.pdfUrl || null,
          volume: paper.volume ? parseInt(paper.volume) : null,
          issue: paper.issue ? parseInt(paper.issue) : null,
          year: paper.year ? parseInt(paper.year) : null,
          doi: paper.doi || null,
        },
      });

      console.log(`   ✓ ${type}: ${paper.title}`);
    } catch (err: any) {
      console.error(`   ✗ Gagal: ${paper.title} — ${err.message}`);
    }
  }

  console.log("   ✅ Migrasi research selesai\n");
}

async function migrateFounderSlugs() {
  console.log("👤 Generate slug untuk founders...");

  const founders = await prisma.founder.findMany();

  for (const founder of founders) {
    if (founder.slug) {
      console.log(`   ⏭ Skip (sudah ada slug): ${founder.name}`);
      continue;
    }

    let slug = generateSlug(founder.name);
    // Pastikan slug unik
    let counter = 1;
    let uniqueSlug = slug;
    while (await prisma.founder.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    await prisma.founder.update({
      where: { id: founder.id },
      data: { slug: uniqueSlug },
    });

    console.log(`   ✓ ${founder.name} → /${uniqueSlug}`);
  }

  console.log("   ✅ Slug founder selesai\n");
}

async function main() {
  console.log("🚀 Memulai migrasi data Manara...\n");

  try {
    await migrateArticles();
    await migrateResearch();
    await migrateFounderSlugs();

    // Verifikasi
    const totalPubs = await prisma.publication.count();
    const byType = await prisma.publication.groupBy({
      by: ["type"],
      _count: true,
    });
    const founders = await prisma.founder.findMany({ select: { name: true, slug: true } });

    console.log("📊 HASIL MIGRASI:");
    console.log(`   Total publications: ${totalPubs}`);
    byType.forEach(t => console.log(`   ${t.type}: ${t._count}`));
    console.log("\n👥 FOUNDER SLUGS:");
    founders.forEach(f => console.log(`   ${f.name} → ${f.slug}`));
    console.log("\n✅ Migrasi selesai!");

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();