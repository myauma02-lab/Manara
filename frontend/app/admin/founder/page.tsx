"use client";
import { useEffect, useState } from "react";
import { foundersApi } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const GRADS = [
  "linear-gradient(145deg,#266c87,#0F2830)",
  "linear-gradient(145deg,#3F6F6A,#266c87)",
  "linear-gradient(145deg,#5F8F8A,#3F6F6A)",
  "linear-gradient(145deg,#1a4f63,#266c87)",
  "linear-gradient(145deg,#6E7448,#8A8F5E)",
];

export default function AdminFounderPage() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    foundersApi.list()
      .then(r => setFounders(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus founder "${name}"?`)) return;
    try {
      await foundersApi.delete(id);
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
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Founders</h1>
        </div>
        <Link
          href="/admin/founder/new"
          style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}
        >
          + Tambah Founder
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {founders.map((f, i) => (
            <div key={f.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div
  style={{
    aspectRatio: "3/4",
    position: "relative",
    background: f.photo ? undefined : GRADS[i % 5],
    overflow: "hidden",
  }}
>
  {f.photo ? (
    <Image
      src={f.photo}
      alt={f.name}
      fill
      sizes="200px"
      style={{ objectFit: "cover" }}
    />
  ) : (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia,serif",
        fontSize: "64px",
        color: "rgba(255,255,255,0.1)",
      }}
    >
      {f.name.charAt(0)}
    </div>
  )}
</div>
              <div style={{ padding: "16px" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", color: "#0F2830", marginBottom: "4px" }}>{f.name}</p>
                <p style={{ fontSize: "11px", color: "#7A9AA5", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>{f.role}</p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Link
                    href={`/admin/founder/${f.id}`}
                    style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(f.id, f.name)}
                    style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}