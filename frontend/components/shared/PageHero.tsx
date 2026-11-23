import HeroBackground from "@/components/shared/HeroBackground";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  settingKey: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}

export default function PageHero({ settingKey, eyebrow, title, accent, description }: PageHeroProps) {
  return (
    <HeroBackground
      settingKey={settingKey}
      fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
      gradientDirection="overlay"
      gradientColor="#0F2830"
      gradientOpacity={0.88}
      className={styles.background}
    >
      <section className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>
            {title}<br />
            <em>{accent}</em>
          </h1>
          <p className={styles.description}>{description}</p>
        </div>
      </section>
    </HeroBackground>
  );
}
