"use client";
import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";

const WEBSITE_FIELDS = [
  { key: "site_title", label: "Nama Website", type: "text", placeholder: "Manara" },
  { key: "site_tagline", label: "Tagline / Doktrin", type: "text", placeholder: "Shaping Ideas for the Public Sphere" },
  { key: "hero_headline", label: "Headline Hero Homepage", type: "text", placeholder: "Di mana gagasan menemukan cahayanya." },
  { key: "hero_subheadline", label: "Sub-headline Hero", type: "textarea", placeholder: "Ruang intelektual..." },
  { key: "contact_email", label: "Email Kontak", type: "text", placeholder: "hello@manara.id" },
  { key: "social_instagram", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/manara.id" },
  { key: "social_twitter", label: "Twitter/X URL", type: "text", placeholder: "https://x.com/manara" },
  { key: "social_youtube", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/@manara" },
  { key: "youtube_podcast_playlist", label: "YouTube Playlist ID (Podcast)", type: "text", placeholder: "PLxxxxxxxxx" },
  { key: "instagram_username", label: "Username Instagram (Suara Manara)", type: "text", placeholder: "manara.id" },
];

const SERVICE_FIELDS = [
  { key: "research_hero_title", label: "Research — Hero Title", type: "text" },
  { key: "research_hero_desc", label: "Research — Hero Desc", type: "textarea" },
  { key: "policy_brief_hero_title", label: "Policy Brief — Hero Title", type: "text" },
  { key: "training_hero_title", label: "Training — Hero Title", type: "text" },
  { key: "consulting_hero_title", label: "Consulting — Hero Title", type: "text" },
  { key: "event_hero_title", label: "Event — Hero Title", type: "text" },
];

type Tab = "website" | "services" | "social";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("website");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    settingsApi.get()
      .then(r => setSettings(r.data.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await settingsApi.update(key, settings[key] || "");
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch { alert("Gagal menyimpan"); }
    finally { setSaving(null); }
  };

  const handleSaveAll = async (fields: { key: string; label: string; type: string; placeholder?: string }[]) => {
    setSaving("all");
    try {
      for (const f of fields) await settingsApi.update(f.key, settings[f.key] || "");
      setSaved("all");
      setTimeout(() => setSaved(null), 2500);
    } catch { alert("Gagal menyimpan"); }
    finally { setSaving(null); }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "website", label: "Website Umum" },
    { key: "services", label: "Halaman Layanan" },
    { key: "social", label: "Sosial Media" },
  ];

  const currentFields = activeTab === "website"
    ? WEBSITE_FIELDS.filter(f => !f.key.startsWith("social_") && !f.key.includes("youtube") && !f.key.includes("instagram_username"))
    : activeTab === "services"
    ? SERVICE_FIELDS
    : WEBSITE_FIELDS.filter(f => f.key.startsWith("social_") || f.key.includes("youtube") || f.key.includes("instagram_username"));

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
          Pengaturan Website
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Ubah teks dan informasi yang tampil di website publik.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(38,108,135,0.1)", marginBottom: "28px" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: "10px 20px", fontSize: "13px", fontWeight: activeTab === t.key ? 500 : 300, color: activeTab === t.key ? "#266c87" : "#7A9AA5", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t.key ? "#266c87" : "transparent"}`, cursor: "pointer", marginBottom: "-1px", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat...</p>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <button onClick={() => handleSaveAll(currentFields)} disabled={saving === "all"}
              style={{ background: saving === "all" ? "#B8CDD2" : saved === "all" ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "10px 24px", fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {saving === "all" ? "Menyimpan..." : saved === "all" ? "✓ Tersimpan" : "Simpan Semua"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {currentFields.map(field => (
              <div key={field.key} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px 24px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea value={settings[field.key] || ""} onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                    placeholder={(field as any).placeholder} rows={3}
                    style={{ ...inputStyle, resize: "vertical" }} />
                ) : (
                  <input type="text" value={settings[field.key] || ""} onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                    placeholder={(field as any).placeholder || ""}
                    style={inputStyle} />
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button onClick={() => handleSave(field.key)} disabled={saving === field.key}
                    style={{ background: "transparent", color: saved === field.key ? "#3F6F6A" : "#266c87", border: `1px solid ${saved === field.key ? "rgba(63,111,106,0.3)" : "rgba(38,108,135,0.2)"}`, borderRadius: "2px", padding: "6px 18px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                    {saving === field.key ? "..." : saved === field.key ? "✓ Tersimpan" : "Simpan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}