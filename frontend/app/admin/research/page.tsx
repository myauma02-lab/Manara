"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
import { useEffect, useState } from "react";
import { researchApi } from "@/lib/api";
import Link from "next/link";

export default function AdminResearchPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API_URL}/api/research`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("manara_token")}` }
    })
      .then(r => r.json())
      .then(d => setPapers(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus paper "${title}"?`)) return;
    try {
      await researchApi.delete(id);
      load();
    } catch {
      alert("Gagal menghapus");
    }
  };

  const STATUS_COLOR: any = {
    PUBLISHED: { bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
    DRAFT: { bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Riset & Paper</h1>
        </div>
        <Link
          href="/admin/research/new"
          style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}
        >
          + Upload Paper
        </Link>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "48px", textAlign: "center", color: "#7A9AA5" }}>Memuat...</p>
        ) : papers.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada paper</p>
            <p style={{ fontSize: "14px", color: "#B8CDD2", marginBottom: "24px" }}>Upload paper riset pertama Manara</p>
            <Link href="/admin/research/new" style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, borderRadius: "2px", textDecoration: "none" }}>
              Upload Paper
            </Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                {["Judul", "Penulis", "Vol/Tahun", "Unduhan", "Status", "Aksi"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {papers.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "4px", maxWidth: "280px" }}>{p.title}</p>
                    {p.pdfUrl && (
                      <a href={p.pdfUrl} target="_blank" style={{ fontSize: "11px", color: "#266c87", textDecoration: "none" }}>
                        Lihat PDF
                      </a>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#7A9AA5", maxWidth: "160px" }}>
                    {p.authors?.join(", ") || "—"}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#7A9AA5" }}>
                    {p.volume ? `Vol. ${p.volume}` : "—"}
                    {p.year ? ` · ${p.year}` : ""}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "#7A9AA5" }}>
                    {p.downloadCount}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "2px", background: STATUS_COLOR[p.status]?.bg || "rgba(184,205,210,0.2)", color: STATUS_COLOR[p.status]?.color || "#7A9AA5" }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Link href={`/admin/research/${p.id}`} style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>Edit</Link>
                      <button onClick={() => handleDelete(p.id, p.title)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        Hapus
                      </button>
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