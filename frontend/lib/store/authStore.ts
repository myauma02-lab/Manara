import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api';
interface AuthStore {
  user: any; token: string | null; isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; fetchMe: () => Promise<void>;
}
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null, token: null, isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login(email, password);
          localStorage.setItem('manara_token', data.token);
          set({ user: data.user, token: data.token });
        } finally { set({ isLoading: false }); }
      },
      logout: () => { localStorage.removeItem('manara_token'); set({ user: null, token: null }); },
      fetchMe: async () => {
        try { const { data } = await authApi.me(); set({ user: data.user }); }
        catch { get().logout(); }
      },
    }),
    { name: 'manara_auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);