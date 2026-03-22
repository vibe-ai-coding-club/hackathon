/*
  Warnings:

  - You are about to drop the `vote_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "vote_sessions";

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_settings" (
    "id" TEXT NOT NULL,
    "max_votes" INTEGER NOT NULL DEFAULT 5,
    "presenting_project_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_member_id_project_id_key" ON "likes"("member_id", "project_id");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_settings" ADD CONSTRAINT "event_settings_presenting_project_id_fkey" FOREIGN KEY ("presenting_project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
