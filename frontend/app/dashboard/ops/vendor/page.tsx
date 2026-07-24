"use client";
import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";

const ACCENT = "#8A8F5E";

// Vendor disimpan di SiteSettings sebagai JSON
const VENDOR_KEY = "ops_vendors";

interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  notes: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

const CATEGORIES = ["Teknologi", "Desain", "Percetakan", "Katering", "Venue", "Konsultan", "Media", "Lainnya"];

export default function VendorPage() {
  const [vendors, setVendors]     = useState<Vendor[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected]   = useState<Vendor|null>(null);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [settingVersion, setSettingVersion] = useState<string|null>(null);

  const load = () => {
    setLoading(true);
    settingsApi.get(VENDOR_KEY)
      .then(r => {
        try { setVendors(JSON.parse(r.data.data || "[]")); }
        catch { setVendors([]); }
      })
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const saveVendors = async (list: Vendor[]) => {
    setSaving(true);
    try {
      await settingsApi.update(VENDOR_KEY, JSON.stringify(list));
      setVendors(list);
    } catch { alert("Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const handleCreate = async (v: Omit<Vendor,"id"|"createdAt">) => {
    const newVendor: Vendor = { ...v, id: Date.now().toString(), createdAt: new Date().toISOString() };
    await saveVendors([...vendors, newVendor]);
    setShowCreate(false);
  };

  const handleUpdate = async (id: string, updates: Partial<Vendor>) => {
    await saveVendors(vendors.map(v => v.id === id ? { ...v, ...updates } : v));
    setSelected(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus vendor ini?")) return;
    await saveVendors(vendors.filter(v => v.id !== id));
  };

  const filtered = vendors.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.contact.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || v.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ padding:"40px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>Operasional</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#141408", marginBottom:"4px" }}>Database Vendor & Mitra</h1>
          <p style={{ fontSize:"13px", color:"#7A9AA5" }}>{vendors.length} vendor terdaftar · {vendors.filter(v=>v.status==="ACTIVE").length} aktif</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ padding:"10px 20px", background:ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:500, cursor:"pointer" }}>
          + Tambah Vendor
        </button>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", background:"#fff", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"6px", overflow:"hidden", flex:1, minWidth:"200px" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama atau kontak..."
            style={{ flex:1, padding:"9px 13px", fontSize:"13px", border:"none", outline:"none", color:"#141408", fontFamily:"inherit" }} />
          {search && <button onClick={()=>setSearch("")} style={{ padding:"0 10px", background:"none", border:"none", color:"#B8CDD2", cursor:"pointer" }}>×</button>}
        </div>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
          style={{ padding:"9px 12px", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"6px", fontSize:"13px", color:"#141408", outline:"none", background:"#fff" }}>
          <option value="">Semua Kategori</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ padding:"48px", textAlign:"center" }}><p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif" }}>Memuat...</p></div>
      ) : filtered.length === 0 ? (
        <div style={{ background:"#fff", border:"1px solid rgba(138,143,94,0.12)", borderRadius:"10px", padding:"64px", textAlign:"center" }}>
          <p style={{ fontFamily:"Georgia,serif", fontSize:"20px", fontWeight:300, color:"#7A9AA5", marginBottom:"12px" }}>
            {search||filterCat ? "Tidak ada vendor yang sesuai" : "Belum ada vendor terdaftar"}
          </p>
          {!search && !filterCat && (
            <button onClick={()=>setShowCreate(true)} style={{ padding:"10px 22px", background:ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer" }}>
              + Tambah Pertama
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"14px" }}>
          {filtered.map(v => (
            <div key={v.id}
              style={{ background:"#fff", border:`1px solid ${v.status==="ACTIVE" ? "rgba(138,143,94,0.2)" : "rgba(122,154,165,0.12)"}`, borderRadius:"10px", padding:"20px", transition:"all 0.2s" }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=`${ACCENT}50`}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor=v.status==="ACTIVE"?"rgba(138,143,94,0.2)":"rgba(122,154,165,0.12)"}
            >
              {/* Top */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                <div>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:"17px", fontWeight:300, color:"#141408", marginBottom:"2px" }}>{v.name}</p>
                  <span style={{ fontSize:"10px", fontWeight:500, color:ACCENT, background:`${ACCENT}12`, padding:"2px 8px", borderRadius:"10px" }}>{v.category}</span>
                </div>
                <span style={{ fontSize:"10px", fontWeight:500, padding:"3px 8px", borderRadius:"4px", background:v.status==="ACTIVE"?"rgba(63,111,106,0.1)":"rgba(122,154,165,0.1)", color:v.status==="ACTIVE"?"#3F6F6A":"#7A9AA5" }}>
                  {v.status==="ACTIVE"?"Aktif":"Nonaktif"}
                </span>
              </div>

              {/* Contact info */}
              <div style={{ display:"flex", flexDirection:"column", gap:"4px", marginBottom:"12px" }}>
                {v.contact && <p style={{ fontSize:"12px", color:"#3A5560" }}>👤 {v.contact}</p>}
                {v.email && <p style={{ fontSize:"12px", color:"#7A9AA5" }}>✉ {v.email}</p>}
                {v.phone && <p style={{ fontSize:"12px", color:"#7A9AA5" }}>📱 {v.phone}</p>}
                {v.notes && <p style={{ fontSize:"11px", color:"#B8CDD2", fontStyle:"italic", marginTop:"4px" }}>{v.notes}</p>}
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:"8px", paddingTop:"10px", borderTop:"1px solid rgba(138,143,94,0.08)" }}>
                <button onClick={()=>setSelected(v)}
                  style={{ flex:1, padding:"7px", fontSize:"12px", color:ACCENT, border:`1px solid ${ACCENT}30`, borderRadius:"4px", background:"none", cursor:"pointer" }}>
                  Edit
                </button>
                {v.email && (
                  <a href={`mailto:${v.email}`}
                    style={{ flex:1, padding:"7px", fontSize:"12px", color:"#7A9AA5", border:"1px solid rgba(122,154,165,0.2)", borderRadius:"4px", textDecoration:"none", textAlign:"center" as const }}>
                    Email
                  </a>
                )}
                <button onClick={()=>handleDelete(v.id)}
                  style={{ padding:"7px 10px", fontSize:"12px", color:"#f87171", background:"none", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"4px", cursor:"pointer" }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <VendorFormModal title="Tambah Vendor" onClose={()=>setShowCreate(false)} onSave={handleCreate} />}
      {selected && <VendorFormModal title="Edit Vendor" initial={selected} onClose={()=>setSelected(null)} onSave={(d)=>handleUpdate(selected.id, d)} />}
    </div>
  );
}

function VendorFormModal({ title, initial, onClose, onSave }: {
  title: string;
  initial?: Partial<Vendor>;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name||"", category: initial?.category||"",
    contact: initial?.contact||"", email: initial?.email||"",
    phone: initial?.phone||"", notes: initial?.notes||"",
    status: initial?.status||"ACTIVE",
  });

  const ACCENT = "#8A8F5E";
  const inp = { width:"100%", padding:"10px 13px", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"6px", fontSize:"14px", outline:"none", color:"#141408", fontFamily:"inherit" as const, background:"#fff", boxSizing:"border-box" as const };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) return;
    setSaving(true);
    try { await onSave(form); }
    finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:"12px", width:"100%", maxWidth:"480px", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ background:`linear-gradient(135deg,#141408,${ACCENT})`, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"20px", fontWeight:300, color:"#fff" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:"22px", cursor:"pointer" }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding:"24px", display:"flex", flexDirection:"column", gap:"14px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Nama Vendor *</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required style={inp} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Kategori *</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} required style={{ ...inp, appearance:"none" as const }}>
                <option value="">Pilih...</option>
                {["Teknologi","Desain","Percetakan","Katering","Venue","Konsultan","Media","Lainnya"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Nama Kontak</label>
            <input value={form.contact} onChange={e=>setForm(f=>({...f,contact:e.target.value}))} placeholder="PIC atau nama kontak" style={inp} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Email</label>
              <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>WhatsApp</label>
              <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="08xx..." style={inp} />
            </div>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"5px" }}>Catatan</label>
            <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Layanan yang biasa digunakan, harga, dll..." rows={2} style={{ ...inp, resize:"none" as const }} />
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
            <input type="checkbox" checked={form.status==="ACTIVE"} onChange={e=>setForm(f=>({...f,status:e.target.checked?"ACTIVE":"INACTIVE"}))} style={{ width:"16px", height:"16px", accentColor:ACCENT }} />
            <span style={{ fontSize:"13px", color:"#3A5560" }}>Vendor aktif (masih bekerja sama)</span>
          </label>
          <div style={{ display:"flex", gap:"10px" }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:"12px", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"6px", background:"transparent", color:"#7A9AA5", fontSize:"13px", cursor:"pointer" }}>Batal</button>
            <button type="submit" disabled={saving} style={{ flex:2, padding:"12px", background:saving?"#B8CDD2":ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:500, cursor:saving?"not-allowed":"pointer" }}>
              {saving?"Menyimpan...":"Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}