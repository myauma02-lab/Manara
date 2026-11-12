"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import styles from "./PublicationIdentity.module.css";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.manarainstitute.id").replace(/\/$/, "");

export default function PublicationIdentity({ code, canonicalPath }: { code?: string; canonicalPath?: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!code) return null;

  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  const shortUrl = `${SITE_URL}/P/${encodeURIComponent(code)}`;

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      setCopied("Salin gagal. Gunakan alamat yang ditampilkan di bawah.");
      window.setTimeout(() => setCopied(null), 3500);
    }
  }

  const copyButton = (label: string, value: string, icon: "copy" | "link") => {
    const success = copied === label;
    return (
      <button type="button" className={styles.action} onClick={() => copy(label, value)}>
        {success ? <Check size={16} aria-hidden="true" /> : icon === "link" ? <Link2 size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {success ? "Tersalin" : label}
      </button>
    );
  };

  return (
    <section className={styles.identity} aria-label="Identitas publikasi">
      <div className={styles.codeBlock}>
        <p>Kode publikasi</p>
        <code>{code}</code>
      </div>
      <div className={styles.actions}>
        {copyButton("Salin kode", code, "copy")}
        {canonicalUrl && copyButton("Salin link utama", canonicalUrl, "link")}
        {copyButton("Salin short URL", shortUrl, "link")}
      </div>
      <p className={styles.shortLink}><span>Short URL</span><a href={shortUrl}>{shortUrl.replace(/^https?:\/\//, "")}</a></p>
      {copied && <p className={styles.status} role="status" aria-live="polite">{copied}</p>}
    </section>
  );
}
