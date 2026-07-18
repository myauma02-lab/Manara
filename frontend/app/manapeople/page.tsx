"use client";
import { useEffect, useState } from "react";
import { recruitmentApi, interestApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ManapeoplePage() {
  const [recruitment, setRecruitment] = useState<any>(null);
  const [mode, setMode] = useState<"INTEREST" | "RECRUITMENT">("INTEREST");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [interestForm, setInterestForm] = useState({ fullName: "", email: "", phone: "", background: "", expertise: "", reason: "", linkedin: "", });
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    position: "", motivation: "", portfolioLink: "",
  });

 useEffect(() => {
  recruitmentApi.active()
    .then((r) => {
      setMode(r.data.mode);
      setRecruitment(r.data.data);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.motivation) {
  alert("Mohon lengkapi semua kolom wajib (*)");
  return;
}

if (mode === "RECRUITMENT" && !form.position) {
  alert("Silakan pilih posisi yang dilamar.");
  return;
}
    setSending(true);
    try {
  if (mode === "INTEREST") {
    const res = await interestApi.create({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      expertise: form.position,
      portfolioLink: form.portfolioLink,
      motivation: form.motivation,
    });

    setAppId(res.data.data.id);
  } else {
    const fd = new FormData();

    fd.append("recruitmentId", recruitment.id);

    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    if (cvFile) {
      fd.append("cv", cvFile);
    }

    const res = await recruitmentApi.apply(fd);

    setAppId(res.data.data.id);
  }

  setSubmitted(true);
} catch (err: any) {
  alert(err.response?.data?.message || "Gagal mengirim data. Coba lagi.");
} finally {
  setSending(false);
}
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1px solid rgba(38,108,135,0.15)",
    borderRadius: "2px",
    fontSize: "15px",
    outline: "none",
    color: "#1C3038",
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box" as const,
  };

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: "100px", paddingBottom: "100px", background: "#F4F7F7", minHeight: "100vh" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 clamp(20px,5vw,32px)" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(38,108,135,0.2)",
              padding: "8px 20px",
              borderRadius: "2px",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#266c87",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#266c87",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />

            {mode === "RECRUITMENT"
              ? "Open Recruitment"
              : "Join Manara"}
          </div>
            <h1 style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(32px,8vw,56px)",
              fontWeight: 300,
              color: "#0F2830",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}>
              <em style={{ fontStyle: "italic" }}>Manapeople.</em>
            </h1>
            <p
              style={{
                fontSize: "clamp(14px,3.5vw,16px)",
                fontWeight: 300,
                color: "#7A9AA5",
                lineHeight: 1.85,
                maxWidth: "480px",
                margin: "0 auto 6px",
              }}
            >
              {mode === "RECRUITMENT"
                ? "Bergabung menjadi bagian dari Manara."
                : "Mari saling mengenal sebelum pembukaan batch berikutnya."}
            </p>
            <p style={{ fontSize: "clamp(13px,3vw,15px)", fontWeight: 300, color: "#B8CDD2", lineHeight: 1.8, maxWidth: "440px", margin: "0 auto" }}>
              Manara membuka ruang bagi individu yang percaya bahwa gagasan dapat mengubah ruang publik.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#7A9AA5" }}>
              Memuat informasi rekrutmen...
            </div>

          ) : submitted ? (
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "clamp(40px,8vw,80px) clamp(24px,6vw,40px)", textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(95,143,138,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px" }}>✓</div>
              <p
              style={{
                fontSize: "clamp(13px,3.5vw,15px)",
                fontWeight: 300,
                color: "#7A9AA5",
                marginBottom: "28px",
                lineHeight: 1.8,
              }}
            >
              Terima kasih,
              <strong style={{ fontWeight: 500, color: "#0F2830" }}>
                {form.fullName}
              </strong>.
              <br />

              {mode === "RECRUITMENT"
                ? "Kami akan meninjau lamaranmu segera."
                : "Kamu telah bergabung ke Talent Pool Manara. Kami akan menghubungimu ketika ada kesempatan yang sesuai."}
            </p>
              <div style={{ background: "#F4F7F7", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 20px", display: "inline-block", maxWidth: "100%" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>ID Lamaran</p>
                <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#266c87", wordBreak: "break-all" }}>{appId}</p>
              </div>
            </div>

          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "clamp(24px,6vw,48px)" }}>

              {/* Batch / Interest info */}
                <div
                  style={{
                    borderBottom: "1px solid rgba(38,108,135,0.08)",
                    paddingBottom: "20px",
                    marginBottom: "28px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "clamp(18px,4vw,22px)",
                      fontWeight: 300,
                      color: "#0F2830",
                      marginBottom: "6px",
                    }}
                  >
                    {mode === "RECRUITMENT"
                      ? recruitment?.batchName
                      : "Talent Pool Manara"}
                  </h2>

                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "#7A9AA5",
                    }}
                  >
                    {mode === "RECRUITMENT"
                      ? recruitment?.description
                      : "Perkenalkan dirimu kepada kami. Saat ada posisi yang sesuai, kami akan menghubungimu lebih dahulu."}
                  </p>
                </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
                  className="form-two-col">
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                      Nama Lengkap <span style={{ color: "#266c87" }}>*</span>
                    </label>
                    <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required placeholder="Nama lengkapmu" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                      Email <span style={{ color: "#266c87" }}>*</span>
                    </label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="email@kamu.com" style={inputStyle} />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                  className="form-two-col"
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#7A9AA5",
                        marginBottom: "7px",
                      }}
                    >
                      No. Telepon
                    </label>

                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="08xx xxxx xxxx"
                      style={inputStyle}
                    />
                  </div>

                  {mode === "RECRUITMENT" && (
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#7A9AA5",
                          marginBottom: "7px",
                        }}
                      >
                        Posisi <span style={{ color: "#266c87" }}>*</span>
                      </label>

                      <select
                        value={form.position}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            position: e.target.value,
                          }))
                        }
                        required={mode === "RECRUITMENT"}
                        style={{
                          ...inputStyle,
                          appearance: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>
                          Pilih posisi
                        </option>

                        {(recruitment?.positions ?? []).map((p: any) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                    Motivasi <span style={{ color: "#266c87" }}>*</span>
                  </label>
                  <textarea value={form.motivation} onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))} required rows={5} placeholder={ mode === "RECRUITMENT" ? "Ceritakan mengapa kamu ingin bergabung dengan Manara..." : "Perkenalkan dirimu, pengalamanmu, serta bidang yang paling kamu minati..." } />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                    Upload CV (PDF, opsional)
                  </label>
                  {cvFile ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: "#F4F7F7" }}>
                      <span style={{ fontSize: "13px", color: "#3A5560", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📄 {cvFile.name}</span>
                      <button type="button" onClick={() => setCvFile(null)} style={{ background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "6px" }}>
                      <span style={{ fontSize: "22px", color: "#B8CDD2" }}>↑</span>
                      <p style={{ fontSize: "13px", color: "#B8CDD2" }}>Klik untuk upload CV · PDF max 10MB</p>
                      <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                    </label>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>
                    Link Portfolio (opsional)
                  </label>
                  <input value={form.portfolioLink} onChange={e => setForm(f => ({ ...f, portfolioLink: e.target.value }))} placeholder="https://portfolio-kamu.com" style={inputStyle} />
                </div>

                <button type="submit" disabled={sending} style={{ background: "#266c87", color: "#fff", padding: "15px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, marginTop: "8px" }}>
                  {sending ? (mode === "RECRUITMENT" ? "Mengirim Lamaran..." : "Mengirim...") : (mode === "RECRUITMENT" ? "Kirim Lamaran →" : "Gabung Talent Pool →")}
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
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @media (max-width: 540px) {
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}