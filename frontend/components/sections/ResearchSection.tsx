"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import Link from "next/link";

export default function ResearchSection() {
  const [papers, setPapers] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationsApi.list({ limit: 5, type: "PAPER" })
      .then(r => {
        const data = r.data.data || [];
        setFeatured(data[0] || null);
        setPapers(data.slice(1, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && !featured;

  return (
    <section id="research" style={{ padding: "120px 0", background: "#F8FAFA" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", marginBottom: "64px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>
              Riset & Wawasan
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,3.5vw,50px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14, marginBottom: "20px" }}>
              Gagasan yang ditopang<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>inkuiri yang cermat.</em>
            </h2>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.85, marginBottom: "28px" }}>
              Paper kebijakan, working paper, dan laporan lapangan dari divisi riset Manara.
            </p>
            <Link href="/riset" style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Lihat semua riset →
            </Link>
          </div>

          {/* Featured paper */}
          <div>
            {loading && (
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "180px", background: "rgba(38,108,135,0.05)", animation: "pulse 1.5s infinite" }} />
                <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ height: "12px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "40%" }} />
                  <div style={{ height: "22px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "90%" }} />
                  <div style={{ height: "14px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "70%" }} />
                </div>
              </div>
            )}

            {!loading && isEmpty && (
              <div style={{ background: "#0F2830", borderRadius: "4px", padding: "48px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.5)", marginBottom: "12px" }}>
                  Paper pertama segera hadir.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", border: "1px solid rgba(38,108,135,0.15)", padding: "8px 20px", borderRadius: "2px" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block" }} />
                  Manara Papers
                </div>
              </div>
            )}

            {featured && (
              <Link href={`/riset/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "#0F2830", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(38,108,135,0.1)", transition: "border-color 0.2s" }}>
                  {featured.coverImage ? (
                    <div style={{ height: "180px", background: `url(${featured.coverImage}) center/cover` }} />
                  ) : (
                    <div style={{ height: "180px", background: "linear-gradient(135deg,#1a4f63,#266c87)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "Georgia,serif", fontSize: "80px", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.07)" }}>
                        Riset
                      </span>
                    </div>
                  )}
                  <div style={{ padding: "28px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86AFAA", marginBottom: "10px" }}>
                      Paper Terbaru {featured.year ? `· ${featured.year}` : ""}
                    </p>
                    <h3 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.3, marginBottom: "10px" }}>
                      {featured.title}
                    </h3>
                    <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.75, marginBottom: "16px",
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {featured.abstract}
                    </p>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#86AFAA" }}>Baca Paper →</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent papers list */}
        {papers.length > 0 && (
          <div>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "20px" }}>
              Paper Lainnya
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {papers.map(p => (
                <Link key={p.id} href={`/riset/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "20px",
                    padding: "20px 0",
                    borderBottom: "1px solid rgba(38,108,135,0.08)",
                    transition: "padding-left 0.2s ease",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.paddingLeft = "8px"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        {p.year && <span style={{ fontSize: "10px", color: "#266c87", fontWeight: 500 }}>{p.year}</span>}
                        {p.category && <span style={{ fontSize: "10px", color: "#B8CDD2" }}>· {p.category.name}</span>}
                      </div>
                      <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, transition: "color 0.2s" }}>
                        {p.title}
                      </p>
                    </div>
                    <span style={{ fontSize: "16px", color: "#B8CDD2", flexShrink: 0, marginTop: "4px" }}>→</span>
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