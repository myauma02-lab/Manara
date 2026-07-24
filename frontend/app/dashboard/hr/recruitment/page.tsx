"use client";
import { useEffect, useState } from "react";
import { recruitmentApi, waitlistApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#5F8F8A";

export default function HRRecruitmentPage() {
  const [batches, setBatches]     = useState<any[]>([]);
  const [waitlist, setWaitlist]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<"batches"|"waitlist">("batches");
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting]   = useState<string|null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([recruitmentApi.list(), waitlistApi.list()])
      .then(([bRes, wRes]) => {
        setBatches(bRes.data.data || []);
        setWaitlist(wRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (batch: any) => {
    try {
      await recruitmentApi.update(batch.id, { isActive: String(!batch.isActive) });
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus batch "${name}"? Semua lamaran akan ikut terhapus.`)) return;
    setDeleting(id);
    try { await recruitmentApi.delete(id); load(); }
    catch { alert("Gagal menghapus"); }
    finally { setDeleting(null); }
  };

  const handleDeleteWaitlist = async (id: string) => {
    if (!confirm("Hapus entri ini?")) return;
    try { await waitlistApi.delete(id); load(); }
    catch { alert("Gagal menghapus"); }
  };

  const exportWaitlistCSV = () => {
    const csv = [
      ["Nama","Email","WhatsApp","Minat","Sumber","Tanggal"].join(","),
      ...waitlist.map(e => [
        `"${e.name}"`, e.email, e.phone||"-",
        `"${e.interest||"-"}"`, e.source||"-",
        new Date(e.createdAt).toLocaleDateString("id-ID"),
      ].join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `waitlist-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const activeBatch = batches.find(b => b.isActive);

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>HR · Rekrutmen</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#0F2830", marginBottom:"4px" }}>
            Manajemen Rekrutmen
          </h1>
          <div style={{ display:"flex", gap:"12px" }}>
            {activeBatch ? (
              <span style={{ fontSize:"13px", color:"#4ade80", display:"flex", alignItems:"center", gap:"5px" }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#4ade80", display:"inline-block" }} />
                Aktif: {activeBatch.batchName}
              </span>
            ) : (
              <span style={{ fontSize:"13px", color:"#f59e0b" }}>⚠ Tidak ada batch aktif — mode waitlist</span>
            )}
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ padding:"10px 20px", background:ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:500, cursor:"pointer" }}>
          + Buat Batch Baru
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:"4px", borderBottom:"1px solid rgba(95,143,138,0.12)", marginBottom:"24px" }}>
        {[
          { key:"batches" as const, label:`Batch Rekrutmen (${batches.length})` },
          { key:"waitlist" as const, label:`Waitlist (${waitlist.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding:"10px 20px", fontSize:"13px", fontWeight:tab===t.key?500:300, color:tab===t.key?ACCENT:"#7A9AA5", background:"none", border:"none", borderBottom:`2px solid ${tab===t.key?ACCENT:"transparent"}`, cursor:"pointer", marginBottom:"-1px" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BATCHES TAB ── */}
      {tab === "batches" && (
        <div>
          {loading ? (
            <p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif" }}>Memuat...</p>
          ) : batches.length === 0 ? (
            <div style={{ background:"#fff", border:"1px solid rgba(95,143,138,0.12)", borderRadius:"10px", padding:"64px", textAlign:"center" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:"20px", fontWeight:300, color:"#7A9AA5", marginBottom:"12px" }}>
                Belum ada batch rekrutmen
              </p>
              <button onClick={() => setShowCreate(true)}
                style={{ padding:"10px 22px", background:ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer" }}>
                + Buat Batch Pertama
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {batches.map(batch => (
                <div key={batch.id}
                  style={{ background:"#fff", border:`1px solid ${batch.isActive ? `${ACCENT}40` : "rgba(95,143,138,0.12)"}`, borderRadius:"10px", overflow:"hidden" }}>
                  {/* Active indicator */}
                  <div style={{ height:"3px", background:batch.isActive?"#4ade80":"transparent" }} />
                  <div style={{ padding:"20px 24px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", flexWrap:"wrap" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"6px" }}>
                          <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:300, color:"#0F2830" }}>
                            {batch.batchName}
                          </h3>
                          {batch.isActive && (
                            <span style={{ fontSize:"10px", fontWeight:500, color:"#3F6F6A", background:"rgba(63,111,106,0.1)", padding:"2px 8px", borderRadius:"10px" }}>
                              AKTIF
                            </span>
                          )}
                        </div>
                        {batch.description && (
                          <p style={{ fontSize:"13px", fontWeight:300, color:"#7A9AA5", lineHeight:1.7, marginBottom:"10px" }}>
                            {batch.description}
                          </p>
                        )}
                        <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
                          <p style={{ fontSize:"12px", color:"#B8CDD2" }}>
                            📋 {batch._count?.applications || 0} lamaran
                          </p>
                          <p style={{ fontSize:"12px", color:"#B8CDD2" }}>
                            🎯 {batch.positions?.length || 0} posisi
                          </p>
                          {batch.startDate && (
                            <p style={{ fontSize:"12px", color:"#B8CDD2" }}>
                              📅 Mulai: {new Date(batch.startDate).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}
                            </p>
                          )}
                          {batch.endDate && (
                            <p style={{ fontSize:"12px", color: new Date(batch.endDate) < new Date() ? "#f87171" : "#B8CDD2" }}>
                              ⏰ Deadline: {new Date(batch.endDate).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}
                            </p>
                          )}
                        </div>

                        {/* Positions list */}
                        {batch.positions?.length > 0 && (
                          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginTop:"10px" }}>
                            {batch.positions.map((p: any) => (
                              <span key={p.id} style={{ fontSize:"11px", color:ACCENT, background:`${ACCENT}10`, border:`1px solid ${ACCENT}20`, padding:"2px 10px", borderRadius:"12px" }}>
                                {p.name}{p.slots ? ` (${p.slots} slot)` : ""}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
                        <Link href={`/dashboard/hr/applicants`}
                          style={{ padding:"8px 14px", border:`1px solid ${ACCENT}30`, borderRadius:"6px", color:ACCENT, textDecoration:"none", fontSize:"12px", fontWeight:500 }}>
                          Lihat Lamaran
                        </Link>
                        <button onClick={() => handleToggle(batch)}
                          style={{ padding:"8px 14px", fontSize:"12px", fontWeight:500, border:`1px solid ${batch.isActive ? "rgba(248,113,113,0.3)" : "rgba(63,111,106,0.3)"}`, borderRadius:"6px", background:"transparent", color:batch.isActive?"#f87171":"#3F6F6A", cursor:"pointer" }}>
                          {batch.isActive ? "Tutup" : "Buka"}
                        </button>
                        <button onClick={() => handleDelete(batch.id, batch.batchName)} disabled={deleting===batch.id}
                          style={{ padding:"8px 12px", fontSize:"12px", color:"#f87171", background:"none", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"6px", cursor:"pointer", opacity:deleting===batch.id?0.5:1 }}>
                          {deleting===batch.id ? "..." : "🗑"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── WAITLIST TAB ── */}
      {tab === "waitlist" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"14px" }}>
            <button onClick={exportWaitlistCSV}
              style={{ padding:"8px 16px", border:`1px solid ${ACCENT}30`, borderRadius:"6px", background:`${ACCENT}08`, color:ACCENT, fontSize:"12px", fontWeight:500, cursor:"pointer" }}>
              ↓ Export CSV
            </button>
          </div>

          {waitlist.length === 0 ? (
            <div style={{ background:"#fff", border:"1px solid rgba(95,143,138,0.12)", borderRadius:"10px", padding:"48px", textAlign:"center" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:300, color:"#7A9AA5" }}>
                Waitlist masih kosong
              </p>
            </div>
          ) : (
            <div style={{ background:"#fff", border:"1px solid rgba(95,143,138,0.12)", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 150px 140px 120px 80px", borderBottom:"1px solid rgba(95,143,138,0.08)", padding:"11px 20px", background:"rgba(95,143,138,0.03)" }}>
                {["Nama & Email","Minat","Sumber","Tanggal","Hapus"].map(h => (
                  <p key={h} style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>{h}</p>
                ))}
              </div>
              {waitlist.map(e => (
                <div key={e.id} style={{ display:"grid", gridTemplateColumns:"1fr 150px 140px 120px 80px", padding:"13px 20px", borderBottom:"1px solid rgba(95,143,138,0.05)", alignItems:"center" }}>
                  <div>
                    <p style={{ fontSize:"14px", fontWeight:500, color:"#0F2830" }}>{e.name}</p>
                    <p style={{ fontSize:"12px", color:"#7A9AA5" }}>{e.email}</p>
                    {e.phone && <p style={{ fontSize:"11px", color:"#B8CDD2" }}>{e.phone}</p>}
                  </div>
                  <p style={{ fontSize:"12px", color:"#7A9AA5" }}>{e.interest||"—"}</p>
                  <p style={{ fontSize:"12px", color:"#7A9AA5" }}>{e.source||"—"}</p>
                  <p style={{ fontSize:"11px", color:"#B8CDD2" }}>
                    {new Date(e.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                  <button onClick={() => handleDeleteWaitlist(e.id)}
                    style={{ fontSize:"12px", color:"#f87171", background:"none", border:"none", cursor:"pointer" }}>
                    Hapus
                  </button>
                </div>
              ))}
              <div style={{ padding:"12px 20px", background:"rgba(95,143,138,0.02)", borderTop:"1px solid rgba(95,143,138,0.06)" }}>
                <p style={{ fontSize:"12px", color:"#B8CDD2" }}>{waitlist.length} entri waitlist</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreate && (
        <CreateBatchModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateBatchModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [positions, setPositions] = useState([{ name:"", description:"", requirements:"", slots:"" }]);
  const [form, setForm] = useState({
    batchName:"", description:"",
    startDate:"", endDate:"",
    isActive: true,
  });

  const addPos   = () => setPositions(p => [...p, { name:"", description:"", requirements:"", slots:"" }]);
  const removePos = (i: number) => setPositions(p => p.filter((_,j) => j!==i));
  const updatePos = (i: number, field: string, val: string) =>
    setPositions(p => { const a=[...p]; a[i]={...a[i],[field]:val}; return a; });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchName.trim()) { setError("Nama batch wajib diisi"); return; }
    if (positions.some(p => !p.name.trim())) { setError("Semua posisi harus punya nama"); return; }
    setSaving(true); setError("");
    try {
      await recruitmentApi.create({
        batchName: form.batchName.trim(),
        description: form.description.trim() || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        isActive: String(form.isActive),
        positions: JSON.stringify(
          positions.filter(p => p.name.trim()).map(p => ({
            name: p.name.trim(),
            description: p.description.trim() || null,
            requirements: p.requirements ? p.requirements.split("\n").map(r=>r.trim()).filter(Boolean) : [],
            slots: p.slots ? parseInt(p.slots) : null,
          }))
        ),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat batch");
    } finally { setSaving(false); }
  };

  const inp = { width:"100%", padding:"10px 13px", border:"1px solid rgba(95,143,138,0.2)", borderRadius:"6px", fontSize:"14px", outline:"none", color:"#0F2830", fontFamily:"inherit" as const, background:"#fff", boxSizing:"border-box" as const };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 20px", backdropFilter:"blur(4px)", overflowY:"auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#F4F7F7", borderRadius:"12px", width:"100%", maxWidth:"640px", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ background:`linear-gradient(135deg,#0a1e1d,${ACCENT})`, padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"22px", fontWeight:300, color:"#EEF4F6" }}>Buat Batch Rekrutmen</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:"22px", cursor:"pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding:"28px", display:"flex", flexDirection:"column", gap:"18px" }}>
          {/* Batch info */}
          <div style={{ background:"#fff", border:"1px solid rgba(95,143,138,0.12)", borderRadius:"8px", padding:"20px", display:"flex", flexDirection:"column", gap:"14px" }}>
            <p style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>Info Batch</p>

            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Nama Batch *</label>
              <input value={form.batchName} onChange={e=>setForm(f=>({...f,batchName:e.target.value}))} placeholder="Manapeople Batch 1 — 2026" required style={inp} />
            </div>

            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Deskripsi</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Ceritakan tentang batch ini..." rows={2} style={{ ...inp, resize:"none" as const, lineHeight:1.7 }} />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Tanggal Mulai</label>
                <input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} style={{ ...inp, fontSize:"13px" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Deadline Daftar</label>
                <input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} style={{ ...inp, fontSize:"13px" }} />
              </div>
            </div>

            <label style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", padding:"12px 14px", background:form.isActive?"rgba(63,111,106,0.06)":"rgba(95,143,138,0.03)", border:`1px solid ${form.isActive?"rgba(63,111,106,0.2)":"rgba(95,143,138,0.12)"}`, borderRadius:"6px" }}>
              <div style={{ width:"40px", height:"22px", borderRadius:"11px", background:form.isActive?"#3F6F6A":"rgba(95,143,138,0.2)", position:"relative", transition:"background 0.2s", flexShrink:0 }} onClick={()=>setForm(f=>({...f,isActive:!f.isActive}))}>
                <div style={{ position:"absolute", top:"3px", left:form.isActive?"21px":"3px", width:"16px", height:"16px", borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }} />
              </div>
              <div>
                <p style={{ fontSize:"13px", fontWeight:500, color:"#0F2830" }}>{form.isActive?"Langsung Aktifkan":"Simpan sebagai Draft"}</p>
                <p style={{ fontSize:"11px", color:"#7A9AA5" }}>{form.isActive?"Form lamaran langsung tampil ke publik":"Batch tidak tampil dulu"}</p>
              </div>
            </label>
          </div>

          {/* Positions */}
          <div style={{ background:"#fff", border:"1px solid rgba(95,143,138,0.12)", borderRadius:"8px", padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
              <p style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>Posisi Tersedia ({positions.length})</p>
              <button type="button" onClick={addPos} style={{ fontSize:"12px", color:ACCENT, background:"none", border:`1px solid ${ACCENT}30`, borderRadius:"4px", padding:"5px 12px", cursor:"pointer" }}>+ Tambah</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {positions.map((pos, i) => (
                <div key={i} style={{ background:"rgba(95,143,138,0.03)", border:"1px solid rgba(95,143,138,0.1)", borderRadius:"6px", padding:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px" }}>
                    <p style={{ fontSize:"11px", fontWeight:500, color:ACCENT }}>Posisi #{i+1}</p>
                    {positions.length > 1 && (
                      <button type="button" onClick={()=>removePos(i)} style={{ background:"none", border:"none", color:"#f87171", cursor:"pointer", fontSize:"12px" }}>Hapus</button>
                    )}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:"8px", marginBottom:"8px" }}>
                    <div>
                      <label style={{ display:"block", fontSize:"10px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"4px" }}>Nama Posisi *</label>
                      <input value={pos.name} onChange={e=>updatePos(i,"name",e.target.value)} placeholder="Penulis, Analis, Desainer..." required style={{ ...inp, padding:"8px 11px" }} />
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:"10px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"4px" }}>Slot</label>
                      <input type="number" value={pos.slots} onChange={e=>updatePos(i,"slots",e.target.value)} placeholder="∞" style={{ ...inp, padding:"8px 10px", textAlign:"center" as const }} />
                    </div>
                  </div>
                  <div style={{ marginBottom:"8px" }}>
                    <label style={{ display:"block", fontSize:"10px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"4px" }}>Deskripsi</label>
                    <input value={pos.description} onChange={e=>updatePos(i,"description",e.target.value)} placeholder="Tugas dan tanggung jawab..." style={{ ...inp, padding:"8px 11px" }} />
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:"10px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"4px" }}>Kualifikasi (satu per baris)</label>
                    <textarea value={pos.requirements} onChange={e=>updatePos(i,"requirements",e.target.value)} placeholder={"Mahasiswa/alumni S1\nMinat di bidang riset"} rows={2} style={{ ...inp, resize:"none" as const, padding:"8px 11px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"6px", padding:"10px 14px" }}><p style={{ fontSize:"13px", color:"#f87171" }}>{error}</p></div>}

          <div style={{ display:"flex", gap:"10px" }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:"13px", border:"1px solid rgba(95,143,138,0.2)", borderRadius:"6px", background:"transparent", color:"#7A9AA5", fontSize:"13px", cursor:"pointer" }}>Batal</button>
            <button type="submit" disabled={saving} style={{ flex:2, padding:"13px", background:saving?"#B8CDD2":ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:500, cursor:saving?"not-allowed":"pointer" }}>
              {saving?"Membuat...":form.isActive?"Buat & Aktifkan →":"Simpan Batch →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}