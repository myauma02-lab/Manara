// app/sitemap.ts
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getArticles() {
  try {
    const res = await fetch(`${API_URL}/articles?limit=100`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getResearch() {
  try {
    const res = await fetch(`${API_URL}/research?limit=100`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects, research] = await Promise.all([
    getArticles(),
    getProjects(),
    getResearch(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/artikel`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/riset`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/proyek`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/media`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/manapeople`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // Dynamic artikel pages
  const articlePages: MetadataRoute.Sitemap = articles.map((a: any) => ({
    url: `${BASE_URL}/artikel/${a.slug}`,
    lastModified: new Date(a.updatedAt || a.publishedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: a.isFeatured ? 0.9 : 0.7,
  }));

  // Dynamic proyek pages
  const projectPages: MetadataRoute.Sitemap = projects.map((p: any) => ({
    url: `${BASE_URL}/proyek/${p.slug}`,
    lastModified: new Date(p.updatedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: p.isFeatured ? 0.8 : 0.6,
  }));

  // Dynamic riset pages
  const researchPages: MetadataRoute.Sitemap = research.map((r: any) => ({
    url: `${BASE_URL}/riset/${r.slug}`,
    lastModified: new Date(r.updatedAt || r.publishedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...projectPages, ...researchPages];
}