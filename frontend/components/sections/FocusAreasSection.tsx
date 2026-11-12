import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PUBLICATION_TOPICS } from "@/lib/publication-explorer";
import styles from "./FocusAreasSection.module.css";

const DESCRIPTIONS: Record<(typeof PUBLICATION_TOPICS)[number], string> = {
  "Media Studies": "Membaca media, platform, dan arus informasi yang membentuk percakapan publik.",
  "Economic Discourse": "Menelaah gagasan, kebijakan, dan perubahan yang membentuk kehidupan ekonomi.",
  "Politic & Social Discourse": "Mengikuti dinamika politik dan sosial serta dampaknya bagi masyarakat.",
  "Human Ecology": "Menghubungkan kehidupan manusia, lingkungan, dan ruang yang kita tinggali.",
  "Law and Public Policy": "Mengkaji hukum dan kebijakan publik dari aturan hingga dampaknya.",
};

export default function FocusAreasSection() {
  return (
    <section className={styles.section} id="topik-riset" aria-labelledby="focus-heading">
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <p className="site-eyebrow">Fokus kajian</p>
            <h2 id="focus-heading" className="site-display">Lima lensa untuk membaca perubahan.</h2>
          </div>
          <p>Temukan gagasan Manara berdasarkan isu yang dekat dengan kehidupan publik.</p>
        </div>
        <div className={styles.grid}>
          {PUBLICATION_TOPICS.map((topic, index) => (
            <Link className={styles.card} href={"/publikasi?topik=" + encodeURIComponent(topic)} key={topic}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{topic}</h3>
              <p>{DESCRIPTIONS[topic]}</p>
              <span className={styles.explore}>Jelajahi topik <ArrowUpRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
