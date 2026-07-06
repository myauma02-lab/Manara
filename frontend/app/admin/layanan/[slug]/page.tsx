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
import type { ServicePageData } from "@/components/shared/ServicePage";

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

  const handleReset = () => {
    if (!defaultData) return;
    if (confirm("Kembalikan semua konten layanan ini ke default? Perubahan yang belum disimpan akan hilang.")) {
      setData(defaultData);
    }
  };

  // ---------- Styles ----------
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
  };

  const inputDisabledStyle: React.CSSProperties = {
    ...inputStyle,
    background: "rgba(38,108,135,0.04)",
    color: "#7A8A92",
    cursor: "not-allowed",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical" as const,
    lineHeight: 1.5,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#266C87",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const helpStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#7A8A92",
    marginTop: "4px",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid rgba(38,108,135,0.12)",
    borderRadius: "3px",
    padding: "20px",
    marginBottom: "16px",
  };

  const sectionIntroStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#7A8A92",
    marginBottom: "16px",
    lineHeight: 1.5,
  };

  const btnPrimary: React.CSSProperties = {
    background: "#266C87",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const btnSecondary: React.CSSProperties = {
    background: "#fff",
    color: "#266C87",
    border: "1px solid rgba(38,108,135,0.3)",
    borderRadius: "2px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const btnDangerGhost: React.CSSProperties = {
    background: "transparent",
    color: "#B3261E",
    border: "1px solid rgba(179,38,30,0.3)",
    borderRadius: "2px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const iconBtn: React.CSSProperties = {
    background: "rgba(38,108,135,0.06)",
    color: "#266C87",
    border: "1px solid rgba(38,108,135,0.15)",
    borderRadius: "2px",
    padding: "5px 9px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const row2Style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  };

  // ---------- Field generik ----------
  function Field({
    label, value, onChange, textarea = false, placeholder = "", disabled = false, help,
  }: {
    label: string; value: string; onChange?: (v: string) => void;
    textarea?: boolean; placeholder?: string; disabled?: boolean; help?: string;
  }) {
    return (
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>{label}</label>
        {textarea ? (
          <textarea
            style={disabled ? { ...textareaStyle, background: "rgba(38,108,135,0.04)", color: "#7A8A92" } : textareaStyle}
            value={value || ""}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
        ) : (
          <input
            style={disabled ? inputDisabledStyle : inputStyle}
            value={value || ""}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
        )}
        {help && <div style={helpStyle}>{help}</div>}
      </div>
    );
  }

  // ---------- Editor generik untuk array of object ----------
  function ArrayObjectEditor<T extends Record<string, any>>({
    items, onChange, fields, itemLabel, emptyItem,
  }: {
    items: T[];
    onChange: (items: T[]) => void;
    fields: { key: keyof T; label: string; textarea?: boolean; placeholder?: string }[];
    itemLabel: (item: T, index: number) => string;
    emptyItem: T;
  }) {
    const list = items || [];

    const updateItem = (index: number, key: keyof T, value: any) => {
      const next = [...list];
      next[index] = { ...next[index], [key]: value };
      onChange(next);
    };

    const addItem = () => onChange([...list, { ...emptyItem }]);

    const removeItem = (index: number) => {
      if (!confirm("Hapus item ini?")) return;
      onChange(list.filter((_, i) => i !== index));
    };

    const moveItem = (index: number, dir: -1 | 1) => {
      const target = index + dir;
      if (target < 0 || target >= list.length) return;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      onChange(next);
    };

    return (
      <div>
        {list.map((item, index) => (
          <div key={index} style={cardStyle}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "14px", paddingBottom: "10px",
              borderBottom: "1px solid rgba(38,108,135,0.1)",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1C3038" }}>
                {itemLabel(item, index)}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button type="button" style={iconBtn} onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
                <button type="button" style={iconBtn} onClick={() => moveItem(index, 1)} disabled={index === list.length - 1}>↓</button>
                <button type="button" style={btnDangerGhost} onClick={() => removeItem(index)}>Hapus</button>
              </div>
            </div>
            {fields.map((f) => (
              <Field
                key={String(f.key)}
                label={f.label}
                value={item[f.key] ?? ""}
                textarea={f.textarea}
                placeholder={f.placeholder}
                onChange={(v) => updateItem(index, f.key, v)}
              />
            ))}
          </div>
        ))}
        <button type="button" style={btnSecondary} onClick={addItem}>
          + Tambah Item
        </button>
      </div>
    );
  }

  // ---------- Editor untuk array of string (paragraf overview) ----------
  function StringListEditor({
    items, onChange, placeholder, textarea = false, itemLabel,
  }: {
    items: string[]; onChange: (items: string[]) => void; placeholder?: string;
    textarea?: boolean; itemLabel?: (i: number) => string;
  }) {
    const list = items || [];

    const updateItem = (index: number, value: string) => {
      const next = [...list];
      next[index] = value;
      onChange(next);
    };

    const addItem = () => onChange([...list, ""]);
    const removeItem = (index: number) => onChange(list.filter((_, i) => i !== index));
    const moveItem = (index: number, dir: -1 | 1) => {
      const target = index + dir;
      if (target < 0 || target >= list.length) return;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      onChange(next);
    };

    return (
      <div>
        {list.map((item, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            {itemLabel && <label style={labelStyle}>{itemLabel(index)}</label>}
            <div style={{ display: "flex", gap: "8px" }}>
              {textarea ? (
                <textarea
                  style={textareaStyle}
                  value={item}
                  placeholder={placeholder}
                  onChange={(e) => updateItem(index, e.target.value)}
                />
              ) : (
                <input
                  style={inputStyle}
                  value={item}
                  placeholder={placeholder}
                  onChange={(e) => updateItem(index, e.target.value)}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <button type="button" style={iconBtn} onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
                <button type="button" style={iconBtn} onClick={() => moveItem(index, 1)} disabled={index === list.length - 1}>↓</button>
              </div>
              <button type="button" style={btnDangerGhost} onClick={() => removeItem(index)}>Hapus</button>
            </div>
          </div>
        ))}
        <button type="button" style={btnSecondary} onClick={addItem}>+ Tambah</button>
      </div>
    );
  }

  // ---------- Guard: slug tidak dikenal ----------
  if (!defaultData) {
    return (
      <div style={{ padding: "40px", fontFamily: "inherit" }}>
        <p style={{ color: "#B3261E", fontWeight: 600, marginBottom: "12px" }}>
          Layanan dengan slug "{slugStr}" tidak ditemukan.
        </p>
        <Link href="/admin/layanan" style={{ color: "#266C87", fontSize: "14px" }}>
          ← Kembali ke daftar layanan
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#266C87", fontFamily: "inherit" }}>
        Memuat konten...
      </div>
    );
  }

  const d: any = data;

  // ---------- Render konten per section ----------
  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        return (
          <div style={cardStyle}>
            <Field label="Slug (URL)" value={d.slug} disabled help="Slug tidak bisa diubah dari sini karena menentukan alamat halaman." />
            <div style={row2Style}>
              <Field label="Kategori" value={d.category} onChange={(v) => updateData("category", v)} />
              <Field
                label="Warna Aksen"
                value={d.accentColor}
                onChange={(v) => updateData("accentColor", v)}
                placeholder="#266c87"
                help="Kode warna HEX, mis. #266c87"
              />
            </div>
            <Field
              label="Icon Hero"
              value={d.heroIcon}
              onChange={(v) => updateData("heroIcon", v)}
              placeholder="○ ◇ ✦ ..."
              help="Simbol/karakter tunggal yang tampil di hero"
            />
            <Field label="Judul Hero" value={d.heroTitle} onChange={(v) => updateData("heroTitle", v)} />
            <Field
              label="Judul Hero (Bagian Aksen)"
              value={d.heroTitleAccent}
              onChange={(v) => updateData("heroTitleAccent", v)}
              help="Lanjutan judul yang ditampilkan dengan warna aksen"
            />
            <Field label="Deskripsi Hero" value={d.heroDesc} onChange={(v) => updateData("heroDesc", v)} textarea />
            <Field
              label="Gradient Hero (CSS, opsional)"
              value={d.heroGrad}
              onChange={(v) => updateData("heroGrad", v)}
              textarea
              help="Nilai CSS background-gradient. Hanya ubah jika paham CSS."
            />
            <div style={row2Style}>
              <Field label="Parent Href" value={d.parentHref} onChange={(v) => updateData("parentHref", v)} />
              <Field label="Parent Label" value={d.parentLabel} onChange={(v) => updateData("parentLabel", v)} />
            </div>
          </div>
        );

      case "overview":
        return (
          <>
            <div style={cardStyle}>
              <Field label="Judul Overview" value={d.overviewTitle} onChange={(v) => updateData("overviewTitle", v)} />
            </div>
            <p style={sectionIntroStyle}>Paragraf Deskripsi Overview</p>
            <StringListEditor
              items={d.overviewDesc}
              onChange={(items) => updateData("overviewDesc", items)}
              textarea
              itemLabel={(i) => `Paragraf ${i + 1}`}
              placeholder="Tulis paragraf overview..."
            />
            <p style={sectionIntroStyle}>Statistik Overview</p>
            <ArrayObjectEditor
              items={d.overviewStats}
              onChange={(items) => updateData("overviewStats", items)}
              itemLabel={(item, i) => item.value || `Statistik #${i + 1}`}
              emptyItem={{ value: "", label: "" }}
              fields={[
                { key: "value", label: "Value (mis. Berbasis / 4-8 / 10)" },
                { key: "label", label: "Label penjelas" },
              ]}
            />
          </>
        );

      case "features":
        return (
          <ArrayObjectEditor
            items={d.features}
            onChange={(items) => updateData("features", items)}
            itemLabel={(item, i) => item.title || `Fitur #${i + 1}`}
            emptyItem={{ icon: "○", title: "", desc: "" }}
            fields={[
              { key: "icon", label: "Icon (simbol)" },
              { key: "title", label: "Judul" },
              { key: "desc", label: "Deskripsi", textarea: true },
            ]}
          />
        );

      case "process":
        return (
          <>
            <div style={cardStyle}>
              <Field label="Judul Proses" value={d.processTitle} onChange={(v) => updateData("processTitle", v)} />
              <Field label="Deskripsi Proses" value={d.processDesc} onChange={(v) => updateData("processDesc", v)} textarea />
            </div>
            <ArrayObjectEditor
              items={d.steps}
              onChange={(items) => updateData("steps", items.map((it: any, i: number) => ({
                ...it,
                num: String(i + 1).padStart(2, "0"),
              })))}
              itemLabel={(item, i) => `Langkah ${String(i + 1).padStart(2, "0")}: ${item.title || ""}`}
              emptyItem={{ num: "00", title: "", desc: "", duration: "" }}
              fields={[
                { key: "title", label: "Judul Langkah" },
                { key: "desc", label: "Deskripsi", textarea: true },
                { key: "duration", label: "Durasi", placeholder: "mis. 1–2 minggu" },
              ]}
            />
          </>
        );

      case "deliverables":
        return (
          <ArrayObjectEditor
            items={d.deliverables}
            onChange={(items) => updateData("deliverables", items)}
            itemLabel={(item, i) => item.title || `Deliverable #${i + 1}`}
            emptyItem={{ icon: "○", title: "", desc: "" }}
            fields={[
              { key: "icon", label: "Icon (simbol)" },
              { key: "title", label: "Judul" },
              { key: "desc", label: "Deskripsi", textarea: true },
            ]}
          />
        );

      case "clients":
        return (
          <ArrayObjectEditor
            items={d.clients}
            onChange={(items) => updateData("clients", items)}
            itemLabel={(item, i) => item.label || `Klien #${i + 1}`}
            emptyItem={{ icon: "🏛️", label: "" }}
            fields={[
              { key: "icon", label: "Icon (emoji)" },
              { key: "label", label: "Nama Target Klien" },
            ]}
          />
        );

      case "why":
        return (
          <>
            <div style={cardStyle}>
              <Field label="Judul Section" value={d.whyTitle} onChange={(v) => updateData("whyTitle", v)} />
            </div>
            <ArrayObjectEditor
              items={d.whyPoints}
              onChange={(items) => updateData("whyPoints", items)}
              itemLabel={(item, i) => item.title || `Alasan #${i + 1}`}
              emptyItem={{ title: "", desc: "" }}
              fields={[
                { key: "title", label: "Judul" },
                { key: "desc", label: "Deskripsi", textarea: true },
              ]}
            />
          </>
        );

      case "faq":
        return (
          <ArrayObjectEditor
            items={d.faqs}
            onChange={(items) => updateData("faqs", items)}
            itemLabel={(item, i) => item.q || `FAQ #${i + 1}`}
            emptyItem={{ q: "", a: "" }}
            fields={[
              { key: "q", label: "Pertanyaan" },
              { key: "a", label: "Jawaban", textarea: true },
            ]}
          />
        );

      case "cta":
        return (
          <div style={cardStyle}>
            <Field label="Judul CTA" value={d.ctaTitle} onChange={(v) => updateData("ctaTitle", v)} />
            <Field label="Deskripsi CTA" value={d.ctaDesc} onChange={(v) => updateData("ctaDesc", v)} textarea />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "inherit", padding: "28px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "24px", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <Link href="/admin/layanan" style={{ color: "#266C87", fontSize: "13px", textDecoration: "none" }}>
            ← Kembali ke daftar layanan
          </Link>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1C3038", margin: "6px 0 0" }}>
            Edit Layanan: {d.category || slugStr}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {saved && (
            <span style={{ color: "#2E7D32", fontSize: "13px", fontWeight: 600 }}>
              ✓ Tersimpan
            </span>
          )}
          <button type="button" style={btnSecondary} onClick={handleReset}>
            Reset ke Default
          </button>
          <button type="button" style={btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Sidebar navigasi section */}
        <div style={{
          width: "220px", flexShrink: 0,
          border: "1px solid rgba(38,108,135,0.12)", borderRadius: "3px",
          background: "#fff", overflow: "hidden",
        }}>
          {(Object.keys(SECTION_LABELS) as ActiveSection[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "12px 16px", fontSize: "13px", fontWeight: activeSection === key ? 700 : 500,
                color: activeSection === key ? "#266C87" : "#1C3038",
                background: activeSection === key ? "rgba(38,108,135,0.08)" : "transparent",
                border: "none", borderBottom: "1px solid rgba(38,108,135,0.08)",
                cursor: "pointer",
              }}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Panel konten section aktif */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1C3038", marginBottom: "16px" }}>
            {SECTION_LABELS[activeSection]}
          </h2>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
