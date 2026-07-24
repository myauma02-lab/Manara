"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const ACCENT = "#266c87";

const ALLOWED_ROLES = ["SUPERADMIN","SEKJEN","PUBLIKASI_ADMIN","PUBLIKASI_EDITOR","PUBLIKASI_WRITER"];

// Nav per role
function getNav(role: string) {
  const base = [
    { href:"/dashboard/publikasi", label:"Overview", icon:"◎", exact:true },
  ];

  const artikelItem = { href:"/dashboard/publikasi/artikel", label:"Artikel", icon:"✦" };
  const paperItem   = { href:"/dashboard/publikasi/paper",   label:"Paper & Journal", icon:"◇" };
  const nlItem      = { href:"/dashboard/publikasi/newsletter", label:"Newsletter", icon:"@" };
  const seoItem     = { href:"/dashboard/publikasi/seo",    label:"SEO", icon:"◈" };
  const teamItem    = { href:"/dashboard/publikasi/tim",    label:"Tim Penulis", icon:"○" };

  if (role === "PUBLIKASI_WRITER") {
    return [...base, { href:"/dashboard/publikasi/artikel", label:"Tulisan Saya", icon:"✦" }];
  }
  if (role === "PUBLIKASI_EDITOR") {
    return [...base, artikelItem, paperItem, { href:"/dashboard/publikasi/review", label:"Perlu Review", icon:"⚠", badge:true }];
  }
  // Admin, Superadmin, Sekjen
  return [...base, artikelItem, paperItem, nlItem, seoItem, teamItem];
}

function getRoleLabel(role: string) {
  const map: Record<string,string> = {
    PUBLIKASI_WRITER: "Penulis",
    PUBLIKASI_EDITOR: "Editor",
    PUBLIKASI_ADMIN:  "Admin Publikasi",
    SUPERADMIN:       "Super Admin",
    SEKJEN:           "Sekjen",
  };
  return map[role] || role;
}

export default function PublikasiLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (user && !ALLOWED_ROLES.includes(user.role)) router.replace("/dashboard");
  }, [isAuthenticated, user, router]);

  const nav = user ? getNav(user.role) : [];
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  if (!isAuthenticated || !user) return null;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F4F7F8" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen?"240px":"64px",
        background: "linear-gradient(180deg,#0d1f2d 0%,#0F2830 100%)",
        borderRight: "1px solid rgba(38,108,135,0.15)",
        display:"flex", flexDirection:"column",
        transition:"width 0.25s ease",
        flexShrink:0,
        position:"sticky", top:0, height:"100vh",
        overflow:"hidden",
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px", borderBottom:"1px solid rgba(38,108,135,0.1)", display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"8px", background:"rgba(38,108,135,0.2)", border:"1px solid rgba(38,108,135,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"Georgia,serif", fontSize:"16px", color:ACCENT }}>
            M
          </div>
          {sidebarOpen && (
            <div>
              <p style={{ fontFamily:"Georgia,serif", fontSize:"14px", fontWeight:300, color:"#EEF4F6", marginBottom:"1px" }}>Manara Publikasi</p>
              <p style={{ fontSize:"10px", color:"rgba(38,108,135,0.5)", letterSpacing:"0.06em" }}>{getRoleLabel(user.role)}</p>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(s=>!s)}
            style={{ marginLeft:"auto", background:"none", border:"none", color:"rgba(38,108,135,0.4)", cursor:"pointer", fontSize:"16px", flexShrink:0, padding:"4px" }}>
            {sidebarOpen?"←":"→"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {nav.map(item => {
            const active = isActive(item.href, (item as any).exact);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:sidebarOpen?"10px 14px":"10px", borderRadius:"8px", background:active?`${ACCENT}20`:"transparent", borderLeft:`3px solid ${active?ACCENT:"transparent"}`, transition:"all 0.15s", justifyContent:sidebarOpen?"flex-start":"center", position:"relative" }}>
                  <span style={{ color:active?ACCENT:"rgba(38,108,135,0.4)", fontSize:"15px", flexShrink:0 }}>{item.icon}</span>
                  {sidebarOpen && (
                    <span style={{ fontSize:"13px", fontWeight:active?500:300, color:active?"#EEF4F6":"rgba(134,175,170,0.5)" }}>
                      {item.label}
                    </span>
                  )}
                  {sidebarOpen && (item as any).badge && pendingCount > 0 && (
                    <span style={{ marginLeft:"auto", background:"#f87171", color:"#fff", fontSize:"10px", fontWeight:600, width:"18px", height:"18px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {pendingCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(38,108,135,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", borderRadius:"8px", background:"rgba(38,108,135,0.06)" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`${ACCENT}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"13px", color:ACCENT, fontWeight:500 }}>
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:"12px", fontWeight:500, color:"#EEF4F6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</p>
                  <p style={{ fontSize:"10px", color:"rgba(38,108,135,0.5)" }}>{getRoleLabel(user.role)}</p>
                </div>
                <button onClick={()=>{ logout(); router.replace("/login"); }}
                  style={{ background:"none", border:"none", color:"rgba(38,108,135,0.3)", cursor:"pointer", fontSize:"14px", padding:"2px" }} title="Keluar">
                  ⏏
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowX:"hidden" }}>{children}</div>
    </div>
  );
}