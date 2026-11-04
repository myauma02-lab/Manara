export type PublicationKind = "artikel" | "paper" | "journal";

export const PUBLICATION_TOPICS = [
  "Media Studies",
  "Economic Discourse",
  "Politic & Social Discourse",
  "Human Ecology",
  "Law and Public Policy",
] as const;

export interface PublicationCardData {
  id: string;
  kind: PublicationKind;
  label: string;
  year?: number;
  publishedAt?: string;
  title: string;
  author: string;
  topics: string[];
  downloads?: number | null;
  href: string;
}

type PublicationApiItem = {
  id?: string;
  type?: "ARTICLE" | "PAPER" | "JOURNAL";
  slug?: string;
  title?: string;
  publishedAt?: string | null;
  createdAt?: string | null;
  year?: number | null;
  articleSubtype?: string | null;
  paperSubtype?: string | null;
  author?: { name?: string | null } | null;
  authors?: string[] | null;
  topics?: string[] | null;
  downloadCount?: number | null;
};

const TYPE_LABELS: Record<string, string> = {
  OPINION: "Opini",
  ESSAY: "Esai",
  ANALYSIS: "Analisis",
  COMMENTARY: "Commentary",
  POLICY_PAPER: "Policy Paper",
  WORKING_PAPER: "Working Paper",
  POLICY_BRIEF: "Policy Brief",
  WHITE_PAPER: "White Paper",
  RESEARCH_NOTE: "Research Note",
  RESEARCH_REPORT: "Research Report",
};

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map(value => value?.trim()).filter((value): value is string => Boolean(value)))];
}

export function adaptPublication(item: PublicationApiItem): PublicationCardData | null {
  if (!item.id || !item.type || !item.slug || !item.title) return null;

  const kind: PublicationKind = item.type === "ARTICLE"
    ? "artikel"
    : item.type === "PAPER"
      ? "paper"
      : "journal";
  const subtype = kind === "artikel" ? item.articleSubtype : item.paperSubtype;
  const publishedAt = item.publishedAt || undefined;
  const parsedYear = publishedAt ? new Date(publishedAt).getFullYear() : undefined;
  const year = Number.isFinite(parsedYear) ? parsedYear : item.year ?? undefined;
  const topics = uniqueStrings(item.topics || []);

  return {
    id: item.id,
    kind,
    label: kind === "journal" ? "Manara Journal" : TYPE_LABELS[subtype || ""] || (kind === "artikel" ? "Artikel" : "Manara Paper"),
    year,
    publishedAt,
    title: item.title,
    author: uniqueStrings(item.authors?.length ? item.authors : [item.author?.name]).join(", "),
    topics,
    downloads: item.downloadCount,
    href: `/publikasi/${kind === "artikel" ? "artikel" : kind}/${encodeURIComponent(item.slug)}`,
  };
}

export function filterPublications(
  data: PublicationCardData[],
  filters: {
    q: string;
    kind: PublicationKind | "semua";
    topic: string | "semua";
    sort: "baru" | "unduhan";
  }
): PublicationCardData[] {
  const query = filters.q.trim().toLocaleLowerCase("id-ID");
  const selectedTopic = filters.topic.toLocaleLowerCase("id-ID");
  const result = data.filter(item =>
    (filters.kind === "semua" || item.kind === filters.kind) &&
    (filters.topic === "semua" || item.topics.some(topic => topic.trim().toLocaleLowerCase("id-ID") === selectedTopic)) &&
    (!query || `${item.title} ${item.author}`.toLocaleLowerCase("id-ID").includes(query))
  );

  return result.sort((a, b) => {
    if (filters.sort === "unduhan") return (b.downloads ?? 0) - (a.downloads ?? 0);
    const parsedA = a.publishedAt ? Date.parse(a.publishedAt) : Number.NaN;
    const parsedB = b.publishedAt ? Date.parse(b.publishedAt) : Number.NaN;
    const dateA = Number.isFinite(parsedA) ? parsedA : (a.year ? Date.UTC(a.year, 0, 1) : 0);
    const dateB = Number.isFinite(parsedB) ? parsedB : (b.year ? Date.UTC(b.year, 0, 1) : 0);
    return dateB - dateA;
  });
}
