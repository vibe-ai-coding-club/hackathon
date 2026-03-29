-- CreateTable
CREATE TABLE "archived_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "features" TEXT,
    "tools" TEXT,
    "github_url" TEXT,
    "demo_url" TEXT,
    "video_url" TEXT,
    "image_url" TEXT,
    "link_url" TEXT,
    "prompt_feedback" TEXT,
    "prompt_score" INTEGER,
    "cat_feedback" TEXT,
    "cat_score" INTEGER,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "team_name" TEXT,
    "motivation" TEXT,
    "recruitment_note" TEXT,
    "experience_level" TEXT,
    "members" JSONB,
    "original_project_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archived_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "archived_projects_original_project_id_key" ON "archived_projects"("original_project_id");
