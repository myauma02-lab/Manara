"use client";
import { useEffect, useState, useCallback } from "react";
import { recruitmentApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#5F8F8A";

const STATUS_CONFIG = {
  PENDING:     { label: "Pending",     color: "#B8CDD2", bg: "rgba(184,205,210,0.15)", dot: "#B8CDD2" },
  REVIEWING:   { label: "Reviewing",   color: "#266c87", bg: "rgba(38,108,135,0.1)",   dot: "#266c87" },
  SHORTLISTED: { label: "Shortlisted", color: "#5F8F8A", bg: "rgba(95,143,138,0.12)", dot: "#5F8F8A" },
  ACCEPTED:    { label: "Diterima",    color: "#3F6F6A", bg: "rgba(63,111,106,0.12)", dot: "#3F6F6A" },
  REJECTED:    { label: "Ditolak",     color: "#f87171", bg: "rgba(248,113,113,0.08)", dot: "#f87171" },
} as const;

type AppStatus = keyof typeof STATUS_CONFIG;

export default function ApplicantsPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  useEffect(() => {
    recruitmentApi.list()
      .then(r => {
        const all = r.data.data || [];
        setBatches(all);
        // Load semua aplikasi dari batch pertama yang aktif
        const active = all.find((b: any) => b.isActive) || all[0];
        if (active) loadApplications(active.id);
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadApplications = (batchId: string) => {
    setLoading(true);
    setSelectedBatch(batchId);
    recruitmentApi.applications(batchId)
      .then(r => setApplications(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    setUpdatingId(appId);
    try {
      await recruitmentApi.updateApplication(appId, { status });
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status } : a)
      );
      if (selected?.id === appId) setSelected((prev: any) => ({ ...prev, status }));
    } catch { alert("Gagal mengubah status"); }
    finally { setUpdatingId(null); }
  };

  const filtered = applications.filter(a => {
    const matchStatus = !filterStatus || a.status === filterStatus;
    const matchSearch = !search ||
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.position?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const countByStatus = (status: string) =>
    applications.filter(a => a.status === status).length;

  // ── Kanban Board ──────────────────────────────────────
  const KanbanView = () => (
    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "16px" }}>
      {(Object.entries(STATUS_CONFIG) as [AppStatus, typeof STATUS_CONFIG.PENDING][]).map(([status, cfg]) => {
        const cards = filtered.filter(a => a.status === status);
        return (
          <div key={status} style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Column header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: cfg.bg, borderRadius: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.dot }} />
              <span style={{ fontSize: "12px", fontWeight: 500, color: cfg.color }}>{cfg.label}</span>
              <span style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 500, color: cfg.color }}>
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cards.map(app => (
                <div key={app.id}
                  onClick={() => setSelected(app)}
                  style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "8px", padding: "14px", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}50`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(95,143,138,0.12)"}
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: ACCENT, fontWeight: 500, marginBottom: "8px" }}>
                    {app.fullName?.charAt(0)}
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", marginBottom: "3px" }}>
                    {app.fullName}
                  </p>
                  <p style={{ fontSize: "11px", color: ACCENT, fontWeight: 500 }}>{app.position}</p>
                  {app.email && (
                    <p style={{ fontSize: "10px", color: "#B8CDD2", marginTop: "4px" }}>{app.email}</p>
                  )}
                  <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
                    {(Object.keys(STATUS_CONFIG) as AppStatus[])
                      .filter(s => s !== status)
                      .slice(0, 2)
                      .map(s => (
                        <button key={s}
                          onClick={e => { e.stopPropagation(); handleUpdateStatus(app.id, s); }}
                          disabled={updatingId === app.id}
                          style={{ flex: 1, padding: "4px", fontSize: "9px", fontWeight: 500, border: `1px solid ${STATUS_CONFIG[s].color}30`, borderRadius: "4px", background: STATUS_CONFIG[s].bg, color: STATUS_CONFIG[s].color, cursor: "pointer" }}>
                          → {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
              {cards.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", background: "rgba(95,143,138,0.03)", borderRadius: "8px", border: "1px dashed rgba(95,143,138,0.15)" }}>
                  <p style={{ fontSize: "11px", color: "#B8CDD2" }}>Tidak ada pelamar</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>HR · Rekrutmen</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Data Pelamar
          </h1>
          <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5" }}>
            {applications.length} pelamar total
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {/* View toggle */}
          <div style={{ display: "flex", background: "rgba(95,143,138,0.08)", borderRadius: "6px", overflow: "hidden" }}>
            {[
              { mode: "list" as const, icon: "☰" },
              { mode: "kanban" as const, icon: "⋮⋮" },
            ].map(v => (
              <button key={v.mode} onClick={() => setViewMode(v.mode)}
                style={{ padding: "8px 14px", background: viewMode === v.mode ? ACCENT : "transparent", color: viewMode === v.mode ? "#fff" : ACCENT, border: "none", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" }}>
                {v.icon}
              </button>
            ))}
          </div>
          <Link href="/dashboard/hr/interview"
            style={{ padding: "9px 18px", background: ACCENT, color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontWeight: 500 }}>
            + Jadwal Interview
          </Link>
        </div>
      </div>

      {/* Batch selector */}
      {batches.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {batches.map(b => (
            <button key={b.id} onClick={() => loadApplications(b.id)}
              style={{ padding: "7px 16px", fontSize: "12px", fontWeight: 500, border: `1px solid ${selectedBatch === b.id ? ACCENT : "rgba(95,143,138,0.2)"}`, borderRadius: "20px", background: selectedBatch === b.id ? `${ACCENT}15` : "transparent", color: selectedBatch === b.id ? ACCENT : "#7A9AA5", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              {b.batchName}
              {b.isActive && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />}
            </button>
          ))}
        </div>
      )}

      {/* Status summary pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button onClick={() => setFilterStatus("")}
          style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 500, border: `1px solid ${!filterStatus ? ACCENT : "rgba(95,143,138,0.2)"}`, borderRadius: "20px", background: !filterStatus ? `${ACCENT}15` : "transparent", color: !filterStatus ? ACCENT : "#7A9AA5", cursor: "pointer" }}>
          Semua ({applications.length})
        </button>
        {(Object.entries(STATUS_CONFIG) as [AppStatus, typeof STATUS_CONFIG.PENDING][]).map(([status, cfg]) => (
          <button key={status} onClick={() => setFilterStatus(filterStatus === status ? "" : status)}
            style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 500, border: `1px solid ${filterStatus === status ? cfg.color : "rgba(95,143,138,0.15)"}`, borderRadius: "20px", background: filterStatus === status ? cfg.bg : "transparent", color: filterStatus === status ? cfg.color : "#7A9AA5", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
            {cfg.label} ({countByStatus(status)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(95,143,138,0.15)", borderRadius: "8px", overflow: "hidden", maxWidth: "400px", marginBottom: "20px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama, email, posisi..."
          style={{ flex: 1, padding: "10px 14px", fontSize: "13px", border: "none", outline: "none", color: "#0F2830", fontFamily: "inherit" }} />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer" }}>×</button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>Memuat data...</p>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanView />
      ) : (
        /* List view */
        <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "10px", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#7A9AA5" }}>
                {search || filterStatus ? "Tidak ada hasil yang sesuai" : "Belum ada pelamar"}
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 160px", borderBottom: "1px solid rgba(95,143,138,0.08)", padding: "11px 20px", background: "rgba(95,143,138,0.03)" }}>
                {["Pelamar", "Posisi", "Status", "Tanggal", "Aksi"].map(h => (
                  <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
                ))}
              </div>
              {filtered.map(app => {
                const cfg = STATUS_CONFIG[app.status as AppStatus] || STATUS_CONFIG.PENDING;
                return (
                  <div key={app.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 160px", padding: "14px 20px", borderBottom: "1px solid rgba(95,143,138,0.05)", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingRight: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: ACCENT, fontWeight: 500, flexShrink: 0 }}>
                        {app.fullName?.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.fullName}</p>
                        <p style={{ fontSize: "11px", color: "#7A9AA5" }}>{app.email}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "12px", color: "#3A5560" }}>{app.position}</p>
                    <select value={app.status}
                      onChange={e => handleUpdateStatus(app.id, e.target.value)}
                      disabled={updatingId === app.id}
                      style={{ fontSize: "11px", fontWeight: 500, padding: "4px 8px", borderRadius: "4px", border: "none", background: cfg.bg, color: cfg.color, cursor: "pointer", outline: "none" }}>
                      {(Object.entries(STATUS_CONFIG) as [AppStatus, typeof STATUS_CONFIG.PENDING][]).map(([s, c]) => (
                        <option key={s} value={s}>{c.label}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                      {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => setSelected(app)}
                        style={{ fontSize: "12px", color: ACCENT, border: `1px solid ${ACCENT}30`, borderRadius: "4px", padding: "5px 12px", background: "none", cursor: "pointer" }}>
                        Detail
                      </button>
                      {app.status === "SHORTLISTED" && (
                        <Link href={`/dashboard/hr/interview?appId=${app.id}`}
                          style={{ fontSize: "11px", color: "#fff", background: ACCENT, border: "none", borderRadius: "4px", padding: "5px 10px", textDecoration: "none" }}>
                          Interview
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "580px", maxHeight: "85vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

            {/* Modal header */}
            <div style={{ background: `linear-gradient(135deg,#0a1e1d,${ACCENT})`, padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6", marginBottom: "4px" }}>
                  {selected.fullName}
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(238,244,246,0.6)" }}>{selected.position} · {selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", color: "rgba(238,244,246,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Status */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Ubah Status
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(Object.entries(STATUS_CONFIG) as [AppStatus, typeof STATUS_CONFIG.PENDING][]).map(([status, cfg]) => (
                    <button key={status}
                      onClick={() => handleUpdateStatus(selected.id, status)}
                      disabled={updatingId === selected.id}
                      style={{ padding: "7px 14px", fontSize: "12px", fontWeight: 500, border: `1px solid ${selected.status === status ? cfg.color : "rgba(95,143,138,0.15)"}`, borderRadius: "6px", background: selected.status === status ? cfg.bg : "transparent", color: selected.status === status ? cfg.color : "#7A9AA5", cursor: "pointer", transition: "all 0.15s" }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivasi */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Motivasi</p>
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560", lineHeight: 1.8, background: "rgba(95,143,138,0.04)", padding: "14px", borderRadius: "6px", border: "1px solid rgba(95,143,138,0.08)" }}>
                  {selected.motivation || "—"}
                </p>
              </div>

              {/* Info kontak */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { label: "Email", val: selected.email },
                  { label: "WhatsApp", val: selected.phone, href: selected.phone ? `https://wa.me/${selected.phone?.replace(/\D/g,"")}` : null },
                  { label: "Portfolio", val: selected.portfolioLink ? "Lihat Portfolio" : null, href: selected.portfolioLink },
                  { label: "CV", val: selected.cvUrl ? "Unduh CV" : null, href: selected.cvUrl },
                ].map(item => item.val && (
                  <div key={item.label}>
                    <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "13px", color: ACCENT, textDecoration: "none" }}>{item.val}</a>
                    ) : (
                      <p style={{ fontSize: "13px", color: "#3A5560" }}>{item.val}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                {selected.status === "SHORTLISTED" && (
                  <Link href={`/dashboard/hr/interview?appId=${selected.id}&name=${encodeURIComponent(selected.fullName)}&position=${encodeURIComponent(selected.position)}`}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px", background: ACCENT, color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                    Jadwalkan Interview →
                  </Link>
                )}
                {selected.status === "ACCEPTED" && (
                  <Link href={`/dashboard/hr/employee/new?fromApp=${selected.id}&name=${encodeURIComponent(selected.fullName)}&email=${encodeURIComponent(selected.email)}&position=${encodeURIComponent(selected.position)}`}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px", background: "#3F6F6A", color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                    Onboard sebagai Anggota →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}