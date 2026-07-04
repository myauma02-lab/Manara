/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `founders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('ARTICLE', 'PAPER', 'JOURNAL');

-- CreateEnum
CREATE TYPE "ArticleSubtype" AS ENUM ('OPINION', 'ESSAY', 'ANALYSIS', 'COMMENTARY', 'OTHER');

-- CreateEnum
CREATE TYPE "PaperSubtype" AS ENUM ('POLICY_PAPER', 'WORKING_PAPER', 'POLICY_BRIEF', 'WHITE_PAPER', 'RESEARCH_NOTE');

-- AlterTable
ALTER TABLE "founders" ADD COLUMN     "institution" TEXT,
ADD COLUMN     "researchInterests" TEXT[],
ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "abstract" TEXT,
    "coverImage" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "articleSubtype" "ArticleSubtype",
    "paperSubtype" "PaperSubtype",
    "authors" TEXT[],
    "keywords" TEXT[],
    "pdfUrl" TEXT,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "institutions" TEXT[],
    "volume" INTEGER,
    "issue" INTEGER,
    "year" INTEGER,
    "doi" TEXT,
    "reviewers" TEXT[],
    "citations" TEXT[],
    "issn" TEXT,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_tags" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "publication_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "publications_slug_key" ON "publications"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "publication_tags_publicationId_tagId_key" ON "publication_tags"("publicationId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "founders_slug_key" ON "founders"("slug");

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_tags" ADD CONSTRAINT "publication_tags_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_tags" ADD CONSTRAINT "publication_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
