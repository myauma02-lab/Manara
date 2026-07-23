"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const TYPES = [
  {
    type: "ARTICLE",
    href: "/publikasi/artikel",
    title: "Artikel",
    subtitle: "Opini · Esai · Analisis · Commentary",
    desc: "Tulisan ilmiah populer untuk pembaca umum yang ingin memahami isu secara mendalam tanpa jargon berlebihan.",
    icon: "✦",
    color: "#266c87",
    grad: "linear-gradient(135deg,#0F2830,#266c87)",
  },
  {
    type: "PAPER",
    href: "/publikasi/paper",
    title: "Manara Paper",
    subtitle: "Policy Paper · Working Paper · Policy Brief",
    desc: "Dokumen kebijakan dan riset yang ditujukan untuk pemerintah, NGO, akademisi, dan lembaga.",
    icon: "◇",
    color: "#3F6F6A",
    grad: "linear-gradient(135deg,#0F2830,#3F6F6A)",
  },
  {
    type: "JOURNAL",
    href: "/publikasi/journal",
    title: "Manara Journal",
    subtitle: "Volume · Nomor · DOI · Peer Review",
    desc: "Publikasi ilmiah formal dengan standar akademik — fondasi untuk indexing SINTA dan jurnal internasional.",
    icon: "○",
    color: "#5F8F8A",
    grad: "linear-gradient(135deg,#0F2830,#5F8F8A)",
  },
];

export default function PublikasiPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(
      TYPES.map(t =>
        publicationsApi.list({ type: t.type as any, limit: 1 })
          .then(r => ({ type: t.type, total: r.data.pagination?.total || 0 }))
          .catch(() => ({ type: t.type, total: 0 }))
      )
    ).then(results => {
      const map: Record<string, number> = {};
      results.forEach(r => { map[r.type] = r.total; });
      setCounts(map);
      setLoaded(true);
    });
  }, []);

  return (
    <main>
      <Navbar />

      <div style={{ paddingTop: "0px", paddingBottom: "120px", background: "none", minHeight: "100vh" }}>
        <HeroBackground
          settingKey={HERO_BG_KEYS.publikasi}
          fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
          gradientDirection="to-right"
          gradientColor="#0F2830"
          gradientOpacity={0.90}
          style={{ paddingTop: "140px", minHeight: "320px" }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "28px", height: "1px", background: "rgba(134,175,170,0.4)" }} />
              <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(134,175,170,0.6)" }}>
                Publikasi Manara
              </p>
            </div>

                  <h1 style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(40px,6.5vw,84px)",
                    fontWeight: 300,
                    color: "#EEF4F6",
                    lineHeight: 1.05,
                    marginBottom: "20px",
                    letterSpacing: "-0.02em",
                    maxWidth: "700px",
                  }}>
                    Produk intelektual<br />
                    <em style={{ color: "#86AFAA" }}>Manara.</em>
                  </h1>

                  <p style={{
                    fontSize: "clamp(16px,2vw,19px)",
                    fontWeight: 300,
                    color: "rgba(134,175,170,0.55)",
                    lineHeight: 1.85,
                    maxWidth: "520px",
                    marginBottom: "40px",
                  }}>
                    Tiga format publikasi — dari tulisan populer hingga jurnal ilmiah — dirancang
                    untuk menjangkau pembaca yang berbeda dengan kedalaman yang berbeda.
                  </p>

                  {/* Stats bar */}
                  {loaded && (
                    <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(38,108,135,0.2)", paddingTop: "28px" }}>
                      {TYPES.map((t, i) => (
                        <div key={t.type} style={{ paddingRight: "32px", marginRight: "32px", borderRight: i < TYPES.length - 1 ? "1px solid rgba(38,108,135,0.15)" : "none" }}>
                          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 300, color: t.color, lineHeight: 1, marginBottom: "4px" }}>
                            {counts[t.type] ?? "—"}
                          </p>
                          <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(134,175,170,0.45)", letterSpacing: "0.04em" }}>
                            {t.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </HeroBackground>
            </div>

      {/* ── 3 KARTU TIPE PUBLIKASI ── */}
      <section style={{ padding: "80px clamp(20px,5vw,48px) 120px", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" }}>
            {TYPES.map(item => (
              <Link key={item.type} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff",
                  border: "1px solid rgba(38,108,135,0.1)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s",
                  position: "relative",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${item.color}18`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${item.color}40`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)";
                  }}
                >
                  {/* Top color bar */}
                  <div style={{ height: "4px", background: item.color }} />

                  {/* Gradient thumb */}
                  <div style={{
                    height: "120px",
                    background: item.grad,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 28px",
                    overflow: "hidden",
                  }}>
                    {/* Big icon background */}
                    <span style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "80px",
                      color: "rgba(255,255,255,0.08)",
                      lineHeight: 1,
                      userSelect: "none",
                    }}>
                      {item.icon}
                    </span>
                    {/* Count overlay */}
                    {counts[item.type] !== undefined && (
                      <div style={{ position: "absolute", left: "28px", bottom: "16px" }}>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                          {counts[item.type]}
                        </p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
                          publikasi
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "28px 28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
                      {item.title}
                    </h2>
                    <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", color: item.color, marginBottom: "14px", lineHeight: 1.6 }}>
                      {item.subtitle}
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, flex: 1, marginBottom: "24px" }}>
                      {item.desc}
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(38,108,135,0.07)",
                    }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: item.color }}>
                        Jelajahi semua →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info tambahan */}
          <div style={{ marginTop: "48px", background: "#0F2830", borderRadius: "12px", padding: "32px 36px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#EEF4F6", marginBottom: "6px" }}>
                Tertarik berkontribusi?
              </p>
              <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.7 }}>
                Kirimkan tulisan atau paper-mu ke Manara. Kami menerima kontribusi dari penulis eksternal.
              </p>
            </div>
            <Link href="/manapeople" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#266c87", color: "#fff",
              padding: "12px 24px", borderRadius: "4px", textDecoration: "none",
              fontSize: "13px", fontWeight: 500, flexShrink: 0,
            }}>
              Bergabung →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}