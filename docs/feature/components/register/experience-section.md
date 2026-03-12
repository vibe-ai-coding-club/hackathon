# ExperienceSection

- Source: `app/register/_components/experience-section.tsx`
- Role: 개발 경험 수준 라디오 선택.
- Props: `form`, `errors`, `update`
- 표시 조건: `participationType`이 선택된 경우
- 제목: `FieldLabel as="legend"` — "개발 경험"
- 옵션: 비개발자/입문(`BEGINNER`), 주니어(`JUNIOR`), 시니어(`SENIOR`), 바이브코더(`VIBE_CODER`)
- Layout: Mobile 세로 스택 (`grid-cols-1`), Desktop 가로 4열 (`sm:grid-cols-4`)
