"use client";
import { useEffect, useState } from "react";
import { publicationsApi, fellowsApi } from "@/lib/api";
import Link from "next/link";

export default function HeroSection() {
  const [stats, setStats] = useState({
    publikasi: 0,
    fellows: 0,
    loaded: false,
  });

  useEffect(() => {
    Promise.all([
      publicationsApi.list({ limit: 1 }),
      fellowsApi.list(),
    ])
      .then(([pubRes, fellowRes]) => {
        setStats({
          publikasi: pubRes.data.pagination?.total || 0,
          fellows: (fellowRes.data.data || []).length,
          loaded: true,
        });
      })
      .catch(() => setStats(s => ({ ...s, loaded: true })));
  }, []);

  return (
    <section style={{
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      paddingBottom: "80px",
      background: "#0F2830",
      position: "relative",
      overflow: "hidden",
      width: "100%",
    }}>
      {/* Background radial */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 15% 60%, rgba(38,108,135,0.22) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: "clamp(80px,15vw,200px)", width: "1px", height: "100%", background: "linear-gradient(to bottom, transparent, rgba(38,108,135,0.12) 40%, rgba(38,108,135,0.04) 100%)" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px clamp(20px,5vw,48px) 0", width: "100%", position: "relative", zIndex: 2 }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ width: "32px", height: "1px", background: "rgba(134,175,170,0.4)" }} />
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.55)" }}>
            Kolektif Intelektual · Jawa Timur
          </p>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "Georgia,serif",
          fontSize: "clamp(40px,8vw,96px)",
          fontWeight: 300,
          color: "#EEF4F6",
          lineHeight: 1.0,
          marginBottom: "28px",
          letterSpacing: "-0.02em",
          maxWidth: "900px",
        }}>
          Di mana gagasan<br />
          menemukan{" "}
          <em style={{ color: "#86AFAA", fontStyle: "italic" }}>cahayanya.</em>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "clamp(16px,2.2vw,20px)",
          fontWeight: 300,
          color: "rgba(134,175,170,0.5)",
          lineHeight: 1.85,
          maxWidth: "520px",
          marginBottom: "44px",
        }}>
          Manara adalah ruang intelektual dan media kreatif untuk gagasan yang ingin didengar — dengan kedalaman yang tidak dikorbankan.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "72px" }}>
          <Link href="/publikasi/artikel" style={{
            background: "#266c87",
            color: "#fff",
            padding: "13px 32px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderRadius: "2px",
            textDecoration: "none",
          }}>
            Baca Publikasi
          </Link>
          <Link href="/tentang/manifesto" style={{
            border: "1px solid rgba(134,175,170,0.2)",
            color: "rgba(134,175,170,0.65)",
            padding: "13px 32px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderRadius: "2px",
            textDecoration: "none",
          }}>
            Manifesto Kami
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex",
          gap: "0",
          borderTop: "1px solid rgba(38,108,135,0.15)",
          paddingTop: "32px",
          flexWrap: "wrap",
        }}>
          {[
            {
              value: stats.loaded ? (stats.publikasi > 0 ? stats.publikasi.toString() : "—") : "...",
              label: "Publikasi",
              sub: "Artikel, Paper & Journal",
            },
            {
              value: stats.loaded ? (stats.fellows > 0 ? stats.fellows.toString() : "—") : "...",
              label: "Fellows",
              sub: "Peneliti & Akademisi",
            },
            {
              value: "2024",
              label: "Berdiri",
              sub: "Surabaya, Jawa Timur",
            },
            {
              value: "5",
              label: "Founder",
              sub: "Co-Founders Manara",
            },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: "0 clamp(20px,3vw,40px)",
              borderLeft: i === 0 ? "none" : "1px solid rgba(38,108,135,0.12)",
            }}>
              <p style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(28px,4vw,44px)",
                fontWeight: 300,
                color: "#EEF4F6",
                lineHeight: 1,
                marginBottom: "4px",
                transition: "all 0.3s",
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#86AFAA", marginBottom: "2px" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(134,175,170,0.35)" }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "32px", right: "clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.3 }}>
        <div style={{ width: "1px", height: "40px", background: "rgba(134,175,170,0.5)", animation: "scrollPulse 2s infinite" }} />
        <p style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(134,175,170,0.8)", writingMode: "vertical-rl" }}>
          Scroll
        </p>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(0.6); }
        }
      `}</style>
    </section>
  );
}