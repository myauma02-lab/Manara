"use client";

import { usePathname } from "next/navigation";
import AIChatFloat from "@/components/shared/AIChatFloat";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";

export default function SiteWidgets() {
  const pathname = usePathname();
  const isInternalPage = ["/portal", "/login", "/admin", "/dashboard"].some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );

  if (isInternalPage) return null;

  return (
    <>
      <AIChatFloat />
      <WhatsAppFloat />
    </>
  );
}
