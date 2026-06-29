"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { articlesApi } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/shared/ReadingProgress";
import ShareButtons from "@/components/shared/ShareButtons";


export default function ArtikelDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articlesApi.detail(String(slug))
      .then(r => {
        setArticle(r.data.data);
        // Update page title dynamically
        if (r.data.data?.title) {
          document.title = `${r.data.data.title} | Manara`;
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
          Memuat artikel...
        </p>
      </div>
      <Footer />
    </main>
  );

  if (!article) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", color: "#7A9AA5", marginBottom: "16px" }}>
          Artikel tidak ditemukan
        </p>
        <Link href="/artikel" style={{ color: "#266c87", fontSize: "14px", textDecoration: "none" }}>
          ← Kembali ke Artikel
        </Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />
      <ReadingProgress />
      <div style={{ paddingTop: "100px", paddingBottom: "120px", background: "#F4F7F7" }}>
        {article.coverImage && (
          <div style={{
            height: "50vh",
            maxHeight: "500px",
            background: `url(${article.coverImage}) center/cover`,
            marginBottom: "0",
            opacity: 0.85,
          }} />
        )}
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
          <Link href="/artikel" style={{
            display: "inline-block",
            fontSize: "12px",
            color: "#B8CDD2",
            textDecoration: "none",
            marginBottom: "28px",
            marginTop: "32px",
          }}>
            ← Kembali ke Artikel
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87" }}>
              {article.mediaType}
            </span>
            {article.category && (
              <>
                <span style={{ color: "#B8CDD2" }}>·</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{article.category.name}</span>
              </>
            )}
            {article.isFeatured && (
              <span style={{ fontSize: "10px", color: "#266c87", fontWeight: 500, background: "rgba(38,108,135,0.08)", padding: "2px 8px", borderRadius: "2px" }}>
                ★ Unggulan
              </span>
            )}
          </div>

          <h1 style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(28px,5vw,52px)",
            fontWeight: 300,
            color: "#0F2830",
            lineHeight: 1.14,
            marginBottom: "24px",
          }}>
            {article.title}
          </h1>

          {/* Author + meta */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingBottom: "24px",
            marginBottom: "32px",
            borderBottom: "1px solid rgba(38,108,135,0.1)",
            flexWrap: "wrap",
          }}>
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "50%",
              background: "rgba(38,108,135,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", color: "#266c87", fontWeight: 500, flexShrink: 0,
            }}>
              {article.author?.name?.charAt(0)}
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>
                {article.author?.name}
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", marginLeft: "auto", flexWrap: "wrap" }}>
              {article.readTime && (
                <span style={{ fontSize: "12px", color: "#B8CDD2" }}>
                  ⏱ {article.readTime} menit baca
                </span>
              )}
              <span style={{ fontSize: "12px", color: "#B8CDD2" }}>
                👁 {article.viewCount} kali dibaca
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p style={{
              fontFamily: "Georgia,serif",
              fontSize: "20px",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#3A5560",
              lineHeight: 1.6,
              borderLeft: "2px solid #266c87",
              paddingLeft: "20px",
              marginBottom: "40px",
            }}>
              {article.excerpt}
            </p>
          )}

          {/* Content */}
         <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "48px",
  paddingTop: "32px",
  borderTop: "1px solid rgba(38,108,135,0.1)",
  flexWrap: "wrap",
  gap: "16px",
}}>
  <ShareButtons title={article.title} />
  <Link href="/artikel" style={{ fontSize: "13px", color: "#B8CDD2", textDecoration: "none" }}>
    ← Kembali ke Artikel
  </Link>
</div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(38,108,135,0.1)",
            }}>
              {article.tags.map((t: any) => (
                <span key={t.tag?.id || t.id} style={{
                  fontSize: "12px",
                  border: "1px solid rgba(38,108,135,0.15)",
                  padding: "5px 14px",
                  borderRadius: "2px",
                  color: "#7A9AA5",
                }}>
                  #{t.tag?.name || t.name}
                </span>
              ))}
            </div>
          )}

          {/* Related */}
          {article.related?.length > 0 && (
            <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#B8CDD2",
                marginBottom: "24px",
              }}>
                Artikel Terkait
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                {article.related.map((r: any) => (
                  <Link key={r.id} href={`/artikel/${r.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "#fff",
                      border: "1px solid rgba(38,108,135,0.1)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                    }}>
                      <div style={{
                        aspectRatio: "16/9",
                        background: r.coverImage
                          ? `url(${r.coverImage}) center/cover`
                          : "linear-gradient(135deg,#0F2830,#266c87)",
                      }} />
                      <div style={{ padding: "14px" }}>
                        <p style={{ fontSize: "10px", color: "#266c87", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                          {r.mediaType}
                        </p>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>
                          {r.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}