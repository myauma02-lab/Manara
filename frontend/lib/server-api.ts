// lib/server-api.ts
// Dipakai HANYA di Server Components dan generateMetadata
// Tidak pakai axios karena axios tidak optimal di server

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://postgres-production-e4294.up.railway.app/api";

async function serverFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      next: { revalidate: 60 }, // cache 60 detik
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

// ── Publications ─────────────────────────────────────
export const serverPublicationsApi = {
  detail: (slug: string) =>
    serverFetch<any>(`/publications/${slug}`),

  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return serverFetch<any[]>(`/publications${qs}`);
  },
};

// ── Projects ──────────────────────────────────────────
export const serverProjectsApi = {
  detail: (slug: string) =>
    serverFetch<any>(`/projects/${slug}`),

  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return serverFetch<any[]>(`/projects${qs}`);
  },
};

// ── Info (Pusat Informasi) ────────────────────────────
export const serverInfoApi = {
  detail: (slug: string) =>
    serverFetch<any>(`/info/${slug}`),
};

// ── Settings ──────────────────────────────────────────
export const serverSettingsApi = {
  get: () =>
    serverFetch<Record<string, string>>("/settings", {
      next: { revalidate: 3600 },
    }),
};

// ── Founders ──────────────────────────────────────────
export const serverFoundersApi = {
  list: () => serverFetch<any[]>("/founders"),
  detail: (slug: string) => serverFetch<any>(`/founders/${slug}`),
};