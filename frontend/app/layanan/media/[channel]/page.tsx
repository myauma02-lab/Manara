"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const CHANNEL_CONFIG: Record<string, {
  title: string; type: string; pubType?: string;
  desc: string; color: string; grad: string;
}> = {
  "manara-journal": { title: "Manara Journal", type: "Jurnal & Artikel", pubType: "ARTICLE", desc: "Esai, investigasi, dan analisis kritis.", color: "#266c87", grad: "linear-gradient(135deg,#0F2830,#266c87)" },
  "suara-manara": { title: "Suara Manara", type: "Short Video Series", desc: "Serial video pendek di Instagram.", color: "#5F8F8A", grad: "linear-gradient(135deg,#1a4f63,#5F8F8A)" },
  "manara-podcast": { title: "Manara Podcast", type: "Podcast Series", desc: "Percakapan mendalam di YouTube.", color: "#3F6F6A", grad: "linear-gradient(135deg,#3F6F6A,#266c87)" },
  "surat-manara": { title: "Surat Manara", type: "Newsletter", desc: "Newsletter mingguan di inbox-mu.", color: "#8A8F5E", grad: "linear-gradient(135deg,#6E7448,#A4AA7A)" },
};

export default function MediaChannelPage() {
  const { channel } = useParams();
  const config = CHANNEL_CONFIG[String(channel)];
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!config?.pubType) { setLoading(false); return; }
    publicationsApi.list({ type: config.pubType as any, limit: 9, page })
      .then(r => {
        setArticles(r.data.data || []);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [channel, page]);

  if (!config) return (
    <main><Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>Channel tidak ditemukan.</p>
        <Link href="/layanan/media" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali ke Media</Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />
      <section style={{ minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "56px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: config.grad, opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0F2830 30%, transparent 100%)" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px clamp(20px,5vw,40px) 0", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "20px", flexWrap: "wrap" }}>
            <Link href="/layanan" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Layanan</Link>
            <span>→</span>
            <Link href="/layanan/media" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Media</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>{config.title}</span>
          </div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: config.color, marginBottom: "10px" }}>{config.type}</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "12px" }}>{config.title}</h1>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.5)", maxWidth: "480px", lineHeight: 1.8 }}>{config.desc}</p>
        </div>
      </section>

      <div style={{ background: "#F4F7F7", padding: "64px clamp(20px,5vw,40px) 120px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "18px", background: "rgba(38,108,135,0.06)", borderRadius: "2px" }} />
                    <div style={{ height: "13px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "rgba(238,244,246,0.6)", marginBottom: "16px" }}>Konten segera hadir.</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.25)", padding: "10px 24px", borderRadius: "2px", color: "#86AFAA", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
                Segera Hadir
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px", marginBottom: "40px" }}>
                {articles.map(a => (
                  <Link key={a.id} href={`/publikasi/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "border-color 0.2s" }}>
                      <div style={{ aspectRatio: "16/9", background: a.coverImage ? `url(${a.coverImage}) center/cover` : config.grad }} />
                      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: config.color, marginBottom: "8px" }}>
                          {config.type}
                        </p>
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, flex: 1, marginBottom: "10px" }}>
                          {a.title}
                        </h2>
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid rgba(38,108,135,0.07)" }}>
                          <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{a.author?.name}</p>
                          <span style={{ fontSize: "12px", fontWeight: 500, color: config.color }}>Baca →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer" }}>→</button>
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