# ParticipationTypeSection

- Source: `app/register/_components/participation-type-section.tsx`
- Role: 참가 유형 (개인/팀) 라디오 선택.
- Props: `form`, `errors`, `update`
- 제목: `FieldLabel as="legend" required` — "참가 유형"
- 옵션:
  - 개인 참여: `INDIVIDUAL`, description "혼자서 참여해요"
  - 팀 참여: `TEAM`, description "단체로 참여해요"
- Layout: Mobile 세로 스택 (`grid-cols-1`), Desktop 가로 2열 (`sm:grid-cols-2`)
