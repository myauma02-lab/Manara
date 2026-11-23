import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PUBLICATION_DEPARTMENTS } from "@/lib/publication-explorer";
import styles from "./FocusAreasSection.module.css";

const DESCRIPTIONS = [
  "Hukum sebagai instrumen pengaturan masyarakat, institusi, dan transformasi sosial ekonomi.",
  "Kekuasaan, institusi politik, relasi negara dan masyarakat, serta tata kelola.",
  "Dinamika ekonomi, pembangunan, kesejahteraan, dan desain kebijakan ekonomi.",
];

export default function FocusAreasSection() {
  return <section className={styles.section} id="topik" aria-labelledby="focus-heading">
    <div className={styles.container}>
      <div className={styles.heading}><div><p className="site-eyebrow">Topik publikasi</p>
        <h2 id="focus-heading" className="site-display">Bidang kajian Manara.</h2></div>
        <p>Jelajahi publikasi berdasarkan departemen dan topik riset.</p></div>
      <div className={styles.grid}>
        {PUBLICATION_DEPARTMENTS.map((department, index) =>
          <article className={styles.card} key={department.name}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{department.name}</h3><p>{DESCRIPTIONS[index]}</p>
            <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>{department.topics.map(topic =>
              <li key={topic}><Link href={`/publikasi?topik=${encodeURIComponent(topic)}`}>{topic}</Link></li>)}</ul>
            <Link className={styles.explore} href={`/publikasi?departemen=${encodeURIComponent(department.name)}`}>
              Jelajahi departemen <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </article>)}
      </div>
    </div>
  </section>;
}
