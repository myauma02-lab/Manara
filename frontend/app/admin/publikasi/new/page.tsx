"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { publicationsApi, categoriesApi } from "@/lib/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8CDD2", fontSize: "14px" }}>
      Memuat editor...
    </div>
  ),
});

const TYPE_META = {
  ARTICLE: {
    label: "Artikel",
    color: "#266c87",
    subtypes: ["OPINION", "ESSAY", "ANALYSIS", "COMMENTARY", "OTHER"],
    hasContent: true,
    hasPdf: false,
    hasAcademic: false,
  },
  PAPER: {
    label: "Manara Paper",
    color: "#3F6F6A",
    subtypes: ["POLICY_PAPER", "WORKING_PAPER", "POLICY_BRIEF", "WHITE_PAPER", "RESEARCH_NOTE"],
    hasContent: false,
    hasPdf: true,
    hasAcademic: false,
  },
  JOURNAL: {
    label: "Manara Journal",
    color: "#5F8F8A",
    subtypes: [],
    hasContent: false,
    hasPdf: true,
    hasAcademic: true,
  },
};

const AUTOSAVE_KEY = "manara_pub_draft";

export default function NewPublikasiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const initialType = (searchParams.get("type") || "ARTICLE") as keyof typeof TYPE_META;

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
  const [showRestore, setShowRestore] = useState(false);

  const [form, setForm] = useState({
    type: initialType,
    title: "",
    excerpt: "",
    content: "",
    abstract: "",
    status: "DRAFT",
    categoryId: "",
    isFeatured: false,
    // Article
    articleSubtype: "",
    // Paper
    paperSubtype: "",
    institutions: "",
    // Journal
    volume: "",
    issue: "",
    year: new Date().getFullYear().toString(),
    doi: "",
    issn: "",
  });

  const meta = TYPE_META[form.type] || TYPE_META.ARTICLE;

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data.data || [])).catch(() => {});
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.title || p.content || p.abstract) setShowRestore(true);
      } catch { }
    }
  }, []);

  // Autosave
  useEffect(() => {
    if (!form.title && !form.content && !form.abstract) return;
    const t = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ ...form, authorsInput, keywordsInput }));
      setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 5000);
    return () => clearTimeout(t);
  }, [form, authorsInput, keywordsInput]);

  const handleRestore = () => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      setForm(f => ({ ...f, ...p }));
      if (p.authorsInput) setAuthorsInput(p.authorsInput);
      if (p.keywordsInput) setKeywordsInput(p.keywordsInput);
    }
    setShowRestore(false);
  };

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    if (meta.hasContent && !form.content.trim()) { alert("Konten wajib diisi"); return; }
    if (!meta.hasContent && !form.abstract.trim()) { alert("Abstrak wajib diisi"); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("type", form.type);
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

      await publicationsApi.create(fd);
      localStorage.removeItem(AUTOSAVE_KEY);
      alert(status === "PUBLISHED" ? "✓ Dipublikasikan!" : "✓ Draft disimpan!");
      router.push("/admin/publikasi");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
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

  return (
    <div style={{ padding: "40px", maxWidth: "1040px" }}>

      {/* Restore prompt */}
      {showRestore && (
        <div style={{ background: "rgba(38,108,135,0.06)", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ fontSize: "13px", color: "#0F2830" }}>Ada draft yang belum disimpan. Lanjutkan?</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleRestore} style={{ padding: "7px 16px", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>Lanjutkan</button>
            <button onClick={() => { localStorage.removeItem(AUTOSAVE_KEY); setShowRestore(false); }} style={{ padding: "7px 16px", background: "transparent", color: "#7A9AA5", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", fontSize: "12px", cursor: "pointer" }}>Abaikan</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin/publikasi" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>
            Publikasi Baru
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830" }}>
            {form.title || `${meta.label} Baru`}
          </h1>
        </div>
        {autoSaved && <p style={{ fontSize: "11px", color: "#B8CDD2" }}>✓ Autosave {autoSaved}</p>}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleSubmit("DRAFT")} disabled={saving}
            style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Simpan Draft
          </button>
          <button onClick={() => handleSubmit("REVIEW")} disabled={saving}
            style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid ${meta.color}40`, borderRadius: "2px", background: "transparent", color: meta.color, cursor: "pointer" }}>
            Submit Review
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving}
            style={{ padding: "9px 22px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "..." : "Publikasikan"}
          </button>
        </div>
      </div>

      {/* Type selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {(Object.entries(TYPE_META) as [keyof typeof TYPE_META, typeof TYPE_META.ARTICLE][]).map(([key, m]) => (
          <button key={key} onClick={() => setForm(f => ({ ...f, type: key }))}
            style={{ padding: "9px 20px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid ${form.type === key ? m.color : "rgba(38,108,135,0.15)"}`, borderRadius: "2px", background: form.type === key ? m.color + "15" : "transparent", color: form.type === key ? m.color : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

        {/* LEFT — Main editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Judul */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
            <label style={labelStyle}>Judul *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={`Judul ${meta.label}...`}
              style={{ ...inputStyle, fontSize: "20px", fontFamily: "Georgia,serif", fontWeight: 300, border: "none", borderBottom: "2px solid rgba(38,108,135,0.1)", borderRadius: "0", padding: "8px 0" }} />

            {/* Excerpt — hanya untuk Artikel */}
            {meta.hasContent && (
              <div style={{ marginTop: "16px" }}>
                <label style={labelStyle}>Ringkasan / Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Ringkasan singkat yang muncul di daftar artikel dan social media preview..."
                  rows={2} style={{ ...inputStyle, resize: "none", fontStyle: "italic", color: "#3A5560" }} />
              </div>
            )}
          </div>

          {/* Konten (hanya Artikel) */}
          {meta.hasContent && (
            <div>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Konten Artikel *</p>
                </div>
                <RichTextEditor
                  value={form.content}
                  onChange={content => setForm(f => ({ ...f, content }))}
                  placeholder="Mulai menulis konten artikel di sini..."
                  minHeight="450px"
                />
              </div>
              {/* Word count */}
              {form.content && (
                <div style={{ display: "flex", gap: "16px", padding: "8px 16px", background: "rgba(38,108,135,0.04)", borderRadius: "0 0 2px 2px" }}>
                  {(() => {
                    const text = form.content.replace(/<[^>]*>/g, " ").trim();
                    const words = text.split(/\s+/).filter(w => w.length > 0).length;
                    return (
                      <>
                        <span style={{ fontSize: "11px", color: "#B8CDD2" }}>{words.toLocaleString("id")} kata</span>
                        <span style={{ fontSize: "11px", color: "#B8CDD2" }}>~{Math.max(1, Math.ceil(words / 200))} menit baca</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Abstrak (Paper & Journal) */}
          {!meta.hasContent && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>Abstrak *</label>
              <textarea value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))}
                placeholder="Tulis abstrak yang merangkum tujuan, metodologi, temuan, dan kesimpulan..."
                rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.85 }} />
              <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "6px" }}>
                {form.abstract.split(/\s+/).filter(w => w.length > 0).length} kata
              </p>
            </div>
          )}

          {/* Authors (Paper & Journal) */}
          {!meta.hasContent && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <label style={labelStyle}>Penulis (pisahkan dengan koma)</label>
              <input value={authorsInput} onChange={e => setAuthorsInput(e.target.value)}
                placeholder="Ahmad Rasyid, Sari Andini, Budi Santoso..."
                style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: "16px" }}>Institusi / Afiliasi (pisahkan dengan koma)</label>
              <input value={form.institutions} onChange={e => setForm(f => ({ ...f, institutions: e.target.value }))}
                placeholder="Universitas Brawijaya, Manara Research..."
                style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: "16px" }}>Kata Kunci (pisahkan dengan koma)</label>
              <input value={keywordsInput} onChange={e => setKeywordsInput(e.target.value)}
                placeholder="kebijakan publik, riset, diskursus..."
                style={inputStyle} />
            </div>
          )}

          {/* Upload PDF (Paper & Journal) */}
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
                  <p style={{ fontSize: "13px", color: "#7A9AA5" }}>Klik untuk upload PDF · Max 20MB</p>
                  <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                </label>
              )}
            </div>
          )}

          {/* Journal-specific fields */}
          {meta.hasAcademic && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
                Info Jurnal
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { key: "volume", label: "Volume", ph: "1" },
                  { key: "issue", label: "Nomor", ph: "1" },
                  { key: "year", label: "Tahun", ph: "6" },
                  { key: "doi", label: "DOI (opsional)", ph: "10.xxxx/xxxxx" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form] as string}
                      onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))}
                      placeholder={f.ph} style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
                  </div>
                ))}
              </div>

              <label style={labelStyle}>ISSN (opsional)</label>
              <input value={form.issn} onChange={e => setForm(f => ({ ...f, issn: e.target.value }))}
                placeholder="xxxx-xxxx" style={{ ...inputStyle, maxWidth: "200px", marginBottom: "16px" }} />

              <label style={labelStyle}>Reviewer (pisahkan dengan koma)</label>
              <input value={reviewersInput} onChange={e => setReviewersInput(e.target.value)}
                placeholder="Prof. Ahmad, Dr. Sari..." style={{ ...inputStyle, marginBottom: "16px" }} />

              <label style={labelStyle}>Daftar Referensi / Sitasi (satu per baris)</label>
              <textarea value={citationsInput} onChange={e => setCitationsInput(e.target.value)}
                placeholder={"Ahmad, R. (2024). Judul buku. Penerbit.\nSari, D. (2023). Judul artikel. Jurnal, 1(1), 1-10."}
                rows={5} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} />
            </div>
          )}
        </div>

        {/* RIGHT — Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Cover image */}
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
                    style={{ background: "rgba(248,113,113,0.8)", color: "#fff", border: "none", fontSize: "11px", padding: "4px 8px", borderRadius: "2px", cursor: "pointer" }}>
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: meta.hasPdf ? "3/4" : "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "6px" }}>
                <span style={{ fontSize: "22px", color: "#B8CDD2" }}>+</span>
                <p style={{ fontSize: "11px", color: "#B8CDD2", textAlign: "center" }}>Upload cover<br /><span style={{ fontSize: "10px" }}>JPG/PNG</span></p>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Settings */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>

            {/* Subtype — Artikel */}
            {form.type === "ARTICLE" && (
              <div>
                <label style={labelStyle}>Tipe Artikel</label>
                <select value={form.articleSubtype} onChange={e => setForm(f => ({ ...f, articleSubtype: e.target.value }))}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                  <option value="">Pilih tipe</option>
                  {meta.subtypes.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            )}

            {/* Subtype — Paper */}
            {form.type === "PAPER" && (
              <div>
                <label style={labelStyle}>Tipe Paper</label>
                <select value={form.paperSubtype} onChange={e => setForm(f => ({ ...f, paperSubtype: e.target.value }))}
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                  <option value="">Pilih tipe</option>
                  {meta.subtypes.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            )}

            {/* Kategori */}
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", appearance: "none" }}>
                <option value="">Tanpa Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {categories.length === 0 && (
                <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
                  <a href="/admin/kategori" target="_blank" style={{ color: "#266c87" }}>Buat kategori →</a>
                </p>
              )}
            </div>

            {/* Featured */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#266c87", marginTop: "2px" }} />
              <div>
                <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Tandai sebagai unggulan</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di posisi utama</span>
              </div>
            </label>
          </div>

          {/* Penulis info */}
          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", padding: "14px 16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Penulis</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#266c87", fontWeight: 500 }}>
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{user?.name}</p>
                <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "4px", padding: "14px 16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Tips {meta.label}</p>
            {form.type === "ARTICLE" && (
              ["Judul 60–80 karakter", "Excerpt muncul di preview & SEO", "Gunakan H2/H3 untuk struktur", "Cover 16:9 minimal 1200px"].map(t => (
                <p key={t} style={{ fontSize: "11px", color: "#7A9AA5", marginBottom: "3px" }}>· {t}</p>
              ))
            )}
            {form.type === "PAPER" && (
              ["Abstrak max 300 kata", "Pisahkan penulis dengan koma", "Upload PDF versi final", "Keywords max 6 kata"].map(t => (
                <p key={t} style={{ fontSize: "11px", color: "#7A9AA5", marginBottom: "3px" }}>· {t}</p>
              ))
            )}
            {form.type === "JOURNAL" && (
              ["DOI opsional tapi disarankan", "Volume & nomor wajib diisi", "Reviewer dijaga kerahasiaannya", "Sitasi format APA/Vancouver"].map(t => (
                <p key={t} style={{ fontSize: "11px", color: "#7A9AA5", marginBottom: "3px" }}>· {t}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}