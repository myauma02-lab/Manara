import { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.manarainstitute.id").replace(/\/$/, "");
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.manarainstitute.id/api";

async function fetchPublications(type: string) {
  const items: any[] = [];
  try {
    for (let page = 1; page <= 100; page++) {
      const r = await fetch(`${API}/publications?type=${type}&limit=50&page=${page}`, { next: { revalidate: 3600 } });
      if (!r.ok) break;
      const result = await r.json();
      if (!result.data?.length) break;
      items.push(...result.data);
      if (page >= (result.pagination?.pages || 1)) break;
    }
  } catch { /* Return the pages successfully read so far. */ }
  return items;
}

async function fetchFounders() {
  try {
    const r = await fetch(`${API}/founders`, { next: { revalidate: 3600 } });
    return (await r.json()).data || [];
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, papers, journals, founders] = await Promise.all([
    fetchPublications("ARTICLE"),
    fetchPublications("PAPER"),
    fetchPublications("JOURNAL"),
    fetchFounders(),
  ]);

  const static_: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tentang/manara`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tentang/manifesto`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tentang/founder`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/publikasi`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/publikasi/journal`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/layanan`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/layanan/research`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/layanan/media`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/manapeople`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/cari`, changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...static_,
    ...articles.map((a: any) => ({
      url: `${BASE}/publikasi/artikel/${a.slug}`,
      lastModified: new Date(a.updatedAt || a.publishedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: a.isFeatured ? 0.9 : 0.7,
    })),
    ...papers.map((p: any) => ({
      url: `${BASE}/publikasi/paper/${p.slug}`,
      lastModified: new Date(p.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...journals.map((j: any) => ({
      url: `${BASE}/publikasi/journal/${j.slug}`,
      lastModified: new Date(j.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...founders.filter((f: any) => f.slug).map((f: any) => ({
      url: `${BASE}/tentang/founder/${f.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
