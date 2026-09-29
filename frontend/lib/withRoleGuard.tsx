"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardPath, useAuthStore } from "@/lib/store/authStore";

// HOC untuk proteksi halaman berdasarkan role
export function withRoleGuard(
  Component: React.ComponentType,
  allowedRoles: string[]
) {
  return function GuardedComponent(props: any) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/portal");
        return;
      }
      if (user && !allowedRoles.includes(user.role)) {
        router.replace(getDashboardPath(user.role));
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user) return null;
    if (!allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}

// Hook untuk cek permission
export function usePermission() {
  const { user } = useAuthStore();
  const role = user?.role || "";

  return {
    isSuperAdmin: role === "SUPERADMIN",
    isSekjen: role === "SEKJEN",
    isPublikasiAdmin: role === "PUBLIKASI_ADMIN",
    isEditor: ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"].includes(role),
    isWriter: role === "PUBLIKASI_WRITER",
    canPublish: ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"].includes(role),
    canEdit: ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"].includes(role),
    isHR: ["SUPERADMIN", "SEKJEN", "HR"].includes(role),
    isOps: ["SUPERADMIN", "SEKJEN", "OPERASIONAL"].includes(role),
    isFinance: ["SUPERADMIN", "SEKJEN", "KEUANGAN"].includes(role),
    role,
  };
}
