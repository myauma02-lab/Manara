import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import NewsletterForm from "@/components/shared/NewsletterForm";
import type { Metadata } from "next";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";

export const metadata: Metadata = {
  title: "Newsletter | Insight Manara",
  description: "Surat Manara - newsletter mingguan berisi gagasan dan analisis terbaik dari tim Manara.",
};

export default function NewsletterPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "none", minHeight: "100vh" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
        <HeroBackground
                          settingKey={HERO_BG_KEYS.layanan}
                          fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
                          gradientDirection="to-right"
                          gradientColor="#0F2830"
                          gradientOpacity={0.90}
                          style={{ paddingTop: "140px", minHeight: "320px" }}
                  >
          <Link href="/insight" style={{ display: "inline-block", fontSize: "12px", color: "#B8CDD2", textDecoration: "none", marginBottom: "40px" }}>
            ← Insight
          </Link>

          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
            Newsletter
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
            Surat Manara
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.85, marginBottom: "48px" }}>
            Newsletter mingguan berisi gagasan, analisis, dan kurasi konten terbaik dari tim Manara. Ringkas, substantif, tanpa spam.
          </p>

          {/* Apa yang kamu dapat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
            {[
              { icon: "✦", text: "Gagasan dan perspektif dari tim editorial Manara" },
              { icon: "◎", text: "Ringkasan artikel & riset terbaru" },
              { icon: "○", text: "Info program, forum, dan acara Manara" },
              { icon: "◇", text: "Kurasi bacaan pilihan dari penjuru dunia" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ color: "#266c87", fontSize: "14px", marginTop: "2px", flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: "15px", fontWeight: 300, color: "#3A5560", lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: "#0F2830", borderRadius: "4px", padding: "40px", border: "1px solid rgba(38,108,135,0.15)" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6", marginBottom: "6px" }}>
              Mulai berlangganan.
            </p>
            <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.4)", marginBottom: "24px" }}>
              Gratis. Bisa berhenti kapan saja.
            </p>
            <NewsletterForm dark />
          </div>

          <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center", marginTop: "16px" }}>
            Sudah ada {" "}
            <span style={{ color: "#266c87" }}>subscriber</span>
            {" "} yang bergabung.
          </p>
          </HeroBackground>
        </div>
      </div>
      <Footer />
    </main>
  );
}