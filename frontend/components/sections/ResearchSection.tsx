"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import Link from "next/link";

export default function ResearchSection() {
  const [papers, setPapers] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationsApi.list({ type: "PAPER", limit: 5 })
      .then(r => {
        const data = r.data.data || [];
        setFeatured(data[0] || null);
        setPapers(data.slice(1, 5));
      })
      .catch(() => {
        // Fallback ke API lama kalau publications belum siap
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/research?limit=5`)
          .then(r => r.json())
          .then(d => {
            const data = d.data || [];
            setFeatured(data[0] || null);
            setPapers(data.slice(1, 5));
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && !featured;

  return (
    <section id="research" style={{ padding: "100px 0", background: "#F8FAFA" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
            Riset & Wawasan
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14 }}>
              Gagasan yang ditopang<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>inkuiri yang cermat.</em>
            </h2>
            <Link href="/publikasi/paper" style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none", flexShrink: 0 }}>
              Lihat semua riset →
            </Link>
          </div>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", lineHeight: 1.85 }}>
            Paper kebijakan, working paper, dan laporan lapangan dari divisi riset Manara.
          </p>
        </div>

        {/* Featured paper — FULL WIDTH di mobile */}
        <div style={{ marginBottom: "32px" }}>
          {loading && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
              <div style={{ height: "200px", background: "rgba(38,108,135,0.05)" }} />
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "12px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "40%" }} />
                <div style={{ height: "22px", background: "rgba(38,108,135,0.05)", borderRadius: "2px" }} />
              </div>
            </div>
          )}

          {!loading && isEmpty && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "48px clamp(24px,5vw,48px)", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.5)", marginBottom: "12px" }}>
                Paper pertama segera hadir.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", border: "1px solid rgba(38,108,135,0.15)", padding: "8px 20px", borderRadius: "2px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block" }} />
                Manara Papers
              </div>
            </div>
          )}

          {featured && (
            <Link href={`/publikasi/paper/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: "#0F2830", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(38,108,135,0.1)" }}>
                {featured.coverImage ? (
                  <div style={{ height: "180px", background: `url(${featured.coverImage}) center/cover` }} />
                ) : (
                  <div style={{ height: "160px", background: "linear-gradient(135deg,#1a4f63,#266c87)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: "clamp(40px,8vw,80px)", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.06)" }}>
                      Riset
                    </span>
                  </div>
                )}
                <div style={{ padding: "clamp(20px,4vw,28px)" }}>
                  <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86AFAA", marginBottom: "8px" }}>
                    Paper Terbaru{featured.year ? ` · ${featured.year}` : ""}
                  </p>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.3, marginBottom: "10px" }}>
                    {featured.title}
                  </h3>
                  {featured.abstract && (
                    <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.75, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {featured.abstract}
                    </p>
                  )}
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#86AFAA" }}>Baca Paper →</span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Recent papers list */}
        {papers.length > 0 && (
          <div>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
              Paper Lainnya
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {papers.map(p => (
                <Link key={p.id} href={`/publikasi/paper/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(38,108,135,0.08)",
                    transition: "padding-left 0.2s ease",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.paddingLeft = "8px"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.paddingLeft = "0"}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                        {p.year && <span style={{ fontSize: "10px", color: "#266c87", fontWeight: 500 }}>{p.year}</span>}
                        {p.category && <span style={{ fontSize: "10px", color: "#B8CDD2" }}>· {p.category.name}</span>}
                      </div>
                      <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(15px,2.5vw,18px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {p.title}
                      </p>
                    </div>
                    <span style={{ fontSize: "16px", color: "#B8CDD2", flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );
}