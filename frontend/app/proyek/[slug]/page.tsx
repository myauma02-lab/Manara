"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsApi, publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ReadingProgress from "@/components/shared/ReadingProgress";

const STATUS_CONFIG = {
  ACTIVE:    { label: "Aktif",       color: "#3F6F6A", bg: "rgba(63,111,106,0.12)",  dot: "#3F6F6A" },
  UPCOMING:  { label: "Akan Datang", color: "#266c87", bg: "rgba(38,108,135,0.1)",   dot: "#266c87" },
  COMPLETED: { label: "Selesai",     color: "#6E7448", bg: "rgba(110,116,72,0.1)",   dot: "#6E7448" },
  ARCHIVED:  { label: "Diarsipkan",  color: "#7A9AA5", bg: "rgba(122,154,165,0.1)",  dot: "#B8CDD2" },
} as const;

export default function ProyekDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPubs, setRelatedPubs] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    projectsApi.detail(String(slug))
      .then(async r => {
        const p = r.data.data;
        setProject(p);
        if (p?.title) document.title = `${p.title} | Proyek Manara`;

        // Load related publications
        if (p?.relatedPubs?.length > 0) {
          const pubPromises = p.relatedPubs.slice(0, 3).map((pubSlug: string) =>
            publicationsApi.detail(pubSlug).catch(() => null)
          );
          const pubs = (await Promise.all(pubPromises)).filter(Boolean).map(r => r?.data?.data);
          setRelatedPubs(pubs.filter(Boolean));
        }

        // Load related projects
        return projectsApi.list({ category: p?.category, limit: 4 });
      })
      .then(r => {
        setRelated((r?.data?.data || []).filter((p: any) => p.slug !== slug).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
          Memuat proyek...
        </p>
      </div>
      <Footer />
    </main>
  );

  if (!project) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>
          Proyek tidak ditemukan.
        </p>
        <Link href="/proyek" style={{ color: "#266c87", textDecoration: "none" }}>
          ← Kembali ke Proyek
        </Link>
      </div>
      <Footer />
    </main>
  );

  const sc = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING;
  const milestones: any[] = Array.isArray(project.milestones) ? project.milestones : [];

  return (
    <main>
      <Navbar />
      <ReadingProgress />

      {/* ── COVER ── */}
      <div style={{
        height: "50vh",
        maxHeight: "520px",
        background: project.coverImage ? `url(${project.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)",
        marginTop: "64px",
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,40,48,0.1) 0%, rgba(244,247,247,1) 100%)" }} />
        {/* Progress overlay */}
        {project.progress > 0 && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <div style={{ height: "4px", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ height: "100%", width: `${project.progress}%`, background: sc.color, transition: "width 1s" }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "#F4F7F7", paddingBottom: "120px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "24px 0 20px", fontSize: "12px", color: "#B8CDD2", flexWrap: "wrap" }}>
            <Link href="/proyek" style={{ color: "#B8CDD2", textDecoration: "none" }}>Proyek</Link>
            {project.category && (
              <>
                <span>→</span>
                <span style={{ color: "#7A9AA5" }}>{project.category}</span>
              </>
            )}
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>{project.title}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }} className="two-col-grid">

            {/* LEFT — Main content */}
            <div>
              {/* Status + kategori */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 14px", borderRadius: "2px", background: sc.bg, color: sc.color, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block", animation: project.status === "ACTIVE" ? "pulse-dot 2s infinite" : "none" }} />
                  {sc.label}
                </span>
                {project.category && (
                  <span style={{ fontSize: "12px", color: "#7A9AA5", border: "1px solid rgba(38,108,135,0.12)", padding: "4px 12px", borderRadius: "2px" }}>
                    {project.category}
                  </span>
                )}
              </div>

              {/* Judul */}
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.12, marginBottom: "20px" }}>
                {project.title}
              </h1>

              {/* Tags */}
              {project.tags?.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                  {project.tags.map((tag: string) => (
                    <span key={tag} style={{ fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", padding: "4px 12px", borderRadius: "2px", color: "#7A9AA5" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {project.progress > 0 && (
                <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#3A5560" }}>Progress Proyek</p>
                    <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: sc.color }}>{project.progress}%</p>
                  </div>
                  <div style={{ height: "6px", background: "rgba(38,108,135,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${project.progress}%`, background: `linear-gradient(to right, ${sc.color}80, ${sc.color})`, borderRadius: "3px", transition: "width 1s" }} />
                  </div>
                </div>
              )}

              {/* Deskripsi */}
              {project.description && (
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>
                    Tentang Proyek
                  </p>
                  <p style={{ fontSize: "17px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                    {project.description}
                  </p>
                </div>
              )}

              {/* Milestones */}
              {milestones.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
                    Milestones
                  </p>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "11px", top: 0, bottom: 0, width: "1px", background: "rgba(38,108,135,0.12)" }} />
                    {milestones.map((m: any, i: number) => (
                      <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "flex-start" }}>
                        <div style={{ width: "23px", height: "23px", borderRadius: "50%", border: `2px solid ${m.done ? sc.color : "rgba(38,108,135,0.2)"}`, background: m.done ? sc.color : "#F4F7F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 2 }}>
                          {m.done && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
                        </div>
                        <div>
                          <p style={{ fontSize: "15px", fontWeight: m.done ? 500 : 300, color: m.done ? "#0F2830" : "#7A9AA5", marginBottom: "3px" }}>
                            {m.title}
                          </p>
                          {m.date && (
                            <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                              {new Date(m.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outputs */}
              {project.outputs?.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>
                    Output Proyek
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {project.outputs.map((output: string, i: number) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 16px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                        <span style={{ color: "#266c87", fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>◎</span>
                        <p style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560" }}>{output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publikasi terkait */}
              {relatedPubs.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>
                    Publikasi Terkait
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {relatedPubs.map((pub: any) => {
                      const href = pub.type === "ARTICLE" ? `/publikasi/artikel/${pub.slug}`
                        : pub.type === "PAPER" ? `/publikasi/paper/${pub.slug}`
                        : `/publikasi/journal/${pub.slug}`;
                      return (
                        <Link key={pub.id} href={href} style={{ textDecoration: "none" }}>
                          <div style={{ display: "flex", gap: "14px", padding: "14px 16px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", transition: "border-color 0.2s", alignItems: "center" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.3)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)"}
                          >
                            <div style={{ width: "44px", height: "44px", borderRadius: "2px", background: pub.coverImage ? `url(${pub.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: "10px", color: "#266c87", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
                                {pub.type}
                              </p>
                              <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>
                                {pub.title}
                              </p>
                            </div>
                            <span style={{ color: "#B8CDD2", fontSize: "16px", flexShrink: 0 }}>→</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Download links */}
              {(project.reportUrl || project.dataUrl) && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px" }}>
                  {project.reportUrl && (
                    <a href={project.reportUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#266c87", color: "#fff", padding: "11px 22px", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em" }}>
                      📄 Unduh Laporan
                    </a>
                  )}
                  {project.dataUrl && (
                    <a href={project.dataUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.2)", color: "#266c87", padding: "11px 22px", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                      📊 Akses Dataset
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "100px", alignSelf: "start" }}>

              {/* Info proyek */}
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "22px" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
                  Info Proyek
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    {
                      label: "Status",
                      value: (
                        <span style={{ fontSize: "13px", fontWeight: 500, color: sc.color }}>
                          {sc.label}
                        </span>
                      ),
                    },
                    project.client && { label: "Klien / Mitra", value: project.client },
                    project.location && { label: "Lokasi", value: project.location },
                    project.startDate && {
                      label: "Mulai",
                      value: new Date(project.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                    },
                    project.endDate && {
                      label: "Selesai",
                      value: new Date(project.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                    },
                    !project.endDate && project.startDate && { label: "Selesai", value: "Berlangsung" },
                  ].filter(Boolean).map((item: any, i: number) => (
                    <div key={i}>
                      <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", color: "#B8CDD2", textTransform: "uppercase", marginBottom: "3px" }}>
                        {item.label}
                      </p>
                      {typeof item.value === "string" ? (
                        <p style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560" }}>{item.value}</p>
                      ) : item.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tim */}
              {project.teamMembers?.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "22px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>
                    Tim Proyek
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {project.teamMembers.map((member: string, i: number) => (
                      <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#266c87", fontWeight: 500, flexShrink: 0 }}>
                          {member.charAt(0)}
                        </div>
                        <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560" }}>{member}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ background: "#0F2830", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", padding: "22px", textAlign: "center" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#EEF4F6", marginBottom: "8px", lineHeight: 1.4 }}>
                  Tertarik berkolaborasi?
                </p>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.45)", marginBottom: "16px" }}>
                  Hubungi tim Manara untuk informasi lebih lanjut.
                </p>
                <Link href="/#contact"
                  style={{ display: "block", background: "#266c87", color: "#fff", padding: "11px", borderRadius: "2px", textDecoration: "none", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Hubungi Kami
                </Link>
              </div>

              {/* Kembali */}
              <Link href="/proyek"
                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#7A9AA5", textDecoration: "none" }}>
                ← Semua Proyek
              </Link>
            </div>
          </div>

          {/* Related projects */}
          {related.length > 0 && (
            <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "20px" }}>
                Proyek Lainnya
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }} className="three-col-grid">
                {related.map((p: any, i: number) => {
                  const rs = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING;
                  return (
                    <Link key={p.id} href={`/proyek/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "border-color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.3)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(38,108,135,0.1)"}
                      >
                        <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)", position: "relative" }}>
                          <span style={{ position: "absolute", top: "8px", left: "8px", fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "2px", background: rs.bg, color: rs.color }}>
                            {rs.label}
                          </span>
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                          <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>
                            {p.title}
                          </p>
                          {p.progress > 0 && (
                            <p style={{ fontSize: "11px", fontWeight: 500, color: rs.color, marginTop: "6px" }}>
                              {p.progress}%
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @media (max-width: 900px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .three-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}