"use client";
import { useEffect, useState } from "react";
import { hrApi, recruitmentApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#5F8F8A";

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  PENDING:     { color: "#B8CDD2", bg: "rgba(184,205,210,0.12)" },
  REVIEWING:   { color: "#266c87", bg: "rgba(38,108,135,0.1)"  },
  SHORTLISTED: { color: "#5F8F8A", bg: "rgba(95,143,138,0.12)" },
  ACCEPTED:    { color: "#3F6F6A", bg: "rgba(63,111,106,0.12)" },
  REJECTED:    { color: "#f87171", bg: "rgba(248,113,113,0.08)" },
};

export default function HRDashboardPage() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [empStats, setEmpStats] = useState<any>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      hrApi.pipeline(),
      hrApi.employeeStats(),
      hrApi.interviews({ upcoming: true }),
    ])
      .then(([pipeRes, empRes, intRes]) => {
        setPipeline(pipeRes.data.data);
        setEmpStats(empRes.data.data);
        setUpcomingInterviews(intRes.data.data?.slice(0, 5) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const appsByStatus = pipeline?.appsByStatus || [];
  const totalApps = appsByStatus.reduce((sum: number, s: any) => sum + s._count, 0);

  const StatCard = ({ value, label, sub, href, color = ACCENT }: any) => (
    <Link href={href || "#"} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#fff",
        border: "1px solid rgba(95,143,138,0.12)",
        borderRadius: "10px",
        padding: "20px 24px",
        transition: "all 0.2s",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${color}12`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(95,143,138,0.12)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        <p style={{ fontFamily: "Georgia,serif", fontSize: "36px", fontWeight: 300, color, lineHeight: 1, marginBottom: "6px" }}>
          {loading ? "..." : value}
        </p>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#1C3038", marginBottom: "2px" }}>{label}</p>
        {sub && <p style={{ fontSize: "11px", color: "#7A9AA5" }}>{sub}</p>}
      </div>
    </Link>
  );

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
          Dashboard SDM
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Kelola rekrutmen, anggota, dan interview Manara
        </p>
      </div>

      {/* Stats Row 1 — Anggota */}
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
          Database Anggota
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }} className="stats-grid">
          <StatCard value={empStats?.total || 0} label="Total Anggota" sub="Semua status" href="/dashboard/hr/employee" />
          <StatCard value={empStats?.byStatus?.find((s: any) => s.status === "ACTIVE")?._count || 0} label="Aktif" href="/dashboard/hr/employee?status=ACTIVE" color="#3F6F6A" />
          <StatCard value={empStats?.byStatus?.find((s: any) => s.status === "PROBATION")?._count || 0} label="Masa Percobaan" href="/dashboard/hr/employee?status=PROBATION" color="#C6AD8A" />
          <StatCard value={empStats?.byStatus?.find((s: any) => s.status === "RESIGNED")?._count || 0} label="Alumni" href="/dashboard/hr/employee?status=RESIGNED" color="#7A9AA5" />
        </div>
      </div>

      {/* Stats Row 2 — Rekrutmen */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
          Pipeline Rekrutmen
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" }} className="stats-grid-5">
          {["PENDING", "REVIEWING", "SHORTLISTED", "ACCEPTED", "REJECTED"].map(status => {
            const count = appsByStatus.find((s: any) => s.status === status)?._count || 0;
            const cfg = STATUS_COLORS[status];
            return (
              <Link key={status} href={`/dashboard/hr/applicants?status=${status}`} style={{ textDecoration: "none" }}>
                <div style={{ background: cfg.bg, border: `1px solid ${cfg.bg}`, borderRadius: "10px", padding: "16px 20px" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: cfg.color, lineHeight: 1, marginBottom: "4px" }}>
                    {loading ? "..." : count}
                  </p>
                  <p style={{ fontSize: "11px", fontWeight: 500, color: cfg.color, opacity: 0.8 }}>{status}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dua kolom: Interview + Recent Applicants */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="two-col-grid">

        {/* Upcoming Interviews */}
        <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(95,143,138,0.08)", background: "rgba(95,143,138,0.03)" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>Interview Mendatang</p>
            <Link href="/dashboard/hr/interview" style={{ fontSize: "12px", color: ACCENT, textDecoration: "none" }}>Lihat semua →</Link>
          </div>

          {loading ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: "48px", background: "rgba(95,143,138,0.05)", borderRadius: "6px", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : upcomingInterviews.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#B8CDD2" }}>
                Tidak ada interview terjadwal
              </p>
              <Link href="/dashboard/hr/interview" style={{ fontSize: "13px", color: ACCENT, textDecoration: "none", display: "block", marginTop: "8px" }}>
                + Jadwalkan interview
              </Link>
            </div>
          ) : (
            <div>
              {upcomingInterviews.map(iv => (
                <div key={iv.id} style={{ display: "flex", gap: "14px", padding: "14px 20px", borderBottom: "1px solid rgba(95,143,138,0.06)", alignItems: "center" }}>
                  {/* Date badge */}
                  <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: `${ACCENT}15`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: ACCENT, lineHeight: 1 }}>
                      {new Date(iv.scheduledAt).getDate()}
                    </p>
                    <p style={{ fontSize: "9px", color: ACCENT, opacity: 0.6, textTransform: "uppercase" }}>
                      {new Date(iv.scheduledAt).toLocaleDateString("id-ID", { month: "short" })}
                    </p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {iv.application?.fullName}
                    </p>
                    <p style={{ fontSize: "11px", color: "#7A9AA5" }}>
                      {iv.application?.position} · {new Date(iv.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: iv.result === "PENDING" ? "#C6AD8A" : iv.result === "PASSED" ? "#3F6F6A" : "#f87171", padding: "3px 8px", borderRadius: "4px", background: "rgba(95,143,138,0.06)", flexShrink: 0 }}>
                    {iv.result}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applicants */}
        <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(95,143,138,0.08)", background: "rgba(95,143,138,0.03)" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>Pelamar Terbaru</p>
            <Link href="/dashboard/hr/applicants" style={{ fontSize: "12px", color: ACCENT, textDecoration: "none" }}>Lihat semua →</Link>
          </div>

          {!loading && pipeline?.recentApps?.length > 0 ? (
            <div>
              {pipeline.recentApps.slice(0, 6).map((app: any) => {
                const cfg = STATUS_COLORS[app.status] || STATUS_COLORS.PENDING;
                return (
                  <div key={app.id} style={{ display: "flex", gap: "12px", padding: "12px 20px", borderBottom: "1px solid rgba(95,143,138,0.05)", alignItems: "center" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: ACCENT, fontWeight: 500, flexShrink: 0 }}>
                      {app.fullName?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {app.fullName}
                      </p>
                      <p style={{ fontSize: "11px", color: "#7A9AA5" }}>{app.position}</p>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 500, padding: "3px 8px", borderRadius: "4px", background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#B8CDD2" }}>
                Belum ada pelamar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {[
          { label: "+ Jadwalkan Interview", href: "/dashboard/hr/interview/new" },
          { label: "+ Tambah Anggota", href: "/dashboard/hr/employee/new" },
          { label: "Buka Rekrutmen", href: "/dashboard/hr/recruitment" },
          { label: "Export Database", href: "/dashboard/hr/employee?export=true" },
        ].map(action => (
          <Link key={action.href} href={action.href} style={{
            fontSize: "13px", fontWeight: 500, color: ACCENT,
            border: `1px solid ${ACCENT}30`, borderRadius: "6px",
            padding: "9px 18px", textDecoration: "none",
            background: `${ACCENT}08`,
            transition: "all 0.2s",
          }}>
            {action.label}
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .stats-grid-5 { grid-template-columns: repeat(3,1fr) !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid-5 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}