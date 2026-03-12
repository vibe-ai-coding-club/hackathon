# PaymentSection

- Source: `app/register/_components/payment-section.tsx`
- Role: 참가비 안내, 환불 계좌 입력, 입금 여부 확인.
- Props: `form`, `errors`, `setForm`, `update`
- 표시 조건: `participationType`이 선택된 경우

## 참가비 안내 카드
- 외부 카드: `bg-gray-50 rounded-xl p-5`
- 제목: 🔺 아이콘 (`/images/alert.png`) + "참가비 안내" (`FieldLabel` 사용)
- 내부 카드: `bg-gray-0 rounded-xl p-5` (border 없음)
- 참가비/입금계좌: 모바일에서만 줄바꿈 (`<br className="sm:hidden" />`)
- 유의사항: `typo-caption1 text-gray-500`
- 빨간 강조: "*원활한 참가를 위해 입금시 참가자 명으로 입금 부탁드려요!" (`text-error`)

## 환불 계좌
- 은행명/계좌번호/예금주 — Desktop 3열 (`sm:grid-cols-3`)

## 입금 여부 라디오
- 개인: "완료" / "미완료"
- 팀: "모든 팀원 완료" / "미완료"
- description: 완료 "안내된 계좌로 입금을 마쳤어요", 미완료 개인/팀 분기
- Layout: Mobile 세로 스택, Desktop 가로 2열
