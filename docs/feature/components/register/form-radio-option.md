# FormRadioOption

- Source: `app/_components/register/form-radio-option.tsx`
- Role: 라디오 선택 옵션 UI 프리미티브.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | 라디오 그룹 이름 |
| `value` | `string?` | — | 라디오 값 |
| `checked` | `boolean` | — | 선택 상태 |
| `onChange` | `ChangeEventHandler` | — | 변경 핸들러 |
| `label` | `ReactNode` | — | 라벨 텍스트 |
| `description` | `ReactNode?` | — | 설명 텍스트 |
| `variant` | `"primary" \| "gray"` | `"primary"` | 선택 시 border 색상 |
| `className` | `string?` | — | 추가 클래스 |

## 스타일 토큰

### 컨테이너
- 공통: `flex items-center gap-3 rounded-lg bg-gray-50 border`
- Padding: Mobile `p-3.5` (14px), Desktop `sm:p-4` (16px)
- Checked (primary): `border-primary-400`
- Checked (gray): `border-gray-300`
- Unchecked: `border-transparent`

### 라벨
- Mobile: `typo-subtitle6` (14px/24px/700), `text-gray-900`
- Desktop: `typo-subtitle5` (16px/24px/600), `text-gray-700`

### 설명
- Mobile: `typo-body3` (14px/24px/400), `text-gray-500`
- Desktop: `typo-body1` (16px/26px/400), `text-gray-500`
