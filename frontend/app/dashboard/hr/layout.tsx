"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const NAV = [
  { href: "/dashboard/hr", label: "Overview", icon: "◎", exact: true },
  { href: "/dashboard/hr/pipeline", label: "Pipeline", icon: "◈" },
  { href: "/dashboard/hr/applicants", label: "Pelamar", icon: "○" },
  { href: "/dashboard/hr/interview", label: "Interview", icon: "◇" },
  { href: "/dashboard/hr/employee", label: "Database Anggota", icon: "△" },
  { href: "/dashboard/hr/recruitment", label: "Rekrutmen", icon: "□" },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    const allowed = ["SUPERADMIN", "SEKJEN", "HR"];
    if (user && !allowed.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const ACCENT = "#5F8F8A";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F4F4" }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "240px" : "64px",
        background: "linear-gradient(180deg, #0a1e1d 0%, #0F2830 100%)",
        borderRight: "1px solid rgba(95,143,138,0.15)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}>

        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(95,143,138,0.1)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            background: "rgba(95,143,138,0.2)",
            border: "1px solid rgba(95,143,138,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            fontFamily: "Georgia,serif", fontSize: "16px", color: ACCENT,
          }}>
            M
          </div>
          {sidebarOpen && (
            <div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#EEF4F6", marginBottom: "1px" }}>
                Manara HR
              </p>
              <p style={{ fontSize: "10px", color: "rgba(95,143,138,0.5)", letterSpacing: "0.06em" }}>
                SDM & Rekrutmen
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(s => !s)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(95,143,138,0.4)", cursor: "pointer", fontSize: "16px", flexShrink: 0, padding: "4px" }}
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV.map(item => {
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: sidebarOpen ? "10px 14px" : "10px",
                  borderRadius: "8px",
                  background: active ? `${ACCENT}20` : "transparent",
                  borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                  transition: "all 0.15s",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                }}>
                  <span style={{ color: active ? ACCENT : "rgba(95,143,138,0.4)", fontSize: "15px", flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span style={{ fontSize: "13px", fontWeight: active ? 500 : 300, color: active ? "#EEF4F6" : "rgba(134,175,170,0.5)" }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(95,143,138,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: "rgba(95,143,138,0.06)" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: `${ACCENT}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: "13px", color: ACCENT, fontWeight: 500,
            }}>
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#EEF4F6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(95,143,138,0.5)" }}>Tim SDM</p>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={() => { logout(); router.replace("/login"); }}
                style={{ background: "none", border: "none", color: "rgba(95,143,138,0.3)", cursor: "pointer", fontSize: "14px", padding: "2px" }}
                title="Keluar">
                ⏏
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        {children}
      </div>
    </div>
  );
}