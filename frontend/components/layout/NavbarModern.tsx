"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import styles from "./NavbarModern.module.css";

type NavChild = { label: string; href: string; description?: string };
type NavGroup = { label: string; href: string; children: NavChild[]; roots: string[] };

const NAV: NavGroup[] = [
  {
    label: "Publikasi",
    href: "/publikasi",
    roots: ["/publikasi"],
    children: [
      { label: "Semua publikasi", href: "/publikasi", description: "Cari semua karya Manara" },
      { label: "Editorial Note", href: "/publikasi?jenis=editorial-note" },
      { label: "Research Paper", href: "/publikasi?jenis=research-paper" },
      { label: "Perspective", href: "/publikasi?jenis=perspective" },
      { label: "Policy Brief", href: "/publikasi?jenis=policy-brief" },
      { label: "Working Paper", href: "/publikasi?jenis=working-paper" },
      { label: "Manara Journal", href: "/publikasi/journal", description: "Dalam persiapan" },
    ],
  },
  {
    label: "Pusat Informasi",
    href: "/pusat-informasi",
    roots: ["/pusat-informasi"],
    children: [
      { label: "News", href: "/pusat-informasi/news", description: "Kabar Manara" },
      { label: "Awards", href: "/pusat-informasi/awards", description: "Penghargaan dan pencapaian" },
    ],
  },
  {
    label: "Tentang",
    href: "/tentang/manara",
    roots: ["/tentang", "/manapeople"],
    children: [
      { label: "Tentang Manara", href: "/tentang/manara", description: "Misi dan cara kerja kami" },
      { label: "Manifesto", href: "/tentang/manifesto", description: "Prinsip yang menuntun Manara" },
      { label: "Founder", href: "/tentang/founder", description: "Orang-orang di balik Manara" },
      { label: "Fellows", href: "/tentang/fellows", description: "Jaringan peneliti dan tenaga ahli" },
      { label: "ManaPeople", href: "/manapeople", description: "Terhubung dan bertumbuh bersama Manara" },
    ],
  },
];

export default function NavbarModern() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setOpenMenu(null);
      setMobileOpen(false);
      setMobileExpanded(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMobileOpen(false);
        router.push("/cari");
      }
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [router]);

  const groupIsActive = (group: NavGroup) => group.roots.some(root => pathname === root || pathname.startsWith(root + "/"));
  const headerClass = [styles.header, isHome ? styles.home : "", scrolled ? styles.scrolled : "", mobileOpen ? styles.menuOpen : ""].filter(Boolean).join(" ");

  return (
    <>
      <header ref={headerRef} className={headerClass}>
        <nav className={styles.navbar} aria-label="Navigasi utama">
          <Link href="/" className={styles.brand} aria-label="Manara Institute, beranda">
            <Image src="/favicon.png" alt="" width={34} height={34} priority className={styles.brandMark} />
            <span className={styles.brandText}>
              <strong>Manara</strong>
              <small>Institute</small>
            </span>
          </Link>

          <div className={styles.desktopNav}>
            {NAV.map(group => {
              const active = groupIsActive(group);
              const expanded = openMenu === group.label;
              return (
                <div className={styles.navGroup} key={group.label}>
                  <Link href={group.href} className={[styles.navLink, active ? styles.navLinkActive : ""].filter(Boolean).join(" ")}>
                    {group.label}
                  </Link>
                  <button
                    type="button"
                    className={styles.submenuButton}
                    aria-label={(expanded ? "Tutup" : "Buka") + " submenu " + group.label}
                    aria-expanded={expanded}
                    onClick={() => setOpenMenu(expanded ? null : group.label)}
                  >
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>
                  {expanded && (
                    <div className={styles.dropdown}>
                      <p className={styles.dropdownLabel}>{group.label}</p>
                      {group.children.map(child => (
                        <Link href={child.href} className={styles.dropdownLink} key={child.href} onClick={() => setOpenMenu(null)}>
                          <span>
                            <strong>{child.label}</strong>
                            {child.description && <small>{child.description}</small>}
                          </span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Link href="/cari" className={styles.searchAction} aria-label="Cari di situs Manara" title="Cari (Ctrl+K)">
              <Search size={18} aria-hidden="true" />
              <span>Cari</span>
              <kbd>Ctrl K</kbd>
            </Link>
            <Link href="/portal" className={styles.portalAction}>Portal</Link>
          </div>

          <button
            type="button"
            className={styles.mobileToggle}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(open => !open)}
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <>
          <button type="button" className={styles.backdrop} aria-label="Tutup menu" onClick={() => setMobileOpen(false)} />
          <div id="mobile-navigation" className={styles.mobilePanel}>
            <div className={styles.mobilePanelInner}>
              <Link href="/cari" className={styles.mobileSearch} onClick={() => setMobileOpen(false)}>
                <Search size={18} aria-hidden="true" /> Cari publikasi, topik, atau penulis
              </Link>
              {NAV.map(group => {
                const expanded = mobileExpanded === group.label;
                return (
                  <section className={styles.mobileGroup} key={group.label}>
                    <div className={styles.mobileGroupHeading}>
                      <Link href={group.href} onClick={() => setMobileOpen(false)}>{group.label}</Link>
                      <button
                        type="button"
                        aria-label={(expanded ? "Tutup" : "Buka") + " submenu " + group.label}
                        aria-expanded={expanded}
                        onClick={() => setMobileExpanded(expanded ? null : group.label)}
                      >
                        <ChevronDown size={18} aria-hidden="true" />
                      </button>
                    </div>
                    {expanded && (
                      <div className={styles.mobileChildren}>
                        {group.children.map(child => (
                          <Link href={child.href} key={child.href} onClick={() => setMobileOpen(false)}>
                            <strong>{child.label}</strong>
                            {child.description && <small>{child.description}</small>}
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
              <Link href="/portal" className={styles.mobilePortal} onClick={() => setMobileOpen(false)}>Masuk ke Portal</Link>
              <Link href="/#contact" className={styles.mobileContact} onClick={() => setMobileOpen(false)}>Hubungi Manara</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
