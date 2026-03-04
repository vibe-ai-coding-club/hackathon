/*
  Warnings:

  - Added the required column `github_url` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "projects_team_id_idx";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "demo_url" TEXT,
ADD COLUMN     "github_url" TEXT NOT NULL,
ALTER COLUMN "image_url" DROP NOT NULL;
