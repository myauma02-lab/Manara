"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Kembali ke atas"
      style={{
        position: "fixed",
        bottom: "32px",
        left: "32px",
        zIndex: 100,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "#266c87",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(38,108,135,0.3)",
        transition: "all 0.2s ease",
        animation: "fadeIn 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(38,108,135,0.4)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(38,108,135,0.3)";
      }}
    >
      ↑
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </button>
  );
}