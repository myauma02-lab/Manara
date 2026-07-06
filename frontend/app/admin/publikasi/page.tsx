"use client";
import { useEffect, useState, useCallback } from "react";
import { publicationsApi } from "@/lib/api";
import Link from "next/link";

const TYPE_CONFIG = {
  ALL: { label: "Semua", color: "#266c87", bg: "rgba(38,108,135,0.08)" },
  ARTICLE: { label: "Artikel", color: "#266c87", bg: "rgba(38,108,135,0.08)" },
  PAPER: { label: "Manara Paper", color: "#3F6F6A", bg: "rgba(63,111,106,0.1)" },
  JOURNAL: { label: "Manara Journal", color: "#5F8F8A", bg: "rgba(95,143,138,0.12)" },
};

const STATUS_CONFIG = {
  PUBLISHED: { label: "Published", bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
  DRAFT: { label: "Draft", bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
  REVIEW: { label: "Review", bg: "rgba(38,108,135,0.1)", color: "#266c87" },
};

export default function AdminPublikasiPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    publicationsApi.adminList({
      type: activeType === "ALL" ? undefined : activeType as any,
      search: search || undefined,
      limit: 15,
      page,
    })
      .then(r => {
        setPublications(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeType, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [activeType, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(id);
    try {
      await publicationsApi.delete(id);
      load();
    } catch {
      alert("Gagal menghapus publikasi");
    } finally {
      setDeleting(null);
    }
  };

  const handleQuickStatus = async (id: string, status: string) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      if (status === "PUBLISHED") fd.append("publishedAt", new Date().toISOString());
      await publicationsApi.update(id, fd);
      load();
    } catch {
      alert("Gagal mengubah status");
    }
  };

  const getTypePath = (type: string) => {
    if (type === "ARTICLE") return "artikel";
    if (type === "PAPER") return "paper";
    return "journal";
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Manajemen Publikasi
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
            {total} publikasi total
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/admin/publikasi/new?type=ARTICLE"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", fontSize: "12px", fontWeight: 500, color: "#266c87", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            + Artikel
          </Link>
          <Link href="/admin/publikasi/new?type=PAPER"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", border: "1px solid rgba(63,111,106,0.2)", borderRadius: "2px", fontSize: "12px", fontWeight: 500, color: "#3F6F6A", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            + Paper
          </Link>
          <Link href="/admin/publikasi/new?type=JOURNAL"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", border: "1px solid rgba(95,143,138,0.2)", borderRadius: "2px", fontSize: "12px", fontWeight: 500, color: "#5F8F8A", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            + Journal
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Type tabs */}
        <div style={{ display: "flex", gap: "4px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "4px" }}>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setActiveType(key)}
              style={{ padding: "7px 16px", fontSize: "12px", fontWeight: 500, borderRadius: "2px", border: "none", cursor: "pointer", background: activeType === key ? cfg.bg : "transparent", color: activeType === key ? cfg.color : "#7A9AA5", transition: "all 0.2s", letterSpacing: "0.03em" }}>
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: "200px", display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()}
            placeholder="Cari judul publikasi..."
            style={{ flex: 1, padding: "10px 16px", fontSize: "13px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit" }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "16px" }}>×</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>Memuat publikasi...</p>
          </div>
        ) : publications.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
              {search ? "Tidak ada hasil" : "Belum ada publikasi"}
            </p>
            <p style={{ fontSize: "14px", color: "#B8CDD2" }}>
              {search ? "Coba kata kunci lain" : "Mulai buat publikasi pertama Manara"}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 160px", gap: "0", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "12px 20px", background: "rgba(38,108,135,0.02)" }}>
              {["Judul & Penulis", "Tipe", "Status", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>

            {/* Table rows */}
            {publications.map(pub => {
              const tc = TYPE_CONFIG[pub.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.ARTICLE;
              const sc = STATUS_CONFIG[pub.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DRAFT;
              const typePath = getTypePath(pub.type);

              return (
                <div key={pub.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 160px", gap: "0", padding: "16px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>

                  {/* Title + meta */}
                  <div style={{ paddingRight: "16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "3px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {pub.title}
                    </p>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{pub.author?.name}</p>
                      {pub.publishedAt && (
                        <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                          · {new Date(pub.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                      {pub.viewCount > 0 && (
                        <p style={{ fontSize: "11px", color: "#B8CDD2" }}>· 👁 {pub.viewCount}</p>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: tc.bg, color: tc.color }}>
                      {tc.label}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <select
                      value={pub.status}
                      onChange={e => handleQuickStatus(pub.id, e.target.value)}
                      style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 8px", borderRadius: "2px", background: sc.bg, color: sc.color, border: "none", cursor: "pointer", outline: "none", appearance: "none" }}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="REVIEW">Review</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Link href={`/admin/publikasi/${pub.id}?type=${pub.type}`}
                      style={{ fontSize: "12px", fontWeight: 500, color: "#266c87", textDecoration: "none", padding: "5px 12px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px" }}>
                      Edit
                    </Link>
                    <Link href={`/publikasi/${typePath}/${pub.slug}`} target="_blank"
                      style={{ fontSize: "12px", color: "#7A9AA5", textDecoration: "none", padding: "5px 8px" }}>
                      ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(pub.id, pub.title)}
                      disabled={deleting === pub.id}
                      style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: "5px 8px", opacity: deleting === pub.id ? 0.5 : 1 }}
                    >
                      {deleting === pub.id ? "..." : "Hapus"}
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
            style={{ padding: "8px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === 1 ? "#B8CDD2" : "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}>
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? "#266c87" : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", fontWeight: page === p ? 500 : 400 }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === totalPages ? "#B8CDD2" : "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}>
            →
          </button>
        </div>
      )}
    </div>
  );
}