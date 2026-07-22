"use client";
import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api";
import { ROLE_CONFIG, type UserRole } from "@/lib/store/authStore";

const ROLES = Object.entries(ROLE_CONFIG).map(([key, val]) => ({
  key,
  label: val.label,
  color: val.color,
}));

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    usersApi.list()
      .then(r => setUsers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggleActive = async (u: any) => {
    await usersApi.update(u.id, { isActive: !u.isActive });
    load();
  };

  const handleChangeRole = async (userId: string, role: string) => {
    await usersApi.update(userId, { role });
    load();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus user "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    await usersApi.delete(id);
    load();
  };

  const getRoleConfig = (role: string) =>
    ROLE_CONFIG[role as UserRole] || ROLE_CONFIG.PUBLIKASI_WRITER;

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
            Super Admin
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Manajemen Pengguna
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
            {users.length} pengguna terdaftar · {users.filter(u => u.isActive).length} aktif
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ padding: "11px 22px", background: "#266c87", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
          + Tambah Pengguna
        </button>
      </div>

      {/* Info */}
      <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "14px 18px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {ROLES.map(r => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.color }} />
              <span style={{ fontSize: "12px", color: "#7A9AA5" }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px" }}>Memuat...</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 200px 80px 200px", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "12px 20px", background: "rgba(38,108,135,0.02)" }}>
              {["Pengguna", "Role", "Ubah Role", "Status", "Aksi"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</p>
              ))}
            </div>

            {users.map(u => {
              const rc = getRoleConfig(u.role);
              return (
                <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 200px 80px 200px", padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>

                  {/* User info */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${rc.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: rc.color, fontWeight: 500, flexShrink: 0 }}>
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{u.name}</p>
                      <p style={{ fontSize: "12px", color: "#7A9AA5" }}>{u.email}</p>
                      {u.lastLoginAt && (
                        <p style={{ fontSize: "10px", color: "#B8CDD2" }}>
                          Login: {new Date(u.lastLoginAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role badge */}
                  <span style={{ fontSize: "11px", fontWeight: 500, padding: "4px 10px", borderRadius: "4px", background: `${rc.color}15`, color: rc.color, display: "inline-block" }}>
                    {rc.label}
                  </span>

                  {/* Change role */}
                  <select
                    value={u.role}
                    onChange={e => handleChangeRole(u.id, e.target.value)}
                    style={{ fontSize: "12px", padding: "6px 10px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", outline: "none", color: "#3A5560", background: "#fff", cursor: "pointer" }}
                  >
                    {ROLES.map(r => (
                      <option key={r.key} value={r.key}>{r.label}</option>
                    ))}
                  </select>

                  {/* Toggle active */}
                  <button onClick={() => handleToggleActive(u)}
                    style={{ fontSize: "11px", fontWeight: 500, padding: "5px 10px", borderRadius: "4px", border: "none", cursor: "pointer", background: u.isActive ? "rgba(63,111,106,0.1)" : "rgba(248,113,113,0.1)", color: u.isActive ? "#3F6F6A" : "#f87171" }}>
                    {u.isActive ? "Aktif" : "Nonaktif"}
                  </button>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setEditingUser(u)}
                      style={{ fontSize: "12px", color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", padding: "5px 12px", background: "none", cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={() => {
                      const newPw = prompt(`Reset password untuk ${u.name}?\nMasukkan password baru:`);
                      if (newPw && newPw.length >= 6) {
                        usersApi.resetPassword(u.id, newPw).then(() => alert("Password berhasil direset!")).catch(() => alert("Gagal reset password"));
                      } else if (newPw) {
                        alert("Password minimal 6 karakter");
                      }
                    }}
                      style={{ fontSize: "12px", color: "#C6AD8A", border: "1px solid rgba(198,173,138,0.25)", borderRadius: "4px", padding: "5px 12px", background: "none", cursor: "pointer" }}>
                      Reset PW
                    </button>
                    <button onClick={() => handleDelete(u.id, u.name)}
                      style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "PUBLIKASI_WRITER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Semua field wajib diisi"); return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter"); return;
    }
    setSaving(true);
    try {
      await usersApi.create(form);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat pengguna");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "6px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  const rc = ROLE_CONFIG[form.role as UserRole];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "460px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

        <div style={{ background: "linear-gradient(135deg,#0F2830,#266c87)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#EEF4F6" }}>
            Tambah Pengguna Baru
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
              Nama Lengkap *
            </label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nama lengkap" required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
              Email *
            </label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="nama@manara.id" required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
              Password *
            </label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 karakter" required minLength={6} style={inputStyle} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
              Role *
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {ROLES.map(r => (
                <label key={r.key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: `1px solid ${form.role === r.key ? r.color : "rgba(38,108,135,0.12)"}`, borderRadius: "6px", cursor: "pointer", background: form.role === r.key ? `${r.color}08` : "transparent", transition: "all 0.15s" }}>
                  <input type="radio" checked={form.role === r.key} onChange={() => setForm(f => ({ ...f, role: r.key }))}
                    style={{ accentColor: r.color }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: form.role === r.key ? 500 : 300, color: form.role === r.key ? r.color : "#3A5560" }}>
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Role description */}
          {rc && (
            <div style={{ background: `${rc.color}08`, border: `1px solid ${rc.color}20`, borderRadius: "6px", padding: "10px 14px" }}>
              <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                Dashboard: <strong style={{ color: rc.color }}>
                  {ROLE_CONFIG[form.role as UserRole]?.dashboard || "/dashboard"}
                </strong>
              </p>
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
              <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "12px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "6px", background: "transparent", color: "#7A9AA5", fontSize: "13px", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 2, padding: "12px", background: saving ? "#B8CDD2" : "#266c87", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Membuat..." : "Buat Pengguna"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}