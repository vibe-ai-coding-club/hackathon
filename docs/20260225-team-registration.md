# 팀 접수 폼 설계서

## 개요

AI 해커톤 소개 랜딩 페이지 + 팀 접수 폼. 인증 없이 공개 폼으로 운영.

## 설계 결정

| 항목        | 결정                                 | 이유                                     |
| ----------- | ------------------------------------ | ---------------------------------------- |
| 데이터 모델 | 팀원을 JSON 배열로 저장 (테이블 1개) | 팀원 개별 쿼리 불필요, 최대 5명          |
| 폼 처리     | Server Actions (`useActionState`)    | Next.js 16 표준, Progressive Enhancement |
| 검증        | HTML5 + Zod 서버사이드               | 클라이언트 UX + 서버 신뢰성              |
| 페이지 구조 | 단일 페이지 섹션 기반                | 랜딩+폼 한 페이지가 전환율에 유리        |

## 데이터 모델

```prisma
model Team {
  id          String   @id @default(cuid())
  name        String   @unique
  topic       String
  description String?
  members     Json     // { name, email, phone, isLeader }[]
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("teams")
}
```

## 보호 장치

| 보호       | 설정                | 동작                     |
| ---------- | ------------------- | ------------------------ |
| 팀 수 상한 | 최대 100팀          | 초과 시 모집 마감 메시지 |
| Honeypot   | 숨김 `website` 필드 | 봇이 채우면 즉시 차단    |
| Rate limit | IP당 1분에 3회      | 초과 시 요청 제한 메시지 |

## 파일 구조

```
app/
├── _components/
│   ├── registration-form.tsx   # 등록 폼 (Client Component)
│   └── member-fieldset.tsx     # 팀원 입력 필드셋 (Client Component)
├── actions/
│   └── register-team.ts        # Server Action
├── globals.css                  # CSS 변수 확장
├── layout.tsx                   # 메타데이터 업데이트
└── page.tsx                     # 랜딩 페이지
lib/
└── validations/
    └── team.ts                  # Zod 검증 스키마
```
