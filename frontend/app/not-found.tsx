import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div style={{
        minHeight: "100vh",
        background: "#0F2830",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(38,108,135,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* 404 number */}
          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(100px, 20vw, 200px)",
            fontWeight: 300,
            color: "rgba(38,108,135,0.15)",
            lineHeight: 1,
            marginBottom: "0",
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}>
            404
          </p>

          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 300,
            color: "#EEF4F6",
            marginBottom: "16px",
            marginTop: "-16px",
          }}>
            Halaman tidak ditemukan.
          </p>

          <p style={{
            fontSize: "16px",
            fontWeight: 300,
            color: "rgba(134,175,170,0.5)",
            lineHeight: 1.8,
            maxWidth: "400px",
            marginBottom: "48px",
          }}>
            Sepertinya halaman yang kamu cari sudah dipindah, dihapus, atau memang tidak pernah ada.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{
              background: "#266c87",
              color: "#fff",
              padding: "14px 32px",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: "2px",
              textDecoration: "none",
            }}>
              Kembali ke Beranda
            </Link>
            <Link href="/artikel" style={{
              border: "1px solid rgba(38,108,135,0.3)",
              color: "rgba(134,175,170,0.7)",
              padding: "14px 32px",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: "2px",
              textDecoration: "none",
            }}>
              Baca Artikel
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}