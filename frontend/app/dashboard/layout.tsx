"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, ROLE_CONFIG, type UserRole } from "@/lib/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}