import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PublicationIdentity from "@/components/shared/PublicationIdentity";
import PublicationDownloadLink from "@/components/shared/PublicationDownloadLink";
import { serverPublicationsApi } from "@/lib/server-api";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import styles from "./PublicationReadingView.module.css";

type Kind = "artikel" | "paper" | "journal";
type Version = { id: string; number: number; versionDate: string; coverImage?: string; pdfUrl?: string; changeSummary?: string; isCurrent: boolean };
const LABELS: Record<string, string> = { EDITORIAL_NOTE: "Editorial Note", RESEARCH_PAPER: "Research Paper", PERSPECTIVE: "Perspective", POLICY_BRIEF: "Policy Brief", WORKING_PAPER: "Working Paper", JOURNAL: "Manara Journal" };
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.manarainstitute.id").replace(/\/$/, "");

function formatOf(pub: any): string {
  if (pub.format) return pub.format;
  if (pub.type === "ARTICLE") return "PERSPECTIVE";
  if (pub.paperSubtype === "POLICY_BRIEF") return "POLICY_BRIEF";
  if (pub.paperSubtype === "WORKING_PAPER") return "WORKING_PAPER";
  return pub.type === "JOURNAL" ? "JOURNAL" : "RESEARCH_PAPER";
}

export async function publicationMetadata(slug: string, kind: Kind): Promise<Metadata> {
  const pub = await serverPublicationsApi.detail(slug);
  const canonical = `${SITE_URL}/publikasi/${kind}/${encodeURIComponent(slug)}`;
  return { title: pub?.title ? `${pub.title} | Manara` : "Publikasi Manara", description: pub?.excerpt || pub?.abstract || "Publikasi Manara Institute", alternates: { canonical }, other: pub?.publicationCode ? { publicationCode: pub.publicationCode } : undefined };
}

export default async function PublicationReadingView({ slug, kind }: { slug: string; kind: Kind }) {
  const pub = await serverPublicationsApi.detail(slug);
  const canonicalPath = `/publikasi/${kind}/${encodeURIComponent(slug)}`;
  if (!pub || (kind === "artikel" && pub.type !== "ARTICLE") || (kind === "paper" && pub.type !== "PAPER") || (kind === "journal" && pub.type !== "JOURNAL")) notFound();
  const format = formatOf(pub);
  const versions = (pub.versions || []) as Version[];
  const latest = versions.find(version => version.isCurrent) || versions[0];
  const authors = pub.authors?.length ? pub.authors.join(", ") : pub.author?.name;
  const cover = format === "WORKING_PAPER" ? latest?.coverImage || pub.coverImage : pub.coverImage;
  const pdf = format === "WORKING_PAPER" ? latest?.pdfUrl || pub.pdfUrl : pub.pdfUrl;
  const date = pub.publishedAt ? new Date(pub.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";
  const html = pub.content ? sanitizeRichText(pub.content) : "";
  const recommendations = Array.isArray(pub.recommendations) ? pub.recommendations as { action: string; actor: string }[] : [];
  const attachments = Array.isArray(pub.attachments) ? pub.attachments as string[] : [];
  return <main><Navbar /><article className={styles.container}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/publikasi">Publikasi</Link><span>→</span><span>{LABELS[format] || "Publikasi"}</span></nav>
    <div className={`${styles.header} ${["PERSPECTIVE", "RESEARCH_PAPER"].includes(format) && cover ? styles.split : ""}`}>
      <div><p className={styles.eyebrow}>{LABELS[format]} {pub.department ? `· ${pub.department}` : ""}</p>
        <h1>{pub.title}</h1><PublicationIdentity code={pub.publicationCode} canonicalPath={canonicalPath} />
        {format === "EDITORIAL_NOTE" ? <p className={styles.byline}>{pub.attribution || "Redaksi Manara Institute"} · {date}</p> : <p className={styles.byline}>
          {pub.author?.avatar && (!pub.authors?.length || pub.authors.includes(pub.author.name)) && <img src={pub.author.avatar} alt="" width="28" height="28" style={{ borderRadius: "50%", objectFit: "cover", verticalAlign: "middle", marginRight: 8 }} />}
          {authors} {date && `· ${date}`}</p>}
        {format === "PERSPECTIVE" && pub.authorAffiliation && <p className={styles.authorAffiliation}>{pub.authorAffiliation}</p>}
        {format === "PERSPECTIVE" && pub.excerpt && <p className={styles.lead}>{pub.excerpt}</p>}
        {format === "PERSPECTIVE" && pub.topics?.length > 0 && <p className={styles.perspectiveMeta}>{pub.topics.join(" · ")}</p>}
        {format === "RESEARCH_PAPER" && pub.abstract && <p className={styles.lead}>{pub.abstract}</p>}
      </div>
      {["PERSPECTIVE", "RESEARCH_PAPER"].includes(format) && cover && <img className={styles.cover} src={cover} alt={`Sampul ${pub.title}`} />}
    </div>
    {!["PERSPECTIVE", "RESEARCH_PAPER"].includes(format) && cover && <img className={styles.smallCover} src={cover} alt={`Sampul ${pub.title}`} />}
    {format === "PERSPECTIVE" && pub.imageCredit && <p className={styles.imageCredit}>{pub.imageCredit}</p>}
    {format === "WORKING_PAPER" && <><p className={styles.lead}>Versi {latest?.number || 1} · {latest?.versionDate ? new Date(latest.versionDate).toLocaleDateString("id-ID") : date}</p><p className={styles.lead}>{pub.abstract}</p></>}
    {format === "POLICY_BRIEF" && <><section><h2>Ringkasan eksekutif</h2><p>{pub.executiveSummary}</p></section>
      {recommendations.length > 0 && <section><h2>Rekomendasi utama</h2><ol>{recommendations.map((item, index) => <li key={index}><strong>{item.action}</strong><span> · Pelaksana: {item.actor}</span></li>)}</ol></section>}
      {pub.policyProblem && <section><h2>Masalah kebijakan</h2><p>{pub.policyProblem}</p></section>}
      {pub.decisionMakers && <section><h2>Sasaran pengambil keputusan</h2><p>{pub.decisionMakers}</p></section>}
      {pub.evidence && <section><h2>Dasar bukti</h2><p>{pub.evidence}</p></section>}
      {pub.policyOptions && <section><h2>Opsi kebijakan</h2><p>{pub.policyOptions}</p></section>}
      {pub.implementationNotes && <section><h2>Catatan implementasi</h2><p>{pub.implementationNotes}</p></section>}</>}
    {format === "RESEARCH_PAPER" && pub.abstract && !cover && <section><h2>Abstrak</h2><p>{pub.abstract}</p></section>}
    {pdf && <PublicationDownloadLink slug={pub.slug} href={pdf} style={{ display: "inline-block", margin: "24px 0", background: "#266c87", color: "white", padding: "13px 22px", textDecoration: "none", borderRadius: 4 }}>
      {format === "PERSPECTIVE" ? "Unduh Perspective" : format === "POLICY_BRIEF" ? "Unduh brief" : format === "WORKING_PAPER" ? "Unduh versi terkini" : "Unduh PDF"}
    </PublicationDownloadLink>}
    {html && <section className={styles.content}><h2>{format === "RESEARCH_PAPER" ? "Baca naskah" : format === "EDITORIAL_NOTE" ? "Catatan redaksi" : "Isi tulisan"}</h2><div dangerouslySetInnerHTML={{ __html: html }} /></section>}
    {format === "EDITORIAL_NOTE" && pub.dataUrl && <p><a href={pub.dataUrl}>Baca publikasi terkait</a></p>}
    {format === "WORKING_PAPER" && versions.length > 0 && <section><h2>Riwayat versi</h2><ol>{versions.map(version => <li key={version.id}>Versi {version.number} · {new Date(version.versionDate).toLocaleDateString("id-ID")}
      {version.changeSummary && <p>{version.changeSummary}</p>}{version.pdfUrl && <a href={version.pdfUrl} target="_blank" rel="noopener noreferrer">Unduh PDF versi {version.number}</a>}</li>)}</ol></section>}
    {format === "WORKING_PAPER" && pub.feedbackUrl && <p><a href={pub.feedbackUrl}>Kirim masukan</a></p>}
    {format === "WORKING_PAPER" && pub.followUpResearchUrl && <p><a href={pub.followUpResearchUrl}>Baca Research Paper lanjutan</a></p>}
    {format === "RESEARCH_PAPER" && <>{pub.citations?.length > 0 && <section><h2>Sitasi</h2><ul>{pub.citations.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul></section>}
      {pub.dataUrl && <p><a href={pub.dataUrl}>Akses data penelitian</a></p>}
      {attachments.length > 0 && <section><h2>Lampiran</h2><ul>{attachments.map((url, index) => <li key={url}><a href={url}>Lampiran {index + 1}</a></li>)}</ul></section>}</>}
    {format === "PERSPECTIVE" && pub.references?.length > 0 && <section><h2>Referensi</h2><ul>{pub.references.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul></section>}
  </article><Footer /></main>;
}
