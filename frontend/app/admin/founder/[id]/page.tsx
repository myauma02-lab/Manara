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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    order: "1",
  });

  useEffect(() => {
    foundersApi.list().then(r => {
      const founder = r.data.data.find((f: any) => f.id === id);
      if (founder) {
        setForm({
          name: founder.name || "",
          role: founder.role || "",
          bio: founder.bio || "",
          order: String(founder.order || 1),
        });
        if (founder.photo) setPhotoPreview(founder.photo);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("bio", form.bio);
      fd.append("order", form.order);
      if (photoFile) fd.append("photo", photoFile);
      await foundersApi.update(String(id), fd);
      alert("Founder berhasil diperbarui!");
      router.push("/admin/founder");
    } catch {
      alert("Gagal menyimpan");
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
  };

  if (loading) return <div style={{ padding: "40px", color: "#7A9AA5" }}>Memuat...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "640px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/founder" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>Edit Founder</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "28px", fontWeight: 300, color: "#0F2830" }}>{form.name || "..."}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Photo */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "16px" }}>Foto</p>
          {photoPreview ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <img src={photoPreview} alt="preview" style={{ width: "120px", aspectRatio: "3/4", objectFit: "cover", borderRadius: "4px" }} />
              <div>
                <p style={{ fontSize: "13px", color: "#3A5560", marginBottom: "8px" }}>Foto terpilih</p>
                <label style={{ fontSize: "12px", color: "#266c87", cursor: "pointer" }}>
                  Ganti foto
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                </label>
              </div>
            </div>
          ) : (
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "140px", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "4px", cursor: "pointer", gap: "8px" }}>
              <span style={{ fontSize: "28px", color: "#B8CDD2" }}>↑</span>
              <p style={{ fontSize: "13px", color: "#B8CDD2" }}>Upload foto baru</p>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
          )}
        </div>

        {/* Fields */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>Nama Lengkap *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Nama lengkap" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>Peran</label>
            <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Co-Founder, Editor, dll" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Deskripsi singkat..." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "8px" }}>Urutan</label>
            <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} min="1" style={{ ...inputStyle, width: "120px" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" disabled={saving} style={{ flex: 1, background: "#266c87", color: "#fff", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link href="/admin/founder" style={{ padding: "14px 24px", fontSize: "13px", fontWeight: 500, border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#3A5560", textDecoration: "none", display: "flex", alignItems: "center" }}>
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}