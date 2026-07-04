"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { foundersApi, publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const GRADS = [
  "linear-gradient(145deg,#266c87,#0F2830)",
  "linear-gradient(145deg,#3F6F6A,#266c87)",
  "linear-gradient(145deg,#5F8F8A,#3F6F6A)",
];

export default function FounderDetailPage() {
  const { slug } = useParams();
  const [founder, setFounder] = useState<any>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foundersApi.detail(String(slug))
      .then(r => {
        const f = r.data.data;
        setFounder(f);
        if (f?.name) document.title = `${f.name} | Founder Manara`;
        // Load publikasi oleh founder ini kalau ada relasi
        // `author` isn't part of the published params type, cast to any to allow passing it
        return publicationsApi.list({ author: f?.id, limit: 6 } as any);
      })
      .then(r => setPublications(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat profil...</p>
      </div>
      <Footer />
    </main>
  );

  if (!founder) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>
          Profil tidak ditemukan.
        </p>
        <Link href="/tentang/founder" style={{ color: "#266c87", textDecoration: "none" }}>
          ← Kembali ke Founder
        </Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />

      {/* Hero dengan foto */}
      <section style={{ paddingTop: "120px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(38,108,135,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "40px", flexWrap: "wrap" }}>
            <Link href="/tentang/manara" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Tentang Kami</Link>
            <span>→</span>
            <Link href="/tentang/founder" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Founder</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>{founder.name}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "64px", alignItems: "end", paddingBottom: "0" }}
            className="founder-hero-grid">
            {/* Foto */}
            <div style={{ aspectRatio: "3/4", borderRadius: "4px 4px 0 0", overflow: "hidden", background: founder.photo ? undefined : GRADS[0], position: "relative", maxHeight: "380px" }}>
              {founder.photo ? (
                <img src={founder.photo} alt={founder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: "100px", fontStyle: "italic", color: "rgba(255,255,255,0.06)" }}>
                    {founder.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ paddingBottom: "48px" }}>
              <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#86AFAA", background: "rgba(38,108,135,0.15)", border: "1px solid rgba(134,175,170,0.15)", padding: "5px 14px", borderRadius: "2px", marginBottom: "20px" }}>
                Co-Founder · Manara
              </span>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "10px" }}>
                {founder.name}
              </h1>
              <p style={{ fontSize: "18px", fontWeight: 300, color: "rgba(134,175,170,0.55)", marginBottom: "16px" }}>
                {founder.role}
              </p>
              {founder.institution && (
                <p style={{ fontSize: "14px", color: "rgba(134,175,170,0.35)", marginBottom: "24px" }}>
                  {founder.institution}
                </p>
              )}
              {founder.bio && (
                <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "480px" }}>
                  {founder.bio}
                </p>
              )}

              {/* Social links */}
              {founder.socialLinks && Object.values(founder.socialLinks).some(Boolean) && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px" }}>
                  {[
                    { key: "twitter", label: "X / Twitter" },
                    { key: "instagram", label: "Instagram" },
                    { key: "linkedin", label: "LinkedIn" },
                    { key: "website", label: "Website" },
                  ].map(s => founder.socialLinks?.[s.key] && (
                    <a key={s.key} href={founder.socialLinks[s.key]} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "12px", fontWeight: 500, color: "#86AFAA", border: "1px solid rgba(38,108,135,0.2)", padding: "7px 16px", borderRadius: "2px", textDecoration: "none" }}>
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div style={{ background: "#F4F7F7", padding: "64px clamp(20px,5vw,40px) 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "64px" }}
            className="founder-body-grid">

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Research interests */}
              {founder.researchInterests?.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>
                    Minat Riset
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {founder.researchInterests.map((interest: string) => (
                      <div key={interest} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: "#266c87", fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>◎</span>
                        <span style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560", lineHeight: 1.6 }}>{interest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {publications.length > 0 && (
                <div style={{ background: "#0F2830", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", padding: "24px" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "40px", fontWeight: 300, color: "#EEF4F6", lineHeight: 1, marginBottom: "4px" }}>
                    {publications.length}
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(134,175,170,0.4)" }}>
                    publikasi di Manara
                  </p>
                </div>
              )}

              {/* Back */}
              <Link href="/tentang/founder" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#7A9AA5", textDecoration: "none", padding: "12px 0" }}>
                ← Semua Founder
              </Link>
            </div>

            {/* Main content */}
            <div>
              {/* Publikasi oleh founder ini */}
              {publications.length > 0 ? (
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "24px" }}>
                    Publikasi di Manara
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {publications.map(pub => {
                      const href = pub.type === "ARTICLE"
                        ? `/publikasi/artikel/${pub.slug}`
                        : pub.type === "PAPER"
                        ? `/publikasi/paper/${pub.slug}`
                        : `/publikasi/journal/${pub.slug}`;
                      return (
                        <Link key={pub.id} href={href} style={{ textDecoration: "none" }}>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "80px 1fr auto",
                            gap: "20px",
                            alignItems: "center",
                            padding: "20px",
                            background: "#fff",
                            border: "1px solid rgba(38,108,135,0.1)",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            transition: "border-color 0.2s",
                          }}>
                            {/* Cover thumbnail */}
                            <div style={{ width: "80px", height: "60px", borderRadius: "2px", background: pub.coverImage ? `url(${pub.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", flexShrink: 0 }} />
                            <div>
                              <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: pub.type === "ARTICLE" ? "#266c87" : pub.type === "PAPER" ? "#3F6F6A" : "#5F8F8A" }}>
                                  {pub.type === "ARTICLE" ? (pub.articleSubtype || "ARTIKEL") : pub.type === "PAPER" ? "PAPER" : "JOURNAL"}
                                </span>
                                {pub.publishedAt && (
                                  <span style={{ fontSize: "10px", color: "#B8CDD2" }}>
                                    · {new Date(pub.publishedAt).getFullYear()}
                                  </span>
                                )}
                              </div>
                              <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>
                                {pub.title}
                              </p>
                            </div>
                            <span style={{ fontSize: "14px", color: "#B8CDD2", flexShrink: 0 }}>→</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "48px", textAlign: "center" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
                    Publikasi segera hadir.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 300, color: "#B8CDD2", lineHeight: 1.7 }}>
                    Halaman profil ini akan dilengkapi dengan publikasi, karya, dan riset yang pernah ditulis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .founder-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .founder-body-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </main>
  );
}