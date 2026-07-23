"use client";
import { useEffect, useState, useCallback } from "react";
import { publicationsApi, categoriesApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const SUBTYPES = [
  { value: "", label: "Semua" },
  { value: "OPINION", label: "Opini" },
  { value: "ESSAY", label: "Esai" },
  { value: "ANALYSIS", label: "Analisis" },
  { value: "COMMENTARY", label: "Commentary" },
];

export default function ArtikelPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    publicationsApi.list({
      type: "ARTICLE",
      search: search || undefined,
      category: activeCategory || undefined,
      limit: 9,
      page,
    })
      .then(r => {
        setArticles(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, activeCategory, page]);

  useEffect(() => {
    categoriesApi.list()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, activeCategory]);

  const featured = articles.find(a => a.isFeatured);
  const rest = articles.filter(a => !a.isFeatured || page > 1);

  const getReadTime = (content: string) => {
    const words = content?.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <main>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <div style={{ paddingBottom: "48px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "32px", fontSize: "12px", color: "#B8CDD2" }}>
            <Link href="/publikasi" style={{ color: "#B8CDD2", textDecoration: "none" }}>Publikasi</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>Artikel</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", marginBottom: "24px" }}>
              <div>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
                  Artikel
                </p>
                <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1 }}>
                  Gagasan dalam <em style={{ color: "#266c87" }}>tulisan.</em>
                </h1>
              </div>
              {total > 0 && (
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2", flexShrink: 0 }}>
                  {total} artikel
                </p>
              )}
            </div>

            {/* Search */}
            <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", overflow: "hidden", marginBottom: "14px" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && load()}
                placeholder="Cari judul atau topik..."
                style={{ flex: 1, padding: "11px 18px", fontSize: "14px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "transparent" }}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  style={{ padding: "0 14px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px" }}>
                  ×
                </button>
              )}
              <button onClick={load}
                style={{ padding: "11px 20px", background: "#266c87", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer", flexShrink: 0 }}>
                Cari
              </button>
            </div>

            {/* Filter kategori */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => setActiveCategory("")}
                style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 500, border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: !activeCategory ? "#266c87" : "transparent", color: !activeCategory ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
                Semua
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setActiveCategory(c.slug)}
                  style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 500, border: `1px solid ${activeCategory === c.slug ? c.color || "#266c87" : "rgba(38,108,135,0.15)"}`, borderRadius: "2px", background: activeCategory === c.slug ? (c.color || "#266c87") : "transparent", color: activeCategory === c.slug ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "10px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "30%" }} />
                    <div style={{ height: "20px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "85%" }} />
                    <div style={{ height: "14px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#7A9AA5", marginBottom: "16px" }}>
                {search || activeCategory ? "Tidak ada artikel yang sesuai." : "Belum ada artikel."}
              </p>
              {(search || activeCategory) && (
                <button onClick={() => { setSearch(""); setActiveCategory(""); }}
                  style={{ fontSize: "13px", color: "#266c87", background: "none", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", padding: "9px 20px", cursor: "pointer" }}>
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* Featured */}
          {!loading && featured && page === 1 && !search && !activeCategory && (
            <div style={{ marginBottom: "40px" }}>
              <Link href={`/publikasi/artikel/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}
                  className="featured-grid">
                  <div style={{ aspectRatio: "4/3", background: featured.coverImage ? `url(${featured.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", position: "relative", minHeight: "240px" }}>
                    <span style={{ position: "absolute", top: "14px", left: "14px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.25)", border: "1px solid rgba(134,175,170,0.2)", padding: "4px 12px", borderRadius: "2px" }}>
                      ★ Unggulan
                    </span>
                  </div>
                  <div style={{ padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
                      {featured.articleSubtype || "ARTIKEL"}
                      {featured.category ? ` · ${featured.category.name}` : ""}
                    </p>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "12px" }}>
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, marginBottom: "20px" }}>
                        {featured.excerpt}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <p style={{ fontSize: "13px", color: "#B8CDD2" }}>{featured.author?.name}</p>
                      {featured.content && (
                        <p style={{ fontSize: "12px", color: "#B8CDD2" }}>· {getReadTime(featured.content)} menit</p>
                      )}
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", marginLeft: "auto" }}>Baca →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid */}
          {!loading && rest.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(clamp(260px,30vw,340px),1fr))", gap: "20px", marginBottom: "48px" }}>
              {rest.map(a => (
                <Link key={a.id} href={`/publikasi/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "border-color 0.2s" }}>
                    <div style={{ aspectRatio: "16/9", background: a.coverImage ? `url(${a.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", flexShrink: 0 }} />
                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                        {a.articleSubtype && (
                          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#266c87" }}>
                            {a.articleSubtype}
                          </span>
                        )}
                        {a.category && (
                          <span style={{ fontSize: "10px", color: "#B8CDD2" }}>· {a.category.name}</span>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(16px,2vw,19px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "8px", flex: 1 }}>
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.65, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {a.excerpt}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(38,108,135,0.07)", marginTop: "auto" }}>
                        <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{a.author?.name}</p>
                        <span style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Baca →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: "9px 18px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === 1 ? "#B8CDD2" : "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}>
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: "38px", height: "38px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", fontWeight: page === p ? 500 : 400, transition: "all 0.2s" }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: "9px 18px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === totalPages ? "#B8CDD2" : "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}>
                →
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 640px) {
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}