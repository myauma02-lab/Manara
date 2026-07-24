"use client";
import { useEffect, useState } from "react";
import { newsletterApi } from "@/lib/api";

const ACCENT = "#266c87";

export default function PubNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");

  useEffect(() => {
    newsletterApi.subscribers()
      .then(r => setSubscribers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter(s =>
    !search ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const thisMonth = subscribers.filter(s => {
    const d = new Date(s.createdAt);
    const n = new Date();
    return d.getMonth()===n.getMonth() && d.getFullYear()===n.getFullYear();
  }).length;

  const exportCSV = () => {
    const csv = [
      ["Nama","Email","Tanggal Daftar"].join(","),
      ...subscribers.map(s => [`"${s.name||""}"`, s.email, new Date(s.createdAt).toLocaleDateString("id-ID")].join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div style={{ padding:"40px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>Publikasi</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#0F2830", marginBottom:"4px" }}>Newsletter</h1>
          <p style={{ fontSize:"13px", color:"#7A9AA5" }}>{subscribers.length} total subscriber</p>
        </div>
        <button onClick={exportCSV} style={{ padding:"9px 18px", border:`1px solid ${ACCENT}30`, borderRadius:"6px", background:`${ACCENT}08`, color:ACCENT, fontSize:"12px", fontWeight:500, cursor:"pointer" }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px", maxWidth:"400px" }}>
        {[
          { label:"Total Subscriber", val:subscribers.length, color:ACCENT },
          { label:"Bulan Ini", val:thisMonth, color:"#3F6F6A" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", border:`1px solid ${s.color}20`, borderRadius:"8px", padding:"16px 18px" }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:s.color, lineHeight:1, marginBottom:"4px" }}>{s.val}</p>
            <p style={{ fontSize:"11px", fontWeight:500, color:s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display:"flex", background:"#fff", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"6px", overflow:"hidden", maxWidth:"360px", marginBottom:"20px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari email atau nama..."
          style={{ flex:1, padding:"9px 13px", fontSize:"13px", border:"none", outline:"none", color:"#0F2830", fontFamily:"inherit" }} />
        {search && <button onClick={()=>setSearch("")} style={{ padding:"0 10px", background:"none", border:"none", color:"#B8CDD2", cursor:"pointer" }}>×</button>}
      </div>

      {/* Table */}
      <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"10px", overflow:"hidden" }}>
        {loading ? (
          <div style={{ padding:"48px", textAlign:"center" }}><p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif" }}>Memuat...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:"48px", textAlign:"center" }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:300, color:"#7A9AA5" }}>
              {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada subscriber"}
            </p>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 200px 140px", borderBottom:"1px solid rgba(38,108,135,0.08)", padding:"11px 20px", background:"rgba(38,108,135,0.02)" }}>
              {["Email & Nama","Tanggal Daftar","Status"].map(h => (
                <p key={h} style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {filtered.map(sub => (
              <div key={sub.id} style={{ display:"grid", gridTemplateColumns:"1fr 200px 140px", padding:"13px 20px", borderBottom:"1px solid rgba(38,108,135,0.05)", alignItems:"center" }}>
                <div>
                  <p style={{ fontSize:"14px", fontWeight:500, color:"#0F2830" }}>{sub.email}</p>
                  {sub.name && <p style={{ fontSize:"12px", color:"#7A9AA5" }}>{sub.name}</p>}
                </div>
                <p style={{ fontSize:"12px", color:"#7A9AA5" }}>
                  {new Date(sub.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}
                </p>
                <span style={{ fontSize:"11px", fontWeight:500, padding:"3px 10px", borderRadius:"4px", background:"rgba(63,111,106,0.1)", color:"#3F6F6A", display:"inline-block" }}>
                  Aktif
                </span>
              </div>
            ))}
            <div style={{ padding:"12px 20px", background:"rgba(38,108,135,0.02)", borderTop:"1px solid rgba(38,108,135,0.06)" }}>
              <p style={{ fontSize:"12px", color:"#B8CDD2" }}>Menampilkan {filtered.length} dari {subscribers.length} subscriber</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}