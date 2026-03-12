-- DropIndex
DROP INDEX IF EXISTS "teams_email_key";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "name",
DROP COLUMN "email",
DROP COLUMN "phone";
