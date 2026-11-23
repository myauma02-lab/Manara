"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { publicationsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";

const FORMATS = [
  ["EDITORIAL_NOTE", "Editorial Note"], ["RESEARCH_PAPER", "Research Paper"],
  ["PERSPECTIVE", "Perspective"], ["POLICY_BRIEF", "Policy Brief"],
  ["WORKING_PAPER", "Working Paper"],
] as const;

export default function PublicationManager({ basePath }: { basePath: string }) {
  const { user } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [format, setFormat] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    publicationsApi.adminList({ format: format || undefined, search: search || undefined, page, limit: 20 })
      .then(response => { if (active) { setItems(response.data.data || []); setPages(response.data.pagination?.pages || 1); } })
      .catch(() => { if (active) setItems([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [format, search, page]);
  return <div style={{ padding: "clamp(18px,4vw,40px)", color: "#173642" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
      <div><h1 style={{ fontSize: "clamp(27px,4vw,40px)", marginBottom: 4 }}>Publikasi</h1><p>Kelola lima format dalam satu alur editorial.</p></div>
      <Link href={`${basePath}/new`} style={{ background: "#266c87", color: "white", padding: "11px 18px", textDecoration: "none", borderRadius: 5 }}>+ Buat publikasi</Link>
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "25px 0" }}>
      {FORMATS.map(([value, label]) => <Link key={value} href={`${basePath}/new?format=${value}`} style={{ color: "#266c87", border: "1px solid #cbdde4", padding: "7px 10px", borderRadius: 4 }}>{label}</Link>)}
    </div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "20px 0" }}>
      <label>Format <select value={format} onChange={event => { setLoading(true); setFormat(event.target.value); setPage(1); }}><option value="">Semua format</option>
        {FORMATS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Cari <input value={search} onChange={event => { setLoading(true); setSearch(event.target.value); setPage(1); }} placeholder="Judul publikasi" /></label>
    </div>
    {loading ? <p role="status">Memuat publikasi…</p> : items.length ? <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
      <thead><tr><th align="left">Judul</th><th align="left">Format</th><th align="left">Status</th><th align="left">Kode</th><th align="left">Aksi</th></tr></thead>
      <tbody>{items.map(item => <tr key={item.id} style={{ borderTop: "1px solid #dce6e8" }}>
        <td style={{ padding: "13px 8px" }}>{item.title}{item.author?.name && <small style={{ display: "block", color: "#657e86" }}>{item.author.name}</small>}</td>
        <td>{FORMATS.find(([value]) => value === item.format)?.[1] || item.format || item.type}</td>
        <td>{item.status}{item.draftData && <small style={{ display: "block" }}>Draf revisi tersimpan</small>}</td>
        <td><code>{item.publicationCode}</code></td>
        <td><Link href={`${basePath}/${item.id}`}>Edit</Link>{item.status === "PUBLISHED" && <span> · <Link href={`/P/${item.publicationCode}`}>Lihat</Link></span>}</td>
      </tr>)}</tbody></table></div> : <p>Belum ada publikasi yang sesuai filter.</p>}
    <div style={{ display: "flex", gap: 12, marginTop: 20 }}><button disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }}>Sebelumnya</button>
      <span>Halaman {page} dari {pages}</span><button disabled={page >= pages} onClick={() => { setLoading(true); setPage(page + 1); }}>Berikutnya</button></div>
    {user?.role === "PUBLIKASI_WRITER" && <p style={{ color: "#657e86" }}>Penulis hanya melihat publikasi miliknya.</p>}
  </div>;
}
