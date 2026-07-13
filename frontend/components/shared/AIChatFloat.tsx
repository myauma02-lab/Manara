"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `Kamu adalah AI Asisten Manara — asisten virtual resmi dari Manara, sebuah kolektif intelektual dan inisiatif media kreatif berbasis di Surabaya dan Sidoarjo, Jawa Timur.

TENTANG MANARA:
- Manara adalah ruang intelektual, kreatif, dan berpengetahuan yang berfokus pada kebermanfaatan sosial
- Tagline: "Shaping Ideas for the Public Sphere"
- Website: manara.my.id
- Email: manararesearch@gmail.com
- Didirikan tahun 2024 oleh 5 co-founder

CO-FOUNDERS:
- Mutamimul Yhauma
- Oca Aulia Putri Nofianti
- Shalsa Bila Agustina
- Firstamarya Diffa Oktavinanti
- Sultan Isjad Ubaidillah

LAYANAN MANARA:
1. Legal Opinion — Opini hukum resmi dari advokat (mulai Rp 2.500.000)
2. Legal Drafting — Penyusunan perjanjian & kontrak bawah tangan (mulai Rp 990.000)
3. Legal Review — Review dokumen sebelum tanda tangan (mulai Rp 1.500.000, est. 3-5 jam)
4. Event — Webinar, seminar, workshop, diskusi, sertifikasi (hubungi untuk penawaran)
5. Consulting — Coming Soon
6. Pendaftaran Hukum — Coming Soon

PUBLIKASI:
- Artikel: Opini, esai, analisis, dan commentary untuk pembaca umum
- Manara Paper: Policy paper, working paper, policy brief untuk pemerintah dan akademisi
- Manara Journal: Publikasi ilmiah dengan volume, nomor, dan DOI

PUSAT INFORMASI:
- News: Berita dan perkembangan terbaru Manara
- Awards: Penghargaan dan pencapaian
- Magazine: Majalah digital berkala
- Key Agenda: Jadwal kegiatan strategis

MANAPEOPLE:
- Program rekrutmen dan onboarding terbuka
- Untuk individu yang ingin bergabung sebagai kontributor Manara

INSIGHT:
- Newsletter "Surat Manara" — mingguan, gratis
- Suara Manara — video pendek di Instagram
- Podcast — percakapan mendalam di YouTube

PROYEK:
- Manara mengelola proyek riset, kajian, dan inisiatif kebijakan aktif

PANDUAN MENJAWAB:
- Gunakan bahasa Indonesia yang ramah, hangat, namun tetap intelektual
- Jawab dengan ringkas tapi informatif (maks 3-4 paragraf kecuali diminta detail)
- Untuk pertanyaan layanan, selalu sebutkan cara menghubungi via WhatsApp
- Jika tidak tahu sesuatu yang spesifik, jujur dan arahkan ke kontak langsung
- Jangan buat angka atau fakta yang tidak ada di atas
- Untuk konsultasi hukum, selalu arahkan ke layanan resmi dan ingatkan ini hanya informasi umum
- Sertakan emoji sesekali agar lebih ramah tapi jangan berlebihan`;

const QUICK_QUESTIONS = [
  "Apa itu Manara?",
  "Layanan apa yang tersedia?",
  "Bagaimana cara bergabung?",
  "Berapa harga Legal Review?",
];

export default function AIChatFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input saat dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (!hasGreeted) {
        setHasGreeted(true);
        // Greeting otomatis
        setTimeout(() => {
          setMessages([{
            role: "assistant",
            content: "Halo! 👋 Saya AI Asisten Manara. Saya siap membantu kamu mengenal Manara lebih dalam — mulai dari layanan hukum, publikasi, hingga cara bergabung.\n\nAda yang bisa saya bantu?",
            timestamp: new Date(),
          }]);
          setShowWelcome(false);
        }, 500);
      }
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setShowWelcome(false);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: messageText },
          ],
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const assistantText = data.content?.[0]?.text || "Maaf, saya tidak bisa merespons saat ini. Coba lagi dalam beberapa saat.";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: assistantText,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Maaf, terjadi gangguan koneksi. Silakan coba lagi dalam beberapa saat. 🙏",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const formatText = (text: string) => {
    // Buat teks lebih readable — bold, newlines
    return text
      .split("\n")
      .map((line, i) => (
        <span key={i}>
          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j} style={{ fontWeight: 600, color: "#0F2830" }}>{part.slice(2, -2)}</strong>
              : part
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      ));
  };

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      <div style={{
        position: "fixed",
        bottom: "88px",
        right: "24px",
        width: "360px",
        maxWidth: "calc(100vw - 32px)",
        height: "520px",
        maxHeight: "calc(100vh - 120px)",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(15,40,48,0.2), 0 4px 20px rgba(15,40,48,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 997,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
        pointerEvents: isOpen ? "all" : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transformOrigin: "bottom right",
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0F2830, #266c87)",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}>
          {/* Avatar AI */}
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(38,108,135,0.3)",
            border: "2px solid rgba(134,175,170,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            flexShrink: 0,
          }}>
            ✦
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#EEF4F6", marginBottom: "1px" }}>
              AI Asisten Manara
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", animation: "pulse-green 2s infinite" }} />
              <p style={{ fontSize: "11px", color: "rgba(134,175,170,0.7)" }}>
                {loading ? "Sedang mengetik..." : "Siap membantu Anda"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(134,175,170,0.6)", fontSize: "20px", padding: "4px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "#F8FAFA",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(38,108,135,0.2) transparent",
        }}>

          {/* Welcome state */}
          {showWelcome && messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#0F2830,#266c87)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "24px" }}>
                ✦
              </div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#0F2830", marginBottom: "4px" }}>
                AI Asisten Manara
              </p>
              <p style={{ fontSize: "12px", color: "#7A9AA5" }}>
                Tanyakan apapun tentang Manara
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              {/* Avatar + name row untuk assistant */}
              {msg.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", paddingLeft: "4px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(135deg,#0F2830,#266c87)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", flexShrink: 0 }}>
                    ✦
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 500, color: "#266c87" }}>AI Asisten Manara</p>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user"
                  ? "16px 16px 4px 16px"
                  : "4px 16px 16px 16px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #266c87, #1a4f63)"
                  : "#fff",
                color: msg.role === "user" ? "#fff" : "#1C3038",
                fontSize: "13.5px",
                fontWeight: 300,
                lineHeight: 1.65,
                boxShadow: msg.role === "assistant"
                  ? "0 1px 4px rgba(15,40,48,0.08)"
                  : "none",
                border: msg.role === "assistant"
                  ? "1px solid rgba(38,108,135,0.1)"
                  : "none",
              }}>
                {formatText(msg.content)}
              </div>

              {/* Timestamp */}
              <p style={{
                fontSize: "10px",
                color: "#B8CDD2",
                marginTop: "3px",
                paddingLeft: msg.role === "assistant" ? "4px" : "0",
                paddingRight: msg.role === "user" ? "4px" : "0",
              }}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", paddingLeft: "4px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(135deg,#0F2830,#266c87)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff" }}>
                  ✦
                </div>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#266c87" }}>AI Asisten Manara</p>
              </div>
              <div style={{ background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", boxShadow: "0 1px 4px rgba(15,40,48,0.08)" }}>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#266c87",
                      opacity: 0.4,
                      animation: `typingDot 1.2s infinite ${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions — muncul setelah greeting */}
        {messages.length <= 1 && !loading && (
          <div style={{
            padding: "8px 14px",
            background: "#F8FAFA",
            borderTop: "1px solid rgba(38,108,135,0.07)",
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            flexShrink: 0,
          }}>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 300,
                  color: "#266c87",
                  background: "rgba(38,108,135,0.06)",
                  border: "1px solid rgba(38,108,135,0.15)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(38,108,135,0.12)";
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(38,108,135,0.06)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{
          padding: "12px 14px",
          background: "#fff",
          borderTop: "1px solid rgba(38,108,135,0.1)",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            background: "#F4F7F7",
            border: "1px solid rgba(38,108,135,0.15)",
            borderRadius: "24px",
            padding: "6px 6px 6px 16px",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan Anda..."
              disabled={loading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13px",
                color: "#1C3038",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #266c87, #1a4f63)"
                  : "rgba(38,108,135,0.15)",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8L2 2L5 8L2 14L14 8Z"
                  fill={input.trim() && !loading ? "#fff" : "#B8CDD2"}
                />
              </svg>
            </button>
          </div>
          <p style={{ fontSize: "10px", color: "#B8CDD2", textAlign: "center", marginTop: "6px" }}>
            Powered by AI · Untuk pertanyaan mendesak, hubungi via WhatsApp
          </p>
        </div>
      </div>

      {/* ── FLOATING BUTTON ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label="Buka AI Asisten Manara"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "92px", // Di sebelah kiri tombol WA
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: isOpen
            ? "#0F2830"
            : "linear-gradient(135deg, #266c87, #0F2830)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(15,40,48,0.3), 0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 999,
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
        onMouseOver={e => {
          if (!isOpen) (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLElement).style.transform = isOpen ? "scale(0.9)" : "scale(1)";
        }}
      >
        {/* Icon toggle */}
        <div style={{
          transition: "all 0.25s ease",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: isOpen ? "24px" : "20px",
        }}>
          {isOpen ? "×" : "✦"}
        </div>

        {/* Notif dot — muncul kalau chat belum dibuka */}
        {!hasGreeted && (
          <div style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid #fff",
            animation: "pulse-red 2s infinite",
          }} />
        )}
      </button>

      {/* Tooltip label */}
      {!isOpen && !hasGreeted && (
        <div style={{
          position: "fixed",
          bottom: "34px",
          right: "156px",
          background: "#0F2830",
          color: "#EEF4F6",
          fontSize: "12px",
          fontWeight: 400,
          padding: "7px 14px",
          borderRadius: "6px",
          zIndex: 998,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(15,40,48,0.2)",
          animation: "fadeInLeft 0.4s ease 1s both",
        }}>
          Tanya AI Asisten Manara
          <div style={{
            position: "absolute",
            right: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: "6px solid #0F2830",
          }} />
        </div>
      )}

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.4; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes pulse-red {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}