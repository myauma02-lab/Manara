// lib/server-api.ts
// Dipakai HANYA di Server Components dan generateMetadata
// Tidak pakai axios karena axios tidak optimal di server

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.manarainstitute.id/api";

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

async function serverFetchPayload<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json() as T;
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

  listAll: async (type: "ARTICLE" | "PAPER" | "JOURNAL") => {
    const items: any[] = [];
    for (let page = 1; page <= 100; page++) {
      const result = await serverFetchPayload<{ data: any[]; pagination?: { pages: number } }>(
        `/publications?${new URLSearchParams({ type, page: String(page), limit: "50" })}`
      );
      if (!result?.data?.length) break;
      items.push(...result.data);
      if (page >= (result.pagination?.pages || 1)) break;
    }
    return items;
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

export const serverFellowsApi = {
  list: () => serverFetch<any[]>("/fellows"),
};

export const serverHomepageStatsApi = {
  get: async () => {
    const [publications, fellows] = await Promise.all([
      serverFetchPayload<{ pagination?: { total?: number } }>("/publications?limit=1"),
      serverFellowsApi.list(),
    ]);
    return {
      publicationCount: publications?.pagination?.total ?? null,
      fellowCount: fellows?.length ?? null,
    };
  },
};
