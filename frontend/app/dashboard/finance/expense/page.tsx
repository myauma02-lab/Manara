"use client";
import { useEffect, useState, useCallback } from "react";
import { financeApi } from "@/lib/api";

const EXPENSE_CATEGORIES = [
  "Operasional", "SDM", "Marketing", "Teknologi",
  "Event", "Transport", "ATK", "Lainnya",
];

const STATUS_CONFIG = {
  COMPLETED: { label: "Selesai",    color: "#3F6F6A", bg: "rgba(63,111,106,0.1)"    },
  PENDING:   { label: "Pending",    color: "#C6AD8A", bg: "rgba(198,173,138,0.12)"  },
  CANCELLED: { label: "Dibatalkan", color: "#f87171", bg: "rgba(248,113,113,0.08)"  },
} as const;

function formatRp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function ExpensePage() {
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
  const [pageTotal, setPageTotal]       = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    financeApi.transactions({
      type: "EXPENSE",
      status: filterStatus || undefined,
      category: filterCat || undefined,
      search: search || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      limit: 15,
    })
      .then(r => {
        const data = r.data.data || [];
        setTransactions(data);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
        setPageTotal(data.reduce((s: number, tx: any) => s + (tx.amount || 0), 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterStatus, filterCat, search, dateFrom, dateTo, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterStatus, filterCat, search, dateFrom, dateTo]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus transaksi ini?")) return;
    try { await financeApi.deleteTransaction(id); load(); }
    catch { alert("Gagal menghapus"); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      await financeApi.updateTransaction(id, fd);
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  const inputStyle = {
    padding: "9px 12px", border: "1px solid rgba(198,173,138,0.2)",
    borderRadius: "6px", fontSize: "13px", color: "#1a1208",
    outline: "none", background: "#fff",
  } as const;

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Keuangan</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#1a1208", marginBottom: "4px" }}>Pengeluaran</h1>
          <p style={{ fontSize: "13px", color: "#7A9AA5" }}>
            {total} transaksi · Halaman ini: <strong style={{ color: "#f87171" }}>{formatRp(pageTotal)}</strong>
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ padding: "10px 20px", background: "#f87171", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
          + Catat Pengeluaran
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "6px", overflow: "hidden", flex: 1, minWidth: "200px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari deskripsi atau referensi..."
            style={{ ...inputStyle, flex: 1, border: "none" }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ padding: "0 10px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer" }}>×</button>
          )}
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={inputStyle}>
          <option value="">Semua Kategori</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([s, c]) => <option key={s} value={s}>{c.label}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
        {(filterStatus || filterCat || dateFrom || dateTo || search) && (
          <button onClick={() => { setFilterStatus(""); setFilterCat(""); setDateFrom(""); setDateTo(""); setSearch(""); }}
            style={{ ...inputStyle, cursor: "pointer", color: "#f87171" }}>
            Reset ×
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(248,113,113,0.12)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px" }}>Memuat...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "12px" }}>Belum ada pengeluaran</p>
            <button onClick={() => setShowAdd(true)}
              style={{ padding: "10px 22px", background: "#f87171", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
              + Catat Pertama
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 110px 150px", borderBottom: "1px solid rgba(248,113,113,0.08)", padding: "11px 20px", background: "rgba(248,113,113,0.03)" }}>
              {["Deskripsi", "Kategori", "Jumlah", "Tanggal", "Status", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {transactions.map(tx => {
              const sc = STATUS_CONFIG[tx.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.COMPLETED;
              return (
                <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 110px 150px", padding: "14px 20px", borderBottom: "1px solid rgba(248,113,113,0.04)", alignItems: "center" }}>
                  <div style={{ paddingRight: "12px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.description}</p>
                    {tx.reference && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>Ref: {tx.reference}</p>}
                    {tx.notes && <p style={{ fontSize: "11px", color: "#7A9AA5", fontStyle: "italic" }}>{tx.notes}</p>}
                  </div>
                  <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{tx.category}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#f87171" }}>-{formatRp(tx.amount)}</p>
                  <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                    {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <select value={tx.status} onChange={e => handleStatusChange(tx.id, e.target.value)}
                    style={{ fontSize: "11px", fontWeight: 500, padding: "4px 6px", borderRadius: "4px", border: "none", background: sc.bg, color: sc.color, cursor: "pointer", outline: "none" }}>
                    {Object.entries(STATUS_CONFIG).map(([s, c]) => <option key={s} value={s}>{c.label}</option>)}
                  </select>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setSelected(tx)}
                      style={{ fontSize: "11px", color: "#C6AD8A", border: "1px solid rgba(198,173,138,0.3)", borderRadius: "4px", padding: "4px 10px", background: "none", cursor: "pointer" }}>
                      Detail
                    </button>
                    {tx.attachment && (
                      <a href={tx.attachment} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "11px", color: "#7A9AA5", border: "1px solid rgba(122,154,165,0.2)", borderRadius: "4px", padding: "4px 8px", textDecoration: "none" }}>
                        📎
                      </a>
                    )}
                    <button onClick={() => handleDelete(tx.id)}
                      style={{ fontSize: "11px", color: "#f87171", background: "none", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Footer total */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 110px 150px", padding: "12px 20px", background: "rgba(248,113,113,0.03)", borderTop: "2px solid rgba(248,113,113,0.1)" }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#7A9AA5" }}>Total halaman ini</p>
              <p />
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#f87171" }}>-{formatRp(pageTotal)}</p>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 14px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "4px", background: "transparent", color: "#1a1208", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>←</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: "36px", height: "36px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "4px", background: page === p ? "#C6AD8A" : "transparent", color: page === p ? "#fff" : "#1a1208", cursor: "pointer", fontSize: "13px" }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 14px", border: "1px solid rgba(198,173,138,0.2)", borderRadius: "4px", background: "transparent", color: "#1a1208", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>→</button>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); load(); }} />}

      {/* Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "linear-gradient(135deg,#1a1208,#f87171)", padding: "20px 24px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: "2px" }}>PENGELUARAN</p>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#fff" }}>-{formatRp(selected.amount)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Deskripsi",   val: selected.description },
                { label: "Kategori",    val: selected.category },
                { label: "Tanggal",     val: new Date(selected.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Status",      val: STATUS_CONFIG[selected.status as keyof typeof STATUS_CONFIG]?.label },
                { label: "Referensi",   val: selected.reference },
                { label: "Catatan",     val: selected.notes },
                { label: "Dicatat oleh", val: selected.createdBy?.name },
              ].filter(i => i.val).map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(198,173,138,0.08)", paddingBottom: "8px" }}>
                  <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{item.label}</p>
                  <p style={{ fontSize: "13px", color: "#1a1208", fontWeight: 500 }}>{item.val}</p>
                </div>
              ))}
              {selected.attachment && (
                <a href={selected.attachment} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "6px", textDecoration: "none", color: "#f87171", fontSize: "13px" }}>
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

function AddExpenseModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const EXPENSE_CATS = ["Operasional", "SDM", "Marketing", "Teknologi", "Event", "Transport", "ATK", "Lainnya"];
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [file, setFile]     = useState<File | null>(null);
  const [form, setForm]     = useState({
    category: "", amount: "", description: "",
    date: new Date().toISOString().substring(0, 10),
    status: "COMPLETED", reference: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.description) {
      setError("Kategori, jumlah, dan deskripsi wajib diisi"); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("type", "EXPENSE");
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (file) fd.append("attachment", file);
      await financeApi.createTransaction(fd);
      onSuccess();
    } catch (err: any) { setError(err.response?.data?.message || "Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", fontSize: "14px", outline: "none", color: "#1a1208", fontFamily: "inherit" as const, background: "#fff", boxSizing: "border-box" as const };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "linear-gradient(135deg,#1a1208,#f87171)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>Catat Pengeluaran</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Kategori *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required style={{ ...inputStyle, appearance: "none" as const }}>
                <option value="">Pilih...</option>
                {EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Jumlah (Rp) *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" required min="0" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Deskripsi *</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Untuk apa pengeluaran ini?" required style={inputStyle} />
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>No. Referensi</label>
              <input value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="INV-001..." style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>Catatan</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Keterangan tambahan" style={inputStyle} />
            </div>
          </div>
          {/* Upload bukti */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Bukti Pembayaran (opsional)</label>
            {file ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "6px" }}>
                <span>📎</span>
                <p style={{ flex: 1, fontSize: "13px", color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                <button type="button" onClick={() => setFile(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>×</button>
              </div>
            ) : (
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "64px", border: "2px dashed rgba(248,113,113,0.2)", borderRadius: "6px", cursor: "pointer", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>📎</span>
                <p style={{ fontSize: "13px", color: "#7A9AA5" }}>Upload bukti · JPG/PNG/PDF</p>
                <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
              </label>
            )}
          </div>
          {/* Preview */}
          {form.amount && (
            <div style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "6px", padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#7A9AA5" }}>Preview:</span>
              <span style={{ fontSize: "16px", fontWeight: 500, color: "#f87171", fontFamily: "Georgia,serif" }}>
                -Rp {parseFloat(form.amount || "0").toLocaleString("id-ID")}
              </span>
            </div>
          )}
          {error && <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", padding: "10px 14px" }}><p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p></div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "13px", cursor: "pointer" }}>Batal</button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: "12px", background: saving ? "#B8CDD2" : "#f87171", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : "Simpan Pengeluaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}