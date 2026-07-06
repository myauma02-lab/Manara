"use client";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import { RESEARCH_DATA } from "@/lib/services-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// Komponen list proyek
function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.list().then(r => setProjects(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section style={{ padding: "96px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "10px" }}>Portfolio</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, color: "#0F2830" }}>
              Proyek yang sudah kami kerjakan.
            </h2>
          </div>
          <Link href="/layanan/research" style={{ fontSize: "13px", color: "#266c87", textDecoration: "none", fontWeight: 500 }}>
            Lihat semua →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
          {projects.slice(0, 3).map(p => (
            <Link key={p.id} href={`/layanan/research/${p.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", transition: "border-color 0.2s" }}>
                <div style={{ aspectRatio: "16/9", background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                <div style={{ padding: "18px" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", marginBottom: "6px", lineHeight: 1.3 }}>{p.title}</p>
                  <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{p.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResearchLayananPage() {
  return (
    <>
      <ServicePageWrapper defaultData={RESEARCH_DATA} />
      <ProjectsList />
    </>
  );
}