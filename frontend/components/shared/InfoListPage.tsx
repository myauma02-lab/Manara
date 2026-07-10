"use client";
import { useEffect, useState, useCallback } from "react";
import { infoApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface Config {
  type: "NEWS" | "AWARD" | "MAGAZINE" | "AGENDA";
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  grad: string;
  detailBase: string;
  emptyMessage: string;
}

export default function InfoListPage({ config }: { config: Config }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    infoApi.list({
      type: config.type,
      search: search || undefined,
      limit: 9,
      page,
    })
      .then(r => {
        setItems(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [config.type, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const getCardVisual = (item: any) => {
    if (config.type === "AGENDA" && item.eventDate) {
      return (
        <div style={{ aspectRatio: "3/2", background: item.coverImage ? `url(${item.coverImage}) center/cover` : config.grad, position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(15,40,48,0.7)", borderRadius: "4px", padding: "16px 20px", textAlign: "center", backdropFilter: "blur(8px)", minWidth: "100px" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "40px", fontWeight: 300, color: config.color, lineHeight: 1, marginBottom: "4px" }}>
              {new Date(item.eventDate).getDate()}
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {new Date(item.eventDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </p>
          </div>
          {item.isHighlight && (
            <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "10px", fontWeight: 500, color: "#fff", background: config.color, padding: "3px 10px", borderRadius: "2px" }}>
              Highlight
            </span>
          )}
        </div>
      );
    }

    return (
      <div style={{
        aspectRatio: config.type === "MAGAZINE" ? "3/4" : "16/9",
        background: item.coverImage ? `url(${item.coverImage}) center/cover` : config.grad,
        flexShrink: 0,
        position: "relative",
      }}>
        {item.isFeatured && (
          <span style={{ position: "absolute", top: "10px", left: "10px", fontSize: "10px", fontWeight: 500, color: config.color, background: "rgba(15,40,48,0.7)", padding: "3px 10px", borderRadius: "2px", backdropFilter: "blur(4px)" }}>
            ★ Featured
          </span>
        )}
        {config.type === "MAGAZINE" && item.issueNumber && (
          <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.8)", background: "rgba(15,40,48,0.7)", padding: "4px 10px", borderRadius: "2px" }}>
              {item.issueNumber}
            </p>
          </div>
        )}
        {config.type === "AWARD" && !item.coverImage && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "48px", opacity: 0.15 }}>🏆</span>
          </div>
        )}
      </div>
    );
  };

  const getItemMeta = (item: any) => {
    if (config.type === "NEWS") return { primary: item.source, secondary: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "" };
    if (config.type === "AWARD") return { primary: item.awardGiver, secondary: item.awardYear?.toString() };
    if (config.type === "MAGAZINE") return { primary: item.issueNumber, secondary: item.issueYear?.toString() };
    if (config.type === "AGENDA") return { primary: item.eventType || "Event", secondary: item.eventLocation };
    return { primary: "", secondary: "" };
  };

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "64px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 20% 60%, ${config.color}20 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "28px", flexWrap: "wrap" }}>
            <Link href="/pusat-informasi" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Pusat Informasi</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>{config.title}</span>
          </div>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: config.color, marginBottom: "14px", opacity: 0.8 }}>
            {config.subtitle}
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "16px" }}>
            {config.title}
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.5)", maxWidth: "480px", lineHeight: 1.85 }}>
            {config.desc}
          </p>
        </div>
      </section>

      {/* Content */}
      <div style={{ background: "#F4F7F7", padding: "48px 0 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Search + count */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "32px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flex: 1, minWidth: "200px", background: "#fff", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", overflow: "hidden" }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && load()}
                placeholder={`Cari ${config.title.toLowerCase()}...`}
                style={{ flex: 1, padding: "11px 16px", fontSize: "14px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit" }} />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px" }}>×</button>
              )}
            </div>
            {!loading && (
              <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2", flexShrink: 0 }}>
                {total} {config.title.toLowerCase()}
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }} className="info-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: config.type === "MAGAZINE" ? "3/4" : "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "11px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "35%" }} />
                    <div style={{ height: "18px", background: "rgba(38,108,135,0.05)", borderRadius: "2px" }} />
                    <div style={{ height: "13px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && items.length === 0 && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "rgba(238,244,246,0.5)", marginBottom: "12px" }}>
                {search ? `Tidak ada hasil untuk "${search}".` : config.emptyMessage}
              </p>
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ marginTop: "16px", fontSize: "13px", color: "#86AFAA", background: "transparent", border: "1px solid rgba(38,108,135,0.25)", borderRadius: "2px", padding: "10px 24px", cursor: "pointer" }}>
                  Reset Pencarian
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && items.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "40px" }} className="info-grid">
                {items.map(item => {
                  const meta = getItemMeta(item);
                  return (
                    <Link key={item.id} href={`${config.detailBase}/${item.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: "#fff",
                        border: "1px solid rgba(38,108,135,0.1)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s",
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = config.color + "40";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${config.color}15`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)";
                          (e.currentTarget as HTMLElement).style.transform = "none";
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }}
                      >
                        {getCardVisual(item)}
                        <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "8px", flexWrap: "wrap" }}>
                            {meta.primary && (
                              <p style={{ fontSize: "11px", fontWeight: 500, color: config.color, letterSpacing: "0.06em" }}>
                                {meta.primary}
                              </p>
                            )}
                            {meta.secondary && (
                              <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{meta.secondary}</p>
                            )}
                          </div>

                          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, flex: 1, marginBottom: "10px" }}>
                            {item.title}
                          </h3>

                          {item.excerpt && (
                            <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.65, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {item.excerpt}
                            </p>
                          )}

                          {/* Tags */}
                          {item.tags?.length > 0 && (
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
                              {item.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} style={{ fontSize: "10px", border: "1px solid rgba(38,108,135,0.12)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid rgba(38,108,135,0.07)", marginTop: "auto" }}>
                            {config.type === "AGENDA" && item.eventDate && (
                              <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "2px", background: new Date(item.eventDate) > new Date() ? config.color + "15" : "rgba(38,108,135,0.06)", color: new Date(item.eventDate) > new Date() ? config.color : "#7A9AA5" }}>
                                {new Date(item.eventDate) > new Date() ? "Akan Datang" : "Selesai"}
                              </span>
                            )}
                            <span style={{ fontSize: "13px", fontWeight: 500, color: config.color, marginLeft: "auto" }}>
                              {config.type === "MAGAZINE" && item.fileUrl ? "Baca →" : "Selengkapnya →"}
                            </span>
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
                      style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? config.color : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px" }}>
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
        @media (max-width: 900px) {
          .info-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}