"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/shared/ReadingProgress";
import ShareButtons from "@/components/shared/ShareButtons";

export default function ArtikelDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    publicationsApi.detail(String(slug))
      .then(r => {
        const data = r.data.data;
        setArticle(data);
        if (data?.title) document.title = `${data.title} | Manara`;
        // Load related
        if (data?.categoryId || data?.mediaType) {
          publicationsApi.list({ type: data.mediaType, limit: 4 })
            .then(res => setRelated((res.data.data || []).filter((a: any) => a.slug !== slug).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  // Hitung reading time
  const getReadTime = (content: string) => {
    const text = content?.replace(/<[^>]*>/g, " ").trim() || "";
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F4F7F7", paddingTop: "120px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
          {/* Skeleton */}
          {[1,2,3].map(i => (
            <div key={i} style={{ height: i === 1 ? "48px" : "16px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", marginBottom: "16px", width: i === 2 ? "60%" : "100%", animation: "pulse 1.5s infinite" }} />
          ))}
          <div style={{ height: "300px", background: "rgba(38,108,135,0.06)", borderRadius: "4px", marginTop: "32px", animation: "pulse 1.5s infinite" }} />
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </main>
  );

  if (!article) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#7A9AA5", marginBottom: "16px" }}>Artikel tidak ditemukan.</p>
        <Link href="/publikasi/artikel" style={{ color: "#266c87", fontSize: "14px", textDecoration: "none" }}>← Kembali ke Artikel</Link>
      </div>
      <Footer />
    </main>
  );

  const readTime = getReadTime(article.content);

  return (
    <main>
      <Navbar />
      <ReadingProgress />

      {/* Cover image */}
      {article.coverImage && (
        <div style={{
          height: "55vh", maxHeight: "560px",
          background: `url(${article.coverImage}) center/cover`,
          marginTop: "64px",
          position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,40,48,0.1) 0%, rgba(244,247,247,1) 100%)" }} />
        </div>
      )}

      <div style={{ background: "#F4F7F7", paddingBottom: "120px", paddingTop: article.coverImage ? "0" : "100px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "28px 0 24px", flexWrap: "wrap" }}>
            <Link href="/publikasi/artikel" style={{ fontSize: "12px", color: "#B8CDD2", textDecoration: "none" }}>Artikel</Link>
            {article.category && (
              <>
                <span style={{ color: "#B8CDD2", fontSize: "12px" }}>→</span>
                <Link href={`/kategori/${article.category.slug}`} style={{ fontSize: "12px", color: "#7A9AA5", textDecoration: "none" }}>
                  {article.category.name}
                </Link>
              </>
            )}
            <span style={{ color: "#B8CDD2", fontSize: "12px" }}>→</span>
            <span style={{ fontSize: "12px", color: "#7A9AA5" }}>{article.title}</span>
          </div>

          {/* Type badge */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87", background: "rgba(38,108,135,0.08)", padding: "4px 12px", borderRadius: "2px" }}>
              {article.mediaType}
            </span>
            {article.isFeatured && (
              <span style={{ fontSize: "10px", fontWeight: 500, color: "#5F8F8A", background: "rgba(95,143,138,0.1)", padding: "4px 10px", borderRadius: "2px" }}>
                ★ Unggulan
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.12, marginBottom: "24px" }}>
            {article.title}
          </h1>

          {/* Author + meta bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px 0", marginBottom: "12px", borderTop: "1px solid rgba(38,108,135,0.08)", borderBottom: "1px solid rgba(38,108,135,0.08)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(38,108,135,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#266c87", fontWeight: 500, flexShrink: 0 }}>
                {article.author?.name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{article.author?.name}</p>
                {article.publishedAt && (
                  <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", marginLeft: "auto", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#B8CDD2" }}>⏱ {readTime} menit baca</span>
              <span style={{ fontSize: "12px", color: "#B8CDD2" }}>👁 {article.viewCount?.toLocaleString("id") || 0} dibaca</span>
            </div>
          </div>

          {/* Excerpt / lead */}
          {article.excerpt && (
            <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.65, borderLeft: "3px solid #266c87", paddingLeft: "24px", marginBottom: "48px", marginTop: "32px" }}>
              {article.excerpt}
            </p>
          )}

          {/* Article content dengan prose class */}
          <div
            className="prose has-dropcap"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "56px", paddingTop: "32px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
              <span style={{ fontSize: "12px", color: "#B8CDD2", marginRight: "4px" }}>Tags:</span>
              {article.tags.map((t: any) => (
                <span key={t.tag?.id || t.id} style={{ fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", padding: "4px 14px", borderRadius: "2px", color: "#7A9AA5" }}>
                  #{t.tag?.name || t.name}
                </span>
              ))}
            </div>
          )}

          {/* Share + back */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "40px", paddingTop: "32px", borderTop: "1px solid rgba(38,108,135,0.1)", flexWrap: "wrap", gap: "16px" }}>
            <ShareButtons title={article.title} />
            <Link href="/publikasi/artikel" style={{ fontSize: "13px", color: "#B8CDD2", textDecoration: "none" }}>
              ← Semua Artikel
            </Link>
          </div>

          {/* Author card */}
          {article.author && (
            <div style={{ marginTop: "48px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "28px 32px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(38,108,135,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: "#266c87", fontWeight: 500, flexShrink: 0 }}>
                {article.author.name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Tentang Penulis</p>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 400, color: "#0F2830", marginBottom: "6px" }}>{article.author.name}</p>
                {article.author.bio && (
                  <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>{article.author.bio}</p>
                )}
                <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "6px" }}>Kontributor Manara</p>
              </div>
            </div>
          )}
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 40px 0" }}>
            <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "56px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "28px" }}>
                Artikel Terkait
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
                {related.map(r => (
                  <Link key={r.id} href={`/publikasi/artikel/${r.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "border-color 0.2s", height: "100%" }}>
                      <div style={{ aspectRatio: "16/9", background: r.coverImage ? `url(${r.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                      <div style={{ padding: "18px" }}>
                        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87", marginBottom: "6px" }}>{r.mediaType}</p>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, marginBottom: "8px" }}>{r.title}</p>
                        <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{r.author?.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}