"use client";
import { useEffect, useState } from "react";
import { foundersApi } from "@/lib/api";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { clsx } from "clsx";

const GRADIENT_MAP = [
  "linear-gradient(145deg,#266c87,#0F2830)",
  "linear-gradient(145deg,#3F6F6A,#266c87)",
  "linear-gradient(145deg,#5F8F8A,#3F6F6A)",
  "linear-gradient(145deg,#1a4f63,#266c87)",
  "linear-gradient(145deg,#6E7448,#8A8F5E)",
];

export default function FoundersSection() {
  const [founders, setFounders] = useState<any[]>([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    foundersApi.list().then(r => setFounders(r.data.data)).catch(() => {
      setFounders([
        { id: "1", name: "Mutamimul Yhauma", role: "Co-Founder", photo: null },
        { id: "2", name: "Oca Aulia Putri Nofianti", role: "Co-Founder", photo: null },
        { id: "3", name: "Shalsa Bila Agustina", role: "Co-Founder", photo: null },
        { id: "4", name: "Firstamarya Diffa Oktavinanti", role: "Co-Founder", photo: null },
        { id: "5", name: "Sultan Isjad Ubaidillah", role: "Co-Founder", photo: null },
      ]);
    });
  }, []);

  return (
    <section id="founders" style={{ padding: "120px 0", background: "#F8FAFA" }} ref={ref}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ maxWidth: "560px", marginBottom: "72px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "20px" }}>
            Orang-Orang di Balik Manara
          </p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14, marginBottom: "16px" }}>
            Pikiran-pikiran<br />di balik Manara.
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>
            Manara lahir dari keyakinan bersama: bahwa anak muda Indonesia layak mendapatkan platform yang setara dengan kedalaman pikiran mereka.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "20px" }}>
          {founders.map((founder, i) => (
            <div
              key={founder.id}
              style={{
                textAlign: "center",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: `all 0.7s ease ${i * 80}ms`,
              }}
            >
              <div style={{ aspectRatio: "3/4", borderRadius: "4px", overflow: "hidden", marginBottom: "14px", position: "relative" }}>
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    style={{ objectFit: "cover" }}
                    priority={i < 2}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: GRADIENT_MAP[i % 5] }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,40,48,0.6) 0%, transparent 50%)" }} />
                    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "Georgia,serif", fontSize: "56px", fontWeight: 300, fontStyle: "italic", color: "rgba(134,175,170,0.1)", userSelect: "none" }}>
                      {founder.name.charAt(0)}
                    </p>
                  </div>
                )}
              </div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35, padding: "0 4px" }}>
                {founder.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}