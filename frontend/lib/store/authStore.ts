import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      initialized: false,

      setToken: (token) => {
        set({ token });
        // Tetap simpan di localStorage untuk kompatibilitas
        if (typeof window !== "undefined") {
          localStorage.setItem("manara_token", token);
        }
      },

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null, token: null, initialized: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("manara_token");
        }
      },

      fetchMe: async () => {
        const { token } = get();
        if (!token) {
          set({ initialized: true });
          return;
        }
        set({ loading: true });
        try {
          const res = await authApi.me();
          // Backend /auth/me mengembalikan { success, user }, bukan { success, data }
          set({ user: res.data.user, initialized: true });
        } catch {
          // Token expired atau invalid
          set({ user: null, token: null, initialized: true });
          if (typeof window !== "undefined") {
            localStorage.removeItem("manara_token");
          }
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "manara-auth", // key di localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }), // hanya persist token dan user
    }
  )
);