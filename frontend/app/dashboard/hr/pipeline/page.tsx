"use client";
import { useEffect, useState } from "react";
import { recruitmentApi, hrApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#5F8F8A";

const STAGES = [
  { key: "PENDING",     label: "Masuk",       color: "#B8CDD2", bg: "rgba(184,205,210,0.12)", icon: "○" },
  { key: "REVIEWING",   label: "Direview",    color: "#266c87", bg: "rgba(38,108,135,0.1)",   icon: "◈" },
  { key: "SHORTLISTED", label: "Shortlist",   color: "#5F8F8A", bg: "rgba(95,143,138,0.12)",  icon: "◇" },
  { key: "ACCEPTED",    label: "Diterima",    color: "#3F6F6A", bg: "rgba(63,111,106,0.12)",  icon: "✦" },
  { key: "REJECTED",    label: "Ditolak",     color: "#f87171", bg: "rgba(248,113,113,0.08)", icon: "×" },
] as const;

type Stage = typeof STAGES[number]["key"];

export default function HRPipelinePage() {
  const [batches, setBatches]       = useState<any[]>([]);
  const [activeBatch, setActiveBatch] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [dragging, setDragging]     = useState<string | null>(null);
  const [updating, setUpdating]     = useState<string | null>(null);
  const [selected, setSelected]     = useState<any | null>(null);

  useEffect(() => {
    recruitmentApi.list()
      .then(r => {
        const all = r.data.data || [];
        setBatches(all);
        const active = all.find((b: any) => b.isActive) || all[0];
        if (active) loadApps(active);
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadApps = (batch: any) => {
    setActiveBatch(batch);
    setLoading(true);
    recruitmentApi.applications(batch.id)
      .then(r => setApplications(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const moveCard = async (appId: string, newStatus: Stage) => {
    const app = applications.find(a => a.id === appId);
    if (!app || app.status === newStatus) return;
    setUpdating(appId);
    // Optimistic update
    setApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
    );
    try {
      await recruitmentApi.updateApplication(appId, { status: newStatus });
    } catch {
      // Revert on error
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: app.status } : a)
      );
      alert("Gagal memindahkan");
    } finally {
      setUpdating(null);
    }
  };

  const countByStage = (stage: Stage) =>
    applications.filter(a => a.status === stage).length;

  const appsByStage = (stage: Stage) =>
    applications.filter(a => a.status === stage);

  // Stats
  const total         = applications.length;
  const acceptRate    = total > 0 ? Math.round((countByStage("ACCEPTED") / total) * 100) : 0;
  const shortlistRate = total > 0 ? Math.round((countByStage("SHORTLISTED") / total) * 100) : 0;

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>HR · Rekrutmen</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Pipeline Rekrutmen
          </h1>
          {activeBatch && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
              <p style={{ fontSize: "13px", color: "#7A9AA5" }}>{activeBatch.batchName}</p>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/dashboard/hr/applicants"
            style={{ padding: "9px 16px", border: `1px solid ${ACCENT}30`, borderRadius: "6px", color: ACCENT, textDecoration: "none", fontSize: "12px", fontWeight: 500 }}>
            Tampilan List
          </Link>
          <Link href="/dashboard/hr/recruitment"
            style={{ padding: "9px 18px", background: ACCENT, color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontWeight: 500 }}>
            Kelola Batch
          </Link>
        </div>
      </div>

      {/* Batch selector */}
      {batches.length > 1 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {batches.map(b => (
            <button key={b.id}
              onClick={() => loadApps(b)}
              style={{ padding: "6px 16px", fontSize: "12px", fontWeight: 500, border: `1px solid ${activeBatch?.id === b.id ? ACCENT : "rgba(95,143,138,0.2)"}`, borderRadius: "20px", background: activeBatch?.id === b.id ? `${ACCENT}15` : "transparent", color: activeBatch?.id === b.id ? ACCENT : "#7A9AA5", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              {b.batchName}
              {b.isActive && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />}
            </button>
          ))}
        </div>
      )}

      {/* Summary stats */}
      {!loading && total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px", marginBottom: "24px" }} className="pipeline-stats">
          {STAGES.map(stage => (
            <div key={stage.key} style={{ background: stage.bg, border: `1px solid ${stage.color}20`, borderRadius: "8px", padding: "14px 16px" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: stage.color, lineHeight: 1, marginBottom: "4px" }}>
                {countByStage(stage.key)}
              </p>
              <p style={{ fontSize: "11px", fontWeight: 500, color: stage.color }}>{stage.label}</p>
              <p style={{ fontSize: "10px", color: "#B8CDD2", marginTop: "2px" }}>
                {total > 0 ? Math.round((countByStage(stage.key) / total) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Conversion funnel mini */}
      {!loading && total > 0 && (
        <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "8px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          <p style={{ fontSize: "12px", fontWeight: 500, color: "#7A9AA5" }}>Conversion:</p>
          {[
            { label: "Total Pelamar", val: total, color: "#266c87" },
            { label: "Shortlist Rate", val: `${shortlistRate}%`, color: ACCENT },
            { label: "Accept Rate", val: `${acceptRate}%`, color: "#3F6F6A" },
            { label: "Belum Diproses", val: countByStage("PENDING"), color: "#B8CDD2" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Kanban board */}
      {loading ? (
        <div style={{ padding: "64px", textAlign: "center" }}>
          <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat pipeline...</p>
        </div>
      ) : batches.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "10px", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>
            Belum ada batch rekrutmen aktif
          </p>
          <Link href="/dashboard/hr/recruitment"
            style={{ padding: "10px 22px", background: ACCENT, color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
            Buat Batch Sekarang
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "20px", alignItems: "flex-start" }}>
          {STAGES.map(stage => (
            <div key={stage.key}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (dragging) moveCard(dragging, stage.key);
                setDragging(null);
              }}
              style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {/* Column header */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: stage.bg, borderRadius: "8px", border: `1px solid ${stage.color}20`, position: "sticky", top: 0 }}>
                <span style={{ fontSize: "14px", color: stage.color }}>{stage.icon}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: stage.color }}>{stage.label}</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 600, color: stage.color, background: `${stage.color}20`, width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {countByStage(stage.key)}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "100px" }}>
                {appsByStage(stage.key).map(app => (
                  <div key={app.id}
                    draggable
                    onDragStart={() => setDragging(app.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => setSelected(app)}
                    style={{
                      background: "#fff",
                      border: `1px solid ${dragging === app.id ? stage.color : "rgba(95,143,138,0.12)"}`,
                      borderRadius: "8px",
                      padding: "14px",
                      cursor: "grab",
                      opacity: updating === app.id ? 0.5 : 1,
                      transition: "all 0.2s",
                      boxShadow: dragging === app.id ? `0 4px 16px ${stage.color}30` : "none",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${stage.color}50`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = dragging === app.id ? stage.color : "rgba(95,143,138,0.12)"}
                  >
                    {/* Avatar */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${stage.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: stage.color, fontWeight: 600, flexShrink: 0 }}>
                        {app.fullName?.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {app.fullName}
                        </p>
                        <p style={{ fontSize: "10px", color: stage.color, fontWeight: 500 }}>{app.position}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <p style={{ fontSize: "10px", color: "#B8CDD2", marginBottom: "10px" }}>
                      {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </p>

                    {/* Quick move buttons */}
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {STAGES.filter(s => s.key !== stage.key).slice(0, 2).map(s => (
                        <button key={s.key}
                          onClick={e => { e.stopPropagation(); moveCard(app.id, s.key); }}
                          disabled={updating === app.id}
                          style={{ flex: 1, padding: "3px 6px", fontSize: "9px", fontWeight: 600, border: `1px solid ${s.color}30`, borderRadius: "4px", background: s.bg, color: s.color, cursor: "pointer", textAlign: "center" }}>
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {countByStage(stage.key) === 0 && (
                  <div style={{ padding: "24px 14px", textAlign: "center", background: "rgba(95,143,138,0.02)", borderRadius: "8px", border: "1px dashed rgba(95,143,138,0.12)" }}>
                    <p style={{ fontSize: "11px", color: "#B8CDD2" }}>Kosong</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail popup */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "520px", maxHeight: "85vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ background: `linear-gradient(135deg,#0a1e1d,${ACCENT})`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#EEF4F6", marginBottom: "4px" }}>{selected.fullName}</h2>
                <p style={{ fontSize: "13px", color: "rgba(238,244,246,0.6)" }}>{selected.position} · {selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Status pills */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Pindahkan ke:</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {STAGES.map(s => (
                    <button key={s.key}
                      onClick={() => { moveCard(selected.id, s.key); setSelected((p: any) => ({ ...p, status: s.key })); }}
                      style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 500, border: `1px solid ${selected.status === s.key ? s.color : "rgba(95,143,138,0.15)"}`, borderRadius: "6px", background: selected.status === s.key ? s.bg : "transparent", color: selected.status === s.key ? s.color : "#7A9AA5", cursor: "pointer" }}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Motivasi */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Motivasi</p>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560", lineHeight: 1.8, background: "rgba(95,143,138,0.04)", padding: "12px", borderRadius: "6px" }}>
                  {selected.motivation || "—"}
                </p>
              </div>
              {/* Links */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone?.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "6px", textDecoration: "none", color: "#25D366", fontSize: "12px", fontWeight: 500 }}>
                    WhatsApp: {selected.phone}
                  </a>
                )}
                {selected.portfolioLink && (
                  <a href={selected.portfolioLink} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "8px 14px", border: `1px solid ${ACCENT}30`, borderRadius: "6px", textDecoration: "none", color: ACCENT, fontSize: "12px" }}>
                    Portfolio ↗
                  </a>
                )}
                {selected.cvUrl && (
                  <a href={selected.cvUrl} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "8px 14px", border: "1px solid rgba(122,154,165,0.2)", borderRadius: "6px", textDecoration: "none", color: "#7A9AA5", fontSize: "12px" }}>
                    📄 CV
                  </a>
                )}
              </div>
              {/* Actions */}
              {selected.status === "SHORTLISTED" && (
                <Link href={`/dashboard/hr/interview?appId=${selected.id}&name=${encodeURIComponent(selected.fullName)}&position=${encodeURIComponent(selected.position)}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "11px", background: ACCENT, color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                  Jadwalkan Interview →
                </Link>
              )}
              {selected.status === "ACCEPTED" && (
                <Link href={`/dashboard/hr/employee/new?fromApp=${selected.id}&name=${encodeURIComponent(selected.fullName)}&email=${encodeURIComponent(selected.email)}&position=${encodeURIComponent(selected.position)}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "11px", background: "#3F6F6A", color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                  Onboard sebagai Anggota →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .pipeline-stats { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 540px) { .pipeline-stats { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}