"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function RisetPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    publicationsApi.list({ limit: 12 })
      .then(r => setPapers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.abstract?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

          {/* Header */}
          <div style={{ marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>Riset & Wawasan</p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "16px" }}>
              Gagasan yang ditopang<br /><em style={{ color: "#266c87", fontStyle: "italic" }}>inkuiri yang cermat.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", maxWidth: "520px", lineHeight: 1.85, marginBottom: "40px" }}>
              Paper kebijakan, working paper, dan laporan lapangan dari divisi riset Manara.
            </p>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari paper atau topik..."
              style={{ padding: "12px 20px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", fontSize: "14px", outline: "none", color: "#1C3038", width: "100%", maxWidth: "400px", background: "#fff" }} />
          </div>

          {loading ? (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "24px" }}>
    {[1,2,3].map(i => (
      <div key={i} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ height: "12px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "20%" }} />
          <div style={{ height: "22px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "90%" }} />
          <div style={{ height: "14px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "70%" }} />
          <div style={{ height: "14px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "55%" }} />
        </div>
        <div style={{ padding: "14px 32px", borderTop: "1px solid rgba(38,108,135,0.06)", height: "44px", background: "rgba(38,108,135,0.02)" }} />
      </div>
    ))}
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
  </div>
) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
              {filtered.map(p => (
                <Link key={p.id} href={`//publikasi/journal/${p.slug}`} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", textDecoration: "none", display: "flex", flexDirection: "column", transition: "border-color 0.2s" }}>
                  <div style={{ padding: "32px", flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                      {p.year && <span style={{ fontSize: "11px", fontWeight: 500, color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "3px 10px", borderRadius: "2px" }}>{p.year}</span>}
                      {p.volume && <span style={{ fontSize: "11px", color: "#B8CDD2", border: "1px solid rgba(38,108,135,0.1)", padding: "3px 10px", borderRadius: "2px" }}>Vol. {p.volume}</span>}
                      {p.category && <span style={{ fontSize: "11px", color: "#B8CDD2", border: "1px solid rgba(38,108,135,0.1)", padding: "3px 10px", borderRadius: "2px" }}>{p.category.name}</span>}
                    </div>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, marginBottom: "12px" }}>{p.title}</h2>
                    <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.75, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.abstract}
                    </p>
                    {p.authors?.length > 0 && (
                      <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{p.authors.join(", ")}</p>
                    )}
                  </div>
                  <div style={{ padding: "16px 32px", borderTop: "1px solid rgba(38,108,135,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#7A9AA5" }}>↓ {p.downloadCount} unduhan</span>
                    {p.pdfUrl && <span style={{ fontSize: "11px", fontWeight: 500, color: "#266c87" }}>Baca Paper →</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
