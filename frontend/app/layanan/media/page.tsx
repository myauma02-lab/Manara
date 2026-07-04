// Copy seluruh isi app/media/page.tsx ke sini Done
"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const CHANNELS = [
  { type: "Long-Form Publication", title: "Manara Journal", desc: "Jurnal panjang berkala. Esai, investigasi, dan analisis kritis tentang masyarakat, budaya, dan anak muda Indonesia.", href: "/artikel", cta: "Baca Artikel", grad: "linear-gradient(135deg,#0F2830,#266c87)", badge: "Unggulan" },
  { type: "Short Video Series", title: "Suara Manara", desc: "Serial video pendek yang mengemas gagasan-gagasan besar dalam format yang mudah dicerna tanpa kehilangan kedalamannya.", href: "#", cta: "Segera Hadir", grad: "linear-gradient(135deg,#1a4f63,#5F8F8A)", badge: null },
  { type: "Podcast Series", title: "Manara Podcast", desc: "Percakapan dengan pemikir, kreator, dan praktisi. Audio esai dan dialog untuk pikiran yang reflektif.", href: "#", cta: "Segera Hadir", grad: "linear-gradient(135deg,#3F6F6A,#266c87)", badge: null },
  { type: "Newsletter", title: "Surat Manara", desc: "Surat gagasan, observasi, dan kurasi bacaan mingguan — dikirimkan langsung ke inbox-mu.", href: "#", cta: "Langganan", grad: "linear-gradient(135deg,#6E7448,#A4AA7A)", badge: null },
  { type: "Live Forum Series", title: "Dialog", desc: "Diskusi langsung dan forum publik berkala yang membawa gagasan Manara ke ruang nyata.", href: "#", cta: "Segera Hadir", grad: "linear-gradient(135deg,#266c87,#86AFAA)", badge: null },
  { type: "Research Publication", title: "Manara Papers", desc: "Makalah kebijakan, working paper, dan laporan lapangan. Menjembatani riset akademis dengan pemahaman publik.", href: "/riset", cta: "Lihat Paper", grad: "linear-gradient(135deg,#0F2830,#3F6F6A)", badge: null },
];

export default function MediaPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>Ekosistem Media</p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "20px" }}>
              Bagaimana kami<br /><em style={{ color: "#266c87", fontStyle: "italic" }}>menyebarkan gagasan.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", margin: "0 auto", lineHeight: 1.85 }}>
              Suara Manara hadir di berbagai saluran — masing-masing dirancang dengan niat berbeda untuk audiens yang beragam.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {CHANNELS.map(ch => (
              <div key={ch.title} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Thumbnail */}
                <div style={{ aspectRatio: "16/9", background: ch.grad, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "44px", fontStyle: "italic", color: "rgba(255,255,255,0.1)" }}>
                    {ch.title.split(" ")[0]}
                  </div>
                  {ch.badge && (
                    <span style={{ position: "absolute", top: "14px", left: "14px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.2)", border: "1px solid rgba(134,175,170,0.25)", padding: "3px 10px", borderRadius: "2px" }}>
                      {ch.badge}
                    </span>
                  )}
                </div>
                {/* Body */}
                <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#266c87", marginBottom: "8px" }}>{ch.type}</p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "10px" }}>{ch.title}</h2>
                  <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, flex: 1, marginBottom: "20px" }}>{ch.desc}</p>
                  <Link href={ch.href} style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: ch.href === "#" ? "#B8CDD2" : "#266c87", textDecoration: "none" }}>
                    {ch.cta} {ch.href !== "#" && "→"}
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

// Ganti semua href "/media/xxx" menjadi "/layanan/media/xxx"
// Update metadata:
// title: "Media | Layanan Manara"