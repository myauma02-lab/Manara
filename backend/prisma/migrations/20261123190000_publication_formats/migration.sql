CREATE TYPE "PublicationFormat" AS ENUM ('EDITORIAL_NOTE', 'RESEARCH_PAPER', 'PERSPECTIVE', 'POLICY_BRIEF', 'WORKING_PAPER', 'JOURNAL');

ALTER TABLE "publications"
  ADD COLUMN "format" "PublicationFormat" NOT NULL DEFAULT 'RESEARCH_PAPER',
  ADD COLUMN "department" TEXT,
  ADD COLUMN "coverRatio" DOUBLE PRECISION,
  ADD COLUMN "draftData" JSONB,
  ADD COLUMN "imageFocusX" DOUBLE PRECISION,
  ADD COLUMN "imageFocusY" DOUBLE PRECISION,
  ADD COLUMN "attribution" TEXT,
  ADD COLUMN "argumentSummary" TEXT,
  ADD COLUMN "references" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "dataUrl" TEXT,
  ADD COLUMN "attachments" JSONB,
  ADD COLUMN "policyProblem" TEXT,
  ADD COLUMN "decisionMakers" TEXT,
  ADD COLUMN "executiveSummary" TEXT,
  ADD COLUMN "recommendations" JSONB,
  ADD COLUMN "evidence" TEXT,
  ADD COLUMN "policyOptions" TEXT,
  ADD COLUMN "implementationNotes" TEXT,
  ADD COLUMN "seriesNumber" TEXT,
  ADD COLUMN "feedbackUrl" TEXT,
  ADD COLUMN "followUpResearchUrl" TEXT;

UPDATE "publications" SET "format" = CASE
  WHEN "type" = 'JOURNAL' THEN 'JOURNAL'::"PublicationFormat"
  WHEN "type" = 'ARTICLE' THEN 'PERSPECTIVE'::"PublicationFormat"
  WHEN "paperSubtype" = 'POLICY_BRIEF' THEN 'POLICY_BRIEF'::"PublicationFormat"
  WHEN "paperSubtype" = 'WORKING_PAPER' THEN 'WORKING_PAPER'::"PublicationFormat"
  ELSE 'RESEARCH_PAPER'::"PublicationFormat" END;

UPDATE "publications" SET "department" = CASE
  WHEN "topics" && ARRAY['Law and Public Policy']::TEXT[] THEN 'Legal & Regulatory Studies'
  WHEN "topics" && ARRAY['Politic & Social Discourse']::TEXT[] THEN 'Political & Governance Studies'
  WHEN "topics" && ARRAY['Economic Discourse']::TEXT[] THEN 'Economic & Development Studies'
  ELSE NULL END;

CREATE TABLE "publication_versions" (
  "id" TEXT NOT NULL,
  "publicationId" TEXT NOT NULL,
  "number" INTEGER NOT NULL,
  "versionDate" TIMESTAMP(3) NOT NULL,
  "coverImage" TEXT,
  "coverRatio" DOUBLE PRECISION,
  "pdfUrl" TEXT,
  "changeSummary" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isCurrent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "publication_versions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "publication_versions_publicationId_number_key" ON "publication_versions"("publicationId", "number");
CREATE UNIQUE INDEX "publication_versions_one_current" ON "publication_versions"("publicationId") WHERE "isCurrent";
ALTER TABLE "publication_versions" ADD CONSTRAINT "publication_versions_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep existing URLs and identifiers. Versions can be added later when a legacy
-- record has only one of its two required media assets.
INSERT INTO "publication_versions" ("id", "publicationId", "number", "versionDate", "coverImage", "pdfUrl", "isPublished", "isCurrent")
SELECT 'legacy-' || "id", "id", 1, COALESCE("publishedAt", "createdAt"), "coverImage", "pdfUrl", true, true
FROM "publications"
WHERE "format" = 'WORKING_PAPER' AND "status" = 'PUBLISHED' AND "coverImage" IS NOT NULL AND "pdfUrl" IS NOT NULL;
