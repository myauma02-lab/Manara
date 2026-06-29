"use client";
import { useState } from "react";

interface Props {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&via=manaraid`, "_blank");
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${shareUrl}`)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const btnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid rgba(38,108,135,0.15)",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#7A9AA5",
    transition: "all 0.2s",
    textDecoration: "none" as const,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginRight: "4px" }}>
        Bagikan:
      </p>

      <button onClick={shareTwitter} style={btnStyle} title="Bagikan ke X/Twitter">
        𝕏
      </button>

      <button onClick={shareWhatsApp} style={btnStyle} title="Bagikan ke WhatsApp">
        💬
      </button>

      <button onClick={shareFacebook} style={btnStyle} title="Bagikan ke Facebook">
        f
      </button>

      <button
        onClick={copyLink}
        style={{
          ...btnStyle,
          width: "auto",
          borderRadius: "2px",
          padding: "0 14px",
          fontSize: "12px",
          fontWeight: 500,
          background: copied ? "rgba(95,143,138,0.1)" : "transparent",
          color: copied ? "#3F6F6A" : "#7A9AA5",
          gap: "6px",
        }}
        title="Salin link"
      >
        {copied ? "✓ Disalin!" : "Salin Link"}
      </button>
    </div>
  );
}