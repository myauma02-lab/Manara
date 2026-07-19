"use client";
import { useEffect, useState, useCallback } from "react";
import { projectsApi } from "@/lib/api";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUS_CONFIG = {
  ACTIVE:    { label: "Aktif",        color: "#3F6F6A", bg: "rgba(63,111,106,0.12)",  dot: "#3F6F6A" },
  UPCOMING:  { label: "Akan Datang",  color: "#266c87", bg: "rgba(38,108,135,0.1)",   dot: "#266c87" },
  COMPLETED: { label: "Selesai",      color: "#6E7448", bg: "rgba(110,116,72,0.1)",   dot: "#6E7448" },
  ARCHIVED:  { label: "Diarsipkan",   color: "#7A9AA5", bg: "rgba(122,154,165,0.1)",  dot: "#B8CDD2" },
} as const;

const GRADS = [
  "linear-gradient(135deg,#0F2830,#266c87)",
  "linear-gradient(135deg,#1a4f63,#5F8F8A)",
  "linear-gradient(135deg,#3F6F6A,#266c87)",
  "linear-gradient(135deg,#6E7448,#A4AA7A)",
  "linear-gradient(135deg,#0F2830,#3F6F6A)",
];

export default function ProyekPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Hitung per-status count
  const [counts, setCounts] = useState<Record<string, number>>({});

  const load = useCallback(() => {
    setLoading(true);
    projectsApi.list({
      status: activeStatus || undefined,
      search: search || undefined,
      limit: 9,
      page,
    })
      .then(r => {
        setProjects(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeStatus, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [activeStatus, search]);

  // Load counts
  useEffect(() => {
    Promise.all(
      Object.keys(STATUS_CONFIG).map(s =>
        projectsApi.list({ status: s, limit: 1 })
          .then(r => ({ s, count: r.data.pagination?.total || 0 }))
          .catch(() => ({ s, count: 0 }))
      )
    ).then(results => {
      const c: Record<string, number> = {};
      results.forEach(r => { c[r.s] = r.count; });
      setCounts(c);
    });
  }, []);

  const featured = projects.find(p => p.isFeatured);
  const rest = projects.filter(p => !p.isFeatured || page > 1 || activeStatus || search);

  return (
    <main>
      <Navbar />
<HeroBackground
  settingKey={HERO_BG_KEYS.proyek}
  fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
  gradientDirection="to-left"
  gradientColor="#0F2830"
  gradientOpacity={0.88}
  style={{ paddingTop: "140px", paddingBottom: "80px" }}
>
      {/* ── HERO ── */}
      <section style={{
        paddingTop: "140px",
        paddingBottom: "80px",
        background: "#0F2830",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 80% 30%, rgba(38,108,135,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>

          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.55)", marginBottom: "16px" }}>
            Proyek Manara
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "flex-end" }} className="hero-grid">
            <div>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.08, marginBottom: "20px" }}>
                Dari gagasan ke<br />
                <em style={{ color: "#86AFAA" }}>tindakan nyata.</em>
              </h1>
              <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "520px" }}>
                Proyek riset, kajian, dan inisiatif Manara yang mengubah pertanyaan intelektual menjadi kontribusi konkret bagi ruang publik.
              </p>
            </div>

            {/* Status counter cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", flexShrink: 0 }} className="counter-grid">
              {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG.ACTIVE][]).map(([key, cfg]) => (
                <div key={key} style={{ background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", padding: "12px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", borderColor: activeStatus === key ? cfg.color + "60" : "rgba(38,108,135,0.12)" }}
                  onClick={() => setActiveStatus(activeStatus === key ? "" : key)}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: counts[key] > 0 ? cfg.color : "rgba(134,175,170,0.2)", lineHeight: 1, marginBottom: "4px" }}>
                    {counts[key] ?? "—"}
                  </p>
                  <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", color: "rgba(134,175,170,0.4)" }}>
                    {cfg.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
</HeroBackground>

      {/* ── CONTENT ── */}
      <div style={{ background: "#F4F7F7", padding: "56px 0 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Filter bar */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ display: "flex", flex: 1, minWidth: "200px", background: "#fff", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", overflow: "hidden" }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && load()}
                placeholder="Cari judul atau topik..."
                style={{ flex: 1, padding: "10px 16px", fontSize: "14px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "transparent" }} />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px" }}>×</button>
              )}
            </div>

            {/* Status filter pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => setActiveStatus("")}
                style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 500, border: "1px solid rgba(38,108,135,0.15)", borderRadius: "20px", background: activeStatus === "" ? "#0F2830" : "transparent", color: activeStatus === "" ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
                Semua {total > 0 && `(${total})`}
              </button>
              {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG.ACTIVE][]).map(([key, cfg]) => (
                <button key={key} onClick={() => setActiveStatus(activeStatus === key ? "" : key)}
                  style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 500, border: `1px solid ${activeStatus === key ? cfg.color : "rgba(38,108,135,0.15)"}`, borderRadius: "20px", background: activeStatus === key ? cfg.bg : "transparent", color: activeStatus === key ? cfg.color : "#7A9AA5", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "11px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "30%" }} />
                    <div style={{ height: "20px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "85%" }} />
                    <div style={{ height: "40px", background: "rgba(38,108,135,0.03)", borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && projects.length === 0 && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "rgba(238,244,246,0.5)", marginBottom: "12px" }}>
                {search || activeStatus ? "Tidak ada proyek yang sesuai." : "Belum ada proyek."}
              </p>
              {(search || activeStatus) && (
                <button onClick={() => { setSearch(""); setActiveStatus(""); }}
                  style={{ fontSize: "13px", color: "#86AFAA", background: "transparent", border: "1px solid rgba(38,108,135,0.25)", borderRadius: "2px", padding: "10px 24px", cursor: "pointer", marginTop: "16px" }}>
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* Featured project */}
          {!loading && featured && !search && !activeStatus && page === 1 && (
            <div style={{ marginBottom: "32px" }}>
              <Link href={`/proyek/${featured.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "border-color 0.2s" }}
                  className="featured-grid"
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.3)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)"}
                >
                  {/* Cover */}
                  <div style={{ minHeight: "300px", background: featured.coverImage ? `url(${featured.coverImage}) center/cover` : GRADS[0], position: "relative" }}>
                    {/* Progress bar */}
                    {featured.progress > 0 && (
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                        <div style={{ height: "3px", background: "rgba(0,0,0,0.3)" }}>
                          <div style={{ height: "100%", width: `${featured.progress}%`, background: STATUS_CONFIG[featured.status as keyof typeof STATUS_CONFIG]?.color || "#266c87", transition: "width 0.5s" }} />
                        </div>
                      </div>
                    )}
                    <span style={{ position: "absolute", top: "14px", left: "14px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.3)", border: "1px solid rgba(134,175,170,0.2)", padding: "4px 12px", borderRadius: "2px" }}>
                      ★ Unggulan
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {/* Status badge */}
                    {(() => {
                      const sc = STATUS_CONFIG[featured.status as keyof typeof STATUS_CONFIG];
                      return (
                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", alignItems: "center" }}>
                          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: sc.bg, color: sc.color, display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                            {sc.label}
                          </span>
                          {featured.category && (
                            <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{featured.category}</span>
                          )}
                        </div>
                      );
                    })()}

                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "12px" }}>
                      {featured.title}
                    </h2>

                    {featured.description && (
                      <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {featured.description}
                      </p>
                    )}

                    {/* Progress */}
                    {featured.progress > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <p style={{ fontSize: "11px", color: "#B8CDD2" }}>Progress</p>
                          <p style={{ fontSize: "11px", fontWeight: 500, color: "#266c87" }}>{featured.progress}%</p>
                        </div>
                        <div style={{ height: "4px", background: "rgba(38,108,135,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${featured.progress}%`, background: "#266c87", borderRadius: "2px", transition: "width 0.5s" }} />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {featured.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {featured.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{ fontSize: "11px", border: "1px solid rgba(38,108,135,0.15)", padding: "3px 10px", borderRadius: "2px", color: "#7A9AA5" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dates */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {featured.startDate && (
                        <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                          {new Date(featured.startDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                          {featured.endDate ? ` → ${new Date(featured.endDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}` : " → Berlangsung"}
                        </p>
                      )}
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", marginLeft: "auto" }}>
                        Lihat Proyek →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid proyek */}
          {!loading && rest.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px", marginBottom: "40px" }}>
                {rest.map((p, i) => {
                  const sc = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING;
                  return (
                    <Link key={p.id} href={`/proyek/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "all 0.2s" }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.3)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(15,40,48,0.08)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)";
                          (e.currentTarget as HTMLElement).style.transform = "none";
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }}
                      >
                        {/* Cover */}
                        <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : GRADS[i % GRADS.length], position: "relative", flexShrink: 0 }}>
                          {/* Status badge */}
                          <span style={{ position: "absolute", top: "10px", left: "10px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: sc.bg, color: sc.color, display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.dot, display: "inline-block", animation: p.status === "ACTIVE" ? "pulse-dot 2s infinite" : "none" }} />
                            {sc.label}
                          </span>
                          {/* Progress bar di bottom cover */}
                          {p.progress > 0 && (
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(0,0,0,0.2)" }}>
                              <div style={{ height: "100%", width: `${p.progress}%`, background: sc.color }} />
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                          {p.category && (
                            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87", marginBottom: "6px" }}>
                              {p.category}
                            </p>
                          )}

                          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "19px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "8px", flex: 1 }}>
                            {p.title}
                          </h3>

                          {p.description && (
                            <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {p.description}
                            </p>
                          )}

                          {/* Tags */}
                          {p.tags?.length > 0 && (
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
                              {p.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} style={{ fontSize: "10px", border: "1px solid rgba(38,108,135,0.12)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(38,108,135,0.07)" }}>
                            <div>
                              {p.startDate && (
                                <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                                  {new Date(p.startDate).getFullYear()}
                                  {p.endDate ? `–${new Date(p.endDate).getFullYear()}` : ""}
                                </p>
                              )}
                              {p.progress > 0 && (
                                <p style={{ fontSize: "11px", fontWeight: 500, color: sc.color }}>
                                  {p.progress}% selesai
                                </p>
                              )}
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87" }}>→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === 1 ? "#B8CDD2" : "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", fontWeight: page === p ? 500 : 400 }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === totalPages ? "#B8CDD2" : "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer" }}>→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .counter-grid { display: flex !important; gap: 8px !important; }
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}