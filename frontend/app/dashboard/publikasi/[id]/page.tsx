import PublicationForm from "../_components/PublicationForm";
export default async function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicationForm id={id} basePath="/dashboard/publikasi" />;
}
