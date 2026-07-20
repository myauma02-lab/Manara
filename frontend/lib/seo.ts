import type { Metadata } from "next";

const BASE_URL = "https://manara.my.id";
const SITE_NAME = "Manara";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Buat metadata Next.js dari opsi yang diberikan
 */
export function buildMetadata(opts: SeoOptions): Metadata {
  const {
    title,
    description,
    path = "",
    image = DEFAULT_OG_IMAGE,
    type = "website",
    publishedAt,
    authors = [],
    keywords = [],
    noIndex = false,
  } = opts;

  const url = `${BASE_URL}${path}`;
  const ogImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    title,
    description,
    keywords: [
      "Manara",
      "kolektif intelektual",
      "Jawa Timur",
      ...keywords,
    ],

    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: "id_ID",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime: publishedAt,
        authors,
      }),
    },

    twitter: {
      card: "summary_large_image",
      site: "@manara_id",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },

    alternates: {
      canonical: url,
    },

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Potong teks untuk meta description (max 160 karakter)
 */
export function truncateDescription(
  text: string,
  maxLength = 160
): string {
  // Strip HTML tags kalau ada
  const stripped = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength - 3) + "...";
}

/**
 * Generate JSON-LD untuk Organization (dipakai di homepage)
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Manara",
    alternateName: "Manara Kolektif Intelektual",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Kolektif intelektual dan media kreatif berbasis Jawa Timur. Shaping ideas for the public sphere.",
    foundingDate: "2024",
    foundingLocation: {
      "@type": "Place",
      name: "Surabaya, Jawa Timur, Indonesia",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "manararesearch@gmail.com",
      contactType: "customer service",
      availableLanguage: "Indonesian",
    },
    sameAs: [
      "https://instagram.com/manara.id",
      // tambah social media lain
    ],
  };
}

/**
 * Generate JSON-LD untuk Artikel
 */
export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image || DEFAULT_OG_IMAGE,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: article.authorName
      ? {
          "@type": "Person",
          name: article.authorName,
        }
      : {
          "@type": "Organization",
          name: "Manara",
        },
    publisher: {
      "@type": "Organization",
      name: "Manara",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    keywords: article.keywords?.join(", "),
    inLanguage: "id-ID",
    isAccessibleForFree: true,
  };
}

/**
 * Generate JSON-LD untuk ScholarlyArticle (Paper/Journal)
 */
export function scholarlyArticleJsonLd(pub: {
  title: string;
  abstract?: string;
  url: string;
  authors?: string[];
  publishedAt?: string;
  keywords?: string[];
  doi?: string;
  volume?: string;
  issue?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    description: pub.abstract,
    url: pub.url,
    datePublished: pub.publishedAt,
    author: pub.authors?.map(name => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: "Manara",
      url: BASE_URL,
    },
    keywords: pub.keywords?.join(", "),
    identifier: pub.doi ? { "@type": "PropertyValue", propertyID: "DOI", value: pub.doi } : undefined,
    isAccessibleForFree: true,
    inLanguage: "id-ID",
  };
}

/**
 * JSON-LD Breadcrumb
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * JSON-LD untuk Event (Agenda)
 */
export function eventJsonLd(event: {
  name: string;
  description?: string;
  url: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    url: event.url,
    startDate: event.startDate,
    endDate: event.endDate,
    image: event.image || DEFAULT_OG_IMAGE,
    location: event.location
      ? { "@type": "Place", name: event.location }
      : { "@type": "VirtualLocation", url: BASE_URL },
    organizer: {
      "@type": "Organization",
      name: "Manara",
      url: BASE_URL,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  };
}

/**
 * JSON-LD untuk FAQ
 */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}