"use client";
import { useState } from "react";
import Link from "next/link";
import { newsletterApi } from "@/lib/api";

const FOOTER_NAV = [
  {
    title: "Tentang Kami",
    links: [
      { label: "Tentang Manara", href: "/tentang/manara" },
      { label: "Manifesto", href: "/tentang/manifesto" },
      { label: "Founder", href: "/tentang/founder" },
      { label: "Manara Fellows", href: "/tentang/fellows" },
    ],
  },
  {
    title: "Publikasi",
    links: [
      { label: "Artikel", href: "/publikasi/artikel" },
      { label: "Manara Paper", href: "/publikasi/paper" },
      { label: "Manara Journal", href: "/publikasi/journal" },
    ],
  },
  {
    title: "Proyek & Layanan",  // ← Gabungkan jadi 1 kolom
    links: [
      { label: "Semua Proyek", href: "/proyek" },
      { label: "Layanan Research", href: "/layanan/research" },
      { label: "Policy Brief", href: "/layanan/policy-brief" },
      { label: "Training", href: "/layanan/training" },
      { label: "Consulting", href: "/layanan/consulting" },
    ],
  },
  {
    title: "Insight",
    links: [
      { label: "Newsletter", href: "/insight/newsletter" },
      { label: "Suara Manara", href: "/insight/suara-manara" },
      { label: "Podcast", href: "/insight/podcast" },
    ],
  },
];

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
    fontSize: "13px",
    fontWeight: 300,
    color: "rgba(134,175,170,0.45)" as const,
    textDecoration: "none" as const,
    display: "block" as const,
    marginBottom: "8px",
    transition: "color 0.2s" as const,
  };

  return (
    <footer style={{
      background: "#0F2830",
      borderTop: "1px solid rgba(38,108,135,0.08)",
    }}>
      {/* Main footer */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px clamp(20px,5vw,48px) 48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.6fr repeat(4,1fr)",
          gap: "40px",
          marginBottom: "56px",
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{
              fontFamily: "Georgia,serif",
              fontSize: "24px",
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
              color: "rgba(134,175,170,0.3)",
              lineHeight: 1.8,
              marginBottom: "16px",
              maxWidth: "200px",
            }}>
              Kolektif intelektual dan media kreatif berbasis Jawa Timur.
            </p>
            <p style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(38,108,135,0.5)",
              marginBottom: "24px",
            }}>
              Shaping Ideas for the Public Sphere
            </p>

            {/* Newsletter mini */}
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(134,175,170,0.25)", marginBottom: "10px" }}>
              Surat Manara
            </p>
            {done ? (
              <p style={{ fontSize: "13px", color: "#5F8F8A", fontStyle: "italic" }}>
                ✓ Terima kasih berlangganan!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  required
                  style={{
                    background: "rgba(38,108,135,0.08)",
                    border: "1px solid rgba(38,108,135,0.15)",
                    borderRadius: "2px",
                    padding: "9px 12px",
                    fontSize: "13px",
                    color: "rgba(238,244,246,0.7)",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                {error && <p style={{ fontSize: "11px", color: "#f87171" }}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#266c87",
                    color: "#fff",
                    border: "none",
                    borderRadius: "2px",
                    padding: "9px",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "..." : "Langganan"}
                </button>
              </form>
            )}
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map(col => (
            <div key={col.title}>
              <h4 style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(134,175,170,0.25)",
                marginBottom: "14px",
              }}>
                {col.title}
              </h4>
              {col.links.map(link => (
                <Link key={link.href} href={link.href} style={linkStyle}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
          borderTop: "1px solid rgba(38,108,135,0.07)",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(134,175,170,0.2)" }}>
            © {new Date().getFullYear()} Manara. Seluruh hak dilindungi.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/manapeople" style={{ fontSize: "12px", color: "rgba(134,175,170,0.25)", textDecoration: "none" }}>
              ManaPeople
            </Link>
            <Link href="/cari" style={{ fontSize: "12px", color: "rgba(134,175,170,0.25)", textDecoration: "none" }}>
              Cari
            </Link>
            <Link href="/tentang/manara" style={{ fontSize: "12px", color: "rgba(134,175,170,0.25)", textDecoration: "none" }}>
              Tentang
            </Link>
          </div>
          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "12px",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(134,175,170,0.2)",
          }}>
            "Di mana gagasan menemukan cahayanya."
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 1.6fr repeat(4, 1fr) !important;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}