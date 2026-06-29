"use client";
import { useEffect, useState } from "react";
import { articlesApi } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function ArtikelPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articlesApi.list({ limit: 12 })
      .then(r => setArticles(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", minHeight: "100vh", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>Artikel & Jurnal</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
            Gagasan dalam <em style={{ color: "#266c87", fontStyle: "italic" }}>tulisan.</em>
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "480px", lineHeight: 1.85, marginBottom: "64px" }}>
            Esai, analisis, dan laporan dari tim editorial Manara.
          </p>

{loading ? (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "24px" }}>
    {[1,2,3,4,5,6].map(i => (
      <div key={i} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
        <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ height: "10px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "25%" }} />
          <div style={{ height: "20px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "85%" }} />
          <div style={{ height: "20px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "65%" }} />
          <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "40%", marginTop: "8px" }} />
        </div>
      </div>
    ))}
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
  </div>
) : (
            <div style={{ aspectRatio: "16/9", position: "relative", background: "linear-gradient(135deg,#0F2830,#266c87)", overflow: "hidden" }}>
              {articles.map(a => (
                <Link key={a.id} href={`/artikel/${a.slug}`} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", textDecoration: "none", display: "block", transition: "transform 0.2s" }}>
                  <div style={{ aspectRatio: "16/9", position: "relative", background: "linear-gradient(135deg,#0F2830,#266c87)", overflow: "hidden" }}>
  {a.coverImage ? (
    <Image
      src={a.coverImage}
      alt={a.title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
      className="article-cover"
    />
  ) : (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "44px", color: "rgba(255,255,255,0.08)", fontStyle: "italic" }}>
      {a.mediaType}
    </div>
  )}
</div>
                  <div style={{ padding: "24px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87", marginBottom: "8px" }}>{a.mediaType}</p>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "10px" }}>{a.title}</h2>
                    {a.excerpt && <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.7, marginBottom: "16px" }}>{a.excerpt}</p>}
                    <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{a.author?.name}</p>
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
