import { NextResponse } from "next/server";

type PublicationType = "ARTICLE" | "PAPER" | "JOURNAL";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.manarainstitute.id/api";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.manarainstitute.id").replace(/\/$/, "");
export const dynamic = "force-dynamic";

const canonicalPath: Record<PublicationType, (slug: string) => string> = {
  ARTICLE: slug => `/publikasi/artikel/${encodeURIComponent(slug)}`,
  PAPER: slug => `/publikasi/paper/${encodeURIComponent(slug)}`,
  JOURNAL: slug => `/publikasi/journal/${encodeURIComponent(slug)}`,
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  if (!/^MNR-[A-Z]{2,5}-\d{4,}$/.test(code)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const response = await fetch(
      `${API_URL}/publications/code/${encodeURIComponent(code)}`,
      { cache: "no-store" }
    );
    if (!response.ok) return new NextResponse("Not Found", { status: 404 });

    const payload = await response.json();
    const publication = payload?.data as { type?: PublicationType; slug?: string } | undefined;
    if (!publication?.slug || !publication.type || !canonicalPath[publication.type]) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.redirect(
      new URL(canonicalPath[publication.type](publication.slug), SITE_URL),
      308
    );
  } catch {
    return new NextResponse("Publication lookup unavailable", { status: 502 });
  }
}
