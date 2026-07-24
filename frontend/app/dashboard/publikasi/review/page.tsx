"use client";
import { useEffect, useState } from "react";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ACCENT = "#266c87";

export default function ReviewPage() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const canPublish = ["PUBLIKASI_EDITOR","PUBLIKASI_ADMIN","SUPERADMIN","SEKJEN"].includes(user?.role||"");

  const [drafts, setDrafts]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [processing, setProcessing] = useState<string|null>(null);

  useEffect(() => {
    if (!canPublish) { router.replace("/dashboard/publikasi"); return; }
    load();
  }, []);

  const load = () => {
    setLoading(true);
    publicationsApi.adminList({ limit:50 })
      .then(r => setDrafts((r.data.data || []).filter((item: any) => item.status === "DRAFT")))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handlePublish = async (id: string, title: string) => {
    if (!confirm(`Publikasikan "${title}"?`)) return;
    setProcessing(id);
    try {
      const fd = new FormData();
      fd.append("status", "PUBLISHED");
      await publicationsApi.update(id, fd);
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch { alert("Gagal mempublikasikan"); }
    finally { setProcessing(null); }
  };

  const handleReject = async (id: string) => {
    const note = prompt("Catatan untuk penulis (wajib):");
    if (!note) return;
    setProcessing(id);
    try {
      const fd = new FormData();
      fd.append("status", "DRAFT");
      fd.append("reviewNote", note);
      await publicationsApi.update(id, fd);
      load();
    } catch { alert("Gagal"); }
    finally { setProcessing(null); }
  };

  const TYPE_LABELS: Record<string,string> = { ARTICLE:"Artikel", PAPER:"Paper", JOURNAL:"Journal" };

  return (
    <div style={{ padding:"40px" }}>
      <div style={{ marginBottom:"24px" }}>
        <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>Publikasi · Editor</p>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:300, color:"#0F2830", marginBottom:"4px" }}>
          Antrian Review
        </h1>
        <p style={{ fontSize:"13px", color:"#7A9AA5" }}>{drafts.length} draft menunggu review</p>
      </div>

      {loading ? (
        <div style={{ padding:"48px", textAlign:"center" }}>
          <p style={{ color:"#7A9AA5", fontFamily:"Georgia,serif", fontSize:"16px" }}>Memuat...</p>
        </div>
      ) : drafts.length === 0 ? (
        <div style={{ background:"#fff", border:"1px solid rgba(63,111,106,0.15)", borderRadius:"10px", padding:"64px", textAlign:"center" }}>
          <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:"rgba(63,111,106,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:"24px" }}>✓</div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:"22px", fontWeight:300, color:"#3F6F6A", marginBottom:"6px" }}>Semua bersih!</p>
          <p style={{ fontSize:"14px", color:"#7A9AA5" }}>Tidak ada draft yang menunggu review.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {drafts.map(draft => (
            <div key={draft.id} style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ display:"flex", gap:"16px", padding:"20px 24px", alignItems:"flex-start" }}>
                {/* Cover */}
                <div style={{ width:"72px", height:"72px", borderRadius:"8px", flexShrink:0, background:draft.coverImage?`url(${draft.coverImage}) center/cover`:`linear-gradient(135deg,#0F2830,${ACCENT})` }} />

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"6px" }}>
                    <span style={{ fontSize:"10px", fontWeight:500, color:ACCENT, background:`${ACCENT}12`, padding:"2px 8px", borderRadius:"10px" }}>
                      {TYPE_LABELS[draft.type]||draft.type}
                    </span>
                    {draft.articleSubtype && (
                      <span style={{ fontSize:"10px", color:"#B8CDD2" }}>{draft.articleSubtype}</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:300, color:"#0F2830", marginBottom:"6px", lineHeight:1.3 }}>
                    {draft.title}
                  </h3>
                  {draft.excerpt && (
                    <p style={{ fontSize:"13px", fontWeight:300, color:"#7A9AA5", lineHeight:1.7, marginBottom:"8px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>
                      {draft.excerpt}
                    </p>
                  )}
                  <div style={{ display:"flex", gap:"12px" }}>
                    <p style={{ fontSize:"11px", color:"#B8CDD2" }}>✍ {draft.author?.name || "Penulis"}</p>
                    <p style={{ fontSize:"11px", color:"#B8CDD2" }}>
                      📅 {new Date(draft.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}
                    </p>
                    {draft.tags?.length > 0 && (
                      <div style={{ display:"flex", gap:"4px" }}>
                        {draft.tags.slice(0,3).map((t:string) => (
                          <span key={t} style={{ fontSize:"10px", color:"#B8CDD2", border:"1px solid rgba(38,108,135,0.1)", padding:"1px 6px", borderRadius:"10px" }}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:"flex", flexDirection:"column", gap:"8px", flexShrink:0 }}>
                  <Link href={`/admin/publikasi/${draft.id}`} target="_blank"
                    style={{ padding:"8px 16px", border:`1px solid ${ACCENT}30`, borderRadius:"6px", color:ACCENT, textDecoration:"none", fontSize:"12px", fontWeight:500, textAlign:"center" as const }}>
                    Baca Lengkap ↗
                  </Link>
                  <button
                    onClick={()=>handlePublish(draft.id, draft.title)}
                    disabled={processing===draft.id}
                    style={{ padding:"8px 16px", background:"#3F6F6A", color:"#fff", border:"none", borderRadius:"6px", fontSize:"12px", fontWeight:500, cursor:processing===draft.id?"not-allowed":"pointer", opacity:processing===draft.id?0.6:1 }}>
                    {processing===draft.id ? "..." : "✓ Publikasikan"}
                  </button>
                  <button
                    onClick={()=>handleReject(draft.id)}
                    disabled={processing===draft.id}
                    style={{ padding:"8px 16px", border:"1px solid rgba(248,113,113,0.25)", borderRadius:"6px", color:"#f87171", background:"none", fontSize:"12px", cursor:processing===draft.id?"not-allowed":"pointer" }}>
                    Kembalikan ke Penulis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}