"use client";
import { useEffect, useState } from "react";
import { foundersApi } from "@/lib/api";
import Link from "next/link";

const GRADIENT_MAP = [
  "linear-gradient(145deg,#266c87,#0F2830)",
  "linear-gradient(145deg,#3F6F6A,#266c87)",
  "linear-gradient(145deg,#5F8F8A,#3F6F6A)",
  "linear-gradient(145deg,#1a4f63,#266c87)",
  "linear-gradient(145deg,#6E7448,#8A8F5E)",
];

export default function FoundersSection() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foundersApi.list()
      .then(r => setFounders(r.data.data || []))
      .catch(() => {
        setFounders([
          { id: "1", name: "Mutamimul Yhauma", role: "Co-Founder", photo: null, slug: null },
          { id: "2", name: "Oca Aulia Putri Nofianti", role: "Co-Founder", photo: null, slug: null },
          { id: "3", name: "Shalsa Bila Agustina", role: "Co-Founder", photo: null, slug: null },
          { id: "4", name: "Firstamarya Diffa Oktavinanti", role: "Co-Founder", photo: null, slug: null },
          { id: "5", name: "Sultan Isjad Ubaidillah", role: "Co-Founder", photo: null, slug: null },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="founders" style={{ padding: "100px 0", background: "#F8FAFA", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

        {/* Header */}
        <div style={{ maxWidth: "560px", marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "16px" }}>
            Orang-Orang di Balik Manara
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14, marginBottom: "16px" }}>
            Pikiran-pikiran<br />di balik Manara.
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>
            Manara lahir dari keyakinan bersama: bahwa anak muda Indonesia layak mendapatkan platform yang setara dengan kedalaman pikiran mereka.
          </p>
        </div>

        {/* ── MOBILE: horizontal scroll ── */}
        <div className="founders-mobile-scroll">
          <div style={{
            display: "flex",
            gap: "16px",
            paddingBottom: "16px",
            overflowX: "auto",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
            WebkitOverflowScrolling: "touch",
          }}>
            {founders.map((founder, i) => (
              <Link
                key={founder.id}
                href={founder.slug ? `/tentang/founder/${founder.slug}` : "/tentang/founder"}
                style={{ textDecoration: "none", flexShrink: 0 }}
              >
                <div style={{ width: "clamp(140px,36vw,180px)", textAlign: "center" }}>
                  {/* Foto */}
                  <div style={{
                    aspectRatio: "3/4",
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginBottom: "10px",
                    position: "relative",
                    background: founder.photo ? undefined : GRADIENT_MAP[i % 5],
                  }}>
                    {founder.photo ? (
                      <img
                        src={founder.photo}
                        alt={founder.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Georgia,serif", fontSize: "48px",
                        fontStyle: "italic", color: "rgba(255,255,255,0.08)",
                        userSelect: "none",
                      }}>
                        {founder.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Nama */}
                  <p style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(13px,2.5vw,15px)",
                    fontWeight: 300,
                    color: "#0F2830",
                    lineHeight: 1.35,
                  }}>
                    {founder.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── DESKTOP: grid 5 kolom ── */}
        <div className="founders-desktop-grid" style={{
          display: "none",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: "20px",
        }}>
          {founders.map((founder, i) => (
            <Link
              key={`d-${founder.id}`}
              href={founder.slug ? `/tentang/founder/${founder.slug}` : "/tentang/founder"}
              style={{ textDecoration: "none" }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{
                  aspectRatio: "3/4",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "14px",
                  position: "relative",
                  background: founder.photo ? undefined : GRADIENT_MAP[i % 5],
                }}>
                  {founder.photo ? (
                    <img
                      src={founder.photo}
                      alt={founder.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Georgia,serif", fontSize: "56px",
                      fontStyle: "italic", color: "rgba(255,255,255,0.08)",
                    }}>
                      {founder.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35 }}>
                  {founder.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Link lihat semua */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link href="/tentang/founder" style={{ fontSize: "13px", fontWeight: 500, color: "#266c87", textDecoration: "none" }}>
            Lihat semua founder →
          </Link>
        </div>
      </div>

      <style>{`
        /* Sembunyikan scrollbar */
        .founders-mobile-scroll div::-webkit-scrollbar { display: none; }

        /* Mobile: scroll horizontal */
        @media (max-width: 768px) {
          .founders-mobile-scroll { display: block !important; }
          .founders-desktop-grid { display: none !important; }
        }

        /* Desktop: grid */
        @media (min-width: 769px) {
          .founders-mobile-scroll { display: none !important; }
          .founders-desktop-grid { display: grid !important; }
        }
      `}</style>
    </section>
  );
}