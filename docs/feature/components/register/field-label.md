# FieldLabel

- Source: `app/_components/register/field-label.tsx`
- Role: 폼 필드 라벨 프리미티브.
- Props:
  - `children`: 라벨 텍스트
  - `htmlFor?`: label 연결
  - `required?`: `*` 표시
  - `size`: `"lg"` (default) | `"sm"`
  - `as`: `"label"` (default) | `"legend"` | `"p"`
  - `className?`
- 스타일:
  - 공통: `text-gray-900`
  - `lg`: Mobile `typo-subtitle5` (16px/24px/600), Desktop `typo-h6` (20px/30px/700), `mb-2`
  - `sm`: `typo-subtitle4 mb-1`
  - required `*`: `text-[#F55959]`, Mobile `typo-subtitle3` (16px/500), Desktop `typo-h6` (20px/700)
