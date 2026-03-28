-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "admin_memo" TEXT,
ADD COLUMN     "is_finals" BOOLEAN NOT NULL DEFAULT false;
