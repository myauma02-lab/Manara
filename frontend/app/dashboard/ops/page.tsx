"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#8A8F5E";

const STATUS_CONFIG = {
  UPCOMING:  { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.1)"  },
  ACTIVE:    { label: "Aktif",       color: "#3F6F6A", bg: "rgba(63,111,106,0.12)" },
  COMPLETED: { label: "Selesai",     color: ACCENT,    bg: "rgba(138,143,94,0.12)" },
  ARCHIVED:  { label: "Arsip",       color: "#7A9AA5", bg: "rgba(122,154,165,0.08)"},
};

export default function OpsDashboardPage() {
  const [projects, setProjects]         = useState<any[]>([]);
  const [projectStats, setProjectStats] = useState<Record<string, number>>({});
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      projectsApi.adminList({ limit: 6 }),
      ...Object.keys(STATUS_CONFIG).map(s =>
        projectsApi.list({ status: s, limit: 1 })
          .then(r => ({ status: s, count: r.data.pagination?.total || 0 }))
          .catch(() => ({ status: s, count: 0 }))
      ),
    ])
      .then(([projRes, ...statResults]) => {
        setProjects(projRes.data.data || []);
        const stats: Record<string, number> = {};
        (statResults as any[]).forEach(r => { stats[r.status] = r.count; });
        setProjectStats(stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#141408", marginBottom: "4px" }}>
          Dashboard Operasional
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Kelola layanan, proyek, dan harga Manara
        </p>
      </div>

      {/* Project stats */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
          Status Proyek
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }} className="stats-grid">
          {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG.ACTIVE][]).map(([status, cfg]) => (
            <Link key={status} href={`/dashboard/ops/proyek?status=${status}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: cfg.bg,
                border: `1px solid ${cfg.color}25`,
                borderRadius: "10px", padding: "18px 20px",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "none"}
              >
                <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: cfg.color, lineHeight: 1, marginBottom: "6px" }}>
                  {loading ? "..." : projectStats[status] || 0}
                </p>
                <p style={{ fontSize: "12px", fontWeight: 500, color: cfg.color }}>{cfg.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
          Aksi Cepat
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { label: "+ Proyek Baru",     href: "/admin/project/new",               color: ACCENT   },
            { label: "Edit Layanan",      href: "/dashboard/ops/layanan",           color: "#266c87"},
            { label: "Atur Harga",        href: "/dashboard/ops/harga",             color: "#3F6F6A"},
            { label: "Pusat Informasi",   href: "/dashboard/ops/pusat-informasi",   color: "#5F8F8A"},
          ].map(action => (
            <Link key={action.href} href={action.href} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "10px 18px", border: `1px solid ${action.color}30`,
              borderRadius: "6px", background: `${action.color}08`,
              color: action.color, textDecoration: "none",
              fontSize: "13px", fontWeight: 500, transition: "all 0.2s",
            }}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#141408" }}>Proyek Terbaru</p>
          <Link href="/dashboard/ops/proyek" style={{ fontSize: "12px", color: ACCENT, textDecoration: "none" }}>Semua proyek →</Link>
        </div>
        <div style={{ background: "#fff", border: "1px solid rgba(138,143,94,0.12)", borderRadius: "10px", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif" }}>Memuat...</p>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>
                Belum ada proyek
              </p>
              <Link href="/admin/project/new" style={{ fontSize: "13px", color: ACCENT, border: `1px solid ${ACCENT}30`, padding: "8px 18px", borderRadius: "6px", textDecoration: "none" }}>
                + Buat Proyek Pertama
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 120px", borderBottom: "1px solid rgba(138,143,94,0.08)", padding: "11px 20px", background: "rgba(138,143,94,0.03)" }}>
                {["Proyek", "Status", "Progress", "Aksi"].map(h => (
                  <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
                ))}
              </div>
              {projects.map(p => {
                const sc = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING;
                return (
                  <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 120px", padding: "14px 20px", borderBottom: "1px solid rgba(138,143,94,0.05)", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingRight: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: p.coverImage ? `url(${p.coverImage}) center/cover` : `linear-gradient(135deg,#141408,${ACCENT})`, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#141408", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                        {p.category && <p style={{ fontSize: "11px", color: "#7A9AA5" }}>{p.category}</p>}
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "4px", background: sc.bg, color: sc.color, display: "inline-block" }}>
                      {sc.label}
                    </span>
                    <div>
                      {p.progress > 0 && (
                        <div>
                          <p style={{ fontSize: "11px", color: ACCENT, fontWeight: 500, marginBottom: "4px" }}>{p.progress}%</p>
                          <div style={{ height: "4px", background: "rgba(138,143,94,0.12)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${p.progress}%`, background: ACCENT, borderRadius: "2px" }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link href={`/proyek/${p.slug}`} target="_blank"
                        style={{ fontSize: "11px", color: "#7A9AA5", border: "1px solid rgba(138,143,94,0.2)", borderRadius: "4px", padding: "4px 8px", textDecoration: "none" }}>
                        ↗
                      </Link>
                      <Link href={`/admin/project/${p.id}`}
                        style={{ fontSize: "11px", color: ACCENT, border: `1px solid ${ACCENT}30`, borderRadius: "4px", padding: "4px 10px", textDecoration: "none" }}>
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}