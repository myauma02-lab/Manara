"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { publicationsApi, categoriesApi } from "@/lib/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8CDD2" }}>
      Memuat editor...
    </div>
  ),
});

const TYPE_META = {
  ARTICLE: { label: "Artikel", color: "#266c87", subtypes: ["OPINION", "ESSAY", "ANALYSIS", "COMMENTARY", "OTHER"], hasContent: true, hasPdf: false, hasAcademic: false },
  PAPER: { label: "Manara Paper", color: "#3F6F6A", subtypes: ["POLICY_PAPER", "WORKING_PAPER", "POLICY_BRIEF", "WHITE_PAPER", "RESEARCH_NOTE"], hasContent: false, hasPdf: true, hasAcademic: false },
  JOURNAL: { label: "Manara Journal", color: "#5F8F8A", subtypes: [], hasContent: false, hasPdf: true, hasAcademic: true },
};

export default function EditPublikasiPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [authorsInput, setAuthorsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [reviewersInput, setReviewersInput] = useState("");
  const [citationsInput, setCitationsInput] = useState("");
  const [autoSaved, setAutoSaved] = useState<string | null>(null);
  const [pub, setPub] = useState<any>(null);

  const [form, setForm] = useState({
    type: "ARTICLE" as keyof typeof TYPE_META,
    title: "", excerpt: "", content: "", abstract: "",
    status: "DRAFT", categoryId: "", isFeatured: false,
    articleSubtype: "", paperSubtype: "", institutions: "",
    volume: "", issue: "", year: "", doi: "", issn: "",
  });

  const meta = TYPE_META[form.type] || TYPE_META.ARTICLE;

  useEffect(() => {
    Promise.all([
      publicationsApi.adminList({ limit: 200 }),
      categoriesApi.list(),
    ]).then(([pubRes, catRes]) => {
      const found = pubRes.data.data?.find((p: any) => p.id === id);
      if (found) {
        setPub(found);
        setForm({
          type: found.type || "ARTICLE",
          title: found.title || "",
          excerpt: found.excerpt || "",
          content: found.content || "",
          abstract: found.abstract || "",
          status: found.status || "DRAFT",
          categoryId: found.categoryId || "",
          isFeatured: found.isFeatured || false,
          articleSubtype: found.articleSubtype || "",
          paperSubtype: found.paperSubtype || "",
          institutions: (found.institutions || []).join(", "),
          volume: found.volume?.toString() || "",
          issue: found.issue?.toString() || "",
          year: found.year?.toString() || "",
          doi: found.doi || "",
          issn: found.issn || "",
        });
        setAuthorsInput((found.authors || []).join(", "));
        setKeywordsInput((found.keywords || []).join(", "));
        setReviewersInput((found.reviewers || []).join(", "));
        setCitationsInput((found.citations || []).join("\n"));
        if (found.coverImage) setCoverPreview(found.coverImage);
      }
      setCategories(catRes.data.data || []);
    }).finally(() => setLoading(false));
  }, [id]);

  // Autosave
  useEffect(() => {
    if (loading || !form.title) return;
    const t = setTimeout(() => setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })), 5000);
    return () => clearTimeout(t);
  }, [form.title, form.content, form.abstract, loading]);

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("status", status);
      fd.append("isFeatured", String(form.isFeatured));
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      if (form.abstract) fd.append("abstract", form.abstract);
      if (form.categoryId) fd.append("categoryId", form.categoryId);
      if (form.articleSubtype) fd.append("articleSubtype", form.articleSubtype);
      if (form.paperSubtype) fd.append("paperSubtype", form.paperSubtype);
      if (form.volume) fd.append("volume", form.volume);
      if (form.issue) fd.append("issue", form.issue);
      if (form.year) fd.append("year", form.year);
      if (form.doi) fd.append("doi", form.doi);
      if (form.issn) fd.append("issn", form.issn);
      fd.append("authors", JSON.stringify(authorsInput.split(",").map(a => a.trim()).filter(Boolean)));
      fd.append("keywords", JSON.stringify(keywordsInput.split(",").map(k => k.trim()).filter(Boolean)));
      fd.append("reviewers", JSON.stringify(reviewersInput.split(",").map(r => r.trim()).filter(Boolean)));
      fd.append("citations", JSON.stringify(citationsInput.split("\n").map(c => c.trim()).filter(Boolean)));
      fd.append("institutions", JSON.stringify(form.institutions.split(",").map(i => i.trim()).filter(Boolean)));
      if (coverFile) fd.append("cover", coverFile);
      if (pdfFile) fd.append("pdf", pdfFile);
      await publicationsApi.update(String(id), fd);
      setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
      if (status === "PUBLISHED") { alert("✓ Dipublikasikan!"); router.push("/admin/publikasi"); }
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 500 as const,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "#7A9AA5", marginBottom: "7px",
  };

  if (loading) return <div style={{ padding: "40px", color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>Memuat publikasi...</div>;
  if (!pub) return (
    <div style={{ padding: "40px" }}>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", color: "#7A9AA5", marginBottom: "16px" }}>Publikasi tidak ditemukan.</p>
      <Link href="/admin/publikasi" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali</Link>
    </div>
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1040px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin/publikasi" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "2px", background: TYPE_META[form.type]?.color + "15", color: TYPE_META[form.type]?.color }}>
              {TYPE_META[form.type]?.label}
            </span>
            <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Edit</p>
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830" }}>
            {form.title || "Tanpa Judul"}
          </h1>
        </div>
        {autoSaved && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>✓ Tersimpan {autoSaved}</p>}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleSubmit("DRAFT")} disabled={saving}
            style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Simpan
          </button>
          <button onClick={() => handleSubmit("REVIEW")} disabled={saving}
            style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid ${meta.color}40`, borderRadius: "2px", background: "transparent", color: meta.color, cursor: "pointer" }}>
            Submit Review
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving}
            style={{ padding: "9px 22px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: form.status === "PUBLISHED" ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "..." : form.status === "PUBLISHED" ? "Update" : "Publikasikan"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Judul + excerpt */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
            <label style={labelStyle}>Judul *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ ...inputStyle, fontSize: "20px", fontFamily: "Georgia,serif", fontWeight: 300, border: "none", borderBottom: "2px solid rgba(38,108,135,0.1)", borderRadius: "0", padding: "8px 0" }} />
            {meta.hasContent && (
              <div style={{ marginTop: "16px" }}>
                <label style={labelStyle}>Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2} style={{ ...inputStyle, resize: "none", fontStyle: "italic", color: "#3A5560" }} />
              </div>
            )}
          </div>

          {/* Content / Abstract */}
          {meta.hasContent ? (
            <div>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Konten Artikel</p>
                </div>
                <RichTextEditor value={form.content} onChange={content => setForm(f => ({ ...f, content }))} minHeight="450px" />
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>Abstrak *</label>
              <textarea value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))}
                rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.85 }} />
            </div>
          )}

          {/* Authors / Keywords (Paper & Journal) */}
          {!meta.hasContent && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>Penulis (koma)</label>
              <input value={authorsInput} onChange={e => setAuthorsInput(e.target.value)} style={{ ...inputStyle, marginBottom: "12px" }} />
              <label style={labelStyle}>Institusi (koma)</label>
              <input value={form.institutions} onChange={e => setForm(f => ({ ...f, institutions: e.target.value }))} style={{ ...inputStyle, marginBottom: "12px" }} />
              <label style={labelStyle}>Kata Kunci (koma)</label>
              <input value={keywordsInput} onChange={e => setKeywordsInput(e.target.value)} style={inputStyle} />
            </div>
          )}

          {/* PDF */}
          {meta.hasPdf && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>File PDF</label>
              {pub.pdfUrl && !pdfFile && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(38,108,135,0.05)", borderRadius: "2px", marginBottom: "10px" }}>
                  <span>📄</span>
                  <a href={pub.pdfUrl} target="_blank" style={{ fontSize: "13px", color: "#266c87", textDecoration: "none" }}>File PDF saat ini</a>
                  <span style={{ fontSize: "11px", color: "#B8CDD2" }}>· Ganti di bawah</span>
                </div>
              )}
              {pdfFile ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px" }}>
                  <span>📄</span>
                  <p style={{ flex: 1, fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{pdfFile.name}</p>
                  <button onClick={() => setPdfFile(null)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Hapus</button>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100px", border: "2px dashed rgba(38,108,135,0.2)", borderRadius: "4px", cursor: "pointer", gap: "4px" }}>
                  <span style={{ fontSize: "24px" }}>📄</span>
                  <p style={{ fontSize: "12px", color: "#7A9AA5" }}>Upload PDF baru (opsional)</p>
                  <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                </label>
              )}
            </div>
          )}

          {/* Journal fields */}
          {meta.hasAcademic && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>Info Jurnal</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: "12px", marginBottom: "14px" }}>
                {[
                  { key: "volume", label: "Volume", ph: "1" },
                  { key: "issue", label: "Nomor", ph: "1" },
                  { key: "year", label: "Tahun", ph: "2026" },
                  { key: "doi", label: "DOI", ph: "10.xxxx/xxxxx" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form] as string}
                      onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))}
                      placeholder={f.ph} style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
                  </div>
                ))}
              </div>
              <label style={labelStyle}>ISSN</label>
              <input value={form.issn} onChange={e => setForm(f => ({ ...f, issn: e.target.value }))} style={{ ...inputStyle, maxWidth: "160px", marginBottom: "14px" }} />
              <label style={labelStyle}>Reviewer (koma)</label>
              <input value={reviewersInput} onChange={e => setReviewersInput(e.target.value)} style={{ ...inputStyle, marginBottom: "14px" }} />
              <label style={labelStyle}>Sitasi (satu per baris)</label>
              <textarea value={citationsInput} onChange={e => setCitationsInput(e.target.value)}
                rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} />
            </div>
          )}
        </div>

        {/* RIGHT sidebar — sama dengan form new */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Cover */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>Cover</p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: meta.hasPdf ? "3/4" : "16/9", objectFit: "cover", borderRadius: "2px", display: "block" }} />
                <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                  <label style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "2px", cursor: "pointer" }}>
                    Ganti
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
                  </label>
                  <button onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    style={{ background: "rgba(248,113,113,0.8)", color: "#fff", border: "none", fontSize: "11px", padding: "4px 8px", borderRadius: "2px", cursor: "pointer" }}>×</button>
                </div>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: meta.hasPdf ? "3/4" : "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "6px" }}>
                <span style={{ fontSize: "22px", color: "#B8CDD2" }}>+</span>
                <p style={{ fontSize: "11px", color: "#B8CDD2", textAlign: "center" }}>Upload cover</p>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Settings */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>

            {form.type === "ARTICLE" && (
              <div>
                <label style={labelStyle}>Tipe Artikel</label>
                <select value={form.articleSubtype} onChange={e => setForm(f => ({ ...f, articleSubtype: e.target.value }))}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                  <option value="">Pilih tipe</option>
                  {TYPE_META.ARTICLE.subtypes.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            )}

            {form.type === "PAPER" && (
              <div>
                <label style={labelStyle}>Tipe Paper</label>
                <select value={form.paperSubtype} onChange={e => setForm(f => ({ ...f, paperSubtype: e.target.value }))}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                  <option value="">Pilih tipe</option>
                  {TYPE_META.PAPER.subtypes.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            )}

            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                <option value="">Tanpa Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#266c87", marginTop: "2px" }} />
              <div>
                <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Artikel Unggulan</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di posisi utama</span>
              </div>
            </label>
          </div>

          {/* Info publikasi */}
          {pub && (
            <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", padding: "14px 16px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Info</p>
              <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Penulis: {pub.author?.name}</p>
              <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Dibuat: {new Date(pub.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              {pub.publishedAt && <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Dipublish: {new Date(pub.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
              <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "8px" }}>Views: {pub.viewCount || 0}</p>
              <div style={{ borderTop: "1px solid rgba(38,108,135,0.08)", paddingTop: "8px" }}>
                <p style={{ fontSize: "11px", color: "#B8CDD2", marginBottom: "2px" }}>Slug:</p>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#266c87", wordBreak: "break-all" }}>{pub.slug}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}