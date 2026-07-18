/*
  Warnings:

  - You are about to drop the column `portfolioUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `closeDate` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `openDate` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `positions` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the `Interest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "applications" DROP COLUMN "portfolioUrl",
DROP COLUMN "reviewedAt";

-- AlterTable
ALTER TABLE "recruitments" DROP COLUMN "closeDate",
DROP COLUMN "isOpen",
DROP COLUMN "openDate",
DROP COLUMN "positions",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "Interest";

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "interest" TEXT,
    "message" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requirements" TEXT[],
    "slots" INTEGER,
    "recruitmentId" TEXT NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_email_key" ON "waitlist_entries"("email");

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_recruitmentId_fkey" FOREIGN KEY ("recruitmentId") REFERENCES "recruitments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
