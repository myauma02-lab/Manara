"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { infoApi } from "@/lib/api";
import dynamic from "next/dynamic";
import Link from "next/link";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  { ssr: false, loading: () => <div style={{ height: "300px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8CDD2" }}>Memuat editor...</div> }
);

const TYPE_CONFIG = {
  NEWS:     { label: "News",       color: "#266c87" },
  AWARD:    { label: "Awards",     color: "#C6AD8A" },
  MAGAZINE: { label: "Magazine",   color: "#5F8F8A" },
  AGENDA:   { label: "Key Agenda", color: "#8A8F5E" },
};

export default function NewInfoItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "NEWS";

  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [form, setForm] = useState({
    type: initialType,
    title: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
    isFeatured: false,
    isHighlight: false,
    // NEWS
    source: "",
    externalUrl: "",
    // AWARD
    awardGiver: "",
    awardYear: new Date().getFullYear().toString(),
    awardCategory: "",
    // MAGAZINE
    issueNumber: "",
    issueYear: new Date().getFullYear().toString(),
    // AGENDA
    eventDate: "",
    eventEndDate: "",
    eventLocation: "",
    eventType: "",
  });

  const tc = TYPE_CONFIG[form.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.NEWS;

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("type", form.type);
      fd.append("title", form.title);
      fd.append("status", status);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isHighlight", String(form.isHighlight));
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("tags", JSON.stringify(tagsInput.split(",").map(t => t.trim()).filter(Boolean)));

      // Fields per type
      if (form.type === "NEWS") {
        if (form.source) fd.append("source", form.source);
        if (form.externalUrl) fd.append("externalUrl", form.externalUrl);
      }
      if (form.type === "AWARD") {
        if (form.awardGiver) fd.append("awardGiver", form.awardGiver);
        if (form.awardYear) fd.append("awardYear", form.awardYear);
        if (form.awardCategory) fd.append("awardCategory", form.awardCategory);
      }
      if (form.type === "MAGAZINE") {
        if (form.issueNumber) fd.append("issueNumber", form.issueNumber);
        if (form.issueYear) fd.append("issueYear", form.issueYear);
      }
      if (form.type === "AGENDA") {
        if (form.eventDate) fd.append("eventDate", form.eventDate);
        if (form.eventEndDate) fd.append("eventEndDate", form.eventEndDate);
        if (form.eventLocation) fd.append("eventLocation", form.eventLocation);
        if (form.eventType) fd.append("eventType", form.eventType);
      }

      if (coverFile) fd.append("cover", coverFile);
      if (fileAttachment) fd.append("file", fileAttachment);

      await infoApi.create(fd);
      alert(`✓ ${tc.label} berhasil ${status === "PUBLISHED" ? "dipublikasikan" : "disimpan"}!`);
      router.push("/admin/pusat-informasi");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 500 as const,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "#7A9AA5", marginBottom: "6px",
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/admin/pusat-informasi" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "2px", background: tc.color + "15", color: tc.color }}>
            {tc.label}
          </span>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830", marginTop: "4px" }}>
            {form.title || `${tc.label} Baru`}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleSubmit("DRAFT")} disabled={saving}
            style={{ padding: "9px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Simpan Draft
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving}
            style={{ padding: "9px 22px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: tc.color, color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "..." : "Publikasikan"}
          </button>
        </div>
      </div>

      {/* Type selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setForm(f => ({ ...f, type: key }))}
            style={{ padding: "8px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", border: `1px solid ${form.type === key ? cfg.color : "rgba(38,108,135,0.15)"}`, borderRadius: "2px", background: form.type === key ? cfg.color + "15" : "transparent", color: form.type === key ? cfg.color : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
            {cfg.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "18px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Judul + Excerpt */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Judul *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={`Judul ${tc.label}...`}
                style={{ ...inputStyle, fontSize: "18px", fontFamily: "Georgia,serif", fontWeight: 300 }} />
            </div>
            <div>
              <label style={labelStyle}>Ringkasan / Excerpt</label>
              <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Deskripsi singkat yang muncul di kartu..."
                rows={2} style={{ ...inputStyle, resize: "none", fontStyle: "italic", color: "#3A5560" }} />
            </div>
          </div>

          {/* Fields khusus per type */}
          {form.type === "NEWS" && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Info Berita</p>
              <div>
                <label style={labelStyle}>Sumber Berita</label>
                <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  placeholder="Manara, Kompas, dll..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Link Berita Asli (opsional)</label>
                <input value={form.externalUrl} onChange={e => setForm(f => ({ ...f, externalUrl: e.target.value }))}
                  placeholder="https://..." style={inputStyle} />
              </div>
            </div>
          )}

          {form.type === "AWARD" && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Info Penghargaan</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Pemberi Penghargaan</label>
                  <input value={form.awardGiver} onChange={e => setForm(f => ({ ...f, awardGiver: e.target.value }))}
                    placeholder="Nama lembaga/organisasi..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tahun</label>
                  <input type="number" value={form.awardYear} onChange={e => setForm(f => ({ ...f, awardYear: e.target.value }))}
                    style={{ ...inputStyle, padding: "10px 10px" }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Kategori Penghargaan</label>
                <input value={form.awardCategory} onChange={e => setForm(f => ({ ...f, awardCategory: e.target.value }))}
                  placeholder="Best Research, Innovation Award, dll..." style={inputStyle} />
              </div>
            </div>
          )}

          {form.type === "MAGAZINE" && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Info Edisi</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Nomor Edisi</label>
                  <input value={form.issueNumber} onChange={e => setForm(f => ({ ...f, issueNumber: e.target.value }))}
                    placeholder="Vol. 1 No. 1" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tahun</label>
                  <input type="number" value={form.issueYear} onChange={e => setForm(f => ({ ...f, issueYear: e.target.value }))}
                    style={{ ...inputStyle, padding: "10px 10px" }} />
                </div>
              </div>
              {/* Upload PDF majalah */}
              <div>
                <label style={labelStyle}>File PDF Majalah</label>
                {fileAttachment ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px" }}>
                    <span>📄</span>
                    <p style={{ flex: 1, fontSize: "13px", color: "#0F2830" }}>{fileAttachment.name}</p>
                    <button onClick={() => setFileAttachment(null)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>×</button>
                  </div>
                ) : (
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80px", border: "2px dashed rgba(38,108,135,0.2)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>📄</span>
                    <p style={{ fontSize: "13px", color: "#7A9AA5" }}>Upload PDF majalah · Max 20MB</p>
                    <input type="file" accept=".pdf" onChange={e => setFileAttachment(e.target.files?.[0] || null)} style={{ display: "none" }} />
                  </label>
                )}
              </div>
            </div>
          )}

          {form.type === "AGENDA" && (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Info Agenda</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Tanggal Mulai</label>
                  <input type="datetime-local" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                    style={{ ...inputStyle, fontSize: "13px" }} />
                </div>
                <div>
                  <label style={labelStyle}>Tanggal Selesai (opsional)</label>
                  <input type="datetime-local" value={form.eventEndDate} onChange={e => setForm(f => ({ ...f, eventEndDate: e.target.value }))}
                    style={{ ...inputStyle, fontSize: "13px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Lokasi</label>
                  <input value={form.eventLocation} onChange={e => setForm(f => ({ ...f, eventLocation: e.target.value }))}
                    placeholder="Malang / Online / Hybrid" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tipe Event</label>
                  <input value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}
                    placeholder="Seminar, Workshop, Forum..." style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* Konten */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Konten Lengkap (opsional)</p>
            </div>
            <RichTextEditor
              value={form.content}
              onChange={content => setForm(f => ({ ...f, content }))}
              placeholder="Tulis konten lengkap di sini..."
              minHeight="280px"
            />
          </div>

          {/* Tags */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px" }}>
            <label style={labelStyle}>Tags (pisahkan dengan koma)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              placeholder="manara, riset, kebijakan..." style={inputStyle} />
            {tagsInput && (
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "8px" }}>
                {tagsInput.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} style={{ fontSize: "11px", border: "1px solid rgba(38,108,135,0.15)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Cover */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>Cover</p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover"
                  style={{ width: "100%", aspectRatio: form.type === "MAGAZINE" ? "3/4" : "16/9", objectFit: "cover", borderRadius: "2px", display: "block" }} />
                <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "5px" }}>
                  <label style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "10px", padding: "4px 8px", borderRadius: "2px", cursor: "pointer" }}>
                    Ganti
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
                  </label>
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    style={{ background: "rgba(248,113,113,0.8)", color: "#fff", border: "none", fontSize: "10px", padding: "4px 6px", borderRadius: "2px", cursor: "pointer" }}>×</button>
                </div>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: form.type === "MAGAZINE" ? "3/4" : "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "4px" }}>
                <span style={{ fontSize: "20px", color: "#B8CDD2" }}>+</span>
                <p style={{ fontSize: "11px", color: "#B8CDD2", textAlign: "center" }}>
                  Upload cover<br />
                  <span style={{ fontSize: "10px" }}>{form.type === "MAGAZINE" ? "3:4" : "16:9"}</span>
                </p>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Settings */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "9px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                style={{ width: "15px", height: "15px", accentColor: tc.color, marginTop: "2px" }} />
              <div>
                <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Featured</span>
                <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di posisi utama</span>
              </div>
            </label>

            {form.type === "AGENDA" && (
              <label style={{ display: "flex", alignItems: "flex-start", gap: "9px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.isHighlight} onChange={e => setForm(f => ({ ...f, isHighlight: e.target.checked }))}
                  style={{ width: "15px", height: "15px", accentColor: tc.color, marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Highlight</span>
                  <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tandai sebagai agenda penting</span>
                </div>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}