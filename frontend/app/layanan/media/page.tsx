import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media | Layanan Manara",
  description: "Ekosistem media Manara — dari jurnal hingga podcast, semua dirancang untuk menyebarkan gagasan.",
};

const CHANNELS = [
  { type: "Publikasi", title: "Manara Journal", desc: "Jurnal panjang berkala. Esai, investigasi, dan analisis kritis.", href: "/publikasi/artikel", cta: "Baca Artikel", grad: "linear-gradient(135deg,#0F2830,#266c87)", badge: "Aktif" },
  { type: "Research Publication", title: "Manara Paper", desc: "Paper kebijakan, working paper, dan laporan lapangan.", href: "/publikasi/paper", cta: "Lihat Paper", grad: "linear-gradient(135deg,#0F2830,#3F6F6A)", badge: "Aktif" },
  { type: "Short Video Series", title: "Suara Manara", desc: "Serial video pendek di Instagram — gagasan besar, format tajam.", href: "/insight/suara-manara", cta: "Tonton", grad: "linear-gradient(135deg,#1a4f63,#5F8F8A)", badge: null },
  { type: "Podcast Series", title: "Manara Podcast", desc: "Percakapan mendalam di YouTube untuk pikiran yang reflektif.", href: "/insight/podcast", cta: "Dengarkan", grad: "linear-gradient(135deg,#3F6F6A,#266c87)", badge: null },
  { type: "Newsletter", title: "Surat Manara", desc: "Gagasan terbaik dikirimkan langsung ke inbox setiap minggu.", href: "/insight/newsletter", cta: "Berlangganan", grad: "linear-gradient(135deg,#6E7448,#A4AA7A)", badge: null },
];

export default function MediaLayananPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#B8CDD2", marginBottom: "32px" }}>
            <Link href="/layanan" style={{ color: "#B8CDD2", textDecoration: "none" }}>Layanan</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>Media</span>
          </div>

          <div style={{ marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
              Layanan · Media
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
              Bagaimana kami<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>menyebarkan gagasan.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", lineHeight: 1.85 }}>
              Suara Manara hadir di berbagai kanal — masing-masing dirancang dengan niat berbeda untuk audiens yang beragam.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
            {CHANNELS.map(ch => (
              <div key={ch.title} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "16/9", background: ch.grad, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "40px", fontStyle: "italic", color: "rgba(255,255,255,0.07)" }}>
                    {ch.title}
                  </div>
                  {ch.badge && (
                    <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.25)", border: "1px solid rgba(134,175,170,0.2)", padding: "3px 10px", borderRadius: "2px" }}>
                      {ch.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: "24px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#266c87", marginBottom: "8px" }}>{ch.type}</p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "21px", fontWeight: 300, color: "#0F2830", marginBottom: "8px" }}>{ch.title}</h2>
                  <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, flex: 1, marginBottom: "20px" }}>{ch.desc}</p>
                  <Link href={ch.href} style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none" }}>
                    {ch.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}