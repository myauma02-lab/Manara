"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import { newsletterApi } from "@/lib/api";
import styles from "./NewsletterSectionModern.module.css";

export default function NewsletterSectionModern() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      await newsletterApi.subscribe({ email: email.trim(), name: name.trim() });
      setDone(true);
    } catch (caught) {
      const message = (caught as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Pendaftaran belum berhasil. Coba lagi sebentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      <div className={styles.card}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Surat Manara</p>
          <h2 id="newsletter-heading">Ide baik layak<br />sampai lebih jauh.</h2>
          <p>Gagasan, analisis, dan bacaan pilihan dari Manara, langsung ke inbox-mu.</p>
          <Link href="/insight/newsletter" className={styles.moreLink}>Lihat edisi sebelumnya <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <div className={styles.formPanel}>
          {done ? (
            <div className={styles.success} role="status">
              <CheckCircle2 size={28} aria-hidden="true" />
              <div><strong>Kamu sudah terdaftar.</strong><span>Surat Manara akan segera hadir di inbox-mu.</span></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="newsletter-name">Nama <span>(opsional)</span></label>
                <input id="newsletter-name" type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Nama panggilanmu" autoComplete="name" />
              </div>
              <div className={styles.field}>
                <label htmlFor="newsletter-email">Alamat email</label>
                <input id="newsletter-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="email@kamu.com" autoComplete="email" required />
              </div>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button type="submit" disabled={loading} aria-busy={loading}>
                <span>{loading ? "Mendaftarkan…" : "Langganan gratis"}</span><Send size={17} aria-hidden="true" />
              </button>
              <small className={styles.privacy}>Kirim seperlunya. Berhenti berlangganan kapan saja.</small>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
