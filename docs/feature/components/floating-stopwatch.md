# FloatingStopwatch

## 목적

랜딩 페이지 스크롤 진행 중에도 신청 마감 카운트다운을 하단에 고정 노출.

## 동작/UI

- `stopwatch-section` 하단을 화면 상단이 지나면 하단 플로팅 타이머를 노출.
- 초기 상태는 숨김이며, 노출 시 아래에서 위로 올라오는 트랜지션(`translateY + opacity`) 적용.
- 기본 고정 위치: 화면 하단 `50px`.
- Footer(`landing-footer`)가 화면에 `20px` 이상 보이기 시작하면 Footer 가시 높이를 계산해 `Footer 상단 + 30px` 위치로 고정.
- 마감 시각/카운트다운 계산은 `StopwatchSection`과 동일한 로직(`app/sections/stopwatch-time.ts`)을 공유.
- 배경은 투명(`rgba(255,255,255,0)`) + `backdrop-blur(10px)`를 사용하고, 테두리는 `primary-200`(`#FE6CA7`) 1px로 노출.
- 플로팅 내부 텍스트/구분자 색상은 `primary-900`으로 통일.
- 반응형 스타일
  - Desktop: `rounded 44px`, `px 34`, `py 20`, `20px` 텍스트
  - Mobile: `rounded 32px`, `px 24`, `py 10`, `14px` 텍스트
