# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hackathon project.

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **ORM**: Prisma 7 + PostgreSQL (Neon 어댑터)
- **Database**: Vercel Postgres (Neon 기반)
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Build & Development Commands

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 (localhost:3000)
pnpm build         # 프로덕션 빌드
pnpm start         # 프로덕션 서버
pnpm lint          # ESLint 실행
pnpm prisma generate   # Prisma 클라이언트 생성
pnpm prisma migrate dev # DB 마이그레이션 (개발)
```

## Architecture

```
hackathon/
├── app/                    # Next.js App Router
│   ├── globals.css         # 글로벌 스타일 (Tailwind CSS 4)
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # 홈 페이지
│   └── generated/prisma/   # Prisma 생성 클라이언트 (gitignored)
├── lib/                    # 공유 유틸리티
│   ├── prisma.ts           # Prisma 싱글톤 클라이언트
│   └── utils.ts            # cn() 등 헬퍼 함수
├── prisma/
│   └── schema.prisma       # Prisma 스키마
├── prisma.config.ts        # Prisma 설정
├── public/                 # 정적 파일
├── .env                    # 환경 변수 (gitignored)
└── .env.example            # 환경 변수 템플릿
```

### 주요 패턴

- **Prisma Client**: `lib/prisma.ts`의 싱글톤 인스턴스 사용 (Neon 서버리스 어댑터, dev hot-reload 대응)
- **환경 변수**: Vercel Postgres 연결 시 `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` 자동 주입
- **클래스 병합**: `cn()` 함수 사용 (`lib/utils.ts`) — clsx + tailwind-merge
- **Server Components**: 기본값, 필요시 `"use client"` 명시
- **경로 별칭**: `@/*` → 프로젝트 루트
