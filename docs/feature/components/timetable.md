# Timetable

## 목적
타임테이블 목록 컨테이너 컴포넌트.

## Props
- `items: { title: string; time: string }[]`

## 동작/UI
- 전달받은 `items`를 순회하며 `TimetableRow` 렌더.
- 행 사이 구분선 제공.
