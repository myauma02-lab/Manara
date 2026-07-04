"use client";
import { useEffect, useState, useCallback } from "react";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const PAPER_SUBTYPES = [
  { value: "", label: "Semua" },
  { value: "POLICY_PAPER", label: "Policy Paper" },
  { value: "WORKING_PAPER", label: "Working Paper" },
  { value: "POLICY_BRIEF", label: "Policy Brief" },
  { value: "WHITE_PAPER", label: "White Paper" },
  { value: "RESEARCH_NOTE", label: "Research Note" },
];

export default function PaperPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    publicationsApi.list({
      type: "PAPER",
      search: search || undefined,
      limit: 9,
      page,
    })
      .then(r => {
        setPapers(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "100px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "32px", fontSize: "12px", color: "#B8CDD2" }}>
            <Link href="/publikasi" style={{ color: "#B8CDD2", textDecoration: "none" }}>Publikasi</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>Manara Paper</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3F6F6A", marginBottom: "12px" }}>
              Manara Paper
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", marginBottom: "16px" }}>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1 }}>
                Kebijakan berbasis<br />
                <em style={{ color: "#3F6F6A" }}>bukti.</em>
              </h1>
              {total > 0 && (
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2" }}>{total} paper</p>
              )}
            </div>
            <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, maxWidth: "540px", marginBottom: "28px" }}>
              Policy paper, working paper, policy brief, white paper, dan research note — ditujukan untuk pemerintah, NGO, akademisi, dan lembaga.
            </p>

            {/* Search */}
            <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", overflow: "hidden", maxWidth: "480px" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()}
                placeholder="Cari judul atau topik..."
                style={{ flex: 1, padding: "11px 18px", fontSize: "14px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "transparent" }} />
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px" }}>×</button>
              )}
              <button onClick={load}
                style={{ padding: "11px 18px", background: "#3F6F6A", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Cari
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", padding: "28px", animation: "pulse 1.5s infinite" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "25%" }} />
                    <div style={{ height: "22px", background: "rgba(38,108,135,0.06)", borderRadius: "2px" }} />
                    <div style={{ height: "14px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && papers.length === 0 && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "80px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "rgba(238,244,246,0.6)", marginBottom: "12px" }}>
                {search ? "Paper tidak ditemukan." : "Belum ada paper."}
              </p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.4)" }}>
                {search ? "Coba kata kunci lain." : "Divisi riset Manara sedang mempersiapkan publikasi."}
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && papers.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px", marginBottom: "40px" }}>
                {papers.map(p => (
                  <Link key={p.id} href={`/publikasi/paper/${p.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "border-color 0.2s" }}>
                      <div style={{ padding: "28px", flex: 1 }}>
                        {/* Badges */}
                        <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
                          {p.paperSubtype && (
                            <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3F6F6A", border: "1px solid rgba(63,111,106,0.2)", padding: "3px 10px", borderRadius: "2px" }}>
                              {p.paperSubtype.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, marginBottom: "10px" }}>
                          {p.title}
                        </h2>
                        {p.abstract && (
                          <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.75, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.abstract}
                          </p>
                        )}
                        {p.authors?.length > 0 && (
                          <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "12px" }}>
                            {p.authors.join(", ")}
                          </p>
                        )}
                      </div>
                      <div style={{ padding: "14px 28px", borderTop: "1px solid rgba(38,108,135,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "11px", color: "#B8CDD2" }}>
                          ↓ {p.downloadCount || 0} unduhan
                        </span>
                        {p.pdfUrl && (
                          <span style={{ fontSize: "12px", fontWeight: 500, color: "#3F6F6A" }}>Baca Paper →</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === 1 ? "#B8CDD2" : "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#3F6F6A" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "9px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === totalPages ? "#B8CDD2" : "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer" }}>
                    →
                  </button>
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