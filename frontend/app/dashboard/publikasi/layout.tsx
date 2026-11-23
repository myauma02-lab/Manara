"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell, { type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { useAuthStore } from "@/lib/store/authStore";

const ALLOWED_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR", "PUBLIKASI_WRITER"];
const EDITORIAL_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"];

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  SEKJEN: "Sekretaris Jenderal",
  PUBLIKASI_ADMIN: "Admin Publikasi",
  PUBLIKASI_EDITOR: "Editor",
  PUBLIKASI_WRITER: "Penulis",
};

function getNav(role?: string): DashboardNavItem[] {
  return [
    { href: "/dashboard/publikasi", label: "Semua Publikasi", icon: "◉", exact: true },
    { href: "/dashboard/publikasi/new", label: "Buat Publikasi", icon: "✎" },
    ...(EDITORIAL_ROLES.includes(role || "") ? [{ href: "/dashboard/publikasi/newsletter", label: "Newsletter", icon: "✉" }] : []),
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
