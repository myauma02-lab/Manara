"use client";
import { useState } from "react";
import Link from "next/link";
import { newsletterApi } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await newsletterApi.subscribe({ email });
      setDone(true);
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal berlangganan");
    } finally {
      setLoading(false);
    }
  };

  const linkStyle = {
    fontSize: "14px",
    fontWeight: 300,
    color: "rgba(134,175,170,0.5)" as const,
    textDecoration: "none" as const,
    display: "block" as const,
    marginBottom: "10px",
  };

  const inputBaseStyle = {
    background: "rgba(38,108,135,0.08)",
    border: "1px solid rgba(38,108,135,0.15)",
    borderRadius: "2px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "rgba(238,244,246,0.7)",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
  };

  return (
    <footer style={{
      background: "#0F2830",
      padding: "64px 40px 40px",
      borderTop: "1px solid rgba(38,108,135,0.08)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top grid — responsive via JS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "48px",
          marginBottom: "56px",
        }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <Link href="/" style={{
              fontFamily: "Georgia,serif",
              fontSize: "26px",
              fontWeight: 300,
              color: "rgba(238,244,246,0.9)",
              letterSpacing: "0.04em",
              textDecoration: "none",
              display: "block",
              marginBottom: "12px",
            }}>
              Manara
            </Link>
            <p style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "rgba(134,175,170,0.35)",
              lineHeight: 1.8,
              maxWidth: "220px",
              marginBottom: "16px",
            }}>
              Ruang intelektual, kreatif, dan berpengetahuan — dibangun di Jawa Timur.
            </p>
            <p style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(38,108,135,0.5)",
            }}>
              Shaping Ideas for the Public Sphere
            </p>
          </div>

          {/* Organisasi */}
          <div>
            <h4 style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(134,175,170,0.3)",
              marginBottom: "16px",
            }}>
              Organisasi
            </h4>
            <Link href="/tentang" style={linkStyle}>Tentang Manara</Link>
            <Link href="/#about" style={linkStyle}>Ringkasan</Link>
            <Link href="/#vision" style={linkStyle}>Visi</Link>
            <Link href="/#founders" style={linkStyle}>Tim Pendiri</Link>
            <Link href="/#values" style={linkStyle}>Nilai-Nilai</Link>
          </div>

          {/* Konten */}
          <div>
            <h4 style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(134,175,170,0.3)",
              marginBottom: "16px",
            }}>
              Konten
            </h4>
            <Link href="/artikel" style={linkStyle}>Artikel</Link>
            <Link href="/media" style={linkStyle}>Media</Link>
            <Link href="/riset" style={linkStyle}>Riset</Link>
            <Link href="/proyek" style={linkStyle}>Proyek</Link>
            <Link href="/manapeople" style={linkStyle}>Manapeople</Link>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(134,175,170,0.3)",
              marginBottom: "16px",
            }}>
              Surat Manara
            </h4>
            <p style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "rgba(134,175,170,0.4)",
              lineHeight: 1.7,
              marginBottom: "14px",
            }}>
              Terima gagasan terbaik langsung di inbox-mu setiap minggu.
            </p>
            {done ? (
              <p style={{ fontSize: "13px", color: "#5F8F8A", fontStyle: "italic" }}>
                Terima kasih sudah berlangganan! ✓
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  required
                  style={inputBaseStyle}
                />
                {error && (
                  <p style={{ fontSize: "11px", color: "#f87171" }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#266c87",
                    color: "#fff",
                    border: "none",
                    borderRadius: "2px",
                    padding: "10px",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Mendaftar..." : "Langganan"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "32px",
          borderTop: "1px solid rgba(38,108,135,0.07)",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{
            fontSize: "12px",
            fontWeight: 300,
            color: "rgba(134,175,170,0.25)",
          }}>
            © 2024 Manara. Seluruh hak dilindungi.
          </p>
          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "13px",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(134,175,170,0.25)",
          }}>
            "Di mana gagasan menemukan cahayanya."
          </p>
        </div>
      </div>
    </footer>
  );
}