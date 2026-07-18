"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

const STATUS_OPTIONS = ["UPCOMING", "ACTIVE", "COMPLETED", "ARCHIVED"];

interface Milestone { title: string; date: string; done: boolean; }

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [outputsInput, setOutputsInput] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "UPCOMING",
    category: "",
    startDate: "",
    endDate: "",
    progress: "0",
    isFeatured: false,
    isPublic: true,
    reportUrl: "",
    dataUrl: "",
    client: "",
    location: "",
  });

  const addMilestone = () => {
    setMilestones(m => [...m, { title: "", date: "", done: false }]);
  };

  const updateMilestone = (i: number, field: keyof Milestone, value: any) => {
    setMilestones(m => {
      const arr = [...m];
      arr[i] = { ...arr[i], [field]: value };
      return arr;
    });
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
      fd.append("progress", form.progress);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isPublic", String(form.isPublic));
      if (form.startDate) fd.append("startDate", form.startDate);
      if (form.endDate) fd.append("endDate", form.endDate);
      if (form.reportUrl) fd.append("reportUrl", form.reportUrl);
      if (form.dataUrl) fd.append("dataUrl", form.dataUrl);
      if (form.client) fd.append("client", form.client);
      if (form.location) fd.append("location", form.location);
      fd.append("tags", JSON.stringify(tagsInput.split(",").map(t => t.trim()).filter(Boolean)));
      fd.append("teamMembers", JSON.stringify(teamInput.split(",").map(t => t.trim()).filter(Boolean)));
      fd.append("outputs", JSON.stringify(outputsInput.split("\n").map(o => o.trim()).filter(Boolean)));
      fd.append("milestones", JSON.stringify(milestones.filter(m => m.title)));
      if (coverFile) fd.append("cover", coverFile);

      await projectsApi.create(fd);
      alert("✓ Proyek berhasil dibuat!");
      router.push("/admin/project");
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
    <div style={{ padding: "40px", maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin/project" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Proyek Baru</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830" }}>
            {form.title || "Tambah Proyek"}
          </h1>
        </div>
        <button type="submit" form="project-form" disabled={saving}
          style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Menyimpan..." : "Simpan Proyek"}
        </button>
      </div>

      <form id="project-form" onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Informasi Dasar */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Informasi Dasar</p>

              <div>
                <label style={labelStyle}>Judul Proyek *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required placeholder="Nama proyek yang deskriptif..."
                  style={{ ...inputStyle, fontSize: "18px", fontFamily: "Georgia,serif", fontWeight: 300 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Kategori</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="Kebijakan Publik, Lingkungan, ..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Klien / Mitra</label>
                  <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                    placeholder="Nama klien atau mitra" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Lokasi Penelitian</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Malang, Jawa Timur / Nasional" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Jelaskan proyek ini — latar belakang, tujuan, metodologi, dan dampak yang diharapkan..."
                  rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
              </div>

              <div>
                <label style={labelStyle}>Tags (pisahkan dengan koma)</label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  placeholder="kebijakan, lingkungan, analisis, survei..." style={inputStyle} />
                {tagsInput && (
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "8px" }}>
                    {tagsInput.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} style={{ fontSize: "11px", border: "1px solid rgba(38,108,135,0.15)", padding: "2px 8px", borderRadius: "2px", color: "#7A9AA5" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tim */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Tim Proyek</p>
              <label style={labelStyle}>Anggota Tim (pisahkan dengan koma)</label>
              <input value={teamInput} onChange={e => setTeamInput(e.target.value)}
                placeholder="Ahmad Rasyid, Sari Andini, Budi Santoso..." style={inputStyle} />
            </div>

            {/* Output */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Output / Deliverables</p>
              <label style={labelStyle}>Satu output per baris</label>
              <textarea value={outputsInput} onChange={e => setOutputsInput(e.target.value)}
                placeholder={"Laporan kebijakan 40 halaman\nDataset survei 500 responden\nPolicy brief untuk pemerintah daerah"}
                rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {/* Milestones */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Milestones</p>
                <button type="button" onClick={addMilestone}
                  style={{ fontSize: "12px", color: "#266c87", background: "none", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", padding: "5px 12px", cursor: "pointer" }}>
                  + Tambah
                </button>
              </div>

              {milestones.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#B8CDD2", fontStyle: "italic" }}>
                  Belum ada milestone. Klik "+ Tambah" untuk menambahkan.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {milestones.map((m, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr 160px auto", gap: "8px", alignItems: "center" }}>
                      <input type="checkbox" checked={m.done} onChange={e => updateMilestone(i, "done", e.target.checked)}
                        style={{ width: "16px", height: "16px", accentColor: "#266c87" }} />
                      <input value={m.title} onChange={e => updateMilestone(i, "title", e.target.value)}
                        placeholder="Judul milestone..." style={{ ...inputStyle, padding: "8px 12px" }} />
                      <input type="date" value={m.date} onChange={e => updateMilestone(i, "date", e.target.value)}
                        style={{ ...inputStyle, padding: "8px 12px" }} />
                      <button type="button" onClick={() => setMilestones(ms => ms.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "16px", padding: "4px 8px" }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "14px" }}>Links (Opsional)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>URL Laporan Final</label>
                  <input value={form.reportUrl} onChange={e => setForm(f => ({ ...f, reportUrl: e.target.value }))}
                    placeholder="https://..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>URL Dataset</label>
                  <input value={form.dataUrl} onChange={e => setForm(f => ({ ...f, dataUrl: e.target.value }))}
                    placeholder="https://..." style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Cover */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "10px" }}>Cover Proyek</p>
              {coverPreview ? (
                <div style={{ position: "relative" }}>
                  <img src={coverPreview} alt="cover" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "2px", display: "block" }} />
                  <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                    <label style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "2px", cursor: "pointer" }}>
                      Ganti
                      <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
                    </label>
                    <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                      style={{ background: "rgba(248,113,113,0.8)", color: "#fff", border: "none", fontSize: "11px", padding: "4px 8px", borderRadius: "2px", cursor: "pointer" }}>×</button>
                  </div>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "16/9", border: "2px dashed rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer", gap: "6px" }}>
                  <span style={{ fontSize: "24px", color: "#B8CDD2" }}>+</span>
                  <p style={{ fontSize: "11px", color: "#B8CDD2", textAlign: "center" }}>Upload cover<br /><span style={{ fontSize: "10px" }}>16:9 · JPG/PNG</span></p>
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display: "none" }} />
                </label>
              )}
            </div>

            {/* Status & Settings */}
            <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>Pengaturan</p>

              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{ ...inputStyle, padding: "9px 12px", fontSize: "13px", appearance: "none" }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: "8px" }}>
                  Progress ({form.progress}%)
                </label>
                <input type="range" min="0" max="100" step="5"
                  value={form.progress}
                  onChange={e => setForm(f => ({ ...f, progress: e.target.value }))}
                  style={{ width: "100%", accentColor: "#266c87" }} />
                <div style={{ height: "4px", background: "rgba(38,108,135,0.1)", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${form.progress}%`, background: "#266c87", transition: "width 0.3s" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Mulai</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={labelStyle}>Selesai</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px" }} />
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  style={{ width: "16px", height: "16px", accentColor: "#266c87", marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Proyek Unggulan</span>
                  <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Tampil di posisi utama</span>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
                  style={{ width: "16px", height: "16px", accentColor: "#266c87", marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "13px", color: "#3A5560", display: "block" }}>Tampilkan ke Publik</span>
                  <span style={{ fontSize: "11px", color: "#B8CDD2" }}>Visible di /proyek</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}