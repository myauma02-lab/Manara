"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const LAYANAN_LIST = [
  {
    id: "research",
    title: "Research",
    icon: "○",
    color: "#266c87",
    href: "/layanan/research",
    editHref: "/admin/layanan/research",
    desc: "Riset kebijakan berbasis bukti — dari identifikasi masalah hingga rekomendasi yang actionable.",
    status: "active",
    sections: ["Hero", "Overview", "What We Do", "Process", "Deliverables", "Target Clients", "Why Manara", "FAQ", "CTA"],
  },
  {
    id: "policy-brief",
    title: "Policy Brief",
    icon: "◇",
    color: "#3F6F6A",
    href: "/layanan/policy-brief",
    editHref: "/admin/layanan/policy-brief",
    desc: "Dokumen kebijakan singkat, tajam, dan actionable untuk pengambil keputusan.",
    status: "active",
    sections: ["Hero", "Overview", "What We Do", "Process", "Deliverables", "Target Clients", "Why Manara", "FAQ", "CTA"],
  },
  {
    id: "training",
    title: "Training",
    icon: "△",
    color: "#5F8F8A",
    href: "/layanan/training",
    editHref: "/admin/layanan/training",
    desc: "Program pelatihan riset, penulisan, dan analisis kebijakan untuk individu dan tim.",
    status: "active",
    sections: ["Hero", "Overview", "What We Do", "Process", "Deliverables", "Target Clients", "Why Manara", "FAQ", "CTA"],
  },
  {
    id: "media",
    title: "Media",
    icon: "◉",
    color: "#266c87",
    href: "/layanan/media",
    editHref: "/admin/layanan/media",
    desc: "Ekosistem media Manara — jurnal, paper, newsletter, video, dan podcast.",
    status: "active",
    sections: ["Hero", "Overview", "What We Do", "Process", "Deliverables", "Target Clients", "Why Manara", "FAQ", "CTA"],
  },
  {
    id: "consulting",
    title: "Consulting",
    icon: "✦",
    color: "#8A8F5E",
    href: "/layanan/consulting",
    editHref: "/admin/layanan/consulting",
    desc: "Konsultasi kebijakan, strategi komunikasi, dan pengembangan program berbasis bukti.",
    status: "active",
    sections: ["Hero", "Overview", "What We Do", "Process", "Deliverables", "Target Clients", "Why Manara", "FAQ", "CTA"],
  },
  {
    id: "event",
    title: "Event",
    icon: "□",
    color: "#C6AD8A",
    href: "/layanan/event",
    editHref: "/admin/layanan/event",
    desc: "Forum, seminar, diskusi publik, dan program kolaborasi yang bermakna.",
    status: "active",
    sections: ["Hero", "Overview", "What We Do", "Process", "Deliverables", "Target Clients", "Why Manara", "FAQ", "CTA"],
  },
];

export default function AdminLayananPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
          Manajemen Layanan
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Kelola konten semua halaman layanan. Hover kartu untuk melihat detail — klik Edit untuk mengubah konten.
        </p>
      </div>

      {/* Info banner */}
      <div style={{ background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", padding: "14px 18px", marginBottom: "28px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ color: "#266c87", fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>💡</span>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", marginBottom: "3px" }}>Cara mengedit halaman layanan</p>
          <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.65 }}>
            Klik tombol <strong>Edit</strong> pada layanan yang ingin diubah. Kamu bisa mengubah semua section: hero, deskripsi, fitur, proses, FAQ, dan CTA. Perubahan langsung berlaku di website publik setelah disimpan.
          </p>
        </div>
      </div>

      {/* Grid kartu layanan */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "16px" }}>
        {LAYANAN_LIST.map(layanan => (
          <div
            key={layanan.id}
            onMouseEnter={() => setHoveredId(layanan.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              background: "#fff",
              border: `1px solid ${hoveredId === layanan.id ? layanan.color + "40" : "rgba(38,108,135,0.1)"}`,
              borderRadius: "4px",
              overflow: "hidden",
              transition: "all 0.25s ease",
              transform: hoveredId === layanan.id ? "translateY(-2px)" : "none",
              boxShadow: hoveredId === layanan.id ? `0 8px 24px ${layanan.color}15` : "none",
              position: "relative",
            }}
          >
            {/* Top accent */}
            <div style={{ height: "3px", background: hoveredId === layanan.id ? layanan.color : "transparent", transition: "background 0.25s" }} />

            <div style={{ padding: "24px" }}>
              {/* Header kartu */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    border: `1px solid ${layanan.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", color: layanan.color,
                    background: hoveredId === layanan.id ? layanan.color + "08" : "transparent",
                    transition: "all 0.25s",
                  }}>
                    {layanan.icon}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "2px" }}>
                      {layanan.title}
                    </h3>
                    <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: layanan.color, background: layanan.color + "12", padding: "2px 8px", borderRadius: "2px" }}>
                      Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Deskripsi — muncul saat hover */}
              <div style={{
                maxHeight: hoveredId === layanan.id ? "120px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease, opacity 0.25s ease",
                opacity: hoveredId === layanan.id ? 1 : 0,
              }}>
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560", lineHeight: 1.75, marginBottom: "12px" }}>
                  {layanan.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }}>
                  {layanan.sections.map(s => (
                    <span key={s} style={{ fontSize: "10px", color: "#7A9AA5", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.1)", padding: "2px 8px", borderRadius: "2px" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: "flex",
                gap: "8px",
                marginTop: hoveredId === layanan.id ? "16px" : "8px",
                transition: "margin-top 0.2s",
              }}>
                <Link href={layanan.editHref}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "9px 14px", background: layanan.color, color: "#fff", borderRadius: "2px", textDecoration: "none", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Edit Konten
                </Link>
                <Link href={layanan.href} target="_blank"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "9px 12px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", textDecoration: "none", fontSize: "14px", color: "#7A9AA5" }}>
                  ↗
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats bawah */}
      <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
        {[
          { label: "Total Layanan", value: LAYANAN_LIST.length.toString(), desc: "Semua aktif" },
          { label: "Section per Halaman", value: "9", desc: "Hero s/d CTA" },
          { label: "Terakhir Diupdate", value: "Hari ini", desc: "Via admin" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "2px" }}>{stat.value}</p>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#3A5560", marginBottom: "2px" }}>{stat.label}</p>
            <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}