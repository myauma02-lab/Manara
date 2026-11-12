"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell, { type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { useAuthStore } from "@/lib/store/authStore";

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

function getNav(role?: string): DashboardNavItem[] {
  return [
    { href: "/dashboard/publikasi", label: "Ringkasan", icon: "◉", exact: true },
    { href: "/dashboard/publikasi/artikel", label: "Artikel", icon: "✎" },
    { href: "/dashboard/publikasi/paper", label: "Manara Paper", icon: "◈" },
    { href: "/dashboard/publikasi/jurnal", label: "Manara Journal", icon: "❖" },
    ...(EDITORIAL_ROLES.includes(role || "") ? [{ href: "/dashboard/publikasi/newsletter", label: "Newsletter", icon: "✉" }] : []),
    ...(ADMIN_ROLES.includes(role || "") ? [{ href: "/dashboard/publikasi/seo", label: "SEO", icon: "◎" }] : []),
  ];
}

export default function PublikasiLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/portal"); return; }
    if (user && !ALLOWED_ROLES.includes(user.role)) router.replace("/dashboard");
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) return null;
  return <DashboardShell title="Publikasi" subtitle={ROLE_LABEL[user.role] || "Tim Publikasi"} navigation={getNav(user.role)}>{children}</DashboardShell>;
}
