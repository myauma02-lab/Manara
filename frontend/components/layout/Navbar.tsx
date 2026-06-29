"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/#about", label: "Tentang" },
  { href: "/artikel", label: "Artikel" },
  { href: "/media", label: "Media" },
  { href: "/riset", label: "Riset" },
  { href: "/manapeople", label: "Manapeople" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isDark = isHome && !scrolled;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: scrolled ? "14px 40px" : "20px 40px",
        background: scrolled ? "rgba(244,247,247,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(38,108,135,0.1)" : "none",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s ease",
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

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontSize: "13px",
              fontWeight: pathname === link.href ? 500 : 400,
              color: isDark
                ? pathname === link.href ? "#86AFAA" : "rgba(238,244,246,0.65)"
                : pathname === link.href ? "#266c87" : "#3A5560",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "color 0.2s ease",
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="#contact" style={{
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

        {/* Hamburger */}
<button
  onClick={() => router.push("/cari")}
  style={{
    background: "none", border: "none", cursor: "pointer",
    color: isDark ? "rgba(238,244,246,0.5)" : "#7A9AA5",
    fontSize: "16px", padding: "4px 8px",
    transition: "color 0.2s",
  }}
  title="Cari (Ctrl+K)"
>
  ⌕
</button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 49,
          background: "rgba(244,247,247,0.98)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(38,108,135,0.1)",
          padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: "4px",
          animation: "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontSize: "16px", fontWeight: 300,
              color: pathname === link.href ? "#266c87" : "#1C3038",
              textDecoration: "none",
              padding: "12px 0",
              borderBottom: "1px solid rgba(38,108,135,0.06)",
              display: "block",
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="#contact" style={{
            marginTop: "12px",
            background: "#266c87", color: "#fff",
            padding: "14px", textAlign: "center",
            fontSize: "13px", fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            borderRadius: "2px", textDecoration: "none",
          }}>
            Terhubung
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          nav { padding: 16px 24px !important; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}