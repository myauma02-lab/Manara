"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { foundersApi } from "@/lib/api";
import Link from "next/link";

export default function EditFounderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    order: "1",
  });

  useEffect(() => {
    // Load semua founder lalu cari yang punya id ini
    foundersApi.list()
      .then(r => {
        const all = r.data.data || [];
        const found = all.find((f: any) => f.id === String(id));
        if (!found) {
          setNotFound(true);
          return;
        }
        setForm({
          name: found.name || "",
          role: found.role || "",
          bio: found.bio || "",
          order: String(found.order ?? 1),
        });
        if (found.photo) {
          setPhotoPreview(found.photo);
          setOriginalPhoto(found.photo);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

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
      fd.append("role", form.role);
      fd.append("bio", form.bio);
      fd.append("order", form.order);
      // Hanya append foto kalau ada file baru
      if (photoFile) fd.append("photo", photoFile);

      await foundersApi.update(String(id), fd);
      alert("✓ Perubahan berhasil disimpan!");
      router.push("/admin/founder");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
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
    boxSizing: "border-box" as const,
  };

  if (loading) return (
    <div style={{ padding: "40px", color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
      Memuat data founder...
    </div>
  );

  if (notFound) return (
    <div style={{ padding: "40px" }}>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "16px" }}>
        Founder tidak ditemukan.
      </p>
      <Link href="/admin/founder" style={{ color: "#266c87", textDecoration: "none", fontSize: "14px" }}>
        ← Kembali ke Founders
      </Link>
    </div>
  );

  return (
    <div style={{ padding: "40px", maxWidth: "640px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/founder" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>
            Edit Founder
          </p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830" }}>
            {form.name || "..."}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Foto */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>
            Foto Profil
          </p>
          {photoPreview ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
              <img
                src={photoPreview}
                alt={form.name}
                style={{ width: "100px", aspectRatio: "3/4", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "13px", color: "#3A5560" }}>
                  {photoFile ? photoFile.name : "Foto saat ini"}
                </p>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 500, color: "#266c87", cursor: "pointer", border: "1px solid rgba(38,108,135,0.2)", padding: "7px 14px", borderRadius: "2px" }}>
                  Ganti Foto
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                </label>
                {photoFile && (
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(originalPhoto); }}
                    style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                  >
                    Batalkan perubahan foto
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "140px", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "4px", cursor: "pointer", gap: "8px" }}>
              <span style={{ fontSize: "28px", color: "#B8CDD2" }}>↑</span>
              <p style={{ fontSize: "13px", color: "#B8CDD2" }}>Upload foto founder</p>
              <p style={{ fontSize: "11px", color: "#B8CDD2" }}>JPG/PNG · Max 5MB</p>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
          )}
        </div>

        {/* Form fields */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Nama Lengkap *
            </label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="Nama lengkap"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Peran / Jabatan
            </label>
            <input
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              placeholder="Co-Founder, Editor, Koordinator..."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Deskripsi singkat tentang founder..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
              {form.bio.length}/300 karakter
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>
              Urutan Tampil
            </label>
            <input
              type="number"
              value={form.order}
              onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
              min="1"
              max="10"
              style={{ ...inputStyle, width: "120px" }}
            />
            <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "4px" }}>
              Angka kecil tampil lebih awal di homepage
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{ flex: 1, background: "#266c87", color: "#fff", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, transition: "opacity 0.2s" }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link
            href="/admin/founder"
            style={{ padding: "14px 24px", fontSize: "13px", fontWeight: 500, border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#3A5560", textDecoration: "none", display: "flex", alignItems: "center" }}
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}