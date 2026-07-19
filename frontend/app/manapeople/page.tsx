"use client";
import { useEffect, useState } from "react";
import { recruitmentApi, waitlistApi } from "@/lib/api";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Tipe data ─────────────────────────────────────────
interface Position {
  id: string;
  name: string;
  description?: string;
  requirements: string[];
  slots?: number;
}

interface Batch {
  id: string;
  batchName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  positions: Position[];
  _count?: { applications: number };
}

// ── Konstanta warna & style ───────────────────────────
const ACCENT = "#266c87";

export default function ManapeoplePage() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "form">("info");

  useEffect(() => {
    recruitmentApi.active()
      .then(r => setBatch(r.data.data))
      .catch(() => setBatch(null))
      .finally(() => setLoading(false));
      }, []);

      return (
        <HeroBackground
          settingKey={HERO_BG_KEYS.manapeople}
          fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
          gradientDirection="to-right"
          gradientColor="#0F2830"
          gradientOpacity={0.88}
          style={{ padding: "80px clamp(20px,5vw,40px) 0" }}
        >
          <main style={{ background: "#F4F7F7" }}>
            <Navbar />

            {loading ? (
              <LoadingSkeleton />
            ) : batch ? (
              <BatchMode batch={batch} />
            ) : (
              <WaitlistMode />
            )}

            <Footer />
          </main>
        </HeroBackground>
      );
    }

// ─────────────────────────────────────────────────────
// MODE 1: Tidak ada batch → Waitlist
// ─────────────────────────────────────────────────────
function WaitlistMode() {
  const [step, setStep] = useState<"landing" | "form" | "success">("landing");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
    source: "",
  });
  const [error, setError] = useState("");

  const INTEREST_OPTIONS = [
    "Riset & Analisis Kebijakan",
    "Penulisan & Editorial",
    "Desain & Kreatif",
    "Media & Konten",
    "Hukum & Legal",
    "Teknologi & Web",
    "Event & Program",
    "Umum / Belum Tahu",
  ];

  const SOURCE_OPTIONS = [
    "Instagram Manara",
    "Rekomendasi teman",
    "Google / Search",
    "Twitter / X",
    "LinkedIn",
    "Lainnya",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Nama dan email wajib diisi");
      return;
    }
    setSending(true);
    setError("");
    try {
      await waitlistApi.join(form);
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1px solid rgba(38,108,135,0.2)",
    borderRadius: "4px",
    fontSize: "15px",
    outline: "none",
    color: "#1C3038",
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  if (step === "success") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px 80px" }}>
        <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#0F2830,#266c87)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "36px" }}>
            ✓
          </div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, color: "#0F2830", marginBottom: "14px" }}>
            Kamu sudah masuk daftar!
          </h2>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, marginBottom: "32px" }}>
            Terima kasih, <strong style={{ color: "#0F2830" }}>{form.name}</strong>. Kami akan menghubungimu di <strong style={{ color: ACCENT }}>{form.email}</strong> segera setelah rekrutmen Manapeople dibuka.
          </p>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
              Sementara itu, ikuti Manara di:
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "Instagram", href: "https://instagram.com/manara.id" },
                { label: "Baca Artikel", href: "/publikasi/artikel" },
                { label: "Newsletter", href: "/insight/newsletter" },
              ].map(l => (
                <a key={l.label} href={l.href}
                  style={{ fontSize: "13px", fontWeight: 500, color: ACCENT, border: `1px solid ${ACCENT}30`, padding: "7px 16px", borderRadius: "4px", textDecoration: "none" }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px" }}>

      {/* ── HERO ── */}
      <section style={{ padding: "80px clamp(20px,5vw,40px) 0", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 20% 60%, rgba(38,108,135,0.2) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center", paddingBottom: "80px" }} className="hero-grid">
            <div>
              {/* Status badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(38,108,135,0.2)", border: "1px solid rgba(38,108,135,0.3)", padding: "8px 16px", borderRadius: "20px", marginBottom: "24px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(134,175,170,0.8)", letterSpacing: "0.06em" }}>
                  Rekrutmen Belum Dibuka
                </span>
              </div>

              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.08, marginBottom: "20px" }}>
                Mana<em style={{ color: "#86AFAA" }}>People.</em>
              </h1>
              <p style={{ fontSize: "clamp(16px,2vw,19px)", fontWeight: 300, color: "rgba(134,175,170,0.6)", lineHeight: 1.85, marginBottom: "32px" }}>
                Program rekrutmen dan onboarding Manara — sebuah undangan untuk menjadi bagian dari kolektif intelektual yang percaya bahwa gagasan dapat mengubah ruang publik.
              </p>

              {step === "landing" && (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setStep("form")}
                    style={{ background: ACCENT, color: "#fff", padding: "14px 32px", fontSize: "14px", fontWeight: 500, letterSpacing: "0.04em", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Daftarkan Minatmu →
                  </button>
                  <a href="/tentang/manara"
                    style={{ border: "1px solid rgba(134,175,170,0.25)", color: "rgba(134,175,170,0.7)", padding: "14px 28px", fontSize: "14px", fontWeight: 300, borderRadius: "4px", textDecoration: "none" }}>
                    Pelajari Manara
                  </a>
                </div>
              )}
            </div>

            {/* Right — ilustrasi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="hero-stats">
              {[
                { num: "5", label: "Co-Founders", sub: "Mendirikan Manara dari nol" },
                { num: "2026", label: "Tahun Berdiri", sub: "Berbasis di Malang" },
                { num: "∞", label: "Peluang", sub: "Terbuka untuk semua disiplin" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "8px", padding: "18px 22px", display: "flex", gap: "16px", alignItems: "center" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: ACCENT, lineHeight: 1, minWidth: "60px" }}>
                    {s.num}
                  </p>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#EEF4F6", marginBottom: "2px" }}>{s.label}</p>
                    <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(134,175,170,0.45)" }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TENTANG MANAPEOPLE ── */}
      <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: "12px" }}>
              Siapa Manapeople?
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: "#0F2830", maxWidth: "600px", margin: "0 auto" }}>
              Lebih dari kontributor — bagian dari gerakan.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
            {[
              {
                icon: "✦",
                title: "Penulis & Analis",
                desc: "Menulis opini, esai, analisis kebijakan, dan artikel ilmiah populer untuk publikasi Manara.",
              },
              {
                icon: "◎",
                title: "Peneliti",
                desc: "Berkontribusi dalam riset kebijakan, kajian lapangan, dan produksi Manara Paper & Journal.",
              },
              {
                icon: "◇",
                title: "Kreator Konten",
                desc: "Memproduksi konten visual, video, dan media untuk Suara Manara dan kanal digital.",
              },
              {
                icon: "○",
                title: "Pengelola Program",
                desc: "Mengkoordinasikan event, newsletter, rekrutmen, dan program komunitas Manara.",
              },
            ].map(item => (
              <div key={item.title} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "28px 24px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${ACCENT}30`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontSize: "18px", marginBottom: "16px" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM WAITLIST ── */}
      {step === "form" && (
        <section id="daftar" style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ marginBottom: "40px" }}>
              <button
                onClick={() => setStep("landing")}
                style={{ background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "13px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                ← Kembali
              </button>
              <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: "10px" }}>
                Waitlist Manapeople
              </p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "#0F2830", marginBottom: "10px" }}>
                Daftarkan minatmu sekarang.
              </h2>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8 }}>
                Rekrutmen Manapeople belum dibuka. Tapi kamu bisa daftar sekarang agar kami menghubungimu langsung saat batch dibuka.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "12px", padding: "clamp(24px,4vw,40px)", display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Nama + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="form-two-col">
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Nama Lengkap <span style={{ color: ACCENT }}>*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nama kamu"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Email <span style={{ color: ACCENT }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="email@kamu.com"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    No. WhatsApp (opsional)
                  </label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="08xx xxxx xxxx"
                    style={inputStyle}
                  />
                </div>

                {/* Minat */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Bidang yang Diminati
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {INTEREST_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, interest: f.interest === opt ? "" : opt }))}
                        style={{
                          padding: "8px 16px",
                          fontSize: "13px",
                          fontWeight: 300,
                          border: `1px solid ${form.interest === opt ? ACCENT : "rgba(38,108,135,0.2)"}`,
                          borderRadius: "20px",
                          background: form.interest === opt ? ACCENT + "15" : "transparent",
                          color: form.interest === opt ? ACCENT : "#7A9AA5",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pesan */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Ceritakan sedikit tentang dirimu (opsional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Latar belakang, pengalaman, atau hal apapun yang ingin kamu sampaikan ke tim Manara..."
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }}
                  />
                </div>

                {/* Dari mana */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Dari mana kamu tahu Manara?
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {SOURCE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, source: f.source === opt ? "" : opt }))}
                        style={{
                          padding: "7px 14px",
                          fontSize: "12px",
                          border: `1px solid ${form.source === opt ? ACCENT : "rgba(38,108,135,0.15)"}`,
                          borderRadius: "20px",
                          background: form.source === opt ? ACCENT + "12" : "transparent",
                          color: form.source === opt ? ACCENT : "#7A9AA5",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "12px 16px" }}>
                    <p style={{ fontSize: "14px", color: "#ef4444" }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{ background: sending ? "#B8CDD2" : ACCENT, color: "#fff", padding: "16px", fontSize: "15px", fontWeight: 500, border: "none", borderRadius: "4px", cursor: sending ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                >
                  {sending ? "Mendaftarkan..." : "Daftarkan Minat Saya →"}
                </button>

                <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center", lineHeight: 1.6 }}>
                  Dengan mendaftar, kamu menyetujui data yang diberikan akan digunakan untuk keperluan rekrutmen Manara. Tidak ada spam.
                </p>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ── NILAI MANAPEOPLE ── */}
      {step === "landing" && (
        <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#0F2830" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 300, color: "#EEF4F6" }}>
                Kenapa bergabung dengan Manara?
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px" }}>
              {[
                { num: "01", title: "Komunitas Intelektual", desc: "Bergabung dengan jaringan pemikir, penulis, dan peneliti muda yang serius." },
                { num: "02", title: "Portofolio Nyata", desc: "Karyamu dipublikasikan dan dapat diakses publik — bukan sekadar tugas internal." },
                { num: "03", title: "Belajar dari Praktisi", desc: "Akses langsung ke co-founder dan fellows Manara yang aktif di bidangnya." },
                { num: "04", title: "Fleksibel & Remote", desc: "Tidak ada jam kerja kaku. Kontribusi sesuai kapasitas dan jadwalmu." },
              ].map(item => (
                <div key={item.num} style={{ background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "8px", padding: "24px" }}>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "rgba(38,108,135,0.4)", marginBottom: "12px" }}>
                    {item.num}
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 500, color: "#EEF4F6", marginBottom: "8px" }}>{item.title}</p>
                  <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button
                onClick={() => setStep("form")}
                style={{ background: ACCENT, color: "#fff", padding: "15px 40px", fontSize: "15px", fontWeight: 500, border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Daftarkan Minatmu →
              </button>
            </div>
          </div>
        </section>
      )}

      <style>{`
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.8); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-stats { display: none !important; }
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// MODE 2: Ada batch aktif → Form Lamaran
// ─────────────────────────────────────────────────────
function BatchMode({ batch }: { batch: Batch }) {
  const [step, setStep] = useState<"info" | "form" | "success">("info");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [sending, setSending] = useState(false);
  const [appId, setAppId] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    motivation: "",
    portfolioLink: "",
  });

  const deadline = batch.endDate ? new Date(batch.endDate) : null;
  const daysLeft = deadline
    ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.position || !form.motivation) {
      setError("Mohon lengkapi semua kolom wajib (*)");
      return;
    }
    setSending(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      if (form.phone) fd.append("phone", form.phone);
      fd.append("position", form.position);
      fd.append("motivation", form.motivation);
      if (form.portfolioLink) fd.append("portfolioLink", form.portfolioLink);
      if (cvFile) fd.append("cv", cvFile);

      const res = await recruitmentApi.apply(batch.id, fd);
      setAppId(res.data.data.id);
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim lamaran. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1px solid rgba(38,108,135,0.2)",
    borderRadius: "4px",
    fontSize: "15px",
    outline: "none",
    color: "#1C3038",
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  if (step === "success") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px 80px" }}>
        <div style={{ maxWidth: "540px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#3F6F6A,#266c87)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "36px", color: "#fff" }}>
            ✓
          </div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, color: "#0F2830", marginBottom: "14px" }}>
            Lamaran Terkirim!
          </h2>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.8, marginBottom: "28px" }}>
            Terima kasih, <strong style={{ color: "#0F2830" }}>{form.fullName}</strong>. Tim Manara akan meninjau lamaranmu dan menghubungimu via email di <strong style={{ color: ACCENT }}>{form.email}</strong>.
          </p>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "8px", padding: "18px 22px", marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              ID Lamaran
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "13px", color: ACCENT, wordBreak: "break-all" }}>{appId}</p>
            <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "6px" }}>Simpan ID ini sebagai referensi</p>
          </div>
          <a href="/tentang/manara" style={{ fontSize: "14px", color: ACCENT, textDecoration: "none" }}>
            Pelajari lebih lanjut tentang Manara →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px" }}>

      {/* ── HERO BATCH ── */}
      <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 80% 30%, rgba(38,108,135,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>

          {/* Status aktif */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", padding: "8px 18px", borderRadius: "20px", marginBottom: "24px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", animation: "pulseDot 2s infinite" }} />
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#4ade80", letterSpacing: "0.06em" }}>
              Rekrutmen Sedang Dibuka
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="hero-grid">
            <div>
              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.08, marginBottom: "16px" }}>
                Mana<em style={{ color: "#86AFAA" }}>People.</em>
              </h1>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 300, color: "#86AFAA", fontStyle: "italic", marginBottom: "16px" }}>
                {batch.batchName}
              </p>
              {batch.description && (
                <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.6)", lineHeight: 1.85, marginBottom: "28px" }}>
                  {batch.description}
                </p>
              )}
              {step === "info" && (
                <button
                  onClick={() => setStep("form")}
                  style={{ background: ACCENT, color: "#fff", padding: "14px 36px", fontSize: "15px", fontWeight: 500, border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Lamar Sekarang →
                </button>
              )}
            </div>

            {/* Info panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Deadline */}
              {deadline && (
                <div style={{ background: daysLeft && daysLeft <= 7 ? "rgba(239,68,68,0.1)" : "rgba(38,108,135,0.1)", border: `1px solid ${daysLeft && daysLeft <= 7 ? "rgba(239,68,68,0.25)" : "rgba(38,108,135,0.2)"}`, borderRadius: "8px", padding: "16px 20px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                    Deadline Pendaftaran
                  </p>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: daysLeft && daysLeft <= 7 ? "#f87171" : "#EEF4F6" }}>
                    {deadline.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {daysLeft !== null && (
                    <p style={{ fontSize: "13px", color: daysLeft <= 7 ? "#f87171" : "rgba(134,175,170,0.5)", marginTop: "4px" }}>
                      {daysLeft === 0 ? "Hari ini!" : `${daysLeft} hari lagi`}
                    </p>
                  )}
                </div>
              )}

              {/* Posisi tersedia */}
              <div style={{ background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "8px", padding: "16px 20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Posisi Tersedia ({batch.positions.length})
                </p>
                {batch.positions.map(pos => (
                  <div key={pos.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#EEF4F6" }}>{pos.name}</p>
                    {pos.slots && (
                      <span style={{ fontSize: "11px", color: "rgba(134,175,170,0.4)", marginLeft: "auto" }}>
                        {pos.slots} slot
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DETAIL POSISI ── */}
      {step === "info" && batch.positions.length > 0 && (
        <section style={{ padding: "64px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: "28px" }}>
              Detail Posisi
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
              {batch.positions.map(pos => (
                <div key={pos.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "24px" }}>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "8px" }}>
                    {pos.name}
                  </h3>
                  {pos.description && (
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.75, marginBottom: "14px" }}>
                      {pos.description}
                    </p>
                  )}
                  {pos.requirements.length > 0 && (
                    <>
                      <p style={{ fontSize: "11px", fontWeight: 500, color: "#B8CDD2", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Kualifikasi
                      </p>
                      {pos.requirements.map((req, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
                          <span style={{ color: ACCENT, flexShrink: 0 }}>✓</span>
                          <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560" }}>{req}</p>
                        </div>
                      ))}
                    </>
                  )}
                  <button
                    onClick={() => {
                      setForm(f => ({ ...f, position: pos.name }));
                      setStep("form");
                    }}
                    style={{ width: "100%", marginTop: "16px", padding: "10px", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Lamar Posisi Ini →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FORM LAMARAN ── */}
      {step === "form" && (
        <section style={{ padding: "64px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <button
              onClick={() => setStep("info")}
              style={{ background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "13px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              ← Kembali ke info batch
            </button>

            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: "10px" }}>
              Form Pendaftaran
            </p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 300, color: "#0F2830", marginBottom: "28px" }}>
              {batch.batchName}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "12px", padding: "clamp(24px,4vw,40px)", display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Nama + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="form-two-col">
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Nama Lengkap <span style={{ color: ACCENT }}>*</span>
                    </label>
                    <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      placeholder="Nama lengkapmu" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Email <span style={{ color: ACCENT }}>*</span>
                    </label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="email@kamu.com" required style={inputStyle} />
                  </div>
                </div>

                {/* Phone + Posisi */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="form-two-col">
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      No. WhatsApp
                    </label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="08xx xxxx xxxx" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Posisi yang Dilamar <span style={{ color: ACCENT }}>*</span>
                    </label>
                    <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                      required style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                      <option value="" disabled>Pilih posisi</option>
                      {batch.positions.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Motivasi */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Motivasi & Cerita Singkat <span style={{ color: ACCENT }}>*</span>
                  </label>
                  <textarea value={form.motivation} onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                    placeholder="Ceritakan mengapa kamu ingin bergabung dengan Manara, apa yang bisa kamu kontribusikan, dan mengapa posisi ini tepat untukmu..."
                    required rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }} />
                  <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "5px" }}>
                    {form.motivation.split(/\s+/).filter(Boolean).length} kata
                  </p>
                </div>

                {/* Portfolio */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Link Portfolio / Karya (opsional)
                  </label>
                  <input value={form.portfolioLink} onChange={e => setForm(f => ({ ...f, portfolioLink: e.target.value }))}
                    placeholder="https://portfolio-kamu.com atau link Google Drive" style={inputStyle} />
                </div>

                {/* CV Upload */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Upload CV (PDF, opsional)
                  </label>
                  {cvFile ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 16px", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px" }}>
                      <span style={{ fontSize: "20px" }}>📄</span>
                      <p style={{ flex: 1, fontSize: "13px", color: "#0F2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cvFile.name}
                      </p>
                      <button type="button" onClick={() => setCvFile(null)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}>
                        ×
                      </button>
                    </div>
                  ) : (
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px", border: "2px dashed rgba(38,108,135,0.2)", borderRadius: "4px", cursor: "pointer", gap: "6px" }}>
                      <span style={{ fontSize: "28px" }}>📄</span>
                      <p style={{ fontSize: "13px", color: "#7A9AA5" }}>Klik untuk upload CV</p>
                      <p style={{ fontSize: "11px", color: "#B8CDD2" }}>PDF · Max 10MB</p>
                      <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                    </label>
                  )}
                </div>

                {error && (
                  <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "12px 16px" }}>
                    <p style={{ fontSize: "14px", color: "#ef4444" }}>{error}</p>
                  </div>
                )}

                <button type="submit" disabled={sending}
                  style={{ background: sending ? "#B8CDD2" : ACCENT, color: "#fff", padding: "16px", fontSize: "15px", fontWeight: 500, border: "none", borderRadius: "4px", cursor: sending ? "not-allowed" : "pointer" }}>
                  {sending ? "Mengirim Lamaran..." : "Kirim Lamaran →"}
                </button>

                <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center", lineHeight: 1.6 }}>
                  Dengan mengirim, kamu menyetujui data yang diberikan akan digunakan dalam proses seleksi Manara.
                </p>
              </div>
            </form>
          </div>
        </section>
      )}

      <style>{`
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.8); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", background: "#F4F7F7" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: i === 1 ? "48px" : "20px", background: "rgba(38,108,135,0.08)", borderRadius: "4px", width: i === 2 ? "60%" : "100%", animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}