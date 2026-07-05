"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

const STATUS_CONFIG: any = {
  UPCOMING: { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.1)" },
  ACTIVE: { label: "Aktif", color: "#3F6F6A", bg: "rgba(95,143,138,0.15)" },
  COMPLETED: { label: "Selesai", color: "#6E7448", bg: "rgba(164,170,122,0.2)" },
};

const GRAD = [
  "linear-gradient(135deg,#0F2830,#266c87)",
  "linear-gradient(135deg,#1a4f63,#5F8F8A)",
  "linear-gradient(135deg,#3F6F6A,#266c87)",
  "linear-gradient(135deg,#6E7448,#A4AA7A)",
  "linear-gradient(135deg,#266c87,#86AFAA)",
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.list()
      .then(r => setProjects(r.data.data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Jika belum ada data, tampilkan teaser
  const isEmpty = !loading && projects.length === 0;

  return (
    <section id="projects" style={{ padding: "120px 0", background: "#0F2830" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.7)", marginBottom: "16px" }}>
              Proyek & Program
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1 }}>
              Inisiatif yang<br />
              <em style={{ color: "#86AFAA", fontStyle: "italic" }}>meninggalkan jejak.</em>
            </h2>
          </div>
          <Link href="/proyek" style={{ fontSize: "13px", fontWeight: 400, color: "rgba(134,175,170,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            Lihat semua →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: "72px", background: "rgba(38,108,135,0.05)", borderBottom: "1px solid rgba(38,108,135,0.08)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        )}

        {/* Empty teaser */}
        {isEmpty && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "rgba(238,244,246,0.4)", marginBottom: "24px" }}>
              Proyek pertama Manara segera hadir.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: "1px solid rgba(38,108,135,0.25)", padding: "10px 24px", borderRadius: "2px", color: "#86AFAA", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block", animation: "pulse 2s infinite" }} />
              Segera Hadir
            </div>
          </div>
        )}

        {/* Project list */}
        {!loading && projects.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((p, i) => {
              const st = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.UPCOMING;
              return (
                <div key={p.id ?? i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(12px,3vw,24px)",
                  padding: "clamp(16px,3vw,28px) 0",
                  borderBottom: "1px solid rgba(38,108,135,0.1)",
                  transition: "padding-left 0.25s ease",
                  cursor: "pointer",
                  width: "100%",
                  overflow: "hidden",
                }}>
                  <span style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(14px,2.5vw,18px)",
                    fontWeight: 300,
                    color: "rgba(38,108,135,0.4)",
                    flexShrink: 0,
                    width: "36px",
                  }}>
                    {`0${i + 1}`}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "clamp(16px,2.5vw,28px)",
                      fontWeight: 300,
                      color: "#EEF4F6",
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {p.title}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: "18px", color: "rgba(38,108,135,0.3)", flexShrink: 0 }}>→</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );
}