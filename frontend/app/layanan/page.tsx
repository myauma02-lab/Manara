import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const LAYANAN = [
  {
    href: "/layanan/research",
    title: "Research",
    desc: "Riset kebijakan, analisis data, dan kajian tematik berbasis bukti.",
    icon: "○",
    ready: true,
  },
  {
    href: "/layanan/policy-brief",
    title: "Policy Brief",
    desc: "Dokumen kebijakan singkat dan actionable untuk pengambil keputusan.",
    icon: "◇",
    ready: false,
  },
  {
    href: "/layanan/training",
    title: "Training",
    desc: "Program pelatihan riset, penulisan, dan analisis kebijakan.",
    icon: "△",
    ready: false,
  },
  {
    href: "/layanan/media",
    title: "Media",
    desc: "Ekosistem media Manara — jurnal, podcast, video, dan newsletter.",
    icon: "◎",
    ready: true,
  },
  {
    href: "/layanan/consulting",
    title: "Consulting",
    desc: "Konsultasi kebijakan dan strategi komunikasi untuk organisasi.",
    icon: "✦",
    ready: false,
  },
  {
    href: "/layanan/event",
    title: "Event",
    desc: "Forum, diskusi publik, dan program kolaborasi komunitas.",
    icon: "□",
    ready: false,
  },
];

export default function LayananPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          <div style={{ marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
              Layanan
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
              Apa yang bisa<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>Manara lakukan.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", lineHeight: 1.85 }}>
              Manara menyediakan layanan intelektual dan kreatif untuk individu, organisasi, dan lembaga yang ingin bergerak berbasis bukti.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" }}>
            {LAYANAN.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{
                  background: "#fff",
                  border: "1px solid rgba(38,108,135,0.1)",
                  borderRadius: "4px",
                  padding: "32px",
                  height: "100%",
                  opacity: item.ready ? 1 : 0.65,
                  transition: "all 0.2s",
                  position: "relative",
                }}>
                  {!item.ready && (
                    <span style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#B8CDD2",
                      border: "1px solid rgba(38,108,135,0.1)",
                      padding: "3px 10px",
                      borderRadius: "2px",
                    }}>
                      Segera
                    </span>
                  )}
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#266c87", fontSize: "18px", marginBottom: "20px" }}>
                    {item.icon}
                  </div>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "10px" }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75 }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}