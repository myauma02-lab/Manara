"use client";
import { useEffect, useState, useCallback } from "react";
import { projectsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUS_CONFIG: any = {
  UPCOMING: { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.08)" },
  ACTIVE: { label: "Aktif", color: "#3F6F6A", bg: "rgba(63,111,106,0.1)" },
  COMPLETED: { label: "Selesai", color: "#6E7448", bg: "rgba(110,116,72,0.1)" },
  ARCHIVED: { label: "Diarsipkan", color: "#7A9AA5", bg: "rgba(122,154,165,0.1)" },
};

const GRADS = [
  "linear-gradient(135deg,#0F2830,#266c87)",
  "linear-gradient(135deg,#1a4f63,#5F8F8A)",
  "linear-gradient(135deg,#3F6F6A,#266c87)",
  "linear-gradient(135deg,#6E7448,#A4AA7A)",
];

export default function ResearchLayananPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    projectsApi.list()
      .then(r => setProjects(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? projects.filter(p => p.status === filter) : projects;

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "80px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 80% 30%, rgba(38,108,135,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "28px", flexWrap: "wrap" }}>
            <Link href="/layanan" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Layanan</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>Research</span>
          </div>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.55)", marginBottom: "16px" }}>
            Layanan · Research
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "20px" }}>
            Riset yang<br />
            <em style={{ color: "#86AFAA", fontStyle: "italic" }}>meninggalkan jejak.</em>
          </h1>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "520px", marginBottom: "36px" }}>
            Proyek, program, dan inisiatif riset Manara yang dibangun dari keyakinan bahwa gagasan dapat mengubah ruang publik.
          </p>

          {/* Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["", "UPCOMING", "ACTIVE", "COMPLETED"].map(s => {
              const cfg = s ? STATUS_CONFIG[s] : null;
              return (
                <button key={s} onClick={() => setFilter(s)}
                  style={{ padding: "8px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em", border: `1px solid ${filter === s ? "rgba(134,175,170,0.4)" : "rgba(38,108,135,0.2)"}`, borderRadius: "2px", background: filter === s ? "rgba(38,108,135,0.2)" : "transparent", color: filter === s ? "#86AFAA" : "rgba(134,175,170,0.4)", cursor: "pointer", transition: "all 0.2s" }}>
                  {s === "" ? "Semua" : cfg?.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ background: "#F4F7F7", padding: "64px clamp(20px,5vw,40px) 120px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "16px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "80%" }} />
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "rgba(238,244,246,0.6)", marginBottom: "12px" }}>
                {filter ? "Tidak ada proyek dengan status ini." : "Belum ada proyek."}
              </p>
              {filter && (
                <button onClick={() => setFilter("")}
                  style={{ background: "transparent", border: "1px solid rgba(38,108,135,0.25)", color: "#86AFAA", padding: "10px 24px", borderRadius: "2px", fontSize: "13px", cursor: "pointer", marginTop: "16px" }}>
                  Lihat Semua
                </button>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* Featured */}
              {!filter && filtered.find(p => p.isFeatured) && (() => {
                const fp = filtered.find(p => p.isFeatured)!;
                const st = STATUS_CONFIG[fp.status] || STATUS_CONFIG.UPCOMING;
                return (
                  <div style={{ marginBottom: "40px" }}>
                    <Link href={`/layanan/research/${fp.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}
                        className="featured-research-grid">
                        <div style={{ minHeight: "280px", background: fp.coverImage ? `url(${fp.coverImage}) center/cover` : GRADS[0], position: "relative" }}>
                          <span style={{ position: "absolute", top: "14px", left: "14px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.25)", border: "1px solid rgba(134,175,170,0.2)", padding: "4px 12px", borderRadius: "2px" }}>
                            ★ Unggulan
                          </span>
                        </div>
                        <div style={{ padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 500, padding: "4px 12px", borderRadius: "2px", background: st.bg, color: st.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px", width: "fit-content" }}>
                            {st.label}
                          </span>
                          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "12px" }}>
                            {fp.title}
                          </h2>
                          <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, marginBottom: "20px" }}>
                            {fp.description?.substring(0, 180)}{fp.description?.length > 180 ? "..." : ""}
                          </p>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87" }}>Lihat Proyek →</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })()}

              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
                {filtered.filter(p => !p.isFeatured || filter).map((p, i) => {
                  const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.UPCOMING;
                  return (
                    <Link key={p.id} href={`/layanan/research/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "border-color 0.2s" }}>
                        <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : GRADS[i % GRADS.length], position: "relative" }}>
                          <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                        <div style={{ padding: "22px", flex: 1, display: "flex", flexDirection: "column" }}>
                          {p.category && (
                            <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87", marginBottom: "8px" }}>
                              {p.category}
                            </p>
                          )}
                          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "8px", flex: 1 }}>
                            {p.title}
                          </h3>
                          <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.description}
                          </p>
                          {p.tags?.length > 0 && (
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                              {p.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} style={{ fontSize: "10px", border: "1px solid rgba(38,108,135,0.12)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(38,108,135,0.07)" }}>
                            <span style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Selengkapnya →</span>
                            {p.startDate && (
                              <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{new Date(p.startDate).getFullYear()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 640px) {
          .featured-research-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}