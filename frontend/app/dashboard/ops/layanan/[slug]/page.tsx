"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { settingsApi } from "@/lib/api";
import { ALL_LAYANAN, WHATSAPP_NUMBER } from "@/lib/layanan-data";
import type { LayananData, PricingItem } from "@/lib/layanan-data";
import Link from "next/link";

type Section = "hero" | "pricing" | "overview" | "proses" | "deliverables" | "clients" | "why" | "faq" | "status";

const SECTION_LABELS: Record<Section, string> = {
  hero: "Hero & Deskripsi",
  pricing: "Harga & Layanan",
  overview: "Overview",
  proses: "Proses",
  deliverables: "Deliverables",
  clients: "Target Klien",
  why: "Mengapa Manara",
  faq: "FAQ",
  status: "Status Halaman",
};

export default function EditLayananPage() {
  const { slug } = useParams();
  const router = useRouter();
  const slugStr = String(slug);

  const defaultData = ALL_LAYANAN.find(l => l.id === slugStr);
  const [data, setData] = useState<LayananData | null>(defaultData || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  useEffect(() => {
    if (!defaultData) { setLoading(false); return; }
    settingsApi.get()
      .then(r => {
        const settings = r.data.data || {};
        const key = `layanan_${slugStr}`;
        if (settings[key]) {
          try {
            const parsed = JSON.parse(settings[key]);
            setData(prev => prev ? { ...prev, ...parsed } : parsed);
          } catch { }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slugStr]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await settingsApi.update(`layanan_${slugStr}`, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert("Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const handleReset = () => {
    if (!confirm("Reset ke data default? Semua perubahan akan hilang.")) return;
    setData(defaultData || null);
  };

  const update = (field: keyof LayananData, value: any) => {
    setData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  if (!defaultData || !data) return (
    <div style={{ padding: "40px" }}>
      <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px" }}>Layanan tidak ditemukan.</p>
      <Link href="/admin/layanan" style={{ color: "#266c87", textDecoration: "none" }}>← Kembali</Link>
    </div>
  );

  if (loading) return (
    <div style={{ padding: "40px", color: "#7A9AA5", fontFamily: "Georgia,serif" }}>Memuat data...</div>
  );

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 500 as const,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "#7A9AA5", marginBottom: "6px",
  };

  // ── RENDER SECTIONS ──────────────────────────────────

  const renderHero = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Judul Hero (baris 1)</label>
        <input value={data.heroTitle} onChange={e => update("heroTitle", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Judul Hero Italic (baris 2)</label>
        <input value={data.heroSubtitle} onChange={e => update("heroSubtitle", e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Deskripsi Hero</label>
        <textarea value={data.heroDesc} onChange={e => update("heroDesc", e.target.value)}
          rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
      </div>
      <div>
        <label style={labelStyle}>Warna Aksen</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input value={data.accentColor} onChange={e => update("accentColor", e.target.value)}
            style={{ ...inputStyle, maxWidth: "160px" }} />
          <div style={{ width: "36px", height: "36px", borderRadius: "4px", background: data.accentColor, border: "1px solid rgba(0,0,0,0.1)" }} />
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ background: "rgba(38,108,135,0.04)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px 16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5" }}>
          💡 Edit harga dan konten setiap paket layanan. Nomor WhatsApp: <strong>{WHATSAPP_NUMBER}</strong>
        </p>
      </div>

      {data.categories.map((cat, catIdx) => (
        <div key={cat.id} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "#0F2830" }}>
              Kategori: {cat.title}
            </h3>
          </div>

          {/* Edit category title */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Nama Kategori</label>
            <input value={cat.title} onChange={e => {
              const cats = [...data.categories];
              cats[catIdx] = { ...cats[catIdx], title: e.target.value };
              update("categories", cats);
            }} style={{ ...inputStyle, maxWidth: "400px" }} />
          </div>

          {/* Pricing items */}
          {cat.pricing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                Paket Harga ({cat.pricing.length} paket)
              </p>
              {cat.pricing.map((pricing, pIdx) => (
                <div key={pricing.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.12)", borderRadius: "4px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>Paket: {pricing.name}</p>
                    <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "12px", color: "#7A9AA5" }}>
                      <input type="checkbox" checked={pricing.isBestSeller || false}
                        onChange={e => {
                          const cats = [...data.categories];
                          const pricings = [...(cats[catIdx].pricing || [])];
                          pricings[pIdx] = { ...pricings[pIdx], isBestSeller: e.target.checked };
                          cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                          update("categories", cats);
                        }}
                        style={{ accentColor: data.accentColor }} />
                      Best Seller
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                    <div>
                      <label style={labelStyle}>Nama Paket</label>
                      <input value={pricing.name}
                        onChange={e => {
                          const cats = [...data.categories];
                          const pricings = [...(cats[catIdx].pricing || [])];
                          pricings[pIdx] = { ...pricings[pIdx], name: e.target.value };
                          cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                          update("categories", cats);
                        }}
                        style={{ ...inputStyle, padding: "8px 10px" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Harga (angka, 0 = Hubungi Kami)</label>
                      <input type="number" value={pricing.price}
                        onChange={e => {
                          const cats = [...data.categories];
                          const pricings = [...(cats[catIdx].pricing || [])];
                          pricings[pIdx] = { ...pricings[pIdx], price: parseInt(e.target.value) || 0 };
                          cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                          update("categories", cats);
                        }}
                        style={{ ...inputStyle, padding: "8px 10px" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Catatan Harga</label>
                      <input value={pricing.priceNote || ""}
                        onChange={e => {
                          const cats = [...data.categories];
                          const pricings = [...(cats[catIdx].pricing || [])];
                          pricings[pIdx] = { ...pricings[pIdx], priceNote: e.target.value };
                          cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                          update("categories", cats);
                        }}
                        placeholder="per dokumen, est. 3-5 jam..."
                        style={{ ...inputStyle, padding: "8px 10px" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Label Tombol CTA</label>
                      <input value={pricing.ctaLabel}
                        onChange={e => {
                          const cats = [...data.categories];
                          const pricings = [...(cats[catIdx].pricing || [])];
                          pricings[pIdx] = { ...pricings[pIdx], ctaLabel: e.target.value };
                          cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                          update("categories", cats);
                        }}
                        style={{ ...inputStyle, padding: "8px 10px" }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Deskripsi Paket</label>
                    <textarea value={pricing.description}
                      onChange={e => {
                        const cats = [...data.categories];
                        const pricings = [...(cats[catIdx].pricing || [])];
                        pricings[pIdx] = { ...pricings[pIdx], description: e.target.value };
                        cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                        update("categories", cats);
                      }}
                      rows={2} style={{ ...inputStyle, resize: "none" }} />
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Pesan WhatsApp saat klik CTA</label>
                    <input value={pricing.ctaWhatsapp}
                      onChange={e => {
                        const cats = [...data.categories];
                        const pricings = [...(cats[catIdx].pricing || [])];
                        pricings[pIdx] = { ...pricings[pIdx], ctaWhatsapp: e.target.value };
                        cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                        update("categories", cats);
                      }}
                      style={inputStyle} />
                  </div>

                  {/* Includes */}
                  <label style={labelStyle}>Yang Termasuk (satu per baris)</label>
                  <textarea
                    value={pricing.includes.join("\n")}
                    onChange={e => {
                      const cats = [...data.categories];
                      const pricings = [...(cats[catIdx].pricing || [])];
                      pricings[pIdx] = { ...pricings[pIdx], includes: e.target.value.split("\n").filter(Boolean) };
                      cats[catIdx] = { ...cats[catIdx], pricing: pricings };
                      update("categories", cats);
                    }}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }} />

                  {/* Live preview harga */}
                  <div style={{ marginTop: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", padding: "10px 14px" }}>
                    <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                      Preview harga: <strong style={{ color: data.accentColor }}>
                        {pricing.price > 0 ? `Rp ${pricing.price.toLocaleString("id-ID")}` : "Hubungi Kami"}
                      </strong>
                      {pricing.priceNote && ` ${pricing.priceNote}`}
                    </p>
                  </div>
                </div>
              ))}

              {/* Tambah paket baru */}
              <button onClick={() => {
                const cats = [...data.categories];
                const newPricing: PricingItem = {
                  id: `new-${Date.now()}`,
                  name: "Paket Baru",
                  description: "Deskripsi paket",
                  price: 0,
                  includes: ["Item 1"],
                  ctaLabel: "Pesan Sekarang",
                  ctaWhatsapp: `Halo Manara, saya ingin tahu tentang layanan ${data.title}`,
                };
                cats[catIdx] = { ...cats[catIdx], pricing: [...(cats[catIdx].pricing || []), newPricing] };
                update("categories", cats);
              }}
                style={{ fontSize: "12px", color: data.accentColor, background: "none", border: `1px dashed ${data.accentColor}50`, borderRadius: "2px", padding: "9px", cursor: "pointer", width: "100%" }}>
                + Tambah Paket Harga
              </button>
            </div>
          )}

          {/* Sub-items list */}
          {cat.items && (
            <div>
              <label style={labelStyle}>Daftar Item Layanan (satu per baris)</label>
              <textarea
                value={cat.items.map(i => i.name).join("\n")}
                onChange={e => {
                  const cats = [...data.categories];
                  cats[catIdx] = {
                    ...cats[catIdx],
                    items: e.target.value.split("\n").filter(Boolean).map(n => ({ name: n }))
                  };
                  update("categories", cats);
                }}
                rows={8}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Paragraf Overview</label>
        <textarea value={data.overview} onChange={e => update("overview", e.target.value)}
          rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8 }} />
      </div>
      <div>
        <label style={labelStyle}>Poin-poin Overview (satu per baris)</label>
        <textarea
          value={data.overviewPoints.join("\n")}
          onChange={e => update("overviewPoints", e.target.value.split("\n").filter(Boolean))}
          rows={6} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
    </div>
  );

  const renderProses = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.proses.map((step, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: data.accentColor }}>Langkah {i + 1}</p>
            <button onClick={() => update("proses", data.proses.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>
              Hapus
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px", gap: "8px", marginBottom: "8px" }}>
            <div>
              <label style={labelStyle}>No.</label>
              <input value={step.num} onChange={e => {
                const arr = [...data.proses];
                arr[i] = { ...arr[i], num: e.target.value };
                update("proses", arr);
              }} style={{ ...inputStyle, padding: "8px", textAlign: "center" }} />
            </div>
            <div>
              <label style={labelStyle}>Judul</label>
              <input value={step.title} onChange={e => {
                const arr = [...data.proses];
                arr[i] = { ...arr[i], title: e.target.value };
                update("proses", arr);
              }} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Durasi</label>
              <input value={step.duration || ""} onChange={e => {
                const arr = [...data.proses];
                arr[i] = { ...arr[i], duration: e.target.value };
                update("proses", arr);
              }} placeholder="3–5 hari" style={{ ...inputStyle, padding: "8px 10px" }} />
            </div>
          </div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea value={step.desc} onChange={e => {
            const arr = [...data.proses];
            arr[i] = { ...arr[i], desc: e.target.value };
            update("proses", arr);
          }} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </div>
      ))}
      <button onClick={() => update("proses", [...data.proses, { num: `0${data.proses.length + 1}`, title: "", desc: "", duration: "" }])}
        style={{ fontSize: "12px", color: data.accentColor, background: "none", border: `1px dashed ${data.accentColor}50`, borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Langkah
      </button>
    </div>
  );

  const renderDeliverables = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.deliverables.map((d, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: data.accentColor }}>Deliverable #{i + 1}</p>
            <button onClick={() => update("deliverables", data.deliverables.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>Hapus</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "8px", marginBottom: "8px" }}>
            <div>
              <label style={labelStyle}>Icon</label>
              <input value={d.icon} onChange={e => {
                const arr = [...data.deliverables];
                arr[i] = { ...arr[i], icon: e.target.value };
                update("deliverables", arr);
              }} style={{ ...inputStyle, textAlign: "center", fontSize: "18px", padding: "8px" }} />
            </div>
            <div>
              <label style={labelStyle}>Judul</label>
              <input value={d.title} onChange={e => {
                const arr = [...data.deliverables];
                arr[i] = { ...arr[i], title: e.target.value };
                update("deliverables", arr);
              }} style={inputStyle} />
            </div>
          </div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea value={d.desc} onChange={e => {
            const arr = [...data.deliverables];
            arr[i] = { ...arr[i], desc: e.target.value };
            update("deliverables", arr);
          }} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </div>
      ))}
      <button onClick={() => update("deliverables", [...data.deliverables, { icon: "○", title: "", desc: "" }])}
        style={{ fontSize: "12px", color: data.accentColor, background: "none", border: `1px dashed ${data.accentColor}50`, borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Deliverable
      </button>
    </div>
  );

  const renderClients = () => (
    <div>
      <label style={labelStyle}>Daftar Klien (satu per baris)</label>
      <textarea
        value={data.clients.join("\n")}
        onChange={e => update("clients", e.target.value.split("\n").filter(Boolean))}
        rows={8} style={{ ...inputStyle, resize: "vertical" }} />
      <p style={{ fontSize: "11px", color: "#B8CDD2", marginTop: "6px" }}>
        {data.clients.length} klien terdaftar
      </p>
    </div>
  );

  const renderWhy = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.whyManara.map((item, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: data.accentColor }}>Poin #{i + 1}</p>
            <button onClick={() => update("whyManara", data.whyManara.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>Hapus</button>
          </div>
          <input value={item.title} onChange={e => {
            const arr = [...data.whyManara];
            arr[i] = { ...arr[i], title: e.target.value };
            update("whyManara", arr);
          }} placeholder="Judul" style={{ ...inputStyle, marginBottom: "8px", fontWeight: 500 }} />
          <textarea value={item.desc} onChange={e => {
            const arr = [...data.whyManara];
            arr[i] = { ...arr[i], desc: e.target.value };
            update("whyManara", arr);
          }} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </div>
      ))}
      <button onClick={() => update("whyManara", [...data.whyManara, { title: "", desc: "" }])}
        style={{ fontSize: "12px", color: data.accentColor, background: "none", border: `1px dashed ${data.accentColor}50`, borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah Poin
      </button>
    </div>
  );

  const renderFaq = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.faqs.map((faq, i) => (
        <div key={i} style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: data.accentColor }}>FAQ #{i + 1}</p>
            <button onClick={() => update("faqs", data.faqs.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>Hapus</button>
          </div>
          <input value={faq.q} onChange={e => {
            const arr = [...data.faqs];
            arr[i] = { ...arr[i], q: e.target.value };
            update("faqs", arr);
          }} placeholder="Pertanyaan..." style={{ ...inputStyle, marginBottom: "8px" }} />
          <textarea value={faq.a} onChange={e => {
            const arr = [...data.faqs];
            arr[i] = { ...arr[i], a: e.target.value };
            update("faqs", arr);
          }} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
        </div>
      ))}
      <button onClick={() => update("faqs", [...data.faqs, { q: "", a: "" }])}
        style={{ fontSize: "12px", color: data.accentColor, background: "none", border: `1px dashed ${data.accentColor}50`, borderRadius: "2px", padding: "10px", cursor: "pointer", width: "100%" }}>
        + Tambah FAQ
      </button>
    </div>
  );

  const renderStatus = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <label style={labelStyle}>Status Halaman</label>
        <div style={{ display: "flex", gap: "10px" }}>
          {(["active", "coming_soon"] as const).map(s => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "10px 18px", border: `1px solid ${data.status === s ? data.accentColor : "rgba(38,108,135,0.15)"}`, borderRadius: "2px", background: data.status === s ? data.accentColor + "10" : "transparent" }}>
              <input type="radio" checked={data.status === s} onChange={() => update("status", s)}
                style={{ accentColor: data.accentColor }} />
              <span style={{ fontSize: "13px", fontWeight: data.status === s ? 500 : 300, color: data.status === s ? data.accentColor : "#7A9AA5" }}>
                {s === "active" ? "✓ Aktif (tampil penuh)" : "⏳ Coming Soon"}
              </span>
            </label>
          ))}
        </div>
      </div>
      {data.status === "coming_soon" && (
        <div>
          <label style={labelStyle}>Pesan Coming Soon</label>
          <textarea value={data.comingSoonMessage || ""}
            onChange={e => update("comingSoonMessage", e.target.value)}
            rows={3} style={{ ...inputStyle, resize: "none" }} />
        </div>
      )}
    </div>
  );

  const RENDERERS: Record<Section, () => JSX.Element> = {
    hero: renderHero,
    pricing: renderPricing,
    overview: renderOverview,
    proses: renderProses,
    deliverables: renderDeliverables,
    clients: renderClients,
    why: renderWhy,
    faq: renderFaq,
    status: renderStatus,
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1040px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin/layanan" style={{ color: "#B8CDD2", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "2px" }}>Edit Layanan</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "26px", fontWeight: 300, color: "#0F2830" }}>
            {data.title}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={handleReset}
            style={{ padding: "8px 14px", fontSize: "11px", color: "#B8CDD2", background: "none", border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", cursor: "pointer" }}>
            Reset Default
          </button>
          <a href={`/layanan?tab=${data.id}`} target="_blank"
            style={{ padding: "9px 14px", fontSize: "12px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#7A9AA5", textDecoration: "none" }}>
            Preview ↗
          </a>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: "9px 24px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: saved ? "#3F6F6A" : data.accentColor, color: "#fff", border: "none", borderRadius: "2px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, transition: "background 0.3s" }}>
            {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Semua"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "20px" }}>
        {/* Section navigator */}
        <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            {(Object.entries(SECTION_LABELS) as [Section, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setActiveSection(key)}
                style={{ width: "100%", padding: "11px 14px", display: "block", textAlign: "left", background: activeSection === key ? "rgba(38,108,135,0.06)" : "transparent", border: "none", borderLeft: `3px solid ${activeSection === key ? data.accentColor : "transparent"}`, cursor: "pointer", fontSize: "12px", fontWeight: activeSection === key ? 500 : 300, color: activeSection === key ? data.accentColor : "#3A5560", transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor area */}
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "24px" }}>
          <div style={{ marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830" }}>
              {SECTION_LABELS[activeSection]}
            </h2>
          </div>
          {RENDERERS[activeSection]?.()}
        </div>
      </div>
    </div>
  );
}