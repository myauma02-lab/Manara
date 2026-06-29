"use client";
import { useEffect, useState, useCallback } from "react";
import { recruitmentApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ManapeoplePage() {
  const [recruitment, setRecruitment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    position: "", motivation: "", portfolioLink: "",
  });

  useEffect(() => {
    recruitmentApi.active()
      .then(r => setRecruitment(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.position || !form.motivation) {
      alert("Mohon lengkapi semua kolom wajib (*)"); return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("recruitmentId", recruitment.id);
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (cvFile) fd.append("cv", cvFile);
      const res = await recruitmentApi.apply(fd);
      setAppId(res.data.data.id);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengirim lamaran. Coba lagi.");
    } finally { setSending(false); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "15px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff",
    boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 500,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "#7A9AA5", marginBottom: "8px",
  };

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "120px", paddingBottom: "120px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: "1px solid rgba(38,108,135,0.2)", padding: "10px 24px", borderRadius: "2px", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#266c87", marginBottom: "32px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#266c87", display: "inline-block", animation: "pulse 2s infinite" }} />
              Open Recruitment
            </div>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,6vw,60px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.1, marginBottom: "20px" }}>
              Bergabung menjadi<br /><em style={{ color: "#266c87", fontStyle: "italic" }}>Manapeople.</em>
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.85, maxWidth: "480px", margin: "0 auto" }}>
              Manara membuka ruang bagi individu yang percaya bahwa gagasan dapat mengubah ruang publik. Apakah itu kamu?
            </p>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#7A9AA5", padding: "48px 0" }}>Memuat informasi rekrutmen...</p>

          ) : !recruitment ? (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "80px 40px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "26px", color: "#7A9AA5", marginBottom: "12px" }}>Rekrutmen Sedang Ditutup</p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "#B8CDD2", lineHeight: 1.8 }}>
                Pantau terus media sosial Manara untuk informasi pembukaan batch berikutnya.
              </p>
            </div>

          ) : submitted ? (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "80px 40px", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(95,143,138,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "28px" }}>✓</div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830", marginBottom: "12px" }}>Lamaran Terkirim!</p>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", marginBottom: "32px", lineHeight: 1.8 }}>
                Terima kasih, <strong style={{ fontWeight: 500, color: "#0F2830" }}>{form.fullName}</strong>.<br />
                Kami akan meninjau lamaranmu dan menghubungi melalui email.
              </p>
              <div style={{ background: "#F4F7F7", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "inline-block" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "6px" }}>ID Lamaranmu</p>
                <p style={{ fontFamily: "monospace", fontSize: "13px", color: "#266c87", wordBreak: "break-all" }}>{appId}</p>
              </div>
            </div>

          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "48px" }}>

              {/* Batch info */}
              <div style={{ borderBottom: "1px solid rgba(38,108,135,0.08)", paddingBottom: "24px", marginBottom: "32px" }}>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>{recruitment.batchName}</h2>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5" }}>{recruitment.description}</p>
              </div>

              {/* Form fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Nama Lengkap <span style={{ color: "#266c87" }}>*</span></label>
                    <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      required placeholder="Nama lengkapmu" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: "#266c87" }}>*</span></label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required placeholder="email@kamu.com" style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>No. Telepon</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="08xx xxxx xxxx" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Posisi yang Diminati <span style={{ color: "#266c87" }}>*</span></label>
                    <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                      required style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                      <option value="" disabled>Pilih posisi</option>
                      {(recruitment.positions as any[]).map((p: any) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Motivasi <span style={{ color: "#266c87" }}>*</span></label>
                  <textarea value={form.motivation} onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                    required rows={6} placeholder="Ceritakan mengapa kamu ingin bergabung dengan Manara, apa yang ingin kamu kontribusikan, dan apa yang kamu harapkan dari kolektif ini..."
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                <div>
                  <label style={labelStyle}>Upload CV (PDF, opsional)</label>
                  {cvFile ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "#F4F7F7" }}>
                      <span style={{ fontSize: "13px", color: "#3A5560", flex: 1 }}>📄 {cvFile.name}</span>
                      <button type="button" onClick={() => setCvFile(null)} style={{ background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "16px" }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                      <span style={{ fontSize: "24px", color: "#B8CDD2" }}>↑</span>
                      <p style={{ fontSize: "13px", color: "#B8CDD2" }}>Klik untuk upload CV · PDF max 10MB</p>
                      <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                    </label>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Link Portfolio (opsional)</label>
                  <input value={form.portfolioLink} onChange={e => setForm(f => ({ ...f, portfolioLink: e.target.value }))}
                    placeholder="https://portfolio-kamu.com" style={inputStyle} />
                </div>

                <button type="submit" disabled={sending} style={{ background: "#266c87", color: "#fff", padding: "16px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, marginTop: "8px" }}>
                  {sending ? "Mengirim Lamaran..." : "Kirim Lamaran →"}
                </button>

                <p style={{ fontSize: "11px", color: "#B8CDD2", textAlign: "center", lineHeight: 1.6 }}>
                  Dengan mengirim lamaran ini, kamu menyetujui bahwa data yang diberikan akan digunakan dalam proses seleksi Manara.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
