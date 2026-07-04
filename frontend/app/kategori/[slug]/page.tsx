"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function KategoriPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "";
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load kategori info
    fetch(`${API_URL}/api/categories/${slug}`)
      .then(r => r.json())
      .then(d => setCategory(d.data))
      .catch(() => {});

    // Load artikel per kategori
    publicationsApi.list({ category: slug, limit: 20 })
      .then(r => setArticles(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <Link href="/artikel" style={{ fontSize: "12px", color: "#B8CDD2", textDecoration: "none" }}>Artikel</Link>
            <span style={{ color: "#B8CDD2", fontSize: "12px" }}>→</span>
            <span style={{ fontSize: "12px", color: "#7A9AA5" }}>
              {category?.name || slug}
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              {category?.color && (
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: category.color }} />
              )}
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: category?.color || "#266c87" }}>
                Kategori
              </p>
            </div>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "12px" }}>
              {category?.name || String(slug).replace(/-/g, " ")}
            </h1>
            {category?.description && (
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, maxWidth: "520px" }}>
                {category.description}
              </p>
            )}
          </div>

          {/* Articles */}
          {loading ? (
            <p style={{ color: "#7A9AA5" }}>Memuat artikel...</p>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>
                Belum ada artikel di kategori ini
              </p>
              <Link href="/artikel" style={{ color: "#266c87", fontSize: "14px", textDecoration: "none" }}>
                ← Lihat semua artikel
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "24px" }}>
              {articles.map(a => (
                <Link key={a.id} href={`/artikel/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "all 0.25s" }}>
                    <div style={{ aspectRatio: "16/9", background: a.coverImage ? `url(${a.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                    <div style={{ padding: "24px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: category?.color || "#266c87", marginBottom: "8px" }}>
                        {a.mediaType}
                      </p>
                      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "8px" }}>
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.7, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {a.excerpt}
                        </p>
                      )}
                      <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{a.author?.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}