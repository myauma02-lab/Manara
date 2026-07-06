"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fellowsApi } from "@/lib/api";
import Link from "next/link";

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

export default function FellowForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [expertiseInput, setExpertiseInput] = useState(
    (initialData?.expertise || []).join(", ")
  );
  const [form, setForm] = useState({
    name: initialData?.name || "",
    title: initialData?.title || "",
    position: initialData?.position || "",
    institution: initialData?.institution || "",
    bio: initialData?.bio || "",
    email: initialData?.email || "",
    order: String(initialData?.order ?? 0),
    isActive: initialData?.isActive !== false,
    // Social links
    linkedin: initialData?.socialLinks?.linkedin || "",
    twitter: initialData?.socialLinks?.twitter || "",
    instagram: initialData?.socialLinks?.instagram || "",
    website: initialData?.socialLinks?.website || "",
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { alert("Nama wajib diisi"); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.title) fd.append("title", form.title);
      if (form.position) fd.append("position", form.position);
      if (form.institution) fd.append("institution", form.institution);
      if (form.bio) fd.append("bio", form.bio);
      if (form.email) fd.append("email", form.email);
      fd.append("order", form.order);
      fd.append("isActive", String(form.isActive));
      fd.append("expertise", JSON.stringify(
        expertiseInput.split(",").map(e => e.trim()).filter(Boolean)
      ));
      fd.append("socialLinks", JSON.stringify({
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
        instagram: form.instagram || null,
        website: form.website || null,
      }));
      if (photoFile) fd.append("photo", photoFile);

      if (isEdit && initialData?.id) {
        await fellowsApi.update(initialData.id, fd);
        alert("✓ Perubahan disimpan!");
      } else {
        await fellowsApi.create(fd);
        alert("✓ Fellow berhasil ditambahkan!");
      }

      router.push("/admin/fellows");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 500 as const,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "#7A9AA5", marginBottom: "7px",
  };

  return (
    <div style={{ padding: "40px", maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/fellows" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>
            {isEdit ? "Edit Fellow" : "Tambah Fellow"}
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830" }}>
            {isEdit ? (form.name || "Fellow") : "Manara Fellow Baru"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

          {/* LEFT — Main fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Identitas */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Identitas</p>

              <div>
                <label style={labelStyle}>Nama Lengkap *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required placeholder="Prof. Dr. Ahmad Rasyid, S.T., M.T." style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Gelar Akademik</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="S.T., M.T., Ph.D." style={inputStyle} />
                  <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>Gelar setelah nama (opsional)</p>
                </div>
                <div>
                  <label style={labelStyle}>Posisi / Jabatan</label>
                  <input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                    placeholder="Peneliti Senior" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Institusi / Afiliasi</label>
                <input value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
                  placeholder="Dosen Teknik Mesin Universitas Brawijaya" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email (opsional)</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="fellow@kampus.ac.id" style={inputStyle} />
              </div>
            </div>

            {/* Keahlian */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Keahlian</p>
              <label style={labelStyle}>Bidang Keahlian (pisahkan dengan koma)</label>
              <input value={expertiseInput} onChange={e => setExpertiseInput(e.target.value)}
                placeholder="Kebijakan Publik, Ekonomi Pembangunan, Riset Kualitatif"
                style={inputStyle} />
              <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "6px" }}>
                Maks 3 keahlian yang ditampilkan di kartu. Tambahkan sebanyak yang diperlukan.
              </p>

              {/* Preview tags */}
              {expertiseInput && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  {expertiseInput.split(",").map(e => e.trim()).filter(Boolean).map(exp => (
                    <span key={exp} style={{ fontSize: "11px", color: "#266c87", background: "rgba(38,108,135,0.08)", border: "1px solid rgba(38,108,135,0.15)", padding: "3px 10px", borderRadius: "2px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "10px" }}>◎</span> {exp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Bio</p>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Deskripsi singkat tentang latar belakang, penelitian, dan kontribusi fellow..."
                rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
              <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "6px" }}>
                {form.bio.split(/\s+/).filter(w => w.length > 0).length} kata · Bio muncul saat kartu di-hover
              </p>
            </div>

            {/* Social Links */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Social Media (opsional)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { key: "linkedin", label: "LinkedIn URL", ph: "https://linkedin.com/in/..." },
                  { key: "twitter", label: "X / Twitter URL", ph: "https://x.com/..." },
                  { key: "instagram", label: "Instagram URL", ph: "https://instagram.com/..." },
                  { key: "website", label: "Website / Google Scholar", ph: "https://scholar.google.com/..." },
                ].map(s => (
                  <div key={s.key}>
                    <label style={{ ...labelStyle, marginBottom: "5px" }}>{s.label}</label>
                    <input
                      value={form[s.key as keyof typeof form] as string}
                      onChange={e => setForm(f => ({ ...f, [s.key]: e.target.value }))}
                      placeholder={s.ph}
                      style={{ ...inputStyle, fontSize: "13px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Foto */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
                Foto
              </p>
              {photoPreview ? (
                <div style={{ position: "relative" }}>
                  <img src={photoPreview} alt="preview"
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", objectPosition: "center top", borderRadius: "4px", display: "block" }} />
                  <div style={{ position: "absolute", bottom: "8px", left: "8px", right: "8px", display: "flex", gap: "6px" }}>
                    <label style={{ flex: 1, textAlign: "center", background: "rgba(15,40,48,0.75)", color: "#fff", fontSize: "11px", padding: "6px 10px", borderRadius: "2px", cursor: "pointer" }}>
                      Ganti Foto
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                    </label>
                    <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                      style={{ background: "rgba(248,113,113,0.8)", color: "#fff", border: "none", fontSize: "11px", padding: "6px 10px", borderRadius: "2px", cursor: "pointer" }}>
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "1/1", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "4px", cursor: "pointer", gap: "8px" }}>
                  <span style={{ fontSize: "28px", color: "#B8CDD2" }}>↑</span>
                  <p style={{ fontSize: "12px", color: "#B8CDD2", textAlign: "center" }}>
                    Upload foto<br />
                    <span style={{ fontSize: "10px" }}>JPG/PNG · Square · Max 5MB</span>
                  </p>
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                </label>
              )}
              <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "8px", textAlign: "center" }}>
                Gunakan foto formal atau foto profil resmi
              </p>
            </div>

            {/* Settings */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>

              {/* Status */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  style={{ width: "16px", height: "16px", accentColor: "#266c87", marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Tampilkan di website</span>
                  <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Fellow aktif terlihat publik</span>
                </div>
              </label>

              {/* Order */}
              <div>
                <label style={labelStyle}>Urutan Tampil</label>
                <input type="number" value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                  min="0" max="99"
                  style={{ ...inputStyle, width: "80px", padding: "8px 12px", textAlign: "center" }} />
                <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
                  0 tampil pertama
                </p>
              </div>
            </div>

            {/* Preview card */}
            <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>
                Preview Kartu
              </p>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", padding: "14px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "3px", overflow: "hidden", background: "linear-gradient(145deg,#266c87,#0F2830)", flexShrink: 0 }}>
                    {photoPreview && (
                      <img src={photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 400, color: "#0F2830", lineHeight: 1.3, marginBottom: "2px" }}>
                      {form.name || "Nama Fellow"}
                      {form.title && <span style={{ fontSize: "10px", color: "#7A9AA5" }}>, {form.title}</span>}
                    </p>
                    {form.position && <p style={{ fontSize: "10px", color: "#7A9AA5" }}>{form.position}</p>}
                    {expertiseInput && (
                      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", marginTop: "4px" }}>
                        {expertiseInput.split(",").slice(0, 2).map(e => e.trim()).filter(Boolean).map(exp => (
                          <span key={exp} style={{ fontSize: "9px", color: "#266c87", background: "rgba(38,108,135,0.08)", padding: "2px 6px", borderRadius: "2px" }}>
                            ◎ {exp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {form.institution && (
                  <p style={{ fontSize: "10px", color: "#7A9AA5" }}>
                    <span style={{ color: "#B8CDD2" }}>Background: </span>
                    {form.institution}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button type="submit" disabled={saving}
                style={{ background: "#266c87", color: "#fff", padding: "13px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Fellow"}
              </button>
              <Link href="/admin/fellows"
                style={{ display: "block", textAlign: "center", padding: "11px", fontSize: "13px", fontWeight: 300, color: "#7A9AA5", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", textDecoration: "none" }}>
                Batal
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}