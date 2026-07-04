"use client";
import { useEffect, useState, useCallback } from "react";
import { publicationsApi, categoriesApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function ArtikelPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeType, setActiveType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const MEDIA_TYPES = ["JOURNAL", "VIDEO", "PODCAST", "NEWSLETTER", "PAPER"];

  const load = useCallback(() => {
    setLoading(true);
    publicationsApi.list({
      search: search || undefined,
      category: activeCategory || undefined,
      type: (activeType || "ARTICLE") as "JOURNAL" | "PAPER" | "ARTICLE",
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
  }, [search, activeCategory, activeType, page]);

  useEffect(() => {
    categoriesApi.list()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  // Reset ke page 1 kalau filter berubah
  useEffect(() => { setPage(1); }, [search, activeCategory, activeType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const featured = articles.find(a => a.isFeatured);
  const rest = articles.filter(a => !a.isFeatured || page > 1);

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "100px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>

          {/* Header */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
              Artikel & Jurnal
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, margin: 0 }}>
                Gagasan dalam <em style={{ color: "#266c87" }}>tulisan.</em>
              </h1>
              {total > 0 && (
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2" }}>
                  {total} artikel
                </p>
              )}
            </div>
          </div>

          {/* Search + Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>

            {/* Search bar */}
            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", overflow: "hidden" }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari judul atau topik..."
                  style={{ flex: 1, padding: "12px 18px", fontSize: "15px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "transparent" }}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}
                    style={{ padding: "0 14px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px" }}>
                    ×
                  </button>
                )}
                <button type="submit"
                  style={{ padding: "12px 20px", background: "#266c87", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em" }}>
                  Cari
                </button>
              </div>
            </form>

            {/* Filter kategori */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase" }}>Kategori:</span>
              <button
                onClick={() => setActiveCategory("")}
                style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 500, border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: activeCategory === "" ? "#266c87" : "transparent", color: activeCategory === "" ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}
              >
                Semua
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.slug)}
                  style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 500, border: `1px solid ${activeCategory === c.slug ? c.color || "#266c87" : "rgba(38,108,135,0.15)"}`, borderRadius: "2px", background: activeCategory === c.slug ? (c.color || "#266c87") : "transparent", color: activeCategory === c.slug ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Filter tipe media */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase" }}>Format:</span>
              <button
                onClick={() => setActiveType("")}
                style={{ padding: "6px 14px", fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: activeType === "" ? "#0F2830" : "transparent", color: activeType === "" ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}
              >
                Semua
              </button>
              {MEDIA_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  style={{ padding: "6px 14px", fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: activeType === t ? "#0F2830" : "transparent", color: activeType === t ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}
                >
                  {t}
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
                    <div style={{ height: "14px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>
                {search || activeCategory || activeType ? "Tidak ada artikel yang sesuai." : "Belum ada artikel."}
              </p>
              {(search || activeCategory || activeType) && (
                <button
                  onClick={() => { setSearch(""); setActiveCategory(""); setActiveType(""); }}
                  style={{ fontSize: "13px", color: "#266c87", background: "none", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", padding: "9px 20px", cursor: "pointer" }}
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* Featured artikel — hanya di page 1 tanpa filter */}
          {!loading && featured && page === 1 && !search && !activeCategory && !activeType && (
            <div style={{ marginBottom: "48px" }}>
              <Link href={`/artikel/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ aspectRatio: "4/3", background: featured.coverImage ? `url(${featured.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", position: "relative" }}>
                    {!featured.coverImage && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "80px", fontStyle: "italic", color: "rgba(255,255,255,0.07)" }}>
                        {featured.title?.charAt(0)}
                      </div>
                    )}
                    <span style={{ position: "absolute", top: "16px", left: "16px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.25)", border: "1px solid rgba(134,175,170,0.2)", padding: "4px 12px", borderRadius: "2px" }}>
                      ★ Unggulan
                    </span>
                  </div>
                  <div style={{ padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
                      {featured.mediaType}
                      {featured.category && ` · ${featured.category.name}`}
                    </p>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "14px" }}>
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, marginBottom: "20px" }}>
                        {featured.excerpt}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <p style={{ fontSize: "13px", color: "#B8CDD2" }}>{featured.author?.name}</p>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", marginLeft: "auto" }}>Baca →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid artikel */}
          {!loading && rest.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(clamp(260px,30vw,340px),1fr))", gap: "20px", marginBottom: "48px" }}>
              {rest.map(a => (
                <Link key={a.id} href={`/artikel/${a.slug}`} style={{ textDecoration: "none", display: "flex" }}>
                  <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", width: "100%", transition: "border-color 0.2s, transform 0.2s" }}>
                    {/* Cover */}
                    <div style={{ aspectRatio: "16/9", background: a.coverImage ? `url(${a.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", position: "relative", overflow: "hidden" }}>
                      {!a.coverImage && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "40px", fontStyle: "italic", color: "rgba(255,255,255,0.07)" }}>
                          {a.title?.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Body */}
                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87" }}>
                          {a.mediaType}
                        </span>
                        {a.category && (
                          <span style={{ fontSize: "10px", color: "#B8CDD2" }}>· {a.category.name}</span>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(17px,2vw,20px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "8px", flex: 1 }}>
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.65, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {a.excerpt}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(38,108,135,0.07)" }}>
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
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "10px 18px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === 1 ? "#B8CDD2" : "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{ width: "40px", height: "40px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "14px", fontWeight: page === p ? 500 : 400, transition: "all 0.2s" }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: "10px 18px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === totalPages ? "#B8CDD2" : "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </main>
  );
}