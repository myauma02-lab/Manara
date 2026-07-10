"use client";
import { useEffect, useState } from "react";
import { infoApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const CATEGORIES = [
  {
    type: "NEWS",
    href: "/pusat-informasi/news",
    title: "News",
    subtitle: "Berita & Artikel",
    desc: "Perkembangan terkini, liputan kegiatan, dan berita seputar Manara dan isu yang kami pedulikan.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="32" height="4" rx="2" fill="currentColor" opacity="0.9"/>
        <rect x="8" y="20" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.7"/>
        <rect x="8" y="27" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.7"/>
        <rect x="8" y="34" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
        <rect x="30" y="20" width="10" height="17" rx="2" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
    color: "#266c87",
    grad: "linear-gradient(145deg, #0F2830, #266c87)",
  },
  {
    type: "AWARD",
    href: "/pusat-informasi/awards",
    title: "Awards",
    subtitle: "Penghargaan & Pencapaian",
    desc: "Rekam jejak pengakuan dan penghargaan yang diterima Manara atas kontribusi intelektual dan sosialnya.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L27.5 16H38L29.5 22.5L33 32.5L24 26L15 32.5L18.5 22.5L10 16H20.5L24 6Z" fill="currentColor" opacity="0.9"/>
        <rect x="18" y="36" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="16" y="41" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
    color: "#C6AD8A",
    grad: "linear-gradient(145deg, #1a1208, #8A6E3E)",
  },
  {
    type: "MAGAZINE",
    href: "/pusat-informasi/magazine",
    title: "Magazine",
    subtitle: "Majalah & Edisi",
    desc: "Publikasi berkala Manara — kumpulan gagasan, wawancara, dan analisis dalam format majalah digital.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="14" height="32" rx="2" fill="currentColor" opacity="0.9"/>
        <rect x="26" y="8" width="14" height="32" rx="2" fill="currentColor" opacity="0.7"/>
        <rect x="10" y="12" width="10" height="2" rx="1" fill="white" opacity="0.4"/>
        <rect x="10" y="17" width="10" height="2" rx="1" fill="white" opacity="0.3"/>
        <rect x="28" y="12" width="10" height="2" rx="1" fill="white" opacity="0.4"/>
        <rect x="28" y="17" width="10" height="2" rx="1" fill="white" opacity="0.3"/>
        <line x1="22" y1="8" x2="22" y2="40" stroke="white" strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    color: "#5F8F8A",
    grad: "linear-gradient(145deg, #0A1F1E, #2A5E59)",
  },
  {
    type: "AGENDA",
    href: "/pusat-informasi/agenda",
    title: "Key Agenda",
    subtitle: "Agenda & Highlights",
    desc: "Jadwal kegiatan strategis, forum, seminar, dan momen penting dalam perjalanan Manara.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="12" width="32" height="28" rx="3" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
        <rect x="8" y="12" width="32" height="8" rx="2" fill="currentColor" opacity="0.7"/>
        <rect x="16" y="6" width="3" height="8" rx="1.5" fill="currentColor"/>
        <rect x="29" y="6" width="3" height="8" rx="1.5" fill="currentColor"/>
        <rect x="13" y="26" width="5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="22" y="26" width="5" height="5" rx="1" fill="currentColor" opacity="0.8"/>
        <rect x="31" y="26" width="5" height="5" rx="1" fill="currentColor" opacity="0.4"/>
        <rect x="13" y="34" width="5" height="3" rx="1" fill="currentColor" opacity="0.4"/>
        <rect x="22" y="34" width="5" height="3" rx="1" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    color: "#8A8F5E",
    grad: "linear-gradient(145deg, #141408, #4A4E28)",
  },
];

export default function PusatInformasiPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [latestItems, setLatestItems] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      infoApi.counts(),
      ...CATEGORIES.map(c =>
        infoApi.list({ type: c.type as any, limit: 3 })
          .then(r => ({ type: c.type, items: r.data.data || [] }))
          .catch(() => ({ type: c.type, items: [] }))
      ),
    ]).then(([countsRes, ...itemResults]) => {
      setCounts(countsRes.data.data || {});
      const itemMap: Record<string, any[]> = {};
      itemResults.forEach((r: any) => { itemMap[r.type] = r.items; });
      setLatestItems(itemMap);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: "140px",
        paddingBottom: "80px",
        background: "#0F2830",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dekorasi background */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 20% 60%, rgba(38,108,135,0.18) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: "200px", width: "1px", height: "100%", background: "linear-gradient(to bottom, transparent, rgba(38,108,135,0.08) 50%, transparent)" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.55)", marginBottom: "16px" }}>
            Pusat Informasi
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,72px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.08, marginBottom: "20px" }}>
            Semua yang perlu<br />
            <em style={{ color: "#86AFAA" }}>kamu ketahui tentang Manara.</em>
          </h1>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "540px" }}>
            Satu tempat untuk mengikuti perkembangan, pencapaian, publikasi, dan agenda strategis Manara.
          </p>
        </div>
      </section>

      {/* ── 4 KARTU KATEGORI ── */}
      <section style={{ padding: "0 0 80px", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Grid 4 kartu utama */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "0",
            marginTop: "-1px",
          }} className="info-hub-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.type} href={cat.href} style={{ textDecoration: "none" }}>
                <div
                  onMouseEnter={() => setHoveredCard(cat.type)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: hoveredCard === cat.type ? cat.grad : "#0F2830",
                    minHeight: "320px",
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.4s ease",
                    borderRight: "1px solid rgba(38,108,135,0.12)",
                    cursor: "pointer",
                  }}
                >
                  {/* Subtle background circle */}
                  <div style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-40px",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    border: `60px solid ${cat.color}`,
                    opacity: hoveredCard === cat.type ? 0.12 : 0.06,
                    transition: "opacity 0.4s",
                  }} />

                  {/* Icon */}
                  <div style={{
                    color: hoveredCard === cat.type ? "#fff" : cat.color,
                    marginBottom: "20px",
                    transition: "color 0.3s",
                    opacity: hoveredCard === cat.type ? 0.9 : 0.7,
                  }}>
                    {cat.icon}
                  </div>

                  {/* Count */}
                  {!loading && counts[cat.type] > 0 && (
                    <p style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "32px",
                      fontWeight: 300,
                      color: hoveredCard === cat.type ? "#fff" : cat.color,
                      lineHeight: 1,
                      marginBottom: "8px",
                      transition: "color 0.3s",
                    }}>
                      {counts[cat.type]}
                    </p>
                  )}

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(22px,2.5vw,28px)",
                    fontWeight: 300,
                    color: "#EEF4F6",
                    marginBottom: "8px",
                    lineHeight: 1.2,
                    transition: "color 0.3s",
                  }}>
                    {cat.title}
                  </h2>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: hoveredCard === cat.type ? "rgba(255,255,255,0.6)" : "rgba(134,175,170,0.4)",
                    marginBottom: "12px",
                    transition: "color 0.3s",
                  }}>
                    {cat.subtitle}
                  </p>

                  {/* Desc — muncul saat hover */}
                  <div style={{
                    maxHeight: hoveredCard === cat.type ? "80px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease, opacity 0.3s ease",
                    opacity: hoveredCard === cat.type ? 1 : 0,
                  }}>
                    <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                      {cat.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div style={{
                    position: "absolute",
                    bottom: "24px",
                    right: "24px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: `1px solid ${cat.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: cat.color,
                    fontSize: "16px",
                    opacity: hoveredCard === cat.type ? 1 : 0.4,
                    transition: "all 0.3s",
                    transform: hoveredCard === cat.type ? "translate(0,0)" : "translate(4px,4px)",
                  }}>
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW KONTEN PER KATEGORI ── */}
      <section style={{ padding: "0 0 120px", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
            {CATEGORIES.map(cat => {
              const items = latestItems[cat.type] || [];
              if (!loading && items.length === 0) return null;

              return (
                <div key={cat.type}>
                  {/* Section header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "4px", height: "24px", background: cat.color, borderRadius: "2px" }} />
                      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830" }}>
                        {cat.title}
                      </h2>
                    </div>
                    <Link href={cat.href}
                      style={{ fontSize: "13px", fontWeight: 500, color: cat.color, textDecoration: "none" }}>
                      Lihat semua →
                    </Link>
                  </div>

                  {/* Loading skeleton */}
                  {loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                          <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                          <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ height: "12px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", width: "40%" }} />
                            <div style={{ height: "18px", background: "rgba(38,108,135,0.05)", borderRadius: "2px" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Items grid */}
                  {!loading && items.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }} className="info-grid">
                      {items.map((item, i) => (
                        <Link key={item.id} href={`${cat.href}/${item.slug}`} style={{ textDecoration: "none" }}>
                          <InfoCard item={item} cat={cat} index={i} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 900px) {
          .info-hub-grid { grid-template-columns: repeat(2,1fr) !important; }
          .info-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .info-hub-grid { grid-template-columns: 1fr !important; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

// ── Komponen kartu item ──────────────────────────────
function InfoCard({ item, cat, index }: {
  item: any;
  cat: typeof CATEGORIES[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const getDateLabel = () => {
    if (item.type === "AGENDA" && item.eventDate) {
      return new Date(item.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
    if (item.type === "AWARD" && item.awardYear) return item.awardYear.toString();
    if (item.type === "MAGAZINE" && item.issueNumber) return item.issueNumber;
    if (item.publishedAt) return new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    return "";
  };

  const getMeta = () => {
    if (item.type === "NEWS" && item.source) return item.source;
    if (item.type === "AWARD" && item.awardGiver) return item.awardGiver;
    if (item.type === "AGENDA" && item.eventLocation) return item.eventLocation;
    if (item.type === "AGENDA" && item.eventType) return item.eventType;
    return "";
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? cat.color + "40" : "rgba(38,108,135,0.1)"}`,
        borderRadius: "4px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${cat.color}15` : "none",
      }}
    >
      {/* Cover / Visual */}
      <div style={{
        aspectRatio: item.type === "MAGAZINE" ? "3/4" : "16/9",
        background: item.coverImage
          ? `url(${item.coverImage}) center/cover`
          : cat.grad,
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        {/* Featured badge */}
        {item.isFeatured && (
          <span style={{ position: "absolute", top: "10px", left: "10px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: "rgba(15,40,48,0.6)", color: cat.color, backdropFilter: "blur(4px)" }}>
            ★ Featured
          </span>
        )}
        {/* Highlight badge for agenda */}
        {item.isHighlight && item.type === "AGENDA" && (
          <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "10px", fontWeight: 500, color: "#fff", background: cat.color, padding: "3px 10px", borderRadius: "2px" }}>
            Highlight
          </span>
        )}
        {/* Date overlay untuk agenda */}
        {item.type === "AGENDA" && item.eventDate && (
          <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(15,40,48,0.8)", borderRadius: "4px", padding: "8px 12px", textAlign: "center", backdropFilter: "blur(4px)" }}>
            <p style={{ fontSize: "20px", fontWeight: 700, color: cat.color, lineHeight: 1 }}>
              {new Date(item.eventDate).getDate()}
            </p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {new Date(item.eventDate).toLocaleDateString("id-ID", { month: "short" })}
            </p>
          </div>
        )}
        {/* Award icon overlay */}
        {item.type === "AWARD" && !item.coverImage && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "56px", opacity: 0.15 }}>🏆</span>
          </div>
        )}
        {/* Magazine issue number overlay */}
        {item.type === "MAGAZINE" && item.issueNumber && (
          <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(15,40,48,0.6)", padding: "4px 10px", borderRadius: "2px", backdropFilter: "blur(4px)" }}>
              {item.issueNumber}
            </p>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Type + date */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "4px" }}>
          {item.type === "NEWS" || item.type === "AGENDA" ? (
            <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: cat.color }}>
              {item.type === "AGENDA" ? (item.eventType || "Event") : "News"}
            </span>
          ) : null}
          {getDateLabel() && (
            <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{getDateLabel()}</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(15px,2vw,18px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, marginBottom: "8px", flex: 1 }}>
          {item.title}
        </h3>

        {/* Excerpt */}
        {item.excerpt && (
          <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.65, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.excerpt}
          </p>
        )}

        {/* Meta info */}
        {getMeta() && (
          <p style={{ fontSize: "11px", color: "#B8CDD2", marginBottom: "10px" }}>
            {getMeta()}
          </p>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid rgba(38,108,135,0.07)", marginTop: "auto" }}>
          {item.type === "AGENDA" && item.eventDate && (
            <span style={{
              fontSize: "11px", fontWeight: 500, color: "#fff",
              background: new Date(item.eventDate) > new Date() ? cat.color : "#B8CDD2",
              padding: "3px 10px", borderRadius: "2px",
            }}>
              {new Date(item.eventDate) > new Date() ? "Akan Datang" : "Selesai"}
            </span>
          )}
          <span style={{ fontSize: "13px", fontWeight: 500, color: cat.color, marginLeft: "auto" }}>
            {item.type === "MAGAZINE" && item.fileUrl ? "Baca →" : "Selengkapnya →"}
          </span>
        </div>
      </div>
    </div>
  );
}