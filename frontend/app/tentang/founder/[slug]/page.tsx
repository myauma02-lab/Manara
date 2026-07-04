"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { foundersApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function FounderDetailPage() {
  const { slug } = useParams();
  const [founder, setFounder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foundersApi.detail(String(slug))
      .then(r => setFounder(r.data.data))
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
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", color: "#7A9AA5", marginBottom: "16px" }}>
          Profil tidak ditemukan.
        </p>
        <Link href="/tentang/manara#founders" style={{ color: "#266c87", textDecoration: "none", fontSize: "14px" }}>
          Kembali ke Tim Founders
        </Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          <Link href="/tentang/manara#founders" style={{ display: "inline-block", fontSize: "12px", color: "#B8CDD2", textDecoration: "none", marginBottom: "40px" }}>
            Tentang Manara / Founders
          </Link>

          {/* Profile card */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", marginBottom: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0" }}>
              {/* Foto */}
              <div style={{ aspectRatio: "3/4", background: founder.photo ? `url(${founder.photo}) center/cover` : "linear-gradient(145deg,#266c87,#0F2830)", position: "relative" }}>
                {!founder.photo && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "64px", fontStyle: "italic", color: "rgba(255,255,255,0.1)" }}>
                    {founder.name?.charAt(0)}
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ padding: "40px 36px" }}>
                <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#266c87", marginBottom: "10px" }}>
                  Co-Founder · Manara
                </p>
                <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "8px" }}>
                  {founder.name}
                </h1>
                <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", marginBottom: "24px" }}>
                  {founder.role}
                </p>
                {founder.institution && (
                  <p style={{ fontSize: "14px", color: "#B8CDD2", marginBottom: "20px" }}>
                    {founder.institution}
                  </p>
                )}
                {founder.bio && (
                  <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.85 }}>
                    {founder.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Research interests */}
          {founder.researchInterests?.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "28px 32px", marginBottom: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
                Minat Riset
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {founder.researchInterests.map((interest: string) => (
                  <span key={interest} style={{ fontSize: "13px", border: "1px solid rgba(38,108,135,0.15)", padding: "6px 16px", borderRadius: "2px", color: "#3A5560" }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social links */}
          {founder.socialLinks && Object.values(founder.socialLinks).some(Boolean) && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "28px 32px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
                Terhubung
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {founder.socialLinks.twitter && (
                  <a href={founder.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 18px", borderRadius: "2px", textDecoration: "none" }}>
                    X / Twitter
                  </a>
                )}
                {founder.socialLinks.instagram && (
                  <a href={founder.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 18px", borderRadius: "2px", textDecoration: "none" }}>
                    Instagram
                  </a>
                )}
                {founder.socialLinks.linkedin && (
                  <a href={founder.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 18px", borderRadius: "2px", textDecoration: "none" }}>
                    LinkedIn
                  </a>
                )}
                {founder.socialLinks.website && (
                  <a href={founder.socialLinks.website} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "13px", color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 18px", borderRadius: "2px", textDecoration: "none" }}>
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Coming soon notice */}
          <div style={{ marginTop: "32px", background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>
              💡 Halaman profil ini akan segera dilengkapi dengan publikasi, posisi, dan karya yang pernah ditulis.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}