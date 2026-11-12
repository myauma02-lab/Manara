"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardShell, { type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { getDashboardPath, useAuthStore } from "@/lib/store/authStore";

const NAV: DashboardNavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: "◉", exact: true },
  { href: "/admin/publikasi", label: "Publikasi", icon: "✦" },
  { href: "/admin/pusat-informasi", label: "Pusat Informasi", icon: "◈" },
  { href: "/admin/layanan", label: "Layanan", icon: "◇" },
  { href: "/admin/project", label: "Proyek", icon: "□" },
  { href: "/admin/fellows", label: "Fellows", icon: "◉" },
  { href: "/admin/founder", label: "Founder", icon: "△" },
  { href: "/admin/recruitment", label: "Rekrutmen", icon: "○" },
  { href: "/admin/pesan", label: "Pesan", icon: "✉" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "@" },
  { href: "/admin/media", label: "Media", icon: "▧" },
  { href: "/admin/users", label: "Kelola Pengguna", icon: "♙" },
  { href: "/admin/settings", label: "Pengaturan", icon: "⚙" },
  { href: "/admin/profile", label: "Profil & kata sandi", icon: "◎" },
  { href: "/dashboard/hr", label: "Ruang kerja HR", icon: "↗" },
  { href: "/dashboard/finance", label: "Ruang kerja Keuangan", icon: "↗" },
  { href: "/dashboard/ops", label: "Ruang kerja Operasional", icon: "↗" },
  { href: "/dashboard/publikasi", label: "Ruang kerja Publikasi", icon: "↗" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === "/admin/login";
  const isAuthorized = Boolean(user && ["SUPERADMIN", "SEKJEN"].includes(user.role));

  useEffect(() => {
    if (isLoginPage) { setChecked(true); return; }
    if (!token || !user) { router.replace("/portal"); return; }
    if (!isAuthorized) { router.replace(getDashboardPath(user.role)); return; }
    setChecked(true);
  }, [isLoginPage, isAuthorized, router, token, user]);

  if (!checked || (!isLoginPage && (!user || !isAuthorized))) {
    return <div className="workspace-loading" role="status">Memuat ruang kerja Manara…</div>;
  }
  if (isLoginPage) return <>{children}</>;

  return (
    <DashboardShell title="Sekretariat" subtitle="Admin & sekretariat" navigation={NAV}>
      {children}
    </DashboardShell>
  );
}
