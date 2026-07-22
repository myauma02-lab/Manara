import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
console.log("API_URL =", API_URL);

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.manarainstitute.id/api",
});

api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (Zustand persist)
    try {
      const stored = localStorage.getItem("manara-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // localStorage tidak tersedia (SSR), skip
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid → clear auth + redirect login
      try {
        localStorage.removeItem("manara-auth");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } catch { }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  me: () => api.get("/auth/me"),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post("/auth/change-password", data),

  resetPassword: (userId: string, newPassword: string) =>
    api.post(`/auth/reset-password/${userId}`, { newPassword }),

  users: () => api.get("/auth/users"),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => api.post("/auth/users", data),

  updateUser: (
    id: string,
    data: Partial<{ name: string; role: string; isActive: boolean }>
  ) => api.put(`/auth/users/${id}`, data),

  resetPasswordUser: (id: string, newPassword: string) =>
    api.post(`/auth/users/${id}/reset-password`, { newPassword }),

  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
};
// ── Finance API ───────────────────────────────────────
export const financeApi = {
  summary: (period?: string) =>
    api.get("/finance/summary", { params: { period } }),

  monthlyChart: (year?: number) =>
    api.get("/finance/monthly-chart", { params: { year } }),

  transactions: (params?: {
    type?: string; status?: string; category?: string;
    search?: string; page?: number; limit?: number;
    dateFrom?: string; dateTo?: string;
  }) => api.get("/finance/transactions", { params }),

  createTransaction: (data: FormData) =>
    api.post("/finance/transactions", data),

  updateTransaction: (id: string, data: FormData) =>
    api.put(`/finance/transactions/${id}`, data),

  deleteTransaction: (id: string) =>
    api.delete(`/finance/transactions/${id}`),

  categories: () => api.get("/finance/categories"),

  budgets: (period?: string) =>
    api.get("/finance/budgets", { params: { period } }),

  createBudget: (data: any) => api.post("/finance/budgets", data),
  updateBudget: (id: string, data: any) => api.put(`/finance/budgets/${id}`, data),
  deleteBudget: (id: string) => api.delete(`/finance/budgets/${id}`),
};

// ── HR API ────────────────────────────────────────────
export const hrApi = {
  // Employees
  employees: (params?: {
    status?: string; department?: string;
    search?: string; page?: number; limit?: number;
  }) => api.get("/hr/employees", { params }),

  employeeStats: () => api.get("/hr/employees/stats"),
  employee: (id: string) => api.get(`/hr/employees/${id}`),
  createEmployee: (data: any) => api.post("/hr/employees", data),
  updateEmployee: (id: string, data: any) => api.put(`/hr/employees/${id}`, data),

  // Notes
  addNote: (employeeId: string, content: string) =>
    api.post(`/hr/employees/${employeeId}/notes`, { content }),
  deleteNote: (noteId: string) =>
    api.delete(`/hr/employees/notes/${noteId}`),

  // Interviews
  interviews: (params?: { result?: string; upcoming?: boolean }) =>
    api.get("/hr/interviews", { params }),
  createInterview: (data: any) => api.post("/hr/interviews", data),
  updateInterview: (id: string, data: any) => api.put(`/hr/interviews/${id}`, data),
  deleteInterview: (id: string) => api.delete(`/hr/interviews/${id}`),

  // Pipeline overview
  pipeline: () => api.get("/hr/pipeline"),
};

// ── Users Management (superadmin) ────────────────────
export const usersApi = {
  list: () => api.get("/auth/users"),
  create: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/auth/users", data),
  update: (id: string, data: Partial<{ name: string; role: string; isActive: boolean }>) =>
    api.put(`/auth/users/${id}`, data),
  resetPassword: (id: string, newPassword: string) =>
    api.post(`/auth/users/${id}/reset-password`, { newPassword }),
  delete: (id: string) => api.delete(`/auth/users/${id}`),
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
  list: (params?: {status?: string; category?: string;search?: string; featured?: boolean; limit?: number; page?: number;
  }) => api.get("/projects", { params }),

  adminList: (params?: {status?: string; search?: string; limit?: number; page?: number;
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

// ── Waitlist ──────────────────────────────────────────
export const waitlistApi = {
  join: (data: {
    name: string;
    email: string;
    phone?: string;
    interest?: string;
    message?: string;
    source?: string;
  }) => api.post("/waitlist", data),

  list: () => api.get("/waitlist"),
  delete: (id: string) => api.delete(`/waitlist/${id}`),
};

// ── Recruitment ───────────────────────────────────────
export const recruitmentApi = {
  active: () => api.get("/recruitment/active"),
  list: () => api.get("/recruitment"),
  create: (data: any) => api.post("/recruitment", data),
  update: (id: string, data: any) => api.put(`/recruitment/${id}`, data),
  delete: (id: string) => api.delete(`/recruitment/${id}`),
  apply: (batchId: string, data: FormData) =>
    api.post(`/recruitment/${batchId}/apply`, data),
  applications: (batchId: string) =>
    api.get(`/recruitment/${batchId}/applications`),
  updateApplication: (appId: string, data: { status: string; adminNotes?: string }) =>
    api.put(`/recruitment/applications/${appId}`, data),
};

export const settingsApi = {
  get: (key?: string) =>
    key
      ? api.get("/settings", { params: { key } })
      : api.get("/settings"),

  update: (key: string, value: string) =>
    api.post("/settings", { key, value }),

  bulkUpdate: (settings: Record<string, string>) =>
    api.post("/settings/bulk", { settings }),

  // Upload gambar hero
  uploadHeroImage: (key: string, file: File) => {
    const fd = new FormData();
    fd.append("key", key);
    fd.append("image", file);
    return api.post("/settings/upload-image", fd);
  },

  deleteKey: (key: string) =>
    api.delete(`/settings/${key}`),
};


export const contactApi = {
  send: (data: { name: string; email: string; purpose?: string; message: string }) =>
    api.post("/contact", data),
  list: () => api.get("/contact"),
  delete: (key: string) => api.delete(`/contact/${key}`),
  reply: (
    id: string,
    data: {
        subject: string;
        message: string;
    }
) => api.post(`/contact/reply/${id}`, data),
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

export const infoApi = {
  // Public
  list: (params?: {
    type?: "NEWS" | "AWARD" | "MAGAZINE" | "AGENDA";
    search?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }) => api.get("/info", { params }),

  counts: () => api.get("/info/counts"),
  detail: (slug: string) => api.get(`/info/${slug}`),

  // Admin
  adminList: (params?: {
    type?: string;
    status?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => api.get("/info/admin/all", { params }),

  create: (data: FormData) => api.post("/info", data),
  update: (id: string, data: FormData) => api.put(`/info/${id}`, data),
  delete: (id: string) => api.delete(`/info/${id}`),
};