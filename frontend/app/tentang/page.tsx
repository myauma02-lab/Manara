import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Manara",
  description: "Manara adalah kolektif intelektual dan inisiatif media kreatif yang lahir dari keyakinan bahwa diskursus yang bermakna dimulai dari pemikiran yang mendalam.",
};

const VALUES = [
  { symbol: "◎", title: "Depth", desc: "Kami menolak superfisialitas dalam segala bentuknya. Setiap gagasan yang kami geluti, kami geluti sepenuhnya." },
  { symbol: "◇", title: "Integrity", desc: "Kejujuran di atas kenyamanan. Kami berkata sesuai maksud dan memegang diri pada standar yang kami anut." },
  { symbol: "○", title: "Collective", desc: "Gagasan tumbuh lebih kuat saat dibagikan. Kami membangun ruang di mana pikiran beragam saling memperkaya." },
  { symbol: "✦", title: "Courage", desc: "Kami mengajukan pertanyaan sulit. Keberanian intelektual adalah fondasi diskursus yang bermakna." },
];

const TIMELINE = [
  { year: "2024", title: "Manara Didirikan", desc: "Lima pendiri bertemu dengan satu keyakinan: anak muda Indonesia butuh ruang intelektual yang lebih serius dan bermakna." },
  { year: "2024", title: "Platform Digital Diluncurkan", desc: "Website, newsletter, dan ekosistem media Manara mulai dibangun sebagai infrastruktur dasar kolektif." },
  { year: "2025", title: "Manapeople — Batch Pertama", desc: "Program rekrutmen pertama dibuka, mengundang individu-individu yang percaya bahwa gagasan dapat mengubah ruang publik." },
  { year: "2025", title: "Manara Papers", desc: "Divisi riset mulai memproduksi paper kebijakan, working paper, dan laporan lapangan yang dapat diakses publik." },
];

export default function TentangPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "100px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 20% 80%, rgba(38,108,135,0.2) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.7)", marginBottom: "24px" }}>
            Tentang Manara
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "32px", letterSpacing: "-0.02em" }}>
            Lebih dari organisasi —<br />
            <em style={{ color: "#86AFAA", fontStyle: "italic" }}>sebuah gerakan pemikiran.</em>
          </h1>
          <p style={{ fontSize: "18px", fontWeight: 300, color: "rgba(134,175,170,0.6)", lineHeight: 1.85, maxWidth: "580px" }}>
            Manara adalah kolektif intelektual dan inisiatif media kreatif yang lahir dari keyakinan bahwa diskursus yang bermakna dimulai dari mereka yang berani berpikir mendalam.
          </p>
        </div>
      </section>

      {/* Doctrine banner */}
      <div style={{ background: "#266c87", padding: "20px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.9)", letterSpacing: "0.01em" }}>
          "Shaping Ideas for the Public Sphere"
        </p>
      </div>

      {/* Apa itu Manara */}
      <section style={{ padding: "100px 40px", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>
                Siapa Kami
              </p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "28px" }}>
                Di persimpangan gagasan,<br />media, dan komunitas.
              </h2>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "20px" }}>
                Manara hadir sebagai ruang intelektual, kreatif, dan berpengetahuan guna menciptakan kebermanfaatan sosial berdasarkan nilai-nilai keilmuan, kolektivitas, dan independensi.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "20px" }}>
                Kami adalah sebagian think tank, sebagian studio kreatif, sebagian platform wacana anak muda. Kami tidak memproduksi kebisingan — kami membangun sinyal.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9 }}>
                Berbasis di Surabaya dan Sidoarjo, Jawa Timur, Manara bergerak dengan keyakinan bahwa perubahan ruang publik dimulai dari perubahan cara berpikir.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { icon: "◎", title: "Kolektif Intelektual", desc: "Komunitas pemikir yang berkomitmen pada kedalaman, bukan hanya kecepatan." },
                { icon: "◇", title: "Inisiatif Media Kreatif", desc: "Produksi konten yang menempatkan kualitas editorial di atas segalanya." },
                { icon: "✦", title: "Platform Wacana Muda", desc: "Ruang bagi suara-suara muda yang ingin berbicara dengan substansi." },
                { icon: "○", title: "Think Tank Ringan", desc: "Riset dan analisis kebijakan yang mudah diakses namun rigorous secara metodologi." },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", gap: "16px", padding: "20px 24px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#266c87", fontSize: "16px", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 400, color: "#0F2830", marginBottom: "4px" }}>{item.title}</p>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visi */}
      <section style={{ padding: "100px 40px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(38,108,135,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.6)", marginBottom: "24px" }}>Visi</p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.25, marginBottom: "32px" }}>
            Mewujudkan ruang intelektual, kreatif, berpengetahuan guna menciptakan{" "}
            <em style={{ color: "#86AFAA", fontStyle: "italic" }}>kebermanfaatan sosial</em>{" "}
            berdasarkan nilai-nilai keilmuan, kolektivitas, dan independensi.
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.9, maxWidth: "560px", margin: "0 auto" }}>
            Kami membayangkan generasi yang berefleksi sebelum bereaksi — yang membangun argumen sebelum mengambil posisi, dan yang menempatkan kebenaran di atas viralitas.
          </p>
        </div>
      </section>

      {/* Nilai-nilai */}
      <section style={{ padding: "100px 40px", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>Nilai-Nilai</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830" }}>
              Prinsip yang menuntun kami.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px" }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ padding: "36px 28px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#266c87", fontSize: "18px", marginBottom: "20px" }}>
                  {v.symbol}
                </div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830", marginBottom: "12px" }}>{v.title}</h3>
                <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "100px 40px", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>Perjalanan</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830" }}>Jejak langkah Manara.</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "56px", top: 0, bottom: 0, width: "1px", background: "rgba(38,108,135,0.15)" }} />
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "28px", marginBottom: "48px", position: "relative" }}>
                <div style={{ width: "112px", flexShrink: 0, textAlign: "right" }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#266c87" }}>{item.year}</span>
                </div>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#266c87", border: "3px solid #F8FAFA", flexShrink: 0, marginTop: "6px", position: "relative", zIndex: 2 }} />
                <div style={{ flex: 1, paddingBottom: "8px" }}>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 400, color: "#0F2830", marginBottom: "8px" }}>{item.title}</h3>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px", background: "#0F2830", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "20px" }}>
            Ingin menjadi bagian<br />dari Manara?
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, marginBottom: "40px" }}>
            Bergabunglah sebagai Manapeople, kontribusikan tulisanmu, atau hubungi kami untuk kolaborasi.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/manapeople" style={{ background: "#266c87", color: "#fff", padding: "14px 32px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
              Daftar Manapeople
            </Link>
            <Link href="/#contact" style={{ border: "1px solid rgba(38,108,135,0.3)", color: "rgba(134,175,170,0.7)", padding: "14px 32px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}