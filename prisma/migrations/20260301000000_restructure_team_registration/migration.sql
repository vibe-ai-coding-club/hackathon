-- CreateEnum
CREATE TYPE "ParticipationType" AS ENUM ('INDIVIDUAL', 'TEAM');
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'JUNIOR', 'SENIOR', 'VIBE_CODER');

-- DropIndex
DROP INDEX "teams_name_key";

-- AlterTable: 기존 컬럼 제거
ALTER TABLE "teams" DROP COLUMN "topic",
DROP COLUMN "description";

-- AlterTable: 새 컬럼 추가
ALTER TABLE "teams" ADD COLUMN "email" TEXT NOT NULL,
ADD COLUMN "phone" TEXT NOT NULL,
ADD COLUMN "participation_type" "ParticipationType" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN "team_name" TEXT,
ADD COLUMN "experience_level" "ExperienceLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN "motivation" TEXT;

-- AlterTable: members를 optional로 변경
ALTER TABLE "teams" ALTER COLUMN "members" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teams_email_key" ON "teams"("email");
