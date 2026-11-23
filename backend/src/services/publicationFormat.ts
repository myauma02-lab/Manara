import type { PublicationFormat, PublicationType } from "@prisma/client";
import { cloudinary } from "../middleware/upload";

export const ACTIVE_FORMATS: PublicationFormat[] = [
  "EDITORIAL_NOTE", "RESEARCH_PAPER", "PERSPECTIVE", "POLICY_BRIEF", "WORKING_PAPER",
];

export function inferFormat(type: PublicationType, articleSubtype?: string | null, paperSubtype?: string | null): PublicationFormat {
  if (type === "JOURNAL") return "JOURNAL";
  if (type === "ARTICLE") return "PERSPECTIVE";
  if (paperSubtype === "POLICY_BRIEF") return "POLICY_BRIEF";
  if (paperSubtype === "WORKING_PAPER") return "WORKING_PAPER";
  return "RESEARCH_PAPER";
}

export function typeForFormat(format: PublicationFormat): PublicationType {
  return format === "EDITORIAL_NOTE" || format === "PERSPECTIVE" ? "ARTICLE" : format === "JOURNAL" ? "JOURNAL" : "PAPER";
}

export async function uploadedCoverRatio(file?: Express.Multer.File): Promise<number | undefined> {
  if (!file) return undefined;
  const id = file.filename;
  if (!id) throw new Error("Metadata gambar cover tidak tersedia");
  const asset = await cloudinary.api.resource(id, { resource_type: "image" });
  if (!asset.width || !asset.height) throw new Error("Dimensi cover tidak dapat dibaca");
  return asset.width / asset.height;
}

export function coverRatioValid(format: PublicationFormat, ratio?: number | null): boolean {
  if (ratio == null) return false;
  const target = format === "PERSPECTIVE" ? 4 / 5 : 1 / Math.sqrt(2);
  return Math.abs(ratio - target) <= 0.015;
}

export function publicationValidation(format: PublicationFormat, data: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!String(data.title || "").trim()) errors.title = "Judul wajib diisi";
  if (!String(data.excerpt || "").trim()) errors.excerpt = "Ringkasan kartu wajib diisi";
  if (!Array.isArray(data.topics) || !data.topics.length) errors.topics = "Pilih setidaknya satu topik";
  if (!String(data.department || "").trim()) errors.department = "Departemen wajib diisi";
  const authors = Array.isArray(data.authors) ? data.authors : [];
  if (format === "EDITORIAL_NOTE") {
    if (!String(data.attribution || "").trim()) errors.attribution = "Pilih atribusi redaksi atau editor";
    if (!String(data.content || "").trim()) errors.content = "Isi catatan wajib diisi";
  }
  if (format === "PERSPECTIVE") {
    if (!authors.length) errors.authors = "Penulis wajib diisi";
    if (!String(data.argumentSummary || "").trim()) errors.argumentSummary = "Ringkasan argumen wajib diisi";
    if (!String(data.content || "").trim()) errors.content = "Isi esai wajib diisi";
  }
  if (format === "RESEARCH_PAPER" || format === "WORKING_PAPER") {
    if (!authors.length) errors.authors = "Penulis wajib diisi";
    if (!String(data.abstract || "").trim()) errors.abstract = "Abstrak wajib diisi";
  }
  if (format === "RESEARCH_PAPER") {
    if (!Array.isArray(data.keywords) || !data.keywords.length) errors.keywords = "Kata kunci wajib diisi";
    if (!data.content && !data.pdfUrl) errors.content = "Isi HTML atau PDF wajib tersedia";
  }
  if (format === "POLICY_BRIEF") {
    for (const key of ["policyProblem", "decisionMakers", "executiveSummary", "evidence"])
      if (!String(data[key] || "").trim()) errors[key] = "Kolom ini wajib diisi";
    const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
    if (!recommendations.length || recommendations.some((r: any) => !String(r.action || "").trim() || !String(r.actor || "").trim()))
      errors.recommendations = "Setiap rekomendasi perlu tindakan dan aktor pelaksana";
  }
  if (format === "WORKING_PAPER" && !data.hasCurrentVersion)
    errors.versions = "Terbitkan versi dengan cover dan PDF terlebih dahulu";
  if (["RESEARCH_PAPER", "PERSPECTIVE", "POLICY_BRIEF"].includes(format)) {
    if (!data.coverImage) errors.cover = "Cover wajib diisi";
    else if (!coverRatioValid(format, data.coverRatio)) errors.cover = format === "PERSPECTIVE" ? "Cover harus berproporsi 4:5" : "Cover harus berproporsi A4 potret";
  }
  return errors;
}
