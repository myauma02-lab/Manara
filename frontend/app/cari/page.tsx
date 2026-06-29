"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { articlesApi, researchApi, projectsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

type Tab = "semua" | "artikel" | "riset" | "proyek";

export default function CariPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [activeTab, setActiveTab] = useState<Tab>("semua");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    articles: any[]; research: any[]; projects: any[];
  }>({ articles: [], research: [], projects: [] });

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ articles: [], research: [], projects: [] });
      return;
    }
    setLoading(true);
    try {
      const [artRes, resRes, projRes] = await Promise.allSettled([
        articlesApi.list({ search: searchQuery, limit: 10 }),
        researchApi.list({ search: searchQuery, limit: 6 }),
        projectsApi.list(),
      ]);

      const articles = artRes.status === "fulfilled" ? artRes.value.data.data || [] : [];
      const research = resRes.status === "fulfilled" ? resRes.value.data.data || [] : [];
      const allProjects = projRes.status === "fulfilled" ? projRes.value.data.data || [] : [];
      const projects = allProjects.filter((p: any) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

      setResults({ articles, research, projects });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (q) { setQuery(q); search(q); }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
    search(query.trim());
  };

  const total = results.articles.length + results.research.length + results.projects.length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "semua", label: "Semua", count: total },
    { key: "artikel", label: "Artikel", count: results.articles.length },
    { key: "riset", label: "Riset", count: results.research.length },
    { key: "proyek", label: "Proyek", count: results.projects.length },
  ];

  const showArticles = activeTab === "semua" || activeTab === "artikel";
  const showResearch = activeTab === "semua" || activeTab === "riset";
  const showProjects = activeTab === "semua" || activeTab === "proyek";

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 40px" }}>

          {/* Search bar */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>
              Pencarian
            </p>
            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", gap: "0", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Cari artikel, riset, proyek..."
                  autoFocus
                  style={{
                    flex: 1, padding: "18px 24px", fontSize: "17px",
                    fontWeight: 300, border: "none", outline: "none",
                    color: "#1C3038", fontFamily: "inherit", background: "transparent",
                  }}
                />
                <button type="submit" style={{
                  background: "#266c87", color: "#fff", border: "none",
                  padding: "18px 32px", fontSize: "13px", fontWeight: 500,
                  letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                  flexShrink: 0,
                }}>
                  Cari
                </button>
              </div>
            </form>

            {q && !loading && (
              <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", marginTop: "12px" }}>
                {total > 0
                  ? `Ditemukan ${total} hasil untuk "${q}"`
                  : `Tidak ada hasil untuk "${q}"`
                }
              </p>
            )}
          </div>

          {/* Tabs */}
          {q && total > 0 && (
            <div style={{ display: "flex", gap: "4px", marginBottom: "32px", borderBottom: "1px solid rgba(38,108,135,0.1)", paddingBottom: "0" }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: activeTab === tab.key ? 500 : 300,
                    color: activeTab === tab.key ? "#266c87" : "#7A9AA5",
                    background: "transparent",
                    border: "none",
                    borderBottom: `2px solid ${activeTab === tab.key ? "#266c87" : "transparent"}`,
                    cursor: "pointer",
                    marginBottom: "-1px",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span style={{ marginLeft: "6px", fontSize: "11px", color: activeTab === tab.key ? "#266c87" : "#B8CDD2" }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", padding: "24px", display: "flex", gap: "16px", animation: "pulse 1.5s infinite" }}>
                  <div style={{ width: "80px", height: "60px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                    <div style={{ height: "14px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "70%" }} />
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && q && total === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>
                Tidak ada hasil.
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#B8CDD2", marginBottom: "32px" }}>
                Coba kata kunci yang berbeda atau lebih umum.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                {["/artikel", "/riset", "/proyek"].map(href => (
                  <Link key={href} href={href} style={{
                    border: "1px solid rgba(38,108,135,0.2)", padding: "10px 24px",
                    borderRadius: "2px", fontSize: "13px", color: "#266c87", textDecoration: "none",
                  }}>
                    Jelajahi {href.replace("/", "")}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No query state */}
          {!q && !loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
                Apa yang ingin kamu temukan?
              </p>
              <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2" }}>
                Cari artikel, paper riset, atau proyek Manara
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && total > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

              {/* Artikel */}
              {showArticles && results.articles.length > 0 && (
                <div>
                  {activeTab === "semua" && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2" }}>
                        Artikel ({results.articles.length})
                      </p>
                      <Link href={`/artikel`} style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>
                        Lihat semua →
                      </Link>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {results.articles.map((a, i) => (
                      <Link key={a.id} href={`/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "flex", gap: "16px", padding: "20px",
                          background: "#fff", borderRadius: "4px", marginBottom: "8px",
                          border: "1px solid rgba(38,108,135,0.08)",
                          transition: "border-color 0.2s",
                        }}>
                          <div style={{
                            width: "80px", height: "60px", flexShrink: 0,
                            background: a.coverImage ? `url(${a.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)",
                            borderRadius: "2px",
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#266c87" }}>
                                {a.mediaType}
                              </span>
                              {a.category && <span style={{ fontSize: "10px", color: "#B8CDD2" }}>· {a.category.name}</span>}
                            </div>
                            <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "4px" }}>
                              {highlightText(a.title, q)}
                            </p>
                            {a.excerpt && (
                              <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {a.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Riset */}
              {showResearch && results.research.length > 0 && (
                <div>
                  {activeTab === "semua" && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2" }}>
                        Riset & Paper ({results.research.length})
                      </p>
                      <Link href="/riset" style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>Lihat semua →</Link>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.research.map(r => (
                      <Link key={r.id} href={`/riset/${r.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{ padding: "20px", background: "#fff", borderRadius: "4px", border: "1px solid rgba(38,108,135,0.08)", transition: "border-color 0.2s" }}>
                          <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "10px", fontWeight: 500, color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "2px 8px", borderRadius: "2px" }}>
                              Paper
                            </span>
                            {r.year && <span style={{ fontSize: "10px", color: "#B8CDD2" }}>{r.year}</span>}
                          </div>
                          <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, marginBottom: "4px" }}>
                            {highlightText(r.title, q)}
                          </p>
                          {r.abstract && (
                            <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {r.abstract}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Proyek */}
              {showProjects && results.projects.length > 0 && (
                <div>
                  {activeTab === "semua" && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2" }}>
                        Proyek ({results.projects.length})
                      </p>
                      <Link href="/proyek" style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>Lihat semua →</Link>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.projects.map(p => (
                      <Link key={p.id} href={`/proyek/${p.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{ padding: "20px", background: "#fff", borderRadius: "4px", border: "1px solid rgba(38,108,135,0.08)", display: "flex", gap: "16px" }}>
                          <div style={{ width: "60px", height: "60px", flexShrink: 0, background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg,#3F6F6A,#266c87)", borderRadius: "2px" }} />
                          <div>
                            <span style={{ fontSize: "10px", fontWeight: 500, color: "#3F6F6A", border: "1px solid rgba(63,111,106,0.2)", padding: "2px 8px", borderRadius: "2px", marginBottom: "6px", display: "inline-block" }}>
                              Proyek
                            </span>
                            <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>
                              {highlightText(p.title, q)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </main>
  );
}

function highlightText(text: string, query: string) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: "rgba(38,108,135,0.15)", color: "#266c87", borderRadius: "2px", padding: "0 2px" }}>{part}</mark>
          : part
      )}
    </span>
  );
}