-- Sequences are deliberately independent from publication rows. Deleting a
-- publication therefore never makes its identifier available again.
CREATE SEQUENCE "publication_code_seq_com" START WITH 1;
CREATE SEQUENCE "publication_code_seq_rp" START WITH 1;
CREATE SEQUENCE "publication_code_seq_pb" START WITH 1;
CREATE SEQUENCE "publication_code_seq_wp" START WITH 1;
CREATE SEQUENCE "publication_code_seq_rr" START WITH 1;
CREATE SEQUENCE "publication_code_seq_art" START WITH 1;
CREATE SEQUENCE "publication_code_seq_wht" START WITH 1;
CREATE SEQUENCE "publication_code_seq_rn" START WITH 1;
CREATE SEQUENCE "publication_code_seq_jrn" START WITH 1;

ALTER TABLE "publications" ADD COLUMN "publicationCode" TEXT;

-- Backfill all existing records with stable family-specific codes. The generic
-- ART/WHT/RN/JRN families preserve coverage for existing CMS types outside the
-- five named institutional publication families.
WITH categorized AS (
  SELECT
    "id",
    CASE
      WHEN "type" = 'ARTICLE' AND "articleSubtype" = 'COMMENTARY' THEN 'COM'
      WHEN "type" = 'ARTICLE' THEN 'ART'
      WHEN "type" = 'JOURNAL' THEN 'JRN'
      WHEN "type" = 'PAPER' AND "paperSubtype" = 'POLICY_BRIEF' THEN 'PB'
      WHEN "type" = 'PAPER' AND "paperSubtype" = 'WORKING_PAPER' THEN 'WP'
      WHEN "type" = 'PAPER' AND "paperSubtype" = 'RESEARCH_REPORT' THEN 'RR'
      WHEN "type" = 'PAPER' AND "paperSubtype" = 'WHITE_PAPER' THEN 'WHT'
      WHEN "type" = 'PAPER' AND "paperSubtype" = 'RESEARCH_NOTE' THEN 'RN'
      ELSE 'RP'
    END AS family,
    "createdAt",
    ROW_NUMBER() OVER (
      PARTITION BY CASE
        WHEN "type" = 'ARTICLE' AND "articleSubtype" = 'COMMENTARY' THEN 'COM'
        WHEN "type" = 'ARTICLE' THEN 'ART'
        WHEN "type" = 'JOURNAL' THEN 'JRN'
        WHEN "type" = 'PAPER' AND "paperSubtype" = 'POLICY_BRIEF' THEN 'PB'
        WHEN "type" = 'PAPER' AND "paperSubtype" = 'WORKING_PAPER' THEN 'WP'
        WHEN "type" = 'PAPER' AND "paperSubtype" = 'RESEARCH_REPORT' THEN 'RR'
        WHEN "type" = 'PAPER' AND "paperSubtype" = 'WHITE_PAPER' THEN 'WHT'
        WHEN "type" = 'PAPER' AND "paperSubtype" = 'RESEARCH_NOTE' THEN 'RN'
        ELSE 'RP'
      END
      ORDER BY "createdAt", "id"
    ) AS serial
  FROM "publications"
), assigned AS (
  SELECT "id", 'MNR-' || family || '-' || LPAD(serial::text, 4, '0') AS code
  FROM categorized
)
UPDATE "publications" AS publication
SET "publicationCode" = assigned.code
FROM assigned
WHERE publication."id" = assigned."id";

-- Resume each sequence after the highest number assigned during backfill.
SELECT setval('publication_code_seq_com', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'COM';
SELECT setval('publication_code_seq_rp', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'RP';
SELECT setval('publication_code_seq_pb', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'PB';
SELECT setval('publication_code_seq_wp', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'WP';
SELECT setval('publication_code_seq_rr', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'RR';
SELECT setval('publication_code_seq_art', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'ART';
SELECT setval('publication_code_seq_wht', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'WHT';
SELECT setval('publication_code_seq_rn', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'RN';
SELECT setval('publication_code_seq_jrn', COALESCE(MAX(split_part("publicationCode", '-', 3)::bigint), 1), COUNT(*) > 0) FROM "publications" WHERE split_part("publicationCode", '-', 2) = 'JRN';

ALTER TABLE "publications" ALTER COLUMN "publicationCode" SET NOT NULL;
CREATE UNIQUE INDEX "publications_publicationCode_key" ON "publications"("publicationCode");
