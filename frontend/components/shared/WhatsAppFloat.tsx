"use client";
import { useState, useEffect } from "react";
import { WHATSAPP_NUMBER } from "@/lib/layanan-data";

interface Props {
  message?: string;
}

export default function WhatsAppFloat({
  message = "Halo Manara, saya ingin konsultasi tentang layanan hukum",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Muncul setelah 2 detik
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Pulse notif setiap 10 detik (max 3x)
  useEffect(() => {
    if (!visible || pulseCount >= 3) return;
    const t = setInterval(() => {
      setPulseCount(c => c + 1);
    }, 10000);
    return () => clearInterval(t);
  }, [visible, pulseCount]);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {/* Tooltip bubble */}
      {showTooltip && visible && (
        <div style={{
          position: "fixed",
          bottom: "88px",
          right: "24px",
          background: "#fff",
          border: "1px solid rgba(38,108,135,0.15)",
          borderRadius: "12px 12px 0 12px",
          padding: "12px 16px",
          boxShadow: "0 4px 20px rgba(15,40,48,0.12)",
          zIndex: 998,
          maxWidth: "200px",
          animation: "fadeInUp 0.2s ease",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", marginBottom: "2px" }}>
            Ada yang bisa kami bantu? 👋
          </p>
          <p style={{ fontSize: "11px", color: "#7A9AA5", lineHeight: 1.5 }}>
            Chat langsung dengan tim Manara
          </p>
          {/* Triangle */}
          <div style={{
            position: "absolute",
            bottom: "-8px",
            right: "16px",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "0 solid transparent",
            borderTop: "8px solid #fff",
            filter: "drop-shadow(0 2px 0 rgba(38,108,135,0.1))",
          }} />
        </div>
      )}

      {/* Main button */}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.5) translateY(20px)",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Pulse ring */}
        {pulseCount <= 3 && (
          <div style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "50%",
            border: "2px solid #25D366",
            opacity: 0,
            animation: "waPulse 2s ease infinite",
          }} />
        )}

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Chat via WhatsApp"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            boxShadow: "0 4px 20px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.15)",
            textDecoration: "none",
            transition: "all 0.25s ease",
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(37,211,102,0.5), 0 4px 12px rgba(0,0,0,0.2)";
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.15)";
          }}
        >
          {/* Inline icon: no external image or font asset can fail to load. */}
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3.2a12 12 0 0 0-10.3 18.15L4.2 27.8l6.7-1.75A12 12 0 1 0 16 3.2Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M10.2 8.6c.3-.5.9-.7 1.4-.4l2.1 1.1c.5.3.7.9.4 1.4l-.8 1.2a12 12 0 0 0 4.8 4.8l1.2-.8c.5-.3 1.1-.1 1.4.4l1.1 2.1c.3.5.1 1.1-.4 1.4-1 .6-2.4.6-3.7.1-4-1.6-7.2-4.8-8.8-8.8-.5-1.3-.5-2.7.1-3.7Z" fill="white" />
          </svg>
        </a>
      </div>

      <style>{`
        @keyframes waPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
