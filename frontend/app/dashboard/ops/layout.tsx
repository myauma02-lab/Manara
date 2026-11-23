"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell, { type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { useAuthStore } from "@/lib/store/authStore";

const NAV: DashboardNavItem[] = [
  { href: "/dashboard/ops", label: "Ringkasan", icon: "◉", exact: true },
  { href: "/dashboard/ops/layanan", label: "Kelola Layanan", icon: "◇" },
  { href: "/dashboard/ops/harga", label: "Skema Harga", icon: "◆" },
  { href: "/dashboard/ops/vendor", label: "Vendor & Mitra", icon: "△" },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/portal"); return; }
    if (user && !["SUPERADMIN", "SEKJEN", "OPERASIONAL"].includes(user.role)) router.replace("/dashboard");
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;
  return <DashboardShell title="Operasional" subtitle="Tim Operasional" navigation={NAV}>{children}</DashboardShell>;
}
