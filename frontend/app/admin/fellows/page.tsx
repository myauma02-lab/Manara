"use client";
import { useEffect, useState } from "react";
import { fellowsApi } from "@/lib/api";
import Link from "next/link";

export default function AdminFellowsPage() {
  const [fellows, setFellows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fellowsApi.all()
      .then(r => setFellows(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus "${name}"?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(id);
    try {
      await fellowsApi.delete(id);
      load();
    } catch { alert("Gagal menghapus"); }
    finally { setDeleting(null); }
  };

  const handleToggleActive = async (fellow: any) => {
    const fd = new FormData();
    fd.append("isActive", String(!fellow.isActive));
    fd.append("expertise", JSON.stringify(fellow.expertise || []));
    fd.append("socialLinks", JSON.stringify(fellow.socialLinks || {}));
    try {
      await fellowsApi.update(fellow.id, fd);
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Manara Fellows
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
            {fellows.length} fellow terdaftar · {fellows.filter(f => f.isActive).length} aktif
          </p>
        </div>
        <Link href="/admin/fellows/new"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: "#266c87", color: "#fff", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          + Tambah Fellow
        </Link>
      </div>

      {/* Info */}
      <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px 18px", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <span style={{ color: "#266c87", fontSize: "15px", flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.65 }}>
          Fellow yang berstatus <strong style={{ color: "#3F6F6A" }}>Aktif</strong> akan tampil di halaman publik{" "}
          <a href="/tentang/fellows" target="_blank" style={{ color: "#266c87" }}>/tentang/fellows</a>.{" "}
          Urutkan dengan mengubah nilai "Order" — angka kecil tampil lebih awal.
        </p>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>Memuat data fellows...</p>
          </div>
        ) : fellows.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
              Belum ada Manara Fellow
            </p>
            <p style={{ fontSize: "14px", color: "#B8CDD2", marginBottom: "24px" }}>
              Mulai tambahkan tenaga ahli dan peneliti Manara.
            </p>
            <Link href="/admin/fellows/new"
              style={{ display: "inline-flex", padding: "11px 24px", background: "#266c87", color: "#fff", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Tambah Fellow Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 100px 80px 180px", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "12px 20px", background: "rgba(38,108,135,0.02)" }}>
              {["Fellow", "Institusi", "Status", "Order", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>

            {fellows.map(fellow => (
              <div key={fellow.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 200px 100px 80px 180px", padding: "16px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>

                {/* Fellow info */}
                <div style={{ display: "flex", gap: "14px", alignItems: "center", paddingRight: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "4px", flexShrink: 0, overflow: "hidden", background: fellow.photo ? undefined : "linear-gradient(135deg,#266c87,#0F2830)" }}>
                    {fellow.photo ? (
                      <img src={fellow.photo} alt={fellow.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "Georgia,serif", fontSize: "18px", fontStyle: "italic" }}>
                        {fellow.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "2px" }}>
                      {fellow.name}
                    </p>
                    {fellow.title && (
                      <p style={{ fontSize: "11px", color: "#7A9AA5", marginBottom: "4px" }}>{fellow.title}</p>
                    )}
                    {fellow.expertise?.length > 0 && (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {fellow.expertise.slice(0, 2).map((e: string) => (
                          <span key={e} style={{ fontSize: "10px", color: "#266c87", background: "rgba(38,108,135,0.08)", padding: "2px 8px", borderRadius: "2px" }}>{e}</span>
                        ))}
                        {fellow.expertise.length > 2 && (
                          <span style={{ fontSize: "10px", color: "#B8CDD2" }}>+{fellow.expertise.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Institusi */}
                <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", paddingRight: "16px", lineHeight: 1.5 }}>
                  {fellow.institution || "—"}
                </p>

                {/* Status toggle */}
                <div>
                  <button onClick={() => handleToggleActive(fellow)}
                    style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "5px 12px", borderRadius: "2px", border: "none", cursor: "pointer", background: fellow.isActive ? "rgba(63,111,106,0.12)" : "rgba(122,154,165,0.12)", color: fellow.isActive ? "#3F6F6A" : "#7A9AA5", transition: "all 0.2s" }}>
                    {fellow.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </div>

                {/* Order */}
                <p style={{ fontSize: "14px", fontFamily: "Georgia,serif", fontWeight: 300, color: "#B8CDD2", textAlign: "center" }}>
                  {fellow.order}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Link href={`/admin/fellows/${fellow.id}`}
                    style={{ fontSize: "12px", fontWeight: 500, color: "#266c87", textDecoration: "none", padding: "5px 12px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px" }}>
                    Edit
                  </Link>
                  <a href={`/tentang/fellows`} target="_blank"
                    style={{ fontSize: "12px", color: "#7A9AA5", textDecoration: "none", padding: "5px 8px" }}>
                    ↗
                  </a>
                  <button onClick={() => handleDelete(fellow.id, fellow.name)} disabled={deleting === fellow.id}
                    style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: "5px 8px", opacity: deleting === fellow.id ? 0.5 : 1 }}>
                    {deleting === fellow.id ? "..." : "Hapus"}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}