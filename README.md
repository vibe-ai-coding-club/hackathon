<a href="https://www.youtube.com/watch?v=JDYy4JY3VFs">
  <img src="https://img.youtube.com/vi/JDYy4JY3VFs/0.jpg" alt="딸깍톤 웹페이지">
</a>

# ttalkkakthon

해커톤 프로젝트

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **ORM**: Prisma 7 + PostgreSQL (Neon 어댑터)
- **Database**: Vercel Postgres (Neon 기반)
- **Package Manager**: pnpm

## 시작하기

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 실제 DB 연결 정보 입력

# Prisma 클라이언트 생성
pnpm prisma generate

# DB 마이그레이션
pnpm prisma migrate dev

# 개발 서버 실행
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

| 명령어                    | 설명                   |
| ------------------------- | ---------------------- |
| `pnpm dev`                | 개발 서버 실행         |
| `pnpm build`              | 프로덕션 빌드          |
| `pnpm start`              | 프로덕션 서버 실행     |
| `pnpm lint`               | ESLint 실행            |
| `pnpm prisma generate`    | Prisma 클라이언트 생성 |
| `pnpm prisma migrate dev` | DB 마이그레이션 (개발) |
