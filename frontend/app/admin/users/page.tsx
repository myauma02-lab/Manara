"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "CONTRIBUTOR"];
const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTRIBUTOR: "Kontributor",
};
const ROLE_COLOR: Record<string, { bg: string; color: string }> = {
  SUPER_ADMIN: { bg: "rgba(38,108,135,0.15)", color: "#266c87" },
  ADMIN: { bg: "rgba(95,143,138,0.15)", color: "#3F6F6A" },
  EDITOR: { bg: "rgba(164,170,122,0.2)", color: "#6E7448" },
  CONTRIBUTOR: { bg: "rgba(184,205,210,0.2)", color: "#7A9AA5" },
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "EDITOR",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("manara_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const load = () => {
    fetch(`${API_URL}/api/users`, { headers })
      .then(r => r.json())
      .then(d => setUsers(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Semua kolom wajib diisi"); return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat user");
      setUsers(prev => [...prev, data.data]);
      setForm({ name: "", email: "", password: "", role: "EDITOR" });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`${API_URL}/api/users/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ isActive: !isActive }),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
    } catch { alert("Gagal mengubah status"); }
  };

  const handleChangeRole = async (id: string, role: string) => {
    try {
      await fetch(`${API_URL}/api/users/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ role }),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch { alert("Gagal mengubah role"); }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff",
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>
            Manajemen User
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", marginTop: "6px" }}>
            Kelola akun admin dan editor Manara
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            style={{ background: showForm ? "transparent" : "#266c87", color: showForm ? "#3A5560" : "#fff", border: `1px solid ${showForm ? "rgba(38,108,135,0.2)" : "#266c87"}`, borderRadius: "2px", padding: "11px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
            {showForm ? "Batal" : "+ Tambah User"}
          </button>
        )}
      </div>

      {/* Form tambah user */}
      {showForm && isSuperAdmin && (
        <form onSubmit={handleCreate} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", padding: "28px", marginBottom: "24px" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "20px" }}>
            User Baru
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                Nama Lengkap *
              </label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required placeholder="Nama lengkap" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                Email *
              </label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required placeholder="user@manara.id" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                Password *
              </label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required placeholder="Min. 8 karakter" minLength={8} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                Role
              </label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ ...inputStyle, appearance: "none" }}>
                {ROLES.filter(r => r !== "SUPER_ADMIN").map(r => (
                  <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Role description */}
          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px", padding: "16px", marginTop: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#7A9AA5", marginBottom: "8px" }}>Keterangan Role:</p>
            {[
              { role: "ADMIN", desc: "Akses penuh kecuali manage user" },
              { role: "EDITOR", desc: "Buat & edit artikel, proyek, riset" },
              { role: "CONTRIBUTOR", desc: "Buat konten saja (draft)" },
            ].map(r => (
              <div key={r.role} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "2px", background: ROLE_COLOR[r.role].bg, color: ROLE_COLOR[r.role].color }}>
                  {ROLE_LABEL[r.role]}
                </span>
                <span style={{ fontSize: "12px", color: "#7A9AA5" }}>{r.desc}</span>
              </div>
            ))}
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#f87171", background: "rgba(248,113,113,0.08)", padding: "10px 14px", borderRadius: "2px", marginTop: "12px" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button type="submit" disabled={saving}
              style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "12px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Membuat..." : "Buat User"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(""); }}
              style={{ background: "transparent", color: "#3A5560", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", padding: "12px 24px", fontSize: "13px", cursor: "pointer" }}>
              Batal
            </button>
          </div>
        </form>
      )}

      {/* User list */}
      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat users...</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                {["User", "Email", "Role", "Status", "Bergabung", ...(isSuperAdmin ? ["Aksi"] : [])].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "13px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isMe = u.id === currentUser?.id;
                const rc = ROLE_COLOR[u.role] || ROLE_COLOR.CONTRIBUTOR;
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: u.avatar ? `url(${u.avatar}) center/cover` : "rgba(38,108,135,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#266c87", fontSize: "14px", fontWeight: 500, flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>
                            {u.name} {isMe && <span style={{ fontSize: "10px", color: "#266c87", background: "rgba(38,108,135,0.08)", padding: "1px 6px", borderRadius: "2px" }}>Kamu</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7A9AA5" }}>{u.email}</td>
                    <td style={{ padding: "14px 20px" }}>
                      {isSuperAdmin && !isMe ? (
                        <select
                          value={u.role}
                          onChange={e => handleChangeRole(u.id, e.target.value)}
                          style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 8px", borderRadius: "2px", background: rc.bg, color: rc.color, border: "none", cursor: "pointer", outline: "none" }}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "2px", background: rc.bg, color: rc.color }}>
                          {ROLE_LABEL[u.role]}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "2px", background: u.isActive ? "rgba(95,143,138,0.15)" : "rgba(248,113,113,0.1)", color: u.isActive ? "#3F6F6A" : "#f87171" }}>
                        {u.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "12px", color: "#B8CDD2" }}>
                      {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    {isSuperAdmin && (
                      <td style={{ padding: "14px 20px" }}>
                        {!isMe && (
                          <button
                            onClick={() => handleToggleActive(u.id, u.isActive)}
                            style={{ fontSize: "12px", color: u.isActive ? "#f87171" : "#3F6F6A", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
                          >
                            {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isSuperAdmin && (
        <div style={{ marginTop: "16px", padding: "14px 18px", background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "#7A9AA5" }}>
            💡 Hanya Super Admin yang dapat menambah, mengubah role, atau menonaktifkan user.
          </p>
        </div>
      )}
    </div>
  );
}