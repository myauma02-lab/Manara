"use client";
import { useState } from "react";
import { newsletterApi } from "@/lib/api";
import Link from "next/link";

export default function NewsletterSection() {
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
      setError(err.response?.data?.message || "Gagal berlangganan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "100px 0", background: "#0F2830" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", textAlign: "center" }}>

        <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "16px" }}>
          Newsletter
        </p>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.2, marginBottom: "14px" }}>
          Surat Manara.
        </h2>
        <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.85, marginBottom: "40px" }}>
          Gagasan terbaik, analisis terkini, dan kurasi bacaan pilihan, langsung ke inbox setiap minggu. Gratis, tanpa spam.
        </p>

        {done ? (
          <div style={{ background: "rgba(38,108,135,0.12)", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", padding: "32px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(95,143,138,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px" }}>✓</div>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6", marginBottom: "6px" }}>Terima kasih!</p>
            <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.45)" }}>
              Kamu akan menerima Surat Manara segera.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "480px", margin: "0 auto" }}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Namamu (opsional)"
                style={{ padding: "13px 18px", background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", fontSize: "15px", color: "rgba(238,244,246,0.8)", outline: "none", fontFamily: "inherit" }}
              />
              <div style={{ display: "flex", gap: "0", background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", overflow: "hidden" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  required
                  style={{ flex: 1, padding: "13px 18px", background: "transparent", border: "none", fontSize: "15px", color: "rgba(238,244,246,0.8)", outline: "none", fontFamily: "inherit" }}
                />
                <button type="submit" disabled={loading}
                  style={{ padding: "13px 24px", background: "#266c87", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", flexShrink: 0, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "..." : "Langganan"}
                </button>
              </div>
              {error && <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>}
            </div>
          </form>
        )}

        <p style={{ fontSize: "12px", color: "rgba(134,175,170,0.25)", marginTop: "20px" }}>
          Sudah bergabung?{" "}
          <Link href="/insight/newsletter" style={{ color: "rgba(134,175,170,0.4)", textDecoration: "none" }}>
            Selengkapnya →
          </Link>
        </p>
      </div>
    </section>
  );
}