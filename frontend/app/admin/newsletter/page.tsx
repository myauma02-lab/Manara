"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
import { useEffect, useState } from "react";
import { newsletterApi } from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsletterApi.subscribe({ email: "" });
    fetch(`${API_URL}/api/newsletter/subscribers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("manara_token")}` }
    }).then(r => r.json()).then(d => setSubscribers(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>Newsletter</h1>
        <p style={{ fontSize: "14px", color: "#7A9AA5", marginTop: "8px" }}>Total aktif: <strong>{subscribers.filter(s => s.status === "ACTIVE").length}</strong> subscriber</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "48px", textAlign: "center", color: "#7A9AA5" }}>Memuat...</p>
        ) : subscribers.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>Belum ada subscriber</p>
            <p style={{ fontSize: "14px", color: "#B8CDD2" }}>Subscriber akan muncul di sini setelah ada yang mendaftar</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                {["Email", "Nama", "Status", "Tanggal Daftar"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)" }}>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "#0F2830" }}>{s.email}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7A9AA5" }}>{s.name || "—"}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 500, padding: "3px 10px", borderRadius: "2px", background: s.status === "ACTIVE" ? "rgba(95,143,138,0.15)" : "rgba(184,205,210,0.2)", color: s.status === "ACTIVE" ? "#3F6F6A" : "#7A9AA5" }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#B8CDD2" }}>
                    {format(new Date(s.createdAt), "d MMM yyyy", { locale: localeId })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
