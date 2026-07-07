import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast | Insight Manara",
  description: "Manara Podcast - percakapan mendalam dengan pemikir, kreator, dan praktisi.",
};

// Ganti dengan YouTube channel/playlist ID Manara
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@manara";
const YOUTUBE_PLAYLIST_ID = ""; // Isi dengan Playlist ID kalau sudah ada

// List video YouTube manual
const YOUTUBE_VIDEOS: { id: string; title: string; desc?: string }[] = [
  // Tambahkan video ID di sini nanti
  // Contoh: { id: "dQw4w9WgXcQ", title: "Episode 1 - Judul Episode" }
];

export default function PodcastPage() {
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
                Podcast Series
              </p>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "12px" }}>
                Manara Podcast
              </h1>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "480px", lineHeight: 1.85 }}>
                Percakapan mendalam dengan pemikir, kreator, dan praktisi. Untuk pikiran yang reflektif.
              </p>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.2)", padding: "12px 24px", borderRadius: "2px", fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none", flexShrink: 0 }}
            >
              Tonton di YouTube →
            </a>
          </div>

          {YOUTUBE_VIDEOS.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Featured — episode pertama lebih besar */}
              {YOUTUBE_VIDEOS[0] && (
                <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${YOUTUBE_VIDEOS[0].id}`}
                      title={YOUTUBE_VIDEOS[0].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                  </div>
                  <div style={{ padding: "24px 28px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87", marginBottom: "8px" }}>Episode Terbaru</p>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830" }}>
                      {YOUTUBE_VIDEOS[0].title}
                    </h2>
                  </div>
                </div>
              )}

              {/* Grid episode lainnya */}
              {YOUTUBE_VIDEOS.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
                  {YOUTUBE_VIDEOS.slice(1).map(video => (
                    <div key={video.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                        />
                      </div>
                      <div style={{ padding: "18px 20px" }}>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35 }}>
                          {video.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.6)", marginBottom: "20px" }}>
                Podcast segera hadir.
              </p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.4)", lineHeight: 1.8, marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
                Subscribe ke channel YouTube Manara untuk mendapat notifikasi saat episode pertama tayang.
              </p>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#266c87", color: "#fff", padding: "13px 32px", borderRadius: "2px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
              >
                Buka YouTube Manara →
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}