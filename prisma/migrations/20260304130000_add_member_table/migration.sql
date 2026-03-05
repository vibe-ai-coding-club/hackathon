-- 개발 데이터 초기화
DELETE FROM "projects";
DELETE FROM "teams";

-- 이전 실패한 마이그레이션 잔여물 정리
DROP TABLE IF EXISTS "members";

-- DropColumn: members Json
ALTER TABLE "teams" DROP COLUMN IF EXISTS "members";

-- AlterColumn: phone → nullable
ALTER TABLE "teams" ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "is_leader" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_contact_key" ON "members"("contact");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
