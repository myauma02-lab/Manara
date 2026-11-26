"use client";

import { useRef, useState, type ChangeEvent, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";

type Props = {
  onCropped: (file: File) => void;
  onBatchCropped?: (files: File[]) => void;
  multiple?: boolean;
  aspectRatio?: number;
  allowRatioSelection?: boolean;
  accept?: string;
  disabled?: boolean;
  inputStyle?: CSSProperties;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export default function ImageCropInput({ onCropped, onBatchCropped, multiple, aspectRatio, allowRatioSelection, accept = "image/*", disabled, inputStyle, inputRef }: Props) {
  const localInput = useRef<HTMLInputElement>(null);
  const ref = inputRef || localInput;
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState("image.jpg");
  const [ratio, setRatio] = useState(aspectRatio || 1);
  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [natural, setNatural] = useState({ width: 1, height: 1 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<File[]>([]);
  const [completed, setCompleted] = useState<File[]>([]);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    const [file, ...rest] = files;
    setRemaining(rest); setCompleted([]);
    if (!file.type.startsWith("image/")) { setError("Pilih file gambar yang valid."); return; }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setNatural({ width: image.naturalWidth, height: image.naturalHeight });
      setRatio(aspectRatio || image.naturalWidth / image.naturalHeight);
      setSource(url); setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
      setHorizontal(0); setVertical(0); setZoom(1); setError("");
    };
    image.onerror = () => { URL.revokeObjectURL(url); setError("Gambar tidak bisa dibuka."); };
    image.src = url;
  };

  const cropAndUse = async () => {
    if (!source) return;
    setBusy(true); setError("");
    try {
      const image = new Image(); image.src = source;
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = reject; });
      const canvas = document.createElement("canvas");
      const width = Math.min(2400, image.naturalWidth);
      const height = Math.round(width / ratio);
      canvas.width = width; canvas.height = height;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
      const drawWidth = image.naturalWidth * scale; const drawHeight = image.naturalHeight * scale;
      const extraX = Math.max(0, drawWidth - width); const extraY = Math.max(0, drawHeight - height);
      const x = extraX * (horizontal + 100) / 200; const y = extraY * (vertical + 100) / 200;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Browser tidak bisa memproses gambar ini.");
      context.drawImage(image, -x, -y, drawWidth, drawHeight);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Gagal membuat hasil crop.")), "image/jpeg", 0.9));
      const cropped = new File([blob], `${fileName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
      const batch = [...completed, cropped];
      if (remaining.length) {
        setCompleted(batch);
        const [next, ...rest] = remaining;
        setRemaining(rest);
        const nextUrl = URL.createObjectURL(next);
        const nextImage = new Image();
        nextImage.onload = () => { URL.revokeObjectURL(source); setNatural({ width: nextImage.naturalWidth, height: nextImage.naturalHeight }); setRatio(aspectRatio || nextImage.naturalWidth / nextImage.naturalHeight); setSource(nextUrl); setFileName(next.name.replace(/\.[^.]+$/, "") || "image"); setHorizontal(0); setVertical(0); setZoom(1); };
        nextImage.onerror = () => { URL.revokeObjectURL(nextUrl); setError(`Gambar ${next.name} tidak bisa dibuka.`); };
        nextImage.src = nextUrl;
      } else {
        const all = batch;
        setSource(""); URL.revokeObjectURL(source); setRemaining([]); setCompleted([]);
        if (onBatchCropped) onBatchCropped(all); else all.forEach(onCropped);
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Gagal memproses gambar."); }
    finally { setBusy(false); }
  };

  const previewStyle: CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover", aspectRatio: `${ratio}`,
    objectPosition: `${50 + horizontal / 2}% ${50 + vertical / 2}%`, transform: `scale(${zoom})`,
  };

  return <>
    <input ref={ref} type="file" accept={accept} multiple={multiple} onChange={chooseFile} disabled={disabled} style={inputStyle || { display: "none" }} />
    {error && !source && <small role="alert" style={{ display: "block", color: "#bd3030" }}>{error}</small>}
    {source && typeof document !== "undefined" && createPortal(
      <div onClick={() => { URL.revokeObjectURL(source); setSource(""); setRemaining([]); setCompleted([]); }} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(8,22,27,.72)", display: "grid", placeItems: "center", padding: 16 }}>
        <section role="dialog" aria-modal="true" aria-labelledby="image-crop-title" onClick={event => event.stopPropagation()} style={{ width: "min(100%,720px)", maxHeight: "94vh", overflow: "auto", background: "#fff", color: "#173642", borderRadius: 10, padding: 22, boxShadow: "0 20px 70px rgba(0,0,0,.3)" }}>
          <h2 id="image-crop-title" style={{ margin: "0 0 6px", fontSize: 22 }}>Sesuaikan gambar</h2>
          <p style={{ margin: "0 0 16px", color: "#60747b", fontSize: 14 }}>{multiple && (remaining.length || completed.length) ? `Gambar ${completed.length + 1} dari ${completed.length + remaining.length + 1}. ` : ""}Area tengah terpilih otomatis. Geser pengaturan untuk mengubah crop sebelum disimpan.</p>
          {allowRatioSelection && <label style={{ display: "block", maxWidth: 260, marginBottom: 12, fontSize: 13 }}>Rasio crop
            <select value={ratio} onChange={e => { setRatio(Number(e.target.value)); setHorizontal(0); setVertical(0); }} style={{ display: "block", width: "100%", marginTop: 5, padding: 8, border: "1px solid #c9d9df", borderRadius: 5 }}>
              {[{ label: "Asli", value: natural.width / natural.height }, { label: "3:2", value: 3 / 2 }, { label: "16:9", value: 16 / 9 }, { label: "4:3", value: 4 / 3 }, { label: "1:1", value: 1 }, { label: "4:5", value: 4 / 5 }, { label: "3:4", value: 3 / 4 }].map(option => <option key={option.label} value={option.value}>{option.label}</option>)}
            </select>
          </label>}
          <div style={{ width: "100%", aspectRatio: `${ratio}`, overflow: "hidden", background: "#edf2f3", borderRadius: 6, display: "grid", placeItems: "center" }}>
            <img src={source} alt="Pratinjau gambar yang dipotong" style={previewStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "8px 18px", margin: "16px 0" }}>
            <label style={{ fontSize: 13 }}>Geser horizontal<input aria-label="Geser horizontal" type="range" min={-100} max={100} value={horizontal} onChange={e => setHorizontal(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
            <label style={{ fontSize: 13 }}>Geser vertikal<input aria-label="Geser vertikal" type="range" min={-100} max={100} value={vertical} onChange={e => setVertical(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
            <label style={{ fontSize: 13 }}>Perbesar · {zoom.toFixed(1)}×<input aria-label="Perbesar gambar" type="range" min={1} max={3} step={0.05} value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
          </div>
          <p style={{ margin: "8px 0 14px", color: "#60747b", fontSize: 12 }}>Ukuran asli {natural.width} × {natural.height} px · rasio crop {ratio.toFixed(2)}:1</p>
          {error && <p role="alert" style={{ color: "#bd3030" }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
            <button type="button" disabled={busy} onClick={() => { URL.revokeObjectURL(source); setSource(""); setRemaining([]); setCompleted([]); }} style={{ padding: "10px 16px", border: "1px solid #c9d9df", borderRadius: 5, background: "#fff", cursor: "pointer" }}>Batal</button>
            <button type="button" disabled={busy} onClick={() => { setHorizontal(0); setVertical(0); setZoom(1); }} style={{ padding: "10px 16px", border: "1px solid #c9d9df", borderRadius: 5, background: "#fff", cursor: "pointer" }}>Otomatis</button>
            <button type="button" disabled={busy} onClick={() => void cropAndUse()} style={{ padding: "10px 16px", border: 0, borderRadius: 5, background: "#266c87", color: "#fff", fontWeight: 650, cursor: "pointer" }}>{busy ? "Memproses…" : "Gunakan gambar"}</button>
          </div>
        </section>
      </div>, document.body,
    )}
  </>;
}
