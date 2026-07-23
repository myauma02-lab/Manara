"use client";
import { useEffect, useState } from "react";
import { foundersApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const GRADS = [
  "linear-gradient(145deg,#266c87,#0F2830)",
  "linear-gradient(145deg,#3F6F6A,#266c87)",
  "linear-gradient(145deg,#5F8F8A,#3F6F6A)",
  "linear-gradient(145deg,#1a4f63,#266c87)",
  "linear-gradient(145deg,#6E7448,#8A8F5E)",
];

export default function FounderListPage() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foundersApi.list()
      .then(r => setFounders(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "80px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <div style={{ paddingBottom: "48px" }}>
            <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "28px", flexWrap: "wrap" }}>
              <Link href="/tentang/manara" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Tentang Kami</Link>
              <span>→</span>
              <span style={{ color: "rgba(134,175,170,0.6)" }}>Founder</span>
            </div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.55)", marginBottom: "16px" }}>
              Tim Pendiri
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "20px" }}>
              Pikiran-pikiran<br />
              <em style={{ color: "#86AFAA", fontStyle: "italic" }}>di balik Manara.</em>
            </h1>
            <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(134,175,170,0.5)", lineHeight: 1.85, maxWidth: "520px" }}>
              Manara lahir dari keyakinan bersama lima individu: bahwa anak muda Indonesia layak mendapatkan platform yang setara dengan kedalaman pikiran mereka.
            </p>
          </div>
        </div>
      </section>

      {/* Grid founders */}
      <section style={{ padding: "80px clamp(20px,5vw,40px) 120px", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "24px" }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                  <div style={{ aspectRatio: "3/4", background: "rgba(38,108,135,0.06)" }} />
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "16px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "70%" }} />
                    <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "24px" }}>
              {founders.map((founder, i) => (
                <Link
                  key={founder.id}
                  href={founder.slug ? `/tentang/founder/${founder.slug}` : "#"}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "all 0.25s", cursor: "pointer" }}>
                    {/* Foto */}
                    <div style={{ aspectRatio: "3/4", position: "relative", background: founder.photo ? undefined : GRADS[i % 5] }}>
                      {founder.photo ? (
                        <img src={founder.photo} alt={founder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "Georgia,serif", fontSize: "64px", fontStyle: "italic", color: "rgba(255,255,255,0.08)", userSelect: "none" }}>
                            {founder.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,40,48,0.7) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.25s" }}
                        className="founder-overlay" />
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px" }}>
                      <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", marginBottom: "4px", lineHeight: 1.3 }}>
                        {founder.name}
                      </p>
                      <p style={{ fontSize: "11px", fontWeight: 500, color: "#7A9AA5", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                        {founder.role}
                      </p>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>
                        Lihat Profil →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && founders.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5" }}>Data founder belum tersedia.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: "#0F2830", padding: "64px clamp(20px,5vw,40px)", textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "rgba(238,244,246,0.8)", marginBottom: "16px" }}>
          Ingin bergabung bersama kami?
        </p>
        <Link href="/manapeople" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#266c87", color: "#fff", padding: "13px 32px", borderRadius: "2px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>
          Daftar Manapeople →
        </Link>
      </div>

      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .founder-card:hover .founder-overlay { opacity: 1 !important; }
      `}</style>
    </main>
  );
}