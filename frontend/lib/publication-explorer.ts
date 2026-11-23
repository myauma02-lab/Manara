export type PublicationKind = "editorial-note" | "research-paper" | "perspective" | "policy-brief" | "working-paper" | "journal";

export const PUBLICATION_DEPARTMENTS = [
  { name: "Legal & Regulatory Studies", topics: ["Constitutional & Institutional Law", "Legislative & Regulatory Studies", "Administrative & Governance Law", "Economic & Business Law", "Law, Society & Human Rights", "Environmental & Natural Resources Law"] },
  { name: "Political & Governance Studies", topics: ["Political Institutions & Democracy", "Public Policy & Governance", "Political Economy", "Electoral & Political Behavior", "Civil Society & Social Movements", "Geopolitics & International Relations"] },
  { name: "Economic & Development Studies", topics: ["Macroeconomics & Monetary Studies", "Fiscal & Public Economics", "Industrial & Structural Transformation", "Development & Inclusive Economics", "Energy & Environmental Economics", "Financial & Investment Studies"] },
] as const;

export const PUBLICATION_TOPICS: string[] = PUBLICATION_DEPARTMENTS.flatMap(item => [...item.topics]);

export interface PublicationCardData {
  id: string;
  kind: PublicationKind;
  department?: string;
  label: string;
  year?: number;
  publishedAt?: string;
  title: string;
  author: string;
  coverImage?: string;
  imageFocusX?: number;
  imageFocusY?: number;
  topics: string[];
  downloads?: number | null;
  href: string;
}

type PublicationApiItem = {
  id?: string;
  type?: "ARTICLE" | "PAPER" | "JOURNAL";
  format?: string | null;
  department?: string | null;
  slug?: string;
  title?: string;
  coverImage?: string | null;
  imageFocusX?: number | null;
  imageFocusY?: number | null;
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

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map(value => value?.trim()).filter((value): value is string => Boolean(value)))];
}

export function adaptPublication(item: PublicationApiItem): PublicationCardData | null {
  if (!item.id || !item.type || !item.slug || !item.title) return null;

  const kind: PublicationKind = item.format === "EDITORIAL_NOTE" ? "editorial-note"
    : item.format === "PERSPECTIVE" || item.type === "ARTICLE" ? "perspective"
    : item.format === "POLICY_BRIEF" || item.paperSubtype === "POLICY_BRIEF" ? "policy-brief"
    : item.format === "WORKING_PAPER" || item.paperSubtype === "WORKING_PAPER" ? "working-paper"
    : item.type === "JOURNAL" ? "journal" : "research-paper";
  const labels: Record<PublicationKind, string> = { "editorial-note": "Editorial Note", "research-paper": "Research Paper", perspective: "Perspective", "policy-brief": "Policy Brief", "working-paper": "Working Paper", journal: "Manara Journal" };
  const publishedAt = item.publishedAt || undefined;
  const parsedYear = publishedAt ? new Date(publishedAt).getFullYear() : undefined;
  const year = Number.isFinite(parsedYear) ? parsedYear : item.year ?? undefined;
  const topics = uniqueStrings(item.topics || []);

  return {
    id: item.id,
    kind,
    department: item.department || undefined,
    label: labels[kind],
    year,
    publishedAt,
    title: item.title,
    author: uniqueStrings(item.authors?.length ? item.authors : [item.author?.name]).join(", "),
    coverImage: item.coverImage || undefined,
    imageFocusX: item.imageFocusX ?? undefined,
    imageFocusY: item.imageFocusY ?? undefined,
    topics,
    downloads: item.downloadCount,
    href: `/publikasi/${item.type === "ARTICLE" ? "artikel" : item.type === "JOURNAL" ? "journal" : "paper"}/${encodeURIComponent(item.slug)}`,
  };
}

export function filterPublications(
  data: PublicationCardData[],
  filters: {
    q: string;
    kind: PublicationKind | "semua";
    department?: string | "semua";
    topic: string | "semua";
    sort: "baru" | "unduhan";
  }
): PublicationCardData[] {
  const query = filters.q.trim().toLocaleLowerCase("id-ID");
  const selectedTopic = filters.topic.toLocaleLowerCase("id-ID");
  const result = data.filter(item =>
    (filters.kind === "semua" || item.kind === filters.kind) &&
    (!filters.department || filters.department === "semua" || item.department === filters.department) &&
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
