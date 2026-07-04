'use client';
// components/shared/ArticleDetailClient.tsx
import { useEffect, useState } from 'react';
import { publicationsApi } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Clock, Eye, ArrowLeft } from 'lucide-react';

export default function ArticleDetailClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicationsApi.detail(slug)
      .then(r => setArticle(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-28 flex items-center justify-center text-[13px] text-ink-ghost">Memuat...</div>;
  if (!article) return (
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center">
      <p className="font-serif text-2xl text-ink-light mb-2">Artikel tidak ditemukan</p>
      <Link href="/artikel" className="text-primary text-[13px] font-medium hover:text-primary-light">← Kembali ke Artikel</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-32 bg-ivory">
      {/* Cover */}
      {article.coverImage && (
        <div className="relative h-[50vh] max-h-[520px] bg-deep overflow-hidden mb-0">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ivory" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6">
        {/* Back */}
        <Link href="/artikel" className="inline-flex items-center gap-2 text-[12px] font-light text-ink-ghost hover:text-primary transition-colors mb-8 mt-6">
          <ArrowLeft size={14} /> Kembali ke Artikel
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-primary">{article.mediaType}</span>
          {article.category && (
            <><span className="text-ink-ghost/40">·</span>
              <span className="text-[11px] text-ink-ghost">{article.category.name}</span></>
          )}
          {article.isFeatured && <span className="text-[10px] text-primary font-medium bg-primary/8 px-2 py-0.5 rounded-sm">★ Unggulan</span>}
        </div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(28px,5vw,52px)] font-light text-deep leading-[1.14] mb-6">{article.title}</h1>

        {/* Author + stats */}
        <div className="flex items-center gap-4 pb-6 mb-8 border-b border-primary/10 flex-wrap">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
            {article.author?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-[14px] font-medium text-deep">{article.author?.name}</p>
          </div>
          <div className="flex items-center gap-3 ml-auto text-[12px] text-ink-ghost">
            {article.readTime && <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} menit</span>}
            <span className="flex items-center gap-1"><Eye size={12} /> {article.viewCount}</span>
            {article.publishedAt && <span>{format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: localeId })}</span>}
          </div>
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="font-serif text-[20px] font-light italic text-ink-mid leading-[1.6] border-l-2 border-primary pl-5 mb-10">{article.excerpt}</p>
        )}

        {/* Content */}
        <div className="prose-manara" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-primary/10">
            {article.tags.map((t: any) => (
              <span key={t.tag.id} className="text-[12px] border border-primary/15 px-3 py-1.5 rounded-sm text-ink-mid hover:border-primary/35 transition-colors">
                #{t.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Related */}
        {article.related?.length > 0 && (
          <div className="mt-16 pt-10 border-t border-primary/10">
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-ghost mb-6">Artikel Terkait</p>
            <div className="grid sm:grid-cols-3 gap-5">
              {article.related.map((r: any) => (
                <Link key={r.id} href={`/artikel/${r.slug}`} className="group">
                  <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-primary mb-1.5">{r.mediaType}</p>
                  <p className="font-serif text-[17px] font-light text-deep leading-snug group-hover:text-primary transition-colors">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
