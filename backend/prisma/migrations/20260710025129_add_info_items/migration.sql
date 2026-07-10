-- CreateEnum
CREATE TYPE "InfoType" AS ENUM ('NEWS', 'AWARD', 'MAGAZINE', 'AGENDA');

-- CreateEnum
CREATE TYPE "InfoStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "info_items" (
    "id" TEXT NOT NULL,
    "type" "InfoType" NOT NULL,
    "status" "InfoStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "coverImage" TEXT,
    "fileUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "source" TEXT,
    "externalUrl" TEXT,
    "awardGiver" TEXT,
    "awardYear" INTEGER,
    "awardCategory" TEXT,
    "issueNumber" TEXT,
    "issueYear" INTEGER,
    "eventDate" TIMESTAMP(3),
    "eventEndDate" TIMESTAMP(3),
    "eventLocation" TEXT,
    "eventType" TEXT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "info_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "info_items_slug_key" ON "info_items"("slug");
