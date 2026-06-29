"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { researchApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function RisetDetailPage() {
  const { slug } = useParams();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    researchApi.detail(String(slug))
      .then(r => setPaper(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDownload = async () => {
    if (!paper?.pdfUrl) return;
    setDownloading(true);
    try {
      window.open(paper.pdfUrl, "_blank");
    } catch {
      alert("File tidak tersedia saat ini");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5" }}>Memuat paper...</p>
      </div>
      <Footer />
    </main>
  );

  if (!paper) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", color: "#7A9AA5", marginBottom: "16px" }}>Paper tidak ditemukan</p>
        <Link href="/riset" style={{ color: "#266c87", fontSize: "14px" }}>Kembali ke Riset</Link>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "100px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>

          <Link href="/riset" style={{ display: "block", fontSize: "12px", color: "#B8CDD2", textDecoration: "none", marginBottom: "40px", marginTop: "20px" }}>
            Kembali ke Riset
          </Link>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            {paper.year && <span style={{ fontSize: "11px", fontWeight: 500, color: "#266c87", border: "1px solid rgba(38,108,135,0.2)", padding: "4px 12px", borderRadius: "2px" }}>{paper.year}</span>}
            {paper.volume && <span style={{ fontSize: "11px", color: "#B8CDD2", border: "1px solid rgba(38,108,135,0.1)", padding: "4px 12px", borderRadius: "2px" }}>Vol. {paper.volume}</span>}
            {paper.issue && <span style={{ fontSize: "11px", color: "#B8CDD2", border: "1px solid rgba(38,108,135,0.1)", padding: "4px 12px", borderRadius: "2px" }}>No. {paper.issue}</span>}
            {paper.category && <span style={{ fontSize: "11px", color: "#B8CDD2", border: "1px solid rgba(38,108,135,0.1)", padding: "4px 12px", borderRadius: "2px" }}>{paper.category.name}</span>}
          </div>

          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.2, marginBottom: "24px" }}>
            {paper.title}
          </h1>

          {paper.authors?.length > 0 && (
            <p style={{ fontSize: "14px", color: "#7A9AA5", marginBottom: "32px" }}>
              Oleh: {paper.authors.join(", ")}
            </p>
          )}

          {paper.pdfUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#266c87", color: "#fff", padding: "14px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: "pointer", marginBottom: "48px", opacity: downloading ? 0.7 : 1 }}
            >
              {downloading ? "Membuka..." : "Unduh PDF"}
              <span style={{ fontSize: "11px", opacity: 0.7 }}>· {paper.downloadCount} unduhan</span>
            </button>
          )}

          {paper.doi && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", marginBottom: "32px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>DOI</p>
              <p style={{ fontSize: "13px", color: "#266c87", fontFamily: "monospace" }}>{paper.doi}</p>
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "40px", marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>Abstrak</p>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.8, borderLeft: "2px solid #266c87", paddingLeft: "20px" }}>
              {paper.abstract}
            </p>
          </div>

          {paper.keywords?.length > 0 && (
            <div>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>Kata Kunci</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {paper.keywords.map((kw: string) => (
                  <span key={kw} style={{ fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", padding: "5px 14px", borderRadius: "2px", color: "#7A9AA5" }}>
                    {kw}
                  </span>
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