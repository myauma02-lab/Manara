import { serverPublicationsApi } from "@/lib/server-api";
import Link from "next/link";

export default async function ResearchSection() {
  const [paperData, journalData] = await Promise.all([
    serverPublicationsApi.list({ type: "PAPER", limit: "3" }),
    serverPublicationsApi.list({ type: "JOURNAL", limit: "2" }),
  ]);
  const papers = [...(paperData || []), ...(journalData || [])].slice(0, 4);
  const isEmpty = papers.length === 0;

  const TYPE_STYLE: Record<string, { color: string; label: string }> = {
    PAPER: { color: "#3F6F6A", label: "Paper" },
    JOURNAL: { color: "#5F8F8A", label: "Journal" },
  };

  return (
    <section style={{ padding: "100px 0", background: "#F8FAFA" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "12px" }}>
              Riset & Wawasan
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14 }}>
              Gagasan yang ditopang<br />
              <em style={{ color: "#266c87", fontStyle: "italic" }}>inkuiri yang cermat.</em>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/publikasi/paper" style={{ fontSize: "13px", fontWeight: 500, color: "#3F6F6A", textDecoration: "none" }}>
              Paper →
            </Link>
            <Link href="/publikasi/journal" style={{ fontSize: "13px", fontWeight: 500, color: "#5F8F8A", textDecoration: "none" }}>
              Journal →
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div style={{ background: "#0F2830", borderRadius: "4px", padding: "64px", textAlign: "center", border: "1px solid rgba(38,108,135,0.1)" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, fontStyle: "italic", color: "rgba(238,244,246,0.5)", marginBottom: "12px" }}>
              Paper pertama segera hadir.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.2)", padding: "8px 20px", borderRadius: "2px", color: "#86AFAA", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block" }} />
              Manara Papers
            </div>
          </div>
        )}

        {/* List papers */}
        {papers.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {papers.map(p => {
              const ts = TYPE_STYLE[p.type] || TYPE_STYLE.PAPER;
              const href = p.type === "JOURNAL"
                ? `/publikasi/journal/${p.slug}`
                : `/publikasi/paper/${p.slug}`;
              return (
                <Link key={p.id} href={href} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff",
                    border: "1px solid rgba(38,108,135,0.1)",
                    borderRadius: "4px",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    transition: "all 0.2s",
                  }} className="research-row"
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "5px", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: ts.color, border: `1px solid ${ts.color}30`, padding: "2px 8px", borderRadius: "2px" }}>
                          {ts.label}
                        </span>
                        {p.paperSubtype && (
                          <span style={{ fontSize: "10px", color: "#B8CDD2" }}>
                            {p.paperSubtype.replace(/_/g, " ")}
                          </span>
                        )}
                        {p.year && (
                          <span style={{ fontSize: "10px", color: "#B8CDD2" }}>· {p.year}</span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(16px,2vw,20px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                        {p.title}
                      </h3>
                      {p.authors?.length > 0 && (
                        <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "4px" }}>
                          {p.authors.slice(0, 2).join(", ")}{p.authors.length > 2 ? " et al." : ""}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                      {p.pdfUrl && (
                        <span style={{ fontSize: "11px", color: ts.color, fontWeight: 500 }}>PDF ↓</span>
                      )}
                      {p.downloadCount > 0 && (
                        <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{p.downloadCount} unduhan</span>
                      )}
                    </div>
                    <span style={{ fontSize: "18px", color: "#B8CDD2", flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        .research-row:hover { border-color: rgba(38,108,135,0.3) !important; }
        @media (max-width: 640px) {
          .research-row { padding: 16px !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}
