# InfoTab

## 목적
라벨 탭 전환과 현재 탭의 안내 목록 렌더링.

## Props
- `tabs: { label: string; content: string[] }[]`

## 동작/UI
- 첫 탭을 기본 활성 상태로 렌더.
- label 버튼 클릭 시 활성 탭 전환.
- 활성 탭 하단에 primary underline 표시.
- 현재 탭의 `content[]`를 `InfoCard` 목록으로 렌더.
