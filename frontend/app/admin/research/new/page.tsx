"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function NewResearchPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [authorsInput, setAuthorsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    volume: "",
    issue: "",
    year: "",
    doi: "",
    status: "DRAFT",
  });

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    if (!form.abstract.trim()) { alert("Abstrak wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("abstract", form.abstract);
      fd.append("status", status);
      fd.append("authors", JSON.stringify(
        authorsInput.split(",").map(a => a.trim()).filter(Boolean)
      ));
      fd.append("keywords", JSON.stringify(
        keywordsInput.split(",").map(k => k.trim()).filter(Boolean)
      ));
      if (form.volume) fd.append("volume", form.volume);
      if (form.issue) fd.append("issue", form.issue);
      if (form.year) fd.append("year", form.year);
      if (form.doi) fd.append("doi", form.doi);
      if (pdfFile) fd.append("pdf", pdfFile);
      if (coverFile) fd.append("cover", coverFile);

      const token = localStorage.getItem("manara_token");
      const res = await fetch(`${API_URL}/research`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(status === "PUBLISHED" ? "Paper dipublikasikan!" : "Draft disimpan!");
      router.push("/admin/research");
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid rgba(38,108,135,0.15)",
    borderRadius: "2px",
    fontSize: "14px",
    outline: "none",
    color: "#1C3038",
    fontFamily: "inherit",
    background: "#fff",
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/research" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>
          &larr;
        </Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>
            Upload Paper Baru
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830" }}>
            Research Paper
          </h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}
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
        {/* Main form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Judul */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>
              Judul Paper *
            </label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Judul lengkap paper..."
              style={{ ...inputStyle, fontSize: "18px", fontFamily: "Georgia,serif", fontWeight: 300 }}
            />
          </div>

          {/* Abstrak */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>
              Abstrak *
            </label>
            <textarea
              value={form.abstract}
              onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))}
              placeholder="Tulis abstrak paper di sini..."
              rows={8}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }}
            />
          </div>

          {/* Penulis */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>
              Penulis (pisahkan dengan koma)
            </label>
            <input
              value={authorsInput}
              onChange={e => setAuthorsInput(e.target.value)}
              placeholder="Ahmad Rasyid, Sari Andini, ..."
              style={inputStyle}
            />
            <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "6px" }}>
              Contoh: Mutamimul Yhauma, Oca Aulia Putri
            </p>
          </div>

          {/* Keywords */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>
              Kata Kunci (pisahkan dengan koma)
            </label>
            <input
              value={keywordsInput}
              onChange={e => setKeywordsInput(e.target.value)}
              placeholder="kebijakan publik, diskursus, media..."
              style={inputStyle}
            />
          </div>

          {/* Upload PDF */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
              Upload File PDF
            </label>
            {pdfFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px" }}>
                <span style={{ fontSize: "24px" }}>📄</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#0F2830" }}>{pdfFile.name}</p>
                  <p style={{ fontSize: "11px", color: "#7A9AA5" }}>
                    {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
                >
                  Hapus
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "140px", border: "2px dashed rgba(38,108,135,0.2)", borderRadius: "4px", cursor: "pointer", gap: "8px" }}>
                <span style={{ fontSize: "36px" }}>📄</span>
                <p style={{ fontSize: "14px", color: "#7A9AA5", fontWeight: 300 }}>Klik untuk upload PDF</p>
                <p style={{ fontSize: "11px", color: "#B8CDD2" }}>Format PDF · Maksimal 20MB</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => setPdfFile(e.target.files?.[0] || null)}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Cover image */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
              Cover Paper
            </p>
            {coverPreview ? (
              <div style={{ position: "relative" }}>
                <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: "2px" }} />
                <button
                  onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontSize: "14px" }}
                >
                  x
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "3/4", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                <span style={{ fontSize: "24px", color: "#B8CDD2" }}>+</span>
                <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center" }}>Upload cover</p>
                <p style={{ fontSize: "10px", color: "#B8CDD2" }}>JPG/PNG</p>
                <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Metadata */}
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
              Metadata
            </p>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Volume</label>
              <input value={form.volume} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))} placeholder="1" style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Nomor</label>
              <input value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} placeholder="1" style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Tahun</label>
              <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2026" style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>DOI (Opsional)</label>
              <input value={form.doi} onChange={e => setForm(f => ({ ...f, doi: e.target.value }))} placeholder="10.xxxx/xxxxx" style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}