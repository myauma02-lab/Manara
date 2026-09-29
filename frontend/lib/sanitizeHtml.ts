import DOMPurify from "isomorphic-dompurify";

const RICH_TEXT_TAGS = [
  "a", "blockquote", "br", "code", "em", "figcaption", "figure", "h1", "h2", "h3", "h4",
  "hr", "img", "li", "ol", "p", "pre", "s", "strong", "table", "tbody", "td", "th",
  "thead", "tr", "u", "ul",
];

const RICH_TEXT_ATTRIBUTES = ["alt", "height", "href", "rel", "src", "target", "title", "width"];

export function sanitizeRichText(html: string | null | undefined): string {
  return DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: RICH_TEXT_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ATTRIBUTES,
    FORBID_TAGS: ["form", "iframe", "object", "script", "style", "svg", "video", "audio"],
    FORBID_ATTR: ["style"],
  });
}
