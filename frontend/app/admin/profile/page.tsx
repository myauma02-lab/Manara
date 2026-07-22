"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi } from "@/lib/api";

export default function AdminProfilePage() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(form.newPassword);
  const strengthLabel = ["", "Lemah", "Kurang Kuat", "Cukup", "Kuat", "Sangat Kuat"];
  const strengthColor = ["", "#f87171", "#fb923c", "#fbbf24", "#5F8F8A", "#3F6F6A"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setError("Password baru tidak boleh sama dengan password lama");
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword(form);
      setSuccess("Password berhasil diubah!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah password");
    } finally {
      setSaving(false);
    }
  };

  const ROLE_LABEL: Record<string, string> = {
    SUPERADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Editor",
    CONTRIBUTOR: "Kontributor",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid rgba(38,108,135,0.15)",
    borderRadius: "2px",
    fontSize: "14px",
    outline: "none",
    color: "#1C3038",
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
          Admin
        </p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>
          Profil Saya
        </h1>
      </div>

      {/* Info card */}
      <div style={{ background: "#0F2830", borderRadius: "4px", padding: "28px 32px", marginBottom: "32px", border: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(38,108,135,0.25)", border: "1px solid rgba(38,108,135,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#86AFAA", flexShrink: 0 }}>
          {user?.name?.charAt(0)}
        </div>
        <div>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6", marginBottom: "4px" }}>
            {user?.name}
          </p>
          <p style={{ fontSize: "13px", color: "rgba(134,175,170,0.5)", marginBottom: "8px" }}>
            {user?.email}
          </p>
          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: "rgba(38,108,135,0.2)", color: "#86AFAA" }}>
            {ROLE_LABEL[user?.role || ""] || user?.role}
          </span>
        </div>
      </div>

      {/* Change password form */}
      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "32px" }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
          Ganti Password
        </h2>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", marginBottom: "28px", lineHeight: 1.7 }}>
          Gunakan password yang kuat dan tidak mudah ditebak.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Password Lama *
            </label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
              required
              placeholder="Masukkan password saat ini"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Password Baru *
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
              required
              placeholder="Minimal 8 karakter"
              minLength={8}
              style={inputStyle}
            />
            {form.newPassword.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= strength ? strengthColor[strength] : "rgba(38,108,135,0.1)", transition: "background 0.3s" }} />
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: strengthColor[strength] }}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Konfirmasi Password Baru *
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
              placeholder="Ulangi password baru"
              style={{
                ...inputStyle,
                borderColor: form.confirmPassword
                  ? form.confirmPassword === form.newPassword
                    ? "rgba(95,143,138,0.4)"
                    : "rgba(248,113,113,0.4)"
                  : "rgba(38,108,135,0.15)",
              }}
            />
            {form.confirmPassword.length > 0 && (
              <p style={{ fontSize: "11px", marginTop: "6px", color: form.confirmPassword === form.newPassword ? "#3F6F6A" : "#f87171" }}>
                {form.confirmPassword === form.newPassword ? "✓ Password cocok" : "✗ Password tidak cocok"}
              </p>
            )}
          </div>

          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px", padding: "16px 18px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Tips Password Aman</p>
            {["Minimal 8 karakter", "Kombinasi huruf besar dan kecil", "Tambahkan angka dan simbol (!@#...)", "Jangan gunakan nama atau tanggal lahir"].map(tip => (
              <p key={tip} style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "3px" }}>· {tip}</p>
            ))}
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "2px", padding: "12px 16px" }}>
              <p style={{ fontSize: "13px", color: "#f87171" }}>✗ {error}</p>
            </div>
          )}

          {success && (
            <div style={{ background: "rgba(95,143,138,0.1)", border: "1px solid rgba(95,143,138,0.25)", borderRadius: "2px", padding: "12px 16px" }}>
              <p style={{ fontSize: "13px", color: "#3F6F6A" }}>✓ {success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || form.newPassword !== form.confirmPassword || form.newPassword.length < 8}
            style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", opacity: (saving || form.newPassword !== form.confirmPassword || form.newPassword.length < 8) ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            {saving ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </div>

      <div style={{ marginTop: "16px", padding: "14px 18px", background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>
          💡 Session login yang sedang aktif tidak akan terputus. Password baru berlaku saat login berikutnya.
        </p>
      </div>
    </div>
  );
}