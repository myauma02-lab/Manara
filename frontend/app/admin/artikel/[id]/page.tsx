"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { articlesApi, categoriesApi } from "@/lib/api";
import Link from "next/link";
import dynamic from "next/dynamic";
import WordCount from "@/components/admin/WordCount";
import ArticlePreview from "@/components/admin/ArticlePreview";
import { useAuthStore } from "@/lib/store/authStore";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8CDD2", fontSize: "14px" }}>
      Memuat editor...
    </div>
  ),
});

const MEDIA_TYPES = ["JOURNAL", "VIDEO", "PODCAST", "NEWSLETTER", "FORUM", "PAPER"];

export default function EditArtikelPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [autoSaved, setAutoSaved] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);

  const [form, setForm] = useState({
    title: "", excerpt: "", content: "",
    status: "DRAFT", mediaType: "JOURNAL",
    categoryId: "", isFeatured: false,
  });

  // Load artikel & kategori
  useEffect(() => {
    Promise.all([
      articlesApi.adminList(),
      categoriesApi.list(),
    ]).then(([artRes, catRes]) => {
      const found = artRes.data.data?.find((a: any) => a.id === id);
      if (found) {
        setArticle(found);
        setForm({
          title: found.title || "",
          excerpt: found.excerpt || "",
          content: found.content || "",
          status: found.status || "DRAFT",
          mediaType: found.mediaType || "JOURNAL",
          categoryId: found.categoryId || "",
          isFeatured: found.isFeatured || false,
        });
        if (found.coverImage) setCoverPreview(found.coverImage);
      }
      setCategories(catRes.data.data || []);
    }).finally(() => setLoading(false));
  }, [id]);

  // Autosave (debounce 5 detik)
  useEffect(() => {
    if (loading || !form.title) return;
    const timer = setTimeout(() => {
      setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 5000);
    return () => clearTimeout(timer);
  }, [form.title, form.content, form.excerpt, loading]);

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("status", status);
      fd.append("mediaType", form.mediaType);
      fd.append("isFeatured", String(form.isFeatured));
      if (form.categoryId) fd.append("categoryId", form.categoryId);
      if (coverFile) fd.append("cover", coverFile);
      await articlesApi.update(String(id), fd);
      alert(status === "PUBLISHED" ? "✓ Artikel dipublikasikan!" : "✓ Perubahan disimpan!");
      router.push("/admin/artikel");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  if (loading) return (
    <div style={{ padding: "40px", color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
      Memuat artikel...
    </div>
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/artikel" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>Edit Artikel</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830" }}>
            {form.title || "Tanpa Judul"}
          </h1>
        </div>
        {autoSaved && (
          <p style={{ fontSize: "11px", color: "#B8CDD2" }}>✓ Edit {autoSaved}</p>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowPreview(true)} style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Preview
          </button>
          <button onClick={() => handleSubmit("DRAFT")} disabled={saving} style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Simpan
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving} style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: form.status === "PUBLISHED" ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Menyimpan..." : form.status === "PUBLISHED" ? "Update" : "Publikasikan"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Judul artikel..."
            style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", border: "none", borderBottom: "2px solid rgba(38,108,135,0.1)", padding: "8px 0", outline: "none", background: "transparent", width: "100%" }}
          />
          <textarea
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="Ringkasan singkat..."
            rows={2}
            style={{ ...inputStyle, resize: "none", fontStyle: "italic", color: "#3A5560" }}
          />
          <div>
            <RichTextEditor
              value={form.content}
              onChange={content => setForm(f => ({ ...f, content }))}
              minHeight="500px"
            />
            <WordCount content={form.content} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Cover */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>Cover Artikel</p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "2px", display: "block" }} />
                <label style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "2px", cursor: "pointer" }}>
                  Ganti
                  <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
                </label>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                <span style={{ fontSize: "24px", color: "#B8CDD2" }}>↑</span>
                <p style={{ fontSize: "12px", color: "#B8CDD2" }}>Upload cover</p>
                <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Settings */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}>
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Menunggu Review</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Tipe Media</label>
              <select value={form.mediaType} onChange={e => setForm(f => ({ ...f, mediaType: e.target.value }))} style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}>
                {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Kategori</label>
              <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}>
                <option value="">Tanpa Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "#266c87" }} />
              <div>
                <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Artikel Unggulan</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di homepage</span>
              </div>
            </label>
          </div>

          {/* Info artikel */}
          {article && (
            <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 18px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Info</p>
              <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Penulis: {article.author?.name}</p>
              <p style={{ fontSize: "12px", color: "#7A9AA5", marginBottom: "4px" }}>Dibuat: {new Date(article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              {article.publishedAt && (
                <p style={{ fontSize: "12px", color: "#7A9AA5" }}>Dipublish: {new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              )}
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(38,108,135,0.08)" }}>
                <p style={{ fontSize: "12px", color: "#B8CDD2" }}>Slug:</p>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#266c87", wordBreak: "break-all" }}>{article.slug}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <ArticlePreview
          article={{ title: form.title, excerpt: form.excerpt, content: form.content, coverImage: coverPreview || undefined, mediaType: form.mediaType, author: user?.name }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}