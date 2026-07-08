"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ShareButtons from "@/components/shared/ShareButtons";

export default function PaperDetailPage() {
  const { slug } = useParams();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    publicationsApi.detail(String(slug))
      .then(r => {
        setPaper(r.data.data);
        if (r.data.data?.title) document.title = `${r.data.data.title} | Manara Paper`;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

const handleDownload = async () => {
  if (!paper?.pdfUrl) { alert("File tidak tersedia"); return; }
  setDownloading(true);
  try {
    // Increment count dulu
    await publicationsApi.download(paper.slug).catch(() => {});
    // Buka URL langsung — bukan dari window.open setelah await
    // tapi pakai anchor programmatic
    const a = document.createElement("a");
    a.href = paper.pdfUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    setDownloading(false);
  }
};

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat paper...</p>
      </div>
      <Footer />
    </main>
  );

  if (!paper) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>Paper tidak ditemukan.</p>
        <Link href="/publikasi/paper" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali ke Manara Paper</Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "100px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 clamp(20px,4vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "24px 0 20px", fontSize: "12px", color: "#B8CDD2", flexWrap: "wrap" }}>
            <Link href="/publikasi" style={{ color: "#B8CDD2", textDecoration: "none" }}>Publikasi</Link>
            <span>→</span>
            <Link href="/publikasi/paper" style={{ color: "#B8CDD2", textDecoration: "none" }}>Manara Paper</Link>
            <span>→</span>
            <span style={{ color: "#7A9AA5" }}>{paper.title}</span>
          </div>

          {/* Subtype + badges */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {paper.paperSubtype && (
              <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3F6F6A", border: "1px solid rgba(63,111,106,0.25)", padding: "4px 12px", borderRadius: "2px" }}>
                {paper.paperSubtype.replace(/_/g, " ")}
              </span>
            )}
            {paper.category && (
              <span style={{ fontSize: "11px", color: "#B8CDD2", border: "1px solid rgba(38,108,135,0.1)", padding: "4px 12px", borderRadius: "2px" }}>
                {paper.category.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,4vw,44px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.15, marginBottom: "20px" }}>
            {paper.title}
          </h1>

          {/* Authors */}
          {paper.authors?.length > 0 && (
            <p style={{ fontSize: "15px", color: "#7A9AA5", marginBottom: "24px" }}>
              Oleh: {paper.authors.join(", ")}
            </p>
          )}

          {/* Institutions */}
          {paper.institutions?.length > 0 && (
            <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "24px" }}>
              {paper.institutions.join(" · ")}
            </p>
          )}

          {/* Download button */}
          {paper.pdfUrl && (
              <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                publicationsApi.download(paper.slug).catch(() => {});
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#3F6F6A",
                color: "#fff",
                padding: "13px 28px",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: "2px",
                textDecoration: "none",
                marginBottom: "40px",
              }}
            >
              ↓ Unduh PDF
              <span style={{ fontSize: "11px", opacity: 0.6 }}>
                · {paper.downloadCount || 0} unduhan
              </span>
            </a>
          )}

        {/* Abstract */}
        {paper.abstract && (
          <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "36px", marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
              Abstrak
            </p>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.8, borderLeft: "3px solid #3F6F6A", paddingLeft: "20px" }}>
              {paper.abstract}
            </p>
          </div>
        )}

        {/* Keywords */}
        {paper.keywords?.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
              Kata Kunci
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {paper.keywords.map((kw: string) => (
                <span key={kw} style={{ fontSize: "13px", border: "1px solid rgba(38,108,135,0.15)", padding: "5px 14px", borderRadius: "2px", color: "#7A9AA5" }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <ShareButtons title={paper.title} />
          <Link href="/publikasi/paper" style={{ fontSize: "13px", color: "#B8CDD2", textDecoration: "none" }}>← Semua Paper</Link>
        </div>
      </div>
    </div>
      <Footer />
    </main>
  );
}