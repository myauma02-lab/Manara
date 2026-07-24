"use client";
import { useEffect, useState } from "react";
import { financeApi } from "@/lib/api";

const ACCENT = "#C6AD8A";

function formatRp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];

export default function FinanceReportPage() {
  const [year, setYear]       = useState(new Date().getFullYear());
  const [chart, setChart]     = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allTx, setAllTx]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      financeApi.monthlyChart(year),
      financeApi.categories(),
      financeApi.summary(),
      financeApi.transactions({ limit: 200 }),
    ])
      .then(([cRes, catRes, sumRes, txRes]) => {
        setChart(cRes.data.data || []);
        setCategories(catRes.data.data || []);
        setSummary(sumRes.data.data);
        setAllTx(txRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [year]);

  // Yearly totals
  const yearIncome  = chart.reduce((s, m) => s + m.income, 0);
  const yearExpense = chart.reduce((s, m) => s + m.expense, 0);
  const yearCashflow = yearIncome - yearExpense;

  // Top income categories
  const incomeBycat = categories.filter(c => c.type === "INCOME").sort((a,b) => (b._sum?.amount||0) - (a._sum?.amount||0)).slice(0,5);
  const expenseByCat = categories.filter(c => c.type === "EXPENSE").sort((a,b) => (b._sum?.amount||0) - (a._sum?.amount||0)).slice(0,5);

  // Best/worst month
  const bestMonth  = [...chart].sort((a,b) => (b.income-b.expense) - (a.income-a.expense))[0];
  const worstMonth = [...chart].sort((a,b) => (a.income-a.expense) - (b.income-b.expense))[0];

  const maxVal = Math.max(...chart.map(m => Math.max(m.income, m.expense)), 1);

  // Export CSV
  const exportCSV = () => {
    const rows = [
      ["Tanggal","Tipe","Kategori","Deskripsi","Jumlah","Status","Referensi"].join(","),
      ...allTx.map(tx => [
        new Date(tx.date).toLocaleDateString("id-ID"),
        tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
        tx.category,
        `"${tx.description}"`,
        tx.amount,
        tx.status,
        tx.reference || "-",
      ].join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows], { type:"text/csv" }));
    a.download = `laporan-keuangan-${year}.csv`;
    a.click();
  };

  // Fix variable name in exportCSV
  const exportCSVFixed = () => {
    const rows = [
      ["Tanggal","Tipe","Kategori","Deskripsi","Jumlah","Status","Referensi"].join(","),
      ...allTx.map(tx => [
        new Date(tx.date).toLocaleDateString("id-ID"),
        tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
        tx.category,
        `"${tx.description}"`,
        tx.amount,
        tx.status,
        tx.reference || "-",
      ].join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows], { type:"text/csv" }));
    a.download = `laporan-keuangan-${year}.csv`;
    a.click();
  };

  return (
    <div style={{ padding:"40px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"28px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>Keuangan</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#1a1208", marginBottom:"4px" }}>Laporan Keuangan</h1>
          <p style={{ fontSize:"13px", color:"#7A9AA5" }}>Ringkasan dan analisis keuangan Manara</p>
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <select value={year} onChange={e=>setYear(Number(e.target.value))}
            style={{ padding:"8px 12px", border:"1px solid rgba(198,173,138,0.3)", borderRadius:"6px", fontSize:"13px", color:"#1a1208", outline:"none", background:"#fff" }}>
            {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={exportCSVFixed}
            style={{ padding:"9px 18px", border:`1px solid ${ACCENT}30`, borderRadius:"6px", background:`${ACCENT}08`, color:ACCENT, fontSize:"12px", fontWeight:500, cursor:"pointer" }}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding:"64px", textAlign:"center" }}>
          <p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:300 }}>Memuat laporan...</p>
        </div>
      ) : (
        <>
          {/* Yearly summary */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"24px" }} className="report-grid">
            {[
              { label:`Total Pemasukan ${year}`, val:formatRp(yearIncome), color:"#3F6F6A", sub:`${chart.filter(m=>m.income>0).length} bulan aktif` },
              { label:`Total Pengeluaran ${year}`, val:formatRp(yearExpense), color:"#f87171", sub:`${chart.filter(m=>m.expense>0).length} bulan aktif` },
              { label:`Net Cashflow ${year}`, val:formatRp(yearCashflow), color:yearCashflow>=0?"#3F6F6A":"#f87171", sub:yearCashflow>=0?"Surplus ✓":"Defisit ⚠" },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", border:`1px solid ${s.color}20`, borderRadius:"10px", padding:"20px 24px" }}>
                <p style={{ fontSize:"12px", color:"#B8CDD2", marginBottom:"8px" }}>{s.label}</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(20px,2.5vw,28px)", fontWeight:300, color:s.color, lineHeight:1, marginBottom:"4px" }}>{s.val}</p>
                <p style={{ fontSize:"11px", color:"#B8CDD2" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Monthly chart */}
          <div style={{ background:"#fff", border:"1px solid rgba(198,173,138,0.15)", borderRadius:"10px", padding:"24px", marginBottom:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <p style={{ fontSize:"14px", fontWeight:500, color:"#1a1208" }}>Arus Kas Bulanan {year}</p>
              <div style={{ display:"flex", gap:"14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}><div style={{ width:"10px", height:"10px", borderRadius:"2px", background:"#3F6F6A" }} /><span style={{ fontSize:"11px", color:"#7A9AA5" }}>Pemasukan</span></div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}><div style={{ width:"10px", height:"10px", borderRadius:"2px", background:"#f87171" }} /><span style={{ fontSize:"11px", color:"#7A9AA5" }}>Pengeluaran</span></div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", height:"200px", alignItems:"flex-end" }}>
              {chart.map((m, i) => {
                const isCurrentMonth = i === new Date().getMonth() && year === new Date().getFullYear();
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
                    <div style={{ width:"100%", display:"flex", gap:"2px", alignItems:"flex-end", height:"170px" }}>
                      <div title={`Pemasukan: ${formatRp(m.income)}`}
                        style={{ flex:1, background:"#3F6F6A", height:`${(m.income/maxVal)*100}%`, borderRadius:"3px 3px 0 0", minHeight:m.income>0?"3px":"0", opacity:isCurrentMonth?1:0.6, transition:"height 0.5s" }} />
                      <div title={`Pengeluaran: ${formatRp(m.expense)}`}
                        style={{ flex:1, background:"#f87171", height:`${(m.expense/maxVal)*100}%`, borderRadius:"3px 3px 0 0", minHeight:m.expense>0?"3px":"0", opacity:isCurrentMonth?1:0.6, transition:"height 0.5s" }} />
                    </div>
                    <p style={{ fontSize:"9px", color:isCurrentMonth?ACCENT:"#B8CDD2", fontWeight:isCurrentMonth?600:400 }}>{MONTHS[i]}</p>
                    {/* Net indicator */}
                    <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:m.income>=m.expense?"#3F6F6A":"#f87171", opacity:0.6 }} />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }} className="two-col-grid">
            {/* Best/worst month */}
            <div style={{ background:"#fff", border:"1px solid rgba(198,173,138,0.15)", borderRadius:"10px", padding:"20px" }}>
              <p style={{ fontSize:"13px", fontWeight:500, color:"#1a1208", marginBottom:"14px" }}>Highlight Bulan</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {bestMonth && (
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", background:"rgba(63,111,106,0.06)", borderRadius:"6px" }}>
                    <div>
                      <p style={{ fontSize:"11px", color:"#B8CDD2", marginBottom:"2px" }}>Terbaik</p>
                      <p style={{ fontSize:"14px", fontWeight:500, color:"#3F6F6A" }}>{MONTHS[bestMonth.month-1]}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:"12px", color:"#3F6F6A" }}>+{formatRp(bestMonth.income-bestMonth.expense)}</p>
                    </div>
                  </div>
                )}
                {worstMonth && worstMonth !== bestMonth && (
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", background:"rgba(248,113,113,0.04)", borderRadius:"6px" }}>
                    <div>
                      <p style={{ fontSize:"11px", color:"#B8CDD2", marginBottom:"2px" }}>Perlu Perhatian</p>
                      <p style={{ fontSize:"14px", fontWeight:500, color:"#f87171" }}>{MONTHS[worstMonth.month-1]}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:"12px", color:"#f87171" }}>{formatRp(worstMonth.income-worstMonth.expense)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top categories */}
            <div style={{ background:"#fff", border:"1px solid rgba(198,173,138,0.15)", borderRadius:"10px", padding:"20px" }}>
              <p style={{ fontSize:"13px", fontWeight:500, color:"#1a1208", marginBottom:"14px" }}>Kategori Teratas</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {incomeBycat.slice(0,3).map((c, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#3F6F6A", opacity:1-i*0.25 }} />
                      <p style={{ fontSize:"12px", color:"#3A5560" }}>{c.category}</p>
                    </div>
                    <p style={{ fontSize:"12px", fontWeight:500, color:"#3F6F6A" }}>{formatRp(c._sum?.amount||0)}</p>
                  </div>
                ))}
                <div style={{ height:"1px", background:"rgba(198,173,138,0.1)", margin:"4px 0" }} />
                {expenseByCat.slice(0,3).map((c, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#f87171", opacity:1-i*0.25 }} />
                      <p style={{ fontSize:"12px", color:"#3A5560" }}>{c.category}</p>
                    </div>
                    <p style={{ fontSize:"12px", fontWeight:500, color:"#f87171" }}>{formatRp(c._sum?.amount||0)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly breakdown table */}
          <div style={{ background:"#fff", border:"1px solid rgba(198,173,138,0.15)", borderRadius:"10px", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(198,173,138,0.1)", background:"rgba(198,173,138,0.03)" }}>
              <p style={{ fontSize:"13px", fontWeight:500, color:"#1a1208" }}>Rincian Per Bulan {year}</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr 1fr", borderBottom:"1px solid rgba(198,173,138,0.08)", padding:"10px 20px", background:"rgba(198,173,138,0.02)" }}>
              {["Bulan","Pemasukan","Pengeluaran","Net"].map(h => (
                <p key={h} style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {chart.map((m, i) => {
              const net = m.income - m.expense;
              const isCurrentMonth = i === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr 1fr", padding:"12px 20px", borderBottom:"1px solid rgba(198,173,138,0.05)", background:isCurrentMonth?"rgba(198,173,138,0.03)":"transparent" }}>
                  <p style={{ fontSize:"13px", fontWeight:isCurrentMonth?500:300, color:isCurrentMonth?ACCENT:"#3A5560" }}>{MONTHS[i]}</p>
                  <p style={{ fontSize:"13px", color:"#3F6F6A", fontWeight:m.income>0?500:300 }}>{m.income>0?formatRp(m.income):"—"}</p>
                  <p style={{ fontSize:"13px", color:"#f87171", fontWeight:m.expense>0?500:300 }}>{m.expense>0?formatRp(m.expense):"—"}</p>
                  <p style={{ fontSize:"13px", fontWeight:500, color:net>0?"#3F6F6A":net<0?"#f87171":"#B8CDD2" }}>
                    {net>0?"+":""}{net!==0?formatRp(net):"—"}
                  </p>
                </div>
              );
            })}
            {/* Footer */}
            <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr 1fr", padding:"13px 20px", background:"rgba(198,173,138,0.06)", borderTop:"2px solid rgba(198,173,138,0.15)" }}>
              <p style={{ fontSize:"12px", fontWeight:600, color:"#1a1208" }}>TOTAL</p>
              <p style={{ fontSize:"13px", fontWeight:600, color:"#3F6F6A" }}>{formatRp(yearIncome)}</p>
              <p style={{ fontSize:"13px", fontWeight:600, color:"#f87171" }}>{formatRp(yearExpense)}</p>
              <p style={{ fontSize:"13px", fontWeight:600, color:yearCashflow>=0?"#3F6F6A":"#f87171" }}>
                {yearCashflow>0?"+":""}{formatRp(yearCashflow)}
              </p>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .report-grid { grid-template-columns: 1fr !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}