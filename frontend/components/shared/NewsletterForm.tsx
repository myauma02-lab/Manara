"use client";
import { useState } from "react";
import { newsletterApi } from "@/lib/api";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await newsletterApi.subscribe({ email, name });
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal berlangganan");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: `1px solid ${dark ? "rgba(38,108,135,0.25)" : "rgba(38,108,135,0.15)"}`,
    borderRadius: "2px",
    fontSize: "14px",
    outline: "none",
    color: dark ? "rgba(238,244,246,0.8)" : "#1C3038",
    fontFamily: "inherit",
    background: dark ? "rgba(38,108,135,0.08)" : "#fff",
    boxSizing: "border-box" as const,
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(95,143,138,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px" }}>✓</div>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: dark ? "#EEF4F6" : "#0F2830", marginBottom: "8px" }}>Terima kasih!</p>
      <p style={{ fontSize: "14px", fontWeight: 300, color: dark ? "rgba(134,175,170,0.5)" : "#7A9AA5" }}>Kamu akan menerima Surat Manara segera.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Namamu (opsional)"
        style={inputStyle}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="email@kamu.com"
        required
        style={inputStyle}
      />
      {error && <p style={{ fontSize: "12px", color: "#f87171" }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "13px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: "4px" }}
      >
        {loading ? "Mendaftar..." : "Langganan Gratis"}
      </button>
    </form>
  );
}