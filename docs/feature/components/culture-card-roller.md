# CultureCardRoller

## 목적
CultureCard 목록을 무한 롤링 인터랙션으로 제공.

## Props
- `items: CultureItem[]`

## 동작/UI
- CSS keyframes 기반 무한 롤링으로 연속 이동(중복 렌더링된 카드 행 2개를 선형 이동).
- `animation-timing-function: linear`로 구간별 감속/가속 없이 동일 속도로 이동.
- PC: `hover` 동안 애니메이션 일시정지.
- Mobile: `touch start` 동안 일시정지, `touch end/cancel` 시 재시작.
