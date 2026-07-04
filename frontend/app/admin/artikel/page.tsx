"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import Link from "next/link";

export default function AdminArtikelPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationsApi.adminList()
      .then(r => setArticles(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    await publicationsApi.delete(id);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const STATUS_COLOR: any = {
    PUBLISHED: { bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
    DRAFT: { bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
    REVIEW: { bg: "rgba(38,108,135,0.1)", color: "#266c87" },
    ARCHIVED: { bg: "rgba(184,205,210,0.2)", color: "#7A9AA5" },
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Artikel & Jurnal</h1>
        </div>
        <Link href="/admin/artikel/new" style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
          + Artikel Baru
        </Link>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "48px", textAlign: "center", color: "#7A9AA5", fontSize: "14px" }}>Memuat...</p>
        ) : articles.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada artikel</p>
            <p style={{ fontSize: "14px", color: "#B8CDD2" }}>Mulai dengan menulis artikel pertama</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                {["Judul", "Penulis", "Tipe", "Status", "Aksi"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "2px" }}>{a.title}</p>
                    {a.isFeatured && <span style={{ fontSize: "10px", color: "#266c87" }}>★ Unggulan</span>}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#7A9AA5" }}>{a.author?.name}</td>
                  <td style={{ padding: "16px 20px", fontSize: "12px", color: "#B8CDD2" }}>{a.mediaType}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "2px", background: STATUS_COLOR[a.status]?.bg, color: STATUS_COLOR[a.status]?.color }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Link href={`/admin/artikel/${a.id}`} style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>Edit</Link>
                      <button onClick={() => handleDelete(a.id, a.title)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
