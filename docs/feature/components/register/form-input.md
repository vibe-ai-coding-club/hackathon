# FormInput

- Source: `app/_components/register/form-input.tsx`
- Role: 텍스트 입력 UI 프리미티브.

## Props

- HTML `<input>` 속성 전체 + 아래 커스텀 Props.

| Prop          | Type                   | Default     | Description                            |
| ------------- | ---------------------- | ----------- | -------------------------------------- |
| `error`       | `string?`              | —           | 에러 메시지 (하단 표시, 우선순위 높음) |
| `description` | `string?`              | —           | 설명 텍스트 (error 없을 때 하단 표시)  |
| `variant`     | `"default" \| "white"` | `"default"` | 배경색 변형                            |

## 스타일 토큰

### 레이아웃

- `w-full rounded-lg p-4` (16px), `gap-1` (4px)
- Mobile: `typo-body2` (15px/25px/400)
- Desktop: `typo-body1` (16px/26px/400)
- `border transition-colors outline-none`

### Placeholder

- Mobile: `typo-body2 text-gray-500`
- Desktop: `typo-body1 text-gray-500`

### 상태

- Default: `border-transparent bg-gray-50`
- Focused: `border-gray-500 bg-gray-50`
- Error: `border-[#F55959] bg-gray-50`

### Variant

- `default`: `bg-gray-50`
- `white`: `bg-white`

### 하단 메시지 (error / description)

- 공통: `typo-body1 mt-1` (PC/Mobile 동일)
- Error: `text-[#F55959]` — error 우선 표시
- Description: `text-gray-500` — error 없을 때 표시
