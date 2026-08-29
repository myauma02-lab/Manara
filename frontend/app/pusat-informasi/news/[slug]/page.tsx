"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { infoApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocialShare from "@/components/shared/ShareButtons";

export default function NewsDetailPage() {
const params = useParams();
const slug = params.slug as string;

const [news, setNews] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (!slug) return;

infoApi
  .detail(slug)
  .then((res) => {
    setNews(res.data.data);
  })
  .catch((error) => {
    console.error("Gagal memuat berita:", error);
    setNews(null);
  })
  .finally(() => {
    setLoading(false);
  });

}, [slug]);

if (loading) {
  return (
    <main>
      <Navbar />

      <div
        style={{
          minHeight: "70vh",
          paddingTop: "160px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F4F7F7",
        }}
      >
        <p style={{ color: "#7A9AA5" }}>
          Memuat berita...
        </p>
      </div>

      <Footer />
    </main>
  );
}

if (!news) {
  return (
    <main>
      <Navbar />

      <div
        style={{
          minHeight: "70vh",
          padding: "160px 20px 80px",
          textAlign: "center",
          background: "#F4F7F7",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 300,
            fontSize: "36px",
            color: "#0F2830",
            marginBottom: "16px",
          }}
        >
          Berita tidak ditemukan
        </h1>

      <p
        style={{
          color: "#7A9AA5",
          marginBottom: "24px",
        }}
      >
        Artikel yang kamu cari mungkin sudah dihapus atau tidak tersedia.
      </p>

      <Link
        href="/pusat-informasi/news"
        style={{
          color: "#266c87",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        ← Kembali ke News
      </Link>
    </div>

    <Footer />
  </main>
  );
}

const articleUrl =
  typeof window !== "undefined"
    ? window.location.href
    : `https://manarainstitute.id/pusat-informasi/news/${slug}`;

  return (
    <main>
      <Navbar />

    {/* HERO */}
  <section
    style={{
      paddingTop: "150px",
      paddingBottom: "64px",
      background: "#0F2830",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 60% 60% at 20% 60%, rgba(38,108,135,0.2) 0%, transparent 60%)",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0 clamp(20px,5vw,40px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          fontSize: "12px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/pusat-informasi"
          style={{
            color: "rgba(134,175,170,0.4)",
            textDecoration: "none",
          }}
        >
          Pusat Informasi
        </Link>

        <span style={{ color: "rgba(134,175,170,0.3)" }}>
          →
        </span>

        <Link
          href="/pusat-informasi/news"
          style={{
            color: "rgba(134,175,170,0.4)",
            textDecoration: "none",
          }}
        >
          News
        </Link>
      </div>

      {/* Source */}
      {news?.source && (
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#266c87",
            marginBottom: "16px",
          }}
        >
          {news.source}
        </p>
      )}

      {/* Title */}
      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(36px, 5vw, 60px)",
          fontWeight: 300,
          color: "#EEF4F6",
          lineHeight: 1.12,
          marginBottom: "20px",
        }}
      >
        {news.title}
      </h1>

      {/* Excerpt */}
      {news.excerpt && (
        <p
          style={{
            fontSize: "18px",
            fontWeight: 300,
            color: "rgba(238,244,246,0.6)",
            lineHeight: 1.75,
            maxWidth: "750px",
            marginBottom: "24px",
          }}
        >
          {news.excerpt}
        </p>
      )}

      {/* Date */}
      {news.publishedAt && (
        <p
          style={{
            fontSize: "13px",
            color: "rgba(134,175,170,0.55)",
          }}
        >
          {new Date(news.publishedAt).toLocaleDateString(
            "id-ID",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </p>
      )}
    </div>
  </section>

  {/* COVER IMAGE */}
  {news.coverImage && (
    <section
      style={{
        background: "#F4F7F7",
        padding: "40px 20px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <img
          src={news.coverImage}
          alt={news.title}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            borderRadius: "4px",
            display: "block",
          }}
        />
      </div>
    </section>
  )}

  {/* ARTICLE */}
  <section
    style={{
      background: "#F4F7F7",
      padding: "50px 20px 100px",
    }}
  >
    <article
      style={{
        maxWidth: "760px",
        margin: "0 auto",
      }}
    >
      {/* Tags */}
      {news.tags?.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "30px",
          }}
        >
          {news.tags.map((tag: string) => (
            <span
              key={tag}
              style={{
                fontSize: "11px",
                padding: "5px 10px",
                border: "1px solid rgba(38,108,135,0.15)",
                borderRadius: "3px",
                color: "#266c87",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{
          __html: news.content || "",
        }}
      />

      {/* DIVIDER */}
      <div
        style={{
          height: "1px",
          background: "rgba(38,108,135,0.15)",
          margin: "56px 0 28px",
        }}
      />

      {/* SHARE BUTTON */}
      <SocialShare
        title={news.title}
        url={articleUrl}
      />
    </article>
  </section>

  <Footer />

  <style>{`
    .article-content {
      font-size: 17px;
      line-height: 1.9;
      color: #3A5560;
    }

    .article-content p {
      margin-bottom: 24px;
    }

    .article-content h2 {
      font-family: Georgia, serif;
      font-size: 30px;
      font-weight: 400;
      color: #0F2830;
      margin-top: 48px;
      margin-bottom: 20px;
    }

    .article-content h3 {
      font-family: Georgia, serif;
      font-size: 24px;
      font-weight: 400;
      color: #0F2830;
      margin-top: 36px;
      margin-bottom: 16px;
    }

    .article-content img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 32px 0;
    }

    .article-content a {
      color: #266c87;
      text-decoration: underline;
    }

    .article-content blockquote {
      border-left: 3px solid #266c87;
      padding-left: 20px;
      margin: 32px 0;
      color: #52717C;
      font-style: italic;
    }
  `}</style>
</main>
  );
}
