"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◎" },
  { href: "/admin/artikel", label: "Artikel", icon: "✦" },
  { href: "/admin/founder", label: "Founders", icon: "○" },
  { href: "/admin/project", label: "Proyek", icon: "△" },
  { href: "/admin/media", label: "Media Library", icon: "⊞" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "@" },
  { href: "/admin/recruitment", label: "Manapeople", icon: "+" },
  { href: "/admin/kategori", label: "Kategori", icon: "◇" },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: "✉" },
  { href: "/admin/users", label: "Users", icon: "⊕" },
  { href: "/admin/settings", label: "Pengaturan", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout, fetchMe } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) { setChecked(true); return; }
    const { token, fetchMe } = useAuthStore.getState();
    if (!token) { router.push("/admin/login"); return; }
    fetchMe()
    .then(() => {
      const { token: currentToken } = useAuthStore.getState();
      if (!currentToken) {
        router.push("/admin/login");
      }
    })
    .finally(() => setChecked(true));
}, [isLoginPage]);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!checked) return (
    <div style={{ minHeight: "100vh", background: "#0F2830", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(134,175,170,0.4)", fontSize: "13px", letterSpacing: "0.1em" }}>Memuat...</p>
    </div>
  );

  if (isLoginPage) return <>{children}</>;

  const Sidebar = () => (
    <aside style={{
      width: "240px",
      background: "#0F2830",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(38,108,135,0.1)",
      height: "100vh",
      overflowY: "auto",
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(38,108,135,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Link href="/" target="_blank" style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "rgba(238,244,246,0.9)", letterSpacing: "0.04em", textDecoration: "none", display: "block" }}>
              Manara
            </Link>
            <p style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(38,108,135,0.5)", marginTop: "3px" }}>
              Admin Dashboard
            </p>
          </div>
          {/* Close btn mobile */}
          <button onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "rgba(134,175,170,0.3)", fontSize: "18px", cursor: "pointer", display: "none" }}
            className="sidebar-close">
            ×
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 14px",
              borderRadius: "2px",
              marginBottom: "2px",
              fontSize: "13px",
              fontWeight: 300,
              color: active ? "#86AFAA" : "rgba(134,175,170,0.4)",
              background: active ? "rgba(38,108,135,0.15)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
              borderLeft: active ? "2px solid #266c87" : "2px solid transparent",
            }}>
              <span style={{ fontSize: "12px", width: "16px", textAlign: "center", flexShrink: 0 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(38,108,135,0.2)", border: "1px solid rgba(38,108,135,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#86AFAA", fontSize: "12px", fontWeight: 500, flexShrink: 0 }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(238,244,246,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ fontSize: "10px", color: "rgba(134,175,170,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {user?.role}
            </p>
          </div>
        </div>
        <Link
  href="/admin/profile"
  style={{
    display: "block",
    textAlign: "center",
    fontSize: "11px",
    color: "rgba(134,175,170,0.35)",
    border: "1px solid rgba(38,108,135,0.1)",
    borderRadius: "2px",
    padding: "6px",
    textDecoration: "none",
    marginBottom: "6px",
  }}
>
  Ganti Password
</Link>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/" target="_blank" style={{ flex: 1, display: "block", textAlign: "center", fontSize: "11px", color: "rgba(134,175,170,0.35)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px", padding: "6px", textDecoration: "none", transition: "color 0.15s" }}>
            Lihat Web
          </Link>
          <button onClick={() => { logout(); router.push("/admin/login"); }}
            style={{ flex: 1, fontSize: "11px", color: "rgba(134,175,170,0.35)", background: "none", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px", padding: "6px", cursor: "pointer" }}>
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F4F7F7" }}>
        {/* Desktop sidebar — fixed */}
        <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40, width: "240px" }} className="desktop-sidebar">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45 }} />
            <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: "260px" }}>
              <Sidebar />
            </div>
          </>
        )}

        {/* Main content */}
        <main style={{ flex: 1, marginLeft: "240px", minHeight: "100vh", overflowX: "hidden" }} className="admin-main">
          {/* Mobile top bar */}
          <div style={{ display: "none", alignItems: "center", gap: "12px", padding: "14px 20px", background: "#0F2830", borderBottom: "1px solid rgba(38,108,135,0.1)", position: "sticky", top: 0, zIndex: 30 }} className="mobile-topbar">
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "rgba(134,175,170,0.6)", fontSize: "20px", cursor: "pointer", padding: "0 4px" }}>
              ☰
            </button>
            <span style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "rgba(238,244,246,0.9)" }}>Manara</span>
          </div>

          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .mobile-topbar { display: flex !important; }
          .sidebar-close { display: block !important; }
        }
      `}</style>
    </>
  );
}