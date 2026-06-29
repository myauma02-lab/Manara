"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { articlesApi } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewArtikelPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "",
    status: "DRAFT", mediaType: "JOURNAL", isFeatured: false,
  });

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    if (!form.content.trim()) { alert("Konten wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("status", status);
      fd.append("mediaType", form.mediaType);
      fd.append("isFeatured", String(form.isFeatured));
      if (coverFile) fd.append("cover", coverFile);
      await articlesApi.create(fd);
      alert(status === "PUBLISHED" ? "✓ Artikel dipublikasikan!" : "✓ Draft disimpan!");
      router.push("/admin/artikel");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan artikel");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/artikel" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>Artikel Baru</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830" }}>Tulis Artikel</h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => handleSubmit("DRAFT")} disabled={saving} style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Simpan Draft
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving} style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer" }}>
            {saving ? "Menyimpan..." : "Publikasikan"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
        {/* Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Judul artikel..."
            style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", border: "none", borderBottom: "2px solid rgba(38,108,135,0.1)", padding: "8px 0", outline: "none", background: "transparent", width: "100%" }}
          />
          <input
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="Ringkasan singkat (opsional)..."
            style={{ padding: "12px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", fontSize: "14px", outline: "none", color: "#3A5560" }}
          />
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Mulai menulis konten artikel di sini..."
            rows={20}
            style={{ padding: "16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", fontSize: "15px", lineHeight: 1.8, outline: "none", color: "#3A5560", resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Cover */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>Cover Artikel</p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "2px" }} />
                <button onClick={() => { setCoverFile(null); setCoverPreview(null); }} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontSize: "14px" }}>×</button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "16/9", border: "2px dashed rgba(38,108,135,0.2)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                <span style={{ fontSize: "24px", color: "#B8CDD2" }}>↑</span>
                <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center" }}>Klik untuk upload cover</p>
                <p style={{ fontSize: "10px", color: "#B8CDD2" }}>JPG, PNG · Max 5MB</p>
                <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Settings */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>

            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Tipe Media</label>
              <select value={form.mediaType} onChange={e => setForm(f => ({ ...f, mediaType: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", fontSize: "13px", outline: "none", color: "#3A5560", appearance: "none" }}>
                <option value="JOURNAL">Journal</option>
                <option value="VIDEO">Video</option>
                <option value="PODCAST">Podcast</option>
                <option value="NEWSLETTER">Newsletter</option>
                <option value="FORUM">Forum</option>
                <option value="PAPER">Paper</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", fontSize: "13px", outline: "none", color: "#3A5560", appearance: "none" }}>
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Review</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#266c87" }} />
              <span style={{ fontSize: "13px", color: "#3A5560" }}>Tandai sebagai unggulan</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
