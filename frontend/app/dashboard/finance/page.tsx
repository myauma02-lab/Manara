"use client";
import { useEffect, useState } from "react";
import { financeApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#C6AD8A";

function formatRp(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

const INCOME_CATEGORIES = [
  "Jasa Legal Opinion", "Jasa Legal Drafting", "Jasa Legal Review",
  "Event", "Donasi", "Hibah", "Lainnya",
];

const EXPENSE_CATEGORIES = [
  "Operasional", "SDM", "Marketing", "Teknologi", "Event",
  "Transport", "ATK", "Lainnya",
];

export default function FinanceDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTx, setShowAddTx] = useState(false);
  const [period, setPeriod] = useState(
    new Date().toISOString().substring(0, 7)
  );

  const load = () => {
    setLoading(true);
    Promise.all([
      financeApi.summary(period),
      financeApi.monthlyChart(new Date().getFullYear()),
      financeApi.transactions({ limit: 8 }),
    ])
      .then(([sumRes, chartRes, txRes]) => {
        setSummary(sumRes.data.data);
        setChart(chartRes.data.data || []);
        setRecentTx(txRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [period]);

  const maxChartVal = Math.max(...chart.map(m => Math.max(m.income, m.expense)), 1);
  const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#1a1208", marginBottom: "4px" }}>
            Keuangan Manara
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
            Kelola cashflow, pemasukan, dan pengeluaran
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="month"
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid rgba(198,173,138,0.3)", borderRadius: "6px", fontSize: "13px", color: "#1a1208", outline: "none" }}
          />
          <button
            onClick={() => setShowAddTx(true)}
            style={{ padding: "10px 20px", background: ACCENT, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
          >
            + Catat Transaksi
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }} className="stats-grid">
        {[
          {
            label: "Total Pemasukan",
            value: loading ? "..." : formatRp(summary?.totalIncome || 0),
            sub: `${summary?.incomeCount || 0} transaksi`,
            color: "#3F6F6A",
            bg: "rgba(63,111,106,0.06)",
            border: "rgba(63,111,106,0.15)",
            icon: "↑",
            href: "/dashboard/finance/income",
          },
          {
            label: "Total Pengeluaran",
            value: loading ? "..." : formatRp(summary?.totalExpense || 0),
            sub: `${summary?.expenseCount || 0} transaksi`,
            color: "#f87171",
            bg: "rgba(248,113,113,0.04)",
            border: "rgba(248,113,113,0.15)",
            icon: "↓",
            href: "/dashboard/finance/expense",
          },
          {
            label: "Cashflow",
            value: loading ? "..." : formatRp((summary?.totalIncome || 0) - (summary?.totalExpense || 0)),
            sub: "Saldo periode ini",
            color: ACCENT,
            bg: "rgba(198,173,138,0.06)",
            border: "rgba(198,173,138,0.2)",
            icon: "◎",
            href: "/dashboard/finance/report",
          },
          {
            label: "Pending",
            value: loading ? "..." : String(summary?.pendingCount || 0),
            sub: "Transaksi belum selesai",
            color: "#C6AD8A",
            bg: "rgba(198,173,138,0.06)",
            border: "rgba(198,173,138,0.15)",
            icon: "○",
            href: "/dashboard/finance/income?status=PENDING",
          },
        ].map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: "none" }}>
            <div style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: "10px", padding: "20px 22px", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#7A9AA5" }}>{card.label}</p>
                <span style={{ fontSize: "18px", color: card.color, opacity: 0.6 }}>{card.icon}</span>
              </div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 300, color: card.color, marginBottom: "4px", lineHeight: 1 }}>
                {card.value}
              </p>
              <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }} className="two-col-grid">

        {/* Chart */}
        <div style={{ background: "#fff", border: "1px solid rgba(198,173,138,0.12)", borderRadius: "10px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1208" }}>
              Arus Kas {new Date().getFullYear()}
            </p>
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#3F6F6A" }} />
                <span style={{ fontSize: "11px", color: "#7A9AA5" }}>Pemasukan</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#f87171" }} />
                <span style={{ fontSize: "11px", color: "#7A9AA5" }}>Pengeluaran</span>
              </div>
            </div>
          </div>

          {/* Bar chart sederhana */}
          <div style={{ display: "flex", gap: "6px", height: "160px", alignItems: "flex-end" }}>
            {chart.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <div style={{ width: "100%", display: "flex", gap: "2px", alignItems: "flex-end", height: "140px" }}>
                  <div style={{
                    flex: 1, background: "#3F6F6A",
                    height: `${(m.income / maxChartVal) * 100}%`,
                    borderRadius: "3px 3px 0 0", minHeight: "2px",
                    opacity: i + 1 === new Date().getMonth() + 1 ? 1 : 0.5,
                    transition: "height 0.3s",
                  }} title={`Pemasukan: ${formatRp(m.income)}`} />
                  <div style={{
                    flex: 1, background: "#f87171",
                    height: `${(m.expense / maxChartVal) * 100}%`,
                    borderRadius: "3px 3px 0 0", minHeight: "2px",
                    opacity: i + 1 === new Date().getMonth() + 1 ? 1 : 0.5,
                    transition: "height 0.3s",
                  }} title={`Pengeluaran: ${formatRp(m.expense)}`} />
                </div>
                <p style={{ fontSize: "9px", color: "#B8CDD2", textAlign: "center" }}>
                  {MONTHS[i]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div style={{ background: "#fff", border: "1px solid rgba(198,173,138,0.12)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(198,173,138,0.08)", background: "rgba(198,173,138,0.03)" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#1a1208" }}>Transaksi Terbaru</p>
            <Link href="/dashboard/finance/income" style={{ fontSize: "12px", color: ACCENT, textDecoration: "none" }}>Semua →</Link>
          </div>
          {recentTx.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#B8CDD2" }}>Belum ada transaksi</p>
            </div>
          ) : (
            <div>
              {recentTx.map(tx => (
                <div key={tx.id} style={{ display: "flex", gap: "12px", padding: "12px 20px", borderBottom: "1px solid rgba(198,173,138,0.06)", alignItems: "center" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: tx.type === "INCOME" ? "rgba(63,111,106,0.1)" : "rgba(248,113,113,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: "14px",
                    color: tx.type === "INCOME" ? "#3F6F6A" : "#f87171",
                  }}>
                    {tx.type === "INCOME" ? "↑" : "↓"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tx.description}
                    </p>
                    <p style={{ fontSize: "10px", color: "#B8CDD2" }}>{tx.category}</p>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: tx.type === "INCOME" ? "#3F6F6A" : "#f87171", flexShrink: 0 }}>
                    {tx.type === "INCOME" ? "+" : "-"}{formatRp(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Transaction */}
      {showAddTx && (
        <AddTransactionModal
          onClose={() => setShowAddTx(false)}
          onSuccess={() => { setShowAddTx(false); load(); }}
        />
      )}

      <style>{`
        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Modal Tambah Transaksi ──────────────────────────────
function AddTransactionModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "INCOME",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().substring(0, 10),
    status: "COMPLETED",
    reference: "",
    notes: "",
  });

  const INCOME_CATEGORIES = ["Jasa Legal Opinion", "Jasa Legal Drafting", "Jasa Legal Review", "Event", "Donasi", "Hibah", "Lainnya"];
  const EXPENSE_CATEGORIES = ["Operasional", "SDM", "Marketing", "Teknologi", "Event", "Transport", "ATK", "Lainnya"];
  const categories = form.type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.description) {
      setError("Kategori, jumlah, dan deskripsi wajib diisi"); return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await financeApi.createTransaction(fd);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan transaksi");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(198,173,138,0.25)", borderRadius: "6px",
    fontSize: "14px", outline: "none", color: "#1a1208",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "520px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1a1208,#C6AD8A)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
              Finance
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>
              Catat Transaksi
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Tipe */}
          <div style={{ display: "flex", gap: "0", background: "#F8F6F0", borderRadius: "8px", overflow: "hidden" }}>
            {[{ val: "INCOME", label: "↑ Pemasukan" }, { val: "EXPENSE", label: "↓ Pengeluaran" }].map(t => (
              <button key={t.val} type="button"
                onClick={() => setForm(f => ({ ...f, type: t.val, category: "" }))}
                style={{
                  flex: 1, padding: "11px", fontSize: "13px", fontWeight: 500,
                  border: "none", cursor: "pointer", transition: "all 0.2s",
                  background: form.type === t.val ? (t.val === "INCOME" ? "#3F6F6A" : "#f87171") : "transparent",
                  color: form.type === t.val ? "#fff" : "#7A9AA5",
                  borderRadius: form.type === t.val ? "6px" : "0",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                Kategori *
              </label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                required style={{ ...inputStyle, appearance: "none" }}>
                <option value="">Pilih kategori</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                Jumlah (Rp) *
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0"
                required
                min="0"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
              Deskripsi *
            </label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Keterangan transaksi..." required style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                Tanggal *
              </label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                Status
              </label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                style={{ ...inputStyle, appearance: "none" }}>
                <option value="COMPLETED">Selesai</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
              No. Referensi / Invoice (opsional)
            </label>
            <input value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
              placeholder="INV-001, REF-2025-07..." style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
              <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
            </div>
          )}

          {/* Preview jumlah */}
          {form.amount && (
            <div style={{ background: "rgba(198,173,138,0.06)", border: "1px solid rgba(198,173,138,0.15)", borderRadius: "6px", padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#7A9AA5" }}>Total:</span>
              <span style={{ fontSize: "16px", fontWeight: 500, color: form.type === "INCOME" ? "#3F6F6A" : "#f87171", fontFamily: "Georgia,serif" }}>
                {form.type === "INCOME" ? "+" : "-"}Rp {parseFloat(form.amount || "0").toLocaleString("id-ID")}
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "12px", border: "1px solid rgba(198,173,138,0.25)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "13px", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 2, padding: "12px", background: saving ? "#B8CDD2" : "#C6AD8A", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}