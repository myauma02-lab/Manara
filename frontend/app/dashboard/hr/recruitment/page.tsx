"use client";
import { useEffect, useState } from "react";
import { recruitmentApi, waitlistApi } from "@/lib/api";
import Link from "next/link";

type AdminTab = "batches" | "waitlist";

const STATUS_CONFIG = {
  PENDING:     { label: "Pending",     color: "#B8CDD2", bg: "rgba(184,205,210,0.15)" },
  REVIEWING:   { label: "Reviewing",   color: "#266c87", bg: "rgba(38,108,135,0.1)"  },
  SHORTLISTED: { label: "Shortlisted", color: "#8A8F5E", bg: "rgba(138,143,94,0.12)" },
  ACCEPTED:    { label: "Diterima",    color: "#3F6F6A", bg: "rgba(63,111,106,0.12)" },
  REJECTED:    { label: "Ditolak",     color: "#f87171", bg: "rgba(248,113,113,0.08)" },
};

export default function AdminRecruitmentPage() {
  const [tab, setTab] = useState<AdminTab>("batches");
  const [batches, setBatches] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const loadBatches = () => {
    setLoading(true);
    recruitmentApi.list()
      .then(r => setBatches(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const loadWaitlist = () => {
    waitlistApi.list()
      .then(r => setWaitlist(r.data.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadBatches();
    loadWaitlist();
  }, []);

  const loadApplications = (batchId: string) => {
    setLoadingApps(true);
    recruitmentApi.applications(batchId)
      .then(r => setApplications(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingApps(false));
  };

  const handleToggleActive = async (batch: any) => {
    try {
      await recruitmentApi.update(batch.id, {
        isActive: String(!batch.isActive),
      });
      loadBatches();
    } catch { alert("Gagal mengubah status"); }
  };

  const handleDeleteBatch = async (id: string, name: string) => {
    if (!confirm(`Hapus batch "${name}"?\n\nSemua lamaran dalam batch ini juga akan dihapus.`)) return;
    try {
      await recruitmentApi.delete(id);
      if (selectedBatch?.id === id) setSelectedBatch(null);
      loadBatches();
    } catch { alert("Gagal menghapus batch"); }
  };

  const handleUpdateAppStatus = async (appId: string, status: string, adminNotes?: string) => {
    try {
      await recruitmentApi.updateApplication(appId, { status, adminNotes });
      if (selectedBatch) loadApplications(selectedBatch.id);
    } catch { alert("Gagal mengubah status"); }
  };

  const handleDeleteWaitlist = async (id: string) => {
    if (!confirm("Hapus entri ini dari waitlist?")) return;
    try {
      await waitlistApi.delete(id);
      loadWaitlist();
    } catch { alert("Gagal menghapus"); }
  };

  const activeBatch = batches.find(b => b.isActive);

  return (
    <div style={{ padding: "40px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Manajemen Manapeople
          </h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {activeBatch ? (
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#3F6F6A", background: "rgba(63,111,106,0.1)", padding: "4px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Rekrutmen Aktif: {activeBatch.batchName}
              </span>
            ) : (
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "4px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                Mode Waitlist — Tidak ada batch aktif
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 22px", background: "#266c87", color: "#fff", borderRadius: "4px", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
        >
          + Buat Batch Baru
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(38,108,135,0.1)", marginBottom: "24px" }}>
        {[
          { key: "batches" as AdminTab, label: `Batch (${batches.length})` },
          { key: "waitlist" as AdminTab, label: `Waitlist (${waitlist.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "10px 20px", fontSize: "13px", fontWeight: tab === t.key ? 500 : 300, color: tab === t.key ? "#266c87" : "#7A9AA5", background: "none", border: "none", borderBottom: `2px solid ${tab === t.key ? "#266c87" : "transparent"}`, cursor: "pointer", marginBottom: "-1px" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: BATCHES ── */}
      {tab === "batches" && (
        <div style={{ display: "grid", gridTemplateColumns: selectedBatch ? "300px 1fr" : "1fr", gap: "20px" }}>

          {/* List Batch */}
          <div>
            {loading ? (
              <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>Memuat...</p>
            ) : batches.length === 0 ? (
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "48px", textAlign: "center" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
                  Belum ada batch
                </p>
                <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "20px" }}>
                  Buat batch rekrutmen pertama Manapeople
                </p>
                <button onClick={() => setShowCreateForm(true)}
                  style={{ padding: "10px 22px", background: "#266c87", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                  + Buat Batch Pertama
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {batches.map(batch => (
                  <div key={batch.id}
                    style={{ background: "#fff", border: `1px solid ${selectedBatch?.id === batch.id ? "#266c87" : "rgba(38,108,135,0.1)"}`, borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => {
                      setSelectedBatch(batch);
                      loadApplications(batch.id);
                    }}
                  >
                    {/* Active indicator */}
                    <div style={{ height: "3px", background: batch.isActive ? "#4ade80" : "transparent" }} />
                    <div style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "4px" }}>
                            <p style={{ fontSize: "15px", fontWeight: 500, color: "#0F2830" }}>{batch.batchName}</p>
                            {batch.isActive && (
                              <span style={{ fontSize: "10px", fontWeight: 500, color: "#3F6F6A", background: "rgba(63,111,106,0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                                Aktif
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                              {batch._count?.applications || 0} lamaran
                            </p>
                            <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                              {batch.positions?.length || 0} posisi
                            </p>
                            {batch.endDate && (
                              <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                                Deadline: {new Date(batch.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button
                            onClick={e => { e.stopPropagation(); handleToggleActive(batch); }}
                            title={batch.isActive ? "Nonaktifkan batch" : "Aktifkan batch"}
                            style={{ padding: "5px 10px", fontSize: "11px", fontWeight: 500, border: `1px solid ${batch.isActive ? "rgba(248,113,113,0.3)" : "rgba(63,111,106,0.3)"}`, borderRadius: "4px", background: "transparent", color: batch.isActive ? "#f87171" : "#3F6F6A", cursor: "pointer" }}
                          >
                            {batch.isActive ? "Tutup" : "Buka"}
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDeleteBatch(batch.id, batch.batchName); }}
                            style={{ padding: "5px 8px", fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel Lamaran */}
          {selectedBatch && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "2px" }}>
                    {selectedBatch.batchName}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#B8CDD2" }}>
                    {applications.length} lamaran masuk
                  </p>
                </div>
                <button onClick={() => setSelectedBatch(null)}
                  style={{ background: "none", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", color: "#7A9AA5", cursor: "pointer", padding: "6px 12px", fontSize: "12px" }}>
                  Tutup ×
                </button>
              </div>

              {loadingApps ? (
                <p style={{ color: "#7A9AA5" }}>Memuat lamaran...</p>
              ) : applications.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "40px", textAlign: "center" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#7A9AA5" }}>
                    Belum ada lamaran untuk batch ini.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {applications.map(app => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onUpdateStatus={handleUpdateAppStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: WAITLIST ── */}
      {tab === "waitlist" && (
        <div>
          {waitlist.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "48px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5" }}>
                Belum ada yang mendaftar ke waitlist.
              </p>
            </div>
          ) : (
            <>
              {/* Export CSV */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                <button
                  onClick={() => {
                    const csv = [
                      ["Nama", "Email", "WhatsApp", "Minat", "Pesan", "Sumber", "Tanggal"].join(","),
                      ...waitlist.map(e => [
                        `"${e.name}"`,
                        e.email,
                        e.phone || "-",
                        `"${e.interest || "-"}"`,
                        `"${(e.message || "").replace(/"/g, '""')}"`,
                        e.source || "-",
                        new Date(e.createdAt).toLocaleDateString("id-ID"),
                      ].join(","))
                    ].join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `waitlist-manapeople-${new Date().toISOString().slice(0,10)}.csv`;
                    a.click();
                  }}
                  style={{ padding: "9px 18px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", background: "transparent", color: "#266c87", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}
                >
                  ↓ Export CSV
                </button>
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 140px 120px 80px", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "12px 20px", background: "rgba(38,108,135,0.02)" }}>
                  {["Nama & Email", "Minat", "Sumber", "Tanggal", ""].map(h => (
                    <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                      {h}
                    </p>
                  ))}
                </div>
                {waitlist.map(entry => (
                  <div key={entry.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 140px 120px 80px", padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{entry.name}</p>
                      <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{entry.email}</p>
                      {entry.phone && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{entry.phone}</p>}
                    </div>
                    <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{entry.interest || "—"}</p>
                    <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{entry.source || "—"}</p>
                    <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                      {new Date(entry.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <button onClick={() => handleDeleteWaitlist(entry.id)}
                      style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── MODAL CREATE BATCH ── */}
      {showCreateForm && (
        <CreateBatchModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => { setShowCreateForm(false); loadBatches(); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Komponen Application Card
// ─────────────────────────────────────────────────────
function ApplicationCard({ app, onUpdateStatus }: {
  app: any;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(app.adminNotes || "");
  const sc = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", overflow: "hidden" }}>
      {/* Row utama */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{app.fullName}</p>
            <span style={{ fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "10px", background: sc.bg, color: sc.color }}>
              {sc.label}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{app.email}</p>
          <p style={{ fontSize: "12px", color: "#266c87", fontWeight: 500 }}>{app.position}</p>
        </div>

        {/* Quick status change */}
        <select
          value={app.status}
          onChange={e => onUpdateStatus(app.id, e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{ fontSize: "11px", fontWeight: 500, padding: "5px 8px", borderRadius: "4px", background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30`, cursor: "pointer", outline: "none" }}
        >
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <button onClick={() => setExpanded(!expanded)}
          style={{ background: "none", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", color: "#7A9AA5", cursor: "pointer", padding: "6px 10px", fontSize: "12px" }}>
          {expanded ? "Tutup" : "Detail"}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid rgba(38,108,135,0.06)", paddingTop: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                Motivasi
              </p>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560", lineHeight: 1.75, background: "rgba(38,108,135,0.03)", padding: "12px", borderRadius: "4px" }}>
                {app.motivation}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {app.phone && (
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>WhatsApp</p>
                  <a href={`https://wa.me/${app.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#25D366", textDecoration: "none" }}>
                    {app.phone}
                  </a>
                </div>
              )}
              {app.portfolioLink && (
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Portfolio</p>
                  <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#266c87", textDecoration: "none" }}>
                    Lihat Portfolio ↗
                  </a>
                </div>
              )}
              {app.cvUrl && (
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>CV</p>
                  <a href={app.cvUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#266c87", textDecoration: "none" }}>
                    📄 Unduh CV
                  </a>
                </div>
              )}
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  Tanggal Daftar
                </p>
                <p style={{ fontSize: "13px", color: "#7A9AA5" }}>
                  {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>

          {/* Catatan admin */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              Catatan Internal
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk pelamar ini..."
              rows={2}
              style={{ width: "100%", padding: "10px 13px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", fontSize: "13px", outline: "none", fontFamily: "inherit", color: "#1C3038", resize: "none", boxSizing: "border-box" as const }}
            />
            <button
              onClick={() => onUpdateStatus(app.id, app.status, notes)}
              style={{ marginTop: "8px", padding: "7px 16px", background: "#266c87", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}
            >
              Simpan Catatan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Modal Create Batch
// ─────────────────────────────────────────────────────
function CreateBatchModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [positions, setPositions] = useState([
    { name: "", description: "", requirements: "", slots: "" },
  ]);
  const [form, setForm] = useState({
    batchName: "",
    description: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const addPosition = () => {
    setPositions(p => [...p, { name: "", description: "", requirements: "", slots: "" }]);
  };

  const removePosition = (i: number) => {
    setPositions(p => p.filter((_, j) => j !== i));
  };

  const updatePosition = (i: number, field: string, value: string) => {
    setPositions(p => {
      const arr = [...p];
      arr[i] = { ...arr[i], [field]: value };
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchName.trim()) {
      setError("Nama batch wajib diisi");
      return;
    }
    if (positions.some(p => !p.name.trim())) {
      setError("Semua posisi harus memiliki nama");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const parsedPositions = positions
        .filter(p => p.name.trim())
        .map(p => ({
          name: p.name.trim(),
          description: p.description.trim() || null,
          requirements: p.requirements
            ? p.requirements.split("\n").map(r => r.trim()).filter(Boolean)
            : [],
          slots: p.slots ? parseInt(p.slots) : null,
        }));

      await recruitmentApi.create({
        batchName: form.batchName.trim(),
        description: form.description.trim() || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        isActive: String(form.isActive),
        positions: JSON.stringify(parsedPositions),
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat batch. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,40,48,0.5)", zIndex: 200, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#F4F7F7", borderRadius: "12px", width: "100%", maxWidth: "640px", overflow: "hidden", boxShadow: "0 24px 80px rgba(15,40,48,0.25)" }}>

        {/* Modal header */}
        <div style={{ background: "#0F2830", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "2px" }}>
              Manapeople
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6" }}>
              Buat Batch Rekrutmen Baru
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(134,175,170,0.5)", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Info Batch */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
              Info Batch
            </p>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                Nama Batch <span style={{ color: "#266c87" }}>*</span>
              </label>
              <input
                value={form.batchName}
                onChange={e => setForm(f => ({ ...f, batchName: e.target.value }))}
                placeholder="Misal: Manapeople Batch 1 — 2025"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                Deskripsi (opsional)
              </label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Ceritakan tentang batch ini, tema, atau fokus rekrutmen..."
                rows={3} style={{ ...inputStyle, resize: "none", lineHeight: 1.7 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                  Tanggal Mulai
                </label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  style={{ ...inputStyle, fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                  Deadline Pendaftaran
                </label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  style={{ ...inputStyle, fontSize: "13px" }} />
              </div>
            </div>

            {/* Toggle aktif */}
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "12px 14px", background: form.isActive ? "rgba(63,111,106,0.06)" : "rgba(38,108,135,0.04)", border: `1px solid ${form.isActive ? "rgba(63,111,106,0.2)" : "rgba(38,108,135,0.1)"}`, borderRadius: "4px" }}>
              <div style={{
                width: "42px", height: "24px", borderRadius: "12px",
                background: form.isActive ? "#3F6F6A" : "rgba(38,108,135,0.2)",
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}>
                <div style={{
                  position: "absolute",
                  top: "3px",
                  left: form.isActive ? "21px" : "3px",
                  width: "18px", height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.2s",
                }} />
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  style={{ display: "none" }}
                />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>
                  {form.isActive ? "Langsung Aktifkan Batch" : "Simpan sebagai Draft"}
                </p>
                <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                  {form.isActive
                    ? "Halaman Manapeople akan langsung menampilkan form lamaran"
                    : "Batch disimpan tapi belum tampil ke publik"}
                </p>
              </div>
            </label>
          </div>

          {/* Posisi */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                Posisi Tersedia ({positions.length})
              </p>
              <button type="button" onClick={addPosition}
                style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", padding: "5px 12px", cursor: "pointer" }}>
                + Tambah Posisi
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {positions.map((pos, i) => (
                <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "6px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>
                      Posisi #{i + 1}
                    </p>
                    {positions.length > 1 && (
                      <button type="button" onClick={() => removePosition(i)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
                        Hapus
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "8px", marginBottom: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                        Nama Posisi <span style={{ color: "#266c87" }}>*</span>
                      </label>
                      <input value={pos.name} onChange={e => updatePosition(i, "name", e.target.value)}
                        placeholder="Penulis, Analis, Desainer..." required
                        style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                        Slot
                      </label>
                      <input type="number" value={pos.slots} onChange={e => updatePosition(i, "slots", e.target.value)}
                        placeholder="∞"
                        style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px", textAlign: "center" }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                      Deskripsi (opsional)
                    </label>
                    <input value={pos.description} onChange={e => updatePosition(i, "description", e.target.value)}
                      placeholder="Tugas dan tanggung jawab singkat..."
                      style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                      Kualifikasi (satu per baris)
                    </label>
                    <textarea value={pos.requirements} onChange={e => updatePosition(i, "requirements", e.target.value)}
                      placeholder={"Mahasiswa/alumni S1\nMinat di bidang riset\nBisa kerja dalam tim"}
                      rows={3} style={{ ...inputStyle, resize: "none", padding: "8px 12px", fontSize: "13px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "12px 16px" }}>
              <p style={{ fontSize: "13px", color: "#ef4444" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "13px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", background: "transparent", color: "#7A9AA5", fontSize: "14px", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 2, padding: "13px", background: saving ? "#B8CDD2" : "#266c87", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Membuat Batch..." : form.isActive ? "Buat & Aktifkan →" : "Simpan Batch →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}