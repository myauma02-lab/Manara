"use client";
import { useEffect, useState, useCallback } from "react";
import { infoApi } from "@/lib/api";
import Link from "next/link";

const TYPE_CONFIG = {
  ALL:      { label: "Semua",      color: "#266c87", bg: "rgba(38,108,135,0.08)" },
  NEWS:     { label: "News",       color: "#266c87", bg: "rgba(38,108,135,0.08)" },
  AWARD:    { label: "Awards",     color: "#C6AD8A", bg: "rgba(198,173,138,0.12)" },
  MAGAZINE: { label: "Magazine",   color: "#5F8F8A", bg: "rgba(95,143,138,0.12)" },
  AGENDA:   { label: "Key Agenda", color: "#8A8F5E", bg: "rgba(138,143,94,0.12)" },
};

const STATUS_CONFIG = {
  PUBLISHED: { label: "Published", color: "#3F6F6A", bg: "rgba(63,111,106,0.1)" },
  DRAFT:     { label: "Draft",     color: "#A78E6D", bg: "rgba(167,142,109,0.12)" },
  ARCHIVED:  { label: "Archived",  color: "#7A9AA5", bg: "rgba(122,154,165,0.1)" },
};

export default function AdminPusatInformasiPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    infoApi.adminList({
      type: activeType === "ALL" ? undefined : activeType as any,
      search: search || undefined,
      limit: 15,
      page,
    })
      .then(r => {
        setItems(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeType, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [activeType, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"?`)) return;
    setDeleting(id);
    try {
      await infoApi.delete(id);
      load();
    } catch { alert("Gagal menghapus"); }
    finally { setDeleting(null); }
  };

  const handleQuickStatus = async (id: string, status: string) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      if (status === "PUBLISHED") fd.append("publishedAt", new Date().toISOString());
      await infoApi.update(id, fd);
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  const getCategoryPath = (type: string) => {
    const map: Record<string, string> = {
      NEWS: "news", AWARD: "awards", MAGAZINE: "magazine", AGENDA: "agenda",
    };
    return map[type] || "news";
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Pusat Informasi
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
            {total} item total
          </p>
        </div>

        {/* Tombol tambah per type */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Object.entries(TYPE_CONFIG).filter(([k]) => k !== "ALL").map(([key, cfg]) => (
            <Link key={key} href={`/admin/pusat-informasi/new?type=${key}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", border: `1px solid ${cfg.color}30`, borderRadius: "2px", fontSize: "12px", fontWeight: 500, color: cfg.color, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", background: cfg.bg }}>
              + {cfg.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Type tabs */}
        <div style={{ display: "flex", gap: "4px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "4px" }}>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setActiveType(key)}
              style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 500, borderRadius: "2px", border: "none", cursor: "pointer", background: activeType === key ? cfg.bg : "transparent", color: activeType === key ? cfg.color : "#7A9AA5", transition: "all 0.2s" }}>
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: "180px", display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()}
            placeholder="Cari judul..."
            style={{ flex: 1, padding: "9px 14px", fontSize: "13px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit" }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ padding: "0 10px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer" }}>×</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>Memuat...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
              Belum ada konten.
            </p>
            <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "20px" }}>
              Mulai tambahkan news, awards, magazine, atau agenda.
            </p>
            <Link href="/admin/pusat-informasi/new?type=NEWS"
              style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "9px 20px", borderRadius: "2px", textDecoration: "none" }}>
              + Tambah Konten Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 180px", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "11px 20px", background: "rgba(38,108,135,0.02)" }}>
              {["Judul", "Tipe", "Status", "Views", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>

            {items.map(item => {
              const tc = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.NEWS;
              const sc = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DRAFT;
              const catPath = getCategoryPath(item.type);

              return (
                <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 180px", padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>
                  {/* Title */}
                  <div style={{ paddingRight: "12px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </p>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {item.publishedAt && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                        {new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>}
                      {item.isFeatured && <span style={{ fontSize: "10px", color: "#C6AD8A" }}>★ Featured</span>}
                    </div>
                  </div>

                  {/* Type */}
                  <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "2px", background: tc.bg, color: tc.color, display: "inline-block" }}>
                    {tc.label}
                  </span>

                  {/* Status */}
                  <select value={item.status} onChange={e => handleQuickStatus(item.id, e.target.value)}
                    style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", padding: "4px 6px", borderRadius: "2px", background: sc.bg, color: sc.color, border: "none", cursor: "pointer", outline: "none" }}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>

                  {/* Views */}
                  <p style={{ fontSize: "13px", color: "#B8CDD2" }}>{item.viewCount || 0}</p>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <Link href={`/admin/pusat-informasi/${item.id}`}
                      style={{ fontSize: "12px", fontWeight: 500, color: "#266c87", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px" }}>
                      Edit
                    </Link>
                    {item.status === "PUBLISHED" && (
                      <Link href={`/pusat-informasi/${catPath}/${item.slug}`} target="_blank"
                        style={{ fontSize: "12px", color: "#7A9AA5", textDecoration: "none", padding: "4px 8px" }}>
                        ↗
                      </Link>
                    )}
                    <button onClick={() => handleDelete(item.id, item.title)} disabled={deleting === item.id}
                      style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", opacity: deleting === item.id ? 0.5 : 1 }}>
                      {deleting === item.id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "20px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px" }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer" }}>→</button>
        </div>
      )}
    </div>
  );
}