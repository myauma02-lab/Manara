"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import Link from "next/link";

export default function FeaturedArticlesSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationsApi.list({ type: "ARTICLE", limit: 4 })
      .then(r => setArticles(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getReadTime = (content: string) => {
    const words = (content || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const featured = articles[0];
  const rest = articles.slice(1);

  if (!loading && articles.length === 0) return null;

  return (
    <section style={{ padding: "100px 0", background: "#F4F7F7" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
              Artikel Terbaru
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14 }}>
              Gagasan yang layak<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>untuk dibaca.</em>
            </h2>
          </div>
          <Link href="/publikasi/artikel" style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none", flexShrink: 0 }}>
            Semua artikel →
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ height: "12px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "30%" }} />
                  <div style={{ height: "20px", background: "rgba(38,108,135,0.06)", borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && featured && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Featured — besar */}
            <Link href={`/publikasi/artikel/${featured.slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#fff",
                border: "1px solid rgba(38,108,135,0.1)",
                borderRadius: "4px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }} className="featured-grid">
                <div style={{
                  minHeight: "280px",
                  background: featured.coverImage
                    ? `url(${featured.coverImage}) center/cover`
                    : "linear-gradient(135deg,#0F2830,#266c87)",
                  position: "relative",
                }}>
                  <span style={{
                    position: "absolute", top: "14px", left: "14px",
                    fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "#86AFAA",
                    background: "rgba(38,108,135,0.3)",
                    border: "1px solid rgba(134,175,170,0.2)",
                    padding: "4px 12px", borderRadius: "2px",
                  }}>
                    ★ Terbaru
                  </span>
                </div>
                <div style={{ padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
                    {featured.articleSubtype || "ARTIKEL"}
                    {featured.category ? ` · ${featured.category.name}` : ""}
                  </p>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "12px" }}>
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {featured.excerpt}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <p style={{ fontSize: "13px", color: "#B8CDD2" }}>{featured.author?.name}</p>
                    {featured.content && (
                      <p style={{ fontSize: "12px", color: "#B8CDD2" }}>· {getReadTime(featured.content)} menit</p>
                    )}
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", marginLeft: "auto" }}>Baca →</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Grid 3 artikel lainnya */}
            {rest.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }} className="three-col-grid">
                {rest.map(a => (
                  <Link key={a.id} href={`/publikasi/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "#fff",
                      border: "1px solid rgba(38,108,135,0.1)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "border-color 0.2s",
                    }}>
                      <div style={{ aspectRatio: "16/9", background: a.coverImage ? `url(${a.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#266c87", marginBottom: "7px" }}>
                          {a.articleSubtype || "ARTIKEL"}
                        </p>
                        <h3 style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, flex: 1, marginBottom: "12px" }}>
                          {a.title}
                        </h3>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(38,108,135,0.07)", paddingTop: "10px" }}>
                          <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{a.author?.name}</p>
                          <span style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 768px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .three-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}