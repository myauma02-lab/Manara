import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "manara-auth" }
  )
);

// ── Role helpers ──────────────────────────────────────
export const ROLE_CONFIG = {
  SUPERADMIN: {
    label: "Super Admin",
    dashboard: "/admin",
    color: "#266c87",
    gradient: "linear-gradient(135deg, #0F2830, #266c87)",
    icon: "◎",
  },
  SEKJEN: {
    label: "Sekretaris Jenderal",
    dashboard: "/admin",
    color: "#3F6F6A",
    gradient: "linear-gradient(135deg, #0A1E1D, #3F6F6A)",
    icon: "◇",
  },
  PUBLIKASI_ADMIN: {
    label: "Admin Publikasi",
    dashboard: "/dashboard/publikasi",
    color: "#266c87",
    gradient: "linear-gradient(135deg, #0d1f2d, #266c87)",
    icon: "✦",
  },
  PUBLIKASI_EDITOR: {
    label: "Editor",
    dashboard: "/dashboard/publikasi",
    color: "#266c87",
    gradient: "linear-gradient(135deg, #0d1f2d, #266c87)",
    icon: "◈",
  },
  PUBLIKASI_WRITER: {
    label: "Penulis",
    dashboard: "/dashboard/publikasi",
    color: "#266c87",
    gradient: "linear-gradient(135deg, #0d1f2d, #266c87)",
    icon: "○",
  },
  HR: {
    label: "Tim SDM",
    dashboard: "/dashboard/hr",
    color: "#5F8F8A",
    gradient: "linear-gradient(135deg, #0a1e1d, #5F8F8A)",
    icon: "△",
  },
  OPERASIONAL: {
    label: "Tim Operasional",
    dashboard: "/dashboard/ops",
    color: "#8A8F5E",
    gradient: "linear-gradient(135deg, #141408, #8A8F5E)",
    icon: "□",
  },
  KEUANGAN: {
    label: "Tim Keuangan",
    dashboard: "/dashboard/finance",
    color: "#C6AD8A",
    gradient: "linear-gradient(135deg, #1a1208, #C6AD8A)",
    icon: "◆",
  },
} as const;

export type UserRole = keyof typeof ROLE_CONFIG;

export function getDashboardPath(role: string): string {
  return ROLE_CONFIG[role as UserRole]?.dashboard || "/dashboard";
}