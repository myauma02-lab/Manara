"use client";
import { useEffect, useState } from "react";
import { publicationsApi, fellowsApi, recruitmentApi, newsletterApi } from "@/lib/api";
import Link from "next/link";

interface Stats {
  totalPubikasi: number;
  formatTotals: Record<string, number>;
  totalFellows: number;
  totalSubscriber: number;
  lamaranPending: number;
  pesanBelumDibaca: number;
  loaded: boolean;
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  EDITORIAL_NOTE: { label: "Editorial Note", color: "#266c87" },
  RESEARCH_PAPER: { label: "Research Paper", color: "#3F6F6A" },
  PERSPECTIVE: { label: "Perspective", color: "#266c87" },
  POLICY_BRIEF: { label: "Policy Brief", color: "#5F8F8A" },
  WORKING_PAPER: { label: "Working Paper", color: "#5F8F8A" },
  JOURNAL: { label: "Manara Journal", color: "#5F8F8A" },
};

function StatCard({ value, label, sub, href, color = "#266c87", alert = false, loading }: {
  value: string | number; label: string; sub?: string;
  href?: string; color?: string; alert?: boolean; loading: boolean;
}) {
  const content = <div style={{ background: "#fff", border: `1px solid ${alert && Number(value) > 0 ? color + "40" : "rgba(38,108,135,0.1)"}`, borderRadius: "4px", padding: "20px 24px", position: "relative", transition: "all 0.2s" }}>
    {alert && Number(value) > 0 && <div style={{ position: "absolute", top: "12px", right: "12px", width: "8px", height: "8px", borderRadius: "50%", background: color, animation: "pulse-dot 2s infinite" }} />}
    <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3vw,40px)", fontWeight: 300, color: Number(value) > 0 ? "#0F2830" : "#B8CDD2", lineHeight: 1, marginBottom: "6px", transition: "color 0.3s" }}>{loading ? "..." : value}</p>
    <p style={{ fontSize: "13px", fontWeight: 500, color: "#3A5560" }}>{label}</p>
    {sub && <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "2px" }}>{sub}</p>}
  </div>;
  return href ? <Link href={href} style={{ textDecoration: "none" }}>{content}</Link> : content;
}



export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPubikasi: 0, formatTotals: {},
    totalFellows: 0, totalSubscriber: 0, lamaranPending: 0, pesanBelumDibaca: 0,
    loaded: false,
  });
  const [recentPubs, setRecentPubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      // Publikasi per format
      publicationsApi.adminList({ limit: 1 }),
      ...["EDITORIAL_NOTE", "RESEARCH_PAPER", "PERSPECTIVE", "POLICY_BRIEF", "WORKING_PAPER"].map(format => publicationsApi.adminList({ format, limit: 1 })),
      // Recent publications
      publicationsApi.adminList({ limit: 6 }),
      // Fellows
      fellowsApi.all().catch(() => ({ data: { data: [] } })) ,
      // Subscriber
      newsletterApi.subscribers().catch(() => ({ data: { data: [] } })),

      
      // Rekrutmen
      recruitmentApi.list().catch(() => ({ data: { data: [] } })),
    ])
      .then(([allPub, editorialPub, researchPub, perspectivePub, policyPub, workingPub, recentPub, fellowsRes, subsRes, recruitRes]) => {
        // Hitung lamaran pending
        const allApps = (recruitRes.data.data || []).flatMap((r: any) => r.applications || []);
        const pending = allApps.filter((a: any) => a.status === "PENDING").length;

        setStats({
          totalPubikasi: allPub.data.pagination?.total || 0,
          formatTotals: {
            EDITORIAL_NOTE: editorialPub.data.pagination?.total || 0,
            RESEARCH_PAPER: researchPub.data.pagination?.total || 0,
            PERSPECTIVE: perspectivePub.data.pagination?.total || 0,
            POLICY_BRIEF: policyPub.data.pagination?.total || 0,
            WORKING_PAPER: workingPub.data.pagination?.total || 0,
          },
          totalFellows: (fellowsRes.data.data || []).length,
          totalSubscriber: (subsRes.data.data || []).length,
          lamaranPending: pending,
          pesanBelumDibaca: 0, // akan dikembangkan
          loaded: true,
        });
        setRecentPubs(recentPub.data.data || []);
      })
      .catch(() => setStats(s => ({ ...s, loaded: true })))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "1100px" }}>

      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "36px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
          Dashboard Manara
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Selamat datang di Admin Panel. Berikut ringkasan aktivitas terkini.
        </p>
      </div>

      {/* Stats Grid — Row 1: Publikasi */}
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
          Publikasi
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: "12px" }} className="stats-grid-4">
          <StatCard value={stats.totalPubikasi} label="Total Publikasi" sub="Semua format" href="/admin/publikasi" loading={loading} />
          {Object.entries(TYPE_CONFIG).filter(([format]) => format !== "JOURNAL").map(([format, config]) =>
            <StatCard key={format} value={stats.formatTotals[format] || 0} label={config.label} href="/admin/publikasi" color={config.color} loading={loading} />)}
        </div>
      </div>

      {/* Stats Grid — Row 2: Komunitas */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
          Komunitas & Aktivitas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }} className="stats-grid-4">
          <StatCard value={stats.totalFellows} label="Fellows" sub="Tenaga ahli aktif" href="/admin/fellows" color="#266c87" loading={loading} />
          <StatCard value={stats.totalSubscriber} label="Subscriber" sub="Newsletter aktif" href="/admin/newsletter" color="#3F6F6A" loading={loading} />
          <StatCard value={stats.lamaranPending} label="Lamaran Pending" sub="Menunggu review" href="/admin/recruitment" color="#C6A84B" alert={true} loading={loading} />
          <StatCard value={stats.pesanBelumDibaca} label="Pesan Baru" sub="Kontak masuk" href="/admin/pesan" color="#f87171" alert={true} loading={loading} />
        </div>
      </div>

      {/* Dua kolom: Recent + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }} className="two-col-grid">

        {/* Recent Publikasi */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>Publikasi Terbaru</p>
            <Link href="/admin/publikasi" style={{ fontSize: "12px", color: "#266c87", textDecoration: "none" }}>
              Lihat semua →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: "flex", gap: "12px", animation: "pulse 1.5s infinite" }}>
                  <div style={{ width: "44px", height: "44px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ height: "13px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "75%" }} />
                    <div style={{ height: "11px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "45%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPubs.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>
                Belum ada publikasi.
              </p>
              <Link href="/admin/publikasi/new?format=PERSPECTIVE"
                style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 16px", borderRadius: "2px" }}>
                Buat Publikasi Pertama →
              </Link>
            </div>
          ) : (
            <div>
              {recentPubs.map(pub => {
                const tc = TYPE_CONFIG[pub.format] || TYPE_CONFIG.PERSPECTIVE;
                const typePath = pub.type === "ARTICLE" ? "artikel" : pub.type === "PAPER" ? "paper" : "journal";
                return (
                  <div key={pub.id} style={{ display: "flex", gap: "14px", padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>
                    {/* Cover thumbnail */}
                    <div style={{ width: "44px", height: "44px", borderRadius: "2px", flexShrink: 0, background: pub.coverImage ? `url(${pub.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "3px", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: 500, color: tc.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {tc.label}
                        </span>
                        <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "2px", background: pub.status === "PUBLISHED" ? "rgba(63,111,106,0.1)" : "rgba(198,168,75,0.1)", color: pub.status === "PUBLISHED" ? "#3F6F6A" : "#A0853A", fontWeight: 500 }}>
                          {pub.status === "PUBLISHED" ? "Live" : pub.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pub.title}
                      </p>
                      <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                        {pub.author?.name} · {new Date(pub.updatedAt || pub.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <Link href={`/admin/publikasi/${pub.id}`}
                        style={{ fontSize: "11px", color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "4px 10px", borderRadius: "2px", textDecoration: "none" }}>
                        Edit
                      </Link>
                      {pub.status === "PUBLISHED" && (
                        <Link href={`/publikasi/${typePath}/${pub.slug}`} target="_blank"
                          style={{ fontSize: "11px", color: "#7A9AA5", padding: "4px 8px", textDecoration: "none" }}>
                          ↗
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>
            Quick Actions
          </p>

          {[
            { icon: "✦", label: "Buat Perspective", href: "/admin/publikasi/new?format=PERSPECTIVE", color: "#266c87", desc: "Esai argumentatif" },
            { icon: "◇", label: "Buat Research Paper", href: "/admin/publikasi/new?format=RESEARCH_PAPER", color: "#3F6F6A", desc: "Naskah riset" },
            { icon: "○", label: "Buat Policy Brief", href: "/admin/publikasi/new?format=POLICY_BRIEF", color: "#5F8F8A", desc: "Rekomendasi kebijakan" },
            { icon: "◉", label: "Tambah Fellow", href: "/admin/fellows/new", color: "#266c87", desc: "Tenaga ahli baru" },
            { icon: "△", label: "Edit Layanan", href: "/admin/layanan", color: "#8A8F5E", desc: "Konten halaman layanan" },
            { icon: "⚙", label: "Pengaturan", href: "/admin/settings", color: "#7A9AA5", desc: "Website & sosial media" },
          ].map(action => (
            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#fff", border: "1px solid rgba(38,108,135,0.1)",
                borderRadius: "4px", padding: "12px 16px",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = action.color + "40";
                  (e.currentTarget as HTMLElement).style.transform = "translateX(3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
              >
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", border: `1px solid ${action.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: action.color, fontSize: "14px", flexShrink: 0 }}>
                  {action.icon}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{action.label}</p>
                  <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{action.desc}</p>
                </div>
                <span style={{ marginLeft: "auto", color: "#B8CDD2", fontSize: "14px" }}>→</span>
              </div>
            </Link>
          ))}

          {/* Link ke website publik */}
          <div style={{ marginTop: "4px", paddingTop: "14px", borderTop: "1px solid rgba(38,108,135,0.08)" }}>
            <a href="https://manarainstitute.id" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#7A9AA5", textDecoration: "none" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3F6F6A", display: "inline-block" }} />
              manarainstitute.id — Lihat Website Publik ↗
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @media (max-width: 900px) {
          .stats-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .stats-grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
