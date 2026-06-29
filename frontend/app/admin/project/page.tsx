"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

const STATUS_LABEL: any = {
  UPCOMING: { label: "Akan Datang", bg: "rgba(38,108,135,0.1)", color: "#266c87" },
  ACTIVE: { label: "Aktif", bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
  COMPLETED: { label: "Selesai", bg: "rgba(164,170,122,0.2)", color: "#6E7448" },
  ARCHIVED: { label: "Diarsipkan", bg: "rgba(184,205,210,0.2)", color: "#7A9AA5" },
};

export default function AdminProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    projectsApi.list()
      .then(r => setProjects(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus proyek "${title}"?`)) return;
    try {
      await projectsApi.delete(id);
      load();
    } catch {
      alert("Gagal menghapus");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Proyek & Program</h1>
        </div>
        <Link
          href="/admin/project/new"
          style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}
        >
          + Tambah Proyek
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat...</p>
      ) : projects.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada proyek</p>
          <p style={{ fontSize: "14px", color: "#B8CDD2", marginBottom: "24px" }}>Tambahkan proyek atau program Manara pertama</p>
          <Link href="/admin/project/new" style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, borderRadius: "2px", textDecoration: "none" }}>
            Tambah Proyek
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {projects.map(p => {
            const st = STATUS_LABEL[p.status] || STATUS_LABEL.UPCOMING;
            return (
              <div key={p.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                {/* Cover */}
                <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", position: "relative" }}>
                  {!p.coverImage && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "40px", fontStyle: "italic", color: "rgba(255,255,255,0.1)" }}>
                      {p.title.charAt(0)}
                    </div>
                  )}
                  {p.isFeatured && (
                    <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.2)", border: "1px solid rgba(134,175,170,0.25)", padding: "3px 10px", borderRadius: "2px" }}>
                      Unggulan
                    </span>
                  )}
                </div>
                {/* Body */}
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    {p.category && (
                      <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{p.category}</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830", marginBottom: "8px", lineHeight: 1.3 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#7A9AA5", lineHeight: 1.6, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.description}
                  </p>
                  {p.tags?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {p.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{ fontSize: "10px", border: "1px solid rgba(38,108,135,0.15)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "12px", paddingTop: "12px", borderTop: "1px solid rgba(38,108,135,0.08)" }}>
                    <Link href={`/admin/project/${p.id}`} style={{ fontSize: "12px", color: "#266c87", textDecoration: "none", fontWeight: 500 }}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}