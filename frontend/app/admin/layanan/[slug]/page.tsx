"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { settingsApi } from "@/lib/api";
import Link from "next/link";

// Import data default sebagai fallback
import {
  RESEARCH_DATA, POLICY_BRIEF_DATA, TRAINING_DATA,
  CONSULTING_DATA, EVENT_DATA, MEDIA_SERVICE_DATA,
} from "@/lib/services-data";
import type { ServicePageData, ServiceFeature, ServiceStep, ServiceDeliverable, ServiceFAQ } from "@/components/shared/ServicePage";

const DATA_MAP: Record<string, ServicePageData> = {
  research: RESEARCH_DATA,
  "policy-brief": POLICY_BRIEF_DATA,
  training: TRAINING_DATA,
  consulting: CONSULTING_DATA,
  event: EVENT_DATA,
  media: MEDIA_SERVICE_DATA,
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  overview: "Overview",
  features: "What We Do",
  process: "Proses",
  deliverables: "Deliverables",
  clients: "Target Klien",
  why: "Mengapa Manara",
  faq: "FAQ",
  cta: "Contact CTA",
};

type ActiveSection = keyof typeof SECTION_LABELS;

export default function EditLayananPage() {
  const { slug } = useParams();
  const router = useRouter();
  const slugStr = String(slug);
  const defaultData = DATA_MAP[slugStr];

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [data, setData] = useState<ServicePageData>(defaultData);

  // Load saved data dari settings
  useEffect(() => {
    if (!defaultData) { setLoading(false); return; }
    settingsApi.get()
      .then(r => {
        const settings = r.data.data || {};
        const key = `service_${slugStr}`;
        if (settings[key]) {
          try {
            const parsed = JSON.parse(settings[key]);
            setData(prev => ({ ...prev, ...parsed }));
          } catch { }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slugStr]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(`service_${slugStr}`, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const updateData = (field: keyof ServicePageData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
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

  if (!defaultData) return (
    <div style={{ padding: "40px" }}>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", color: "#7A9AA5", marginBottom: "16px" }}>
        Layanan tidak ditemukan.
      </p>
      <Link href="/admin/layanan" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali</Link>
    </div>
  );

  if (loading) return (
    <div style={{ padding: "40px", color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
      Memuat data layanan...
    </div>
  );

  // ── Section editors ──────────────────────────────────

  const renderHero = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Judul Hero (baris 1)</label>
        <input value={data.heroTitle} onChange={e => updateData("heroTitle", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Judul Hero Aksen (baris 2, miring)</label>
        <input value={data.heroTitleAccent} onChange={e => updateData("heroTitleAccent", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Deskripsi Hero</label>
        <textarea value={data.heroDesc} onChange={e => updateData("heroDesc", e.target.value)}
          rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
      </div>
      <div>
        <label style={labelStyle}>Icon Hero</label>
        <input value={data.heroIcon} onChange={e => updateData("heroIcon", e.target.value)}
          style={{ ...inputStyle, maxWidth: "80px", textAlign: "center", fontSize: "20px" }} />
        <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
          Gunakan simbol: ○ ◇ △ ✦ □ ◎ ◉ ▷
        </p>
      </div>
      <div>
        <label style={labelStyle}>Warna Aksen (hex)</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input value={data.accentColor} onChange={e => updateData("accentColor", e.target.value)}
            style={{ ...inputStyle, maxWidth: "160px" }} />
          <div style={{ width: "36px", height: "36px", borderRadius: "4px", background: data.accentColor, border: "1px solid rgba(0,0,0,0.1)" }} />
        </div>
        <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
          Research: #266c87 · Paper: #3F6F6A · Journal: #5F8F8A
        </p>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Judul Overview</label>
        <input value={data.overviewTitle} onChange={e => updateData("overviewTitle", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Paragraf Overview</label>
        {data.overviewDesc.map((p, i) => (
          <div key={i} style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
            <textarea value={p}
              onChange={e => {
                const arr = [...data.overviewDesc];
                arr[i] = e.target.value;
                updateData("overviewDesc", arr);
              }}
              rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
            <button onClick={() => updateData("overviewDesc", data.overviewDesc.filter((_, j) => j !== i))}
              style={{ background: "none", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "2px", color: "#f87171", cursor: "pointer", padding: "0 10px", flexShrink: 0 }}>
              ×
            </button>
          </div>
        ))}
        <button onClick={() => updateData("overviewDesc", [...data.overviewDesc, ""])}
          style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "7px 16px", cursor: "pointer", width: "100%", marginTop: "4px" }}>
          + Tambah Paragraf
        </button>
      </div>

      <div>
        <label style={labelStyle}>Statistik (maks 4)</label>
        {data.overviewStats.map((stat, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
            <input value={stat.value} onChange={e => {
              const arr = [...data.overviewStats];
              arr[i] = { ...arr[i], value: e.target.value };
              updateData("overviewStats", arr);
            }} placeholder="Nilai" style={{ ...inputStyle, padding: "8px 10px" }} />
            <input value={stat.label} onChange={e => {
              const arr = [...data.overviewStats];
              arr[i] = { ...arr[i], label: e.target.value };
              updateData("overviewStats", arr);
            }} placeholder="Label" style={{ ...inputStyle, padding: "8px 10px" }} />
            <button onClick={() => updateData("overviewStats", data.overviewStats.filter((_, j) => j !== i))}
              style={{ background: "none", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "2px", color: "#f87171", cursor: "pointer", padding: "0 10px", height: "38px" }}>
              ×
            </button>
          </div>
        ))}
        {data.overviewStats.length < 4 && (
          <button onClick={() => updateData("overviewStats", [...data.overviewStats, { value: "", label: "" }])}
            style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "7px 16px", cursor: "pointer", width: "100%" }}>
            + Tambah Statistik
          </button>
        )}
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5" }}>
        Fitur-fitur yang ditampilkan di section "What We Do".
      </p>
      {data.features.map((f, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Fitur #{i + 1}</p>
            <button onClick={() => updateData("features", data.features.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "14px" }}>
              Hapus
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "8px", marginBottom: "8px" }}>
            <div>
              <label style={labelStyle}>Icon</label>
              <input value={f.icon} onChange={e => {
                const arr = [...data.features];
                arr[i] = { ...arr[i], icon: e.target.value };
                updateData("features", arr);
              }} style={{ ...inputStyle, textAlign: "center", fontSize: "18px", padding: "8px" }} />
            </div>
            <div>
              <label style={labelStyle}>Judul</label>
              <input value={f.title} onChange={e => {
                const arr = [...data.features];
                arr[i] = { ...arr[i], title: e.target.value };
                updateData("features", arr);
              }} style={inputStyle} />
            </div>
          </div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea value={f.desc} onChange={e => {
            const arr = [...data.features];
            arr[i] = { ...arr[i], desc: e.target.value };
            updateData("features", arr);
          }} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </div>
      ))}
      <button onClick={() => updateData("features", [...data.features, { icon: "○", title: "", desc: "" }])}
        style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Fitur
      </button>
    </div>
  );

  const renderProcess = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Judul Proses</label>
        <input value={data.processTitle} onChange={e => updateData("processTitle", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Deskripsi Proses</label>
        <textarea value={data.processDesc} onChange={e => updateData("processDesc", e.target.value)}
          rows={2} style={{ ...inputStyle, resize: "none" }} />
      </div>
      <div>
        <label style={labelStyle}>Langkah-langkah</label>
        {data.steps.map((step, i) => (
          <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Langkah {i + 1}</p>
              <button onClick={() => updateData("steps", data.steps.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
                Hapus
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "8px", marginBottom: "8px" }}>
              <div>
                <label style={labelStyle}>Nomor</label>
                <input value={step.num} onChange={e => {
                  const arr = [...data.steps];
                  arr[i] = { ...arr[i], num: e.target.value };
                  updateData("steps", arr);
                }} placeholder="01" style={{ ...inputStyle, padding: "8px 10px" }} />
              </div>
              <div>
                <label style={labelStyle}>Judul</label>
                <input value={step.title} onChange={e => {
                  const arr = [...data.steps];
                  arr[i] = { ...arr[i], title: e.target.value };
                  updateData("steps", arr);
                }} style={{ ...inputStyle, padding: "8px 10px" }} />
              </div>
              <div>
                <label style={labelStyle}>Durasi</label>
                <input value={step.duration || ""} onChange={e => {
                  const arr = [...data.steps];
                  arr[i] = { ...arr[i], duration: e.target.value };
                  updateData("steps", arr);
                }} placeholder="1–2 minggu" style={{ ...inputStyle, padding: "8px 10px" }} />
              </div>
            </div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea value={step.desc} onChange={e => {
              const arr = [...data.steps];
              arr[i] = { ...arr[i], desc: e.target.value };
              updateData("steps", arr);
            }} rows={2} style={{ ...inputStyle, resize: "none" }} />
          </div>
        ))}
        <button onClick={() => updateData("steps", [...data.steps, { num: `0${data.steps.length + 1}`, title: "", desc: "", duration: "" }])}
          style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
          + Tambah Langkah
        </button>
      </div>
    </div>
  );

  const renderDeliverables = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.deliverables.map((d, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Deliverable #{i + 1}</p>
            <button onClick={() => updateData("deliverables", data.deliverables.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
              Hapus
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "8px", marginBottom: "8px" }}>
            <div>
              <label style={labelStyle}>Icon</label>
              <input value={d.icon} onChange={e => {
                const arr = [...data.deliverables];
                arr[i] = { ...arr[i], icon: e.target.value };
                updateData("deliverables", arr);
              }} style={{ ...inputStyle, textAlign: "center", fontSize: "18px", padding: "8px" }} />
            </div>
            <div>
              <label style={labelStyle}>Judul</label>
              <input value={d.title} onChange={e => {
                const arr = [...data.deliverables];
                arr[i] = { ...arr[i], title: e.target.value };
                updateData("deliverables", arr);
              }} style={inputStyle} />
            </div>
          </div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea value={d.desc} onChange={e => {
            const arr = [...data.deliverables];
            arr[i] = { ...arr[i], desc: e.target.value };
            updateData("deliverables", arr);
          }} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </div>
      ))}
      <button onClick={() => updateData("deliverables", [...data.deliverables, { icon: "○", title: "", desc: "" }])}
        style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Deliverable
      </button>
    </div>
  );

  const renderClients = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontSize: "13px", color: "#7A9AA5" }}>Klien yang ditampilkan sebagai tag di halaman publik.</p>
      {data.clients.map((c, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: "8px", alignItems: "center" }}>
          <input value={c.icon} onChange={e => {
            const arr = [...data.clients];
            arr[i] = { ...arr[i], icon: e.target.value };
            updateData("clients", arr);
          }} placeholder="🏛️" style={{ ...inputStyle, textAlign: "center", fontSize: "18px", padding: "8px" }} />
          <input value={c.label} onChange={e => {
            const arr = [...data.clients];
            arr[i] = { ...arr[i], label: e.target.value };
            updateData("clients", arr);
          }} placeholder="Label klien" style={inputStyle} />
          <button onClick={() => updateData("clients", data.clients.filter((_, j) => j !== i))}
            style={{ background: "none", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "2px", color: "#f87171", cursor: "pointer", padding: "0 10px", height: "40px" }}>
            ×
          </button>
        </div>
      ))}
      <button onClick={() => updateData("clients", [...data.clients, { icon: "🏢", label: "" }])}
        style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Klien
      </button>
    </div>
  );

  const renderWhy = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Judul Section</label>
        <input value={data.whyTitle} onChange={e => updateData("whyTitle", e.target.value)} style={inputStyle} />
      </div>
      {data.whyPoints.map((p, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>Poin #{i + 1}</p>
            <button onClick={() => updateData("whyPoints", data.whyPoints.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
              Hapus
            </button>
          </div>
          <input value={p.title} onChange={e => {
            const arr = [...data.whyPoints];
            arr[i] = { ...arr[i], title: e.target.value };
            updateData("whyPoints", arr);
          }} placeholder="Judul poin" style={{ ...inputStyle, marginBottom: "8px", fontWeight: 500 }} />
          <textarea value={p.desc} onChange={e => {
            const arr = [...data.whyPoints];
            arr[i] = { ...arr[i], desc: e.target.value };
            updateData("whyPoints", arr);
          }} rows={2} placeholder="Deskripsi..." style={{ ...inputStyle, resize: "none" }} />
        </div>
      ))}
      <button onClick={() => updateData("whyPoints", [...data.whyPoints, { title: "", desc: "" }])}
        style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Poin
      </button>
    </div>
  );

  const renderFaq = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.faqs.map((faq, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#266c87" }}>FAQ #{i + 1}</p>
            <button onClick={() => updateData("faqs", data.faqs.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
              Hapus
            </button>
          </div>
          <label style={labelStyle}>Pertanyaan</label>
          <input value={faq.q} onChange={e => {
            const arr = [...data.faqs];
            arr[i] = { ...arr[i], q: e.target.value };
            updateData("faqs", arr);
          }} placeholder="Pertanyaan yang sering diajukan..." style={{ ...inputStyle, marginBottom: "8px" }} />
          <label style={labelStyle}>Jawaban</label>
          <textarea value={faq.a} onChange={e => {
            const arr = [...data.faqs];
            arr[i] = { ...arr[i], a: e.target.value };
            updateData("faqs", arr);
          }} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
        </div>
      ))}
      <button onClick={() => updateData("faqs", [...data.faqs, { q: "", a: "" }])}
        style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px dashed rgba(38,108,135,0.3)", borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah FAQ
      </button>
    </div>
  );

  const renderCta = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Judul CTA</label>
        <input value={data.ctaTitle} onChange={e => updateData("ctaTitle", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Deskripsi CTA</label>
        <textarea value={data.ctaDesc} onChange={e => updateData("ctaDesc", e.target.value)}
          rows={2} style={{ ...inputStyle, resize: "none" }} />
      </div>
    </div>
  );

  const SECTION_RENDERERS: Record<ActiveSection, () => JSX.Element> = {
    hero: renderHero,
    overview: renderOverview,
    features: renderFeatures,
    process: renderProcess,
    deliverables: renderDeliverables,
    clients: renderClients,
    why: renderWhy,
    faq: renderFaq,
    cta: renderCta,
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1040px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin/layanan" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>
            Edit Layanan
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830" }}>
            {data.category}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link href={`/layanan/${slugStr}`} target="_blank"
            style={{ padding: "9px 16px", fontSize: "12px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#7A9AA5", textDecoration: "none", letterSpacing: "0.04em" }}>
            Preview ↗
          </Link>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: "9px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: saved ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, transition: "background 0.3s" }}>
            {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Semua"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px" }}>

        {/* LEFT — Section navigator */}
        <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(38,108,135,0.08)", background: "rgba(38,108,135,0.02)" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                Section
              </p>
            </div>
            {(Object.entries(SECTION_LABELS) as [ActiveSection, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setActiveSection(key)}
                style={{ width: "100%", padding: "11px 16px", display: "block", textAlign: "left", background: activeSection === key ? "rgba(38,108,135,0.06)" : "transparent", border: "none", borderLeft: `3px solid ${activeSection === key ? "#266c87" : "transparent"}`, cursor: "pointer", fontSize: "13px", fontWeight: activeSection === key ? 500 : 300, color: activeSection === key ? "#266c87" : "#3A5560", transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Reset ke default */}
          <button onClick={() => {
            if (confirm("Reset ke data default? Semua perubahan yang belum disimpan akan hilang.")) {
              setData(defaultData);
            }
          }}
            style={{ width: "100%", marginTop: "10px", padding: "8px", fontSize: "11px", color: "#B8CDD2", background: "none", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "2px", cursor: "pointer", letterSpacing: "0.04em" }}>
            Reset ke Default
          </button>
        </div>

        {/* RIGHT — Editor area */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "28px" }}>
          <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
              {SECTION_LABELS[activeSection]}
            </h2>
            <p style={{ fontSize: "13px", color: "#B8CDD2" }}>
              Ubah konten section ini. Klik "Simpan Semua" untuk menyimpan ke database.
            </p>
          </div>

          {SECTION_RENDERERS[activeSection]?.()}
        </div>
      </div>
    </div>
  );
}