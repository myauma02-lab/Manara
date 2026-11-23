import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/shared/PageHero";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Manara",
  description: "Manara Institute adalah rumah intelektual dan think-tank independen yang mengembangkan pengetahuan melalui penelitian, analisis kebijakan, publikasi, dan diskursus publik.",
};

const VALUES = [
  { symbol: "◎", title: "Kebebasan berpikir", desc: "Kami menjunjung kebebasan berpikir dan keterbukaan terhadap kritik." },
  { symbol: "◇", title: "Integritas ilmiah", desc: "Setiap gagasan berhak diuji, dan pengujian dilakukan secara terbuka serta bertanggung jawab." },
  { symbol: "○", title: "Kolektivitas", desc: "Kami membangun kolaborasi dan kapasitas intelektual secara bersama dan berkelanjutan." },
  { symbol: "✦", title: "Independensi", desc: "Manara bersifat nonpartisan dan menjaga independensi serta integritas intelektual dalam kolaborasi." },
  { symbol: "＋", title: "Tanggung jawab sosial", desc: "Kami menghormati martabat manusia, keberagaman pandangan, transparansi, dan akuntabilitas." },
];

const TIMELINE = [
  { year: "Desember 2025", title: "Manara Digagas", desc: "Gagasan untuk membangun ruang intelektual dan diskursus publik Manara mulai dirintis." },
  { year: "14 Mei 2026", title: "Manara Institute Resmi Berdiri", desc: "Manara didirikan di Malang, Jawa Timur, sebagaimana dicatat dalam Anggaran Dasar." },
  { year: "Juli 2026", title: "Platform Digital Diluncurkan", desc: "Website, newsletter, dan ekosistem media Manara mulai dibangun sebagai infrastruktur dasar kolektif." },
  { year: "Now", title: "Still in Motion", desc: "Manara terus mengembangkan penelitian, publikasi, dan ruang kolaborasi seiring kebutuhan serta kapasitas kolektif." },
];

const MISSIONS = [
  "Mengembangkan penelitian dan kajian yang relevan dengan persoalan publik.",
  "Mendorong pengujian gagasan melalui tradisi intelektual yang terbuka, kritis, dan bertanggung jawab.",
  "Menghasilkan publikasi dan pengetahuan yang dapat diakses serta dipertanggungjawabkan.",
  "Menghubungkan hasil penelitian dengan diskursus publik, proses kebijakan, dan kebutuhan masyarakat.",
  "Membangun kolaborasi dan kapasitas intelektual secara kolektif dan berkelanjutan.",
];

export default function TentangPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        settingKey={HERO_BG_KEYS.tentang}
        eyebrow="Tentang Manara"
        title="Ruang intelektual"
        accent="dan think-tank independen."
        description="Manara mengembangkan pengetahuan melalui penelitian, pengujian gagasan, analisis kebijakan, publikasi, dan pengembangan diskursus publik."
      />
      

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
              Manara adalah rumah intelektual dan think-tank independen yang mengembangkan pengetahuan melalui penelitian, pengujian gagasan, analisis kebijakan, publikasi, dan diskursus publik.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "20px" }}>
              Manara bersifat nonpartisan dan bukan alat kepentingan politik praktis, kelompok, atau pihak pemberi dana tertentu.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9 }}>
              Manara berkedudukan di Malang dan dapat menyelenggarakan kegiatan di wilayah lain sesuai kebutuhan organisasi.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { icon: "◎", title: "Rumah Intelektual", desc: "Ruang untuk mengembangkan pengetahuan melalui penelitian dan pengujian gagasan." },
                { icon: "◇", title: "Think-tank Independen", desc: "Kajian lintas bidang untuk mendukung pengembangan pengetahuan dan perbaikan kebijakan." },
                { icon: "✦", title: "Publikasi Terbuka", desc: "Hasil kajian dan pengetahuan yang diupayakan dapat diakses serta dipertanggungjawabkan." },
                { icon: "○", title: "Diskursus Publik", desc: "Menghubungkan hasil penelitian dengan percakapan publik dan kebutuhan masyarakat." },
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
            Menjadi rumah intelektual dan think-tank independen yang berkontribusi terhadap pengembangan pengetahuan, perbaikan kebijakan, dan perubahan sosial.
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.9, maxWidth: "560px", margin: "0 auto" }}>
            Visi ini menjadi arah kerja Manara dalam menghubungkan penelitian, kebijakan, dan diskursus publik.
          </p>
        </div>
      </section>

      {/* Misi */}
      <section style={{ padding: "88px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ maxWidth: "660px", marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "14px" }}>Misi</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 300, color: "#0F2830" }}>Apa yang kami upayakan.</h2>
          </div>
          <ol style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px", padding: 0, margin: 0, listStyle: "none", counterReset: "mission" }}>
            {MISSIONS.map((mission, index) => (
              <li key={mission} style={{ minHeight: "130px", padding: "22px 24px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                <span style={{ display: "block", marginBottom: "12px", color: "#266c87", fontFamily: "Georgia,serif", fontSize: "20px" }}>{String(index + 1).padStart(2, "0")}</span>
                <span style={{ color: "#3A5560", fontSize: "15px", lineHeight: 1.7 }}>{mission}</span>
              </li>
            ))}
          </ol>
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
