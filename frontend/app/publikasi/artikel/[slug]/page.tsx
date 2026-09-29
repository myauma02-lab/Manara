import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ReadingProgress from "@/components/shared/ReadingProgress";
import ShareButtons from "@/components/shared/ShareButtons";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { serverPublicationsApi } from "@/lib/server-api";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await serverPublicationsApi.detail(slug);
  return {
    title: article?.title ? `${article.title} | Manara` : "Artikel Manara",
    description: article?.excerpt || "Artikel terbaru dari Manara.",
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [article, relatedData] = await Promise.all([
    serverPublicationsApi.detail(slug),
    serverPublicationsApi.list({ type: "ARTICLE", limit: "4" }),
  ]);
  const related = (relatedData || []).filter((item: any) => item.slug !== slug).slice(0, 3);

  const getReadTime = (content: string) => {
    const words = content?.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (!article) return (
    <main>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F4F7F7" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", color: "#7A9AA5", marginBottom: "16px" }}>Artikel tidak ditemukan.</p>
        <Link href="/publikasi/artikel" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali ke Artikel</Link>
      </div>
      <Footer />
    </main>
  );

  const readTime = getReadTime(article.content || "");

  return (
    <main>
      <Navbar />
      <ReadingProgress />

      {article.coverImage && (
        <div style={{ height: "50vh", maxHeight: "520px", background: `url(${article.coverImage}) center/cover`, marginTop: "64px", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,40,48,0.1) 0%, rgba(244,247,247,1) 100%)" }} />
        </div>
      )}

      <div style={{ background: "#F4F7F7", paddingBottom: "120px", paddingTop: article.coverImage ? "0" : "100px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 clamp(20px,4vw,40px)" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "28px 0 20px", fontSize: "12px", color: "#B8CDD2", flexWrap: "wrap" }}>
            <Link href="/publikasi" style={{ color: "#B8CDD2", textDecoration: "none" }}>Publikasi</Link>
            <span>→</span>
            <Link href="/publikasi/artikel" style={{ color: "#B8CDD2", textDecoration: "none" }}>Artikel</Link>
            {article.category && (
              <>
                <span>→</span>
                <span style={{ color: "#7A9AA5" }}>{article.category.name}</span>
              </>
            )}
          </div>

          {/* Subtype badge */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {article.articleSubtype && (
              <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87", background: "rgba(38,108,135,0.08)", padding: "4px 12px", borderRadius: "2px" }}>
                {article.articleSubtype}
              </span>
            )}
            {article.isFeatured && (
              <span style={{ fontSize: "10px", fontWeight: 500, color: "#5F8F8A", background: "rgba(95,143,138,0.1)", padding: "4px 10px", borderRadius: "2px" }}>
                ★ Unggulan
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,5vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.12, marginBottom: "24px" }}>
            {article.title}
          </h1>

          {/* Meta bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0", marginBottom: "12px", borderTop: "1px solid rgba(38,108,135,0.08)", borderBottom: "1px solid rgba(38,108,135,0.08)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#266c87", fontWeight: 500, flexShrink: 0 }}>
                {article.author?.name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>{article.author?.name}</p>
                {article.publishedAt && (
                  <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginLeft: "auto", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#B8CDD2" }}>⏱ {readTime} menit</span>
              <span style={{ fontSize: "12px", color: "#B8CDD2" }}>👁 {article.viewCount || 0}</span>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p style={{ fontFamily: "Georgia,serif", fontSize: "19px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.65, borderLeft: "3px solid #266c87", paddingLeft: "20px", marginBottom: "40px", marginTop: "28px" }}>
              {article.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose has-dropcap" dangerouslySetInnerHTML={{ __html: sanitizeRichText(article.content) }} />

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "48px", paddingTop: "28px", borderTop: "1px solid rgba(38,108,135,0.1)" }}>
              {article.tags.map((t: any) => (
                <span key={t.tag?.id} style={{ fontSize: "12px", border: "1px solid rgba(38,108,135,0.15)", padding: "4px 12px", borderRadius: "2px", color: "#7A9AA5" }}>
                  #{t.tag?.name}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(38,108,135,0.1)", flexWrap: "wrap", gap: "12px" }}>
            <ShareButtons title={article.title} />
            <Link href="/publikasi/artikel" style={{ fontSize: "13px", color: "#B8CDD2", textDecoration: "none" }}>← Semua Artikel</Link>
          </div>

          {/* Author card */}
          {article.author && (
            <div style={{ marginTop: "40px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px 28px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(38,108,135,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#266c87", fontWeight: 500, flexShrink: 0 }}>
                {article.author.name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Tentang Penulis</p>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 400, color: "#0F2830", marginBottom: "4px" }}>{article.author.name}</p>
                {article.author.bio && (
                  <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>{article.author.bio}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px clamp(20px,5vw,40px) 0" }}>
            <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", paddingTop: "48px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "24px" }}>
                Artikel Lainnya
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
                {related.map(r => (
                  <Link key={r.id} href={`/publikasi/artikel/${r.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ aspectRatio: "16/9", background: r.coverImage ? `url(${r.coverImage}) center/cover` : "linear-gradient(135deg,#0F2830,#266c87)" }} />
                      <div style={{ padding: "16px" }}>
                        <p style={{ fontSize: "10px", color: "#266c87", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{r.articleSubtype || "ARTIKEL"}</p>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "#0F2830", lineHeight: 1.3 }}>{r.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
