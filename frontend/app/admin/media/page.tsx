"use client";
import { useEffect, useState, useCallback } from "react";

interface MediaFile {
  id: string; filename: string; url: string;
  mimeType: string; size: number; width?: number;
  height?: number; alt?: string; folder?: string; createdAt: string;
}

const FOLDERS = ["", "library", "articles", "founders", "projects", "papers"];

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("");
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("manara_token") : "";
  const headers = { Authorization: `Bearer ${token}` };

  const load = useCallback(() => {
    setLoading(true);
    const url = folder
      ? `http://localhost:5000/api/media?folder=${folder}`
      : "http://localhost:5000/api/media";
    fetch(url, { headers })
      .then(r => r.json())
      .then(d => setFiles(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [folder]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder || "library");
        await fetch("http://localhost:5000/api/media/upload", {
          method: "POST",
          headers,
          body: fd,
        });
      }
      load();
    } catch { alert("Gagal mengupload file"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/media/${id}`, { method: "DELETE", headers });
      setFiles(prev => prev.filter(f => f.id !== id));
      setSelected(null);
      setDeleteConfirm(null);
    } catch { alert("Gagal menghapus"); }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Media Library</h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", marginTop: "6px" }}>
            {files.length} file tersimpan
          </p>
        </div>

        {/* Upload button */}
        <label style={{ background: "#266c87", color: "#fff", padding: "12px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          {uploading ? "Mengupload..." : "↑ Upload File"}
          <input
            type="file" accept="image/*" multiple
            onChange={e => handleUpload(e.target.files)}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Folder filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {FOLDERS.map(f => (
          <button key={f} onClick={() => setFolder(f)}
            style={{ padding: "7px 16px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", background: folder === f ? "#266c87" : "transparent", color: folder === f ? "#fff" : "#7A9AA5", cursor: "pointer", transition: "all 0.2s" }}>
            {f || "Semua"}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragOver ? "#266c87" : "rgba(38,108,135,0.15)"}`,
          borderRadius: "4px", padding: "24px",
          textAlign: "center", marginBottom: "24px",
          background: dragOver ? "rgba(38,108,135,0.04)" : "transparent",
          transition: "all 0.2s",
        }}
      >
        <p style={{ fontSize: "14px", fontWeight: 300, color: dragOver ? "#266c87" : "#B8CDD2" }}>
          {dragOver ? "Lepaskan untuk upload" : "Drag & drop gambar di sini, atau klik tombol Upload"}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ aspectRatio: "1", background: "rgba(38,108,135,0.06)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada file</p>
          <p style={{ fontSize: "14px", color: "#B8CDD2" }}>Upload gambar untuk memulai media library Manara</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }}>
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => setSelected(file)}
              style={{
                position: "relative", cursor: "pointer",
                border: `2px solid ${selected?.id === file.id ? "#266c87" : "rgba(38,108,135,0.1)"}`,
                borderRadius: "4px", overflow: "hidden",
                background: "#fff",
                transition: "all 0.2s",
              }}
            >
              {/* Thumbnail */}
              <div style={{ aspectRatio: "1", background: "#F4F7F7", overflow: "hidden", position: "relative" }}>
                {file.mimeType.startsWith("image/") ? (
                  <img
                    src={file.url} alt={file.alt || file.filename}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
                    📄
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ padding: "8px 10px" }}>
                <p style={{ fontSize: "11px", color: "#3A5560", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                  {file.filename}
                </p>
                <p style={{ fontSize: "10px", color: "#B8CDD2" }}>{formatSize(file.size)}</p>
              </div>

              {/* Copy badge on hover */}
              {copied === file.id && (
                <div style={{ position: "absolute", top: "8px", right: "8px", background: "#266c87", color: "#fff", fontSize: "10px", padding: "3px 8px", borderRadius: "2px" }}>
                  Disalin!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => { setSelected(null); setDeleteConfirm(null); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "4px", width: "100%", maxWidth: "600px", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}>
            {/* Preview */}
            <div style={{ background: "#F4F7F7", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {selected.mimeType.startsWith("image/") ? (
                <img src={selected.url} alt={selected.alt || selected.filename}
                  style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "64px" }}>📄</span>
              )}
            </div>

            <div style={{ padding: "28px" }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "20px" }}>
                {selected.filename}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                {[
                  { label: "Ukuran", value: formatSize(selected.size) },
                  { label: "Tipe", value: selected.mimeType },
                  { label: "Folder", value: selected.folder || "library" },
                  ...(selected.width ? [{ label: "Dimensi", value: `${selected.width} × ${selected.height}px` }] : []),
                ].map(info => (
                  <div key={info.label} style={{ background: "rgba(38,108,135,0.04)", padding: "12px", borderRadius: "2px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>{info.label}</p>
                    <p style={{ fontSize: "13px", color: "#3A5560", fontFamily: info.label === "Tipe" ? "monospace" : "inherit" }}>{info.value}</p>
                  </div>
                ))}
              </div>

              {/* URL copy */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "6px" }}>URL</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input readOnly value={selected.url}
                    style={{ flex: 1, padding: "10px 12px", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", fontSize: "12px", color: "#3A5560", fontFamily: "monospace", background: "#F4F7F7", outline: "none" }} />
                  <button onClick={() => copyUrl(selected.url, selected.id)}
                    style={{ padding: "10px 16px", background: copied === selected.id ? "#3F6F6A" : "#266c87", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
                    {copied === selected.id ? "✓" : "Salin"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px" }}>
                <a href={selected.url} target="_blank"
                  style={{ flex: 1, display: "block", textAlign: "center", padding: "11px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", fontSize: "13px", color: "#266c87", textDecoration: "none" }}>
                  Buka di Tab Baru
                </a>
                {deleteConfirm === selected.id ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setDeleteConfirm(null)}
                      style={{ padding: "11px 16px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", fontSize: "13px", color: "#7A9AA5", background: "transparent", cursor: "pointer" }}>
                      Batal
                    </button>
                    <button onClick={() => handleDelete(selected.id)}
                      style={{ padding: "11px 20px", background: "#f87171", color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                      Hapus!
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(selected.id)}
                    style={{ padding: "11px 20px", background: "transparent", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "2px", fontSize: "13px", cursor: "pointer" }}>
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}