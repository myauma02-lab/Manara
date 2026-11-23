"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import { PUBLICATION_DEPARTMENTS } from "@/lib/publication-explorer";
import { useAuthStore } from "@/lib/store/authStore";
import PublicationIdentity from "@/components/shared/PublicationIdentity";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });
type Format = "EDITORIAL_NOTE" | "RESEARCH_PAPER" | "PERSPECTIVE" | "POLICY_BRIEF" | "WORKING_PAPER" | "JOURNAL";
type PubType = "ARTICLE" | "PAPER" | "JOURNAL";
type Version = { id: string; number: number; versionDate: string; coverImage?: string; pdfUrl?: string; changeSummary?: string; isPublished: boolean; isCurrent: boolean };
type VersionEdit = { date?: string; summary?: string; cover?: File | null; pdf?: File | null };

const FORMATS: { value: Format; label: string; hint: string }[] = [
  { value: "EDITORIAL_NOTE", label: "Editorial Note", hint: "Catatan redaksi; gambar opsional" },
  { value: "RESEARCH_PAPER", label: "Research Paper", hint: "Naskah HTML atau PDF, cover A4" },
  { value: "PERSPECTIVE", label: "Perspective", hint: "Esai dengan cover 4:5" },
  { value: "POLICY_BRIEF", label: "Policy Brief", hint: "Rekomendasi kebijakan, cover A4" },
  { value: "WORKING_PAPER", label: "Working Paper", hint: "Naskah berversi, cover A4 dan PDF per versi" },
];
const TYPE: Record<Format, PubType> = { EDITORIAL_NOTE: "ARTICLE", RESEARCH_PAPER: "PAPER", PERSPECTIVE: "ARTICLE", POLICY_BRIEF: "PAPER", WORKING_PAPER: "PAPER", JOURNAL: "JOURNAL" };
const FIELDS = ["title", "excerpt", "department", "attribution", "argumentSummary", "abstract", "content", "policyProblem", "decisionMakers", "executiveSummary", "evidence", "policyOptions", "implementationNotes", "seriesNumber", "feedbackUrl", "followUpResearchUrl", "dataUrl"] as const;
type Field = typeof FIELDS[number];
const INPUT: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 13px", border: "1px solid #c9d9df", borderRadius: 5, color: "#173642", background: "white", font: "inherit" };
const PANEL: React.CSSProperties = { background: "#fff", border: "1px solid #dce6e8", borderRadius: 8, padding: "clamp(16px,3vw,28px)", marginBottom: 18 };

function initialFormatForType(type?: PubType): Format { return type === "ARTICLE" ? "PERSPECTIVE" : "RESEARCH_PAPER"; }
function lines(value: string): string[] { return value.split(/\n|,/).map(v => v.trim()).filter(Boolean); }
function textOf(value: unknown): string { return typeof value === "string" ? value : ""; }
function ratioOf(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { const ratio = img.naturalWidth / img.naturalHeight; URL.revokeObjectURL(url); resolve(ratio); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Gambar tidak dapat dibaca")); };
    img.src = url;
  });
}

export default function PublicationForm({ type, id, basePath, initialFormat }: { type?: PubType; id?: string; basePath: string; initialFormat?: Format }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const canPublish = !!user && ["SUPERADMIN", "SEKJEN", "PUBLIKASI_ADMIN", "PUBLIKASI_EDITOR"].includes(user.role);
  const [format, setFormat] = useState<Format>(initialFormat || initialFormatForType(type));
  const [form, setForm] = useState<Record<Field, string>>(() => Object.fromEntries(FIELDS.map(field => [field, ""])) as Record<Field, string>);
  const [topics, setTopics] = useState<string[]>([]);
  const [authors, setAuthors] = useState("");
  const [keywords, setKeywords] = useState("");
  const [references, setReferences] = useState("");
  const [attachments, setAttachments] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [citations, setCitations] = useState("");
  const [editorAttribution, setEditorAttribution] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [imageFocusX, setImageFocusX] = useState(50);
  const [imageFocusY, setImageFocusY] = useState(50);
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [localCoverUrl, setLocalCoverUrl] = useState("");
  const [versions, setVersions] = useState<Version[]>([]);
  const [versionEdits, setVersionEdits] = useState<Record<string, VersionEdit>>({});
  const [pub, setPub] = useState<any>(null);
  const [versionCover, setVersionCover] = useState<File | null>(null);
  const [versionPdf, setVersionPdf] = useState<File | null>(null);
  const [versionDate, setVersionDate] = useState(new Date().toISOString().slice(0, 10));
  const [changeSummary, setChangeSummary] = useState("");
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const department = PUBLICATION_DEPARTMENTS.find(item => item.name === form.department);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const response = await publicationsApi.adminGet(id);
      const item = response.data.data;
      const draft = item.draftData || {};
      const effective = { ...item, ...draft };
      setPub(item); setVersions(item.versions || []);
      setFormat(effective.format || (effective.type === "ARTICLE" ? "PERSPECTIVE" : effective.paperSubtype === "WORKING_PAPER" ? "WORKING_PAPER" : effective.paperSubtype === "POLICY_BRIEF" ? "POLICY_BRIEF" : "RESEARCH_PAPER"));
      setForm(Object.fromEntries(FIELDS.map(field => [field, textOf(effective[field])])) as Record<Field, string>);
      setEditorAttribution(!!effective.attribution && effective.attribution !== "Redaksi Manara Institute");
      setTopics(effective.topics || []); setAuthors((effective.authors || []).join(", "));
      setKeywords((effective.keywords || []).join(", "));
      setReferences((effective.references || []).join("\n"));
      setCitations((effective.citations || []).join("\n"));
      setPublishedAt(effective.publishedAt ? new Date(effective.publishedAt).toISOString().slice(0, 10) : "");
      setImageFocusX(effective.imageFocusX ?? 50); setImageFocusY(effective.imageFocusY ?? 50);
      setAttachments(Array.isArray(effective.attachments) ? effective.attachments.join("\n") : "");
      setRecommendations(Array.isArray(effective.recommendations) ? effective.recommendations.map((r: any) => `${r.action} | ${r.actor}`).join("\n") : "");
      setCoverUrl(effective.coverImage || "");
    } catch { setErrors({ general: "Publikasi tidak dapat dimuat" }); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => () => { if (localCoverUrl) URL.revokeObjectURL(localCoverUrl); }, [localCoverUrl]);

  const change = (key: Field, value: string) => setForm(previous => ({ ...previous, [key]: value }));
  const input = (key: Field, label: string, multiline = false, hint?: string) =>
    <label style={{ display: "block", marginBottom: 18, fontSize: 13, fontWeight: 600, color: "#244b59" }} key={key}>
      {label}{hint && <small style={{ display: "block", fontWeight: 400, color: "#667d86", margin: "4px 0" }}>{hint}</small>}
      {multiline ? <textarea rows={key === "abstract" || key === "executiveSummary" ? 5 : 3} value={form[key]} onChange={e => change(key, e.target.value)} style={INPUT} />
        : <input value={form[key]} onChange={e => change(key, e.target.value)} style={INPUT} />}
      {errors[key] && <small style={{ display: "block", color: "#bd3030" }}>{errors[key]}</small>}
    </label>;

  const save = async (status: "DRAFT" | "REVIEW" | "PUBLISHED") => {
    setErrors({}); setBusy(true);
    try {
      if (cover && status === "PUBLISHED") {
        const ratio = await ratioOf(cover);
        const expected = format === "PERSPECTIVE" ? 0.8 : 1 / Math.sqrt(2);
        if (format !== "EDITORIAL_NOTE" && format !== "WORKING_PAPER" && Math.abs(ratio - expected) > 0.015) {
          setErrors({ cover: `Proporsi cover harus ${format === "PERSPECTIVE" ? "4:5" : "A4 potret"}` }); return;
        }
      }
      const fd = new FormData();
      fd.append("type", TYPE[format]); fd.append("format", format); fd.append("status", status);
      FIELDS.forEach(key => fd.append(key, key === "attribution" && format === "EDITORIAL_NOTE" && !editorAttribution ? "Redaksi Manara Institute" : form[key]));
      fd.append("topics", JSON.stringify(topics)); fd.append("authors", JSON.stringify(lines(authors)));
      fd.append("keywords", JSON.stringify(lines(keywords)));
      fd.append("citations", JSON.stringify(citations.split("\n").map(item => item.trim()).filter(Boolean)));
      if (publishedAt) fd.append("publishedAt", publishedAt);
      fd.append("imageFocusX", String(imageFocusX)); fd.append("imageFocusY", String(imageFocusY));
      fd.append("references", JSON.stringify(lines(references)));
      fd.append("attachments", JSON.stringify(lines(attachments)));
      fd.append("recommendations", JSON.stringify(recommendations.split("\n").filter(Boolean).map(line => {
        const [action, actor] = line.split("|"); return { action: action?.trim() || "", actor: actor?.trim() || "" };
      })));
      if (cover) fd.append("cover", cover); if (pdf) fd.append("pdf", pdf);
      const response = id ? await publicationsApi.update(id, fd) : await publicationsApi.create(fd);
      if (!id) router.push(`${basePath}/${response.data.data.id}`);
      else { await load(); if (status !== "DRAFT") router.push(basePath); }
    } catch (error: any) { setErrors({ general: error.response?.data?.message || "Gagal menyimpan", ...(error.response?.data?.fields || {}) }); }
    finally { setBusy(false); }
  };

  const addVersion = async () => {
    if (!id) return;
    setBusy(true); setErrors({});
    try {
      const fd = new FormData(); fd.append("versionDate", versionDate); fd.append("changeSummary", changeSummary);
      if (versionCover) fd.append("cover", versionCover); if (versionPdf) fd.append("pdf", versionPdf);
      await publicationsApi.createVersion(id, fd); setVersionCover(null); setVersionPdf(null); setChangeSummary(""); await load();
    } catch (error: any) { setErrors({ general: error.response?.data?.message || "Gagal menambah versi" }); }
    finally { setBusy(false); }
  };
  const changeVersion = (versionId: string, patch: VersionEdit) =>
    setVersionEdits(previous => ({ ...previous, [versionId]: { ...previous[versionId], ...patch } }));
  const versionPayload = (versionId: string, publish: boolean) => {
    const edit = versionEdits[versionId] || {};
    const fd = new FormData();
    if (publish) fd.append("publish", "true");
    if (edit.date) fd.append("versionDate", edit.date);
    if (edit.summary !== undefined) fd.append("changeSummary", edit.summary);
    if (edit.cover) fd.append("cover", edit.cover);
    if (edit.pdf) fd.append("pdf", edit.pdf);
    return fd;
  };
  const saveVersion = async (versionId: string) => {
    if (!id) return;
    setBusy(true); setErrors({});
    try { await publicationsApi.updateVersion(id, versionId, versionPayload(versionId, false));
      setVersionEdits(previous => { const next = { ...previous }; delete next[versionId]; return next; }); await load(); }
    catch (error: any) { setErrors({ general: error.response?.data?.message || "Versi belum dapat disimpan" }); }
    finally { setBusy(false); }
  };
  const publishVersion = async (versionId: string) => {
    if (!id || !canPublish) return;
    setBusy(true); setErrors({});
    try { await publicationsApi.updateVersion(id, versionId, versionPayload(versionId, true));
      setVersionEdits(previous => { const next = { ...previous }; delete next[versionId]; return next; }); await load(); }
    catch (error: any) { setErrors({ general: error.response?.data?.message || "Versi belum dapat diterbitkan", ...(error.response?.data?.fields || {}) }); }
    finally { setBusy(false); }
  };

  if (loading) return <p role="status">Memuat publikasi…</p>;
  if (format === "JOURNAL") return <div style={{ padding: "clamp(20px,4vw,40px)", maxWidth: 760 }}>
    <Link href={basePath}>← Kembali ke publikasi</Link>
    <h1>Arsip Manara Journal</h1>
    <p>{pub?.title || "Terbitan jurnal lama"} tetap tersimpan. Pembuatan dan penyuntingan edisi jurnal ditunda sampai tahap pengembangan berikutnya.</p>
    <p>Halaman persiapan jurnal dapat diatur melalui pengaturan website.</p>
    {pub?.status === "PUBLISHED" && pub.publicationCode && <Link href={`/P/${pub.publicationCode}`}>Lihat terbitan lama</Link>}
  </div>;
  const coverHint = format === "PERSPECTIVE" ? "4:5 · contoh 1080 × 1350 px" : format === "EDITORIAL_NOTE" ? "Opsional · rasio bebas" : "A4 potret · contoh 1400 × 1980 px";
  return <div style={{ padding: "clamp(16px,4vw,40px)", maxWidth: 1040, margin: "auto", color: "#173642" }}>
    <Link href={basePath} style={{ color: "#266c87" }}>← Kembali ke publikasi</Link>
    <h1 style={{ fontSize: "clamp(26px,4vw,40px)", margin: "16px 0 6px" }}>{id ? "Edit publikasi" : "Publikasi baru"}</h1>
    <p style={{ color: "#627985" }}>Pilih format, isi kolom yang relevan, lalu simpan draf atau kirim untuk ditinjau.</p>
    {pub?.publicationCode && <PublicationIdentity code={pub.publicationCode} />}
    {errors.general && <p role="alert" style={{ color: "#bd3030" }}>{errors.general}</p>}
    <section style={PANEL}><h2>Format dan metadata</h2>
      <label style={{ display: "block", marginBottom: 18 }}>Format publikasi
        <select value={format} onChange={e => setFormat(e.target.value as Format)} style={INPUT}>
          {FORMATS.map(option => <option value={option.value} key={option.value}>{option.label} — {option.hint}</option>)}
        </select></label>
      {input("title", "Judul")}{input("excerpt", "Ringkasan kartu", true)}
      <label style={{ display: "block", marginBottom: 18 }}>Tanggal terbit
        <input type="date" value={publishedAt} onChange={event => setPublishedAt(event.target.value)} style={INPUT} />
        <small style={{ display: "block", color: "#667d86" }}>Kosongkan untuk memakai tanggal terbit otomatis.</small>
        {errors.publishedAt && <small style={{ display: "block", color: "#bd3030" }}>{errors.publishedAt}</small>}
      </label>
      <label style={{ display: "block", marginBottom: 18 }}>Departemen
        <select value={form.department} onChange={e => { change("department", e.target.value); setTopics([]); }} style={INPUT}>
          <option value="">Pilih departemen</option>{PUBLICATION_DEPARTMENTS.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>{errors.department && <small style={{ color: "#bd3030" }}>{errors.department}</small>}</label>
      <fieldset style={{ border: 0, padding: 0 }}><legend>Topik</legend>
        {(department?.topics || []).map(topic => <label key={topic} style={{ display: "inline-flex", gap: 6, margin: "8px 16px 8px 0" }}>
          <input type="checkbox" checked={topics.includes(topic)} onChange={() => setTopics(previous => previous.includes(topic) ? previous.filter(t => t !== topic) : [...previous, topic])} />{topic}
        </label>)}{errors.topics && <small style={{ display: "block", color: "#bd3030" }}>{errors.topics}</small>}
      </fieldset>
    </section>
    <section style={PANEL}><h2>Isi {FORMATS.find(item => item.value === format)?.label}</h2>
      {format === "EDITORIAL_NOTE" && <><label style={{ display: "block", marginBottom: 18 }}>Atribusi
        <select value={editorAttribution ? "editor" : "redaksi"}
          onChange={event => { const named = event.target.value === "editor"; setEditorAttribution(named); change("attribution", named ? user?.name || "" : "Redaksi Manara Institute"); }}
          style={INPUT}><option value="redaksi">Redaksi Manara Institute</option><option value="editor">Editor bernama</option></select>
      </label>
        {editorAttribution && input("attribution", "Nama editor")}
        {input("dataUrl", "Tautan publikasi terkait")}</>}
      {format !== "EDITORIAL_NOTE" && format !== "POLICY_BRIEF" && <label style={{ display: "block", marginBottom: 18 }}>Penulis
        <input value={authors} onChange={e => setAuthors(e.target.value)} style={INPUT} placeholder="Pisahkan dengan koma" />
        {errors.authors && <small style={{ color: "#bd3030" }}>{errors.authors}</small>}</label>}
      {format === "PERSPECTIVE" && input("argumentSummary", "Ringkasan argumen", true)}
      {["RESEARCH_PAPER", "WORKING_PAPER"].includes(format) && input("abstract", "Abstrak", true)}
      {format === "RESEARCH_PAPER" && <><label>Kata kunci<input value={keywords} onChange={e => setKeywords(e.target.value)} style={INPUT} placeholder="Pisahkan dengan koma" /></label>{errors.keywords && <small style={{ color: "#bd3030" }}>{errors.keywords}</small>}</>}
      {format === "RESEARCH_PAPER" && <><label>Sitasi · satu per baris<textarea value={citations} onChange={event => setCitations(event.target.value)} rows={4} style={INPUT} /></label>
        {input("dataUrl", "Tautan data")}
        <label>Lampiran · satu URL per baris<textarea value={attachments} onChange={e => setAttachments(e.target.value)} rows={3} style={INPUT} /></label></>}
      {format === "POLICY_BRIEF" && <>{input("policyProblem", "Masalah kebijakan", true)}{input("decisionMakers", "Sasaran pengambil keputusan")}
        {input("executiveSummary", "Ringkasan eksekutif", true)}
        <label>Rekomendasi · satu per baris, format: tindakan | aktor pelaksana<textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} rows={5} style={INPUT} /></label>
        {errors.recommendations && <small style={{ color: "#bd3030" }}>{errors.recommendations}</small>}
        {input("evidence", "Dasar bukti", true)}{input("policyOptions", "Opsi kebijakan", true)}{input("implementationNotes", "Catatan implementasi", true)}</>}
      {format === "WORKING_PAPER" && <>{input("seriesNumber", "Nomor seri · opsional")}{input("feedbackUrl", "Kanal masukan · URL")}{input("followUpResearchUrl", "Research Paper lanjutan · URL")}</>}
      {["EDITORIAL_NOTE", "PERSPECTIVE", "RESEARCH_PAPER"].includes(format) && <div style={{ marginTop: 18 }}><label>Isi naskah HTML</label>
        <RichTextEditor value={form.content} onChange={value => change("content", value)} minHeight="300px" />{errors.content && <small style={{ color: "#bd3030" }}>{errors.content}</small>}</div>}
      {format === "PERSPECTIVE" && <label style={{ display: "block", marginTop: 18 }}>Referensi · satu per baris<textarea rows={4} value={references} onChange={e => setReferences(e.target.value)} style={INPUT} /></label>}
    </section>
    <section style={PANEL}><h2>Media</h2><p>{coverHint}</p>
      {format !== "WORKING_PAPER" && <><label>Cover web<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0] || null; setCover(file); setLocalCoverUrl(file ? URL.createObjectURL(file) : ""); }} style={INPUT} /></label>
        {(localCoverUrl || coverUrl) && <img src={localCoverUrl || coverUrl} alt="Pratinjau cover" style={{ display: "block", maxWidth: 240, maxHeight: 300, objectFit: "contain", marginTop: 12 }} />}
        {errors.cover && <small style={{ color: "#bd3030" }}>{errors.cover}</small>}</>}
      {format === "EDITORIAL_NOTE" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginTop: 16 }}>
        <label>Titik fokus horizontal · {imageFocusX}%<input type="range" min="0" max="100" value={imageFocusX} onChange={event => setImageFocusX(Number(event.target.value))} style={{ display: "block", width: "100%" }} /></label>
        <label>Titik fokus vertikal · {imageFocusY}%<input type="range" min="0" max="100" value={imageFocusY} onChange={event => setImageFocusY(Number(event.target.value))} style={{ display: "block", width: "100%" }} /></label>
      </div>}
      {["RESEARCH_PAPER", "POLICY_BRIEF"].includes(format) && <label style={{ display: "block", marginTop: 18 }}>PDF terpisah dari cover web<input type="file" accept="application/pdf" onChange={e => setPdf(e.target.files?.[0] || null)} style={INPUT} /></label>}
    </section>
    {format === "WORKING_PAPER" && <section style={PANEL}><h2>Versi Working Paper</h2>
      {!id && <p>Simpan draf terlebih dahulu, lalu tambahkan versi.</p>}
      {id && <><label>Tanggal versi<input type="date" value={versionDate} onChange={e => setVersionDate(e.target.value)} style={INPUT} /></label>
        <label>Cover A4<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setVersionCover(e.target.files?.[0] || null)} style={INPUT} /></label>
        <label>PDF versi<input type="file" accept="application/pdf" onChange={e => setVersionPdf(e.target.files?.[0] || null)} style={INPUT} /></label>
        {errors.cover && <small style={{ display: "block", color: "#bd3030" }}>{errors.cover}</small>}
        {errors.pdf && <small style={{ display: "block", color: "#bd3030" }}>{errors.pdf}</small>}
        <label>Ringkasan perubahan · wajib mulai versi 2<textarea value={changeSummary} onChange={e => setChangeSummary(e.target.value)} style={INPUT} /></label>
        <button type="button" disabled={busy} onClick={addVersion}>Simpan versi sebagai draf</button>
        {errors.versions && <small style={{ color: "#bd3030" }}>{errors.versions}</small>}
        <ol>{versions.map(version => <li key={version.id} style={{ margin: "14px 0" }}>
          Versi {version.number} · {new Date(version.versionDate).toLocaleDateString("id-ID")} {version.isCurrent ? "· terkini" : ""} {version.isPublished ? "· terbit" : "· draf"}
          {version.changeSummary && <p>{version.changeSummary}</p>}
          {!version.isPublished && <div style={{ display: "grid", gap: 10, marginTop: 12, padding: 14, border: "1px solid #dce6e8", borderRadius: 6 }}>
            <label>Tanggal versi<input type="date" value={versionEdits[version.id]?.date ?? version.versionDate.slice(0, 10)} onChange={event => changeVersion(version.id, { date: event.target.value })} style={INPUT} /></label>
            <label>Cover A4 {version.coverImage ? "· sudah ada" : "· belum ada"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => changeVersion(version.id, { cover: event.target.files?.[0] || null })} style={INPUT} /></label>
            <label>PDF {version.pdfUrl ? "· sudah ada" : "· belum ada"}<input type="file" accept="application/pdf" onChange={event => changeVersion(version.id, { pdf: event.target.files?.[0] || null })} style={INPUT} /></label>
            <label>Ringkasan perubahan<textarea value={versionEdits[version.id]?.summary ?? version.changeSummary ?? ""} onChange={event => changeVersion(version.id, { summary: event.target.value })} rows={2} style={INPUT} /></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}><button type="button" disabled={busy} onClick={() => saveVersion(version.id)}>Simpan draf versi</button>
              {canPublish && <button type="button" disabled={busy} onClick={() => publishVersion(version.id)}>Terbitkan versi ini</button>}</div>
          </div>}
        </li>)}</ol></>}
    </section>}
    <section style={PANEL}><h2>Pratinjau</h2>
      <button type="button" onClick={() => setPreview(value => !value)}>{preview ? "Tutup pratinjau" : "Lihat kartu dan halaman baca"}</button>
      {preview && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginTop: 18 }}>
        <div style={{ padding: 18, border: "1px solid #c9d9df", borderRadius: 6 }}>
          <small>Kartu katalog · {FORMATS.find(item => item.value === format)?.label}</small>
          {(localCoverUrl || coverUrl) && <img src={localCoverUrl || coverUrl} alt="" style={{ display: "block", width: "100%", height: 220, objectFit: format === "EDITORIAL_NOTE" ? "cover" : "contain", objectPosition: `${imageFocusX}% ${imageFocusY}%`, margin: "10px 0" }} />}
          <h3>{form.title || "Judul publikasi"}</h3><p>{authors || (editorAttribution ? form.attribution : "Redaksi Manara Institute")}</p>
          <p>{form.excerpt || "Ringkasan kartu"}</p>
        </div>
        <article style={{ padding: 20, border: "1px solid #c9d9df", borderRadius: 6, lineHeight: 1.6 }}>
          <small>Halaman baca · {FORMATS.find(item => item.value === format)?.label} · {form.department}</small>
          <h3 style={{ fontSize: 24, margin: "12px 0" }}>{form.title || "Judul publikasi"}</h3>
          <p>{authors || (editorAttribution ? form.attribution : "Redaksi Manara Institute")} {publishedAt && `· ${publishedAt}`}</p>
          {format === "PERSPECTIVE" && <p><strong>Argumen:</strong> {form.argumentSummary}</p>}
          {["RESEARCH_PAPER", "WORKING_PAPER"].includes(format) && <p><strong>Abstrak:</strong> {form.abstract}</p>}
          {format === "POLICY_BRIEF" && <><p><strong>Ringkasan eksekutif:</strong> {form.executiveSummary}</p>
            <p><strong>Rekomendasi:</strong> {recommendations || "Belum diisi"}</p></>}
          {format === "WORKING_PAPER" && <p>Versi {versions.find(version => version.isCurrent)?.number || 1} · PDF per versi</p>}
          {form.content && <p>{form.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 500)}</p>}
          {(pdf || format === "WORKING_PAPER") && <p style={{ color: "#266c87" }}>Unduh PDF</p>}
        </article>
      </div>}
    </section>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <button type="button" disabled={busy} onClick={() => save("DRAFT")}>Simpan draf</button>
      <button type="button" disabled={busy} onClick={() => save("REVIEW")}>Kirim untuk reviu</button>
      {canPublish && format !== "WORKING_PAPER" && <button type="button" disabled={busy} onClick={() => save("PUBLISHED")} style={{ background: "#266c87", color: "white", border: 0, padding: "10px 18px" }}>Terbitkan</button>}
    </div>
  </div>;
}
