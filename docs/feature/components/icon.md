# icon

## 목적

- Figma `Icon` 에셋(`twinkle`, `check`, `delete`, `plus`, `github`, `instagram`, `linkedin`)을 프로젝트에서 일관되게 사용하기 위한 공용 아이콘 컴포넌트.
- `currentColor` 기반으로 색상을 상속받아 텍스트/버튼 색상 시스템과 함께 동작.

## 위치

- 컴포넌트: `app/_components/icon.tsx`
- 원본 SVG 에셋: `public/icons/twinkle.svg`, `public/icons/check.svg`, `public/icons/delete.svg`, `public/icons/plus.svg`, `public/icons/instagram.svg`, `public/icons/linkedin.svg`
- `github`는 컴포넌트 내부 path로 제공한다.

## Props

- `type`: `"twinkle" | "check" | "delete" | "plus" | "Plus" | "github" | "instagram" | "linkedin"` (필수)
- `width`: number (optional, 기본값 `24`)
- `height`: number (optional, 기본값 `24`)
- `className` 및 기타 SVG 속성: optional

## 사용 예시

```tsx
<Icon type="twinkle" width={20} height={20} className="text-primary-400" />
<Icon type="check" className="text-gray-500" />
<Icon type="github" width={16} height={16} className="text-white" />
<Icon type="instagram" width={16} height={16} className="text-white" />
<Icon type="linkedin" width={16} height={16} className="text-white" />
```

## 동작/스타일 규칙

- 기본 좌표계는 `24x24`.
- 아이콘 컬러는 path의 `fill="currentColor"` 또는 `stroke="currentColor"`로 처리.
- 접근성 기본값으로 `aria-hidden="true"`를 사용하며, 필요 시 상위에서 `aria-label` 등을 전달해 덮어쓸 수 있음.
