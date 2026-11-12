"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./DashboardShell.module.css";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon?: string;
  exact?: boolean;
};

type Props = {
  title: string;
  subtitle: string;
  navigation: DashboardNavItem[];
  children: React.ReactNode;
};

export default function DashboardShell({ title, subtitle, navigation, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const activeItem = [...navigation].reverse().find(item =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const shellClass = [styles.shell, collapsed ? styles.collapsed : ""].filter(Boolean).join(" ");
  const handleLogout = () => {
    logout();
    router.replace("/portal");
  };

  return (
    <div className={shellClass}>
      <aside className={[styles.sidebar, mobileOpen ? styles.sidebarOpen : ""].filter(Boolean).join(" ")}>
        <div className={styles.brandRow}>
          <Link className={styles.brand} href="/dashboard" aria-label="Kembali ke ringkasan Manara">
            <span className={styles.brandMark}>M</span>
            <span className={styles.brandCopy}>
              <strong>Manara</strong>
              <small>{title}</small>
            </span>
          </Link>
          <button
            type="button"
            className={styles.collapseButton}
            aria-label={collapsed ? "Perluas menu" : "Ciutkan menu"}
            onClick={() => setCollapsed(value => !value)}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <button type="button" className={styles.closeMobile} aria-label="Tutup menu" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.navigation} aria-label={"Navigasi " + title}>
          <p className={styles.navCaption}>RUANG KERJA</p>
          {navigation.map(item => {
            const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.navLink, active ? styles.navLinkActive : ""].filter(Boolean).join(" ")}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.navIcon} aria-hidden="true">{item.icon || "•"}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" target="_blank" className={styles.siteLink}>
            <span aria-hidden="true">↗</span><span className={styles.navLabel}>Lihat situs publik</span>
          </Link>
          <div className={styles.userCard}>
            <span className={styles.avatar} aria-hidden="true">{user?.name?.charAt(0)?.toUpperCase() || "M"}</span>
            <span className={styles.userCopy}>
              <strong>{user?.name || "Pengguna Manara"}</strong>
              <small>{subtitle}</small>
            </span>
            <button type="button" className={styles.logoutButton} aria-label="Keluar dari portal" onClick={handleLogout}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && <button type="button" className={styles.backdrop} aria-label="Tutup navigasi" onClick={() => setMobileOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button type="button" className={styles.mobileMenuButton} aria-label="Buka navigasi" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
            <Menu size={21} />
          </button>
          <div className={styles.pageContext}>
            <span>{title}</span>
            <strong>{activeItem?.label || "Ruang kerja"}</strong>
          </div>
          <div className={styles.topbarUser}>
            <span className={styles.topbarAvatar} aria-hidden="true">{user?.name?.charAt(0)?.toUpperCase() || "M"}</span>
            <span>{user?.name || "Pengguna Manara"}</span>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
