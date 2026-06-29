// app/artikel/[slug]/metadata.ts
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/articles/${params.slug}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const article = data.data;

    if (!article) return { title: "Artikel | Manara" };

    const ogImageUrl = article.coverImage
      ? article.coverImage
      : `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&subtitle=${encodeURIComponent(article.excerpt || "")}&type=${encodeURIComponent(article.mediaType)}`;

    return {
      title: article.title,
      description: article.excerpt || article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt || "",
        type: "article",
        url: `${SITE_URL}/artikel/${params.slug}`,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
        authors: [article.author?.name],
        publishedTime: article.publishedAt,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt || "",
        images: [ogImageUrl],
      },
    };
  } catch {
    return { title: "Artikel | Manara" };
  }
}