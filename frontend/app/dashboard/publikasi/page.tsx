"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Draft", color: "#A78E6D", bg: "rgba(198,173,138,0.2)" },
  REVIEW: { label: "Review", color: "#266c87", bg: "rgba(38,108,135,0.1)" },
  PUBLISHED: { label: "Published", color: "#3F6F6A", bg: "rgba(95,143,138,0.15)" },
  ARCHIVED: { label: "Arsip", color: "#64748b", bg: "rgba(148,163,184,0.15)" },
};

export default function PublikasiOverviewPage() {
  const { user } = useAuthStore();
  const [pubs, setPubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationsApi.adminList({ limit: 300 })
      .then(r => setPubs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isWriter = user?.role === "PUBLIKASI_WRITER";
  const mine = isWriter ? pubs.filter(p => p.authorId === user?.id) : pubs;

  const cards = [
    { label: "Artikel", value: mine.filter(p => p.type === "ARTICLE").length, href: "/dashboard/publikasi/artikel" },
    { label: "Manara Paper", value: mine.filter(p => p.type === "PAPER").length, href: "/dashboard/publikasi/paper" },
    { label: "Manara Journal", value: mine.filter(p => p.type === "JOURNAL").length, href: "/dashboard/publikasi/jurnal" },
    { label: "Menunggu Review", value: mine.filter(p => p.status === "REVIEW").length, href: "/dashboard/publikasi/artikel" },
  ];

  const recent = [...mine].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);
  const typePath: Record<string, string> = { ARTICLE: "artikel", PAPER: "paper", JOURNAL: "jurnal" };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
          Halo, {user?.name?.split(" ")[0] || "Tim Publikasi"}
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          {isWriter ? "Ringkasan draft dan tulisan kamu" : "Ringkasan konten publikasi Manara"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }} className="stats-grid">
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 22px" }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#7A9AA5", marginBottom: "8px" }}>{c.label}</p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 300, color: "#266c87" }}>
                {loading ? "..." : c.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>Aktivitas Terbaru</p>
        </div>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center" }}><p style={{ fontFamily: "Georgia,serif", color: "#B8CDD2" }}>Memuat...</p></div>
        ) : recent.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}><p style={{ fontFamily: "Georgia,serif", color: "#B8CDD2" }}>Belum ada konten</p></div>
        ) : (
          recent.map(p => {
            const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.DRAFT;
            return (
              <Link key={p.id} href={`/dashboard/publikasi/${typePath[p.type]}/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.06)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{p.type} · {new Date(p.updatedAt).toLocaleDateString("id-ID")}</p>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: st.color, background: st.bg, padding: "4px 10px", borderRadius: "2px", flexShrink: 0 }}>{st.label}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <style>{`@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
    </div>
  );
}