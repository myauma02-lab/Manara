"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell, { type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { useAuthStore } from "@/lib/store/authStore";

const NAV: DashboardNavItem[] = [
  { href: "/dashboard/finance", label: "Ringkasan", icon: "◉", exact: true },
  { href: "/dashboard/finance/income", label: "Pemasukan", icon: "↑" },
  { href: "/dashboard/finance/expense", label: "Pengeluaran", icon: "↓" },
  { href: "/dashboard/finance/budget", label: "Anggaran", icon: "◇" },
  { href: "/dashboard/finance/report", label: "Laporan", icon: "◈" },
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/portal"); return; }
    if (user && !["SUPERADMIN", "SEKJEN", "KEUANGAN"].includes(user.role)) router.replace("/dashboard");
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;
  return <DashboardShell title="Keuangan" subtitle="Tim Keuangan" navigation={NAV}>{children}</DashboardShell>;
}
