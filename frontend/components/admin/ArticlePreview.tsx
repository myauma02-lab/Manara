"use client";

interface Props {
  article: {
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    mediaType: string;
    author?: string;
  };
  onClose: () => void;
}

export default function ArticlePreview({ article, onClose }: Props) {
  const text = article.content.replace(/<[^>]*>/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,40,48,0.6)", zIndex: 200, overflowY: "auto", backdropFilter: "blur(4px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: "760px", margin: "40px auto", background: "#F4F7F7", borderRadius: "4px", overflow: "hidden", boxShadow: "0 32px 80px rgba(15,40,48,0.3)" }}
      >
        {/* Preview header */}
        <div style={{ background: "#0F2830", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(134,175,170,0.6)" }}>
              Preview Artikel
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(134,175,170,0.4)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Cover */}
        {article.coverImage ? (
          <div style={{ height: "280px", background: `url(${article.coverImage}) center/cover` }} />
        ) : (
          <div style={{ height: "220px", background: "linear-gradient(135deg,#0F2830,#266c87)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Georgia,serif", fontSize: "80px", fontStyle: "italic", color: "rgba(255,255,255,0.07)" }}>
              {article.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "48px" }}>
          {/* Meta */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87" }}>
              {article.mediaType}
            </span>
            <span style={{ color: "#B8CDD2", fontSize: "12px" }}>·</span>
            <span style={{ fontSize: "12px", color: "#B8CDD2" }}>{readTime} menit baca</span>
            {article.author && (
              <>
                <span style={{ color: "#B8CDD2", fontSize: "12px" }}>·</span>
                <span style={{ fontSize: "12px", color: "#B8CDD2" }}>{article.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14, marginBottom: "20px" }}>
            {article.title || "Tanpa Judul"}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, fontStyle: "italic", color: "#3A5560", lineHeight: 1.7, borderLeft: "2px solid #266c87", paddingLeft: "20px", marginBottom: "36px" }}>
              {article.excerpt}
            </p>
          )}

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(38,108,135,0.1)", marginBottom: "36px" }} />

          {/* Body */}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>Belum ada konten.</p>" }}
            style={{ fontSize: "17px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9 }}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 48px", background: "#fff", borderTop: "1px solid rgba(38,108,135,0.08)", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "10px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Tutup Preview
          </button>
        </div>
      </div>

      {/* Prose styles di dalam preview */}
      <style>{`
        .article-prose h1 { font-family: Georgia,serif; font-size: 2em; font-weight: 300; color: #0F2830; margin: 1.5em 0 0.5em; line-height: 1.2; }
        .article-prose h2 { font-family: Georgia,serif; font-size: 1.5em; font-weight: 400; color: #0F2830; margin: 1.4em 0 0.4em; }
        .article-prose h3 { font-size: 1.2em; font-weight: 500; color: #1C3038; margin: 1.3em 0 0.4em; }
        .article-prose p { margin-bottom: 1.4em; }
        .article-prose blockquote { border-left: 3px solid #266c87; padding: 4px 20px; margin: 1.5em 0; color: #3A5560; font-style: italic; background: rgba(38,108,135,0.03); }
        .article-prose img { max-width: 100%; border-radius: 4px; margin: 1.5em 0; }
        .article-prose a { color: #266c87; }
        .article-prose ul, .article-prose ol { padding-left: 1.5em; margin-bottom: 1.4em; }
        .article-prose li { margin-bottom: 0.5em; }
        .article-prose code { background: rgba(38,108,135,0.08); padding: 2px 6px; border-radius: 2px; font-family: monospace; font-size: 0.9em; color: #266c87; }
        .article-prose pre { background: rgba(38,108,135,0.05); padding: 16px; border-radius: 4px; overflow-x: auto; margin: 1.5em 0; }
        .article-prose pre code { background: none; padding: 0; }
      `}</style>
    </div>
  );
}