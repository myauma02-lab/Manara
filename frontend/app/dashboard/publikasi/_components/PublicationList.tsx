"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PUBLISHED: { label: "Published", bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
  DRAFT: { label: "Draft", bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
  REVIEW: { label: "Review", bg: "rgba(38,108,135,0.1)", color: "#266c87" },
  ARCHIVED: { label: "Arsip", bg: "rgba(148,163,184,0.15)", color: "#64748b" },
};

const EDITOR_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"];

export default function PublicationList({ type, title, accent, basePath, publicPathPrefix }: {
  type: "ARTICLE" | "PAPER" | "JOURNAL"; title: string; accent: string; basePath: string; publicPathPrefix: string;
}) {
  const { user } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const canReview = !!user && EDITOR_ROLES.includes(user.role);
  const isWriter = user?.role === "PUBLIKASI_WRITER";

  const load = useCallback(() => {
    setLoading(true);
    publicationsApi.adminList({ type, search: search || undefined, limit: 15, page })
      .then(r => {
        setItems(r.data.data || []);
        setTotal(r.data.pagination?.total || (r.data.data || []).length);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus "${judul}"?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(id);
    try { await publicationsApi.delete(id); load(); } catch { alert("Gagal menghapus"); } finally { setDeleting(null); }
  };

  const handleQuickStatus = async (id: string, status: string) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      if (status === "PUBLISHED") fd.append("publishedAt", new Date().toISOString());
      await publicationsApi.update(id, fd);
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  let visible = isWriter ? items.filter(p => p.authorId === user?.id) : items;
  if (statusFilter !== "ALL") visible = visible.filter(p => p.status === statusFilter);

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Publikasi</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>{title}</h1>
          <p style={{ fontSize: "13px", color: "#7A9AA5" }}>{isWriter ? `${title} milik kamu` : `${total} total`}</p>
        </div>
        <Link href={`${basePath}/new`} style={{ textDecoration: "none" }}>
          <button style={{ padding: "10px 20px", background: accent, color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer" }}>
            + {title}
          </button>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "4px" }}>
          {["ALL", "DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "7px 14px", fontSize: "12px", fontWeight: 500, borderRadius: "2px", border: "none", cursor: "pointer", background: statusFilter === s ? `${accent}15` : "transparent", color: statusFilter === s ? accent : "#7A9AA5" }}>
              {s === "ALL" ? "Semua" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: "200px", display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()}
            placeholder={`Cari judul ${title.toLowerCase()}...`}
            style={{ flex: 1, padding: "10px 16px", fontSize: "13px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit" }} />
          {search && <button onClick={() => setSearch("")} style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "16px" }}>×</button>}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}><p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>Memuat...</p></div>
        ) : visible.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
              {search ? "Tidak ada hasil" : `Belum ada ${title.toLowerCase()}`}
            </p>
            <Link href={`${basePath}/new`} style={{ fontSize: "13px", color: accent }}>+ Buat baru</Link>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px", gap: "0", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "12px 20px", background: "rgba(38,108,135,0.02)" }}>
              {["Judul & Penulis", "Status", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {visible.map(p => {
              const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.DRAFT;
              const isOwner = p.authorId === user?.id;
              const canEditThis = canReview || (isOwner && p.status === "DRAFT");
              return (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px", gap: "0", padding: "16px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>
                  <div style={{ paddingRight: "16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "3px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</p>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{p.author?.name}</p>
                      {p.publishedAt && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>· {new Date(p.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>}
                      {p.viewCount > 0 && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>· 👁 {p.viewCount}</p>}
                      {p.status === "REVIEW" && canReview && <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 500 }}>· Perlu review</span>}
                    </div>
                  </div>
                  <div>
                    {canReview ? (
                      <select value={p.status} onChange={e => handleQuickStatus(p.id, e.target.value)}
                        style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 8px", borderRadius: "2px", background: sc.bg, color: sc.color, border: "none", cursor: "pointer", outline: "none", appearance: "none" }}>
                        <option value="DRAFT">Draft</option>
                        <option value="REVIEW">Review</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Arsip</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "2px", background: sc.bg, color: sc.color }}>{sc.label}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Link href={`${basePath}/${p.id}`} style={{ fontSize: "12px", fontWeight: 500, color: accent, textDecoration: "none", padding: "5px 12px", border: `1px solid ${accent}30`, borderRadius: "2px" }}>
                      {canEditThis ? "Edit" : "Lihat"}
                    </Link>
                    {p.status === "PUBLISHED" && (
                      <Link href={`${publicPathPrefix}/${p.slug}`} target="_blank" style={{ fontSize: "12px", color: "#7A9AA5", textDecoration: "none", padding: "5px 8px" }}>↗</Link>
                    )}
                    {canReview && (
                      <button onClick={() => handleDelete(p.id, p.title)} disabled={deleting === p.id}
                        style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: "5px 8px", opacity: deleting === p.id ? 0.5 : 1 }}>
                        {deleting === p.id ? "..." : "Hapus"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "20px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === 1 ? "#B8CDD2" : "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: page === p ? accent : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px", fontWeight: page === p ? 500 : 400 }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "transparent", color: page === totalPages ? "#B8CDD2" : "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}>→</button>
        </div>
      )}
    </div>
  );
}