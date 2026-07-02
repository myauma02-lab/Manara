"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/tentang", label: "Tentang" },
  { href: "/artikel", label: "Artikel" },
  { href: "/media", label: "Media" },
  { href: "/riset", label: "Riset" },
  { href: "/manapeople", label: "Manapeople" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // Deteksi scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    fn(); // cek posisi awal
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // cek saat pertama load
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Tutup menu saat navigasi
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Ctrl+K → halaman search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/cari");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isDark = isHome && !scrolled;

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: isMobile
          ? "16px 24px"
          : scrolled ? "14px 40px" : "20px 40px",
        background: scrolled
          ? "rgba(244,247,247,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(38,108,135,0.1)"
          : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "padding 0.4s ease, background 0.4s ease",
      }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "Georgia,serif",
          fontSize: "22px",
          fontWeight: 500,
          color: isDark ? "#EEF4F6" : "#0F2830",
          textDecoration: "none",
          letterSpacing: "0.06em",
          transition: "color 0.3s ease",
        }}>
          Manara
        </Link>

        {/* Desktop nav — hanya tampil kalau bukan mobile */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: "13px",
                fontWeight: pathname === link.href ? 500 : 400,
                color: isDark
                  ? pathname === link.href
                    ? "#86AFAA"
                    : "rgba(238,244,246,0.65)"
                  : pathname === link.href
                    ? "#266c87"
                    : "#3A5560",
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition: "color 0.2s ease",
              }}>
                {link.label}
              </Link>
            ))}

            {/* Search */}
            <button
              onClick={() => router.push("/cari")}
              title="Cari (Ctrl+K)"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isDark ? "rgba(238,244,246,0.5)" : "#7A9AA5",
                fontSize: "18px",
                padding: "4px 8px",
                lineHeight: 1,
              }}
            >
              ⌕
            </button>

            {/* Terhubung */}
            <Link href="/#contact" style={{
              fontSize: "12px",
              fontWeight: 500,
              border: `1px solid ${isDark ? "rgba(238,244,246,0.25)" : "rgba(38,108,135,0.2)"}`,
              padding: "8px 20px",
              borderRadius: "2px",
              color: isDark ? "rgba(238,244,246,0.7)" : "#1C3038",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}>
              Terhubung
            </Link>
          </div>
        )}

        {/* Hamburger — hanya tampil kalau mobile */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            <span style={{
              display: "block",
              width: "22px",
              height: "1.5px",
              background: isDark ? "#EEF4F6" : "#0F2830",
              transition: "all 0.3s",
              transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none",
            }} />
            <span style={{
              display: "block",
              width: "22px",
              height: "1.5px",
              background: isDark ? "#EEF4F6" : "#0F2830",
              transition: "all 0.3s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block",
              width: "22px",
              height: "1.5px",
              background: isDark ? "#EEF4F6" : "#0F2830",
              transition: "all 0.3s",
              transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none",
            }} />
          </button>
        )}
      </nav>

      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 48,
              background: "rgba(15,40,48,0.3)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Menu panel */}
          <div style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "rgba(244,247,247,0.98)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(38,108,135,0.1)",
            padding: "8px 24px 24px",
            boxShadow: "0 8px 32px rgba(15,40,48,0.12)",
          }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  fontSize: "17px",
                  fontWeight: pathname === link.href ? 500 : 300,
                  color: pathname === link.href ? "#266c87" : "#1C3038",
                  textDecoration: "none",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(38,108,135,0.07)",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Search di mobile */}
            <Link
              href="/cari"
              style={{
                display: "block",
                fontSize: "17px",
                fontWeight: 300,
                color: "#1C3038",
                textDecoration: "none",
                padding: "14px 0",
                borderBottom: "1px solid rgba(38,108,135,0.07)",
              }}
            >
              🔍 Cari
            </Link>

            {/* CTA */}
            <Link href="/#contact" style={{
              display: "block",
              marginTop: "16px",
              background: "#266c87",
              color: "#fff",
              padding: "14px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "2px",
              textDecoration: "none",
            }}>
              Terhubung
            </Link>
          </div>
        </>
      )}
    </>
  );
}