"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { publicationsApi, categoriesApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8CDD2" }}>
      Memuat editor...
    </div>
  ),
});

type PubType = "ARTICLE" | "PAPER" | "JOURNAL";

const TYPE_META: Record<PubType, any> = {
  ARTICLE: { label: "Artikel", color: "#266c87", subtypes: ["OPINION", "ESSAY", "ANALYSIS", "COMMENTARY", "OTHER"], hasContent: true, hasPdf: false, hasAcademic: false },
  PAPER: { label: "Manara Paper", color: "#3F6F6A", subtypes: ["POLICY_PAPER", "WORKING_PAPER", "POLICY_BRIEF", "WHITE_PAPER", "RESEARCH_NOTE"], hasContent: false, hasPdf: true, hasAcademic: false },
  JOURNAL: { label: "Manara Journal", color: "#5F8F8A", subtypes: [], hasContent: false, hasPdf: true, hasAcademic: true },
};

const EDITOR_ROLES = ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"];

export default function PublicationForm({ type, id, basePath }: { type: PubType; id?: string; basePath: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const meta = TYPE_META[type];
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState<string | null>(null);
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
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", abstract: "",
    categoryId: "", isFeatured: false,
    articleSubtype: "", paperSubtype: "", institutions: "",
    volume: "", issue: "", year: new Date().getFullYear().toString(), doi: "", issn: "",
  });

  const canReview = !!user && EDITOR_ROLES.includes(user.role);
  const isOwner = isEdit ? pub?.authorId === user?.id : true;
  // Writer cuma bisa ubah konten selama masih DRAFT & miliknya sendiri.
  // Editor/Admin selalu bisa mengubah, kapan pun statusnya.
  const canEditContent = !isEdit || canReview || (isOwner && pub?.status === "DRAFT");
  const disabled = isEdit && !canEditContent;

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data.data || [])).catch(() => {});
    if (isEdit) {
      publicationsApi.adminList({ type, limit: 300 })
        .then(r => {
          const found = (r.data.data || []).find((p: any) => p.id === id);
          if (found) {
            setPub(found);
            setForm({
              title: found.title || "", excerpt: found.excerpt || "", content: found.content || "",
              abstract: found.abstract || "", categoryId: found.categoryId || "", isFeatured: found.isFeatured || false,
              articleSubtype: found.articleSubtype || "", paperSubtype: found.paperSubtype || "",
              institutions: (found.institutions || []).join(", "),
              volume: found.volume?.toString() || "", issue: found.issue?.toString() || "",
              year: found.year?.toString() || "", doi: found.doi || "", issn: found.issn || "",
            });
            setAuthorsInput((found.authors || []).join(", "));
            setKeywordsInput((found.keywords || []).join(", "));
            setReviewersInput((found.reviewers || []).join(", "));
            setCitationsInput((found.citations || []).join("\n"));
            if (found.coverImage) setCoverPreview(found.coverImage);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, type]);

  const handleSubmit = async (status: string, extra?: Record<string, string>) => {
    if (!form.title.trim()) { setError("Judul wajib diisi"); return; }
    if (meta.hasContent && status !== "DRAFT" && !form.content.trim()) { setError("Konten wajib diisi"); return; }
    if (!meta.hasContent && status !== "DRAFT" && !form.abstract.trim()) { setError("Abstrak wajib diisi"); return; }

    setSaving(status);
    setError("");
    try {
      const fd = new FormData();
      if (!isEdit) fd.append("type", type);
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
      Object.entries(extra || {}).forEach(([k, v]) => fd.append(k, v));

      if (isEdit) await publicationsApi.update(id as string, fd);
      else await publicationsApi.create(fd);

      setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
      if (!isEdit || ["PUBLISHED", "REVIEW", "ARCHIVED"].includes(status)) router.push(basePath);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(null);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 500 as const, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#7A9AA5", marginBottom: "7px" };

  if (loading) return <div style={{ padding: "40px" }}><p style={{ fontFamily: "Georgia,serif", color: "#B8CDD2" }}>Memuat...</p></div>;
  if (isEdit && !pub) {
    return (
      <div style={{ padding: "40px" }}>
        <p style={{ fontFamily: "Georgia,serif", color: "#B8CDD2", marginBottom: "12px" }}>{meta.label} tidak ditemukan.</p>
        <Link href={basePath} style={{ color: "#266c87", fontSize: "13px" }}>← Kembali</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1040px" }}>
      {/* Header + tombol aksi */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Link href={basePath} style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>
            {isEdit ? `Edit ${meta.label}` : `${meta.label} Baru`}
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830" }}>{form.title || `${meta.label} Baru`}</h1>
        </div>
        {autoSaved && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>✓ Tersimpan {autoSaved}</p>}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {!disabled && (!isEdit || pub?.status === "DRAFT" || canReview) && (
            <button onClick={() => handleSubmit("DRAFT")} disabled={saving !== null}
              style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
              {saving === "DRAFT" ? "..." : "Simpan Draft"}
            </button>
          )}

          {!disabled && !canReview && (!isEdit || pub?.status === "DRAFT") && (
            <button onClick={() => handleSubmit("REVIEW")} disabled={saving !== null}
              style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid ${meta.color}40`, borderRadius: "2px", background: "transparent", color: meta.color, cursor: "pointer" }}>
              {saving === "REVIEW" ? "..." : "Kirim untuk Review"}
            </button>
          )}

          {canReview && (!isEdit || ["DRAFT", "REVIEW"].includes(pub?.status)) && (
            <button onClick={() => handleSubmit("PUBLISHED", { publishedAt: new Date().toISOString() })} disabled={saving !== null}
              style={{ padding: "9px 22px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving === "PUBLISHED" ? "..." : "Publikasikan"}
            </button>
          )}

          {canReview && isEdit && pub?.status === "REVIEW" && (
            <button onClick={() => handleSubmit("DRAFT")} disabled={saving !== null}
              style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "2px", background: "transparent", color: "#f59e0b", cursor: "pointer" }}>
              Minta Revisi
            </button>
          )}

          {canReview && isEdit && pub?.status === "PUBLISHED" && (
            <button onClick={() => handleSubmit("ARCHIVED")} disabled={saving !== null}
              style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(100,116,139,0.3)", borderRadius: "2px", background: "transparent", color: "#64748b", cursor: "pointer" }}>
              Arsipkan
            </button>
          )}

          {canReview && isEdit && pub?.status === "ARCHIVED" && (
            <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving !== null}
              style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#3F6F6A", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer" }}>
              Terbitkan Ulang
            </button>
          )}
        </div>
      </div>

      {isEdit && pub?.status === "REVIEW" && !canReview && (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "2px", padding: "12px 18px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#b45309" }}>{meta.label} ini sedang menunggu review editor. Kamu bisa edit lagi kalau diminta revisi.</p>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "2px", padding: "10px 18px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }} className="pub-form-grid">
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", opacity: disabled ? 0.7 : 1, pointerEvents: disabled ? "none" : "auto" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
            <label style={labelStyle}>Judul *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={`Judul ${meta.label}...`}
              style={{ ...inputStyle, fontSize: "20px", fontFamily: "Georgia,serif", fontWeight: 300, border: "none", borderBottom: "2px solid rgba(38,108,135,0.1)", borderRadius: "0", padding: "8px 0" }} />
            {meta.hasContent && (
              <div style={{ marginTop: "16px" }}>
                <label style={labelStyle}>Ringkasan / Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Ringkasan singkat untuk daftar & preview media sosial..."
                  rows={2} style={{ ...inputStyle, resize: "none", fontStyle: "italic", color: "#3A5560" }} />
              </div>
            )}
          </div>

          {meta.hasContent && (
            <div>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Konten Artikel *</p>
                </div>
                <RichTextEditor value={form.content} onChange={content => setForm(f => ({ ...f, content }))} placeholder="Mulai menulis di sini..." minHeight="450px" />
              </div>
              {form.content && (
                <div style={{ display: "flex", gap: "16px", padding: "8px 16px", background: "rgba(38,108,135,0.04)" }}>
                  {(() => {
                    const text = form.content.replace(/<[^>]*>/g, " ").trim();
                    const words = text.split(/\s+/).filter(Boolean).length;
                    return (<><span style={{ fontSize: "11px", color: "#B8CDD2" }}>{words.toLocaleString("id")} kata</span><span style={{ fontSize: "11px", color: "#B8CDD2" }}>~{Math.max(1, Math.ceil(words / 200))} menit baca</span></>);
                  })()}
                </div>
              )}
            </div>
          )}

          {!meta.hasContent && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>Abstrak *</label>
              <textarea value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))}
                placeholder="Tujuan, metodologi, temuan, dan kesimpulan..." rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.85 }} />
              <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "6px" }}>{form.abstract.split(/\s+/).filter(Boolean).length} kata</p>
            </div>
          )}

          {!meta.hasContent && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>Penulis (koma)</label>
              <input value={authorsInput} onChange={e => setAuthorsInput(e.target.value)} placeholder="Ahmad Rasyid, Sari Andini..." style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: "16px" }}>Institusi / Afiliasi (koma)</label>
              <input value={form.institutions} onChange={e => setForm(f => ({ ...f, institutions: e.target.value }))} placeholder="Universitas Brawijaya, Manara Research..." style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: "16px" }}>Kata Kunci (koma)</label>
              <input value={keywordsInput} onChange={e => setKeywordsInput(e.target.value)} placeholder="kebijakan publik, riset..." style={inputStyle} />
            </div>
          )}

          {meta.hasPdf && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>File PDF</label>
              {pdfFile ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px" }}>
                  <span style={{ fontSize: "24px" }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{pdfFile.name}</p>
                    <p style={{ fontSize: "11px", color: "#7A9AA5" }}>{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={() => setPdfFile(null)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Hapus</button>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "120px", border: "2px dashed rgba(38,108,135,0.2)", borderRadius: "4px", cursor: "pointer", gap: "6px" }}>
                  <span style={{ fontSize: "32px" }}>📄</span>
                  <p style={{ fontSize: "13px", color: "#7A9AA5" }}>{isEdit ? "Upload PDF baru (opsional)" : "Klik untuk upload PDF · Max 20MB"}</p>
                  <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                </label>
              )}
            </div>
          )}

          {meta.hasAcademic && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>Info Jurnal</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: "12px", marginBottom: "16px" }}>
                {[{ key: "volume", label: "Volume", ph: "1" }, { key: "issue", label: "Nomor", ph: "1" }, { key: "year", label: "Tahun", ph: "2026" }, { key: "doi", label: "DOI (opsional)", ph: "10.xxxx/xxxxx" }].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))} placeholder={f.ph} style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
                  </div>
                ))}
              </div>
              <label style={labelStyle}>ISSN (opsional)</label>
              <input value={form.issn} onChange={e => setForm(f => ({ ...f, issn: e.target.value }))} placeholder="xxxx-xxxx" style={{ ...inputStyle, maxWidth: "200px", marginBottom: "16px" }} />
              <label style={labelStyle}>Reviewer (koma)</label>
              <input value={reviewersInput} onChange={e => setReviewersInput(e.target.value)} placeholder="Prof. Ahmad, Dr. Sari..." style={{ ...inputStyle, marginBottom: "16px" }} />
              <label style={labelStyle}>Daftar Referensi / Sitasi (satu per baris)</label>
              <textarea value={citationsInput} onChange={e => setCitationsInput(e.target.value)} rows={5} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>Cover</p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: meta.hasPdf ? "3/4" : "16/9", objectFit: "cover", borderRadius: "2px", display: "block" }} />
                {!disabled && (
                  <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                    <label style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "2px", cursor: "pointer" }}>
                      Ganti
                      <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
                    </label>
                    <button onClick={() => { setCoverFile(null); setCoverPreview(null); }} style={{ background: "rgba(248,113,113,0.8)", color: "#fff", border: "none", fontSize: "11px", padding: "4px 8px", borderRadius: "2px", cursor: "pointer" }}>×</button>
                  </div>
                )}
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: meta.hasPdf ? "3/4" : "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "6px" }}>
                <span style={{ fontSize: "22px", color: "#B8CDD2" }}>+</span>
                <p style={{ fontSize: "11px", color: "#B8CDD2", textAlign: "center" }}>Upload cover<br /><span style={{ fontSize: "10px" }}>JPG/PNG</span></p>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
              </label>
            )}
          </div>

          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>
            {type === "ARTICLE" && (
              <div>
                <label style={labelStyle}>Tipe Artikel</label>
                <select value={form.articleSubtype} onChange={e => setForm(f => ({ ...f, articleSubtype: e.target.value }))} style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                  <option value="">Pilih tipe</option>
                  {meta.subtypes.map((s: string) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            )}
            {type === "PAPER" && (
              <div>
                <label style={labelStyle}>Tipe Paper</label>
                <select value={form.paperSubtype} onChange={e => setForm(f => ({ ...f, paperSubtype: e.target.value }))} style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                  <option value="">Pilih tipe</option>
                  {meta.subtypes.map((s: string) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                <option value="">Tanpa Kategori</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "#266c87", marginTop: "2px" }} />
              <div>
                <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Tandai sebagai unggulan</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di posisi utama</span>
              </div>
            </label>
          </div>

          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", padding: "14px 16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>{isEdit ? "Info" : "Penulis"}</p>
            {isEdit && pub ? (
              <>
                <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Penulis: {pub.author?.name}</p>
                <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Dibuat: {new Date(pub.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                {pub.publishedAt && <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Dipublish: {new Date(pub.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
                <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "8px" }}>Views: {pub.viewCount || 0}</p>
                <div style={{ borderTop: "1px solid rgba(38,108,135,0.08)", paddingTop: "8px" }}>
                  <p style={{ fontSize: "11px", color: "#B8CDD2", marginBottom: "2px" }}>Slug:</p>
                  <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#266c87", wordBreak: "break-all" }}>{pub.slug}</p>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#266c87", fontWeight: 500 }}>
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{user?.name}</p>
                  <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{user?.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .pub-form-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}