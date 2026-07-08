"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  {
    label: "Tentang Kami",
    href: "/tentang/manara",
    children: [
      { label: "Tentang Manara", href: "/tentang/manara", desc: "Siapa kami dan mengapa kami ada" },
      { label: "Manifesto", href: "/tentang/manifesto", desc: "Tujuh prinsip yang menuntun Manara" },
      { label: "Founder", href: "/tentang/founder", desc: "Orang-orang di balik Manara" },
      { label: "Manara Fellows", href: "/tentang/fellows", desc: "Jaringan tenaga ahli dan peneliti Manara" },
    ],
  },
  {
    label: "Publikasi",
    href: "/publikasi",
    children: [
      { label: "Artikel", href: "/publikasi/artikel", desc: "Opini, esai, analisis, dan commentary" },
      { label: "Manara Paper", href: "/publikasi/paper", desc: "Policy paper, working paper, dan policy brief" },
      { label: "Manara Journal", href: "/publikasi/journal", desc: "Publikasi ilmiah dengan volume dan DOI" },
    ],
  },

  {
    label: "Proyek",
    href: "/proyek",
    children: null, // tidak perlu dropdown
  },

  {
    label: "Layanan",
    href: "/layanan",
    children: [
      { label: "Research", href: "/layanan/research", desc: "Riset kebijakan berbasis bukti" },
      { label: "Policy Brief", href: "/layanan/policy-brief", desc: "Dokumen kebijakan yang actionable" },
      { label: "Training", href: "/layanan/training", desc: "Pelatihan riset dan penulisan" },
      { label: "Media", href: "/layanan/media", desc: "Ekosistem media Manara" },
      { label: "Consulting", href: "/layanan/consulting", desc: "Konsultasi kebijakan dan strategi" },
      { label: "Event", href: "/layanan/event", desc: "Forum dan diskusi publik" },
    ],
  },
  {
    label: "Insight",
    href: "/insight",
    children: [
      { label: "Newsletter", href: "/insight/newsletter", desc: "Surat Manara - mingguan di inbox-mu" },
      { label: "Suara Manara", href: "/insight/suara-manara", desc: "Serial video pendek di Instagram" },
      { label: "Podcast", href: "/insight/podcast", desc: "Percakapan mendalam di YouTube" },
    ],
  },
  {
    label: "ManaPeople",
    href: "/manapeople",
    children: null,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [desktopActive, setDesktopActive] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Mobile detect
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setDesktopActive(null);
  }, [pathname]);

  // Ctrl+K
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/cari");
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const isDark = isHome && !scrolled && !mobileOpen;

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDesktopActive(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDesktopActive(null), 150);
  };

  const isActive = (item: typeof NAV[0]) => {
    if (item.children) {
      return item.children.some(c => pathname.startsWith(c.href));
    }
    return pathname === item.href;
  };

  
  return (
    <>
      {/* ── NAVBAR BAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: isMobile ? "14px 20px" : scrolled ? "12px 48px" : "18px 48px",
        background: scrolled || mobileOpen
          ? "rgba(244,247,247,0.97)"
          : "transparent",
        backdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
        borderBottom: scrolled || mobileOpen
          ? "1px solid rgba(38,108,135,0.1)"
          : "none",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.35s ease",
      }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "Georgia,serif",
          fontSize: "22px",
          fontWeight: 500,
          color: isDark ? "#EEF4F6" : "#0F2830",
          textDecoration: "none",
          letterSpacing: "0.06em",
          flexShrink: 0,
          transition: "color 0.3s",
        }}>
          Manara
        </Link>

        {/* ── DESKTOP NAV ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} ref={dropdownRef}>
            {NAV.map(item => (
              <div
                key={item.label}
                style={{ position: "relative" }}
                onMouseEnter={() => item.children && handleMouseEnter(item.label)}
                onMouseLeave={() => item.children && handleMouseLeave()}
              >
                {item.children ? (
                  <>
                  <button
                    onClick={() => router.push(item.href)}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      padding: "8px 14px",
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isActive(item) ? 500 : 400,
                      color: isDark
                        ? isActive(item) ? "#EEF4F6" : "rgba(238,244,246,0.65)"
                        : isActive(item) ? "#0F2830" : "#3A5560",
                      letterSpacing: "0.01em",
                      transition: "color 0.2s",
                      borderRadius: "2px",
                    }}
                  >
                    {item.label}
                    <span style={{
                      fontSize: "8px",
                      opacity: 0.5,
                      transition: "transform 0.2s",
                      transform: desktopActive === item.label ? "rotate(180deg)" : "none",
                    }}>
                      ▼
                    </span>
                  </button>
                  </>

                ) : (

                  <>

                    <Link href={item.href} style={{
                      display: "block",
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: isActive(item) ? 500 : 400,
                      color: isDark
                        ? isActive(item) ? "#EEF4F6" : "rgba(238,244,246,0.65)"
                        : isActive(item) ? "#0F2830" : "#3A5560",
                      textDecoration: "none",
                      letterSpacing: "0.01em",
                      transition: "color 0.2s",
                    }}>
                      {item.label}
                    </Link>
                  </>
                )}


                {/* Dropdown */}
                {item.children && desktopActive === item.label && (
                  <div
                    onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      minWidth: "220px",
                      background: "#fff",
                      border: "1px solid rgba(38,108,135,0.12)",
                      borderRadius: "4px",
                      boxShadow: "0 16px 48px rgba(15,40,48,0.12), 0 4px 16px rgba(15,40,48,0.06)",
                      padding: "6px",
                      animation: "dropIn 0.18s ease",
                      zIndex: 100,
                    }}
                  >
                    {/* Triangle arrow */}
                    <div style={{
                      position: "absolute",
                      top: "-5px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "10px", height: "5px",
                      background: "#fff",
                      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                      filter: "drop-shadow(0 -1px 0 rgba(38,108,135,0.12))",
                    }} />

                    {item.children.map((child, i) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          borderRadius: "2px",
                          textDecoration: "none",
                          background: pathname === child.href
                            ? "rgba(38,108,135,0.06)"
                            : "transparent",
                          transition: "background 0.15s",
                          borderBottom: i < item.children!.length - 1
                            ? "1px solid rgba(38,108,135,0.06)"
                            : "none",
                        }}
                        onMouseEnter={e => {
                          if (pathname !== child.href) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(38,108,135,0.04)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (pathname !== child.href) {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }
                        }}
                      >
                        <p style={{
                          fontSize: "13px",
                          fontWeight: pathname === child.href ? 500 : 400,
                          color: pathname === child.href ? "#266c87" : "#0F2830",
                          margin: "0 0 2px",
                          transition: "color 0.15s",
                        }}>
                          {child.label}
                        </p>
                        {child.desc && (
                          <p style={{
                            fontSize: "11px",
                            fontWeight: 300,
                            color: "#B8CDD2",
                            margin: 0,
                            lineHeight: 1.5,
                          }}>
                            {child.desc}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Search */}
            <button
              onClick={() => router.push("/cari")}
              title="Cari (Ctrl+K)"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: isDark ? "rgba(238,244,246,0.5)" : "#7A9AA5",
                fontSize: "18px", padding: "6px 10px", lineHeight: 1,
                marginLeft: "4px",
                transition: "color 0.2s",
              }}
            >
              ⌕
            </button>

            {/* CTA */}
            <Link href="/#contact" style={{
              marginLeft: "8px",
              fontSize: "12px",
              fontWeight: 500,
              border: `1px solid ${isDark ? "rgba(238,244,246,0.2)" : "rgba(38,108,135,0.2)"}`,
              padding: "8px 20px",
              borderRadius: "2px",
              color: isDark ? "rgba(238,244,246,0.75)" : "#1C3038",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}>
              Terhubung
            </Link>

            <Link href="/admin" style={{
              fontSize: "11px",
              fontWeight: 300,
              color: isDark ? "rgba(238,244,246,0.25)" : "rgba(38,108,135,0.3)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              marginLeft: "4px",
              transition: "color 0.2s",
            }}>
              Admin
              </Link>

          </div>
        )}

        {/* ── MOBILE HAMBURGER ── */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px", display: "flex",
              flexDirection: "column", gap: "5px",
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block",
                width: "22px", height: "1.5px",
                background: isDark ? "#EEF4F6" : "#0F2830",
                transition: "all 0.3s",
                transform: mobileOpen
                  ? i === 0 ? "rotate(45deg) translateY(6.5px)"
                  : i === 2 ? "rotate(-45deg) translateY(-6.5px)"
                  : "none"
                  : "none",
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMobile && mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 48,
              background: "rgba(15,40,48,0.25)",
              backdropFilter: "blur(2px)",
            }}
          />
          <div style={{
            position: "fixed",
            top: "52px", left: 0, right: 0,
            zIndex: 49,
            background: "rgba(244,247,247,0.98)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(38,108,135,0.1)",
            maxHeight: "calc(100vh - 52px)",
            overflowY: "auto",
            animation: "slideDown 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <div style={{ padding: "8px 20px 24px" }}>

              {NAV.map(item => (
                <div key={item.label} style={{ borderBottom: "1px solid rgba(38,108,135,0.07)" }}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(
                          mobileExpanded === item.label ? null : item.label
                        )}
                        style={{
                          width: "100%", display: "flex",
                          alignItems: "center", justifyContent: "space-between",
                          padding: "14px 0",
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: "16px", fontWeight: 300,
                          color: isActive(item) ? "#266c87" : "#1C3038",
                          textAlign: "left",
                        }}
                      >
                        {item.label}
                        <span style={{
                          fontSize: "10px",
                          color: "#B8CDD2",
                          transition: "transform 0.2s",
                          transform: mobileExpanded === item.label
                            ? "rotate(180deg)" : "none",
                        }}>
                          ▼
                        </span>
                      </button>

                      {mobileExpanded === item.label && (
                        <div style={{
                          paddingBottom: "8px",
                          animation: "fadeIn 0.2s ease",
                        }}>
                          {item.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "10px 16px",
                                marginBottom: "2px",
                                borderRadius: "2px",
                                background: pathname === child.href
                                  ? "rgba(38,108,135,0.06)"
                                  : "transparent",
                                textDecoration: "none",
                              }}
                            >
                              <span style={{
                                fontSize: "14px",
                                fontWeight: pathname === child.href ? 500 : 400,
                                color: pathname === child.href ? "#266c87" : "#1C3038",
                                marginBottom: "2px",
                              }}>
                                {child.label}
                              </span>
                              <span style={{
                                fontSize: "11px",
                                fontWeight: 300,
                                color: "#B8CDD2",
                                lineHeight: 1.5,
                              }}>
                                {child.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} style={{
                      display: "block",
                      padding: "14px 0",
                      fontSize: "16px", fontWeight: 300,
                      color: pathname === item.href ? "#266c87" : "#1C3038",
                      textDecoration: "none",
                    }}>
                      {item.label}
                    </Link>
                  )}
                  
                </div>
              ))}

              {/* Search + CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                <Link href="/cari" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "12px 16px",
                  border: "1px solid rgba(38,108,135,0.15)",
                  borderRadius: "2px",
                  fontSize: "14px", fontWeight: 300,
                  color: "#3A5560", textDecoration: "none",
                }}>
                  ⌕ Cari
                </Link>
                <Link href="/#contact" style={{
                  display: "block", textAlign: "center",
                  background: "#266c87", color: "#fff",
                  padding: "14px",
                  fontSize: "13px", fontWeight: 500,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  borderRadius: "2px", textDecoration: "none",
                }}>
                  Terhubung
                </Link>
              </div>
            </div>
                {/* Di bawah Link CTA di mobile menu */}
                <Link href="/admin" style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "rgba(38,108,135,0.4)",
                  textDecoration: "none",
                  marginTop: "8px",
                }}>
                  Login Admin
                </Link>
          </div>
        </>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}