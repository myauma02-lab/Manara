import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://manara.my.id";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchPublications(type: string) {
  try {
    const r = await fetch(`${API}/publications?type=${type}&limit=100`, { next: { revalidate: 3600 } });
    return (await r.json()).data || [];
  } catch { return []; }
}

async function fetchProjects() {
  try {
    const r = await fetch(`${API}/projects`, { next: { revalidate: 3600 } });
    return (await r.json()).data || [];
  } catch { return []; }
}

async function fetchFounders() {
  try {
    const r = await fetch(`${API}/founders`, { next: { revalidate: 3600 } });
    return (await r.json()).data || [];
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, papers, journals, projects, founders] = await Promise.all([
    fetchPublications("ARTICLE"),
    fetchPublications("PAPER"),
    fetchPublications("JOURNAL"),
    fetchProjects(),
    fetchFounders(),
  ]);

  const static_: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tentang/manara`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tentang/manifesto`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tentang/founder`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/publikasi`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/publikasi/artikel`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/publikasi/paper`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/publikasi/journal`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/layanan`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/layanan/research`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/layanan/media`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insight`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/insight/newsletter`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/insight/suara-manara`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/insight/podcast`, changeFrequency: "weekly", priority: 0.6 },
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
    ...projects.map((p: any) => ({
      url: `${BASE}/layanan/research/${p.slug}`,
      lastModified: new Date(p.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...founders.filter((f: any) => f.slug).map((f: any) => ({
      url: `${BASE}/tentang/founder/${f.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}