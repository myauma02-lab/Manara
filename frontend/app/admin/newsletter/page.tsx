"use client";
import { useEffect, useState } from "react";
import { newsletterApi } from "@/lib/api";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    newsletterApi.subscribers()
      .then(r => {
        // Handle berbagai format response
        const data = r.data?.data || r.data || [];
        setSubscribers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Newsletter fetch error:", err);
        setError(err.response?.data?.message || "Gagal memuat data subscriber");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter(s =>
    !search ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
            Newsletter Subscriber
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5" }}>
            {loading ? "Memuat..." : `${subscribers.length} total subscriber`}
          </p>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              {
                value: subscribers.length,
                label: "Total",
                color: "#266c87",
              },
              {
                value: subscribers.filter(s => {
                  const d = new Date(s.createdAt);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length,
                label: "Bulan ini",
                color: "#3F6F6A",
              },
            ].map(stat => (
              <div key={stat.label} style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "16px 24px", textAlign: "center", minWidth: "100px" }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "4px" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "16px 20px", marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#f87171" }}>⚠ {error}</p>
          <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "4px" }}>
            Cek apakah endpoint <code>/api/newsletter/subscribers</code> terdaftar di backend.
          </p>
        </div>
      )}

      {/* Search */}
      {!loading && !error && subscribers.length > 0 && (
        <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden", maxWidth: "400px", marginBottom: "20px" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari email atau nama..."
            style={{ flex: 1, padding: "10px 16px", fontSize: "14px", border: "none", outline: "none", color: "#1C3038", fontFamily: "inherit" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ padding: "0 12px", background: "none", border: "none", color: "#B8CDD2", cursor: "pointer", fontSize: "16px" }}>
              ×
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300 }}>
              Memuat data subscriber...
            </p>
          </div>
        ) : !error && subscribers.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: "#7A9AA5", marginBottom: "8px" }}>
              Belum ada subscriber.
            </p>
            <p style={{ fontSize: "14px", color: "#B8CDD2" }}>
              Subscriber akan muncul setelah ada yang mendaftar di website.
            </p>
          </div>
        ) : !error ? (
          <>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 160px", borderBottom: "1px solid rgba(38,108,135,0.08)", padding: "12px 20px", background: "rgba(38,108,135,0.02)" }}>
              {["Email & Nama", "Tanggal Daftar", "Status"].map(h => (
                <p key={h} style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                  {h}
                </p>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center" }}>
                <p style={{ color: "#B8CDD2", fontSize: "14px" }}>Tidak ada hasil untuk "{search}"</p>
              </div>
            ) : (
              filtered.map(sub => (
                <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 160px", padding: "14px 20px", borderBottom: "1px solid rgba(38,108,135,0.05)", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "2px" }}>
                      {sub.email}
                    </p>
                    {sub.name && (
                      <p style={{ fontSize: "12px", color: "#B8CDD2" }}>{sub.name}</p>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", color: "#7A9AA5" }}>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "—"
                    }
                  </p>
                  <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "2px", background: "rgba(63,111,106,0.1)", color: "#3F6F6A", display: "inline-block" }}>
                    Aktif
                  </span>
                </div>
              ))
            )}

            {/* Footer count */}
            <div style={{ padding: "12px 20px", background: "rgba(38,108,135,0.02)", borderTop: "1px solid rgba(38,108,135,0.06)" }}>
              <p style={{ fontSize: "12px", color: "#B8CDD2" }}>
                Menampilkan {filtered.length} dari {subscribers.length} subscriber
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}