"use client";
import { useEffect, useState } from "react";
import { settingsApi, articlesApi, recruitmentApi, newsletterApi } from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

interface Stats {
  articles: number; founders: number; projects: number;
  subscribers: number; pendingApplications: number;
}



export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      settingsApi.stats(),
      articlesApi.adminList(),
      recruitmentApi.list(),
    ]).then(([statsRes, articlesRes, recRes]) => {
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data.data);
      if (articlesRes.status === "fulfilled") {
        setRecentArticles(articlesRes.value.data.data?.slice(0, 5) || []);
      }
      if (recRes.status === "fulfilled") {
        const batches = recRes.value.data.data || [];
        const active = batches[0];
        if (active) {
          recruitmentApi.applications(active.id)
            .then(r => setRecentApplications(r.data.data?.slice(0, 5) || []))
            .catch(() => {});
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: "Total Artikel", value: stats?.articles ?? "—", href: "/admin/artikel", dot: "#266c87" },
    { label: "Founders", value: stats?.founders ?? "—", href: "/admin/founder", dot: "#5F8F8A" },
    { label: "Proyek", value: stats?.projects ?? "—", href: "/admin/project", dot: "#8A8F5E" },
    { label: "Subscriber", value: stats?.subscribers ?? "—", href: "/admin/newsletter", dot: "#C6AD8A" },
    { label: "Lamaran Pending", value: stats?.pendingApplications ?? "—", href: "/admin/recruitment", dot: "#86AFAA" },
  ];

  const QUICK_ACTIONS = [
    { label: "Tulis Artikel Baru", href: "/admin/artikel/new", icon: "✦" },
    { label: "Upload Research Paper", href: "/admin/research/new", icon: "○" },
    { label: "Tambah Founder", href: "/admin/founder/new", icon: "◎" },
    { label: "Tambah Proyek", href: "/admin/project/new", icon: "△" },
    { label: "Lihat Lamaran", href: "/admin/recruitment", icon: "+" },
    { label: "Pesan Masuk", href: "/admin/pesan", icon: "✉" },
  ];

  const STATUS_COLOR: any = {
    PUBLISHED: { bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
    DRAFT: { bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
    REVIEW: { bg: "rgba(38,108,135,0.1)", color: "#266c87" },
  };
  const APP_STATUS_COLOR: any = {
    PENDING: { bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
    REVIEWING: { bg: "rgba(38,108,135,0.1)", color: "#266c87" },
    SHORTLISTED: { bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
    ACCEPTED: { bg: "rgba(63,111,106,0.15)", color: "#3F6F6A" },
    REJECTED: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1100px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>
          Admin Dashboard
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "36px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
          Selamat datang, <em style={{ color: "#266c87", fontStyle: "italic" }}>{user?.name?.split(" ")[0]}.</em>
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Kelola semua konten dan operasi Manara dari sini.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap" }}>
        {STAT_CARDS.map(card => (
          <Link key={card.label} href={card.href} style={{
            background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px",
            padding: "24px", textDecoration: "none", flex: "1", minWidth: "140px",
            display: "block", transition: "border-color 0.2s",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: card.dot, marginBottom: "16px" }} />
            <p style={{ fontFamily: "Georgia,serif", fontSize: "44px", fontWeight: 300, color: "#0F2830", lineHeight: 1, marginBottom: "6px" }}>
              {loading ? <span style={{ opacity: 0.3 }}>—</span> : card.value}
            </p>
            <p style={{ fontSize: "12px", fontWeight: 400, color: "#7A9AA5" }}>{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>

        {/* Recent articles */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(38,108,135,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>Artikel Terbaru</p>
            <Link href="/admin/artikel" style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>Lihat semua →</Link>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: "20px 24px" }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: "48px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", marginBottom: "8px", animation: "pulse 1.5s infinite" }} />
                ))}
              </div>
            ) : recentArticles.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "12px" }}>Belum ada artikel</p>
                <Link href="/admin/artikel/new" style={{ fontSize: "12px", fontWeight: 500, color: "#266c87", textDecoration: "none" }}>+ Tulis Artikel Pertama</Link>
              </div>
            ) : recentArticles.map(a => (
              <Link key={a.id} href={`/admin/artikel/${a.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(38,108,135,0.05)", display: "flex", gap: "12px", alignItems: "center", transition: "background 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 400, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "2px" }}>{a.author?.name}</p>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 500, padding: "3px 8px", borderRadius: "2px", background: STATUS_COLOR[a.status]?.bg || "rgba(184,205,210,0.2)", color: STATUS_COLOR[a.status]?.color || "#7A9AA5", flexShrink: 0 }}>
                    {a.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent applications */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(38,108,135,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>Lamaran Terbaru</p>
            <Link href="/admin/recruitment" style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>Lihat semua →</Link>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: "20px 24px" }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: "48px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", marginBottom: "8px", animation: "pulse 1.5s infinite" }} />
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#B8CDD2" }}>Belum ada lamaran masuk</p>
              </div>
            ) : recentApplications.map(app => {
              const cfg = APP_STATUS_COLOR[app.status] || APP_STATUS_COLOR.PENDING;
              return (
                <div key={app.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(38,108,135,0.05)", display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(38,108,135,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500, color: "#266c87", flexShrink: 0 }}>
                    {app.fullName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 400, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {app.fullName}
                    </p>
                    <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "2px" }}>{app.position}</p>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 500, padding: "3px 8px", borderRadius: "2px", background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
                    {app.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
          Aksi Cepat
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
          {QUICK_ACTIONS.map(action => (
            <Link key={action.label} href={action.href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#fff", border: "1px solid rgba(38,108,135,0.1)",
              borderRadius: "4px", padding: "14px 18px",
              textDecoration: "none", transition: "all 0.2s",
            }}>
              <span style={{ color: "#266c87", fontSize: "14px", width: "18px", textAlign: "center" }}>{action.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560" }}>{action.label}</span>
              <span style={{ marginLeft: "auto", color: "#B8CDD2", fontSize: "14px" }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* System info */}
      <div style={{ background: "#0F2830", borderRadius: "4px", padding: "28px 32px", border: "1px solid rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "rgba(238,244,246,0.9)", marginBottom: "4px" }}>
            Manara CMS v1.0
          </p>
          <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.4)" }}>
            Semua perubahan langsung berlaku di website publik.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/" target="_blank" style={{ fontSize: "12px", fontWeight: 500, color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 18px", borderRadius: "2px", textDecoration: "none" }}>
            Lihat Website →
          </Link>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}