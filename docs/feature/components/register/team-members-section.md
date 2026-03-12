# TeamMembersSection

- Source: `app/register/_components/team-members-section.tsx`
- Role: 팀원 정보 입력 (팀 참여 시).
- Props: `form`, `errors`, `dupStatus`, `updateMember`, `addMember`, `removeMember`, `checkMemberEmailDuplicate`
- 표시 조건: `participationType === "TEAM"`
- 팀장 카드:
  - 리더 정보를 disabled 상태로 미러링
  - 부제: "팀 대표로 참여해요"
- 팀원 카드:
  - 최대 `MAX_MEMBERS` (3명) 추가 가능
  - 팀원 수 1명 초과 시 삭제 버튼 표시
- 카드 Layout:
  - Desktop: 3열 그리드 (이름/연락처/이메일) — `sm:grid-cols-3`
  - Mobile: 세로 스택
- 팀원별 이메일 중복확인 버튼 포함
- 헤더: `FieldLabel as="legend"` — "팀원 (n/3)" + "팀원 추가" 버튼
