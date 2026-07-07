import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const CHANNELS = [
  {
    href: "/insight/newsletter",
    title: "Newsletter",
    subtitle: "Surat Manara",
    desc: "Gagasan terbaik, langsung ke inbox-mu setiap minggu.",
    icon: "@",
    ready: true,
  },
  {
    href: "/insight/suara-manara",
    title: "Suara Manara",
    subtitle: "Short Video Series",
    desc: "Gagasan besar dalam format video pendek yang tajam.",
    icon: "▷",
    ready: true,
  },
  {
    href: "/insight/podcast",
    title: "Podcast",
    subtitle: "Manara Podcast",
    desc: "Percakapan mendalam dengan pemikir dan praktisi.",
    icon: "◉",
    ready: true,
  },
];

export default function InsightPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          <div style={{ marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
              Insight
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
              Kanal distribusi<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>gagasan Manara.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", lineHeight: 1.85 }}>
              Manara hadir di berbagai format. Dipilih agar gagasan bisa menjangkau siapa saja, di manapun mereka berada.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" }}>
            {CHANNELS.map(ch => (
              <Link key={ch.href} href={ch.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "#0F2830", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", padding: "40px 32px", transition: "border-color 0.2s" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#86AFAA", fontSize: "20px", marginBottom: "24px" }}>
                    {ch.icon}
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "8px" }}>
                    {ch.subtitle}
                  </p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#EEF4F6", marginBottom: "12px" }}>
                    {ch.title}
                  </h2>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.75, marginBottom: "24px" }}>
                    {ch.desc}
                  </p>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#86AFAA" }}>
                    Jelajahi →
                  </span>
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