import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suara Manara | Insight",
  description: "Serial video pendek Manara — gagasan besar dalam format yang tajam dan mudah dicerna.",
};

// Ganti dengan URL Instagram Manara yang sebenarnya
const INSTAGRAM_URL = "https://www.instagram.com/manara_research/";

// List embed post Instagram manual
// Format: https://www.instagram.com/p/[POST_ID]/embed/
const INSTAGRAM_POSTS: string[] = [
  // Tambahkan post ID Instagram di sini nanti
  // Contoh: "C1234567890"
];

export default function SuaraManaraPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          <Link href="/insight" style={{ display: "inline-block", fontSize: "12px", color: "#B8CDD2", textDecoration: "none", marginBottom: "40px" }}>
            ← Insight
          </Link>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
                Short Video Series
              </p>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "12px" }}>
                Suara Manara
              </h1>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "480px", lineHeight: 1.85 }}>
                Gagasan besar dalam format video pendek yang tajam. Tayang di Instagram Manara setiap minggu.
              </p>
            </div>
            
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.2)", padding: "12px 24px", borderRadius: "2px", fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none", flexShrink: 0 }}
            >
              Ikuti di Instagram →
            </a>
          </div>

          {INSTAGRAM_POSTS.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {INSTAGRAM_POSTS.map(postId => (
                <div key={postId} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <iframe
                    src={`https://www.instagram.com/p/${postId}/embed/`}
                    width="100%"
                    height="480"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    title={`Suara Manara - ${postId}`}
                    style={{ display: "block" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.6)", marginBottom: "20px" }}>
                Konten segera hadir.
              </p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.4)", lineHeight: 1.8, marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
                Ikuti akun Instagram Manara untuk menjadi yang pertama melihat konten Suara Manara.
              </p>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#266c87", color: "#fff", padding: "13px 32px", borderRadius: "2px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
              >
                Buka Instagram Manara →
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}