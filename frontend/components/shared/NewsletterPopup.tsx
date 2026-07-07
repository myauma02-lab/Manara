"use client";
import { useEffect, useState } from "react";
import { newsletterApi } from "@/lib/api";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dismissed = localStorage.getItem("manara_nl_dismissed");
    const subscribed = localStorage.getItem("manara_nl_subscribed");
    if (dismissed || subscribed) return;
    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("manara_nl_dismissed", "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await newsletterApi.subscribe({ email, name });
      setDone(true);
      localStorage.setItem("manara_nl_subscribed", "1");
      setTimeout(() => setShow(false), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay blur */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 140,
          background: "rgba(15,40,48,0.3)",
          backdropFilter: "blur(2px)",
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Popup */}
      <div style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 150,
        width: "100%",
        maxWidth: "360px",
        animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          background: "#0F2830",
          border: "1px solid rgba(38,108,135,0.25)",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(15,40,48,0.4)",
        }}>
          {/* Top bar */}
          <div style={{
            background: "linear-gradient(135deg, rgba(38,108,135,0.2), rgba(63,111,106,0.1))",
            padding: "20px 24px 16px",
            borderBottom: "1px solid rgba(38,108,135,0.1)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#5F8F8A", display: "inline-block",
                  animation: "pulse 2s infinite",
                }} />
                <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#86AFAA" }}>
                  Surat Manara
                </span>
              </div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.3 }}>
                Gagasan terbaik,<br />langsung ke inbox-mu.
              </p>
            </div>
            <button onClick={dismiss} style={{
              background: "none", border: "none", color: "rgba(134,175,170,0.4)",
              fontSize: "20px", cursor: "pointer", padding: "0", lineHeight: 1,
              flexShrink: 0, marginTop: "2px",
            }}>
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 24px 24px" }}>
            {done ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "rgba(95,143,138,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: "22px",
                }}>
                  ✓
                </div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#EEF4F6", marginBottom: "6px" }}>
                  Terima kasih!
                </p>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.5)" }}>
                  Kamu akan menerima Surat Manara segera.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.7, marginBottom: "4px" }}>
                  Newsletter mingguan. Ringkas, substantif, tanpa spam.
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Namamu (opsional)"
                  style={{
                    background: "rgba(38,108,135,0.08)",
                    border: "1px solid rgba(38,108,135,0.2)",
                    borderRadius: "2px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "rgba(238,244,246,0.8)",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  required
                  style={{
                    background: "rgba(38,108,135,0.08)",
                    border: "1px solid rgba(38,108,135,0.2)",
                    borderRadius: "2px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "rgba(238,244,246,0.8)",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                {error && (
                  <p style={{ fontSize: "12px", color: "#f87171" }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#266c87",
                    color: "#fff",
                    border: "none",
                    borderRadius: "2px",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    marginTop: "4px",
                  }}
                >
                  {loading ? "Mendaftar..." : "Langganan Gratis"}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  style={{
                    background: "none", border: "none",
                    fontSize: "11px", color: "rgba(134,175,170,0.3)",
                    cursor: "pointer", padding: "4px 0",
                    textAlign: "center",
                  }}
                >
                  Tidak, terima kasih
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </>
  );
}