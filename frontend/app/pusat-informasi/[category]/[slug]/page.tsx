"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { infoApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const CATEGORY_CONFIG: Record<string, { title: string; color: string; grad: string; listHref: string }> = {
  news:     { title: "News",       color: "#266c87", grad: "linear-gradient(135deg,#0F2830,#266c87)", listHref: "/pusat-informasi/news" },
  awards:   { title: "Awards",     color: "#C6AD8A", grad: "linear-gradient(135deg,#1a1208,#8A6E3E)", listHref: "/pusat-informasi/awards" },
  magazine: { title: "Magazine",   color: "#5F8F8A", grad: "linear-gradient(135deg,#0A1F1E,#2A5E59)", listHref: "/pusat-informasi/magazine" },
  agenda:   { title: "Key Agenda", color: "#8A8F5E", grad: "linear-gradient(135deg,#141408,#4A4E28)", listHref: "/pusat-informasi/agenda" },
};

export default function InfoDetailPage() {
  const { category, slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const config = CATEGORY_CONFIG[String(category)] || CATEGORY_CONFIG.news;

  useEffect(() => {
    infoApi.detail(String(slug))
      .then(r => {
        setItem(r.data.data);
        if (r.data.data?.title) document.title = `${r.data.data.title} | Manara`;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat...</p>
      </div>
      <Footer />
    </main>
  );

  if (!item) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>Konten tidak ditemukan.</p>
        <Link href={config.listHref} style={{ color: config.color, textDecoration: "none" }}>← Kembali</Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />

      {/* Cover */}
      <div style={{ height: "45vh", maxHeight: "480px", background: item.coverImage ? `url(${item.coverImage}) center/cover` : config.grad, marginTop: "64px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,40,48,0.1) 0%, rgba(244,247,247,1) 100%)" }} />
      </div>

      <div style={{ background: "#F4F7F7", paddingBottom: "120px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 clamp(20px,4vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "20px 0 16px", fontSize: "12px", color: "#B8CDD2", flexWrap: "wrap" }}>
            <Link href="/pusat-informasi" style={{ color: "#B8CDD2", textDecoration: "none" }}>Pusat Informasi</Link>
            <span>→</span>
            <Link href={config.listHref} style={{ color: "#B8CDD2", textDecoration: "none" }}>{config.title}</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>{item.title}</span>
          </div>

          {/* Meta badges */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: config.color + "15", color: config.color }}>
              {config.title}
            </span>
            {item.isFeatured && (
              <span style={{ fontSize: "11px", padding: "4px 12px", borderRadius: "2px", background: "rgba(38,108,135,0.08)", color: "#266c87" }}>★ Featured</span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,5vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.15, marginBottom: "20px" }}>
            {item.title}
          </h1>

          {/* Info khusus per type */}
          {item.type === "AWARD" && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {item.awardGiver && <div><p style={{ fontSize: "10px", color: "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Pemberi</p><p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{item.awardGiver}</p></div>}
              {item.awardYear && <div><p style={{ fontSize: "10px", color: "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Tahun</p><p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{item.awardYear}</p></div>}
              {item.awardCategory && <div><p style={{ fontSize: "10px", color: "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Kategori</p><p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{item.awardCategory}</p></div>}
            </div>
          )}

          {item.type === "AGENDA" && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {item.eventDate && <div><p style={{ fontSize: "10px", color: "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Tanggal</p><p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{new Date(item.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}{item.eventEndDate ? ` – ${new Date(item.eventEndDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p></div>}
              {item.eventLocation && <div><p style={{ fontSize: "10px", color: "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Lokasi</p><p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{item.eventLocation}</p></div>}
              {item.eventType && <div><p style={{ fontSize: "10px", color: "#B8CDD2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Tipe</p><p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{item.eventType}</p></div>}
            </div>
          )}

          {item.type === "MAGAZINE" && item.issueNumber && (
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5" }}>
                {item.issueNumber}{item.issueYear ? ` · ${item.issueYear}` : ""}
              </p>
            </div>
          )}

          {item.type === "NEWS" && (
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
              {item.source && <p style={{ fontSize: "13px", color: "#7A9AA5" }}>Sumber: {item.source}</p>}
              {item.publishedAt && <p style={{ fontSize: "13px", color: "#B8CDD2" }}>{new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
            </div>
          )}

          {/* Excerpt */}
          {item.excerpt && (
            <p style={{ fontFamily: "Georgia,serif", fontSize: "19px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.65, borderLeft: `3px solid ${config.color}`, paddingLeft: "20px", marginBottom: "36px" }}>
              {item.excerpt}
            </p>
          )}

          {/* Content */}
          {item.content && (
            <div className="prose" dangerouslySetInnerHTML={{ __html: item.content }} />
          )}

          {/* Download PDF untuk magazine */}
          {item.type === "MAGAZINE" && item.fileUrl && (
            <div style={{ marginTop: "32px" }}>
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: config.color, color: "#fff", padding: "13px 28px", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                📄 Baca / Unduh Majalah
              </a>
            </div>
          )}

          {/* External link untuk news */}
          {item.type === "NEWS" && item.externalUrl && (
            <div style={{ marginTop: "32px" }}>
              <a href={item.externalUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: config.color, border: `1px solid ${config.color}30`, padding: "11px 22px", borderRadius: "2px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                Baca Sumber Asli ↗
              </a>
            </div>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "40px", paddingTop: "28px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
              {item.tags.map((tag: string) => (
                <span key={tag} style={{ fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", padding: "4px 12px", borderRadius: "2px", color: "#7A9AA5" }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
            <Link href={config.listHref} style={{ fontSize: "13px", color: "#B8CDD2", textDecoration: "none" }}>
              ← Kembali ke {config.title}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}