/*
  Warnings:

  - You are about to drop the column `coverPublicId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "coverPublicId",
DROP COLUMN "order",
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "dataUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "milestones" JSONB,
ADD COLUMN     "outputs" TEXT[],
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "relatedPubs" TEXT[],
ADD COLUMN     "reportUrl" TEXT,
ADD COLUMN     "teamMembers" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;
