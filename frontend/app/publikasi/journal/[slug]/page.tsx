"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ShareButtons from "@/components/shared/ShareButtons";

export default function JournalDetailPage() {
  const { slug } = useParams();
  const [journal, setJournal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    publicationsApi.detail(String(slug))
      .then(r => {
        setJournal(r.data.data);
        if (r.data.data?.title) document.title = `${r.data.data.title} | Manara Journal`;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDownload = async () => {
    if (!journal) return;
    setDownloading(true);
    try {
      const res = await publicationsApi.download(journal.slug);
      window.open(res.data.url, "_blank");
    } catch {
      alert("File tidak tersedia");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7F7", paddingTop: "80px" }}>
        <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat artikel jurnal...</p>
      </div>
      <Footer />
    </main>
  );

  if (!journal) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>Artikel tidak ditemukan.</p>
        <Link href="/publikasi/journal" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali ke Manara Journal</Link>
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
            <Link href="/publikasi/journal" style={{ color: "#B8CDD2", textDecoration: "none" }}>Manara Journal</Link>
          </div>

          {/* Volume / Issue / DOI */}
          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {journal.volume && (
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Volume</p>
                <p style={{ fontSize: "14px", color: "#3A5560", fontWeight: 500 }}>{journal.volume}</p>
              </div>
            )}
            {journal.issue && (
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Nomor</p>
                <p style={{ fontSize: "14px", color: "#3A5560", fontWeight: 500 }}>{journal.issue}</p>
              </div>
            )}
            {journal.year && (
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Tahun</p>
                <p style={{ fontSize: "14px", color: "#3A5560", fontWeight: 500 }}>{journal.year}</p>
              </div>
            )}
            {journal.doi && (
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>DOI</p>
                <p style={{ fontSize: "13px", color: "#5F8F8A", fontFamily: "monospace" }}>{journal.doi}</p>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,4vw,44px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.15, marginBottom: "20px" }}>
            {journal.title}
          </h1>

          {/* Authors */}
          {journal.authors?.length > 0 && (
            <p style={{ fontSize: "15px", color: "#3A5560", marginBottom: "8px", fontWeight: 400 }}>
              {journal.authors.join(" · ")}
            </p>
          )}

          {/* Institutions */}
          {journal.institutions?.length > 0 && (
            <p style={{ fontSize: "13px", color: "#B8CDD2", marginBottom: "24px" }}>
              {journal.institutions.join(", ")}
            </p>
          )}

          {/* Reviewers */}
          {journal.reviewers?.length > 0 && (
            <div style={{ marginBottom: "24px", padding: "12px 16px", background: "rgba(38,108,135,0.04)", borderRadius: "2px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>
                Peer Reviewer
              </p>
              <p style={{ fontSize: "13px", color: "#7A9AA5" }}>{journal.reviewers.join(", ")}</p>
            </div>
          )}

          {/* Download */}
          {journal.pdfUrl && (
            <a
              href={journal.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                publicationsApi.download(journal.slug).catch(() => {});
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#5F8F8A",
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
              ↓ Unduh Artikel (PDF)
              <span style={{ fontSize: "11px", opacity: 0.6 }}>
                · {journal.downloadCount || 0}
              </span>
            </a>
          )}

          {/* Abstract */}
          {journal.abstract && (
            <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "32px", marginBottom: "32px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Abstrak</p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.85, borderLeft: "3px solid #5F8F8A", paddingLeft: "20px" }}>
                {journal.abstract}
              </p>
            </div>
          )}

          {/* Keywords */}
          {journal.keywords?.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>Kata Kunci</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {journal.keywords.map((kw: string) => (
                  <span key={kw} style={{ fontSize: "13px", border: "1px solid rgba(38,108,135,0.15)", padding: "5px 14px", borderRadius: "2px", color: "#7A9AA5" }}>{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Citations */}
          {journal.citations?.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>
                Referensi / Sitasi
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {journal.citations.map((cite: string, i: number) => (
                  <p key={i} style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7, paddingLeft: "12px", borderLeft: "2px solid rgba(38,108,135,0.1)" }}>
                    {cite}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <ShareButtons title={journal.title} />
            <Link href="/publikasi/journal" style={{ fontSize: "13px", color: "#B8CDD2", textDecoration: "none" }}>← Semua Jurnal</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}