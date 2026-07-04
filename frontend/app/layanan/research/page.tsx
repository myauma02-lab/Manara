"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUS_CONFIG: any = {
  UPCOMING: { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.1)" },
  ACTIVE: { label: "Aktif", color: "#3F6F6A", bg: "rgba(95,143,138,0.15)" },
  COMPLETED: { label: "Selesai", color: "#6E7448", bg: "rgba(164,170,122,0.2)" },
  ARCHIVED: { label: "Diarsipkan", color: "#7A9AA5", bg: "rgba(184,205,210,0.2)" },
};

const GRAD = [
  "linear-gradient(135deg,#0F2830,#266c87)",
  "linear-gradient(135deg,#1a4f63,#5F8F8A)",
  "linear-gradient(135deg,#3F6F6A,#266c87)",
  "linear-gradient(135deg,#6E7448,#A4AA7A)",
  "linear-gradient(135deg,#266c87,#86AFAA)",
];

export default function ProyekPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    projectsApi.list()
      .then(r => setProjects(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? projects.filter(p => p.status === filter)
    : projects;

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

          {/* Header */}
          <div style={{ marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>
              Research
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
              Inisiatif yang<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>meninggalkan jejak.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", lineHeight: 1.85, marginBottom: "40px" }}>
              Research inisiatif Manara yang dibangun dari keyakinan bahwa gagasan dapat mengubah ruang publik.
            </p>

            {/* Filter */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["", "UPCOMING", "ACTIVE", "COMPLETED"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: "8px 20px",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    border: "1px solid rgba(38,108,135,0.2)",
                    borderRadius: "2px",
                    background: filter === s ? "#266c87" : "transparent",
                    color: filter === s ? "#fff" : "#3A5560",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s === "" ? "Semua" : STATUS_CONFIG[s]?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "24px" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "30%" }} />
                    <div style={{ height: "22px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "80%" }} />
                    <div style={{ height: "14px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "26px", color: "rgba(238,244,246,0.7)", marginBottom: "12px" }}>
                {filter ? "Tidak ada research dengan status ini" : "Belum Ada Research"}
              </p>
              <p style={{ fontSize: "14px", color: "rgba(134,175,170,0.4)", lineHeight: 1.8 }}>
                Research Manara akan segera hadir.
              </p>
            </div>
          ) : (
            <>
              {/* Featured project */}
              {!filter && projects.find(p => p.isFeatured) && (
                <div style={{ marginBottom: "48px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
                    ★ Research Unggulan
                  </p>
                  {(() => {
                    const fp = projects.find(p => p.isFeatured);
                    const st = STATUS_CONFIG[fp.status] || STATUS_CONFIG.UPCOMING;
                    return (
                      <Link href={`/layanan/research/${fp.slug}`} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{
                          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0",
                          background: "#fff", border: "1px solid rgba(38,108,135,0.1)",
                          borderRadius: "4px", overflow: "hidden",
                          transition: "border-color 0.2s",
                        }}>
                          <div style={{ aspectRatio: "16/10", background: fp.coverImage ? `url(${fp.coverImage}) center/cover` : GRAD[0], position: "relative" }}>
                            {!fp.coverImage && (
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "80px", fontStyle: "italic", color: "rgba(255,255,255,0.08)" }}>
                                {fp.title.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 500, padding: "4px 12px", borderRadius: "2px", background: st.bg, color: st.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                {st.label}
                              </span>
                              {fp.category && (
                                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{fp.category}</span>
                              )}
                            </div>
                            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "16px" }}>
                              {fp.title}
                            </h2>
                            <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, marginBottom: "24px" }}>
                              {fp.description?.substring(0, 180)}...
                            </p>
                            {fp.tags?.length > 0 && (
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                                {fp.tags.map((tag: string) => (
                                  <span key={tag} style={{ fontSize: "11px", border: "1px solid rgba(38,108,135,0.15)", padding: "3px 10px", borderRadius: "2px", color: "#7A9AA5" }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87" }}>
                              Lihat Research →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })()}
                </div>
              )}

              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "24px" }}>
                {filtered.filter(p => !p.isFeatured || filter).map((p, i) => {
                  const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.UPCOMING;
                  return (
                    <Link key={p.id} href={`/layanan/research/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{
                        background: "#fff",
                        border: "1px solid rgba(38,108,135,0.1)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.25s",
                      }}>
                        {/* Cover */}
                        <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : GRAD[i % GRAD.length], position: "relative" }}>
                          {!p.coverImage && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "56px", fontStyle: "italic", color: "rgba(255,255,255,0.08)" }}>
                              {p.title.charAt(0)}
                            </div>
                          )}
                          <span style={{
                            position: "absolute", top: "14px", left: "14px",
                            fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                            padding: "4px 10px", borderRadius: "2px", background: st.bg, color: st.color,
                          }}>
                            {st.label}
                          </span>
                        </div>
                        {/* Body */}
                        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                          {p.category && (
                            <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87", marginBottom: "8px" }}>
                              {p.category}
                            </p>
                          )}
                          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "10px" }}>
                            {p.title}
                          </h3>
                          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, flex: 1, marginBottom: "16px",
                            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.description}
                          </p>
                          {p.tags?.length > 0 && (
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                              {p.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} style={{ fontSize: "10px", border: "1px solid rgba(38,108,135,0.12)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ borderTop: "1px solid rgba(38,108,135,0.08)", paddingTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Selengkapnya →</span>
                            {p.startDate && (
                              <span style={{ fontSize: "11px", color: "#B8CDD2" }}>
                                {new Date(p.startDate).getFullYear()}
                              </span>
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
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
    </main>
  );
}