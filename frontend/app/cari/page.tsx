"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { publicationsApi, projectsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

type TabType = "semua" | "artikel" | "paper" | "journal" | "research";

const TAB_CONFIG: { key: TabType; label: string; color: string }[] = [
  { key: "semua", label: "Semua", color: "#266c87" },
  { key: "artikel", label: "Artikel", color: "#266c87" },
  { key: "paper", label: "Paper", color: "#3F6F6A" },
  { key: "journal", label: "Journal", color: "#5F8F8A" },
  { key: "research", label: "Research", color: "#8A8F5E" },
];

interface Result {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  abstract?: string;
  description?: string;
  type: string;
  author?: { name: string };
  publishedAt?: string;
  coverImage?: string;
  href: string;
  typeLabel: string;
  typeColor: string;
}

export default function CariPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const [inputVal, setInputVal] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<TabType>("semua");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);

  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);

    try {
      const promises: Promise<any>[] = [];

      // Tentukan apa yang di-fetch berdasarkan tab
      if (activeTab === "semua" || activeTab === "artikel") {
        promises.push(
          publicationsApi.list({ type: "ARTICLE", search: query, limit: activeTab === "semua" ? 5 : 12 })
            .then(r => (r.data.data || []).map((a: any) => ({
              ...a,
              href: `/publikasi/artikel/${a.slug}`,
              typeLabel: a.articleSubtype || "ARTIKEL",
              typeColor: "#266c87",
            })))
            .catch(() => [])
        );
      }

      if (activeTab === "semua" || activeTab === "paper") {
        promises.push(
          publicationsApi.list({ type: "PAPER", search: query, limit: activeTab === "semua" ? 5 : 12 })
            .then(r => (r.data.data || []).map((p: any) => ({
              ...p,
              href: `/publikasi/paper/${p.slug}`,
              typeLabel: p.paperSubtype?.replace(/_/g, " ") || "PAPER",
              typeColor: "#3F6F6A",
            })))
            .catch(() => [])
        );
      }

      if (activeTab === "semua" || activeTab === "journal") {
        promises.push(
          publicationsApi.list({ type: "JOURNAL", search: query, limit: activeTab === "semua" ? 3 : 12 })
            .then(r => (r.data.data || []).map((j: any) => ({
              ...j,
              href: `/publikasi/journal/${j.slug}`,
              typeLabel: j.volume ? `Vol.${j.volume}` : "JOURNAL",
              typeColor: "#5F8F8A",
            })))
            .catch(() => [])
        );
      }

      if (activeTab === "semua" || activeTab === "research") {
        promises.push(
          projectsApi.list({ search: query, limit: activeTab === "semua" ? 3 : 12 })
            .then(r => (r.data.data || []).map((p: any) => ({
              ...p,
              href: `/layanan/research/${p.slug}`,
              typeLabel: "RESEARCH",
              typeColor: "#8A8F5E",
            })))
            .catch(() => [])
        );
      }

      const all = (await Promise.all(promises)).flat();
      setResults(all);
      setTotal(all.length);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Trigger search saat query atau tab berubah
  useEffect(() => {
    if (q) doSearch(q);
  }, [q, activeTab, doSearch]);

  // Update URL saat search
  useEffect(() => {
    if (q) router.replace(`/cari?q=${encodeURIComponent(q)}`, { scroll: false });
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(inputVal);
  };

  const getSnippet = (r: Result) => {
    const text = r.excerpt || r.abstract || r.description || "";
    return text.length > 160 ? text.substring(0, 160) + "..." : text;
  };

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "100px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
              Pencarian
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "#0F2830", marginBottom: "28px" }}>
              {q ? `Hasil untuk "${q}"` : "Cari di Manara"}
            </h1>

            {/* Search bar */}
            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", overflow: "hidden" }}>
                <input
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Cari artikel, paper, jurnal, atau proyek riset..."
                  autoFocus
                  style={{ flex: 1, padding: "14px 20px", fontSize: "16px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "transparent" }}
                />
                {inputVal && (
                  <button type="button" onClick={() => { setInputVal(""); setQ(""); setResults([]); setSearched(false); }}
                    style={{ padding: "0 14px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "20px" }}>
                    ×
                  </button>
                )}
                <button type="submit"
                  style={{ padding: "14px 24px", background: "#266c87", color: "#fff", border: "none", fontSize: "14px", fontWeight: 500, letterSpacing: "0.04em", cursor: "pointer", flexShrink: 0 }}>
                  Cari
                </button>
              </div>
            </form>
          </div>

          {/* Tabs filter */}
          {searched && (
            <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "4px", flexWrap: "wrap" }}>
              {TAB_CONFIG.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em", borderRadius: "2px", border: "none", cursor: "pointer", background: activeTab === tab.key ? tab.color + "15" : "transparent", color: activeTab === tab.key ? tab.color : "#7A9AA5", transition: "all 0.2s" }}>
                  {tab.label}
                </button>
              ))}
              {searched && !loading && (
                <p style={{ fontSize: "13px", color: "#B8CDD2", marginLeft: "auto", alignSelf: "center", paddingRight: "8px" }}>
                  {total} hasil
                </p>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", padding: "20px", animation: "pulse 1.5s infinite", display: "flex", gap: "16px" }}>
                  <div style={{ width: "72px", height: "72px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "25%" }} />
                    <div style={{ height: "18px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "80%" }} />
                    <div style={{ height: "13px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && searched && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#7A9AA5", marginBottom: "10px" }}>
                Tidak ada hasil untuk "{q}".
              </p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "#B8CDD2", lineHeight: 1.7 }}>
                Coba kata kunci yang berbeda, atau jelajahi secara langsung:
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
                {[
                  { label: "Semua Artikel", href: "/publikasi/artikel" },
                  { label: "Manara Paper", href: "/publikasi/paper" },
                  { label: "Research", href: "/layanan/research" },
                ].map(l => (
                  <Link key={l.href} href={l.href}
                    style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 18px", borderRadius: "2px", textDecoration: "none" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder sebelum search */}
          {!searched && !loading && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, fontStyle: "italic", color: "#7A9AA5", marginBottom: "32px" }}>
                Apa yang sedang kamu cari?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "480px", margin: "0 auto" }}>
                <p style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
                  Jelajahi
                </p>
                {[
                  { label: "Artikel & Opini", href: "/publikasi/artikel", desc: "Esai, analisis, dan commentary", color: "#266c87" },
                  { label: "Manara Paper", href: "/publikasi/paper", desc: "Policy paper dan working paper", color: "#3F6F6A" },
                  { label: "Manara Journal", href: "/publikasi/journal", desc: "Publikasi ilmiah akademik", color: "#5F8F8A" },
                  { label: "Proyek Research", href: "/layanan/research", desc: "Proyek dan program riset aktif", color: "#8A8F5E" },
                ].map(item => (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", transition: "border-color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.3)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)"}
                    >
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{item.label}</p>
                        <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{item.desc}</p>
                      </div>
                      <span style={{ color: "#B8CDD2", fontSize: "16px" }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {results.map(r => (
                <Link key={`${r.type}-${r.id}`} href={r.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex",
                    gap: "16px",
                    background: "#fff",
                    border: "1px solid rgba(38,108,135,0.1)",
                    borderRadius: "4px",
                    padding: "18px 20px",
                    transition: "all 0.2s",
                    alignItems: "flex-start",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.3)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: "72px", height: "72px", borderRadius: "2px", flexShrink: 0, background: r.coverImage ? `url(${r.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", overflow: "hidden" }} />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "5px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "2px", background: r.typeColor + "15", color: r.typeColor }}>
                          {r.typeLabel}
                        </span>
                        {r.publishedAt && (
                          <span style={{ fontSize: "11px", color: "#B8CDD2" }}>
                            {new Date(r.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(15px,2vw,18px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, marginBottom: "6px" }}>
                        {/* Highlight query dalam judul */}
                        {r.title}
                      </h3>
                      {getSnippet(r) && (
                        <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {getSnippet(r)}
                        </p>
                      )}
                      {r.author?.name && (
                        <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "6px" }}>{r.author.name}</p>
                      )}
                    </div>

                    <span style={{ fontSize: "18px", color: "#B8CDD2", flexShrink: 0, marginTop: "4px" }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </main>
  );
}