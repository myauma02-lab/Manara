"use client";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function ManifestoSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });

  return (
    <section id="manifesto" style={{ padding: "160px 40px", background: "#0F2830", position: "relative", overflow: "hidden" }} ref={ref}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(38,108,135,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: "800px", margin: "0 auto",
        textAlign: "center",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: "all 0.8s ease",
      }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "48px" }}>
          <div style={{ width: "48px", height: "1px", background: "rgba(134,175,170,0.2)" }} />
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", margin: 0 }}>
            Manifesto Manara
          </p>
          <div style={{ width: "48px", height: "1px", background: "rgba(134,175,170,0.2)" }} />
        </div>

        {/* Quote */}
        <blockquote style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,5vw,56px)", fontWeight: 300, fontStyle: "italic", color: "#EEF4F6", lineHeight: 1.25, marginBottom: "40px", margin: "0 0 40px" }}>
          "Kami tidak mengangkat suara untuk didengar — kami mendalamkannya agar orang-orang yang tepat{" "}
          <em style={{ color: "#86AFAA", fontStyle: "normal" }}>mendengarkan.</em>"
        </blockquote>

        <p style={{ fontFamily: "Georgia,serif", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(134,175,170,0.3)", marginBottom: "64px" }}>
          — Manara Collective, 2024
        </p>

        {/* Teaser principles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "32px", textAlign: "left", marginBottom: "64px", paddingTop: "64px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
          {[
            { num: "I", text: "Kedalaman adalah bentuk keberanian." },
            { num: "II", text: "Pemuda bukan sekadar masa depan." },
            { num: "III", text: "Independensi adalah syarat kejujuran." },
          ].map(p => (
            <div key={p.num}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "rgba(38,108,135,0.35)", marginBottom: "10px" }}>{p.num}</p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "rgba(238,244,246,0.55)", lineHeight: 1.55 }}>{p.text}</p>
            </div>
          ))}
        </div>

        <Link href="/manifesto" style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: "1px solid rgba(38,108,135,0.25)", padding: "14px 32px", borderRadius: "2px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(134,175,170,0.6)", textDecoration: "none", transition: "all 0.2s" }}>
          Baca Manifesto Lengkap →
        </Link>
      </div>
    </section>
  );
}