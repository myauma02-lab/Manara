import PublicationForm from "../_components/PublicationForm";
export default async function NewPublicationPage({ searchParams }: { searchParams: Promise<{ format?: string }> }) {
  const { format } = await searchParams;
  const allowed = ["EDITORIAL_NOTE", "RESEARCH_PAPER", "PERSPECTIVE", "POLICY_BRIEF", "WORKING_PAPER"] as const;
  return <PublicationForm basePath="/dashboard/publikasi" initialFormat={allowed.find(item => item === format)} />;
}
