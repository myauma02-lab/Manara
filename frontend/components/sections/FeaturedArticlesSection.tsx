import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { serverPublicationsApi } from "@/lib/server-api";
import styles from "./FeaturedArticlesSection.module.css";

function getReadTime(content?: string | null) {
  const words = (content || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function FeaturedArticlesSection() {
  const articles = await serverPublicationsApi.list({ type: "ARTICLE", limit: "4" }).catch(() => []);
  const featured = articles?.[0];
  const supporting = articles?.slice(1, 4) || [];
  if (!featured) return null;

  return (
    <section className={styles.section} aria-labelledby="featured-heading">
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <p className="site-eyebrow">Bacaan pilihan</p>
            <h2 id="featured-heading" className="site-display">Gagasan untuk memahami<br /><em>yang sedang berubah.</em></h2>
          </div>
          <Link href="/publikasi/artikel" className={styles.allLink}>Semua artikel <ArrowRight size={17} aria-hidden="true" /></Link>
        </header>

        <Link href={`/publikasi/artikel/${featured.slug}`} className={styles.featuredCard}>
          <div className={styles.featuredImage} style={featured.coverImage ? { backgroundImage: `url(${JSON.stringify(featured.coverImage)})` } : undefined}>
            {!featured.coverImage && <span className={styles.placeholderMark} aria-hidden="true">M</span>}
            <span className={styles.imageBadge}>Pilihan redaksi</span>
          </div>
          <div className={styles.featuredContent}>
            <p className={styles.category}>{featured.articleSubtype || "ARTIKEL"}{featured.category?.name ? ` · ${featured.category.name}` : ""}</p>
            <h3>{featured.title}</h3>
            {featured.excerpt && <p className={styles.excerpt}>{featured.excerpt}</p>}
            <div className={styles.meta}>
              <span>{featured.author?.name || "Manara Institute"}</span>
              <span className={styles.readTime}><Clock3 size={14} aria-hidden="true" />{getReadTime(featured.content)} menit baca</span>
              <span className={styles.readLink}>Baca artikel <ArrowRight size={16} aria-hidden="true" /></span>
            </div>
          </div>
        </Link>

        {supporting.length > 0 && (
          <div className={styles.secondaryGrid}>
            {supporting.map(article => (
              <Link key={article.id} href={`/publikasi/artikel/${article.slug}`} className={styles.articleCard}>
                <div className={styles.articleImage} style={article.coverImage ? { backgroundImage: `url(${JSON.stringify(article.coverImage)})` } : undefined}>
                  {!article.coverImage && <span className={styles.placeholderMark} aria-hidden="true">M</span>}
                </div>
                <div className={styles.articleContent}>
                  <p className={styles.category}>{article.articleSubtype || "ARTIKEL"}</p>
                  <h3>{article.title}</h3>
                  <div className={styles.articleMeta}><span>{article.author?.name || "Manara Institute"}</span><ArrowRight size={16} aria-hidden="true" /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
