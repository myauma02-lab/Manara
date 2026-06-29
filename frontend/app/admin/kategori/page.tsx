"use client";
import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api";

interface Category {
  id: string; name: string; slug: string;
  color: string; description: string;
  _count?: { articles: number };
}

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", color: "#266c87", description: "" });

  const load = () => {
    categoriesApi.list()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Nama kategori wajib diisi"); return; }
    setSaving(true);
    setError("");
    try {
      if (editId) {
        await categoriesApi.update(editId, form);
      } else {
        await categoriesApi.create(form);
      }
      setForm({ name: "", color: "#266c87", description: "" });
      setShowForm(false);
      setEditId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, color: cat.color || "#266c87", description: cat.description || "" });
    setEditId(cat.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?\nArtikel yang menggunakan kategori ini tidak akan terpengaruh.`)) return;
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff",
  };

  const PRESET_COLORS = ["#266c87", "#5F8F8A", "#3F6F6A", "#8A8F5E", "#6E7448", "#C6AD8A", "#A78E6D", "#86AFAA"];

  return (
    <div style={{ padding: "40px", maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Kategori Artikel</h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", marginTop: "6px" }}>
            {categories.length} kategori tersedia
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", color: "#266c87", description: "" }); setError(""); }}
          style={{ background: showForm ? "transparent" : "#266c87", color: showForm ? "#3A5560" : "#fff", border: `1px solid ${showForm ? "rgba(38,108,135,0.2)" : "#266c87"}`, borderRadius: "2px", padding: "11px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
          {showForm ? "Batal" : "+ Tambah Kategori"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "4px", padding: "28px", marginBottom: "24px" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "20px" }}>
            {editId ? "Edit Kategori" : "Kategori Baru"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>Nama *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required placeholder="Kebijakan Publik" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "7px" }}>Deskripsi</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsi singkat" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "10px" }}>Warna Label</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                {PRESET_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{ width: "28px", height: "28px", borderRadius: "50%", background: c, border: form.color === c ? "3px solid #0F2830" : "2px solid transparent", cursor: "pointer", flexShrink: 0 }} />
                ))}
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: "36px", height: "36px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", padding: "2px", cursor: "pointer" }} />
              </div>
            </div>
            {form.name && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", color: "#7A9AA5" }}>Preview:</span>
                <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: form.color + "20", color: form.color, border: `1px solid ${form.color}40` }}>
                  {form.name}
                </span>
              </div>
            )}
            {error && <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>}
            <button type="submit" disabled={saving}
              style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "13px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Kategori"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat...</p>
      ) : categories.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "56px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada kategori</p>
          <p style={{ fontSize: "13px", color: "#B8CDD2" }}>Tambahkan kategori untuk mengorganisir artikel</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                {["Kategori", "Slug", "Artikel", "Aksi"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "13px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: (cat.color || "#266c87") + "20", color: cat.color || "#266c87", border: `1px solid ${(cat.color || "#266c87")}40` }}>
                      {cat.name}
                    </span>
                    {cat.description && <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "4px" }}>{cat.description}</p>}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#B8CDD2", fontFamily: "monospace" }}>{cat.slug}</td>
                  <td style={{ padding: "14px 20px", fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830" }}>
                    {cat._count?.articles ?? 0}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => handleEdit(cat)} style={{ fontSize: "12px", color: "#266c87", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Edit</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}