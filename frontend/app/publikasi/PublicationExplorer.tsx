"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  filterPublications,
  PUBLICATION_TOPICS,
  type PublicationCardData,
  type PublicationKind,
} from "@/lib/publication-explorer";
import styles from "./publikasi.module.css";

const SUBMISSION_POLICY = [
  "Manara adalah kolektif independen berbasis relawan, bukan penerbit terakreditasi. Publikasi di Manara belum terindeks SINTA.",
  "Naskah ditinjau tim editorial Manara. Tidak ada jaminan naskah diterbitkan.",
  "[Perkiraan waktu keputusan: tentukan]",
  "[Hak cipta dan lisensi: tentukan]",
  "[Bukti kontribusi yang diberikan kepada penulis: tentukan]",
];

type KindFilter = PublicationKind | "semua";
type SortFilter = "baru" | "unduhan";

function getKind(value: string | null): KindFilter {
  return value === "artikel" || value === "paper" || value === "journal" ? value : "semua";
}

function getSort(value: string | null): SortFilter {
  return value === "unduhan" ? "unduhan" : "baru";
}

function MagnifyingGlass() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function PublicationExplorer({ publications }: { publications: PublicationCardData[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showPolicy, setShowPolicy] = useState(false);

  const selectedKind = getKind(searchParams.get("jenis"));
  const selectedTopic = searchParams.get("topik") || "semua";
  const selectedSort = getSort(searchParams.get("sort"));

  useEffect(() => {
    // Sync browser Back/Forward navigation into the controlled search field.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const updateFilter = useCallback((key: string, value: string, nextQuery = query) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    else params.delete("q");

    const isDefault = (key === "jenis" && value === "semua") ||
      (key === "topik" && value === "semua") ||
      (key === "sort" && value === "baru");
    if (isDefault || !value) params.delete(key);
    else params.set(key, value);

    const suffix = params.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
  }, [pathname, query, router, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => updateFilter("q", query, query), 200);
    return () => window.clearTimeout(timer);
  }, [query, updateFilter]);

  const kindCounts = useMemo(() => ({
    artikel: publications.filter(item => item.kind === "artikel").length,
    paper: publications.filter(item => item.kind === "paper").length,
    journal: publications.filter(item => item.kind === "journal").length,
  }), [publications]);
  const topics = PUBLICATION_TOPICS;
  const filtered = useMemo(() => filterPublications(publications, {
    q: query,
    kind: selectedKind,
    topic: selectedTopic,
    sort: selectedSort,
  }), [publications, query, selectedKind, selectedTopic, selectedSort]);

  const resetFilters = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  const kindTabs: Array<{ value: KindFilter; label: string; count?: number; preparation?: boolean }> = [
    { value: "semua", label: "Semua", count: publications.length },
    { value: "artikel", label: "Artikel" },
    { value: "paper", label: "Paper", count: kindCounts.paper },
    { value: "journal", label: "Journal", preparation: kindCounts.journal === 0 },
  ];

  const emptyCopy = selectedKind === "journal"
    ? { title: "Manara Journal masih dalam persiapan", body: "Belum ada terbitan. Kami membukanya setelah proses reviu dan kebijakan editorial siap." }
    : selectedKind === "artikel" && !query.trim() && selectedTopic === "semua"
      ? { title: "Artikel pertama segera hadir", body: "Punya tulisan analisis? Baca ketentuan pengiriman di bagian bawah halaman." }
      : { title: "Tidak ada hasil", body: "Coba kata kunci lain atau hapus filter yang aktif." };

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="publication-heading">
        <div className={styles.container}>
          <p className={styles.eyebrow}>PUBLIKASI MANARA</p>
          <h1 className={styles.heroTitle} id="publication-heading">
            Produk intelektual <em>Manara.</em>
          </h1>
          <p className={styles.heroDescription}>
            Dari tulisan populer sampai dokumen kebijakan. Cari, saring, lalu baca atau unduh.
          </p>
          <div className={styles.searchWrap}>
            <label className={styles.searchLabel} htmlFor="publication-search">Cari judul atau penulis</label>
            <div className={styles.searchBox}>
              <MagnifyingGlass />
              <input
                id="publication-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Contoh: lahan, hukum, Society 5.0"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.explorer} aria-label="Jelajahi publikasi">
        <div className={styles.container}>
          <div className={styles.filterTop}>
            <div className={styles.kindTabs} role="group" aria-label="Jenis publikasi">
              {kindTabs.map(tab => (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={selectedKind === tab.value}
                  className={`${styles.kindTab} ${selectedKind === tab.value ? styles.kindTabActive : ""}`}
                  onClick={() => updateFilter("jenis", tab.value)}
                >
                  {tab.label}{tab.count ? ` (${tab.count})` : ""}{tab.preparation ? " · dalam persiapan" : ""}
                </button>
              ))}
            </div>
            <div className={styles.sortControl}>
              <label htmlFor="publication-sort">Urutkan</label>
              <select
                id="publication-sort"
                value={selectedSort}
                onChange={event => updateFilter("sort", event.target.value)}
              >
                <option value="baru">Terbaru</option>
                <option value="unduhan">Paling banyak diunduh</option>
              </select>
            </div>
          </div>

          <div className={styles.topicFilters} role="group" aria-label="Topik publikasi">
            <button
              type="button"
              aria-pressed={selectedTopic === "semua"}
              className={`${styles.topicChip} ${selectedTopic === "semua" ? styles.topicChipActive : ""}`}
              onClick={() => updateFilter("topik", "semua")}
            >Semua topik</button>
            {topics.map(topic => (
              <button
                key={topic}
                type="button"
                aria-pressed={selectedTopic === topic}
                className={`${styles.topicChip} ${selectedTopic === topic ? styles.topicChipActive : ""}`}
                onClick={() => updateFilter("topik", topic)}
              >{topic}</button>
            ))}
          </div>

          <p className={styles.resultCount} aria-live="polite" aria-atomic="true">
            {filtered.length === 0
              ? "Tidak ada publikasi yang cocok"
              : `${filtered.length} publikasi ditampilkan`}
          </p>

          {filtered.length > 0 ? (
            <div className={styles.publicationGrid}>
              {filtered.map(item => (
                <article className={styles.publicationCard} key={item.id}>
                  <div className={styles.cardTop}>
                    <p className={styles.typeLabel}>{item.label}</p>
                    {item.year && <p className={styles.year}>{item.year}</p>}
                  </div>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  {item.author && <p className={styles.author}>{item.author}</p>}
                  {item.topics.length > 0 && <p className={styles.cardTopics}>{item.topics.join(" · ")}</p>}
                  <div className={styles.cardFooter}>
                    <Link href={item.href} className={styles.readLink}>Baca selengkapnya <span aria-hidden="true">→</span></Link>
                    {typeof item.downloads === "number" && item.downloads > 0 && (
                      <span className={styles.downloadCount}>{item.downloads} unduhan</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>{emptyCopy.title}</h2>
              <p>{emptyCopy.body}</p>
              <button type="button" onClick={resetFilters} className={styles.resetButton}>Tampilkan semua publikasi</button>
            </div>
          )}
          {/* Untuk volume di atas sekitar 50 item, pindahkan pencarian dan filter ke query server-side. */}
        </div>
      </section>

      <section className={styles.standards} aria-labelledby="standards-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>FORMAT PUBLIKASI</p>
            <h2 id="standards-heading">Tiga format, tiga standar</h2>
            <p>Agar jelas apa yang Anda baca dan siapa yang meninjaunya.</p>
          </div>
          <div className={styles.formatGrid}>
            <article className={styles.formatCard}>
              <h3>Artikel</h3>
              <p className={styles.formatTypes}>Opini · Esai · Analisis · Commentary</p>
              <p>Untuk pembaca umum yang ingin memahami isu tanpa jargon berlebihan.</p>
              <p className={styles.reviewNote}><strong>Reviu:</strong> editor internal.</p>
            </article>
            <article className={styles.formatCard}>
              <h3>Manara Paper</h3>
              <p className={styles.formatTypes}>Policy Paper · Working Paper · Policy Brief</p>
              <p>Dokumen kebijakan dan riset untuk pemerintah, NGO, akademisi, dan lembaga.</p>
              <p className={styles.reviewNote}><strong>Reviu:</strong> tim internal dan Fellow. Bukan peer review jurnal.</p>
            </article>
            <article className={`${styles.formatCard} ${styles.journalCard}`}>
              <h3>Manara Journal</h3>
              <p><span className={styles.preparationTag}>Dalam persiapan</span></p>
              <p>Belum ada terbitan. Kami membukanya setelah proses reviu dan kebijakan editorial siap.</p>
              <p className={styles.reviewNote}><strong>Status:</strong> belum terindeks.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.contribute} id="publication-contribute" aria-labelledby="contribute-heading">
        <div className={`${styles.container} ${styles.contributeInner}`}>
          <div>
            <p className={styles.contributeEyebrow}>KONTRIBUSI</p>
            <h2 id="contribute-heading">Punya tulisan atau riset?</h2>
            <p>Manara menerima kontribusi dari penulis eksternal. Baca ketentuannya dulu agar ekspektasi kita sama.</p>
          </div>
          <div className={styles.contributeActions}>
            <Link href="/manapeople" className={styles.submitLink}>Kirim tulisan</Link>
            <button
              type="button"
              className={styles.policyToggle}
              aria-expanded={showPolicy}
              aria-controls="submission-policy"
              onClick={() => setShowPolicy(open => !open)}
            >{showPolicy ? "Sembunyikan ketentuan" : "Lihat ketentuan pengiriman"}</button>
          </div>
          <div className={styles.policyPanel} id="submission-policy" hidden={!showPolicy}>
            <ul>{SUBMISSION_POLICY.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>
    </div>
  );
}
