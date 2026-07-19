"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { settingsApi } from "@/lib/api";
import { ALL_LAYANAN, WHATSAPP_NUMBER } from "@/lib/layanan-data";
import type { LayananData, PricingItem } from "@/lib/layanan-data";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";

// Format harga ke IDR
const formatPrice = (price: number) =>
  price === 0 ? null : `Rp ${price.toLocaleString("id-ID")}`;

export default function LayananClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || ALL_LAYANAN[0].id;
  const [overrides, setOverrides] = useState<Record<string, any>>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    null
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load overrides dari DB
  useEffect(() => {
    settingsApi.get()
      .then(r => {
        const settings = r.data.data || {};
        const parsed: Record<string, any> = {};
        ALL_LAYANAN.forEach(l => {
          const key = `layanan_${l.id}`;
          if (settings[key]) {
            try { parsed[l.id] = JSON.parse(settings[key]); } catch { }
          }
        });
        setOverrides(parsed);
      })
      .catch(() => {});
  }, []);

  // Merge default + override
  const getLayanan = (defaultData: LayananData): LayananData => {
    const override = overrides[defaultData.id];
    if (!override) return defaultData;
    return { ...defaultData, ...override };
  };

  const currentDefault = ALL_LAYANAN.find(l => l.id === activeTab) || ALL_LAYANAN[0];
  const current = getLayanan(currentDefault);

  const setTab = (id: string) => {
    router.push(`/layanan?tab=${id}`, { scroll: false });
    setOpenAccordion(null);
    setOpenFaq(null);
    // Scroll ke konten
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const openWhatsApp = (message: string) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main style={{ background: "#F4F7F7" }}>
      <HeroBackground
            settingKey={HERO_BG_KEYS.layanan}
            fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
            gradientDirection="to-right"
            gradientColor="#0F2830"
            gradientOpacity={0.90}
            style={{ paddingTop: "140px", minHeight: "320px" }}
          >
      <Navbar />

      {/* ── HERO PER LAYANAN ── */}
      <section style={{
        paddingTop: "140px",
        paddingBottom: "0",
        background: "#0F2830",
        position: "relative",
        overflow: "hidden",
        minHeight: "320px",
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 20% 50%, ${current.accentColor}25 0%, transparent 60%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", position: "relative", zIndex: 2 }}>
          <div style={{ paddingBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: current.accentColor, marginBottom: "14px", opacity: 0.9 }}>
              Layanan Manara
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,60px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.1, marginBottom: "8px" }}>
              {current.heroTitle}
            </h1>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4vw,50px)", fontWeight: 300, fontStyle: "italic", color: current.accentColor, marginBottom: "20px" }}>
              {current.heroSubtitle}
            </h2>
            <p style={{ fontSize: "clamp(14px,2vw,17px)", fontWeight: 300, color: "rgba(134,175,170,0.6)", lineHeight: 1.85, maxWidth: "560px", marginBottom: "28px" }}>
              {current.heroDesc}
            </p>
            {current.status === "active" && (
              <button
                onClick={() => openWhatsApp(`Halo Manara, saya ingin konsultasi tentang layanan ${current.title}`)}
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#25D366", color: "#fff", padding: "13px 28px", borderRadius: "4px", border: "none", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
              >
                <svg width="20" height="20" viewBox="0 0 30 30" fill="none">
                  <path d="M15 2.5C8.096 2.5 2.5 8.096 2.5 15c0 2.28.617 4.415 1.692 6.247L2.5 27.5l6.427-1.667A12.431 12.431 0 0015 27.5c6.904 0 12.5-5.596 12.5-12.5S21.904 2.5 15 2.5zm6.22 17.193c-.26.73-1.517 1.393-2.077 1.48-.53.08-1.2.113-1.934-.121a17.61 17.61 0 01-1.749-.647c-3.082-1.332-5.09-4.453-5.244-4.66-.152-.206-1.245-1.658-1.245-3.163 0-1.505.788-2.247 1.067-2.553.28-.306.61-.382.814-.382.205 0 .408.002.587.01.188.01.44-.071.688.524.26.62.882 2.125.959 2.278.078.154.13.332.026.537-.105.205-.157.332-.312.511-.154.18-.325.4-.463.537-.154.153-.315.318-.135.624.18.305.8 1.315 1.716 2.13 1.178 1.052 2.173 1.38 2.479 1.533.305.153.484.128.663-.077.18-.205.766-.894 1.97-.894z" fill="white"/>
                </svg>
                Konsultasi Gratis via WhatsApp
              </button>
            )}
          </div>

          {/* ── TAB NAVIGATOR ── */}
          <div style={{
            display: "flex",
            gap: "0",
            overflowX: "auto",
            scrollbarWidth: "none",
            borderTop: "1px solid rgba(38,108,135,0.15)",
          }}>
            {ALL_LAYANAN.map(l => (
              <button
                key={l.id}
                onClick={() => setTab(l.id)}
                style={{
                  padding: "14px 24px",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeTab === l.id ? "#fff" : "rgba(134,175,170,0.45)",
                  borderBottom: `3px solid ${activeTab === l.id ? l.accentColor : "transparent"}`,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  position: "relative",
                }}
              >
                {l.title}
                {l.status === "coming_soon" && (
                  <span style={{ marginLeft: "6px", fontSize: "9px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(134,175,170,0.15)", color: "rgba(134,175,170,0.5)", padding: "2px 6px", borderRadius: "2px" }}>
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
</HeroBackground>
      <div ref={contentRef} />

      {/* ── COMING SOON STATE ── */}
      {current.status === "coming_soon" && (
        <ComingSoonSection data={current} onWhatsApp={openWhatsApp} />
      )}

      {/* ── ACTIVE LAYANAN ── */}
      {current.status === "active" && (
        <>
          {/* ── PRICING / SERVICE CATALOG ── */}
          <section style={{ padding: "64px clamp(20px,5vw,40px)", background: "#fff", borderBottom: "1px solid rgba(38,108,135,0.08)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8CDD2", marginBottom: "28px" }}>
                Pilih Layanan
              </p>

              {current.categories.map(cat => (
                <div key={cat.id} style={{ marginBottom: "16px" }}>
                  {/* Accordion header untuk kategori dengan items */}
                  {cat.items && (
                    <div
                      onClick={() => setOpenAccordion(openAccordion === cat.id ? null : cat.id)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: current.accentColor, borderRadius: openAccordion === cat.id ? "4px 4px 0 0" : "4px", cursor: "pointer" }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: 500, color: "#fff" }}>{cat.title}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {cat.pricing?.[0] && (
                          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                            Mulai dari{" "}
                            <strong style={{ color: "#fff" }}>{formatPrice(cat.pricing[0].price) || "Hubungi Kami"}</strong>
                            {cat.pricing[0].priceNote ? ` ${cat.pricing[0].priceNote}` : ""}
                          </span>
                        )}
                        <span style={{ color: "#fff", fontSize: "16px", transition: "transform 0.25s", transform: openAccordion === cat.id ? "rotate(180deg)" : "none" }}>▼</span>
                      </div>
                    </div>
                  )}

                  {/* Accordion content — list items */}
                  {cat.items && openAccordion === cat.id && (
                    <div style={{ border: `1px solid ${current.accentColor}30`, borderTop: "none", borderRadius: "0 0 4px 4px", overflow: "hidden" }}>
                      {cat.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: i < cat.items!.length - 1 ? "1px solid rgba(38,108,135,0.07)" : "none", background: "#fff" }}>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 300, color: "#266c87" }}>{item.name}</p>
                            {item.description && (
                              <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "2px" }}>{item.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => openWhatsApp(`Halo Manara, saya ingin memesan: ${item.name}`)}
                            style={{ padding: "7px 16px", background: current.accentColor, color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", fontWeight: 500, cursor: "pointer", flexShrink: 0, marginLeft: "16px" }}
                          >
                            Pilih Layanan
                          </button>
                        </div>
                      ))}
                      {/* Pricing untuk kategori ini */}
                      {cat.pricing && cat.pricing.length > 0 && (
                        <div style={{ padding: "20px 24px", background: "rgba(38,108,135,0.03)", borderTop: "1px solid rgba(38,108,135,0.07)" }}>
                          <p style={{ fontSize: "12px", color: "#B8CDD2", marginBottom: "12px" }}>Paket Harga:</p>
                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            {cat.pricing.map(p => (
                              <div key={p.id} style={{ flex: 1, minWidth: "200px", background: "#fff", border: `1px solid ${p.isBestSeller ? current.accentColor : "rgba(38,108,135,0.12)"}`, borderRadius: "4px", padding: "16px", position: "relative" }}>
                                {p.isBestSeller && (
                                  <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: current.accentColor, color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 12px", borderRadius: "2px", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                    Best Seller
                                  </span>
                                )}
                                <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: current.accentColor, marginBottom: "4px" }}>
                                  {formatPrice(p.price) || <span style={{ fontSize: "14px" }}>Hubungi Kami</span>}
                                </p>
                                {p.priceNote && <p style={{ fontSize: "11px", color: "#B8CDD2", marginBottom: "12px" }}>{p.priceNote}</p>}
                                <div style={{ marginBottom: "14px" }}>
                                  <p style={{ fontSize: "11px", fontWeight: 500, color: "#7A9AA5", marginBottom: "6px" }}>Sudah Termasuk:</p>
                                  {p.includes.map((inc, i) => (
                                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "5px" }}>
                                      <span style={{ color: "#25D366", fontSize: "13px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                                      <p style={{ fontSize: "12px", fontWeight: 300, color: "#3A5560" }}>{inc}</p>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  onClick={() => openWhatsApp(p.ctaWhatsapp)}
                                  style={{ width: "100%", padding: "9px", background: p.isBestSeller ? current.accentColor : "transparent", color: p.isBestSeller ? "#fff" : current.accentColor, border: `1px solid ${current.accentColor}`, borderRadius: "3px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                                >
                                  {p.ctaLabel}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing cards langsung (tanpa accordion — untuk legal opinion & review) */}
                  {!cat.items && cat.pricing && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
                      {cat.pricing.map(p => (
                        <PricingCard key={p.id} pricing={p} accentColor={current.accentColor} onWhatsApp={openWhatsApp} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── OVERVIEW ── */}
          <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }} className="two-col-grid">
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: current.accentColor, marginBottom: "14px" }}>Overview</p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.25, marginBottom: "20px" }}>
                    Apa itu {current.title}?
                  </h2>
                  <p style={{ fontSize: "16px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "24px" }}>
                    {current.overview}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {current.overviewPoints.map((point, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px 16px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                      <span style={{ color: current.accentColor, fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      <p style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560", lineHeight: 1.7 }}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── PROSES ── */}
          <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#0F2830" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "64px", alignItems: "start" }} className="two-col-grid">
                <div style={{ position: "sticky", top: "100px" }}>
                  <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "14px" }}>Proses</p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.25 }}>
                    Bagaimana cara kerjanya?
                  </h2>
                </div>
                <div>
                  {current.proses.map((step, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "16px", paddingBottom: "36px", marginBottom: "36px", borderBottom: i < current.proses.length - 1 ? "1px solid rgba(38,108,135,0.1)" : "none" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${current.accentColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: current.accentColor }}>
                        {step.num}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 400, color: "#EEF4F6" }}>{step.title}</h3>
                          {step.duration && (
                            <span style={{ fontSize: "11px", color: "rgba(134,175,170,0.35)", border: "1px solid rgba(38,108,135,0.15)", padding: "3px 10px", borderRadius: "2px" }}>
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.8 }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── DELIVERABLES ── */}
          <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: current.accentColor, marginBottom: "12px" }}>Deliverables</p>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, color: "#0F2830" }}>
                  Yang kamu terima.
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "14px" }}>
                {current.deliverables.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", padding: "20px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px", alignItems: "flex-start" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `1px solid ${current.accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", color: current.accentColor, fontSize: "15px", flexShrink: 0 }}>
                      {d.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#0F2830", marginBottom: "4px" }}>{d.title}</p>
                      <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.7 }}>{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TARGET KLIEN ── */}
          <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: current.accentColor, marginBottom: "12px" }}>Target Klien</p>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, color: "#0F2830" }}>
                  Untuk siapa layanan ini?
                </h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {current.clients.map((client, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "40px", padding: "10px 22px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: current.accentColor, flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: 300, color: "#3A5560" }}>{client}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── MENGAPA MANARA ── */}
          <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#0F2830" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }} className="two-col-grid">
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", marginBottom: "14px" }}>Mengapa Manara</p>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.25 }}>
                    Kenapa pilih kami?
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {current.whyManara.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", padding: "18px", background: "rgba(38,108,135,0.06)", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                      <span style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, color: "rgba(38,108,135,0.4)", flexShrink: 0 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 500, color: "#EEF4F6", marginBottom: "4px" }}>{item.title}</p>
                        <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.7 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: current.accentColor, marginBottom: "12px" }}>FAQ</p>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 300, color: "#0F2830" }}>
                  Pertanyaan yang sering ditanya.
                </h2>
              </div>
              <div>
                {current.faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: "1px solid rgba(38,108,135,0.1)", overflow: "hidden" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", background: "none", border: "none", cursor: "pointer", gap: "16px", textAlign: "left" }}
                    >
                      <span style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 300, color: "#0F2830", lineHeight: 1.35 }}>
                        {faq.q}
                      </span>
                      <span style={{ fontSize: "20px", color: current.accentColor, flexShrink: 0, transition: "transform 0.25s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                        +
                      </span>
                    </button>
                    {openFaq === i && (
                      <div style={{ paddingBottom: "18px", animation: "fadeIn 0.2s ease" }}>
                        <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", lineHeight: 1.85 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 768px) {
          .two-col-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
  );
}

// ── Komponen Pricing Card ──────────────────────────────────
function PricingCard({ pricing, accentColor, onWhatsApp }: {
  pricing: PricingItem;
  accentColor: string;
  onWhatsApp: (msg: string) => void;
}) {
  const formatPrice = (p: number) =>
    p === 0 ? null : `Rp ${p.toLocaleString("id-ID")}`;

  return (
    <div style={{
      background: "#fff",
      border: `2px solid ${pricing.isBestSeller ? accentColor : "rgba(38,108,135,0.12)"}`,
      borderRadius: "8px",
      padding: "28px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxShadow: pricing.isBestSeller ? `0 8px 32px ${accentColor}20` : "none",
    }}>
      {pricing.isBestSeller && (
        <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: accentColor, color: "#fff", fontSize: "11px", fontWeight: 600, padding: "4px 16px", borderRadius: "2px", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Best Seller
        </div>
      )}

      <h3 style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: "#0F2830", marginBottom: "6px" }}>
        {pricing.name}
      </h3>
      <p style={{ fontSize: "13px", fontWeight: 300, color: "#7A9AA5", marginBottom: "20px", lineHeight: 1.6 }}>
        {pricing.description}
      </p>

      {/* Harga */}
      <div style={{ marginBottom: "20px" }}>
        {formatPrice(pricing.price) ? (
          <>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: accentColor, lineHeight: 1 }}>
              {formatPrice(pricing.price)}
            </p>
            {pricing.priceNote && (
              <p style={{ fontSize: "12px", color: "#B8CDD2", marginTop: "4px" }}>{pricing.priceNote}</p>
            )}
          </>
        ) : (
          <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 300, color: accentColor }}>
            Hubungi Kami
          </p>
        )}
      </div>

      {/* Includes */}
      <div style={{ flex: 1, marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7A9AA5", marginBottom: "10px" }}>
          Sudah Termasuk:
        </p>
        {pricing.includes.map((inc, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ color: "#25D366", fontSize: "14px", flexShrink: 0, fontWeight: 700 }}>✓</span>
            <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560", lineHeight: 1.6 }}>{inc}</p>
          </div>
        ))}
        {pricing.extras && pricing.extras.length > 0 && (
          <>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, marginBottom: "8px", marginTop: "12px" }}>
              Ditambah Dengan:
            </p>
            {pricing.extras.map((ex, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                <span style={{ color: accentColor, fontSize: "14px", flexShrink: 0 }}>✦</span>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "#3A5560" }}>{ex}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onWhatsApp(pricing.ctaWhatsapp)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          padding: "13px",
          background: pricing.isBestSeller ? accentColor : "transparent",
          color: pricing.isBestSeller ? "#fff" : accentColor,
          border: `2px solid ${accentColor}`,
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLElement).style.background = accentColor;
          (e.currentTarget as HTMLElement).style.color = "#fff";
        }}
        onMouseOut={e => {
          if (!pricing.isBestSeller) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = accentColor;
          }
        }}
      >
        {pricing.ctaLabel}
      </button>
    </div>
  );
}

// ── Coming Soon Section ───────────────────────────────────
function ComingSoonSection({ data, onWhatsApp }: { data: LayananData; onWhatsApp: (msg: string) => void }) {
  return (
    <div style={{ padding: "80px clamp(20px,5vw,40px)", background: "#F4F7F7", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", textAlign: "center" }}>
        <div style={{ background: "#0F2830", borderRadius: "4px", padding: "64px 48px", border: "1px solid rgba(38,108,135,0.1)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${data.accentColor}10 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(38,108,135,0.25)", padding: "7px 18px", borderRadius: "2px", color: "#86AFAA", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5F8F8A", display: "inline-block", animation: "pulse 2s infinite" }} />
              Segera Hadir
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 300, color: "#EEF4F6", marginBottom: "16px", lineHeight: 1.25 }}>
              {data.title}
            </h2>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300, fontStyle: "italic", color: "rgba(134,175,170,0.5)", marginBottom: "16px" }}>
              {data.heroTitleAccent || data.heroSubtitle}
            </p>
            <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(134,175,170,0.4)", lineHeight: 1.85, marginBottom: "32px" }}>
              {data.comingSoonMessage}
            </p>
            <button
              onClick={() => onWhatsApp(`Halo Manara, saya tertarik dengan layanan ${data.title} yang akan segera hadir. Mohon informasi lebih lanjut.`)}
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#25D366", color: "#fff", padding: "12px 28px", borderRadius: "4px", border: "none", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
            >
              <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                <path d="M15 2.5C8.096 2.5 2.5 8.096 2.5 15c0 2.28.617 4.415 1.692 6.247L2.5 27.5l6.427-1.667A12.431 12.431 0 0015 27.5c6.904 0 12.5-5.596 12.5-12.5S21.904 2.5 15 2.5zm6.22 17.193c-.26.73-1.517 1.393-2.077 1.48-.53.08-1.2.113-1.934-.121a17.61 17.61 0 01-1.749-.647c-3.082-1.332-5.09-4.453-5.244-4.66-.152-.206-1.245-1.658-1.245-3.163 0-1.505.788-2.247 1.067-2.553.28-.306.61-.382.814-.382.205 0 .408.002.587.01.188.01.44-.071.688.524.26.62.882 2.125.959 2.278.078.154.13.332.026.537-.105.205-.157.332-.312.511-.154.18-.325.4-.463.537-.154.153-.315.318-.135.624.18.305.8 1.315 1.716 2.13 1.178 1.052 2.173 1.38 2.479 1.533.305.153.484.128.663-.077.18-.205.766-.894 1.97-.894z" fill="white"/>
              </svg>
              Daftarkan Minat via WhatsApp
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }`}</style>
    </div>
  );
}