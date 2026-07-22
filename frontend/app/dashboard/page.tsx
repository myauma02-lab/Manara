"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getDashboardPath } from "@/lib/store/authStore";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (user) router.replace(getDashboardPath(user.role));
  }, [user, isAuthenticated, router]);

  return (
    <div style={{ minHeight: "100vh", background: "#0F2830", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(134,175,170,0.5)", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
        Mengalihkan...
      </p>
    </div>
  );
}