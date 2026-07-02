"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { researchApi } from "@/lib/api";
import Link from "next/link";

export default function EditResearchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetch(`${API_URL}/research`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("manara_token")}` }
    })
      .then(r => r.json())
      .then(d => {
        const paper = d.data?.find((p: any) => p.id === id);
        if (paper) {
          setForm({
            title: paper.title || "",
            abstract: paper.abstract || "",
            volume: paper.volume || "",
            issue: paper.issue || "",
            year: paper.year ? String(paper.year) : "",
            doi: paper.doi || "",
            status: paper.status || "DRAFT",
          });
          setAuthorsInput((paper.authors || []).join(", "));
          setKeywordsInput((paper.keywords || []).join(", "));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (status: string) => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      await researchApi.update(String(id), {
        title: form.title,
        abstract: form.abstract,
        status,
        authors: JSON.stringify(
          authorsInput.split(",").map(a => a.trim()).filter(Boolean)
        ),
        keywords: JSON.stringify(
          keywordsInput.split(",").map(k => k.trim()).filter(Boolean)
        ),
        volume: form.volume,
        issue: form.issue,
        year: form.year,
        doi: form.doi,
      });
      alert(status === "PUBLISHED" ? "Paper dipublikasikan!" : "Draft disimpan!");
      router.push("/admin/research");
    } catch {
      alert("Gagal menyimpan");
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

  if (loading) return <div style={{ padding: "40px", color: "#7A9AA5" }}>Memuat paper...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/research" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>&larr;</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>Edit Paper</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830" }}>{form.title || "..."}</h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => handleSubmit("DRAFT")} disabled={saving}
            style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", background: "transparent", color: "#3A5560", cursor: "pointer" }}>
            Simpan Draft
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving}
            style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Menyimpan..." : "Publikasikan"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Judul *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ ...inputStyle, fontSize: "18px", fontFamily: "Georgia,serif", fontWeight: 300 }} />
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Abstrak *</label>
          <textarea value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))}
            rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Penulis (pisahkan koma)</label>
          <input value={authorsInput} onChange={e => setAuthorsInput(e.target.value)}
            placeholder="Penulis 1, Penulis 2" style={inputStyle} />
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Kata Kunci (pisahkan koma)</label>
          <input value={keywordsInput} onChange={e => setKeywordsInput(e.target.value)}
            placeholder="keyword 1, keyword 2" style={inputStyle} />
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>Metadata</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: "12px" }}>
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
              <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>DOI</label>
              <input value={form.doi} onChange={e => setForm(f => ({ ...f, doi: e.target.value }))} placeholder="10.xxxx/xxxx" style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => handleSubmit(form.status)} disabled={saving}
            style={{ flex: 1, background: "#266c87", color: "#fff", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link href="/admin/research" style={{ padding: "14px 24px", fontSize: "13px", fontWeight: 500, border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#3A5560", textDecoration: "none", display: "flex", alignItems: "center" }}>
            Batal
          </Link>
        </div>
      </div>
    </div>
  );
}