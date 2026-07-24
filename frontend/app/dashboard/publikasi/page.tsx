"use client";
import { useEffect, useState } from "react";
import { publicationsApi, newsletterApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

const ACCENT = "#266c87";

export default function PublikasiDashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role || "";
  const isWriter = role === "PUBLIKASI_WRITER";
  const isEditor = ["PUBLIKASI_EDITOR","PUBLIKASI_ADMIN","SUPERADMIN","SEKJEN"].includes(role);
  const isAdmin  = ["PUBLIKASI_ADMIN","SUPERADMIN","SEKJEN"].includes(role);

  const [stats, setStats]       = useState<any>(null);
  const [recent, setRecent]     = useState<any[]>([]);
  const [pending, setPending]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetches: Promise<any>[] = [];

    if (isWriter) {
      // Writer hanya lihat tulisannya sendiri
      fetches.push(
        publicationsApi.adminList({ limit:10 })
          .then(r => setRecent(r.data.data || []))
      );
    } else {
      fetches.push(
        Promise.all([
          publicationsApi.adminList({ type:"ARTICLE", limit:1 }),
          publicationsApi.adminList({ type:"PAPER",   limit:1 }),
          publicationsApi.adminList({ type:"JOURNAL", limit:1 }),
          publicationsApi.adminList({ limit:6 }),
          isAdmin ? newsletterApi.subscribers() : Promise.resolve({ data:{ data:[] } }),
        ]).then(([art, pap, jou, rec, subs]) => {
          setStats({
            artikel: art.data.pagination?.total || 0,
            paper:   pap.data.pagination?.total || 0,
            journal: jou.data.pagination?.total || 0,
            subscribers: isAdmin ? (subs.data.data?.length || 0) : null,
          });
          setRecent(rec.data.data || []);
        })
      );

      if (isEditor) {
        fetches.push(
          publicationsApi.adminList({ status:"DRAFT", limit:5 } as any)
            .then(r => setPending(r.data.data || []))
        );
      }
    }

    Promise.all(fetches).catch(() => {}).finally(() => setLoading(false));
  }, [role]);

  const TYPE_LABELS: Record<string,{ label:string, color:string, href:string }> = {
    ARTICLE: { label:"Artikel", color:ACCENT, href:"/publikasi/artikel" },
    PAPER:   { label:"Paper",   color:"#3F6F6A", href:"/publikasi/paper" },
    JOURNAL: { label:"Journal", color:"#5F8F8A", href:"/publikasi/journal" },
  };

  const STATUS_CONFIG: Record<string,{ label:string, color:string, bg:string }> = {
    PUBLISHED: { label:"Published", color:"#3F6F6A", bg:"rgba(63,111,106,0.1)"   },
    DRAFT:     { label:"Draft",     color:"#C6AD8A", bg:"rgba(198,173,138,0.12)" },
    ARCHIVED:  { label:"Archived",  color:"#7A9AA5", bg:"rgba(122,154,165,0.1)"  },
  };

  return (
    <div style={{ padding:"40px" }}>
      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"4px" }}>
          {new Date().toLocaleDateString("id-ID", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </p>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"32px", fontWeight:300, color:"#0F2830", marginBottom:"4px" }}>
          {isWriter ? `Halo, ${user?.name}` : "Dashboard Publikasi"}
        </h1>
        <p style={{ fontSize:"14px", fontWeight:300, color:"#7A9AA5" }}>
          {isWriter ? "Tulis, simpan draft, dan pantau status tulisanmu" :
           isEditor ? "Review dan approve konten dari para penulis" :
           "Kelola seluruh ekosistem konten Manara"}
        </p>
      </div>

      {/* Stats — hanya untuk editor ke atas */}
      {!isWriter && stats && (
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${isAdmin?4:3},1fr)`, gap:"12px", marginBottom:"24px" }} className="pub-stats">
          {[
            { label:"Artikel", val:stats.artikel, color:ACCENT, href:"/dashboard/publikasi/artikel" },
            { label:"Paper",   val:stats.paper,   color:"#3F6F6A", href:"/dashboard/publikasi/paper" },
            { label:"Journal", val:stats.journal, color:"#5F8F8A", href:"/dashboard/publikasi/paper" },
            ...(isAdmin ? [{ label:"Subscriber", val:stats.subscribers, color:"#C6AD8A", href:"/dashboard/publikasi/newsletter" }] : []),
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration:"none" }}>
              <div style={{ background:"#fff", border:`1px solid ${s.color}20`, borderRadius:"10px", padding:"18px 20px", transition:"all 0.2s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=`${s.color}40`}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor=`${s.color}20`}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:"32px", fontWeight:300, color:s.color, lineHeight:1, marginBottom:"6px" }}>
                  {loading?"...":s.val}
                </p>
                <p style={{ fontSize:"12px", fontWeight:500, color:s.color }}>{s.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"24px" }}>
        <Link href="/dashboard/publikasi/artikel/new"
          style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"10px 20px", background:ACCENT, color:"#fff", borderRadius:"6px", textDecoration:"none", fontSize:"13px", fontWeight:500 }}>
          + {isWriter ? "Tulis Artikel" : "Artikel Baru"}
        </Link>
        {!isWriter && (
          <>
            <Link href="/dashboard/publikasi/paper/new"
              style={{ padding:"10px 18px", border:`1px solid ${ACCENT}30`, borderRadius:"6px", color:ACCENT, textDecoration:"none", fontSize:"13px", fontWeight:500 }}>
              + Paper / Journal
            </Link>
            {isEditor && (
              <Link href="/dashboard/publikasi/review"
                style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"10px 18px", border:"1px solid rgba(248,113,113,0.3)", borderRadius:"6px", color:"#f87171", textDecoration:"none", fontSize:"13px", fontWeight:500 }}>
                ⚠ Review Draft {pending.length > 0 && `(${pending.length})`}
              </Link>
            )}
          </>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isEditor && pending.length > 0 ? "1fr 340px" : "1fr", gap:"20px" }} className="two-col-grid">

        {/* Recent publications */}
        <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"10px", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(38,108,135,0.08)", background:"rgba(38,108,135,0.02)" }}>
            <p style={{ fontSize:"13px", fontWeight:500, color:"#0F2830" }}>
              {isWriter ? "Tulisan Saya" : "Publikasi Terbaru"}
            </p>
            <Link href="/dashboard/publikasi/artikel" style={{ fontSize:"12px", color:ACCENT, textDecoration:"none" }}>Lihat semua →</Link>
          </div>
          {loading ? (
            <div style={{ padding:"32px", display:"flex", flexDirection:"column", gap:"12px" }}>
              {[1,2,3].map(i => <div key={i} style={{ height:"48px", background:"rgba(38,108,135,0.05)", borderRadius:"6px", animation:"pulse 1.5s infinite" }} />)}
            </div>
          ) : recent.length === 0 ? (
            <div style={{ padding:"48px", textAlign:"center" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:300, color:"#7A9AA5", marginBottom:"12px" }}>
                {isWriter ? "Belum ada tulisan" : "Belum ada publikasi"}
              </p>
              <Link href="/dashboard/publikasi/artikel/new"
                style={{ fontSize:"13px", color:ACCENT, border:`1px solid ${ACCENT}30`, padding:"8px 18px", borderRadius:"6px", textDecoration:"none" }}>
                + Mulai Menulis
              </Link>
            </div>
          ) : (
            recent.map(pub => {
              const tc = TYPE_LABELS[pub.type] || TYPE_LABELS.ARTICLE;
              const sc = STATUS_CONFIG[pub.status] || STATUS_CONFIG.DRAFT;
              const path = pub.type==="ARTICLE"?`/publikasi/artikel/${pub.slug}`:pub.type==="PAPER"?`/publikasi/paper/${pub.slug}`:`/publikasi/journal/${pub.slug}`;
              return (
                <div key={pub.id} style={{ display:"flex", gap:"14px", padding:"14px 20px", borderBottom:"1px solid rgba(38,108,135,0.05)", alignItems:"center" }}>
                  <div style={{ width:"40px", height:"40px", borderRadius:"6px", flexShrink:0, background:pub.coverImage?`url(${pub.coverImage}) center/cover`:`linear-gradient(135deg,#0F2830,${tc.color})` }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"2px" }}>
                      <span style={{ fontSize:"10px", fontWeight:500, color:tc.color }}>{tc.label}</span>
                      <span style={{ fontSize:"10px", fontWeight:500, padding:"1px 6px", borderRadius:"3px", background:sc.bg, color:sc.color }}>{sc.label}</span>
                    </div>
                    <p style={{ fontSize:"13px", fontWeight:500, color:"#0F2830", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pub.title}</p>
                    <p style={{ fontSize:"11px", color:"#B8CDD2" }}>
                      {new Date(pub.updatedAt||pub.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}
                    </p>
                  </div>
                  <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                    <Link href={`/admin/publikasi/${pub.id}`}
                      style={{ fontSize:"11px", color:ACCENT, border:`1px solid ${ACCENT}30`, borderRadius:"4px", padding:"4px 10px", textDecoration:"none" }}>
                      Edit
                    </Link>
                    {pub.status==="PUBLISHED" && (
                      <a href={path} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize:"11px", color:"#7A9AA5", border:"1px solid rgba(122,154,165,0.2)", borderRadius:"4px", padding:"4px 8px", textDecoration:"none" }}>
                        ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pending review — hanya untuk editor */}
        {isEditor && pending.length > 0 && (
          <div style={{ background:"#fff", border:"1px solid rgba(248,113,113,0.15)", borderRadius:"10px", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(248,113,113,0.1)", background:"rgba(248,113,113,0.03)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#f87171", animation:"pulse 2s infinite" }} />
                <p style={{ fontSize:"13px", fontWeight:500, color:"#0F2830" }}>Menunggu Review ({pending.length})</p>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {pending.map(pub => (
                <div key={pub.id} style={{ padding:"13px 18px", borderBottom:"1px solid rgba(248,113,113,0.06)", display:"flex", gap:"12px", alignItems:"center" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:"13px", fontWeight:500, color:"#0F2830", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:"2px" }}>
                      {pub.title}
                    </p>
                    <p style={{ fontSize:"11px", color:"#7A9AA5" }}>
                      {pub.author?.name || "Penulis"} · {new Date(pub.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"short" })}
                    </p>
                  </div>
                  <Link href={`/admin/publikasi/${pub.id}`}
                    style={{ fontSize:"11px", fontWeight:500, color:"#fff", background:"#f87171", border:"none", borderRadius:"4px", padding:"5px 12px", textDecoration:"none", flexShrink:0 }}>
                    Review →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 1000px) {
          .pub-stats { grid-template-columns: 1fr 1fr !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}