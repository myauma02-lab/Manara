"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const CHANNEL_CONFIG: Record<string, {
  title: string; type: string; mediaType: string;
  desc: string; color: string; grad: string;
}> = {
  "manara-journal": {
    title: "Manara Journal",
    type: "Long-Form Publication",
    mediaType: "JOURNAL",
    desc: "Jurnal panjang berkala. Esai, investigasi, dan analisis kritis tentang masyarakat, budaya, gagasan, dan pengalaman anak muda Indonesia.",
    color: "#266c87",
    grad: "linear-gradient(135deg, #0F2830, #266c87)",
  },
  "suara-manara": {
    title: "Suara Manara",
    type: "Short Video Series",
    mediaType: "VIDEO",
    desc: "Serial video pendek yang mengemas gagasan-gagasan besar dalam format yang mudah dicerna tanpa kehilangan kedalamannya.",
    color: "#5F8F8A",
    grad: "linear-gradient(135deg, #1a4f63, #5F8F8A)",
  },
  "manara-podcast": {
    title: "Manara Podcast",
    type: "Podcast Series",
    mediaType: "PODCAST",
    desc: "Percakapan dengan pemikir, kreator, dan praktisi yang menavigasi realitas kompleks. Audio esai dan dialog untuk pikiran yang reflektif.",
    color: "#3F6F6A",
    grad: "linear-gradient(135deg, #3F6F6A, #266c87)",
  },
  "surat-manara": {
    title: "Surat Manara",
    type: "Newsletter",
    mediaType: "NEWSLETTER",
    desc: "Surat gagasan, observasi, dan kurasi bacaan mingguan. Dikirimkan langsung kepada mereka yang ingin berpikir lebih baik tentang dunia.",
    color: "#8A8F5E",
    grad: "linear-gradient(135deg, #6E7448, #A4AA7A)",
  },
  "dialog": {
    title: "Dialog",
    type: "Live Forum Series",
    mediaType: "FORUM",
    desc: "Diskusi langsung dan forum publik berkala yang membawa gagasan Manara ke ruang nyata bersama akademisi, praktisi, dan suara komunitas.",
    color: "#266c87",
    grad: "linear-gradient(135deg, #266c87, #86AFAA)",
  },
  "manara-papers": {
    title: "Manara Papers",
    type: "Research Publication",
    mediaType: "PAPER",
    desc: "Makalah kebijakan, working paper, dan laporan lapangan. Menjembatani riset akademis dengan pemahaman publik.",
    color: "#3F6F6A",
    grad: "linear-gradient(135deg, #0F2830, #3F6F6A)",
  },
};

export default function MediaChannelPage() {
  const { channel } = useParams();
  const slug = String(channel);
  const config = CHANNEL_CONFIG[slug];

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!config) { setLoading(false); return; }
    publicationsApi.list({ mediaType: config.mediaType, limit: 9, page } as any)
      .then(r => {
        setArticles(r.data.data || []);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, page]);

  if (!config) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", color: "#7A9AA5", marginBottom: "16px" }}>Channel tidak ditemukan.</p>
        <Link href="/media" style={{ color: "#266c87", textDecoration: "none", fontSize: "14px" }}>← Kembali ke Media</Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "60px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: config.grad, opacity: 0.6 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0F2830 30%, transparent 100%)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 2 }}>
          <Link href="/media" style={{ fontSize: "12px", color: "rgba(134,175,170,0.5)", textDecoration: "none", display: "block", marginBottom: "20px" }}>
            ← Media Ecosystem
          </Link>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: config.color, marginBottom: "12px" }}>
            {config.type}
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "16px" }}>
            {config.title}
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.55)", maxWidth: "520px", lineHeight: 1.85 }}>
            {config.desc}
          </p>
        </div>
      </section>

      {/* Content */}
      <div style={{ background: "#F4F7F7", padding: "80px 40px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "24px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "16px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "80%" }} />
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "rgba(238,244,246,0.6)", marginBottom: "12px" }}>
                Konten segera hadir.
              </p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.4)", lineHeight: 1.8, marginBottom: "32px" }}>
                Tim editorial Manara sedang mempersiapkan konten untuk {config.title}.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: "1px solid rgba(38,108,135,0.25)", padding: "10px 24px", borderRadius: "2px", color: "#86AFAA", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
                Segera Hadir
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "24px", marginBottom: "48px" }}>
                {articles.map(a => (
                  <Link key={a.id} href={`/artikel/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "all 0.25s", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ aspectRatio: "16/9", background: a.coverImage ? `url(${a.coverImage}) center/cover` : config.grad }} />
                      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: config.color, marginBottom: "8px" }}>
                          {config.type}
                        </p>
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "8px", flex: 1 }}>
                          {a.title}
                        </h2>
                        {a.excerpt && (
                          <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.7, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {a.excerpt}
                          </p>
                        )}
                        <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{a.author?.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: "40px", height: "40px", borderRadius: "2px", border: "1px solid rgba(38,108,135,0.2)", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
      `}</style>
    </main>
  );
}