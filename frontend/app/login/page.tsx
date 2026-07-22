"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore, getDashboardPath, ROLE_CONFIG, type UserRole } from "@/lib/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Redirect kalau sudah login
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await authApi.login(form.email, form.password);
    const { token, user: userData } = res.data;

    // Simpan ke store (otomatis ke localStorage via Zustand persist)
    setAuth(userData, token);

    // Redirect ke dashboard sesuai role
    router.replace(getDashboardPath(userData.role));
  } catch (err: any) {
    setError(err.response?.data?.message || "Email atau password salah");
  } finally {
    setLoading(false);
  }
};

  const rc = ROLE_CONFIG["SUPERADMIN"]; // default branding saat belum login

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F2830",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 30% 50%, rgba(38,108,135,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.08)" }} />
      <div style={{ position: "absolute", bottom: "-150px", left: "-80px", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.06)" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 2 }}>

        {/* Logo + Nama */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "12px",
            background: "rgba(38,108,135,0.2)",
            border: "1px solid rgba(38,108,135,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            fontFamily: "Georgia,serif", fontSize: "24px", color: "#86AFAA",
          }}>
            M
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#EEF4F6", marginBottom: "4px" }}>
            Manara
          </h1>
          <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.5)" }}>
            Dashboard Internal
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(38,108,135,0.2)",
          borderRadius: "16px",
          padding: "36px",
          backdropFilter: "blur(10px)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(134,175,170,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="nama@manara.id"
                autoComplete="email"
                required
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(38,108,135,0.25)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  color: "#EEF4F6",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(38,108,135,0.6)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(38,108,135,0.25)"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(134,175,170,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 48px 13px 16px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(38,108,135,0.25)",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#EEF4F6",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(38,108,135,0.6)"}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(38,108,135,0.25)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "rgba(134,175,170,0.4)", cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "8px",
                padding: "11px 14px",
              }}>
                <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "rgba(38,108,135,0.4)" : "#266c87",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginTop: "4px",
              }}
            >
              {loading ? "Masuk..." : "Masuk ke Dashboard →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "rgba(134,175,170,0.3)" }}>
          Manara Internal Dashboard · Hanya untuk tim
        </p>
      </div>
    </div>
  );
}