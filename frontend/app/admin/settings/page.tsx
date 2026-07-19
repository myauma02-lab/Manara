"use client";
import { useEffect, useState, useRef } from "react";
import { settingsApi } from "@/lib/api";
import { HERO_BG_KEYS, HERO_BG_LABELS, type HeroBgKey } from "@/lib/hero-settings";

const WEBSITE_FIELDS = [
  { key: "site_title", label: "Nama Website", type: "text", placeholder: "Manara" },
  { key: "site_tagline", label: "Tagline / Doktrin", type: "text", placeholder: "Shaping Ideas for the Public Sphere" },
  { key: "hero_headline", label: "Headline Hero Homepage", type: "text", placeholder: "Di mana gagasan menemukan cahayanya." },
  { key: "hero_subheadline", label: "Sub-headline Hero", type: "textarea", placeholder: "Ruang intelektual..." },
  { key: "contact_email", label: "Email Kontak", type: "text", placeholder: "manararesearch@gmail.com" },
  { key: "social_instagram", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/manara_institute" },
  { key: "social_twitter", label: "Twitter/X URL", type: "text", placeholder: "https://x.com/manara_institute" },
  { key: "social_youtube", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/@ManaraInstitute" },
  { key: "youtube_podcast_playlist", label: "YouTube Playlist ID (Podcast)", type: "text", placeholder: "PLxxxxxxxxx" },
  { key: "instagram_username", label: "Username Instagram (Suara Manara)", type: "text", placeholder: "https://instagram.com/manara_institute" },
];

const SERVICE_FIELDS = [
  { key: "research_hero_title", label: "Research — Hero Title", type: "text" },
  { key: "research_hero_desc", label: "Research — Hero Desc", type: "textarea" },
  { key: "policy_brief_hero_title", label: "Policy Brief — Hero Title", type: "text" },
  { key: "training_hero_title", label: "Training — Hero Title", type: "text" },
  { key: "consulting_hero_title", label: "Consulting — Hero Title", type: "text" },
  { key: "event_hero_title", label: "Event — Hero Title", type: "text" },
];

type Tab = "website" | "ilustrasi" | "sosial" | "layanan";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ilustrasi");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsApi.get()
      .then(r => setSettings(r.data.data || {}))
      .catch(() => {});
  }, []);

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await settingsApi.bulkUpdate(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert("Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const TAB_CONFIG: { key: Tab; label: string }[] = [
    { key: "ilustrasi", label: "🖼 Ilustrasi Hero" },
    { key: "website", label: "⚙ Website" },
    { key: "sosial", label: "📱 Sosial Media" },
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1000px" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>
          Pengaturan Website
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(38,108,135,0.1)", marginBottom: "28px" }}>
        {TAB_CONFIG.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: "10px 20px", fontSize: "13px", fontWeight: activeTab === t.key ? 500 : 300, color: activeTab === t.key ? "#266c87" : "#7A9AA5", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t.key ? "#266c87" : "transparent"}`, cursor: "pointer", marginBottom: "-1px" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: ILUSTRASI ── */}
      {activeTab === "ilustrasi" && (
        <IllustrasiTab settings={settings} onUpdate={(key, url) => setSettings(s => ({ ...s, [key]: url }))} />
      )}

      {/* ── TAB: WEBSITE ── */}
      {activeTab === "website" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Identitas Website</p>
            {[
              { key: "site_name", label: "Nama Website" },
              { key: "site_tagline", label: "Tagline" },
              { key: "site_email", label: "Email Kontak" },
              { key: "site_phone", label: "WhatsApp" },
            ].map(item => (
              <div key={item.key}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                  {item.label}
                </label>
                <input
                  value={settings[item.key] || ""}
                  onChange={e => setSettings(s => ({ ...s, [item.key]: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", fontSize: "14px", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSaveGeneral} disabled={saving}
              style={{ padding: "11px 28px", background: saved ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
              {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Pengaturan"}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: SOSIAL MEDIA ── */}
      {activeTab === "sosial" && (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Link Sosial Media</p>
          {[
            { key: "social_instagram", label: "Instagram URL" },
            { key: "social_twitter", label: "X/Twitter URL" },
            { key: "social_youtube", label: "YouTube URL" },
            { key: "social_linkedin", label: "LinkedIn URL" },
          ].map(item => (
            <div key={item.key}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7A9AA5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                {item.label}
              </label>
              <input
                value={settings[item.key] || ""}
                onChange={e => setSettings(s => ({ ...s, [item.key]: e.target.value }))}
                placeholder="https://..."
                style={{ width: "100%", padding: "11px 14px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", fontSize: "14px", outline: "none", color: "#1C3038", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const }}
              />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSaveGeneral} disabled={saving}
              style={{ padding: "11px 28px", background: saved ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
              {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Komponen Tab Ilustrasi
// ─────────────────────────────────────────────────────
function IllustrasiTab({
  settings,
  onUpdate,
}: {
  settings: Record<string, string>;
  onUpdate: (key: string, url: string) => void;
}) {
  return (
    <div>
      <div style={{ background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", padding: "14px 18px", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>
          💡 Upload ilustrasi untuk setiap halaman. Gambar akan tampil di belakang konten hero dengan gradient yang memudar ke kiri. Format yang didukung: <strong>JPG, PNG, WebP</strong>. Ukuran ideal: <strong>1600×900px atau lebih besar</strong>. Max 5MB.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
        {(Object.entries(HERO_BG_LABELS) as [HeroBgKey, typeof HERO_BG_LABELS[HeroBgKey]][]).map(([key, config]) => (
          <HeroImageCard
            key={key}
            settingKey={HERO_BG_KEYS[key]}
            label={config.label}
            path={config.path}
            desc={config.desc}
            currentUrl={settings[HERO_BG_KEYS[key]] || ""}
            onUpdate={(url) => onUpdate(HERO_BG_KEYS[key], url)}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Kartu upload per halaman
// ─────────────────────────────────────────────────────
function HeroImageCard({
  settingKey,
  label,
  path,
  desc,
  currentUrl,
  onUpdate,
}: {
  settingKey: string;
  label: string;
  path: string;
  desc: string;
  currentUrl: string;
  onUpdate: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview kalau props berubah
  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi client-side
    if (file.size > 5 * 1024 * 1024) {
      setError("File terlalu besar. Max 5MB.");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    setUploading(true);
    setError("");

    // Preview lokal langsung
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const res = await settingsApi.uploadHeroImage(settingKey, file);
      const uploadedUrl = res.data.data?.url;
      if (uploadedUrl) {
        setPreview(uploadedUrl);
        onUpdate(uploadedUrl);
        URL.revokeObjectURL(localPreview);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal upload. Coba lagi.");
      setPreview(currentUrl); // revert
    } finally {
      setUploading(false);
      // Reset input
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Hapus ilustrasi untuk halaman "${label}"?`)) return;
    setRemoving(true);
    try {
      await settingsApi.deleteKey(settingKey);
      setPreview("");
      onUpdate("");
    } catch {
      setError("Gagal menghapus ilustrasi");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "8px", overflow: "hidden" }}>

      {/* Preview area */}
      <div style={{ aspectRatio: "16/9", position: "relative", background: preview ? undefined : "linear-gradient(135deg,#0F2830,#266c87)", overflow: "hidden" }}>
        {preview ? (
          <>
            <img
              src={preview}
              alt={`Hero ${label}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Gradient preview overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,40,48,0.8) 0%, rgba(15,40,48,0.3) 60%, transparent 100%)" }} />
            {/* Teks preview */}
            <div style={{ position: "absolute", bottom: "10px", left: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>
                PREVIEW GRADIENT
              </p>
            </div>
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{ fontSize: "28px", opacity: 0.2 }}>🖼</span>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Belum ada ilustrasi</p>
          </div>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,40,48,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(134,175,170,0.3)", borderTop: "3px solid #86AFAA", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: "12px", color: "rgba(238,244,246,0.8)" }}>Mengupload...</p>
          </div>
        )}
      </div>

      {/* Info + controls */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "2px" }}>{label}</p>
            <p style={{ fontSize: "11px", color: "#B8CDD2" }}>{desc}</p>
          </div>
          <a href={path} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "11px", color: "#266c87", textDecoration: "none", marginLeft: "8px", flexShrink: 0 }}>
            ↗
          </a>
        </div>

        {error && (
          <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "8px" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          {/* Upload button */}
          <label style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "9px",
            background: preview ? "rgba(38,108,135,0.06)" : "#266c87",
            color: preview ? "#266c87" : "#fff",
            border: `1px solid ${preview ? "rgba(38,108,135,0.2)" : "#266c87"}`,
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.6 : 1,
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: "14px" }}>↑</span>
            {preview ? "Ganti Gambar" : "Upload Ilustrasi"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>

          {/* Remove button */}
          {preview && (
            <button
              onClick={handleRemove}
              disabled={removing}
              style={{ padding: "9px 12px", background: "transparent", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "4px", color: "#f87171", fontSize: "12px", cursor: removing ? "not-allowed" : "pointer", opacity: removing ? 0.5 : 1 }}
              title="Hapus ilustrasi"
            >
              {removing ? "..." : "🗑"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}