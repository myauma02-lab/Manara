"use client";

import { publicationsApi } from "@/lib/api";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  slug: string;
  href: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function PublicationDownloadLink({ slug, href, style, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => { void publicationsApi.download(slug).catch(() => {}); }}
      style={style}
    >
      {children}
    </a>
  );
}
