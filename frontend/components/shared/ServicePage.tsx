"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────
export interface ServiceFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceStep {
  num: string;
  title: string;
  desc: string;
  duration?: string;
}

export interface ServiceDeliverable {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServicePageData {
  // Meta
  slug: string;
  parentHref: string;
  parentLabel: string;
  category: string;

  // Hero
  heroTitle: string;
  heroTitleAccent: string;
  heroDesc: string;
  heroGrad: string;
  heroIcon: string;

  // Overview
  overviewTitle: string;
  overviewDesc: string[];
  overviewStats: { value: string; label: string }[];

  // What We Do
  features: ServiceFeature[];

  // Process
  processTitle: string;
  processDesc: string;
  steps: ServiceStep[];

  // Deliverables
  deliverables: ServiceDeliverable[];

  // Target clients
  clients: { icon: string; label: string }[];

  // Why Manara
  whyTitle: string;
  whyPoints: { title: string; desc: string }[];

  // FAQ
  faqs: ServiceFAQ[];

  // CTA
  ctaTitle: string;
  ctaDesc: string;
  accentColor: string;
}

// ── Komponen utama ──────────────────────────────────────
export default function ServicePage({ data }: { data: ServicePageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: "140px", paddingBottom: "96px",
        background: "#0F2830", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: data.heroGrad, opacity: 0.6, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(15,40,48,0.9) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "32px", flexWrap: "wrap" }}>
            <Link href="/layanan" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Layanan</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>{data.category}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px", alignItems: "center" }}
            className="hero-grid">
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: data.accentColor, marginBottom: "16px", opacity: 0.8 }}>
                Layanan · {data.category}
              </p>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,72px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.08, marginBottom: "24px", letterSpacing: "-0.01em" }}>
                {data.heroTitle}<br />
                <em style={{ color: "#86AFAA", fontStyle: "italic" }}>{data.heroTitleAccent}</em>
              </h1>
              <p style={{ fontSize: "18px", fontWeight: 300, color: "rgba(134,175,170,0.55)", lineHeight: 1.85, maxWidth: "520px", marginBottom: "36px" }}>
                {data.heroDesc}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href="#contact-cta" style={{ background: "#266c87", color: "#fff", padding: "13px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
                  Konsultasi Gratis
                </a>
                <a href="#overview" style={{ border: "1px solid rgba(134,175,170,0.2)", color: "rgba(134,175,170,0.65)", padding: "13px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
                  Pelajari Lebih →
                </a>
              </div>
            </div>

            {/* Hero icon */}
            <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", color: "rgba(134,175,170,0.4)", flexShrink: 0 }}
              className="hero-icon">
              {data.heroIcon}
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section id="overview" style={{ padding: "96px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}
            className="two-col-grid">
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: data.accentColor, marginBottom: "16px" }}>
                Overview
              </p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "24px" }}>
                {data.overviewTitle}
              </h2>
              {data.overviewDesc.map((p, i) => (
                <p key={i} style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "16px" }}>{p}</p>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {data.overviewStats.map((stat, i) => (
                <div key={i} style={{ background: i % 2 === 0 ? "#0F2830" : "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "28px 24px" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "40px", fontWeight: 300, color: i % 2 === 0 ? "#EEF4F6" : "#0F2830", lineHeight: 1, marginBottom: "8px" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 300, color: i % 2 === 0 ? "rgba(134,175,170,0.4)" : "#7A9AA5", lineHeight: 1.6 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: data.accentColor, marginBottom: "14px" }}>
              What We Do
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: "#0F2830" }}>
              Yang kami kerjakan.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
            {data.features.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", background: data.accentColor, opacity: 0.04, borderRadius: "0 4px 0 100%" }} />
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${data.accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", color: data.accentColor, fontSize: "18px", marginBottom: "18px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "19px", fontWeight: 400, color: "#0F2830", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#0F2830" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start" }}
            className="two-col-grid">
            <div style={{ position: "sticky", top: "100px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "16px" }}>
                Proses
              </p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "16px" }}>
                {data.processTitle}
              </h2>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.85 }}>
                {data.processDesc}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {data.steps.map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "20px", paddingBottom: "40px", marginBottom: "40px", borderBottom: i < data.steps.length - 1 ? "1px solid rgba(38,108,135,0.1)" : "none" }}>
                  <div>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: data.accentColor }}>
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 400, color: "#EEF4F6" }}>{step.title}</h3>
                      {step.duration && (
                        <span style={{ fontSize: "11px", color: "rgba(134,175,170,0.35)", border: "1px solid rgba(38,108,135,0.15)", padding: "3px 10px", borderRadius: "2px" }}>
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.8 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DELIVERABLES ── */}
      <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: data.accentColor, marginBottom: "14px" }}>
              Deliverables
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: "#0F2830", marginBottom: "12px" }}>
              Yang kamu terima.
            </h2>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "480px", margin: "0 auto" }}>
              Output konkret yang diterima di setiap engagement dengan Manara.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px" }}>
            {data.deliverables.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", padding: "20px 22px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `1px solid ${data.accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: data.accentColor, flexShrink: 0 }}>
                  {d.icon}
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 500, color: "#0F2830", marginBottom: "4px" }}>{d.title}</p>
                  <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARGET CLIENTS ── */}
      <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: data.accentColor, marginBottom: "14px" }}>
              Target Klien
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: "#0F2830" }}>
              Untuk siapa layanan ini?
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {data.clients.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "40px", padding: "10px 20px" }}>
                <span style={{ fontSize: "16px" }}>{c.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MANARA ── */}
      <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#0F2830" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}
            className="two-col-grid">
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "16px" }}>
                Mengapa Manara
              </p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "16px" }}>
                {data.whyTitle}
              </h2>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.4)", lineHeight: 1.85 }}>
                Manara bukan konsultan biasa. Kami adalah kolektif intelektual yang bekerja berbasis nilai, bukan sekadar berbasis kontrak.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.whyPoints.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", padding: "20px 22px", background: "rgba(38,108,135,0.06)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "rgba(38,108,135,0.4)", flexShrink: 0, marginTop: "2px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 500, color: "#EEF4F6", marginBottom: "4px" }}>{p.title}</p>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.7 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: data.accentColor, marginBottom: "14px" }}>
              FAQ
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: "#0F2830" }}>
              Pertanyaan yang sering ditanya.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {data.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(38,108,135,0.1)", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", background: "none", border: "none", cursor: "pointer", gap: "16px", textAlign: "left" }}
                >
                  <span style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>
                    {faq.q}
                  </span>
                  <span style={{ fontSize: "20px", color: data.accentColor, flexShrink: 0, transition: "transform 0.25s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: "20px", animation: "fadeIn 0.2s ease" }}>
                    <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.85 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section id="contact-cta" style={{ padding: "120px clamp(20px,5vw,40px)", background: "#0F2830", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${data.accentColor}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "20px" }}>
            Mulai Sekarang
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "16px" }}>
            {data.ctaTitle}
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.85, marginBottom: "40px" }}>
            {data.ctaDesc}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/#contact" style={{ background: "#266c87", color: "#fff", padding: "14px 32px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
              Hubungi Kami
            </Link>
            <Link href="/manapeople" style={{ border: "1px solid rgba(38,108,135,0.3)", color: "rgba(134,175,170,0.6)", padding: "14px 32px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
              Bergabung Dulu
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-icon { display: none !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </main>
  );
}