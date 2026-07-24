"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const ACCENT = "#266c87";
const ALLOWED_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR", "PUBLIKASI_WRITER"];
const EDITORIAL_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"];
const ADMIN_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN"];

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  SEKJEN: "Sekretaris Jenderal",
  PUBLIKASI_ADMIN: "Admin Publikasi",
  PUBLIKASI_EDITOR: "Editor",
  PUBLIKASI_WRITER: "Penulis",
};

function getNav(role?: string) {
  return [
    { href: "/dashboard/publikasi", label: "Overview", icon: "◉", exact: true, show: true },
    { href: "/dashboard/publikasi/artikel", label: "Artikel", icon: "✎", show: true },
    { href: "/dashboard/publikasi/paper", label: "Manara Paper", icon: "◈", show: true },
    { href: "/dashboard/publikasi/jurnal", label: "Manara Journal", icon: "❖", show: true },
    { href: "/dashboard/publikasi/newsletter", label: "Newsletter", icon: "✉", show: EDITORIAL_ROLES.includes(role || "") },
    { href: "/dashboard/publikasi/seo", label: "SEO", icon: "◎", show: ADMIN_ROLES.includes(role || "") },
  ].filter(i => i.show);
}

export default function PublikasiLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (user && !ALLOWED_ROLES.includes(user.role)) router.replace("/dashboard");
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) return null;

  const NAV = getNav(user.role);
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFA" }}>
      <div style={{
        width: sidebarOpen ? "240px" : "64px",
        background: "linear-gradient(180deg, #0d1f2d 0%, #0A1620 100%)",
        borderRight: "1px solid rgba(38,108,135,0.15)",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "4px", background: "rgba(38,108,135,0.2)", border: `1px solid ${ACCENT}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Georgia,serif", fontSize: "16px", color: ACCENT }}>M</div>
          {sidebarOpen && (
            <div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#EEF4F6", marginBottom: "1px" }}>Manara Publikasi</p>
              <p style={{ fontSize: "10px", color: "rgba(134,175,170,0.5)", letterSpacing: "0.06em" }}>{ROLE_LABEL[user.role] || user.role}</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(s => !s)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(134,175,170,0.4)", cursor: "pointer", fontSize: "16px", flexShrink: 0, padding: "4px" }}>
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV.map(item => {
            const active = isActive(item.href, (item as any).exact);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: sidebarOpen ? "10px 14px" : "10px",
                  borderRadius: "4px",
                  background: active ? `${ACCENT}22` : "transparent",
                  borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                  transition: "all 0.15s",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                }}>
                  <span style={{ color: active ? ACCENT : "rgba(134,175,170,0.4)", fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && <span style={{ fontSize: "13px", fontWeight: active ? 500 : 300, color: active ? "#EEF4F6" : "rgba(134,175,170,0.5)" }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(38,108,135,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "4px", background: "rgba(38,108,135,0.08)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `${ACCENT}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "13px", color: ACCENT, fontWeight: 500 }}>
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 500, color: "#EEF4F6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                  <p style={{ fontSize: "10px", color: "rgba(134,175,170,0.5)" }}>{ROLE_LABEL[user.role] || "Tim Publikasi"}</p>
                </div>
                <button onClick={() => { logout(); router.replace("/login"); }} style={{ background: "none", border: "none", color: "rgba(134,175,170,0.3)", cursor: "pointer", fontSize: "14px", padding: "2px" }}>⏏</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowX: "hidden" }}>{children}</div>
    </div>
  );
}