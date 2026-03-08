-- DropIndex
DROP INDEX "members_contact_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "contact",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "has_deposited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refund_account" TEXT NOT NULL,
ADD COLUMN     "refund_account_holder" TEXT NOT NULL,
ADD COLUMN     "refund_bank" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_sessions" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "max_votes" INTEGER NOT NULL DEFAULT 5,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vote_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_member_id_project_id_key" ON "votes"("member_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
