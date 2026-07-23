"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_LAYANAN } from "@/lib/layanan-data";
import { settingsApi } from "@/lib/api";

export default function AdminLayananPage() {
  const [savedCount, setSavedCount] = useState<Record<string, boolean>>({});

  useEffect(() => {
    settingsApi.get().then(r => {
      const settings = r.data.data || {};
      const sc: Record<string, boolean> = {};
      ALL_LAYANAN.forEach(l => {
        sc[l.id] = !!settings[`layanan_${l.id}`];
      });
      setSavedCount(sc);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
          Manajemen Layanan
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
          Klik "Edit" pada layanan untuk mengubah konten, harga, FAQ, dan semua section halaman layanan.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "16px" }}>
        {ALL_LAYANAN.map(l => (
          <div key={l.id} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            {/* Top accent */}
            <div style={{ height: "3px", background: l.status === "active" ? l.accentColor : "#B8CDD2" }} />
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
                    {l.title}
                  </h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "2px", background: l.status === "active" ? l.accentColor + "15" : "rgba(184,205,210,0.15)", color: l.status === "active" ? l.accentColor : "#7A9AA5" }}>
                      {l.status === "active" ? "Aktif" : "Coming Soon"}
                    </span>
                    {savedCount[l.id] && (
                      <span style={{ fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "2px", background: "rgba(63,111,106,0.1)", color: "#3F6F6A" }}>
                        ✓ Custom
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <a href={`/layanan?tab=${l.id}`} target="_blank"
                    style={{ padding: "7px 10px", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", color: "#7A9AA5", textDecoration: "none", fontSize: "12px" }}>
                    ↗
                  </a>
                  <Link href={`/admin/layanan/${l.id}`}
                    style={{ padding: "7px 16px", background: l.accentColor, color: "#fff", borderRadius: "2px", textDecoration: "none", fontSize: "12px", fontWeight: 500 }}>
                    Edit
                  </Link>
                </div>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.6 }}>
                {l.heroDesc.substring(0, 100)}...
              </p>
              {l.status === "active" && (
                <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["Pricing", "Overview", "Proses", "FAQ", "Deliverables"].map(s => (
                    <span key={s} style={{ fontSize: "10px", color: "#B8CDD2", background: "rgba(38,108,135,0.05)", border: "1px solid rgba(38,108,135,0.1)", padding: "2px 8px", borderRadius: "2px" }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}