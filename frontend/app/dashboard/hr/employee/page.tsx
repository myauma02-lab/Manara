"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { hrApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#5F8F8A";

const STATUS_CONFIG = {
  PROBATION: { label: "Masa Percobaan", color: "#C6AD8A", bg: "rgba(198,173,138,0.12)" },
  ACTIVE:    { label: "Aktif",          color: "#3F6F6A", bg: "rgba(63,111,106,0.12)"  },
  INACTIVE:  { label: "Tidak Aktif",    color: "#7A9AA5", bg: "rgba(122,154,165,0.1)"  },
  RESIGNED:  { label: "Alumni",         color: "#B8CDD2", bg: "rgba(184,205,210,0.1)"  },
} as const;

type EmpStatus = keyof typeof STATUS_CONFIG;

export default function EmployeePage() {
  const searchParams = useSearchParams();
  const initStatus = searchParams.get("status") || "";

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [stats, setStats]         = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState(initStatus);
  const [filterDept, setFilterDept]     = useState("");
  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [selected, setSelected]         = useState<any | null>(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [newNote, setNewNote]           = useState("");
  const [addingNote, setAddingNote]     = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      hrApi.employees({ status: filterStatus || undefined, search: search || undefined, page, limit: 15 }),
      hrApi.employeeStats(),
    ])
      .then(([empRes, statsRes]) => {
        setEmployees(empRes.data.data || []);
        setTotalPages(empRes.data.pagination?.pages || 1);
        setStats(statsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterStatus, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterStatus, search]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !selected) return;
    setAddingNote(true);
    try {
      const res = await hrApi.addNote(selected.id, newNote);
      const note = res.data.data;
      setSelected((prev: any) => ({
        ...prev,
        notes: [note, ...(prev.notes || [])],
      }));
      setNewNote("");
    } catch { alert("Gagal menambah catatan"); }
    finally { setAddingNote(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await hrApi.updateEmployee(id, { status });
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
    } catch { alert("Gagal mengubah status"); }
  };

  // Export CSV
  const handleExport = () => {
    const csv = [
      ["Nama", "Email", "WhatsApp", "Posisi", "Divisi", "Status", "Tanggal Bergabung"].join(","),
      ...employees.map(e => [
        `"${e.fullName}"`, e.email, e.phone || "-",
        `"${e.position}"`, `"${e.department}"`,
        STATUS_CONFIG[e.status as EmpStatus]?.label || e.status,
        new Date(e.joinDate).toLocaleDateString("id-ID"),
      ].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anggota-manara-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>HR · SDM</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Database Anggota
          </h1>
          {stats && (
            <p style={{ fontSize: "13px", color: "#7A9AA5" }}>
              {stats.total} total · {stats.byStatus?.find((s: any) => s.status === "ACTIVE")?._count || 0} aktif
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleExport}
            style={{ padding: "9px 16px", border: `1px solid ${ACCENT}30`, borderRadius: "6px", background: `${ACCENT}08`, color: ACCENT, fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
            ↓ Export CSV
          </button>
          <button onClick={() => setShowCreate(true)}
            style={{ padding: "10px 20px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            + Tambah Anggota
          </button>
        </div>
      </div>

      {/* Status summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "20px" }} className="emp-stats-grid">
        {(Object.entries(STATUS_CONFIG) as [EmpStatus, typeof STATUS_CONFIG.ACTIVE][]).map(([status, cfg]) => {
          const count = stats?.byStatus?.find((s: any) => s.status === status)?._count || 0;
          return (
            <button key={status} onClick={() => setFilterStatus(filterStatus === status ? "" : status)}
              style={{ padding: "14px 16px", background: filterStatus === status ? cfg.bg : "#fff", border: `1px solid ${filterStatus === status ? cfg.color : "rgba(95,143,138,0.12)"}`, borderRadius: "8px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: cfg.color, lineHeight: 1, marginBottom: "4px" }}>
                {count}
              </p>
              <p style={{ fontSize: "11px", fontWeight: 500, color: cfg.color }}>{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flex: 1, minWidth: "200px", background: "#fff", border: "1px solid rgba(95,143,138,0.15)", borderRadius: "6px", overflow: "hidden" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, email, posisi..."
            style={{ flex: 1, padding: "10px 14px", fontSize: "13px", border: "none", outline: "none", color: "#0F2830", fontFamily: "inherit" }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer" }}>×</button>
          )}
        </div>
        {departments.length > 0 && (
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
            style={{ padding: "9px 12px", border: "1px solid rgba(95,143,138,0.15)", borderRadius: "6px", fontSize: "13px", color: "#0F2830", outline: "none", background: "#fff" }}>
            <option value="">Semua Divisi</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px" }}>Memuat...</p>
          </div>
        ) : employees.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
              Belum ada anggota
            </p>
            <button onClick={() => setShowCreate(true)}
              style={{ padding: "10px 22px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer", marginTop: "8px" }}>
              + Tambah Anggota Pertama
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 120px 110px 100px 120px", borderBottom: "1px solid rgba(95,143,138,0.08)", padding: "11px 20px", background: "rgba(95,143,138,0.03)" }}>
              {["Anggota", "Posisi", "Divisi", "Status", "Bergabung", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {employees.map(emp => {
              const cfg = STATUS_CONFIG[emp.status as EmpStatus] || STATUS_CONFIG.ACTIVE;
              return (
                <div key={emp.id} style={{ display: "grid", gridTemplateColumns: "1fr 130px 120px 110px 100px 120px", padding: "14px 20px", borderBottom: "1px solid rgba(95,143,138,0.05)", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingRight: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: emp.photoUrl ? `url(${emp.photoUrl}) center/cover` : `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: ACCENT, fontWeight: 500, flexShrink: 0 }}>
                      {!emp.photoUrl && emp.fullName?.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.fullName}</p>
                      <p style={{ fontSize: "11px", color: "#7A9AA5" }}>{emp.email}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "12px", color: "#3A5560" }}>{emp.position}</p>
                  <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{emp.department}</p>
                  <select value={emp.status}
                    onChange={e => handleUpdateStatus(emp.id, e.target.value)}
                    style={{ fontSize: "11px", fontWeight: 500, padding: "4px 6px", borderRadius: "4px", border: "none", background: cfg.bg, color: cfg.color, cursor: "pointer", outline: "none" }}>
                    {(Object.entries(STATUS_CONFIG) as [EmpStatus, typeof STATUS_CONFIG.ACTIVE][]).map(([s, c]) => (
                      <option key={s} value={s}>{c.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                    {new Date(emp.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <button onClick={() => setSelected(emp)}
                    style={{ fontSize: "12px", color: ACCENT, border: `1px solid ${ACCENT}30`, borderRadius: "4px", padding: "5px 12px", background: "none", cursor: "pointer" }}>
                    Detail
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 14px", border: "1px solid rgba(95,143,138,0.2)", borderRadius: "4px", background: "transparent", color: "#3A5560", cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: "36px", height: "36px", border: "1px solid rgba(95,143,138,0.2)", borderRadius: "4px", background: page === p ? ACCENT : "transparent", color: page === p ? "#fff" : "#3A5560", cursor: "pointer", fontSize: "13px" }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 14px", border: "1px solid rgba(95,143,138,0.2)", borderRadius: "4px", background: "transparent", color: "#3A5560", cursor: page === totalPages ? "not-allowed" : "pointer" }}>→</button>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "620px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

            <div style={{ background: `linear-gradient(135deg,#0a1e1d,${ACCENT})`, padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff", fontWeight: 500, flexShrink: 0 }}>
                {selected.fullName?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#EEF4F6", marginBottom: "2px" }}>{selected.fullName}</h2>
                <p style={{ fontSize: "13px", color: "rgba(238,244,246,0.6)" }}>{selected.position} · {selected.department}</p>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { label: "Email", val: selected.email },
                  { label: "WhatsApp", val: selected.phone },
                  { label: "Bergabung", val: new Date(selected.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Status", val: STATUS_CONFIG[selected.status as EmpStatus]?.label },
                  { label: "Alamat", val: selected.address },
                  { label: "Kontak Darurat", val: selected.emergencyContact },
                ].filter(i => i.val).map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: "10px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{item.label}</p>
                    <p style={{ fontSize: "13px", color: "#3A5560" }}>{item.val}</p>
                  </div>
                ))}
              </div>

              {/* Status change */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Ubah Status</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(Object.entries(STATUS_CONFIG) as [EmpStatus, typeof STATUS_CONFIG.ACTIVE][]).map(([status, cfg]) => (
                    <button key={status}
                      onClick={() => handleUpdateStatus(selected.id, status)}
                      style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 500, border: `1px solid ${selected.status === status ? cfg.color : "rgba(95,143,138,0.15)"}`, borderRadius: "6px", background: selected.status === status ? cfg.bg : "transparent", color: selected.status === status ? cfg.color : "#7A9AA5", cursor: "pointer" }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* HR Notes */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Catatan Internal ({selected.notes?.length || 0})
                </p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input value={newNote} onChange={e => setNewNote(e.target.value)}
                    placeholder="Tambah catatan HR..."
                    onKeyDown={e => e.key === "Enter" && handleAddNote()}
                    style={{ flex: 1, padding: "9px 12px", border: "1px solid rgba(95,143,138,0.2)", borderRadius: "6px", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                  <button onClick={handleAddNote} disabled={!newNote.trim() || addingNote}
                    style={{ padding: "9px 16px", background: addingNote ? "#B8CDD2" : ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", cursor: !newNote.trim() || addingNote ? "not-allowed" : "pointer" }}>
                    {addingNote ? "..." : "Simpan"}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                  {(selected.notes || []).map((note: any) => (
                    <div key={note.id} style={{ padding: "10px 14px", background: "rgba(95,143,138,0.04)", borderRadius: "6px", border: "1px solid rgba(95,143,138,0.08)" }}>
                      <p style={{ fontSize: "13px", color: "#3A5560", lineHeight: 1.6, marginBottom: "4px" }}>{note.content}</p>
                      <p style={{ fontSize: "10px", color: "#B8CDD2" }}>
                        {note.author?.name} · {new Date(note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  ))}
                  {(!selected.notes || selected.notes.length === 0) && (
                    <p style={{ fontSize: "13px", color: "#B8CDD2", fontStyle: "italic" }}>Belum ada catatan</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreate && (
        <CreateEmployeeModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); load(); }}
        />
      )}

      <style>{`
        @media (max-width: 900px) { .emp-stats-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}

function CreateEmployeeModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: "",
    position: searchParams.get("position") || "",
    department: "",
    joinDate: new Date().toISOString().substring(0, 10),
    status: "PROBATION",
    address: "",
    emergencyContact: "",
    applicationId: searchParams.get("fromApp") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.position || !form.department || !form.joinDate) {
      setError("Nama, email, posisi, divisi, dan tanggal bergabung wajib diisi"); return;
    }
    setSaving(true);
    setError("");
    try {
      await hrApi.createEmployee(form);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menambah anggota");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(95,143,138,0.2)", borderRadius: "6px",
    fontSize: "14px", outline: "none", color: "#0F2830",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  const DEPARTMENTS = ["Publikasi", "Riset", "SDM", "Keuangan", "Operasional", "Kreatif", "Teknologi", "Manajemen"];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

        <div style={{ background: `linear-gradient(135deg,#0a1e1d,${ACCENT})`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>
            Tambah Anggota
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Nama Lengkap *</label>
              <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Posisi *</label>
              <input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Divisi *</label>
              <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required style={{ ...inputStyle, appearance: "none" }}>
                <option value="">Pilih divisi</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>No. WhatsApp</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08xx..." style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Tanggal Bergabung *</label>
              <input type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} required style={{ ...inputStyle, fontSize: "13px" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Status Awal</label>
            <div style={{ display: "flex", gap: "6px" }}>
              {(Object.entries(STATUS_CONFIG) as [EmpStatus, typeof STATUS_CONFIG.ACTIVE][]).map(([s, cfg]) => (
                <label key={s} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: `1px solid ${form.status === s ? cfg.color : "rgba(95,143,138,0.15)"}`, borderRadius: "6px", cursor: "pointer", background: form.status === s ? cfg.bg : "transparent" }}>
                  <input type="radio" checked={form.status === s} onChange={() => setForm(f => ({ ...f, status: s }))} style={{ display: "none" }} />
                  <span style={{ fontSize: "11px", fontWeight: 500, color: form.status === s ? cfg.color : "#7A9AA5" }}>{cfg.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Alamat (opsional)</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Alamat domisili" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Kontak Darurat (opsional)</label>
            <input value={form.emergencyContact} onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))} placeholder="Nama & nomor kontak darurat" style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
              <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "12px", border: "1px solid rgba(95,143,138,0.2)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "13px", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 2, padding: "12px", background: saving ? "#B8CDD2" : ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : "Tambah Anggota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}