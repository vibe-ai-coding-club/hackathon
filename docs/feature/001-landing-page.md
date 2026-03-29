# 001 - Landing Page

## 목적

딸깍톤 행사 소개, 일정 안내, 문화/운영 정보 전달, 참가 전환을 위한 메인 랜딩 페이지 제공.

## 라우트

- `/`

## 반응형 기준

- Mobile: `<= 767px`
- Desktop: `>= 768px`

## 섹션 구성 (렌더 순서)

1. Hero
2. Stopwatch
3. About
4. Schedule
5. Culture
6. Info
7. Sponsor
8. Staffs
9. Footer

## 상세 동작 명세

### 1) Hero

- 메인 타이틀/서브타이틀/CTA 노출.
- CTA 버튼은 idle/도망 상태 모두 `gray-100` 배경, `gray-850` 텍스트를 사용하고 idle hover 시 `gray-200`으로 변경.
- CTA는 데스크탑/모바일 분기 게이미피케이션 미션 완료 후 `/register`로 이동.
- 공통 플로우
  - 게임 시작 시 원래 버튼 자리 placeholder 노출(opacity ease-out).
  - placeholder 문구는 `Mission: 버튼을 제자리로 돌려놓아라!`를 사용.
  - 도망 버튼을 드래그해 원래 자리 placeholder에 drop하면 성공.
  - drop 영역 겹침 시 placeholder 테두리/텍스트를 동일한 파란 강조색으로 변경.
  - drop 성공 순간 placeholder는 즉시 숨기고, 도망 버튼 텍스트는 투명 처리해 버튼 높이는 유지.
  - 성공 시 인터랙션/스크롤만 차단하는 투명 오버레이 적용 후 버튼 복귀 애니메이션, 같은 버튼 텍스트가 `미션 성공`으로 전환되며 좌측 check 아이콘과 `10px` 간격으로 표시됨.
  - `미션 성공` 상태에서는 `canvas-confetti` 기반의 `fireworks + side cannon` 빵빠레를 재생하고 2초 후 페이지 이동.
- Desktop(`>=768px`): hover 트리거 기반 랜덤 슬라이딩 회피(Hero 전체 영역, 최소 여백 제외), 시작 후 5초 동안 점진 감속, placeholder 문구는 개행 없이 한 줄 유지.
- Mobile(`<=767px`): first press 트리거 기반 텔레포트 회피(0.1초 시작, 3회마다 1.5배 간격 증가).
- 배경 이미지는 미확정 상태이며 현재 플레이스홀더 배경 사용.
- Hero 섹션 높이는 `100svh`를 기본으로 하되 최소 높이(Mobile `640px`, Desktop `900px`)를 보장.
- Hero 콘텐츠(타이틀/서브타이틀/CTA)는 섹션 내 세로 중앙 정렬.
- Mobile 타이틀은 `TTALKKAK` / `THON` 2줄 개행으로 노출.

### 2) Stopwatch

- 마감 시각(`2026-03-27T23:59:59+09:00`) 기준 남은 시간(일/시/분/초) 1초 주기 갱신.
- 마감 후에는 마감 문구 노출.
- 랜딩 본문 `StopwatchSection`이 화면 위로 지나간 뒤부터 하단 `FloatingStopwatch` 노출.
- `FloatingStopwatch` 기본 위치는 화면 하단 50px 고정.
- Footer가 20px 이상 보이면 Footer 상단 기준 30px 위로 위치를 올려 sticky처럼 보이도록 동작.

### 3) About

- 행사 소개 카드 3개 노출.
- 카드: 이미지 영역 + 타이틀 + 설명.

### 4) Schedule

- 타임테이블 데이터를 객체 배열로 관리.
- `Timetable` 컴포넌트가 데이터를 `TimetableRow`로 펼쳐 렌더링.
- 모바일(`<=767px`)에서는 각 타임테이블 행을 `시간(좌) + 행사명(우)` 가로 배치로 노출.
- 데스크탑(`>=768px`)에서는 각 타임테이블 행을 `행사명(상) + 시간(하)` 세로 배치로 노출.
- CTA 클릭 시 `/register` 이동.

### 5) Culture

- Culture 카드 배열을 무한 롤링으로 노출.
- CSS keyframes 기반 커스텀 롤러로 구현(카드 목록 2세트를 이어붙여 무한 이동).
- 롤링은 `linear` 타이밍으로 카드 경계 구간에서도 동일 속도 유지.
- PC: hover 동안 롤링 정지.
- Mobile: press(touch hold) 동안 롤링 정지.

### 6) Info

- `{ label: string; content: string[] }[]` 형태의 탭 데이터 사용.
- 탭 라벨 클릭 시 내용 전환.
- 각 내용은 `InfoCard`로 인덱스와 함께 렌더링.

### 7) Sponsor

- 후원 안내 문구/로고 영역/문의 버튼 제공.
- Sponsor 제목은 chip 없이 텍스트 헤딩만 노출.
- 후원 카드 3개는 모바일/데스크탑 모두 한 줄 3열 고정 배치.
- 각 카드는 텍스트 없이 회색 직사각형 목업으로 렌더링.

### 8) Staffs

- 운영진 목록을 `StaffItem[]` 데이터로 관리한다.
- 각 카드에는 프로필 이미지, 닉네임, 직무, 한줄평, GitHub/LinkedIn 링크를 포함한다.
- `githubUrl`, `linkedinUrl`은 optional이며, 값이 없는 아이콘은 카드에서 노출하지 않는다.
- 프로필 이미지는 큰 원형 썸네일로 노출하고, 이미지가 없으면 이니셜 플레이스홀더를 사용한다.
- GitHub/LinkedIn 아이콘은 카드 우측 상단에 배치한다.
- `StaffRoller`가 전체 목록을 반으로 나눠 2줄 마퀴로 렌더링한다. 홀수 개일 경우 윗줄이 1개 더 가진다.
- 윗줄은 왼쪽, 아랫줄은 오른쪽 방향으로 무한 롤링한다.
- 두 줄 모두 화면 전체 가로폭(`w-screen`)을 채우는 풀블리드 레이아웃으로 노출한다.
- 핑크 영역 내부 하단에도 여백을 둬 마지막 롤링 줄이 섹션 끝선에 바로 붙지 않게 한다.
- Footer 및 `FloatingStopwatch`와 겹치지 않도록 섹션 하단에 white 안전 여백을 둔다.
- PC: hover 동안 전체 롤링 정지.
- Mobile: press(touch hold) 동안 전체 롤링 정지.

### 9) Footer

- 소셜 링크(Instagram, LinkedIn), 운영 주체 텍스트, 문의 이메일 노출.
- 소셜 링크는 각 텍스트 왼쪽에 브랜드 아이콘(Instagram/LinkedIn)을 포함한다.

## 공통 레이아웃/내비게이션

- 상단 고정 `Navigation` 사용.
- 랜딩 footer는 페이지 내 마지막 섹션(`FooterSection`)으로 렌더링.

## 관련 구현 파일

- `app/page.tsx`
- `app/sections/*.tsx`
- `app/sections/landing-data.ts`
- `app/_components/landing/*.tsx`
- `app/_components/navigation.tsx`
- `app/_components/section-title.tsx`

## 변경 이력 규칙

- 랜딩페이지 요구사항 변경 시 본 문서(`001-landing-page.md`)를 갱신.
- 기존 랜딩 기능 변경은 새 번호 파일 생성 없이 본 파일을 수정.
