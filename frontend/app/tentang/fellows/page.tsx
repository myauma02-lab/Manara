"use client";
import { useEffect, useState } from "react";
import { fellowsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

// Gradient fallback per index
const GRADS = [
  "linear-gradient(145deg,#266c87,#0F2830)",
  "linear-gradient(145deg,#3F6F6A,#266c87)",
  "linear-gradient(145deg,#5F8F8A,#3F6F6A)",
  "linear-gradient(145deg,#1a4f63,#266c87)",
  "linear-gradient(145deg,#6E7448,#8A8F5E)",
];

// Icon untuk expertise (sama seperti referensi Brawijaya Core)
const EXPERTISE_ICON = "◎";

export default function FellowsPage() {
  const [fellows, setFellows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fellowsApi.list()
      .then(r => setFellows(r.data.data || []))
      .catch(() => {})
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
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 20% 60%, rgba(38,108,135,0.18) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "28px", flexWrap: "wrap" }}>
            <Link href="/tentang/manara" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Tentang Kami</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>Manara Fellows</span>
          </div>

          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.55)", marginBottom: "16px" }}>
            Manara Fellows
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.08, marginBottom: "20px", letterSpacing: "-0.01em" }}>
            Tenaga ahli dan<br />
            <em style={{ color: "#86AFAA", fontStyle: "italic" }}>peneliti Manara.</em>
          </h1>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "520px" }}>
            Manara Fellows adalah jaringan akademisi, peneliti, dan praktisi yang mendukung kerja intelektual dan riset Manara dari berbagai disiplin ilmu.
          </p>
        </div>
      </section>

      {/* ── GRID FELLOWS ── */}
      <section style={{ padding: "80px clamp(20px,5vw,40px) 120px", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "20px" }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", padding: "24px", animation: "pulse 1.5s infinite", display: "flex", gap: "16px" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "4px", background: "rgba(38,108,135,0.08)", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "16px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "70%" }} />
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "50%" }} />
                    <div style={{ height: "10px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "80%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && fellows.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ background: "#0F2830", borderRadius: "4px", padding: "64px", border: "1px solid rgba(38,108,135,0.1)", display: "inline-block", maxWidth: "480px" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.5)", marginBottom: "12px" }}>
                  Fellows segera bergabung.
                </p>
                <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.35)", lineHeight: 1.8 }}>
                  Jaringan akademisi dan peneliti Manara sedang dibentuk.
                </p>
              </div>
            </div>
          )}

          {!loading && fellows.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "20px" }}>
              {fellows.map((fellow, i) => (
                <div
                  key={fellow.id}
                  onMouseEnter={() => setHoveredId(fellow.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: "#fff",
                    border: `1px solid ${hoveredId === fellow.id ? "rgba(38,108,135,0.3)" : "rgba(38,108,135,0.1)"}`,
                    borderRadius: "4px",
                    overflow: "hidden",
                    transition: "all 0.25s ease",
                    transform: hoveredId === fellow.id ? "translateY(-3px)" : "none",
                    boxShadow: hoveredId === fellow.id ? "0 12px 32px rgba(15,40,48,0.1)" : "none",
                  }}
                >
                  {/* Top accent bar */}
                  <div style={{
                    height: "3px",
                    background: hoveredId === fellow.id ? "#266c87" : "transparent",
                    transition: "background 0.25s",
                  }} />

                  <div style={{ padding: "24px" }}>
                    {/* Row utama: foto + nama + expertise */}
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      {/* Foto */}
                      <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: fellow.photo ? undefined : GRADS[i % 5],
                        position: "relative",
                      }}>
                        {fellow.photo ? (
                          <img
                            src={fellow.photo}
                            alt={fellow.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                          />
                        ) : (
                          <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "Georgia,serif", fontSize: "28px",
                            fontStyle: "italic", color: "rgba(255,255,255,0.2)",
                          }}>
                            {fellow.name?.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Nama + expertise */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: "Georgia,serif",
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#0F2830",
                          lineHeight: 1.35,
                          marginBottom: "4px",
                        }}>
                          {fellow.name}
                          {fellow.title && (
                            <span style={{ fontSize: "12px", fontWeight: 300, color: "#7A9AA5" }}>
                              {", "}{fellow.title}
                            </span>
                          )}
                        </h3>

                        {fellow.position && (
                          <p style={{ fontSize: "12px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
                            {fellow.position}
                          </p>
                        )}

                        {/* Expertise tags */}
                        {fellow.expertise?.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {fellow.expertise.slice(0, 2).map((exp: string) => (
                              <span key={exp} style={{
                                display: "inline-flex", alignItems: "center", gap: "5px",
                                fontSize: "11px", fontWeight: 500,
                                color: "#266c87",
                                background: "rgba(38,108,135,0.06)",
                                border: "1px solid rgba(38,108,135,0.12)",
                                padding: "3px 10px", borderRadius: "2px",
                              }}>
                                <span style={{ fontSize: "10px" }}>◎</span>
                                {exp}
                              </span>
                            ))}
                            {fellow.expertise.length > 2 && (
                              <span style={{ fontSize: "11px", color: "#B8CDD2", padding: "3px 8px" }}>
                                +{fellow.expertise.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "rgba(38,108,135,0.07)", marginBottom: "14px" }} />

                    {/* Background / Institusi */}
                    {fellow.institution && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", color: "#B8CDD2", flexShrink: 0, marginTop: "1px" }}>
                          Background:
                        </span>
                        <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560", lineHeight: 1.6 }}>
                          {fellow.institution}
                        </p>
                      </div>
                    )}

                    {/* Bio — muncul saat hover */}
                    <div style={{
                      maxHeight: hoveredId === fellow.id ? "120px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.25s ease",
                      opacity: hoveredId === fellow.id ? 1 : 0,
                    }}>
                      {fellow.bio && (
                        <p style={{
                          fontSize: "13px", fontWeight: 300, color: "#7A9AA5",
                          lineHeight: 1.75, paddingTop: "10px",
                          borderTop: "1px solid rgba(38,108,135,0.06)",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {fellow.bio}
                        </p>
                      )}

                      {/* Social links */}
                      {fellow.socialLinks && Object.values(fellow.socialLinks).some(Boolean) && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                          {[
                            { key: "linkedin", label: "LinkedIn" },
                            { key: "twitter", label: "X/Twitter" },
                            { key: "website", label: "Website" },
                          ].map(s => fellow.socialLinks?.[s.key] && (
                            <a key={s.key}
                              href={fellow.socialLinks[s.key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{
                                fontSize: "11px", fontWeight: 500, color: "#266c87",
                                border: "1px solid rgba(38,108,135,0.2)",
                                padding: "4px 12px", borderRadius: "2px",
                                textDecoration: "none",
                              }}
                            >
                              {s.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Jadi Fellow */}
          {!loading && (
            <div style={{ marginTop: "64px", background: "#0F2830", borderRadius: "4px", padding: "clamp(40px,6vw,64px)", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(38,108,135,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "14px" }}>
                  Bergabung
                </p>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 300, color: "#EEF4F6", marginBottom: "12px", lineHeight: 1.2 }}>
                  Ingin menjadi Manara Fellow?
                </h2>
                <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.85, maxWidth: "480px", margin: "0 auto 32px" }}>
                  Kami membuka jaringan kolaborasi dengan akademisi, peneliti, dan praktisi yang ingin berkontribusi pada diskursus publik yang lebih substansial.
                </p>
                <Link href="/#contact"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#266c87", color: "#fff", padding: "13px 32px", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Hubungi Kami →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </main>
  );
}