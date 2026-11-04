"use client";

import { useState } from "react";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.manarainstitute.id").replace(/\/$/, "");

export default function PublicationIdentity({
  code,
  canonicalPath,
}: {
  code?: string;
  canonicalPath?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!code) return null;

  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  const shortUrl = `${SITE_URL}/P/${encodeURIComponent(code)}`;

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("Gagal menyalin");
      window.setTimeout(() => setCopied(null), 2200);
    }
  }

  const buttonStyle = {
    border: "1px solid rgba(38,108,135,0.2)",
    background: "#fff",
    color: "#266c87",
    borderRadius: "3px",
    padding: "7px 10px",
    fontSize: "12px",
    cursor: "pointer",
  };

  return (
    <section aria-label="Identitas publikasi" style={{ margin: "20px 0", padding: "16px", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", background: "rgba(255,255,255,0.7)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5" }}>Publication Code</p>
          <code style={{ fontSize: "14px", fontWeight: 600, color: "#0F2830" }}>{code}</code>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" onClick={() => copy("Kode disalin", code)} style={buttonStyle}>
            {copied === "Kode disalin" ? "✓ Kode disalin" : "Salin kode"}
          </button>
          {canonicalUrl && <button type="button" onClick={() => copy("Link utama disalin", canonicalUrl)} style={buttonStyle}>
            {copied === "Link utama disalin" ? "✓ Link utama disalin" : "Salin link publikasi"}
          </button>}
          {canonicalUrl && <button type="button" onClick={() => copy("Short URL disalin", shortUrl)} style={buttonStyle}>
            {copied === "Short URL disalin" ? "✓ Short URL disalin" : "Salin short URL"}
          </button>}
        </div>
      </div>
      {canonicalUrl && <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#7A9AA5", overflowWrap: "anywhere" }}>Short URL: {shortUrl}</p>}
      {copied === "Gagal menyalin" && <p role="status" style={{ margin: "8px 0 0", fontSize: "12px", color: "#b42318" }}>Tidak dapat menyalin. Periksa izin clipboard browser.</p>}
    </section>
  );
}
