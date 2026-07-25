// app/dashboard/submit-konten/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const ACCENT = "#266c87";

export default function SubmitKontenPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ type: "ARTICLE", title: "", excerpt: "", content: "" });

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) { setError("Judul dan isi wajib diisi"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("type", form.type);
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      await publicationsApi.submit(fd);
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim tulisan");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 500 as const, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#7A9AA5", marginBottom: "7px" };

  if (done) {
    return (
      <div style={{ padding: "60px 40px", maxWidth: "560px" }}>
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "28px", marginBottom: "12px" }}>✓</p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "8px" }}>Terkirim!</h2>
          <p style={{ fontSize: "14px", color: "#7A9AA5", marginBottom: "20px" }}>Tulisan kamu sudah masuk antrian review tim editor Publikasi.</p>
          <button onClick={() => { setDone(false); setForm({ type: "ARTICLE", title: "", excerpt: "", content: "" }); }}
            style={{ padding: "10px 20px", background: ACCENT, color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", cursor: "pointer" }}>
            Kirim Tulisan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px" }}>
      <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Kirim Tulisan</p>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>Submission ke Publikasi</h1>
      <p style={{ fontSize: "13px", color: "#7A9AA5", marginBottom: "24px" }}>
        Tulisan kamu ({user?.name}) akan langsung masuk antrian review tim editor Publikasi — bukan draft pribadi.
      </p>

      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Jenis</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, appearance: "none" }}>
            <option value="ARTICLE">Artikel</option>
            <option value="PAPER">Manara Paper</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Judul *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Ringkasan</label>
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" as const }} />
        </div>
        <div>
          <label style={labelStyle}>Isi Tulisan *</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={12} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "Georgia,serif", lineHeight: 1.7 }} />
        </div>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "2px", padding: "10px 14px" }}>
            <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={saving}
          style={{ padding: "12px 24px", border: "none", borderRadius: "2px", background: saving ? "#B8CDD2" : ACCENT, color: "#fff", fontSize: "13px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer", alignSelf: "flex-end" }}>
          {saving ? "Mengirim..." : "Kirim untuk Review"}
        </button>
      </div>
    </div>
  );
}