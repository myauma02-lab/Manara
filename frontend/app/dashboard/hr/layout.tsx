"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell, { type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { useAuthStore } from "@/lib/store/authStore";

const NAV: DashboardNavItem[] = [
  { href: "/dashboard/hr", label: "Ringkasan", icon: "◉", exact: true },
  { href: "/dashboard/hr/pipeline", label: "Pipeline", icon: "◈" },
  { href: "/dashboard/hr/applicants", label: "Pelamar", icon: "○" },
  { href: "/dashboard/hr/interview", label: "Interview", icon: "◇" },
  { href: "/dashboard/hr/employee", label: "Database Anggota", icon: "△" },
  { href: "/dashboard/hr/recruitment", label: "Rekrutmen", icon: "□" },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/portal"); return; }
    if (user && !["SUPERADMIN", "SEKJEN", "HR"].includes(user.role)) router.replace("/dashboard");
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;
  return <DashboardShell title="People & Culture" subtitle="SDM dan rekrutmen" navigation={NAV}>{children}</DashboardShell>;
}
