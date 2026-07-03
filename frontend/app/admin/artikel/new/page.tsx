"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { articlesApi, categoriesApi } from "@/lib/api";
import Link from "next/link";
import dynamic from "next/dynamic";
import WordCount from "@/components/admin/WordCount";
import ArticlePreview from "@/components/admin/ArticlePreview";
import { useAuthStore } from "@/lib/store/authStore";

// Dynamic import supaya tidak crash di server
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8CDD2", fontSize: "14px" }}>
      Memuat editor...
    </div>
  ),
});

const MEDIA_TYPES = ["JOURNAL", "VIDEO", "PODCAST", "NEWSLETTER", "FORUM", "PAPER"];
const AUTOSAVE_KEY = "manara_artikel_draft";

export default function NewArtikelPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [autoSaved, setAutoSaved] = useState<string | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
    mediaType: "JOURNAL",
    categoryId: "",
    isFeatured: false,
  });

  // Load categories
  useEffect(() => {
    categoriesApi.list()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  // Cek apakah ada draft yang tersimpan
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.content) {
          setShowRestorePrompt(true);
        }
      } catch { }
    }
  }, []);

  // Autosave setiap 30 detik
  useEffect(() => {
    if (!form.title && !form.content) return;
    const timer = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form));
      setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearTimeout(timer);
  }, [form]);

  // Manual autosave saat konten berubah (debounce 5 detik)
  useEffect(() => {
    if (!form.title && !form.content) return;
    const timer = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form));
      setAutoSaved(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 5000);
    return () => clearTimeout(timer);
  }, [form.title, form.content, form.excerpt]);

  const handleRestoreDraft = () => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(f => ({ ...f, ...parsed }));
      } catch { }
    }
    setShowRestorePrompt(false);
  };

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    if (!form.content.trim() || form.content === "<p><br></p>") {
      alert("Konten artikel wajib diisi"); return;
    }
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

      await articlesApi.create(fd);
      // Hapus draft setelah berhasil simpan
      localStorage.removeItem(AUTOSAVE_KEY);
      alert(status === "PUBLISHED" ? "✓ Artikel dipublikasikan!" : "✓ Draft disimpan!");
      router.push("/admin/artikel");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan artikel");
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

  return (
    <div style={{ padding: "40px", maxWidth: "1000px" }}>

      {/* Restore draft prompt */}
      {showRestorePrompt && (
        <div style={{ background: "rgba(38,108,135,0.06)", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "4px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830", marginBottom: "2px" }}>Ada draft yang belum disimpan</p>
            <p style={{ fontSize: "12px", color: "#7A9AA5" }}>Apakah kamu ingin melanjutkan tulisan sebelumnya?</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={handleRestoreDraft} style={{ padding: "8px 16px", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
              Lanjutkan
            </button>
            <button onClick={() => { localStorage.removeItem(AUTOSAVE_KEY); setShowRestorePrompt(false); }} style={{ padding: "8px 16px", background: "transparent", color: "#7A9AA5", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", fontSize: "12px", cursor: "pointer" }}>
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/artikel" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>Artikel Baru</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830" }}>Tulis Artikel</h1>
        </div>
        {/* Autosave indicator */}
        {autoSaved && (
          <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
            ✓ Tersimpan otomatis {autoSaved}
          </p>
        )}
        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowPreview(true)}
            style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}
          >
            Preview
          </button>
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}
          >
            Simpan Draft
          </button>
          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Menyimpan..." : "Publikasikan"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
        {/* Main editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Judul */}
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Judul artikel..."
            style={{
              fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300,
              color: "#0F2830", border: "none",
              borderBottom: "2px solid rgba(38,108,135,0.1)",
              padding: "8px 0", outline: "none", background: "transparent", width: "100%",
            }}
          />

          {/* Excerpt */}
          <textarea
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="Ringkasan singkat yang muncul di halaman daftar artikel dan social media preview..."
            rows={2}
            style={{ ...inputStyle, resize: "none", fontStyle: "italic", color: "#3A5560" }}
          />

          {/* Rich Text Editor */}
          <div>
            <RichTextEditor
              value={form.content}
              onChange={content => setForm(f => ({ ...f, content }))}
              placeholder="Mulai menulis konten artikel di sini..."
              minHeight="500px"
            />
            <WordCount content={form.content} />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Cover Image */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
              Cover Artikel
            </p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "2px", display: "block" }} />
                <button
                  onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontSize: "16px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  ×
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                <span style={{ fontSize: "28px", color: "#B8CDD2" }}>↑</span>
                <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center" }}>Upload cover<br /><span style={{ fontSize: "10px" }}>JPG/PNG · 16:9 · Max 5MB</span></p>
                <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Pengaturan */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
              Pengaturan
            </p>

            {/* Status */}
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}
              >
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Menunggu Review</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* Tipe Media */}
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Tipe Media</label>
              <select
                value={form.mediaType}
                onChange={e => setForm(f => ({ ...f, mediaType: e.target.value }))}
                style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}
              >
                {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Kategori</label>
              <select
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}
              >
                <option value="">Tanpa Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
                  Belum ada kategori.{" "}
                  <a href="/admin/kategori" target="_blank" style={{ color: "#266c87" }}>Buat di sini →</a>
                </p>
              )}
            </div>

            {/* Featured */}
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#266c87" }}
              />
              <div>
                <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Artikel Unggulan</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di posisi utama homepage</span>
              </div>
            </label>
          </div>

          {/* Penulis */}
          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 18px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Penulis</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#266c87", fontWeight: 500, flexShrink: 0 }}>
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{user?.name}</p>
                <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 18px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Tips Editorial</p>
            {[
              "Judul yang kuat: spesifik, 60–80 karakter",
              "Excerpt muncul di Google & social media preview",
              "Gunakan H2 dan H3 untuk struktur konten",
              "Blockquote untuk kutipan penting",
              "Cover 16:9 minimal 1200×675px",
            ].map(tip => (
              <p key={tip} style={{ fontSize: "11px", color: "#7A9AA5", marginBottom: "4px", lineHeight: 1.6 }}>· {tip}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ArticlePreview
          article={{
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            coverImage: coverPreview || undefined,
            mediaType: form.mediaType,
            author: user?.name,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}