"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { hrApi, recruitmentApi } from "@/lib/api";

const ACCENT = "#5F8F8A";

const RESULT_CONFIG = {
  PENDING:     { label: "Pending",      color: "#C6AD8A", bg: "rgba(198,173,138,0.12)" },
  PASSED:      { label: "Lulus",        color: "#3F6F6A", bg: "rgba(63,111,106,0.12)" },
  FAILED:      { label: "Tidak Lulus",  color: "#f87171", bg: "rgba(248,113,113,0.08)" },
  RESCHEDULED: { label: "Dijadwal Ulang", color: "#266c87", bg: "rgba(38,108,135,0.1)" },
} as const;

type InterviewResult = keyof typeof RESULT_CONFIG;

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const prefillAppId = searchParams.get("appId") || "";
  const prefillName  = searchParams.get("name") || "";
  const prefillPos   = searchParams.get("position") || "";

  const [interviews, setInterviews]   = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showCreate, setShowCreate]   = useState(!!prefillAppId);
  const [filterResult, setFilterResult] = useState("");
  const [filterUpcoming, setFilterUpcoming] = useState(false);

  const load = () => {
    setLoading(true);
    hrApi.interviews()
      .then(r => setInterviews(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpdateResult = async (id: string, result: string, resultNotes?: string) => {
    try {
      await hrApi.updateInterview(id, { result, resultNotes });
      setInterviews(prev =>
        prev.map(iv => iv.id === id ? { ...iv, result, resultNotes } : iv)
      );
    } catch { alert("Gagal mengubah hasil"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal interview ini?")) return;
    try {
      await hrApi.deleteInterview(id);
      load();
    } catch { alert("Gagal menghapus"); }
  };

  const filtered = interviews.filter(iv => {
    const matchResult = !filterResult || iv.result === filterResult;
    const matchUpcoming = !filterUpcoming || new Date(iv.scheduledAt) > new Date();
    return matchResult && matchUpcoming;
  });

  const upcoming = interviews.filter(iv => new Date(iv.scheduledAt) > new Date());
  const today = interviews.filter(iv => {
    const d = new Date(iv.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>HR · Rekrutmen</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Jadwal Interview
          </h1>
          <div style={{ display: "flex", gap: "16px" }}>
            <p style={{ fontSize: "13px", color: ACCENT, fontWeight: 500 }}>{today.length} hari ini</p>
            <p style={{ fontSize: "13px", color: "#7A9AA5" }}>{upcoming.length} mendatang</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ padding: "10px 20px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
          + Jadwalkan Interview
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button onClick={() => setFilterUpcoming(!filterUpcoming)}
          style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 500, border: `1px solid ${filterUpcoming ? ACCENT : "rgba(95,143,138,0.2)"}`, borderRadius: "20px", background: filterUpcoming ? `${ACCENT}15` : "transparent", color: filterUpcoming ? ACCENT : "#7A9AA5", cursor: "pointer" }}>
          Mendatang saja
        </button>
        {(Object.entries(RESULT_CONFIG) as [InterviewResult, typeof RESULT_CONFIG.PENDING][]).map(([res, cfg]) => (
          <button key={res} onClick={() => setFilterResult(filterResult === res ? "" : res)}
            style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 500, border: `1px solid ${filterResult === res ? cfg.color : "rgba(95,143,138,0.15)"}`, borderRadius: "20px", background: filterResult === res ? cfg.bg : "transparent", color: filterResult === res ? cfg.color : "#7A9AA5", cursor: "pointer" }}>
            {cfg.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px" }}>Memuat...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(95,143,138,0.12)", borderRadius: "10px", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
            Belum ada jadwal interview
          </p>
          <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "20px" }}>
            Jadwalkan interview untuk pelamar yang sudah diseleksi
          </p>
          <button onClick={() => setShowCreate(true)}
            style={{ padding: "10px 22px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            + Jadwalkan Interview
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map(iv => {
            const rc = RESULT_CONFIG[iv.result as InterviewResult] || RESULT_CONFIG.PENDING;
            const isPast = new Date(iv.scheduledAt) < new Date();
            const isToday = new Date(iv.scheduledAt).toDateString() === new Date().toDateString();

            return (
              <div key={iv.id} style={{ background: "#fff", border: `1px solid ${isToday ? `${ACCENT}40` : "rgba(95,143,138,0.12)"}`, borderRadius: "10px", padding: "20px 24px", display: "flex", gap: "20px", alignItems: "flex-start" }}>

                {/* Date badge */}
                <div style={{ width: "56px", height: "64px", borderRadius: "8px", background: isToday ? `${ACCENT}15` : "rgba(95,143,138,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: isToday ? ACCENT : "#7A9AA5", lineHeight: 1 }}>
                    {new Date(iv.scheduledAt).getDate()}
                  </p>
                  <p style={{ fontSize: "10px", color: isToday ? ACCENT : "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {new Date(iv.scheduledAt).toLocaleDateString("id-ID", { month: "short" })}
                  </p>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
                    <p style={{ fontSize: "16px", fontWeight: 500, color: "#0F2830" }}>
                      {iv.application?.fullName}
                    </p>
                    <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "4px", background: rc.bg, color: rc.color }}>
                      {rc.label}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: "10px", fontWeight: 500, color: "#fff", background: ACCENT, padding: "2px 8px", borderRadius: "4px" }}>
                        HARI INI
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", color: ACCENT, fontWeight: 500, marginBottom: "4px" }}>
                    {iv.application?.position}
                  </p>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                      🕐 {new Date(iv.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      {iv.durationMinutes && ` · ${iv.durationMinutes} menit`}
                    </p>
                    {iv.location && <p style={{ fontSize: "12px", color: "#7A9AA5" }}>📍 {iv.location}</p>}
                    {iv.interviewerName && <p style={{ fontSize: "12px", color: "#7A9AA5" }}>👤 {iv.interviewerName}</p>}
                  </div>
                  {iv.meetLink && (
                    <a href={iv.meetLink} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: "6px", fontSize: "12px", color: ACCENT, textDecoration: "none", border: `1px solid ${ACCENT}30`, padding: "4px 10px", borderRadius: "4px" }}>
                      🔗 Buka Link Meeting
                    </a>
                  )}
                  {iv.notes && (
                    <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "6px", fontStyle: "italic" }}>
                      Catatan: {iv.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                  {isPast && iv.result === "PENDING" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <p style={{ fontSize: "10px", color: "#B8CDD2", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>
                        Hasil:
                      </p>
                      {(["PASSED", "FAILED", "RESCHEDULED"] as InterviewResult[]).map(res => {
                        const cfg = RESULT_CONFIG[res];
                        return (
                          <button key={res}
                            onClick={() => handleUpdateResult(iv.id, res)}
                            style={{ padding: "5px 12px", fontSize: "11px", fontWeight: 500, border: `1px solid ${cfg.color}30`, borderRadius: "4px", background: cfg.bg, color: cfg.color, cursor: "pointer" }}>
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {iv.result === "PASSED" && (
                    <a href={`/dashboard/hr/employee/new?fromApp=${iv.applicationId}&name=${encodeURIComponent(iv.application?.fullName || "")}&position=${encodeURIComponent(iv.application?.position || "")}`}
                      style={{ padding: "6px 12px", fontSize: "11px", fontWeight: 500, background: "#3F6F6A", color: "#fff", borderRadius: "4px", textDecoration: "none", textAlign: "center" }}>
                      → Onboard
                    </a>
                  )}
                  <button onClick={() => handleDelete(iv.id)}
                    style={{ padding: "5px 10px", fontSize: "11px", color: "#f87171", background: "none", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", cursor: "pointer" }}>
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Interview Modal */}
      {showCreate && (
        <CreateInterviewModal
          prefillAppId={prefillAppId}
          prefillName={prefillName}
          prefillPosition={prefillPos}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateInterviewModal({ prefillAppId, prefillName, prefillPosition, onClose, onSuccess }: {
  prefillAppId: string;
  prefillName: string;
  prefillPosition: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [form, setForm] = useState({
    applicationId: prefillAppId,
    scheduledAt: "",
    durationMinutes: "60",
    location: "",
    meetLink: "",
    interviewerName: "",
    notes: "",
  });

  useEffect(() => {
    // Load shortlisted applicants
    recruitmentApi.list()
      .then(async r => {
        const batches = r.data.data || [];
        const active = batches.find((b: any) => b.isActive) || batches[0];
        if (active) {
          const res = await recruitmentApi.applications(active.id);
          const apps = (res.data.data || []).filter(
            (a: any) => ["SHORTLISTED", "REVIEWING"].includes(a.status)
          );
          setApplications(apps);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicationId || !form.scheduledAt) {
      setError("Pelamar dan waktu interview wajib diisi"); return;
    }
    setSaving(true);
    setError("");
    try {
      await hrApi.createInterview({
        ...form,
        durationMinutes: parseInt(form.durationMinutes) || 60,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat jadwal");
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

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "520px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

        <div style={{ background: `linear-gradient(135deg,#0a1e1d,${ACCENT})`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>HR · Interview</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>
              Jadwalkan Interview
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Pelamar *
            </label>
            {prefillAppId && prefillName ? (
              <div style={{ padding: "10px 13px", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30`, borderRadius: "6px" }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{prefillName}</p>
                {prefillPosition && <p style={{ fontSize: "12px", color: ACCENT }}>{prefillPosition}</p>}
              </div>
            ) : (
              <select value={form.applicationId}
                onChange={e => setForm(f => ({ ...f, applicationId: e.target.value }))}
                required style={{ ...inputStyle, appearance: "none" }}>
                <option value="">Pilih pelamar...</option>
                {applications.map(a => (
                  <option key={a.id} value={a.id}>{a.fullName} — {a.position}</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                Waktu Interview *
              </label>
              <input type="datetime-local" value={form.scheduledAt}
                onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                required style={{ ...inputStyle, fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                Durasi (mnt)
              </label>
              <input type="number" value={form.durationMinutes}
                onChange={e => setForm(f => ({ ...f, durationMinutes: e.target.value }))}
                min="15" max="180" step="15"
                style={{ ...inputStyle, textAlign: "center" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Lokasi (opsional)
            </label>
            <input value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Kantor Manara / Online / ..."
              style={inputStyle} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Link Meeting (opsional)
            </label>
            <input value={form.meetLink}
              onChange={e => setForm(f => ({ ...f, meetLink: e.target.value }))}
              placeholder="https://meet.google.com/..."
              style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                Pewawancara
              </label>
              <input value={form.interviewerName}
                onChange={e => setForm(f => ({ ...f, interviewerName: e.target.value }))}
                placeholder="Nama pewawancara"
                style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                Catatan
              </label>
              <input value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Instruksi khusus..."
                style={inputStyle} />
            </div>
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
              {saving ? "Menyimpan..." : "Jadwalkan Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}