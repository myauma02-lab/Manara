"use client";
import { useEffect, useState } from "react";
import { contactApi } from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function AdminPesanPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const load = () => {
    contactApi.list()
      .then(r => setMessages(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    await contactApi.delete(id).catch(() => {});
    setMessages(prev => prev.filter(m => m.id !== id));
    setSelected(null);
  };


  const [replyOpen, setReplyOpen] = useState(false);

  const [subject, setSubject] = useState("");

  const [reply, setReply] = useState("");

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "#0F2830" }}>
          Pesan Masuk
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "#7A9AA5", marginTop: "6px" }}>
          Pesan dari form kontak website · Total: {messages.length}
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#7A9AA5" }}>Memuat pesan...</p>
      ) : messages.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#7A9AA5", marginBottom: "8px" }}>
            Belum ada pesan masuk
          </p>
          <p style={{ fontSize: "14px", color: "#B8CDD2" }}>
            Pesan dari form kontak homepage akan muncul di sini
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
                {["Nama", "Email", "Tujuan", "Tanggal", "Aksi"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "13px 20px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8CDD2" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} style={{ borderBottom: "1px solid rgba(38,108,135,0.05)", cursor: "pointer" }}>
                  <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 500, color: "#0F2830" }}>
                    {msg.name}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7A9AA5" }}>
                    {msg.email}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", background: "rgba(38,108,135,0.08)", color: "#266c87", padding: "3px 10px", borderRadius: "2px" }}>
                      {msg.purpose || "Umum"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#B8CDD2" }}>
                    {msg.createdAt ? format(new Date(msg.createdAt), "d MMM yyyy · HH:mm", { locale: localeId }) : "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => setSelected(msg)} style={{ fontSize: "12px", color: "#266c87", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
                        Baca
                      </button>
                      <button onClick={() => handleDelete(msg.id)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        Hapus
                      </button>
                      <button onClick={() => {setReplyOpen(true);setSubject("Re: Pesan dari Website Manara")}}>Balas
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal detail */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "4px", width: "100%", maxWidth: "520px", padding: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "22px", color: "#0F2830", marginBottom: "4px" }}>
                  {selected.name}
                </h2>
                <p style={{ fontSize: "13px", color: "#7A9AA5" }}>
                  {selected.email}
                  {selected.purpose ? ` · ${selected.purpose}` : ""}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "22px", color: "#B8CDD2", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ background: "rgba(38,108,135,0.03)", border: "1px solid rgba(38,108,135,0.08)", borderRadius: "2px", padding: "20px", marginBottom: "20px" }}>
              <p style={{ fontSize: "15px", fontWeight: 300, color: "#3A5560", lineHeight: 1.85 }}>
                {selected.message}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "11px", color: "#B8CDD2" }}>
                {selected.createdAt ? format(new Date(selected.createdAt), "d MMMM yyyy · HH:mm", { locale: localeId }) : ""}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <a href={`mailto:${selected.email}`} style={{ fontSize: "13px", fontWeight: 500, color: "#fff", background: "#266c87", border: "none", borderRadius: "2px", padding: "9px 20px", cursor: "pointer", textDecoration: "none" }}>
                  Balas via Email
                </a>
                <button onClick={() => handleDelete(selected.id)} style={{ fontSize: "13px", color: "#f87171", background: "none", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "2px", padding: "9px 20px", cursor: "pointer" }}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}