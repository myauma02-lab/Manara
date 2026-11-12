"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Instagram, Mail, MapPin, Youtube } from "lucide-react";
import { contactApi } from "@/lib/api";
import styles from "./ContactSection.module.css";

type ContactForm = { name: string; email: string; purpose: string; message: string };
const INITIAL_FORM: ContactForm = { name: "", email: "", purpose: "", message: "" };

export default function ContactSection() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof ContactForm, value: string) => setForm(current => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    try {
      await contactApi.send(form);
      setSent(true);
      setForm(INITIAL_FORM);
    } catch (caught) {
      const message = (caught as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Pesan belum terkirim. Periksa koneksi lalu coba lagi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <div className={styles.intro}>
          <p className="site-eyebrow">Terhubung dengan Manara</p>
          <h2 id="contact-heading" className="site-display">Ada gagasan?<br />Mari bicarakan.</h2>
          <p className={styles.description}>Terbuka untuk kolaborasi riset, kontribusi tulisan, kemitraan program, dan percakapan baru.</p>

          <div className={styles.details}>
            <a href="mailto:manararesearch@gmail.com" className={styles.detail}>
              <span className={styles.icon}><Mail size={19} aria-hidden="true" /></span>
              <span><small>Email</small><strong>manararesearch@gmail.com</strong></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <div className={styles.detail}>
              <span className={styles.icon}><MapPin size={19} aria-hidden="true" /></span>
              <span><small>Berbasis di</small><strong>Malang, Jawa Timur</strong></span>
            </div>
          </div>

          <nav className={styles.socials} aria-label="Media sosial Manara">
            <a href="https://instagram.com/manara_institute" target="_blank" rel="noopener noreferrer" aria-label="Instagram Manara"><Instagram size={18} aria-hidden="true" /></a>
            <a href="https://youtube.com/@ManaraInstitute" target="_blank" rel="noopener noreferrer" aria-label="YouTube Manara"><Youtube size={19} aria-hidden="true" /></a>
          </nav>
        </div>

        <div className={styles.formCard}>
          {sent ? (
            <div className={styles.success} role="status" aria-live="polite">
              <CheckCircle2 size={36} aria-hidden="true" />
              <h3>Pesan sudah sampai.</h3>
              <p>Terima kasih telah menghubungi Manara. Kami akan membalas melalui email.</p>
              <button type="button" onClick={() => setSent(false)}>Kirim pesan lain</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formHeading}>
                <h3>Mulai percakapan</h3>
                <p>Biasanya kami membalas dalam beberapa hari kerja.</p>
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-name">Nama</label>
                <input id="contact-name" name="name" value={form.name} onChange={event => update("name", event.target.value)} placeholder="Nama lengkap" autoComplete="name" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email">Alamat email</label>
                <input id="contact-email" name="email" type="email" value={form.email} onChange={event => update("email", event.target.value)} placeholder="email@kamu.com" autoComplete="email" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-purpose">Topik <span>opsional</span></label>
                <select id="contact-purpose" name="purpose" value={form.purpose} onChange={event => update("purpose", event.target.value)}>
                  <option value="">Pilih topik percakapan</option>
                  <option>Kolaborasi / Kemitraan</option>
                  <option>Pertanyaan Program</option>
                  <option>Kontribusi Tulisan</option>
                  <option>Manapeople / Rekrutmen</option>
                  <option>Permintaan Media</option>
                  <option>Pesan Umum</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-message">Pesan</label>
                <textarea id="contact-message" name="message" value={form.message} onChange={event => update("message", event.target.value)} placeholder="Ceritakan sedikit tentang yang ingin kamu diskusikan…" rows={5} required />
              </div>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button className={styles.submit} type="submit" disabled={sending} aria-busy={sending}>
                {sending ? "Mengirim pesan…" : "Kirim pesan"}<ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
