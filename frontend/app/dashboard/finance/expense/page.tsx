"use client";
import { useEffect, useState, useCallback } from "react";
import { financeApi } from "@/lib/api";

const ACCENT = "#C6AD8A";
const EXPENSE_CATEGORIES = [
  "Jasa Legal Opinion", "Jasa Legal Drafting", "Jasa Legal Review",
  "Event", "Donasi", "Hibah", "Lainnya",
];

function formatRp(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

const STATUS_CONFIG = {
  COMPLETED: { label: "Selesai",     color: "#3F6F6A", bg: "rgba(63,111,106,0.1)"   },
  PENDING:   { label: "Pending",     color: "#C6AD8A", bg: "rgba(198,173,138,0.12)" },
  CANCELLED: { label: "Dibatalkan",  color: "#f87171", bg: "rgba(248,113,113,0.08)" },
} as const;

export default function expensePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [total, setTotal]               = useState(0);
  const [totalPages, setTotalPages]     = useState(1);
  const [page, setPage]                 = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCat, setFilterCat]       = useState("");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [search, setSearch]             = useState("");
  const [showAdd, setShowAdd]           = useState(false);
  const [selected, setSelected]         = useState<any | null>(null);
  const [totalAmount, setTotalAmount]   = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    financeApi.transactions({ type: "EXPENSE", status: filterStatus || undefined, category: filterCat || undefined, search: search || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, page, limit: 15 })
      .then(r => {
        setTransactions(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
        // Hitung total amount dari halaman ini
        const sum = (r.data.data || []).reduce((acc: number, tx: any) => acc + (tx.amount || 0), 0);
        setTotalAmount(sum);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterStatus, filterCat, search, dateFrom, dateTo, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterStatus, filterCat, search, dateFrom, dateTo]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus transaksi ini?")) return;
    try {
      await financeApi.deleteTransaction(id);
      load();
    } catch { alert("Gagal menghapus"); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      await financeApi.updateTransaction(id, fd);
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Keuangan</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#1a1208", marginBottom: "4px" }}>
            Pemasukan
          </h1>
          <p style={{ fontSize: "13px", color: "#7A9AA5" }}>
            {total} transaksi · Total halaman ini: <strong style={{ color: "#3F6F6A" }}>{formatRp(totalAmount)}</strong>
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ padding: "10px 20px", background: "#3F6F6A", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
          + Catat Pemasukan
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", overflow: "hidden", flex: 1, minWidth: "200px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari deskripsi atau referensi..."
            style={{ flex: 1, padding: "9px 12px", fontSize: "13px", border: "none", outline: "none", color: "#1a1208", fontFamily: "inherit" }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ padding: "0 10px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer" }}>×</button>
          )}
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ padding: "9px 12px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", fontSize: "13px", color: "#1a1208", outline: "none", background: "#fff" }}>
          <option value="">Semua Kategori</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "9px 12px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", fontSize: "13px", color: "#1a1208", outline: "none", background: "#fff" }}>
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([s, c]) => <option key={s} value={s}>{c.label}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          style={{ padding: "9px 12px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", fontSize: "13px", color: "#1a1208", outline: "none", background: "#fff" }} />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          style={{ padding: "9px 12px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", fontSize: "13px", color: "#1a1208", outline: "none", background: "#fff" }} />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(198,173,138,0.15)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px" }}>Memuat...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>
              Belum ada pemasukan
            </p>
            <button onClick={() => setShowAdd(true)}
              style={{ padding: "10px 22px", background: "#3F6F6A", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
              + Catat Pertama
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 120px 100px 140px", borderBottom: "1px solid rgba(198,173,138,0.1)", padding: "11px 20px", background: "rgba(198,173,138,0.04)" }}>
              {["Deskripsi", "Kategori", "Jumlah", "Tanggal", "Status", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {transactions.map(tx => {
              const sc = STATUS_CONFIG[tx.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.COMPLETED;
              return (
                <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 120px 100px 140px", padding: "14px 20px", borderBottom: "1px solid rgba(198,173,138,0.06)", alignItems: "center" }}>
                  <div style={{ paddingRight: "12px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.description}</p>
                    {tx.reference && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>Ref: {tx.reference}</p>}
                  </div>
                  <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{tx.category}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#3F6F6A" }}>{formatRp(tx.amount)}</p>
                  <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                    {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <select value={tx.status}
                    onChange={e => handleUpdateStatus(tx.id, e.target.value)}
                    style={{ fontSize: "11px", fontWeight: 500, padding: "4px 6px", borderRadius: "4px", border: "none", background: sc.bg, color: sc.color, cursor: "pointer", outline: "none" }}>
                    {Object.entries(STATUS_CONFIG).map(([s, c]) => (
                      <option key={s} value={s}>{c.label}</option>
                    ))}
                  </select>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setSelected(tx)}
                      style={{ fontSize: "11px", color: ACCENT, border: `1px solid ${ACCENT}30`, borderRadius: "4px", padding: "4px 10px", background: "none", cursor: "pointer" }}>
                      Detail
                    </button>
                    <button onClick={() => handleDelete(tx.id)}
                      style={{ fontSize: "11px", color: "#f87171", background: "none", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 14px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "4px", background: "transparent", color: "#1a1208", cursor: page === 1 ? "not-allowed" : "pointer" }}>←</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: "36px", height: "36px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "4px", background: page === p ? ACCENT : "transparent", color: page === p ? "#fff" : "#1a1208", cursor: "pointer", fontSize: "13px" }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 14px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "4px", background: "transparent", color: "#1a1208", cursor: page === totalPages ? "not-allowed" : "pointer" }}>→</button>
        </div>
      )}

      {/* Add Transaction Modal — reuse dari dashboard */}
      {showAdd && (
        <QuickAddModal
          defaultType="EXPENSE"
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); load(); }}
        />
      )}

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "linear-gradient(135deg,#1a1208,#3F6F6A)", padding: "20px 24px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: "2px" }}>PEMASUKAN</p>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#fff" }}>{formatRp(selected.amount)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Deskripsi", val: selected.description },
                { label: "Kategori", val: selected.category },
                { label: "Tanggal", val: new Date(selected.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Status", val: STATUS_CONFIG[selected.status as keyof typeof STATUS_CONFIG]?.label },
                { label: "Referensi", val: selected.reference },
                { label: "Catatan", val: selected.notes },
                { label: "Dicatat oleh", val: selected.createdBy?.name },
              ].filter(i => i.val).map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(198,173,138,0.08)", paddingBottom: "8px" }}>
                  <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{item.label}</p>
                  <p style={{ fontSize: "13px", color: "#1a1208", fontWeight: 500 }}>{item.val}</p>
                </div>
              ))}
              {selected.attachment && (
                <a href={selected.attachment} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "rgba(198,173,138,0.06)", border: "1px solid rgba(198,173,138,0.15)", borderRadius: "6px", textDecoration: "none", color: ACCENT, fontSize: "13px" }}>
                  📎 Lihat Bukti Pembayaran
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared quick add modal
function QuickAddModal({ defaultType, onClose, onSuccess }: {
  defaultType: "EXPENSE" | "INCOME";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const EXPENSE_CATS = ["Operasional", "SDM", "Marketing", "Teknologi", "Event", "Transport", "ATK", "Lainnya"];
  const INCOME_CATS = ["Jasa Legal Opinion", "Jasa Legal Drafting", "Jasa Legal Review", "Event", "Donasi", "Hibah", "Lainnya"];
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ type: defaultType, category: "", amount: "", description: "", date: new Date().toISOString().substring(0, 10), status: "COMPLETED", reference: "", notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.description) { setError("Kategori, jumlah, dan deskripsi wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await financeApi.createTransaction(fd);
      onSuccess();
    } catch (err: any) { setError(err.response?.data?.message || "Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const categories = form.type === "EXPENSE" ? EXPENSE_CATS : EXPENSE_CATS;
  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid rgba(198,173,138,0.25)", borderRadius: "6px", fontSize: "14px", outline: "none", color: "#1a1208", fontFamily: "inherit" as const, background: "#fff", boxSizing: "border-box" as const };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ background: `linear-gradient(135deg,#1a1208,${form.type === "EXPENSE" ? "#3F6F6A" : "#f87171"})`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>
            Catat {form.type === "EXPENSE" ? "Pemasukan" : "Pengeluaran"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Kategori *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required style={{ ...inputStyle, appearance: "none" as const }}>
                <option value="">Pilih...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Jumlah (Rp) *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" required min="0" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Deskripsi *</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Tanggal *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required style={{ ...inputStyle, fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, appearance: "none" as const }}>
                <option value="COMPLETED">Selesai</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>No. Referensi (opsional)</label>
            <input value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="INV-001..." style={inputStyle} />
          </div>
          {form.amount && (
            <div style={{ background: `rgba(${form.type === "EXPENSE" ? "63,111,106" : "248,113,113"},0.06)`, border: `1px solid rgba(${form.type === "EXPENSE" ? "63,111,106" : "248,113,113"},0.15)`, borderRadius: "6px", padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#7A9AA5" }}>Preview:</span>
              <span style={{ fontSize: "16px", fontWeight: 500, color: form.type === "EXPENSE" ? "#3F6F6A" : "#f87171", fontFamily: "Georgia,serif" }}>
                {form.type === "EXPENSE" ? "+" : "-"}Rp {parseFloat(form.amount || "0").toLocaleString("id-ID")}
              </span>
            </div>
          )}
          {error && <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", padding: "10px 14px" }}><p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p></div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid rgba(198,173,138,0.25)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "13px", cursor: "pointer" }}>Batal</button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: "12px", background: saving ? "#B8CDD2" : (form.type === "EXPENSE" ? "#3F6F6A" : "#f87171"), color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}