# Chip

- Source: `app/_components/chip.tsx`
- Role: 단일 텍스트 라벨을 표시하는 공통 칩 UI 제공.
- Props:
  - `label?: string` (default: `"Chip"`)
  - `className?: string`
  - `HTMLAttributes<HTMLDivElement>` 전반 지원 (`onClick`, `id`, `aria-*` 등)
- Responsive Rule:
  - 모바일(`<= 767px`): `px 18px`, `py 4px`, `typo-body3`(14px/400)
  - 데스크톱(`>= 768px`): `px 26px`, `py 8px`, `typo-subtitle3`(16px/500)
- Style:
  - 배경: `#FDF9D5`
  - 텍스트: `#FFBC03`
  - 모서리: `38px`
