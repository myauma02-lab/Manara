"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATUS_CONFIG: any = {
  UPCOMING: { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.1)" },
  ACTIVE: { label: "Aktif", color: "#3F6F6A", bg: "rgba(95,143,138,0.15)" },
  COMPLETED: { label: "Selesai", color: "#6E7448", bg: "rgba(164,170,122,0.2)" },
  ARCHIVED: { label: "Diarsipkan", color: "#7A9AA5", bg: "rgba(184,205,210,0.2)" },
};

export default function ProyekDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    projectsApi.detail(String(slug))
      .then(r => {
        setProject(r.data.data);
        // load related
        return projectsApi.list();
      })
      .then(r => {
        const all = r.data.data;
        const rel = all.filter((p: any) => p.slug !== slug).slice(0, 3);
        setRelated(rel);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat proyek...</p>
      </div>
      <Footer />
    </main>
  );

  if (!project) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", textAlign: "center", padding: "120px 24px" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "16px" }}>
          Proyek tidak ditemukan.
        </p>
        <Link href="/layanan/research" style={{ color: "#266c87", fontSize: "14px", textDecoration: "none" }}>← Kembali ke Proyek</Link>
      </div>
      <Footer />
    </main>
  );

  const st = STATUS_CONFIG[project.status] || STATUS_CONFIG.UPCOMING;

  return (
    <main>
      <Navbar />

      {/* Hero cover */}
      <div style={{
        height: "55vh",
        maxHeight: "560px",
        background: project.coverImage
          ? `url(${project.coverImage}) center/cover`
          : "linear-gradient(135deg, #0F2830, #266c87)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,40,48,0.3) 0%, rgba(244,247,247,1) 100%)" }} />
        {!project.coverImage && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "160px", fontStyle: "italic", color: "rgba(255,255,255,0.05)", userSelect: "none" }}>
            {project.title.charAt(0)}
          </div>
        )}
      </div>

      <div style={{ background: "#F4F7F7", paddingBottom: "120px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>

          <Link href="/layanan/research" style={{ display: "inline-block", fontSize: "12px", color: "#B8CDD2", textDecoration: "none", marginBottom: "32px", marginTop: "32px" }}>
            ← Kembali ke Proyek
          </Link>

          {/* Status + Category */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", borderRadius: "2px", background: st.bg, color: st.color }}>
              {st.label}
            </span>
            {project.category && (
              <span style={{ fontSize: "12px", color: "#7A9AA5", border: "1px solid rgba(38,108,135,0.12)", padding: "5px 14px", borderRadius: "2px" }}>
                {project.category}
              </span>
            )}
            {project.isFeatured && (
              <span style={{ fontSize: "11px", color: "#266c87", fontWeight: 500 }}>★ Unggulan</span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.12, marginBottom: "24px" }}>
            {project.title}
          </h1>

          {/* Period */}
          {(project.startDate || project.endDate) && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "32px" }}>
              <span style={{ fontSize: "12px", color: "#B8CDD2" }}>📅</span>
              <span style={{ fontSize: "13px", color: "#7A9AA5" }}>
                {project.startDate ? new Date(project.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                {project.endDate ? ` → ${new Date(project.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : " → Berlangsung"}
              </span>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "40px", marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "20px" }}>
              Tentang Proyek
            </p>
            <div style={{ fontSize: "17px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
              {project.description}
            </div>
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
                Tags
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#EEF4F6", marginBottom: "8px" }}>
                Tertarik terlibat dalam proyek ini?
              </p>
              <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.5)", marginBottom: "24px" }}>
                Hubungi kami untuk informasi lebih lanjut tentang kolaborasi.
              </p>
              <Link href="/#contact" style={{ background: "#266c87", color: "#fff", padding: "13px 32px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
                Hubungi Kami
              </Link>
            </div>
          )}

          {/* Related projects */}
          {related.length > 0 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "24px" }}>
                Proyek Lainnya
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                {related.map(p => (
                  <Link key={p.id} href={`/layanan/research/${p.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                      <div style={{ padding: "16px" }}>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>{p.title}</p>
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
    </main>
  );
}