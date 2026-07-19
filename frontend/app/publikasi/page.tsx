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
  },
  {
    type: "PAPER",
    href: "/publikasi/paper",
    title: "Manara Paper",
    subtitle: "Policy Paper · Working Paper · Policy Brief · White Paper · Research Note",
    desc: "Dokumen kebijakan dan riset yang ditujukan untuk pemerintah, NGO, akademisi, dan lembaga.",
    icon: "◇",
    color: "#3F6F6A",
  },
  {
    type: "JOURNAL",
    href: "/publikasi/journal",
    title: "Manara Journal",
    subtitle: "Volume · Nomor · DOI · Peer Review",
    desc: "Publikasi ilmiah formal dengan standar akademik - fondasi untuk indexing SINTA dan jurnal internasional.",
    icon: "○",
    color: "#5F8F8A",
  },
];

export default function PublikasiPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

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
    });
  }, []);

  return (
    <main>
      <Navbar />
      <HeroBackground
        settingKey={HERO_BG_KEYS.publikasi}
        fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
        gradientDirection="to-right"
        gradientColor="#0F2830"
        gradientOpacity={0.9}
        style={{ paddingTop: "140px", paddingBottom: "80px" }}
      >
        <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

            <div style={{ marginBottom: "64px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
                Publikasi
              </p>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
                Produk intelektual<br />
                <em style={{ color: "#266c87", fontStyle: "italic" }}>Manara.</em>
              </h1>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "540px", lineHeight: 1.85 }}>
                Tiga format publikasi - dari tulisan populer hingga jurnal ilmiah - dirancang untuk menjangkau pembaca yang berbeda dengan kedalaman yang berbeda.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" }}>
              {TYPES.map(item => (
                <Link key={item.type} href={item.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff",
                    border: "1px solid rgba(38,108,135,0.1)",
                    borderRadius: "4px",
                    padding: "36px 32px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.25s",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "80px",
                      height: "80px",
                      background: item.color,
                      opacity: 0.04,
                      borderRadius: "0 4px 0 100%",
                    }} />

                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, fontSize: "18px", marginBottom: "20px" }}>
                      {item.icon}
                    </div>

                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
                      {item.title}
                    </h2>

                    <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", color: item.color, marginBottom: "14px", lineHeight: 1.6 }}>
                      {item.subtitle}
                    </p>

                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, flex: 1, marginBottom: "24px" }}>
                      {item.desc}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {counts[item.type] !== undefined && (
                        <span style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: item.color }}>
                          {counts[item.type]}
                          <span style={{ fontFamily: "inherit", fontSize: "12px", color: "#B8CDD2", marginLeft: "6px" }}>
                            publikasi
                          </span>
                        </span>
                      )}
                      <span style={{ fontSize: "13px", fontWeight: 500, color: item.color, marginLeft: "auto" }}>
                        Jelajahi →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </HeroBackground>
      <Footer />
    </main>
  );
}