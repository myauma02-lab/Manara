"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

const ACCENT = "#8A8F5E";

const STATUS_CONFIG = {
  UPCOMING:  { label:"Akan Datang", color:"#266c87", bg:"rgba(38,108,135,0.1)"  },
  ACTIVE:    { label:"Aktif",       color:"#3F6F6A", bg:"rgba(63,111,106,0.12)" },
  COMPLETED: { label:"Selesai",     color:ACCENT,    bg:"rgba(138,143,94,0.12)" },
  ARCHIVED:  { label:"Arsip",       color:"#7A9AA5", bg:"rgba(122,154,165,0.08)"},
} as const;

export default function OpsProyekPage() {
  const searchParams = useSearchParams();
  const initStatus   = searchParams.get("status") || "";

  const [projects, setProjects]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilterStatus] = useState(initStatus);
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [deleting, setDeleting]     = useState<string|null>(null);

  const load = useCallback(() => {
    setLoading(true);
    projectsApi.adminList({
      status: filterStatus || undefined,
      search: search || undefined,
      page, limit: 12,
    })
      .then(r => {
        setProjects(r.data.data || []);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterStatus, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterStatus, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus proyek "${title}"?`)) return;
    setDeleting(id);
    try { await projectsApi.delete(id); load(); }
    catch { alert("Gagal menghapus"); }
    finally { setDeleting(null); }
  };

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      const fd = new FormData();
      fd.append("progress", String(progress));
      await projectsApi.update(id, fd);
      setProjects(prev => prev.map(p => p.id===id ? { ...p, progress } : p));
    } catch { alert("Gagal update progress"); }
  };

  return (
    <div style={{ padding:"40px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>Operasional</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#141408", marginBottom:"4px" }}>Kelola Proyek</h1>
          <p style={{ fontSize:"13px", color:"#7A9AA5" }}>{total} proyek total</p>
        </div>
        <Link href="/admin/project/new"
          style={{ padding:"10px 20px", background:ACCENT, color:"#fff", borderRadius:"6px", textDecoration:"none", fontSize:"13px", fontWeight:500 }}>
          + Proyek Baru
        </Link>
      </div>

      {/* Status filter pills */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
        <button onClick={()=>setFilterStatus("")}
          style={{ padding:"6px 14px", fontSize:"12px", fontWeight:500, border:`1px solid ${!filterStatus?ACCENT:"rgba(138,143,94,0.2)"}`, borderRadius:"20px", background:!filterStatus?`${ACCENT}15`:"transparent", color:!filterStatus?ACCENT:"#7A9AA5", cursor:"pointer" }}>
          Semua ({total})
        </button>
        {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG.ACTIVE][]).map(([s, cfg]) => (
          <button key={s} onClick={()=>setFilterStatus(filterStatus===s?"":s)}
            style={{ padding:"6px 14px", fontSize:"12px", fontWeight:500, border:`1px solid ${filterStatus===s?cfg.color:"rgba(138,143,94,0.15)"}`, borderRadius:"20px", background:filterStatus===s?cfg.bg:"transparent", color:filterStatus===s?cfg.color:"#7A9AA5", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ display:"flex", background:"#fff", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"6px", overflow:"hidden", maxWidth:"400px", marginBottom:"20px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari judul atau kategori..."
          style={{ flex:1, padding:"9px 13px", fontSize:"13px", border:"none", outline:"none", color:"#141408", fontFamily:"inherit" }} />
        {search && <button onClick={()=>setSearch("")} style={{ padding:"0 10px", background:"none", border:"none", color:"#B8CDD2", cursor:"pointer" }}>×</button>}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding:"48px", textAlign:"center" }}><p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif" }}>Memuat...</p></div>
      ) : projects.length === 0 ? (
        <div style={{ background:"#fff", border:"1px solid rgba(138,143,94,0.12)", borderRadius:"10px", padding:"64px", textAlign:"center" }}>
          <p style={{ fontFamily:"Georgia,serif", fontSize:"20px", fontWeight:300, color:"#7A9AA5", marginBottom:"12px" }}>
            {search||filterStatus ? "Tidak ada proyek yang sesuai" : "Belum ada proyek"}
          </p>
          {!search && !filterStatus && (
            <Link href="/admin/project/new" style={{ fontSize:"13px", color:ACCENT, border:`1px solid ${ACCENT}30`, padding:"8px 18px", borderRadius:"6px", textDecoration:"none" }}>
              + Buat Proyek Pertama
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"16px", marginBottom:"20px" }}>
          {projects.map(p => {
            const sc = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING;
            return (
              <div key={p.id} style={{ background:"#fff", border:"1px solid rgba(138,143,94,0.12)", borderRadius:"10px", overflow:"hidden" }}>
                {/* Cover */}
                <div style={{ aspectRatio:"16/9", background:p.coverImage?`url(${p.coverImage}) center/cover`:`linear-gradient(135deg,#141408,${ACCENT})`, position:"relative" }}>
                  <span style={{ position:"absolute", top:"10px", left:"10px", fontSize:"10px", fontWeight:500, padding:"3px 10px", borderRadius:"4px", background:sc.bg, color:sc.color }}>
                    {sc.label}
                  </span>
                  {p.progress > 0 && (
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:"rgba(0,0,0,0.2)" }}>
                      <div style={{ height:"100%", width:`${p.progress}%`, background:sc.color }} />
                    </div>
                  )}
                </div>

                <div style={{ padding:"16px" }}>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:"16px", fontWeight:300, color:"#141408", marginBottom:"4px" }}>{p.title}</p>
                  {p.category && <p style={{ fontSize:"11px", color:ACCENT, fontWeight:500, marginBottom:"8px" }}>{p.category}</p>}

                  {/* Progress slider */}
                  {p.status === "ACTIVE" && (
                    <div style={{ marginBottom:"10px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                        <p style={{ fontSize:"11px", color:"#B8CDD2" }}>Progress</p>
                        <p style={{ fontSize:"11px", fontWeight:500, color:ACCENT }}>{p.progress}%</p>
                      </div>
                      <input type="range" min="0" max="100" step="5" value={p.progress}
                        onChange={e=>handleProgressUpdate(p.id, parseInt(e.target.value))}
                        style={{ width:"100%", accentColor:ACCENT }} />
                    </div>
                  )}

                  {/* Dates */}
                  {p.startDate && (
                    <p style={{ fontSize:"11px", color:"#B8CDD2", marginBottom:"12px" }}>
                      {new Date(p.startDate).getFullYear()}{p.endDate?` — ${new Date(p.endDate).getFullYear()}`:""}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display:"flex", gap:"6px" }}>
                    <Link href={`/admin/project/${p.id}`}
                      style={{ flex:1, padding:"7px", fontSize:"12px", color:ACCENT, border:`1px solid ${ACCENT}30`, borderRadius:"4px", textDecoration:"none", textAlign:"center" as const }}>
                      Edit
                    </Link>
                    <a href={`/proyek/${p.slug}`} target="_blank" rel="noopener noreferrer"
                      style={{ padding:"7px 10px", fontSize:"12px", color:"#7A9AA5", border:"1px solid rgba(122,154,165,0.2)", borderRadius:"4px", textDecoration:"none" }}>
                      ↗
                    </a>
                    <button onClick={()=>handleDelete(p.id, p.title)} disabled={deleting===p.id}
                      style={{ padding:"7px 10px", fontSize:"12px", color:"#f87171", background:"none", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"4px", cursor:"pointer", opacity:deleting===p.id?0.5:1 }}>
                      {deleting===p.id?"...":"🗑"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:"6px" }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{ padding:"8px 14px", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"4px", background:"transparent", color:"#141408", cursor:page===1?"not-allowed":"pointer", opacity:page===1?0.4:1 }}>←</button>
          {Array.from({ length:Math.min(totalPages,7) },(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)}
              style={{ width:"36px", height:"36px", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"4px", background:page===p?ACCENT:"transparent", color:page===p?"#fff":"#141408", cursor:"pointer", fontSize:"13px" }}>
              {p}
            </button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ padding:"8px 14px", border:"1px solid rgba(138,143,94,0.2)", borderRadius:"4px", background:"transparent", color:"#141408", cursor:page===totalPages?"not-allowed":"pointer", opacity:page===totalPages?0.4:1 }}>→</button>
        </div>
      )}
    </div>
  );
}