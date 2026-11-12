"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { authApi } from "@/lib/api";
import { getDashboardPath, useAuthStore } from "@/lib/store/authStore";
import styles from "./PortalLoginModern.module.css";

const WORKSPACES = ["Publikasi", "People & Culture", "Keuangan", "Operasional"];

export default function PortalLoginModern() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) router.replace(getDashboardPath(user.role));
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Email dan kata sandi perlu diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authApi.login(form.email.trim(), form.password);
      const { token, user: userData } = response.data;
      setAuth(userData, token);
      router.replace(getDashboardPath(userData.role));
    } catch (caught) {
      const message = (caught as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Email atau kata sandi belum cocok. Coba periksa kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.layout}>
        <section className={styles.welcome}>
          <Link href="/" className={styles.brand} aria-label="Kembali ke beranda Manara">
            <span className={styles.brandMark}>M</span>
            <span><strong>Manara</strong><small>Institute</small></span>
          </Link>
          <p className={styles.eyebrow}>Ruang kerja internal</p>
          <h1>Satu portal.<br /><em>Kerja bersama.</em></h1>
          <p className={styles.intro}>Masuk untuk melanjutkan pekerjaan dan kolaborasi tim Manara.</p>
          <ul className={styles.workspaceList} aria-label="Ruang kerja yang tersedia">
            {WORKSPACES.map((workspace, index) => (
              <li key={workspace}><span>{String(index + 1).padStart(2, "0")}</span>{workspace}</li>
            ))}
          </ul>
          <p className={styles.tagline}>Shaping Ideas for the Public Sphere</p>
        </section>

        <section className={styles.loginPanel} aria-labelledby="portal-heading">
          <div className={styles.panelIcon}><LockKeyhole size={20} aria-hidden="true" /></div>
          <p className={styles.panelEyebrow}>Portal Manara</p>
          <h2 id="portal-heading">Selamat datang kembali.</h2>
          <p className={styles.panelIntro}>Gunakan akun Manara yang sudah terdaftar.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="portal-email">Email</label>
              <input
                id="portal-email"
                type="email"
                value={form.email}
                onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                placeholder="nama@email.com"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="portal-password">Kata sandi</label>
              <div className={styles.passwordWrap}>
                <input
                  id="portal-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} aria-pressed={showPassword}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.submit} type="submit" disabled={loading} aria-busy={loading}>
              <span>{loading ? "Memeriksa akun…" : "Masuk ke portal"}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>

          <Link href="/" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Kembali ke situs Manara</Link>
        </section>
      </div>
    </main>
  );
}
