"use client";
import { useEffect, useState } from "react";
import { financeApi } from "@/lib/api";

const ACCENT = "#C6AD8A";

function formatRp(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

const CATEGORIES = ["Operasional", "SDM", "Marketing", "Teknologi", "Event", "Lainnya"];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [period, setPeriod] = useState(new Date().toISOString().substring(0, 7));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const load = () => {
    setLoading(true);
    financeApi.budgets(period)
      .then(r => setBudgets(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [period]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus anggaran ini?")) return;
    try {
      await financeApi.deleteBudget(id);
      load();
    } catch { alert("Gagal menghapus"); }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await financeApi.updateBudget(id, editForm);
      setEditingId(null);
      load();
    } catch { alert("Gagal menyimpan"); }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Keuangan</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#1a1208", marginBottom: "4px" }}>Anggaran</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input type="month" value={period} onChange={e => setPeriod(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid rgba(198,173,138,0.3)", borderRadius: "6px", fontSize: "13px", color: "#1a1208", outline: "none" }} />
          <button onClick={() => setShowCreate(true)}
            style={{ padding: "10px 20px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            + Tambah Anggaran
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total Anggaran", value: formatRp(totalBudget), color: ACCENT },
          { label: "Total Terpakai", value: formatRp(totalSpent), color: "#f87171" },
          { label: "Sisa Anggaran", value: formatRp(totalBudget - totalSpent), color: "#3F6F6A" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid rgba(198,173,138,0.15)", borderRadius: "10px", padding: "18px 22px" }}>
            <p style={{ fontSize: "12px", color: "#B8CDD2", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Budget cards */}
      {loading ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif" }}>Memuat...</p>
        </div>
      ) : budgets.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(198,173,138,0.15)", borderRadius: "10px", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
            Belum ada anggaran untuk periode ini
          </p>
          <button onClick={() => setShowCreate(true)}
            style={{ padding: "10px 22px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer", marginTop: "8px" }}>
            + Buat Anggaran
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {budgets.map(b => {
            const pct = b.amount > 0 ? Math.min(100, ((b.spent || 0) / b.amount) * 100) : 0;
            const isEditing = editingId === b.id;
            return (
              <div key={b.id} style={{ background: "#fff", border: "1px solid rgba(198,173,138,0.15)", borderRadius: "10px", padding: "20px 24px" }}>
                {isEditing ? (
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input value={editForm.name || ""} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))}
                      style={{ flex: 1, padding: "8px 12px", border: "1px solid rgba(198,173,138,0.3)", borderRadius: "6px", fontSize: "13px", outline: "none" }} />
                    <input type="number" value={editForm.amount || ""} onChange={e => setEditForm((f: any) => ({ ...f, amount: e.target.value }))}
                      style={{ width: "160px", padding: "8px 12px", border: "1px solid rgba(198,173,138,0.3)", borderRadius: "6px", fontSize: "13px", outline: "none" }} />
                    <button onClick={() => handleSaveEdit(b.id)}
                      style={{ padding: "8px 16px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Simpan</button>
                    <button onClick={() => setEditingId(null)}
                      style={{ padding: "8px 14px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "12px", cursor: "pointer" }}>Batal</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 500, color: "#1a1208", marginBottom: "2px" }}>{b.name}</p>
                        <p style={{ fontSize: "12px", color: ACCENT }}>{b.category}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: pct > 90 ? "#f87171" : "#1a1208" }}>
                          {formatRp(b.spent || 0)}
                          <span style={{ fontSize: "13px", color: "#B8CDD2" }}> / {formatRp(b.amount)}</span>
                        </p>
                        <p style={{ fontSize: "11px", color: pct > 90 ? "#f87171" : "#7A9AA5" }}>{pct.toFixed(0)}% terpakai</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px", marginLeft: "16px" }}>
                        <button onClick={() => { setEditingId(b.id); setEditForm({ name: b.name, amount: b.amount, category: b.category }); }}
                          style={{ fontSize: "12px", color: ACCENT, border: `1px solid ${ACCENT}30`, borderRadius: "4px", padding: "4px 10px", background: "none", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDelete(b.id)}
                          style={{ fontSize: "12px", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "4px 8px", background: "none", cursor: "pointer" }}>Hapus</button>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: "6px", background: "rgba(198,173,138,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct > 90 ? "#f87171" : pct > 70 ? "#C6AD8A" : "#3F6F6A", borderRadius: "3px", transition: "width 0.5s" }} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateBudgetModal
          period={period}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateBudgetModal({ period, onClose, onSuccess }: { period: string; onClose: () => void; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", amount: "", period });
  const [error, setError] = useState("");
  const CATEGORIES = ["Operasional", "SDM", "Marketing", "Teknologi", "Event", "Lainnya"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.amount) { setError("Semua field wajib diisi"); return; }
    setSaving(true);
    try {
      await financeApi.createBudget(form);
      onSuccess();
    } catch (err: any) { setError(err.response?.data?.message || "Gagal"); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid rgba(198,173,138,0.25)", borderRadius: "6px", fontSize: "14px", outline: "none", color: "#1a1208", fontFamily: "inherit" as const, background: "#fff", boxSizing: "border-box" as const };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "420px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "linear-gradient(135deg,#1a1208,#C6AD8A)", padding: "20px 24px", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>Tambah Anggaran</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Nama Anggaran *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Kategori *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required style={{ ...inputStyle, appearance: "none" as const }}>
              <option value="">Pilih kategori</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Jumlah Anggaran (Rp) *</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required min="0" style={inputStyle} />
          </div>
          {error && <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", padding: "10px 14px" }}><p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p></div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid rgba(198,173,138,0.25)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "13px", cursor: "pointer" }}>Batal</button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: "12px", background: saving ? "#B8CDD2" : ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : "Simpan Anggaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}