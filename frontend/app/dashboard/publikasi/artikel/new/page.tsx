"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
import dynamic from "next/dynamic";
import Link from "next/link";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div style={{ height:"320px", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", color:"#B8CDD2" }}>Memuat editor...</div>
});

const ACCENT = "#266c87";
const ARTICLE_SUBTYPES = ["OPINI","ANALISIS","ESAI","REVIEW","RISET","COMMENTARY","LAINNYA"];

export default function NewArtikelPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isWriter = user?.role === "PUBLIKASI_WRITER";
  const canPublish = ["PUBLIKASI_EDITOR","PUBLIKASI_ADMIN","SUPERADMIN","SEKJEN"].includes(user?.role||"");

  const [saving, setSaving]     = useState(false);
  const [coverFile, setCoverFile] = useState<File|null>(null);
  const [coverPreview, setCoverPreview] = useState<string|null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    articleSubtype: "OPINI",
  });

  const handleSave = async (status: "DRAFT"|"PUBLISHED") => {
    if (!form.title.trim()) { alert("Judul wajib diisi"); return; }
    if (status === "PUBLISHED" && !canPublish) { alert("Kamu tidak memiliki izin untuk mempublikasikan"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("type", "ARTICLE");
      fd.append("title", form.title);
      fd.append("status", status);
      fd.append("articleSubtype", form.articleSubtype);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("tags", JSON.stringify(tagsInput.split(",").map(t=>t.trim()).filter(Boolean)));
      if (coverFile) fd.append("cover", coverFile);

      await publicationsApi.create(fd);
      alert(`✓ Artikel berhasil ${status==="DRAFT"?"disimpan sebagai draft":"dipublikasikan"}!`);
      router.push("/dashboard/publikasi/artikel");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1px solid rgba(38,108,135,0.15)", borderRadius:"6px", fontSize:"14px", outline:"none", color:"#0F2830", fontFamily:"inherit" as const, background:"#fff", boxSizing:"border-box" as const };

  return (
    <div style={{ padding:"40px", maxWidth:"900px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"28px" }}>
        <Link href="/dashboard/publikasi/artikel" style={{ color:"#B8CDD2", textDecoration:"none", fontSize:"20px" }}>←</Link>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"2px" }}>Artikel Baru</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"24px", fontWeight:300, color:"#0F2830" }}>
            {form.title || "Judul artikel..."}
          </h1>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={()=>handleSave("DRAFT")} disabled={saving}
            style={{ padding:"9px 18px", border:"1px solid rgba(38,108,135,0.2)", borderRadius:"6px", background:"transparent", color:"#3A5560", fontSize:"13px", cursor:saving?"not-allowed":"pointer", opacity:saving?0.6:1 }}>
            💾 Simpan Draft
          </button>
          {canPublish && (
            <button onClick={()=>handleSave("PUBLISHED")} disabled={saving}
              style={{ padding:"9px 22px", background:saving?"#B8CDD2":ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:500, cursor:saving?"not-allowed":"pointer" }}>
              {saving?"Menyimpan...":"Publikasikan →"}
            </button>
          )}
        </div>
      </div>

      {/* Writer note */}
      {isWriter && (
        <div style={{ background:"rgba(38,108,135,0.05)", border:"1px solid rgba(38,108,135,0.12)", borderRadius:"8px", padding:"12px 16px", marginBottom:"20px", display:"flex", gap:"10px" }}>
          <span style={{ color:ACCENT, fontSize:"16px" }}>✏</span>
          <p style={{ fontSize:"13px", color:"#3A5560" }}>
            Simpan tulisanmu sebagai draft. Editor akan mereview dan mempublikasikannya. Kamu masih bisa mengedit selama statusnya draft.
          </p>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:"20px" }}>
        {/* Main content */}
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* Judul */}
          <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.1)", borderRadius:"8px", padding:"20px" }}>
            <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"7px" }}>Judul Artikel *</label>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
              placeholder="Judul yang menarik dan informatif..."
              style={{ ...inp, fontSize:"18px", fontFamily:"Georgia,serif", fontWeight:300 }} />
          </div>

          {/* Excerpt */}
          <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.1)", borderRadius:"8px", padding:"20px" }}>
            <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"7px" }}>Ringkasan / Excerpt</label>
            <textarea value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))}
              placeholder="Deskripsi singkat yang muncul di halaman list dan preview..."
              rows={2} style={{ ...inp, resize:"none" as const, fontStyle:"italic", color:"#3A5560" }} />
            <p style={{ fontSize:"11px", color:"#B8CDD2", marginTop:"5px" }}>{form.excerpt.length}/300 karakter</p>
          </div>

          {/* Konten */}
          <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.1)", borderRadius:"8px", overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(38,108,135,0.08)", background:"rgba(38,108,135,0.02)" }}>
              <p style={{ fontSize:"11px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>Konten Artikel *</p>
            </div>
            <RichTextEditor
              value={form.content}
              onChange={content=>setForm(f=>({...f,content}))}
              placeholder="Mulai menulis artikelmu di sini..."
              minHeight="400px"
            />
            <div style={{ padding:"10px 18px", borderTop:"1px solid rgba(38,108,135,0.08)", display:"flex", justifyContent:"flex-end" }}>
              <p style={{ fontSize:"11px", color:"#B8CDD2" }}>
                {form.content.replace(/<[^>]*>/g," ").split(/\s+/).filter(Boolean).length} kata
              </p>
            </div>
          </div>

          {/* Tags */}
          <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.1)", borderRadius:"8px", padding:"20px" }}>
            <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"7px" }}>Tags (pisahkan dengan koma)</label>
            <input value={tagsInput} onChange={e=>setTagsInput(e.target.value)}
              placeholder="kebijakan, hukum, lingkungan, analisis..."
              style={inp} />
            {tagsInput && (
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginTop:"8px" }}>
                {tagsInput.split(",").map(t=>t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} style={{ fontSize:"11px", border:"1px solid rgba(38,108,135,0.15)", padding:"2px 8px", borderRadius:"12px", color:"#7A9AA5" }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

          {/* Cover */}
          <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.1)", borderRadius:"8px", padding:"16px" }}>
            <p style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2", marginBottom:"10px" }}>Cover Artikel</p>
            {coverPreview ? (
              <div style={{ position:"relative" }}>
                <img src={coverPreview} alt="cover" style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", borderRadius:"6px", display:"block" }} />
                <div style={{ position:"absolute", bottom:"8px", right:"8px", display:"flex", gap:"5px" }}>
                  <label style={{ background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:"10px", padding:"4px 8px", borderRadius:"4px", cursor:"pointer" }}>
                    Ganti
                    <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f){ setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display:"none" }} />
                  </label>
                  <button type="button" onClick={()=>{ setCoverFile(null); setCoverPreview(null); }}
                    style={{ background:"rgba(248,113,113,0.8)", color:"#fff", border:"none", fontSize:"10px", padding:"4px 6px", borderRadius:"4px", cursor:"pointer" }}>×</button>
                </div>
              </div>
            ) : (
              <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", aspectRatio:"16/9", border:"2px dashed rgba(38,108,135,0.15)", borderRadius:"6px", cursor:"pointer", gap:"6px" }}>
                <span style={{ fontSize:"24px", color:"#B8CDD2" }}>+</span>
                <p style={{ fontSize:"11px", color:"#B8CDD2", textAlign:"center" as const }}>Upload cover<br/><span style={{ fontSize:"10px" }}>16:9 · JPG/PNG</span></p>
                <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f){ setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} style={{ display:"none" }} />
              </label>
            )}
          </div>

          {/* Settings */}
          <div style={{ background:"#fff", border:"1px solid rgba(38,108,135,0.1)", borderRadius:"8px", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
            <p style={{ fontSize:"10px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#B8CDD2" }}>Pengaturan</p>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:500, color:"#7A9AA5", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"6px" }}>Tipe Artikel</label>
              <select value={form.articleSubtype} onChange={e=>setForm(f=>({...f,articleSubtype:e.target.value}))}
                style={{ ...inp, fontSize:"13px", appearance:"none" as const, padding:"9px 12px" }}>
                {ARTICLE_SUBTYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Save buttons mobile */}
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <button onClick={()=>handleSave("DRAFT")} disabled={saving}
              style={{ padding:"12px", border:"1px solid rgba(38,108,135,0.2)", borderRadius:"6px", background:"transparent", color:"#3A5560", fontSize:"13px", cursor:saving?"not-allowed":"pointer" }}>
              💾 Simpan Draft
            </button>
            {canPublish && (
              <button onClick={()=>handleSave("PUBLISHED")} disabled={saving}
                style={{ padding:"12px", background:saving?"#B8CDD2":ACCENT, color:"#fff", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:500, cursor:saving?"not-allowed":"pointer" }}>
                Publikasikan →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}