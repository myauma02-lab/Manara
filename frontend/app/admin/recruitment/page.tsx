"use client";
import { useEffect, useState } from "react";
import { recruitmentApi } from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const STATUS_CONFIG: any = {
  PENDING: { label: "Pending", bg: "rgba(198,173,138,0.2)", color: "#A78E6D" },
  REVIEWING: { label: "Ditinjau", bg: "rgba(38,108,135,0.1)", color: "#266c87" },
  SHORTLISTED: { label: "Shortlist", bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
  ACCEPTED: { label: "Diterima", bg: "rgba(63,111,106,0.15)", color: "#3F6F6A" },
  REJECTED: { label: "Ditolak", bg: "rgba(248,113,113,0.1)", color: "#f87171" },
};

const DEFAULT_POSITIONS = [
  { id: "peneliti", name: "Peneliti & Analis", quota: 3 },
  { id: "konten", name: "Kreator Konten & Editor", quota: 3 },
  { id: "desainer", name: "Desainer Visual & Media", quota: 2 },
  { id: "koordinator", name: "Koordinator Program", quota: 2 },
  { id: "kontributor", name: "Kontributor Esai & Opini", quota: 5 },
];

export default function AdminRecruitmentPage() {
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [activeRec, setActiveRec] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({
    batchName: "",
    description: "",
    openDate: "",
    closeDate: "",
    isOpen: true,
  });
  const [positions, setPositions] = useState(DEFAULT_POSITIONS);

  const load = () => {
    recruitmentApi.list()
      .then(r => {
        const all = r.data.data || [];
        setRecruitments(all);
        const active = all.find((rec: any) => rec.isOpen) || all[0];
        setActiveRec(active || null);
        if (active) {
          recruitmentApi.applications(active.id)
            .then(res => setApplications(res.data.data || []))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const loadApplications = (recId: string, status?: string) => {
    recruitmentApi.applications(recId, status || undefined)
      .then(r => setApplications(r.data.data || []))
      .catch(() => {});
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.batchName.trim()) { alert("Nama batch wajib diisi"); return; }
    setCreatingBatch(true);
    try {
      const payload = {
        ...batchForm,   
        positions,
      };
      const res = await recruitmentApi.createBatch(payload);
      const newBatch = res.data?.data;
      if (newBatch) {
        setRecruitments(prev => [newBatch, ...prev]);
        setActiveRec(newBatch);
        setBatchForm({ batchName: "", description: "", openDate: "", closeDate: "", isOpen: true });
        setPositions(DEFAULT_POSITIONS);
        setShowNewBatch(false);
        loadApplications(newBatch.id);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal membuat batch. Silakan coba lagi.");
    } finally {
      setCreatingBatch(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    await recruitmentApi.updateApplication(appId, { status });
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    setSelected((prev: any) => prev ? { ...prev, status } : null);
  };

  const filtered = filterStatus ? applications.filter(a => a.status === filterStatus) : applications;

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff",
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Manapeople Recruitment</h1>
        </div>
        <button
          onClick={() => setShowNewBatch(!showNewBatch)}
          style={{ background: showNewBatch ? "transparent" : "#266c87", color: showNewBatch ? "#3A5560" : "#fff", border: `1px solid ${showNewBatch ? "rgba(38,108,135,0.2)" : "#266c87"}`, borderRadius: "2px", padding: "11px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
          {showNewBatch ? "Batal" : "+ Buat Batch Baru"}
        </button>
      </div>

      {/* Form buat batch baru */}
      {showNewBatch && (
        <form onSubmit={handleCreateBatch} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", padding: "32px", marginBottom: "32px" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "24px" }}>
            Batch Rekrutmen Baru
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>Nama Batch *</label>
              <input value={batchForm.batchName} onChange={e => setBatchForm(f => ({ ...f, batchName: e.target.value }))} required placeholder="Manapeople 2026 — Batch Pertama" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>Deskripsi</label>
              <textarea value={batchForm.description} onChange={e => setBatchForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsi singkat batch rekrutmen ini..." rows={3}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>Tanggal Buka</label>
                <input type="date" value={batchForm.openDate} onChange={e => setBatchForm(f => ({ ...f, openDate: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>Tanggal Tutup</label>
                <input type="date" value={batchForm.closeDate} onChange={e => setBatchForm(f => ({ ...f, closeDate: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "12px" }}>
                Posisi yang Dibuka
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {positions.map((pos, i) => (
                  <div key={pos.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "10px", alignItems: "center", padding: "12px 16px", background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px" }}>
                    <input value={pos.name} onChange={e => setPositions(prev => prev.map((p, idx) => idx === i ? { ...p, name: e.target.value } : p))}
                      style={{ ...inputStyle, padding: "6px 10px", fontSize: "13px" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: "#7A9AA5" }}>Kuota:</span>
                      <input type="number" value={pos.quota} min="1" onChange={e => setPositions(prev => prev.map((p, idx) => idx === i ? { ...p, quota: parseInt(e.target.value) } : p))}
                        style={{ ...inputStyle, padding: "6px 10px", fontSize: "13px", width: "60px" }} />
                    </div>
                    <button type="button" onClick={() => setPositions(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "16px", padding: "0 4px" }}>
                      ×
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => setPositions(prev => [...prev, { id: Date.now().toString(), name: "Posisi Baru", quota: 2 }])}
                  style={{ padding: "10px", border: "1px dashed rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#266c87", fontSize: "13px", cursor: "pointer" }}>
                  + Tambah Posisi
                </button>
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={batchForm.isOpen} onChange={e => setBatchForm(f => ({ ...f, isOpen: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#266c87" }} />
              <span style={{ fontSize: "14px", color: "#3A5560" }}>Langsung buka rekrutmen setelah dibuat</span>
            </label>
            <button type="submit" disabled={creatingBatch}
              style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", opacity: creatingBatch ? 0.6 : 1 }}>
              {creatingBatch ? "Membuat Batch..." : "Buat Batch Rekrutmen"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat...</p>
      ) : !activeRec ? (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada batch rekrutmen</p>
          <p style={{ fontSize: "14px", color: "#B8CDD2", marginBottom: "24px" }}>Buat batch rekrutmen pertama untuk mulai menerima lamaran</p>
          <button onClick={() => setShowNewBatch(true)}
            style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "12px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
            + Buat Batch Rekrutmen
          </button>
        </div>
      ) : (
        <>
          {/* Batch selector (jika ada lebih dari 1) */}
          {recruitments.length > 1 && (
            <div style={{ marginBottom: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {recruitments.map(rec => (
                <button key={rec.id}
                  onClick={() => { setActiveRec(rec); setFilterStatus(""); loadApplications(rec.id); }}
                  style={{ padding: "8px 18px", fontSize: "13px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: activeRec?.id === rec.id ? "#266c87" : "transparent", color: activeRec?.id === rec.id ? "#fff" : "#3A5560", cursor: "pointer" }}>
                  {rec.batchName}
                  {rec.isOpen && <span style={{ marginLeft: "6px", fontSize: "9px", color: activeRec?.id === rec.id ? "rgba(255,255,255,0.7)" : "#5F8F8A" }}>● AKTIF</span>}
                </button>
              ))}
            </div>
          )}

          {/* Batch info */}
          <div style={{ background: "#0F2830", borderRadius: "4px", padding: "24px 28px", marginBottom: "24px", border: "1px solid rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", color: "rgba(238,244,246,0.9)", marginBottom: "8px" }}>
                {activeRec.batchName}
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: activeRec.isOpen ? "rgba(95,143,138,0.2)" : "rgba(184,205,210,0.1)", color: activeRec.isOpen ? "#86AFAA" : "#7A9AA5" }}>
                  {activeRec.isOpen ? "● Terbuka" : "○ Ditutup"}
                </span>
                {activeRec.closeDate && (
                  <span style={{ fontSize: "11px", color: "rgba(134,175,170,0.4)" }}>
                    Tutup: {format(new Date(activeRec.closeDate), "d MMM yyyy", { locale: localeId })}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "40px", fontWeight: 300, color: "rgba(238,244,246,0.9)", lineHeight: 1 }}>
                {applications.length}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(134,175,170,0.4)" }}>total lamaran</p>
            </div>
          </div>

          {/* Posisi summary */}
          {activeRec.positions?.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              {(activeRec.positions as any[]).map((pos: any) => {
                const count = applications.filter(a => a.position === pos.name).length;
                return (
                  <div key={pos.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px", padding: "8px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "#3A5560" }}>{pos.name}</span>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#266c87" }}>{count}</span>
                    <span style={{ fontSize: "11px", color: "#B8CDD2" }}>/ {pos.quota}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filter status */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {["", "PENDING", "REVIEWING", "SHORTLISTED", "ACCEPTED", "REJECTED"].map(s => (
              <button key={s}
                onClick={() => { setFilterStatus(s); loadApplications(activeRec.id, s || undefined); }}
                style={{ padding: "7px 16px", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: filterStatus === s ? "#266c87" : "transparent", color: filterStatus === s ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
                {s === "" ? `Semua (${applications.length})` : STATUS_CONFIG[s]?.label}
                {s !== "" && ` (${applications.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>

          {/* Applications table */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <p style={{ padding: "48px", textAlign: "center", color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
                {filterStatus ? "Tidak ada lamaran dengan status ini" : "Belum ada lamaran masuk"}
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                    {["Nama", "Email", "Posisi", "Status", "Tanggal", "Aksi"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "13px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(app => {
                    const cfg = STATUS_CONFIG[app.status];
                    return (
                      <tr key={app.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)" }}>
                        <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{app.fullName}</td>
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7A9AA5" }}>{app.email}</td>
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7A9AA5" }}>{app.position}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 500, padding: "3px 10px", borderRadius: "2px", background: cfg?.bg, color: cfg?.color }}>
                            {cfg?.label}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: "12px", color: "#B8CDD2" }}>
                          {format(new Date(app.createdAt), "d MMM yyyy", { locale: localeId })}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <button onClick={() => setSelected(app)} style={{ fontSize: "12px", color: "#266c87", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                            Tinjau
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Modal detail lamaran */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "4px", width: "100%", maxWidth: "560px", padding: "40px", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "24px", color: "#0F2830", marginBottom: "4px" }}>{selected.fullName}</h2>
                <p style={{ fontSize: "13px", color: "#7A9AA5" }}>{selected.position} · {selected.email}</p>
                {selected.phone && <p style={{ fontSize: "13px", color: "#B8CDD2", marginTop: "2px" }}>{selected.phone}</p>}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "22px", color: "#B8CDD2", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Motivasi</p>
              <p style={{ fontSize: "14px", color: "#3A5560", lineHeight: 1.85, background: "rgba(38,108,135,0.03)", padding: "16px", borderRadius: "2px", border: "1px solid rgba(38,108,135,0.08)" }}>
                {selected.motivation}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              {selected.cvUrl && (
                <a href={selected.cvUrl} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#266c87", textDecoration: "none", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 16px", borderRadius: "2px" }}>
                  📄 Unduh CV
                </a>
              )}
              {selected.portfolioLink && (
                <a href={selected.portfolioLink} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#266c87", textDecoration: "none", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 16px", borderRadius: "2px" }}>
                  🔗 Portfolio
                </a>
              )}
            </div>

            <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "20px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
                Ubah Status Lamaran
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]: any) => (
                  <button key={key} onClick={() => updateStatus(selected.id, key)}
                    style={{ fontSize: "12px", fontWeight: 500, padding: "9px 18px", borderRadius: "2px", border: `1px solid ${selected.status === key ? "#266c87" : "rgba(38,108,135,0.15)"}`, background: selected.status === key ? "#266c87" : "transparent", color: selected.status === key ? "#fff" : "#3A5560", cursor: "pointer", transition: "all 0.2s" }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}