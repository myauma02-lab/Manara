import PublicationReadingView, { publicationMetadata } from "@/components/shared/PublicationReadingView";

type PageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return publicationMetadata(slug, "artikel");
}

export default async function PublicationPage({ params }: PageProps) {
  const { slug } = await params;
  return <PublicationReadingView slug={slug} kind="artikel" />;
}
