# 2026-02-25 랜딩 페이지 및 팀 접수 폼 구현

## feat

- AI 해커톤 소개 랜딩 페이지 구현 (Hero, About, Schedule, Register, Footer 섹션)
- 팀 접수 폼 구현 (`useActionState` + Server Action)
- 동적 팀원 추가/삭제 UI (최소 1명, 최대 5명)
- Prisma `Team` 모델 추가 및 Neon DB 마이그레이션

## chore

- Zod v4 설치 및 팀 등록 검증 스키마 작성 (`lib/validations/team.ts`)
- CSS 변수 확장 (accent, muted, border, error, success + 다크모드)
- Layout 메타데이터 및 OpenGraph 업데이트
- Vercel CLI 연동 (`vercel login`, `vercel link`)
- `.env` 미사용 변수 정리 (8개 → 2개)
- `.env.example` 실제 사용 변수에 맞게 정리
- `.gitignore` Prisma 생성 경로 업데이트 (`/generated/prisma`)

## fix

- Prisma client output 경로 변경 대응 (`../app/generated/prisma` → `../generated/prisma`)

## 보안

- Honeypot 필드로 봇 차단
- IP 기반 rate limit (1분 3회)
- 팀 수 상한 (100팀)

## 일정 정보

- 모집 기간: 03.14 ~ 03.20
- 해커톤: 03.28 (토) 10:00 ~ 18:00
