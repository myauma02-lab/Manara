import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  description: string;
  parentHref: string;
  parentLabel: string;
  icon?: string;
}

export default function PlaceholderPage({
  title, subtitle, description,
  parentHref, parentLabel, icon = "○",
}: Props) {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          <Link href={parentHref} style={{ display: "inline-block", fontSize: "12px", color: "#B8CDD2", textDecoration: "none", marginBottom: "40px" }}>
            {parentLabel}
          </Link>

          <div style={{ background: "#0F2830", borderRadius: "4px", padding: "clamp(48px,8vw,96px) clamp(32px,6vw,80px)", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)", position: "relative", overflow: "hidden" }}>
            {/* Background decoration */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(38,108,135,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#86AFAA", fontSize: "22px", margin: "0 auto 28px" }}>
                {icon}
              </div>

              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "12px" }}>
                {subtitle}
              </p>

              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "20px" }}>
                {title}
              </h1>

              <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "440px", margin: "0 auto 40px" }}>
                {description}
              </p>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: "1px solid rgba(38,108,135,0.25)", padding: "12px 28px", borderRadius: "2px", color: "#86AFAA", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block", animation: "pulse 2s infinite" }} />
                Segera Hadir
              </div>
            </div>
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link href="/#contact" style={{ fontSize: "13px", color: "#266c87", textDecoration: "none" }}>
              Tertarik? Hubungi kami →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }`}</style>
    </main>
  );
}