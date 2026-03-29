-- AlterTable
ALTER TABLE "archived_projects" ADD COLUMN     "admin_memo" TEXT,
ADD COLUMN     "is_finals" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prompt_result" TEXT;
