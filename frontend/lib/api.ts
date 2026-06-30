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
};

export const articlesApi = {
  list: (params?: any) => api.get("/articles", { params }),
  detail: (slug: string) => api.get(`/articles/${slug}`),
  adminList: () => api.get("/articles/admin/all"),
  create: (data: FormData) => api.post("/articles", data),
  update: (id: string, data: FormData) => api.put(`/articles/${id}`, data),
  delete: (id: string) => api.delete(`/articles/${id}`),
};

export const foundersApi = {
  list: () => api.get("/founders"),
  create: (data: FormData) => api.post("/founders", data),
  update: (id: string, data: FormData) => api.put(`/founders/${id}`, data),
  delete: (id: string) => api.delete(`/founders/${id}`),
};

export const projectsApi = {
  list: (params?: any) => api.get("/projects", { params }),
  detail: (slug: string) => api.get(`/projects/${slug}`),
  create: (data: FormData) => api.post("/projects", data),
  update: (id: string, data: FormData) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const researchApi = {
  list: (params?: any) => api.get("/research", { params }),
  detail: (slug: string) => api.get(`/research/${slug}`),
  download: (slug: string) => api.get(`/research/${slug}/download`),
  create: (data: FormData) => api.post("/research", data),
  update: (id: string, data: any) => api.put(`/research/${id}`, data),
  delete: (id: string) => api.delete(`/research/${id}`),
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