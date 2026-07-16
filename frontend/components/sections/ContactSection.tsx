"use client";
import { useState } from "react";
import { contactApi } from "@/lib/api";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", purpose: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const socialLinks = [
  { label: "IG", href: "https://instagram.com/manara_institute" },
  { label: "YT", href: "https://youtube.com/@ManaraInstitute" },
];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Mohon lengkapi semua kolom wajib");
      return;
    }
    setSending(true);
    setError("");
    try {
      await contactApi.send(form);
      setSent(true);
      setForm({ name: "", email: "", purpose: "", message: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim pesan. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
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
    <section id="contact" style={{ padding: "120px 40px", background: "#F8FAFA" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>

          {/* Left */}
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "24px" }}>
              Hubungi Kami
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,4vw,50px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.14, marginBottom: "24px" }}>
              Mari mulai<br />sebuah percakapan.
            </h2>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.85, marginBottom: "48px" }}>
              Apakah kamu ingin berkolaborasi, berkontribusi, menghadiri program, atau sekadar menyapa. kami ingin mendengar darimu.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
              {[
                { icon: "@", label: "Email", value: "manararesearch@gmail.com" },
                { icon: "◎", label: "Berbasis Di", value: "Kota Malang, Jawa Timur" },
                { icon: "✦", label: "Kemitraan", value: "manararesearch@gmail.com" },
              ].map(ch => (
                <div key={ch.label} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#266c87", fontSize: "15px", flexShrink: 0 }}>
                    {ch.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>
                      {ch.label}
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: 300, color: "#1C3038" }}>{ch.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: "10px" }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(38,108,135,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", textDecoration: "none" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "#F4F7F7", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "48px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(95,143,138,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>
                  ✓
                </div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830", marginBottom: "10px" }}>
                  Pesan Terkirim!
                </p>
                <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, marginBottom: "28px" }}>
                  Terima kasih telah menghubungi Manara. Kami akan membalas pesanmu segera.
                </p>
                <button onClick={() => setSent(false)} style={{ background: "none", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", padding: "10px 24px", fontSize: "13px", color: "#266c87", cursor: "pointer" }}>
                  Kirim Pesan Lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
                    Nama Kamu *
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Apa yang harus kami panggil?"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@kamu.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
                    Tujuan
                  </label>
                  <select
                    value={form.purpose}
                    onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  >
                    <option value="" disabled>Apa yang membawamu ke sini?</option>
                    <option>Kolaborasi / Kemitraan</option>
                    <option>Pertanyaan Program</option>
                    <option>Kontribusi Tulisan</option>
                    <option>Manapeople / Rekrutmen</option>
                    <option>Permintaan Media</option>
                    <option>Pesan Umum</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
                    Pesanmu *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Ceritakan apa yang ada di pikiranmu…"
                    rows={5}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: "13px", color: "#f87171", background: "rgba(248,113,113,0.08)", padding: "10px 14px", borderRadius: "2px" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{ background: "#0F2830", color: "#F4F7F7", padding: "16px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, transition: "background 0.2s" }}
                  onMouseEnter={e => !sending && ((e.currentTarget as HTMLButtonElement).style.background = "#266c87")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#0F2830")}
                >
                  {sending ? "Mengirim..." : "Kirim Pesan →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}