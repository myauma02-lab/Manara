"use client";
import { useEffect, useState, useCallback } from "react";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function JournalPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    publicationsApi.list({
      type: "JOURNAL",
      search: search || undefined,
      limit: 9,
      page,
    })
      .then(r => {
        setJournals(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  // Group by volume
  const byVolume: Record<string, any[]> = {};
  journals.forEach(j => {
    const key = j.volume ? `Vol. ${j.volume}${j.year ? ` (${j.year})` : ""}` : "Terbaru";
    if (!byVolume[key]) byVolume[key] = [];
    byVolume[key].push(j);
  });

  return (
    <main>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <div style={{ paddingBottom: "48px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "32px", fontSize: "12px", color: "#B8CDD2" }}>
            <Link href="/publikasi" style={{ color: "#B8CDD2", textDecoration: "none" }}>Publikasi</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>Manara Journal</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5F8F8A", marginBottom: "12px" }}>
              Manara Journal
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", marginBottom: "16px" }}>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1 }}>
                Publikasi ilmiah<br />
                <em style={{ color: "#5F8F8A" }}>berstandar akademik.</em>
              </h1>
              {total > 0 && (
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2" }}>{total} artikel jurnal</p>
              )}
            </div>
            <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, maxWidth: "540px", marginBottom: "28px" }}>
              Jurnal ilmiah Manara dengan standar peer review - fondasi untuk indexing SINTA dan referensi akademis.
            </p>

            {/* ISSN info */}
            <div style={{ display: "inline-flex", gap: "16px", background: "rgba(38,108,135,0.06)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "12px 20px" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Penerbit</p>
                <p style={{ fontSize: "13px", color: "#3A5560" }}>Manara Collective</p>
              </div>
              <div style={{ width: "1px", background: "rgba(38,108,135,0.1)" }} />
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Frekuensi</p>
                <p style={{ fontSize: "13px", color: "#3A5560" }}>Berkala</p>
              </div>
              <div style={{ width: "1px", background: "rgba(38,108,135,0.1)" }} />
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Bahasa</p>
                <p style={{ fontSize: "13px", color: "#3A5560" }}>Indonesia / English</p>
              </div>
            </div>

            {/* Search */}
            <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", overflow: "hidden", maxWidth: "480px", marginTop: "24px" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()}
                placeholder="Cari judul atau penulis..."
                style={{ flex: 1, padding: "11px 18px", fontSize: "14px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "transparent" }} />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px" }}>×</button>
              )}
              <button onClick={load}
                style={{ padding: "11px 18px", background: "#5F8F8A", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Cari
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: "80px", background: "#fff", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && journals.length === 0 && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "rgba(238,244,246,0.6)", marginBottom: "12px" }}>
                {search ? "Artikel tidak ditemukan." : "Jurnal pertama segera hadir."}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.25)", padding: "10px 24px", borderRadius: "2px", color: "#86AFAA", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "20px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block" }} />
                Segera Hadir
              </div>
            </div>
          )}

          {/* Grouped by volume */}
          {!loading && journals.length > 0 && (
            <>
              {Object.entries(byVolume).map(([vol, items]) => (
                <div key={vol} style={{ marginBottom: "40px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#5F8F8A" }}>{vol}</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(38,108,135,0.1)" }} />
                    <span style={{ fontSize: "12px", color: "#B8CDD2" }}>{items.length} artikel</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {items.map(j => (
                      <Link key={j.id} href={`/publikasi/journal/${j.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{
                          background: "#fff",
                          borderBottom: "1px solid rgba(38,108,135,0.07)",
                          padding: "20px 24px",
                          display: "flex",
                          gap: "16px",
                          alignItems: "flex-start",
                          transition: "background 0.15s",
                          borderRadius: "4px",
                          marginBottom: "4px",
                          border: "1px solid rgba(38,108,135,0.1)",
                        }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(38,108,135,0.02)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                              {j.issue && <span style={{ fontSize: "10px", color: "#B8CDD2" }}>No. {j.issue}</span>}
                              {j.doi && <span style={{ fontSize: "10px", color: "#B8CDD2", fontFamily: "monospace" }}>{j.doi}</span>}
                            </div>
                            <h3 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "6px" }}>
                              {j.title}
                            </h3>
                            {j.authors?.length > 0 && (
                              <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                                {j.authors.join(", ")}
                              </p>
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                            {j.pdfUrl && (
                              <span style={{ fontSize: "11px", color: "#5F8F8A", fontWeight: 500 }}>PDF ↓</span>
                            )}
                            <span style={{ fontSize: "12px", color: "#266c87" }}>→</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "32px" }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#5F8F8A" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}>
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
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </main>
  );
}