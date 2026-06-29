"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "UPCOMING",
    category: "",
    startDate: "",
    endDate: "",
    isFeatured: false,
    order: "0",
  });

  useEffect(() => {
    projectsApi.list().then(r => {
      const project = r.data.data.find((p: any) => p.id === id);
      if (project) {
        setForm({
          title: project.title || "",
          description: project.description || "",
          status: project.status || "UPCOMING",
          category: project.category || "",
          startDate: project.startDate ? project.startDate.split("T")[0] : "",
          endDate: project.endDate ? project.endDate.split("T")[0] : "",
          isFeatured: project.isFeatured || false,
          order: String(project.order || 0),
        });
        setTagsInput((project.tags || []).join(", "));
        if (project.coverImage) setCoverPreview(project.coverImage);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("status", form.status);
      fd.append("category", form.category);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("order", form.order);
      fd.append("tags", JSON.stringify(
        tagsInput.split(",").map(t => t.trim()).filter(Boolean)
      ));
      if (form.startDate) fd.append("startDate", form.startDate);
      if (form.endDate) fd.append("endDate", form.endDate);
      if (coverFile) fd.append("cover", coverFile);
      await projectsApi.update(String(id), fd);
      alert("Proyek berhasil diperbarui!");
      router.push("/admin/project");
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

  if (loading) return <div style={{ padding: "40px", color: "#7A9AA5" }}>Memuat proyek...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/project" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>&larr;</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2" }}>Edit Proyek</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830" }}>{form.title || "..."}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Nama Proyek *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                style={{ ...inputStyle, fontSize: "20px", fontFamily: "Georgia,serif", fontWeight: 300 }} />
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Deskripsi *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required
                rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "8px" }}>Tags</label>
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                placeholder="Tag 1, Tag 2, Tag 3..." style={inputStyle} />
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>Periode</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Tanggal Mulai</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Tanggal Selesai</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "12px" }}>Cover</p>
              {coverPreview ? (
                <div style={{ position: "relative" }}>
                  <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "2px" }} />
                  <label style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "2px", cursor: "pointer" }}>
                    Ganti
                    <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
                  </label>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "8px" }}>
                  <span style={{ fontSize: "24px", color: "#B8CDD2" }}>+</span>
                  <p style={{ fontSize: "12px", color: "#B8CDD2" }}>Upload cover</p>
                  <input type="file" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
                </label>
              )}
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{ ...inputStyle, appearance: "none", padding: "10px 12px", fontSize: "13px" }}>
                  <option value="UPCOMING">Akan Datang</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="ARCHIVED">Diarsipkan</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Kategori</label>
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ ...inputStyle, padding: "10px 12px", fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#7A9AA5", marginBottom: "6px" }}>Urutan</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                  min="0" style={{ ...inputStyle, padding: "10px 12px", fontSize: "13px", width: "100px" }} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  style={{ width: "16px", height: "16px", accentColor: "#266c87" }} />
                <span style={{ fontSize: "13px", color: "#3A5560" }}>Proyek Unggulan</span>
              </label>
            </div>

            <button type="submit" disabled={saving}
              style={{ background: "#266c87", color: "#fff", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <Link href="/admin/project" style={{ display: "block", textAlign: "center", padding: "12px", fontSize: "13px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#3A5560", textDecoration: "none" }}>
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}