"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUS_CONFIG: any = {
  UPCOMING: { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.08)" },
  ACTIVE: { label: "Aktif", color: "#3F6F6A", bg: "rgba(63,111,106,0.1)" },
  COMPLETED: { label: "Selesai", color: "#6E7448", bg: "rgba(110,116,72,0.1)" },
  ARCHIVED: { label: "Diarsipkan", color: "#7A9AA5", bg: "rgba(122,154,165,0.1)" },
};

export default function ResearchDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    projectsApi.detail(String(slug))
      .then(r => {
        setProject(r.data.data);
        if (r.data.data?.title) document.title = `${r.data.data.title} | Research Manara`;
        return projectsApi.list();
      })
      .then(r => setRelated((r.data.data || []).filter((p: any) => p.slug !== slug).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main><Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat...</p>
      </div>
      <Footer />
    </main>
  );

  if (!project) return (
    <main><Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>Proyek tidak ditemukan.</p>
        <Link href="/layanan/research" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali ke Research</Link>
      </div>
      <Footer />
    </main>
  );

  const st = STATUS_CONFIG[project.status] || STATUS_CONFIG.UPCOMING;

  return (
    <main>
      <Navbar />

      {/* Cover */}
      <div style={{ height: "50vh", maxHeight: "520px", background: project.coverImage ? `url(${project.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", position: "relative", marginTop: "64px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,40,48,0.2) 0%, rgba(244,247,247,1) 100%)" }} />
        {!project.coverImage && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "140px", fontStyle: "italic", color: "rgba(255,255,255,0.04)", userSelect: "none" }}>
            {project.title?.charAt(0)}
          </div>
        )}
      </div>

      <div style={{ background: "#F4F7F7", paddingBottom: "120px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 clamp(20px,4vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "24px 0 20px", fontSize: "12px", color: "#B8CDD2", flexWrap: "wrap" }}>
            <Link href="/layanan" style={{ color: "#B8CDD2", textDecoration: "none" }}>Layanan</Link>
            <span>→</span>
            <Link href="/layanan/research" style={{ color: "#B8CDD2", textDecoration: "none" }}>Research</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>{project.title}</span>
          </div>

          {/* Status + category */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: st.bg, color: st.color }}>
              {st.label}
            </span>
            {project.category && (
              <span style={{ fontSize: "12px", color: "#7A9AA5", border: "1px solid rgba(38,108,135,0.1)", padding: "4px 12px", borderRadius: "2px" }}>
                {project.category}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.12, marginBottom: "20px" }}>
            {project.title}
          </h1>

          {/* Period */}
          {(project.startDate || project.endDate) && (
            <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "36px" }}>
              📅 {project.startDate ? new Date(project.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              {project.endDate ? ` → ${new Date(project.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : " → Berlangsung"}
            </p>
          )}

          {/* Description */}
          <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "36px", marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "18px" }}>Tentang Proyek</p>
            <div style={{ fontSize: "17px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
              {project.description}
            </div>
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {project.tags.map((tag: string) => (
                  <span key={tag} style={{ fontSize: "13px", border: "1px solid rgba(38,108,135,0.15)", padding: "6px 16px", borderRadius: "2px", color: "#7A9AA5" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {project.status !== "ARCHIVED" && (
            <div style={{ background: "#0F2830", borderRadius: "4px", padding: "40px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)", marginBottom: "64px" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#EEF4F6", marginBottom: "8px" }}>
                Tertarik terlibat dalam proyek ini?
              </p>
              <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.4)", marginBottom: "20px" }}>
                Hubungi kami untuk informasi kolaborasi.
              </p>
              <Link href="/#contact" style={{ background: "#266c87", color: "#fff", padding: "12px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
                Hubungi Kami
              </Link>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "20px" }}>Proyek Lainnya</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}
                className="related-grid">
                {related.map(p => (
                  <Link key={p.id} href={`/layanan/research/${p.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                      <div style={{ padding: "14px" }}>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>{p.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <style>{`
        @media (max-width: 560px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}