"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

const STATUS_CONFIG = {
  ACTIVE:    { label: "Aktif",       color: "#3F6F6A", dot: "#3F6F6A" },
  UPCOMING:  { label: "Akan Datang", color: "#266c87", dot: "#266c87" },
  COMPLETED: { label: "Selesai",     color: "#6E7448", dot: "#6E7448" },
  ARCHIVED:  { label: "Diarsipkan",  color: "#7A9AA5", dot: "#B8CDD2" },
} as const;

const GRADS = [
  "linear-gradient(135deg,#0F2830,#266c87)",
  "linear-gradient(135deg,#1a4f63,#5F8F8A)",
  "linear-gradient(135deg,#3F6F6A,#266c87)",
  "linear-gradient(135deg,#6E7448,#A4AA7A)",
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.list({ limit: 4 })
      .then(r => setProjects(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && projects.length === 0;

  return (
    <section style={{ padding: "100px 0", background: "#0F2830" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "12px" }}>
              Proyek Manara
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.14 }}>
              Dari inkuiri ke<br />
              <em style={{ color: "#86AFAA", fontStyle: "italic" }}>tindakan nyata.</em>
            </h2>
          </div>
          <Link href="/proyek" style={{ fontSize: "13px", fontWeight: 500, color: "#86AFAA", textDecoration: "none", border: "1px solid rgba(134,175,170,0.15)", padding: "8px 18px", borderRadius: "2px" }}>
            Semua proyek →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }} className="two-col-grid">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: "rgba(38,108,135,0.06)", borderRadius: "4px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.08)" }} />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ height: "12px", background: "rgba(38,108,135,0.08)", borderRadius: "2px", width: "30%" }} />
                  <div style={{ height: "18px", background: "rgba(38,108,135,0.08)", borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {isEmpty && (
          <div style={{ textAlign: "center", padding: "64px 0", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.35)", marginBottom: "16px" }}>
              Proyek pertama segera hadir.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 20px", borderRadius: "2px", color: "rgba(134,175,170,0.35)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#266c87", display: "inline-block" }} />
              Dalam Persiapan
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && projects.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }} className="two-col-grid">
            {projects.map((p, i) => {
              const sc = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING;
              return (
                <Link key={p.id} href={`/proyek/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "rgba(38,108,135,0.06)",
                    border: "1px solid rgba(38,108,135,0.12)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    transition: "all 0.2s",
                    height: "100%",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(38,108,135,0.1)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.25)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(38,108,135,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.12)";
                    }}
                  >
                    {/* Cover */}
                    <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : GRADS[i % GRADS.length], position: "relative" }}>
                      <span style={{ position: "absolute", top: "10px", left: "10px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "2px", background: "rgba(15,40,48,0.5)", color: sc.color, display: "inline-flex", alignItems: "center", gap: "5px", backdropFilter: "blur(4px)" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.dot, display: "inline-block", animation: p.status === "ACTIVE" ? "pulse-dot 2s infinite" : "none" }} />
                        {sc.label}
                      </span>
                      {p.progress > 0 && (
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(0,0,0,0.3)" }}>
                          <div style={{ height: "100%", width: `${p.progress}%`, background: sc.color }} />
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "18px 20px" }}>
                      {p.category && (
                        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "6px" }}>
                          {p.category}
                        </p>
                      )}
                      <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(16px,2vw,20px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.3, marginBottom: "8px" }}>
                        {p.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {p.tags?.slice(0, 2).map((tag: string) => (
                            <span key={tag} style={{ fontSize: "10px", color: "rgba(134,175,170,0.35)", border: "1px solid rgba(38,108,135,0.15)", padding: "2px 8px", borderRadius: "2px" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span style={{ fontSize: "13px", color: "#86AFAA" }}>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @media (max-width: 640px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}