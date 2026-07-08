import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
console.log("API_URL =", API_URL);

export const api = axios.create({ baseURL: API_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("manara_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("manara_token");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
changePassword: (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => api.post("/auth/change-password", data),
resetPassword: (userId: string, newPassword: string) =>
  api.post(`/auth/reset-password/${userId}`, { newPassword }),
};

// ── Founder API update ──
export const foundersApi = {
  list: () => api.get("/founders"),
  detail: (slug: string) => api.get(`/founders/${slug}`),
  create: (data: FormData) => api.post("/founders", data),
  update: (id: string, data: FormData) => api.put(`/founders/${id}`, data),
  delete: (id: string) => api.delete(`/founders/${id}`),
};

export const projectsApi = {
  list: (params?: {
    status?: string;
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }) => api.get("/projects", { params }),

  adminList: (params?: {
    status?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => api.get("/projects/admin/all", { params }),

  detail: (slug: string) => api.get(`/projects/${slug}`),
  create: (data: FormData) => api.post("/projects", data),
  update: (id: string, data: FormData) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const newsletterApi = {
  subscribe: (data: { email: string; name?: string }) => api.post("/newsletter/subscribe", data),
  subscribers: () => api.get("/newsletter/subscribers"),
};

export const recruitmentApi = {
  active: () => api.get("/recruitment/active"),
  apply: (data: FormData) => api.post("/recruitment/apply", data),
  list: () => api.get("/recruitment"),
  applications: (id: string, status?: string) =>
    api.get(`/recruitment/${id}/applications`, { params: { status } }),
  updateApplication: (id: string, data: any) =>
    api.put(`/recruitment/applications/${id}`, data),
};

export const settingsApi = {
  get: () => api.get("/settings"),
  update: (key: string, value: any) => api.put(`/settings/${key}`, { value }),
  stats: () => api.get("/settings/admin/stats"),
};
export const contactApi = {
  send: (data: { name: string; email: string; purpose?: string; message: string }) =>
    api.post("/contact", data),
  list: () => api.get("/contact"),
  delete: (key: string) => api.delete(`/contact/${key}`),
};
export const categoriesApi = {
  list: () => api.get("/categories"),
  detail: (slug: string) => api.get(`/categories/${slug}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ── Publications API (menggantikan articlesApi + researchApi) ──
export const publicationsApi = {
  // Public
  list: (params?: {
    type?: "ARTICLE" | "PAPER" | "JOURNAL";
    status?: string;
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }) => api.get("/publications", { params }),

  detail: (slug: string) =>
    api.get(`/publications/${slug}`),

  download: (slug: string) =>
    api.get(`/publications/${slug}/download`),

  // Admin
  adminList: (params?: {
    type?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => api.get("/publications/admin/all", { params }),

  create: (data: FormData) =>
    api.post("/publications", data),

  update: (id: string, data: FormData) =>
    api.put(`/publications/${id}`, data),

  delete: (id: string) =>
    api.delete(`/publications/${id}`),
};

export const fellowsApi = {
  list: () => api.get("/fellows"),
  all: () => api.get("/fellows/all"),
  detail: (slug: string) => api.get(`/fellows/${slug}`),
  create: (data: FormData) => api.post("/fellows", data),
  update: (id: string, data: FormData) => api.put(`/fellows/${id}`, data),
  delete: (id: string) => api.delete(`/fellows/${id}`),
};