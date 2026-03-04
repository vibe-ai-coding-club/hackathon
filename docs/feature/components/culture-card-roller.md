# CultureCardRoller

## 목적
CultureCard 목록을 무한 롤링 인터랙션으로 제공.

## Props
- `items: CultureItem[]`

## 동작/UI
- `swiper` 기반 `loop + autoplay(delay=0)`로 연속 이동.
- PC: `hover` 동안 autoplay stop.
- Mobile: `touch start` 동안 stop, `touch end/cancel` 시 재시작.
