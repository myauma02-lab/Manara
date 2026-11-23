import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { serverHomepageStatsApi } from "@/lib/server-api";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import { PUBLICATION_TOPICS } from "@/lib/publication-explorer";
import HeroBackground from "@/components/shared/HeroBackground";
import styles from "./HeroSectionModern.module.css";

export default async function HeroSectionModern() {
  const stats = await serverHomepageStatsApi.get();
  const publicationCount = stats.publicationCount ?? 0;
  const fellowCount = stats.fellowCount ?? 0;
  const metrics = [
    { value: publicationCount > 0 ? publicationCount.toLocaleString("id-ID") : "—", label: "Publikasi" },
    { value: fellowCount > 0 ? fellowCount.toLocaleString("id-ID") : "—", label: "Peneliti & fellows" },
    { value: String(PUBLICATION_TOPICS.length), label: "Fokus kajian" },
  ];

  return (
    <HeroBackground
      settingKey={HERO_BG_KEYS.homepage}
      height="auto"
      className={styles.background}
      fallbackGradient="linear-gradient(135deg, #102D38 0%, #154C60 100%)"
      gradientDirection="overlay"
      gradientColor="#0F2830"
      gradientOpacity={0.9}
      style={{ minHeight: "100svh" }}
    >
      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}><span aria-hidden="true" /> Lembaga Kajian Kebijakan – Anak Muda Indonesia</p>
          <p className={styles.brandLine}>Shaping Ideas for the Public Sphere</p>
          <h1 id="home-heading">
            Di mana gagasan<br />
            menemukan <em>cahayanya.</em>
          </h1>
          <p className={styles.description}>
            Manara mengolah riset, analisis kebijakan, dan percakapan publik agar gagasan yang penting lebih mudah dipahami dan dibicarakan.
          </p>
          <div className={styles.actions}>
            <Link href="/publikasi" className="ui-button ui-button-primary">Jelajahi publikasi <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/publikasi#topik" className="ui-button ui-button-secondary">Lihat bidang kajian</Link>
          </div>

          <div className={styles.metrics} aria-label="Ringkasan Manara">
            {metrics.map((metric, index) => (
              <div className={styles.metric} key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                {index < metrics.length - 1 && <i aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        <a href="/publikasi#topik" className={styles.scrollCue} aria-label="Lanjut ke topik publikasi">
          <span>Jelajahi Manara</span><ArrowDown size={16} aria-hidden="true" />
        </a>
      </section>
    </HeroBackground>
  );
}
