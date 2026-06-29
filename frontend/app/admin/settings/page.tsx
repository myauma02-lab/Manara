"use client";
import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";

const SETTINGS_FIELDS = [
  { key: "site_title", label: "Nama Website", type: "text", placeholder: "Manara" },
  { key: "site_tagline", label: "Tagline / Doktrin", type: "text", placeholder: "Shaping Ideas for the Public Sphere" },
  { key: "hero_headline", label: "Headline Hero", type: "text", placeholder: "Di mana gagasan menemukan cahayanya." },
  { key: "hero_subheadline", label: "Sub-headline Hero", type: "textarea", placeholder: "Ruang intelektual, kreatif, dan berpengetahuan..." },
  { key: "contact_email", label: "Email Kontak", type: "text", placeholder: "hello@manara.id" },
  { key: "social_instagram", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/manara" },
  { key: "social_twitter", label: "Twitter/X URL", type: "text", placeholder: "https://x.com/manara" },
  { key: "social_youtube", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/@manara" },
];

export default function AdminSettingsPage() {
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
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving("all");
    try {
      for (const field of SETTINGS_FIELDS) {
        await settingsApi.update(field.key, settings[field.key] || "");
      }
      setSaved("all");
      setTimeout(() => setSaved(null), 2500);
    } catch {
      alert("Gagal menyimpan semua pengaturan");
    } finally {
      setSaving(null);
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

  return (
    <div style={{ padding: "40px", maxWidth: "720px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "8px" }}>Pengaturan Website</h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Ubah teks dan informasi utama yang tampil di website publik.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat pengaturan...</p>
      ) : (
        <>
          {/* Save all button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
            <button
              onClick={handleSaveAll}
              disabled={saving === "all"}
              style={{
                background: saving === "all" ? "#B8CDD2" : saved === "all" ? "#3F6F6A" : "#266c87",
                color: "#fff", border: "none", borderRadius: "2px",
                padding: "11px 28px", fontSize: "13px", fontWeight: 500,
                letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {saving === "all" ? "Menyimpan..." : saved === "all" ? "✓ Semua Tersimpan" : "Simpan Semua"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {SETTINGS_FIELDS.map(field => (
              <div key={field.key} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "10px" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={settings[field.key] || ""}
                    onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[field.key] || ""}
                    onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button
                    onClick={() => handleSave(field.key)}
                    disabled={saving === field.key}
                    style={{
                      background: "transparent",
                      color: saved === field.key ? "#3F6F6A" : "#266c87",
                      border: `1px solid ${saved === field.key ? "rgba(63,111,106,0.3)" : "rgba(38,108,135,0.2)"}`,
                      borderRadius: "2px", padding: "7px 20px",
                      fontSize: "12px", fontWeight: 500,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {saving === field.key ? "..." : saved === field.key ? "✓ Tersimpan" : "Simpan"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div style={{ marginTop: "40px", padding: "24px", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", background: "rgba(248,113,113,0.03)" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(248,113,113,0.6)", marginBottom: "8px" }}>
              Info Database
            </p>
            <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>
              Pengaturan disimpan di database PostgreSQL — tabel <code style={{ fontFamily: "monospace", background: "rgba(38,108,135,0.08)", padding: "1px 6px", borderRadius: "2px" }}>site_settings</code>.
              Perubahan akan langsung berlaku di website publik.
            </p>
          </div>
        </>
      )}
    </div>
  );
}