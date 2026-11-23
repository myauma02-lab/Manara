"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./FooterModern.module.css";

const FOOTER_GROUPS = [
  {
    title: "Jelajahi",
    links: [
      { label: "Semua publikasi", href: "/publikasi" },
      { label: "Perspective", href: "/publikasi?jenis=perspective" },
      { label: "Research Paper", href: "/publikasi?jenis=research-paper" },
      { label: "Manara Journal", href: "/publikasi/journal" },
      { label: "Topik publikasi", href: "/publikasi#topik" },
    ],
  },
  {
    title: "Pusat Informasi",
    links: [
      { label: "News", href: "/pusat-informasi/news" },
      { label: "Awards", href: "/pusat-informasi/awards" },
    ],
  },
  {
    title: "Manara",
    links: [
      { label: "Tentang kami", href: "/tentang/manara" },
      { label: "Manifesto", href: "/tentang/manifesto" },
      { label: "Fellows", href: "/tentang/fellows" },
      { label: "ManaPeople", href: "/manapeople" },
      { label: "Hubungi", href: "/#contact" },
    ],
  },
];

export default function FooterModern() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerMain}>
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.wordmark}>Manara<span>Institute</span></Link>
            <p>Kolektif intelektual dan media kreatif berbasis Jawa Timur.</p>
            <span className={styles.tagline}>Shaping Ideas for the Public Sphere</span>
          </div>

          {FOOTER_GROUPS.map(group => (
            <div className={styles.linkGroup} key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(link => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Manara Institute</p>
          <p className={styles.bottomQuote}>Di mana gagasan menemukan cahayanya.</p>
          <div className={styles.bottomLinks}>
            <Link href="/cari">Cari</Link>
            <Link href="/portal">Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
