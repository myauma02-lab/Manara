import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Manara",
  description:
    "Manara adalah kolektif intelektual dan inisiatif media kreatif yang lahir dari keyakinan bahwa diskursus yang bermakna dimulai dari pemikiran yang mendalam.",
};

const VALUES = [
  { symbol: "◎", title: "Depth", desc: "Kami menolak superfisialitas dalam segala bentuknya. Setiap gagasan yang kami geluti, kami geluti sepenuhnya." },
  { symbol: "◇", title: "Integrity", desc: "Kejujuran di atas kenyamanan. Kami berkata sesuai maksud dan memegang diri pada standar yang kami anut." },
  { symbol: "○", title: "Collective", desc: "Gagasan tumbuh lebih kuat saat dibagikan. Kami membangun ruang di mana pikiran beragam saling memperkaya." },
  { symbol: "✦", title: "Courage", desc: "Kami mengajukan pertanyaan sulit. Keberanian intelektual adalah fondasi diskursus yang bermakna." },
];

const TIMELINE = [
  { year: "Des 2025", title: "Manara Didirikan", desc: "Lima pendiri bertemu dengan satu keyakinan: anak muda Indonesia butuh ruang intelektual yang lebih serius dan bermakna." },
  { year: "Jul 2026", title: "Platform Digital Diluncurkan", desc: "Website, newsletter, dan ekosistem media Manara mulai dibangun sebagai infrastruktur dasar kolektif." },
  { year: "Agt 2026", title: "Manapeople — Batch Pertama", desc: "Program rekrutmen pertama dibuka, mengundang individu-individu yang percaya bahwa gagasan dapat mengubah ruang publik." },
  { year: "Soon", title: "Manara Papers", desc: "Divisi riset mulai memproduksi paper kebijakan, working paper, dan laporan lapangan yang dapat diakses publik." },
];

export default function TentangPage() {
  return (
    <main>
      <Navbar />

      {/* ── HERO — HeroBackground sebagai wrapper utama ── */}
      <HeroBackground
        settingKey={HERO_BG_KEYS.tentang}
        fallbackGradient="linear-gradient(135deg, #0F2830, #1a4f63)"
        gradientDirection="to-left"
        gradientColor="#0F2830"
        gradientOpacity={0.88}
        style={{ minHeight: "88vh", paddingTop: "0", display: "flex", alignItems: "flex-end" }}
      >
        {/* Radial accent */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 20% 80%, rgba(38,108,135,0.22) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "160px clamp(20px,5vw,48px) 80px",
          position: "relative", zIndex: 2, width: "100%",
        }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(134,175,170,0.4)" }} />
            <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(134,175,170,0.6)" }}>
              Tentang Manara
            </p>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(40px,6.5vw,84px)",
            fontWeight: 300,
            color: "#EEF4F6",
            lineHeight: 1.05,
            marginBottom: "28px",
            letterSpacing: "-0.02em",
            maxWidth: "800px",
          }}>
            Lebih dari organisasi —<br />
            <em style={{ color: "#86AFAA" }}>sebuah gerakan pemikiran.</em>
          </h1>

          <p style={{
            fontSize: "clamp(16px,2vw,19px)",
            fontWeight: 300,
            color: "rgba(134,175,170,0.55)",
            lineHeight: 1.85,
            maxWidth: "540px",
            marginBottom: "40px",
          }}>
            Manara adalah kolektif intelektual dan inisiatif media kreatif yang lahir dari keyakinan
            bahwa diskursus yang bermakna dimulai dari mereka yang berani berpikir mendalam.
          </p>

          {/* Tagline pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(38,108,135,0.15)",
            border: "1px solid rgba(134,175,170,0.2)",
            padding: "10px 22px", borderRadius: "40px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#86AFAA", display: "inline-block" }} />
            <span style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontStyle: "italic", color: "rgba(238,244,246,0.7)" }}>
              "Shaping Ideas for the Public Sphere"
            </span>
          </div>
        </div>
      </HeroBackground>

      {/* ── SIAPA KAMI ── */}
      <section style={{ padding: "100px clamp(20px,5vw,48px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }} className="two-col-grid">
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
                Siapa Kami
              </p>
              <h2 style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(28px,3.5vw,44px)",
                fontWeight: 300, color: "#0F2830",
                lineHeight: 1.2, marginBottom: "28px",
              }}>
                Di persimpangan gagasan,<br />media, dan komunitas.
              </h2>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "18px" }}>
                Manara hadir sebagai ruang intelektual, kreatif, dan berpengetahuan guna menciptakan
                kebermanfaatan sosial berdasarkan nilai-nilai keilmuan, kolektivitas, dan independensi.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "18px" }}>
                Kami adalah sebagian think tank, sebagian studio kreatif, sebagian platform wacana
                anak muda. Kami tidak memproduksi kebisingan — kami membangun sinyal.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9 }}>
                Berbasis di Jawa Timur, Manara bergerak dengan keyakinan bahwa perubahan ruang publik
                dimulai dari perubahan cara berpikir.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { icon: "◎", title: "Kolektif Intelektual", desc: "Komunitas pemikir yang berkomitmen pada kedalaman, bukan hanya kecepatan." },
                { icon: "◇", title: "Inisiatif Media Kreatif", desc: "Produksi konten yang menempatkan kualitas editorial di atas segalanya." },
                { icon: "✦", title: "Platform Wacana Muda", desc: "Ruang bagi suara-suara muda yang ingin berbicara dengan substansi." },
                { icon: "○", title: "Think Tank Ringan", desc: "Riset dan analisis kebijakan yang mudah diakses namun rigorous secara metodologi." },
              ].map(item => (
                <div key={item.title} style={{
                  display: "flex", gap: "16px", padding: "20px 24px",
                  background: "#fff", border: "1px solid rgba(38,108,135,0.1)",
                  borderRadius: "8px", transition: "all 0.2s",
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: "1px solid rgba(38,108,135,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#266c87", fontSize: "16px", flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 400, color: "#0F2830", marginBottom: "4px" }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISI ── */}
      <section style={{ padding: "100px clamp(20px,5vw,48px)", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(38,108,135,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Garis dekorasi */}
        <div style={{ position: "absolute", top: 0, left: "50%", width: "1px", height: "60px", background: "rgba(38,108,135,0.25)" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "24px" }}>
            Visi
          </p>
          <h2 style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(24px,3.5vw,44px)",
            fontWeight: 300, color: "#EEF4F6",
            lineHeight: 1.3, marginBottom: "28px",
          }}>
            Mewujudkan ruang intelektual, kreatif, berpengetahuan guna menciptakan{" "}
            <em style={{ color: "#86AFAA" }}>kebermanfaatan sosial</em>{" "}
            berdasarkan nilai-nilai keilmuan, kolektivitas, dan independensi.
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.4)", lineHeight: 1.9, maxWidth: "520px", margin: "0 auto" }}>
            Kami membayangkan generasi yang berefleksi sebelum bereaksi — yang membangun argumen
            sebelum mengambil posisi, dan yang menempatkan kebenaran di atas viralitas.
          </p>
        </div>
      </section>

      {/* ── NILAI-NILAI ── */}
      <section style={{ padding: "100px clamp(20px,5vw,48px)", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "14px" }}>
              Nilai-Nilai
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830" }}>
              Prinsip yang menuntun kami.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px" }}>
            {VALUES.map((v, i) => (
              <div key={v.title} style={{
                padding: "36px 28px",
                background: "#fff",
                border: "1px solid rgba(38,108,135,0.1)",
                borderRadius: "8px",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Aksen nomor di background */}
                <p style={{
                  position: "absolute", top: "16px", right: "20px",
                  fontFamily: "Georgia,serif", fontSize: "48px", fontWeight: 300,
                  color: "rgba(38,108,135,0.06)", lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  border: "1px solid rgba(38,108,135,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#266c87", fontSize: "18px", marginBottom: "20px",
                }}>
                  {v.symbol}
                </div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830", marginBottom: "12px" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: "100px clamp(20px,5vw,48px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "14px" }}>
              Perjalanan
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830" }}>
              Jejak langkah Manara.
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: "92px", top: "6px", bottom: 0, width: "1px", background: "linear-gradient(to bottom, rgba(38,108,135,0.3), rgba(38,108,135,0.05))" }} />
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "24px", marginBottom: "44px", alignItems: "flex-start" }}>
                {/* Year label */}
                <div style={{ width: "80px", flexShrink: 0, textAlign: "right", paddingTop: "4px" }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: "13px", fontWeight: 300, color: "#266c87" }}>
                    {item.year}
                  </span>
                </div>
                {/* Dot */}
                <div style={{
                  width: "13px", height: "13px", borderRadius: "50%",
                  background: i === TIMELINE.length - 1 ? "transparent" : "#266c87",
                  border: `2px solid ${i === TIMELINE.length - 1 ? "rgba(38,108,135,0.3)" : "#266c87"}`,
                  flexShrink: 0, marginTop: "4px", position: "relative", zIndex: 2,
                }} />
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 400, color: i === TIMELINE.length - 1 ? "#B8CDD2" : "#0F2830", marginBottom: "6px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px clamp(20px,5vw,48px)", background: "#0F2830", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(38,108,135,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "20px" }}>
            Bergabung
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "18px" }}>
            Ingin menjadi bagian<br />dari Manara?
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.85, marginBottom: "40px" }}>
            Bergabunglah sebagai Manapeople, kontribusikan tulisanmu, atau hubungi kami untuk kolaborasi.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/manapeople" style={{
              background: "#266c87", color: "#fff",
              padding: "14px 32px", fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.06em", textTransform: "uppercase",
              borderRadius: "4px", textDecoration: "none",
            }}>
              Daftar Manapeople →
            </Link>
            <Link href="/#contact" style={{
              border: "1px solid rgba(38,108,135,0.3)", color: "rgba(134,175,170,0.7)",
              padding: "14px 32px", fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.06em", textTransform: "uppercase",
              borderRadius: "4px", textDecoration: "none",
            }}>
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .two-col-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
  );
}