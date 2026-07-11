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
          {/* WhatsApp SVG icon */}
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M15 2.5C8.096 2.5 2.5 8.096 2.5 15c0 2.28.617 4.415 1.692 6.247L2.5 27.5l6.427-1.667A12.431 12.431 0 0015 27.5c6.904 0 12.5-5.596 12.5-12.5S21.904 2.5 15 2.5z"
              fill="white"
              opacity="0.15"
            />
            <path
              d="M15 2.5C8.096 2.5 2.5 8.096 2.5 15c0 2.28.617 4.415 1.692 6.247L2.5 27.5l6.427-1.667A12.431 12.431 0 0015 27.5c6.904 0 12.5-5.596 12.5-12.5S21.904 2.5 15 2.5zm6.22 17.193c-.26.73-1.517 1.393-2.077 1.48-.53.08-1.2.113-1.934-.121a17.61 17.61 0 01-1.749-.647c-3.082-1.332-5.09-4.453-5.244-4.66-.152-.206-1.245-1.658-1.245-3.163 0-1.505.788-2.247 1.067-2.553.28-.306.61-.382.814-.382.205 0 .408.002.587.01.188.01.44-.071.688.524.26.62.882 2.125.959 2.278.078.154.13.332.026.537-.105.205-.157.332-.312.511-.154.18-.325.4-.463.537-.154.153-.315.318-.135.624.18.305.8 1.315 1.716 2.13 1.178 1.052 2.173 1.38 2.479 1.533.305.153.484.128.663-.077.18-.205.766-.894 1.97-.894z"
              fill="white"
            />
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