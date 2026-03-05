# HeroSection

## 목적
랜딩 첫 화면에서 이벤트 핵심 메시지와 신청 CTA를 노출.

## 동작/UI
- 구성: 타이틀, 서브타이틀, CTA 버튼.
- CTA는 게이미피케이션 미션 완료 시 `/register`로 이동.
- 공통 미션 플로우
  - 게임 시작 시 원래 CTA 위치에 placeholder를 `opacity + ease-out` 전환으로 노출.
  - placeholder 문구는 `Mission: 버튼을 제자리로 돌려놓아라!`를 사용.
  - 도망다니는 CTA 버튼은 드래그 가능.
  - 드래그 중 버튼이 placeholder와 겹치기 시작하면 placeholder의 테두리/텍스트를 동일한 파란 계열 색상으로 변경해 drop 가능 상태를 안내.
  - drop 성공 순간 placeholder는 즉시 숨기고, 도망 버튼 텍스트는 투명 처리해 버튼 높이는 유지.
  - 상태 전환(`지금 신청하기` ↔ `미션 성공`) 시 버튼 높이는 고정되어 점프가 발생하지 않아야 함.
  - placeholder에 drop 성공 시 화면 인터랙션/스크롤만 막는 투명 오버레이를 노출(시각 변화 없음).
  - 도망 버튼이 원래 위치로 부드럽게 복귀한 뒤 같은 버튼 내부 텍스트가 `미션 성공`으로 바뀌고, 텍스트 좌측에 check 아이콘을 `10px` gap으로 노출.
  - `미션 성공` 상태에서 `canvas-confetti` 기반의 `fireworks + side cannon` 빵빠레를 재생한 뒤 2초 후 `/register`로 이동.
- Desktop(`>=768px`)
  - idle 상태에서 CTA hover 시 게임 시작.
  - 도망 버튼은 Hero 전체 영역(상하좌우 최소 여백 제외) 내에서 랜덤 슬라이딩하며 회피.
  - 시작 후 5초까지 회피 속도가 점점 느려지며, 이후에는 잡기 쉬운 상태(회피 중단/저빈도)로 전환.
  - placeholder 문구는 개행 없이 한 줄로 표시.
- Mobile(`<=767px`)
  - idle 상태에서 CTA first press 시 게임 시작.
  - 도망 버튼은 빠르게 opacity를 낮춘 뒤 랜덤 위치에서 다시 나타나는 텔레포트 방식으로 이동.
  - 숨었다 나타나는 간격은 시작 0.1초, 3회 이동마다 1.5배 증가.
- 배경 이미지는 미확정으로 현재 플레이스홀더 배경 사용.
- Hero 섹션 높이 정책
  - 기본: `100svh` (뷰포트 높이를 꽉 채움)
  - 최소 높이: Mobile `640px`, Desktop `900px`
  - 화면 높이가 최소 높이보다 작아도 콘텐츠가 너무 눌리지 않도록 최소 높이 유지
  - Hero 내부 콘텐츠(타이틀/서브타이틀/CTA)는 섹션 내 세로 중앙 정렬.
- 타이틀 줄바꿈 정책
  - Mobile: `TTALKKAK` / `THON` 2줄 개행으로 노출.
  - Desktop: `TTALKKAKTHON` 1줄 노출.
- 반응형 기준
  - Mobile: `pt-120 / pb-80`
  - Desktop: `pt-170 / pb-130`
