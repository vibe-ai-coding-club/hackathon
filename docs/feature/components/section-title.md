# SectionTitle

## 목적
랜딩 섹션의 공통 타이틀(Chip + Heading) UI를 일관된 규격으로 제공.

## Props
- `chipLabel: string` (필수)
- `title: string` (필수)
- `chipClassName?: string`
- `titleClassName?: string`
- `className?: string`

## 동작/UI
- 기본 중앙 정렬.
- 모바일: `Chip` + `typo-h5` 제목.
- 데스크탑: `Chip` + `typo-h3` 제목.
- `chipClassName`/`titleClassName`으로 섹션별 스타일 변형 가능.

## 사용처
- `about`, `schedule`, `culture`, `info`, `sponsor` 섹션.
