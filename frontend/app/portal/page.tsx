import PortalLogin from "@/components/auth/PortalLogin";

export const metadata = {
  title: "Portal Manara",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return <PortalLogin />;
}
