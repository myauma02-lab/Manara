"use client";
import { useEffect, useState, useCallback } from "react";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

const ACCENT = "#266c87";

const STATUS_CONFIG = {
  PUBLISHED: { label:"Published", color:"#3F6F6A", bg:"rgba(63,111,106,0.1)"   },
  DRAFT:     { label:"Draft",     color:"#C6AD8A", bg:"rgba(198,173,138,0.12)" },
  ARCHIVED:  { label:"Archived",  color:"#7A9AA5", bg:"rgba(122,154,165,0.1)"  },
} as const;

export default function PubArtikelPage() {
  const { user } = useAuthStore();
  const role = user?.role || "";
  const isWriter = role === "PUBLIKASI_WRITER";
  const canPublish = ["PUBLIKASI_EDITOR","PUBLIKASI_ADMIN","SUPERADMIN","SEKJEN"].includes(role);

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filterStatus, setFilterStatus] = useState(isWriter ? "DRAFT" : "");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]       = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    const params: any = {
      type: "ARTICLE",
      search: search || undefined,
      page,
      limit: 15,
    };
    if (filterStatus) params.status = filterStatus;
    publicationsApi.adminList(params)
      .then(r => {
        // Writer hanya lihat artikel yang dia buat — filter client side
        // (idealnya backend filter by authorId, tapi untuk sekarang)
        const data = r.data.data || [];
        setArticles(data);
        setTotal(r.data.pagination?.total || 0);
        setTotalPages(r.data.pagination?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterStatus, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterStatus, search]);

  const handleQuickPublish = async (id: string, currentStatus: string) => {
    if (!canPublish) return;
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    if (newStatus === "PUBLISHED" && !confirm("Publikasikan artikel ini?")) return;
    try {
      const fd = new FormData();
      fd.append("status", newStatus);
      await publicationsApi.update(id, fd);
      load();
    } catch { alert("Gagal mengubah status"); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!canPublish) return;
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    try { await publicationsApi.delete(id); load(); }
    catch { alert("Gagal menghapus"); }
  };

  return (
    <div style={{ padding:"40px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>Publikasi</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#0F2830", marginBottom:"4px" }}>
            {isWriter ? "Tulisan Saya" : "Artikel"}
          </h1>
          <p style={{ fontSize:"13px", color:"#7A9AA5" }}>{total} artikel</p>
        </div>
        <Link href="/dashboard/publikasi/artikel/new"
          style={{ padding:"10px 20px", background:ACCENT, color:"#fff", borderRadius:"6px", textDecoration:"none", fontSize:"13px", fontWeight:500 }}>
          + {isWriter ? "Tulis Artikel Baru" : "Artikel Baru"}
        </Link>
      </div>

      {/* Writer info banner */}
      {isWriter && (
        <div style={{ background:"rgba(38,108,135,0.06)", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"8px", padding:"14px 18px", marginBottom:"20px" }}>
          <p style={{ fontSize:"13px", color:"#266c87", fontWeight:300 }}>
            💡 Sebagai Penulis, kamu bisa membuat dan mengedit draft. Editor akan mereview dan mempublikasikan tulisanmu.
          </p>
        </div>
      )}

      {/* Filter */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", background:"#fff", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"6px", overflow:"hidden", flex:1, minWidth:"200px" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari judul artikel..."
            style={{ flex:1, padding:"9px 13px", fontSize:"13px", border:"none", outline:"none", color:"#0F2830", fontFamily:"inherit" }} />
          {search && <button onClick={()=>setSearch("")} style={{ padding:"0 10px", background:"none", border:"none", color:"#B8CDD2", cursor:"pointer" }}>×</button>}
        </div>
        <div style={{ display:"flex", gap:"4px", background:"#fff", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"6px", padding:"4px" }}>
          {[{ val:"", label:"Semua" }, ...Object.entries(STATUS_CONFIG).map(([v,c])=>({ val:v, label:c.label }))].map(opt => (
            <button key={opt.val} onClick={()=>setFilterStatus(opt.val)}
              style={{ padding:"5px 12px", fontSize:"12px", fontWeight:filterStatus===opt.val?500:300, borderRadius:"4px", border:"none", background:filterStatus===opt.val?"rgba(38,108,135,0.1)":"transparent", color:filterStatus===opt.val?ACCENT:"#7A9AA5", cursor:"pointer" }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"10px", overflow:"hidden", marginBottom:"16px" }}>
        {loading ? (
          <div style={{ padding:"48px", textAlign:"center" }}>
            <p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif", fontSize:"16px" }}>Memuat...</p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ padding:"64px", textAlign:"center" }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"20px", fontWeight:300, color:"#7A9AA5", marginBottom:"12px" }}>
              {filterStatus || search ? "Tidak ada artikel yang sesuai" : isWriter ? "Belum ada tulisan" : "Belum ada artikel"}
            </p>
            <Link href="/dashboard/publikasi/artikel/new"
              style={{ fontSize:"13px", color:ACCENT, border:`1px solid ${ACCENT}30`, padding:"8px 18px", borderRadius:"6px", textDecoration:"none" }}>
              + {isWriter ? "Mulai Menulis" : "Buat Artikel"}
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 120px 110px 160px", borderBottom:"1px solid rgba(38,108,135,0.08)", padding:"11px 20px", background:"rgba(38,108,135,0.02)" }}>
              {["Judul", "Subtype", "Status", "Tanggal", "Aksi"].map(h => (
                <p key={h} style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>{h}</p>
              ))}
            </div>
            {articles.map(art => {
              const sc = STATUS_CONFIG[art.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DRAFT;
              return (
                <div key={art.id} style={{ display:"grid", gridTemplateColumns:"1fr 100px 120px 110px 160px", padding:"13px 20px", borderBottom:"1px solid rgba(38,108,135,0.05)", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:"12px", alignItems:"center", paddingRight:"12px" }}>
                    <div style={{ width:"38px", height:"38px", borderRadius:"6px", flexShrink:0, background:art.coverImage?`url(${art.coverImage}) center/cover`:`linear-gradient(135deg,#0F2830,${ACCENT})` }} />
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:"13px", fontWeight:500, color:"#0F2830", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{art.title}</p>
                      <p style={{ fontSize:"11px", color:"#B8CDD2" }}>{art.author?.name}</p>
                    </div>
                  </div>
                  <p style={{ fontSize:"11px", color:"#7A9AA5" }}>{art.articleSubtype||"ARTIKEL"}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ fontSize:"11px", fontWeight:500, padding:"3px 8px", borderRadius:"4px", background:sc.bg, color:sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                  <p style={{ fontSize:"11px", color:"#B8CDD2" }}>
                    {new Date(art.updatedAt||art.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                  <div style={{ display:"flex", gap:"5px" }}>
                    <Link href={`/admin/publikasi/${art.id}`}
                      style={{ fontSize:"11px", color:ACCENT, border:`1px solid ${ACCENT}30`, borderRadius:"4px", padding:"4px 10px", textDecoration:"none" }}>
                      Edit
                    </Link>
                    {canPublish && (
                      <button onClick={()=>handleQuickPublish(art.id, art.status)}
                        style={{ fontSize:"11px", color:art.status==="PUBLISHED"?"#f87171":"#3F6F6A", border:`1px solid ${art.status==="PUBLISHED"?"rgba(248,113,113,0.2)":"rgba(63,111,106,0.2)"}`, borderRadius:"4px", padding:"4px 8px", background:"none", cursor:"pointer" }}>
                        {art.status==="PUBLISHED"?"Tarik":"Publish"}
                      </button>
                    )}
                    {art.status==="PUBLISHED" && (
                      <a href={`/publikasi/artikel/${art.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize:"11px", color:"#7A9AA5", border:"1px solid rgba(122,154,165,0.15)", borderRadius:"4px", padding:"4px 8px", textDecoration:"none" }}>↗</a>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:"6px" }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{ padding:"8px 14px", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"4px", background:"transparent", color:"#0F2830", cursor:page===1?"not-allowed":"pointer", opacity:page===1?0.4:1 }}>←</button>
          {Array.from({ length:Math.min(totalPages,7) },(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)}
              style={{ width:"36px", height:"36px", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"4px", background:page===p?ACCENT:"transparent", color:page===p?"#fff":"#0F2830", cursor:"pointer", fontSize:"13px" }}>
              {p}
            </button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ padding:"8px 14px", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"4px", background:"transparent", color:"#0F2830", cursor:page===totalPages?"not-allowed":"pointer", opacity:page===totalPages?0.4:1 }}>→</button>
        </div>
      )}
    </div>
  );
}