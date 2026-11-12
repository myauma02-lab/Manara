"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Send } from "lucide-react";
import { newsletterApi } from "@/lib/api";
import styles from "./FooterModern.module.css";

const FOOTER_GROUPS = [
  {
    title: "Jelajahi",
    links: [
      { label: "Semua publikasi", href: "/publikasi" },
      { label: "Artikel", href: "/publikasi/artikel" },
      { label: "Manara Paper", href: "/publikasi/paper" },
      { label: "Manara Journal", href: "/publikasi/journal" },
      { label: "Topik riset", href: "/#topik-riset" },
    ],
  },
  {
    title: "Program",
    links: [
      { label: "Proyek", href: "/proyek" },
      { label: "Riset", href: "/layanan/research" },
      { label: "Policy brief", href: "/layanan/policy-brief" },
      { label: "Pelatihan", href: "/layanan/training" },
    ],
  },
  {
    title: "Manara",
    links: [
      { label: "Tentang kami", href: "/tentang/manara" },
      { label: "Manifesto", href: "/tentang/manifesto" },
      { label: "Fellows", href: "/tentang/fellows" },
      { label: "ManaPeople", href: "/manapeople" },
      { label: "Hubungi", href: "/#contact" },
    ],
  },
];

export default function FooterModern() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      await newsletterApi.subscribe({ email: email.trim() });
      setDone(true);
      setEmail("");
    } catch (caught) {
      const message = (caught as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Pendaftaran belum berhasil. Coba lagi sebentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerMain}>
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.wordmark}>Manara<span>Institute</span></Link>
            <p>Kolektif intelektual dan media kreatif berbasis Jawa Timur.</p>
            <span className={styles.tagline}>Shaping Ideas for the Public Sphere</span>
          </div>

          {FOOTER_GROUPS.map(group => (
            <div className={styles.linkGroup} key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(link => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.newsletter}>
            <p className={styles.newsletterEyebrow}>Surat Manara</p>
            <h2>Gagasan baru, langsung ke inbox.</h2>
            <p>Ikuti publikasi, agenda, dan perspektif terbaru dari Manara.</p>
            {done ? (
              <p className={styles.success} role="status"><CheckCircle2 size={18} aria-hidden="true" /> Terima kasih, kamu sudah terdaftar.</p>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.form}>
                <label className="sr-only" htmlFor="footer-newsletter-email">Alamat email</label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="Email kamu"
                  autoComplete="email"
                  required
                />
                <button type="submit" disabled={loading} aria-label="Daftar newsletter">
                  <span>{loading ? "Mengirim…" : "Daftar"}</span>
                  <Send size={16} aria-hidden="true" />
                </button>
                {error && <p className={styles.error} role="alert">{error}</p>}
              </form>
            )}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Manara Institute</p>
          <p className={styles.bottomQuote}>Di mana gagasan menemukan cahayanya.</p>
          <div className={styles.bottomLinks}>
            <Link href="/cari">Cari</Link>
            <Link href="/portal">Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
