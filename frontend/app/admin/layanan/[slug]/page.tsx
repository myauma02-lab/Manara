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

  const updateData = (field: keyof typeof SECTION_LABELS, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (!defaultData) return;
    if (confirm("Kembalikan semua konten section ini ke default? Perubahan yang belum disimpan akan hilang.")) {
      setData(defaultData);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "90px",
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

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid rgba(38,108,135,0.12)",
    borderRadius: "3px",
    padding: "20px",
    marginBottom: "16px",
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

  // ---------- Generic helpers untuk field text/textarea ----------
  function Field({
    label, value, onChange, textarea = false, placeholder = "",
  }: {
    label: string; value: string; onChange: (v: string) => void;
    textarea?: boolean; placeholder?: string;
  }) {
    return (
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>{label}</label>
        {textarea ? (
          <textarea
            style={textareaStyle}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            style={inputStyle}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  }

  // ---------- Generic list editor untuk array of object (features/process/deliverables/faq/why) ----------
  function ArrayObjectEditor<T extends Record<string, any>>({
    items, onChange, fields, itemLabel, emptyItem,
  }: {
    items: T[];
    onChange: (items: T[]) => void;
    fields: { key: keyof T; label: string; textarea?: boolean }[];
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
                onChange={(v) => updateItem(index, f.key, v)}
              />
            ))}
          </div>
        ))}
        <button type="button" style={btnSecondary} onClick={addItem}>
          + Tambah {itemLabel(emptyItem, list.length).replace(/\s*#?\d+$/, "")}
        </button>
      </div>
    );
  }

  // ---------- Simple string list editor (mis. clients) ----------
  function StringListEditor({
    items, onChange, placeholder,
  }: {
    items: string[]; onChange: (items: string[]) => void; placeholder?: string;
  }) {
    const list = items || [];

    const updateItem = (index: number, value: string) => {
      const next = [...list];
      next[index] = value;
      onChange(next);
    };

    const addItem = () => onChange([...list, ""]);
    const removeItem = (index: number) => onChange(list.filter((_, i) => i !== index));

    return (
      <div>
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              style={inputStyle}
              value={item}
              placeholder={placeholder}
              onChange={(e) => updateItem(index, e.target.value)}
            />
            <button type="button" style={btnDangerGhost} onClick={() => removeItem(index)}>Hapus</button>
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
            <Field label="Judul (Title)" value={d.hero?.title} onChange={(v) => updateData("hero", { ...d.hero, title: v })} />
            <Field label="Subjudul" value={d.hero?.subtitle} onChange={(v) => updateData("hero", { ...d.hero, subtitle: v })} textarea />
            <Field label="Gambar (URL)" value={d.hero?.image} onChange={(v) => updateData("hero", { ...d.hero, image: v })} placeholder="/images/..." />
            <Field label="Label / Badge" value={d.hero?.badge} onChange={(v) => updateData("hero", { ...d.hero, badge: v })} />
          </div>
        );

      case "overview":
        return (
          <div style={cardStyle}>
            <Field label="Judul" value={d.overview?.title} onChange={(v) => updateData("overview", { ...d.overview, title: v })} />
            <Field label="Deskripsi" value={d.overview?.description} onChange={(v) => updateData("overview", { ...d.overview, description: v })} textarea />
          </div>
        );

      case "features":
        return (
          <ArrayObjectEditor<ServiceFeature & Record<string, any>>
            items={d.features}
            onChange={(items) => updateData("features", items)}
            itemLabel={(item, i) => item.title || `Fitur #${i + 1}`}
            emptyItem={{ title: "", description: "", icon: "" } as any}
            fields={[
              { key: "title", label: "Judul" },
              { key: "description", label: "Deskripsi", textarea: true },
              { key: "icon", label: "Icon (opsional)" },
            ]}
          />
        );

      case "process":
        return (
          <ArrayObjectEditor<ServiceStep & Record<string, any>>
            items={d.process}
            onChange={(items) => updateData("process", items.map((it, i) => ({ ...it, step: i + 1 })))}
            itemLabel={(item, i) => `Langkah ${i + 1}: ${item.title || ""}`}
            emptyItem={{ step: 0, title: "", description: "" } as any}
            fields={[
              { key: "title", label: "Judul Langkah" },
              { key: "description", label: "Deskripsi", textarea: true },
            ]}
          />
        );

      case "deliverables":
        return (
          <ArrayObjectEditor<ServiceDeliverable & Record<string, any>>
            items={d.deliverables}
            onChange={(items) => updateData("deliverables", items)}
            itemLabel={(item, i) => item.title || `Deliverable #${i + 1}`}
            emptyItem={{ title: "", description: "" } as any}
            fields={[
              { key: "title", label: "Judul" },
              { key: "description", label: "Deskripsi", textarea: true },
            ]}
          />
        );

      case "clients":
        return (
          <div style={cardStyle}>
            <label style={labelStyle}>Daftar Target Klien</label>
            <StringListEditor
              items={d.clients}
              onChange={(items) => updateData("clients", items)}
              placeholder="Mis. Kementerian / Lembaga Pemerintah"
            />
          </div>
        );

      case "why":
        return (
          <ArrayObjectEditor<ServiceFeature & Record<string, any>>
            items={d.why}
            onChange={(items) => updateData("why", items)}
            itemLabel={(item, i) => item.title || `Alasan #${i + 1}`}
            emptyItem={{ title: "", description: "" } as any}
            fields={[
              { key: "title", label: "Judul" },
              { key: "description", label: "Deskripsi", textarea: true },
            ]}
          />
        );

      case "faq":
        return (
          <ArrayObjectEditor<ServiceFAQ & Record<string, any>>
            items={d.faq}
            onChange={(items) => updateData("faq", items)}
            itemLabel={(item, i) => item.question || `FAQ #${i + 1}`}
            emptyItem={{ question: "", answer: "" } as any}
            fields={[
              { key: "question", label: "Pertanyaan" },
              { key: "answer", label: "Jawaban", textarea: true },
            ]}
          />
        );

      case "cta":
        return (
          <div style={cardStyle}>
            <Field label="Judul" value={d.cta?.title} onChange={(v) => updateData("cta", { ...d.cta, title: v })} />
            <Field label="Deskripsi" value={d.cta?.description} onChange={(v) => updateData("cta", { ...d.cta, description: v })} textarea />
            <Field label="Teks Tombol" value={d.cta?.buttonText} onChange={(v) => updateData("cta", { ...d.cta, buttonText: v })} />
            <Field label="Link Tombol" value={d.cta?.buttonLink} onChange={(v) => updateData("cta", { ...d.cta, buttonLink: v })} placeholder="/kontak atau https://wa.me/..." />
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
            Edit Layanan: {slugStr}
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