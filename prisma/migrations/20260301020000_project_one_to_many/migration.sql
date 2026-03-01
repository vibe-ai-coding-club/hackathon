-- DropIndex (1:1 unique 제약 제거 → 1:N 허용)
DROP INDEX "projects_team_id_key";

-- CreateIndex (조회 성능을 위한 인덱스)
CREATE INDEX "projects_team_id_idx" ON "projects"("team_id");
