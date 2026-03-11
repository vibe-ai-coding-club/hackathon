## 팀 빌딩 기획

### 요청사항 원문

```
어제 제가 운영팀한테 이것저것 이야기를 많이 해가지구 뭐가 많이 생겼는데요, 요구사항이 좀 고민이 되어서요

신청자에 대하여 입금 확인 후 상황에 따라 세 단계에 나눠서(확정, 예비, 환불) 메일을 발송할 예정이라 이 상태를 볼 수 있어야합니다
모든 참여자는 조기확정될 경우 온라인 팀빌딩을 할 수 있는데요, (방식이 확정은 아니지만) 참여자들에게 오픈된 팀빌딩 표를 주고 자유롭게 기입하고 수정할 수 있는 시트를 만들 가능성이 높습니다. (어쩌면 팀을 구하기위한 주제나 글도 기입하게 될 지도 모르죠. 스펙 확정X)

위 요구상황에 대한 체다의 생각
막상 모집 시작하면 또 다른 형태의 데이터 필터링, 정렬이나 상태값, 메모가 추가될 수 있음
참여자 데이터를 참여자, 운영진이 자유롭고 빠르게 수정하고, 여러 컬럼이 추가될 수 있음

=> 종합해서 드는 생각은 신청자 데이터를 스프레드시트 형태로 연동해주는게, 운영팀에서도 홍보팀 거치지 않고 데이터를 자유롭게 가공할 수 있어서 좋지 않을까
=> 혹시 이후 심사나 결과물 업로드가 팀 데이터와 연결된다면. 온라인 팀빌딩 이후 수정된 최종 팀을 업데이트만 할 수 있으면 되지 않을까

그니까 사실상 지금 백오피스에서 보는 화면을 시트로…
오히려 상태값같은 신청시 입력값이 아닌건 제거되어도 될 것 같은?
다른 시트 자유롭게 파서 기입하면되는거니까
팀이나 정보 수정기능 지원할 필요없고, 완전 모집 다 끝나고 1회만 수동으로 업데이트 해주면 될 것 같은
요약: 엑셀에 데이터 보여주기만 하면 됨 (수정, 상태 x => 이건 운영에서 자유롭게 시트에서 구성하고, 최종 확정된 팀만 넘기는걸로)
```

### 요구사항 정리

1. **신청자 상태 관리**: 입금 확인 후 세 단계(확정, 예비, 환불)로 상태를 분류하고, 상태별 메일 발송
2. **온라인 팀빌딩**: 조기확정된 참여자들이 자유롭게 팀을 구성할 수 있는 공간 제공 (스펙 미확정)
3. **유연한 데이터 관리**: 운영 중 필터링, 정렬, 상태값, 메모 등 추가 컬럼이 생길 수 있음

### 해결 방향성

> 구글 시트 연동은 반나절이면 가능한 개발 사항이므로 최후의 fallback으로 둔다.
> 요구사항을 충족하는 기능 개발을 우선 구상한다.

- 관리자
  - 현재 스키마에 존재하는 Team, Member 관련된 테이블을 관리자 화면에서 구글시트와 동일하게 제공할 수 있도록 변경(UI 변경)
  - 팀의 상태값을 관리자가 조정(모집완료, 모집중) (칼럼 추가, 관리 기능 제공)
  - 멤버를 다른 팀으로 옮길 수 있는 기능 구현(팀원 DND 기능 제공)
  - 팀장 포함 최대 4인

- 신청자
  - 개인 혹은 팀은 신청 시 추가 인원 모집 여부를 결정(칼럼 추가)
  - 팀원을 모집하는 경우 개인으로 선택했더라도 팀이름 받아서 스키마에 저장(로직수정)
  - 신청자는 간단한 로그인 기능(이메일과 전화번호 뒷자리) 제공(Next-Auth 추가, v5)
  - 모집중인 팀 목록을 확인할 수 있는 그리드형 게시판 제공(페이지 추가, 인증 후 사용 기능)

- Fallback: 모든 요구사항이 커버가 불가능하면 구글 시트에 전송하는 API만 달고, 운영진이 수동으로 추가 팀 작성

---

## 구체화된 구현 계획

### Phase 1. 스키마 변경

#### 1-1. Team 모델 변경

```prisma
// 추가할 enum
enum TeamStatus {
  PENDING       // 대기 (입금 확인 전 기본값)
  CONFIRMED     // 확정 (입금 확인 + 참가 확정)
  WAITLISTED    // 예비 (정원 초과 대기)
  REFUNDED      // 환불 (환불 처리 완료)
}

enum RecruitmentStatus {
  NOT_RECRUITING  // 모집 안함
  RECRUITING      // 모집중
  CLOSED          // 모집완료
}
```

**Team 모델에 추가할 필드:**

| 필드                | 타입                | 설명                           | 기본값           |
| ------------------- | ------------------- | ------------------------------ | ---------------- |
| `status`            | `TeamStatus`        | 신청자 상태 (확정/예비/환불)   | `PENDING`        |
| `recruitmentStatus` | `RecruitmentStatus` | 추가 인원 모집 여부            | `NOT_RECRUITING` |
| `recruitmentNote`   | `String?`           | 팀 모집 소개글 (게시판에 노출) | `null`           |

**기존 필드와의 관계:**

- `hasDeposited` (자가 입금 여부) → 유지 (신청자가 체크)
- `depositConfirmed` (관리자 입금 확인) → 유지 (관리자가 토글)
- 새로운 `status`는 `depositConfirmed` 이후 관리자가 수동으로 설정하는 별도 상태

**teamName 로직 변경:**

- 현재: `participationType === TEAM`일 때만 teamName 저장
- 변경: `recruitmentStatus !== NOT_RECRUITING`이면 개인 참여자도 teamName 필수
- 이유: 모집 게시판에서 팀 이름으로 표시해야 함

#### 1-2. 마이그레이션 SQL 예상

```sql
-- enum 추가
CREATE TYPE "TeamStatus" AS ENUM ('PENDING', 'CONFIRMED', 'WAITLISTED', 'REFUNDED');
CREATE TYPE "RecruitmentStatus" AS ENUM ('NOT_RECRUITING', 'RECRUITING', 'CLOSED');

-- 칼럼 추가
ALTER TABLE "teams" ADD COLUMN "status" "TeamStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "teams" ADD COLUMN "recruitment_status" "RecruitmentStatus" NOT NULL DEFAULT 'NOT_RECRUITING';
ALTER TABLE "teams" ADD COLUMN "recruitment_note" TEXT;
```

**기존 데이터 처리:**

- `depositConfirmed === true`인 팀 → `status = CONFIRMED`으로 업데이트 (마이그레이션 시 처리)
- 나머지 → `status = PENDING` (기본값 유지)

---

### Phase 2. 신청 폼 변경

#### 2-1. 변경되는 신청 흐름

```
[참가 유형] 개인 / 팀
                ↓
[추가 인원 모집 여부] 모집할래요 / 모집 안할래요   ← 새로 추가
                ↓
(모집 선택 시) [팀 이름] 필수 입력                  ← 조건 변경
(모집 선택 시) [모집 소개글] 선택 입력              ← 새로 추가
                ↓
[기존 폼 필드 동일]
```

#### 2-2. 수정 대상 파일

**`lib/validations/team.ts`**

- `recruitmentStatus` 필드 추가: `"RECRUITING" | "NOT_RECRUITING"`
- `recruitmentNote` 필드 추가: `string`, max 300자, 선택
- teamName 조건부 필수 로직 변경:
  - 기존: `participationType === TEAM`일 때만 필수
  - 변경: `participationType === TEAM` **또는** `recruitmentStatus === RECRUITING`일 때 필수

**`app/_components/registration-form.tsx`**

- "추가 인원 모집 여부" 라디오 버튼 섹션 추가 (참가 유형 선택 직후)
  - "팀원을 더 모집할래요" / "모집하지 않을래요"
  - 기존 RadioDot 컴포넌트 재활용
- 팀 이름 입력 조건 변경:
  - 기존: `participationType === "TEAM"`일 때만 표시
  - 변경: `participationType === "TEAM"` **또는** `recruitmentStatus === "RECRUITING"`일 때 표시
- 모집 소개글 textarea 추가 (recruitmentStatus === "RECRUITING"일 때만 표시)
  - placeholder: "어떤 팀원을 찾고 있나요? 주제, 기술 스택 등을 자유롭게 작성해주세요"
  - max 300자

**`app/api/register/route.ts`**

- `recruitmentStatus` 저장 로직 추가
- `recruitmentNote` 저장 로직 추가
- teamName 저장 조건 변경 (모집 시에도 저장)

#### 2-3. FormState 타입 변경

```typescript
// 추가
type FormState = {
  // ... 기존 필드
  recruitmentStatus: "RECRUITING" | "NOT_RECRUITING" | ""; // 새로 추가
  recruitmentNote: string; // 새로 추가
};
```

---

### Phase 3. 신청자 인증 (NextAuth v5)

#### 3-1. 인증 방식

- **Credentials Provider** 사용 (이메일 + 전화번호 뒷자리 4자리)
- 세션: JWT 기반 (DB 세션 불필요 — 이미 Member 테이블이 존재)
- 별도 User/Account/Session 테이블 생성 안 함

#### 3-2. 인증 흐름

```
[로그인 페이지] /team-building/login
    ↓
이메일 입력 + 전화번호 뒷자리 4자리 입력
    ↓
Member 테이블에서 email로 조회
    ↓
phone 뒷자리 4자리 일치 확인
    ↓
JWT 세션 발급 (memberId, name, teamId 포함)
    ↓
/team-building 으로 리디렉트
```

#### 3-3. 추가할 파일/패키지

| 대상                                             | 내용                                                    |
| ------------------------------------------------ | ------------------------------------------------------- |
| `pnpm add next-auth@beta`                        | NextAuth v5 beta 설치                                   |
| `lib/auth.ts`                                    | NextAuth 설정 (Credentials Provider, JWT 콜백)          |
| `app/api/auth/[...nextauth]/route.ts`            | NextAuth API 라우트                                     |
| `app/team-building/login/page.tsx`               | 로그인 페이지                                           |
| `proxy.ts`                                       | `/team-building/*` 경로 인증 보호 (Next.js 16 proxy)   |
| `app/team-building/page.tsx`                     | 서버 컴포넌트에서 `auth()` 체크 (이중 보호)             |
| `app/team-building/_components/team-building-board.tsx` | 게시판 클라이언트 컴포넌트                        |

#### 3-4. NextAuth 설정 상세

```typescript
// lib/auth.ts
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface User {
    memberId?: string;
    teamId?: string;
  }
  interface Session {
    user: { memberId?: string; teamId?: string } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        phoneLast4: { type: "text" },
      },
      authorize: async (credentials) => {
        // 1. Member 테이블에서 email로 조회
        // 2. phone 뒷자리 4자리 비교
        // 3. 성공 시 { id, name, email, memberId, teamId }
        // 4. 실패 시 null
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.memberId = user.memberId;
        token.teamId = user.teamId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.memberId = token.memberId as string | undefined;
        session.user.teamId = token.teamId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/team-building/login",
  },
});
```

#### 3-5. proxy.ts (Next.js 16 — middleware 대체)

> Next.js 16에서 `middleware.ts`는 `proxy.ts`로 변경됨.
> 내보내는 함수명도 `middleware` → `proxy`로 변경.
> 런타임이 Edge가 아닌 Node.js이므로 Prisma 등 서버 모듈 사용 가능.

```typescript
// proxy.ts
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/team-building/login") {
    const loginUrl = new URL("/team-building/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/team-building/:path*"],
};
```

#### 3-6. 경로 보호 전략 (이중 보호)

- **proxy.ts**: `/team-building/*` 접근 시 미인증이면 로그인으로 redirect (1차 보호)
- **서버 컴포넌트**: `app/team-building/page.tsx`에서 `auth()` 호출 후 `redirect()` (2차 보호)
- **API 라우트**: `GET /api/team-building/teams`에서 `auth()` 호출 (API 보호)

**기존 관리자 인증과의 충돌 방지:**

- 기존 관리자: 쿠키 기반 (`admin_session`), `/admin` layout에서 서버 사이드 체크
- 신청자: NextAuth JWT (`authjs.session-token`), proxy + 서버 컴포넌트에서 체크
- 경로가 다르므로 (`/admin` vs `/team-building`) 충돌 없음

**next-auth v5 beta 참고 사항:**

- `pnpm add next-auth@beta` (v5는 아직 정식 릴리즈 아님, `@5`로 설치 불가)
- `@auth/core/jwt` 모듈 augmentation은 pnpm에서 resolve 안 됨 → JWT 타입은 콜백에서 `as` 캐스팅으로 처리
- next-auth beta.30의 peer dependency는 Next.js 15까지만 명시 — Next.js 16에서도 동작 확인됨

---

### Phase 4. 팀 모집 게시판 (신청자용)

#### 4-1. 라우트 구조

```
/team-building/login      → 로그인 페이지 (인증 불필요)
/team-building             → 모집 게시판 메인 (인증 필요)
```

#### 4-2. 게시판 UI 상세

**레이아웃: `app/team-building/layout.tsx`**

- 상단 네비게이션: 로고 + 사용자 이름 + 로그아웃 버튼
- 세션 정보 표시: "OOO님 (팀: XXX)"

**메인 페이지: `app/team-building/page.tsx`**

```
┌─────────────────────────────────────────────┐
│ 🔍 검색 (팀 이름, 소개글)     [경험 필터 ▾] │
├─────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │ 팀 이름   │ │ 팀 이름   │ │ 팀 이름   │     │
│ │ 모집 소개 │ │ 모집 소개 │ │ 모집 소개 │     │
│ │ 경험: OO  │ │ 경험: OO  │ │ 경험: OO  │     │
│ │ 인원: 2/4 │ │ 인원: 1/4 │ │ 인원: 3/4 │     │
│ │ [모집중]  │ │ [모집중]  │ │ [모집완료]│     │
│ └──────────┘ └──────────┘ └──────────┘     │
│ ┌──────────┐ ┌──────────┐                   │
│ │ ...       │ │ ...       │                   │
│ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────┘
```

**카드에 표시할 정보:**

- 팀 이름 (`teamName`)
- 모집 소개글 (`recruitmentNote`) — 2줄까지 표시, 말줄임
- 대표자 경험 레벨 (`experienceLevel`)
- 현재 인원 / 최대 인원 (members.length / 4)
- 모집 상태 배지 (`recruitmentStatus`)
- 대표자 이름

**필터/검색:**

- 텍스트 검색: 팀 이름 + 모집 소개글 (클라이언트 필터링, 데이터가 100팀 이하)
- 경험 레벨 필터: 전체 / BEGINNER / JUNIOR / SENIOR / VIBE_CODER

**데이터 쿼리 조건:**

- `status === CONFIRMED` (확정된 팀만)
- `recruitmentStatus === RECRUITING` (모집중인 팀만)
- 모집완료 팀은 별도 섹션 또는 숨김 처리

#### 4-3. API 엔드포인트

**`GET /api/team-building/teams`** (인증 필요)

- 모집중인 팀 목록 조회
- 쿼리: `recruitmentStatus = RECRUITING`, `status = CONFIRMED`
- 응답: 팀 정보 + members count (개인정보 제외)
- 반환 필드: `id, teamName, recruitmentNote, recruitmentStatus, experienceLevel, name(대표자), membersCount`

```typescript
// 응답 예시
{
  teams: [
    {
      id: "clxxx...",
      teamName: "팀 이름",
      leaderName: "홍길동",
      recruitmentNote: "프론트엔드 개발자 모집합니다",
      recruitmentStatus: "RECRUITING",
      experienceLevel: "JUNIOR",
      membersCount: 2,
      maxMembers: 4,
    },
  ];
}
```

> 신청자가 게시판에서 팀에 "가입 신청"하는 기능은 스펙 미확정이므로 Phase 1에서는 조회만 제공.
> 실제 팀 합류는 관리자가 DND로 처리하거나, 추후 기능 확장.

---

### Phase 5. 관리자 — 스프레드시트형 테이블로 전환

> **핵심 변경**: 기존 `TeamTable` (리스트 + 클릭 → 모달 상세) 구조를 **폐기**하고,
> 모든 데이터가 한 화면에서 인라인 편집 가능한 **스프레드시트형 테이블**로 교체한다.
> `TeamDetailModal`도 폐기한다 — 모든 정보가 시트 행에 직접 노출된다.

#### 5-1. 기존 UI vs 변경 후 UI

**현재 (폐기 대상):**

```
┌─────────────────────────────────────────────────────────────────┐
│ # │ 이름 │ 이메일/연락처 │ 참가유형 │ 경험 │ 팀명(인원) │ 입금확인 │ 신청일시 │
│   │      │               │ [배지]   │      │            │ [토글]  │         │
│   │      │   클릭 → TeamDetailModal 열림                                   │
└─────────────────────────────────────────────────────────────────┘
- 행 클릭 시 모달로 상세 확인
- 모달 안에서만 환불계좌, 참가동기, 팀원 목록 확인 가능
- 입금확인 토글만 인라인 가능
```

**변경 후 (스프레드시트형):**

```
┌─ 필터 바 ──────────────────────────────────────────────────────────────────────────────────┐
│ [상태 ▾ 전체]  [모집 ▾ 전체]  [경험 ▾ 전체]  [참가유형 ▾ 전체]     🔍 검색___             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ # │ 상태   │ 이름 │ 이메일       │ 연락처      │ 유형 │ 팀이름  │ 멤버              │ 경험  │
│   │[select]│      │              │             │      │         │ 홍길동(L), 김OO   │       │
│   │        │      │              │             │      │         │ + [팀이동] 버튼들  │       │
├───┤        ├──────┤              ├─────────────┤      ├─────────┤                   ├───────┤
│   │ 모집   │입금  │ 환불계좌     │ 모집소개글   │참가동기                          │신청일 │
│   │[select]│[토글]│ 카카오 1234  │ 2줄 말줄임   │ 2줄 말줄임                       │       │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 5-2. 컬럼 설계 — 2행 구조

시트 특성 상 정보가 많으므로 **각 팀을 2행**으로 표시한다.

**1행 (주요 정보):**

| 컬럼       | 너비  | 내용                                              | 편집              |
| ---------- | ----- | ------------------------------------------------- | ----------------- |
| `#`        | 40px  | 순번                                              | -                 |
| `상태`     | 90px  | TeamStatus 드롭다운                               | 인라인 `<select>` |
| `이름`     | 80px  | 대표자 이름                                       | 읽기 전용         |
| `이메일`   | 180px | 대표자 이메일 + 복사 버튼                         | 읽기 전용         |
| `연락처`   | 120px | 대표자 전화번호                                   | 읽기 전용         |
| `참가유형` | 70px  | 개인/팀 배지                                      | 읽기 전용         |
| `팀이름`   | 120px | teamName (없으면 `-`)                             | 읽기 전용         |
| `멤버`     | 200px | 멤버 이름 나열 (L=리더), 각 멤버 옆에 [이동] 링크 | 이동 액션         |
| `경험`     | 90px  | experienceLevel 라벨                              | 읽기 전용         |
| `신청일`   | 100px | YYYY.MM.DD                                        | 읽기 전용         |

**2행 (부가 정보, 같은 행의 하단):**

| 컬럼         | 병합        | 내용                                        | 편집              |
| ------------ | ----------- | ------------------------------------------- | ----------------- |
| `모집상태`   | 1칸         | RecruitmentStatus 드롭다운                  | 인라인 `<select>` |
| `입금`       | 1칸         | depositConfirmed 토글 버튼                  | 인라인 토글       |
| `환불계좌`   | 2칸 병합    | "은행 계좌번호 (예금주)" + 복사             | 읽기 전용         |
| `모집소개글` | 2칸 병합    | recruitmentNote 말줄임 (hover 시 전체 표시) | 읽기 전용         |
| `참가동기`   | 나머지 병합 | motivation 말줄임 (hover 시 전체 표시)      | 읽기 전용         |

#### 5-3. 인라인 편집 상세

**상태(`status`) 드롭다운:**

```html
<select>
  옵션: PENDING → "대기" (bg: gray-100, text: gray-600) CONFIRMED → "확정" (bg:
  green-100, text: green-700) WAITLISTED → "예비" (bg: yellow-100, text:
  yellow-700) REFUNDED → "환불" (bg: red-100, text: red-700)
</select>
```

- 변경 즉시 `PATCH /api/admin/teams/[teamId]/status` 호출
- 낙관적 업데이트 (즉시 UI 반영, 실패 시 롤백)
- select 배경색을 현재 상태에 맞춰 동적 변경

**모집상태(`recruitmentStatus`) 드롭다운:**

```html
<select>
  옵션: NOT_RECRUITING → "모집안함" (bg: gray-100) RECRUITING → "모집중" (bg:
  blue-100, text: blue-700) CLOSED → "모집완료" (bg: gray-200, text: gray-700)
</select>
```

- 변경 즉시 `PATCH /api/admin/teams/[teamId]/recruitment` 호출

**입금확인 토글:**

- 기존 `toggleDepositConfirmed` 서버 액션 그대로 사용
- 확인(green pill) / 미확인(yellow pill) 토글 버튼

#### 5-4. 멤버 표시 및 팀 이동

**멤버 컬럼 렌더링:**

```
홍길동(L) [↗] · 김철수 [↗] · 박영희 [↗]
```

- `(L)` = isLeader
- `[↗]` = 팀 이동 버튼 (아이콘)
- 4명 이상이면 줄바꿈

**[↗] 클릭 시 — 팀 선택 팝오버:**

- 인라인 팝오버 (모달이 아님, 가볍게)
- 팀 목록 드롭다운 + 검색 입력
- 팀이름 (현재인원/4) 형태로 표시
- 4/4인 팀은 비활성화 (선택 불가)
- 선택 시 `PATCH /api/admin/members/[memberId]/transfer` 호출

**API: `PATCH /api/admin/members/[memberId]/transfer`**

```typescript
// Request
{ targetTeamId: string }

// 서버 로직 (트랜잭션)
// 1. 대상 팀의 멤버 수 확인 (4명 미만이어야 함)
// 2. 이동할 멤버가 isLeader인 경우:
//    - 원래 팀의 다른 멤버 중 첫 번째를 isLeader: true로 승격
//    - 원래 팀에 다른 멤버가 없으면 그대로 진행 (빈 팀 허용)
// 3. member.teamId를 targetTeamId로 변경
// 4. 이동한 멤버의 isLeader를 false로 변경

// Response
{ success: true, member: { id, name, teamId } }
```

#### 5-5. 필터 바

테이블 상단에 가로 배치:

```typescript
// 필터 상태
type Filters = {
  status: TeamStatus | "ALL"; // 상태
  recruitmentStatus: RecruitmentStatus | "ALL"; // 모집상태
  experienceLevel: ExperienceLevel | "ALL"; // 경험
  participationType: ParticipationType | "ALL"; // 참가유형
  search: string; // 이름/이메일 텍스트 검색
};
```

- 모든 필터는 클라이언트 사이드 (최대 100팀이므로 서버 필터링 불필요)
- 필터 변경 시 페이지를 0으로 리셋
- 각 필터 드롭다운 옆에 현재 해당 필터의 건수 표시 (예: "확정 (23)")

#### 5-6. 기존 컴포넌트 폐기/변경 목록

| 컴포넌트                                      | 조치            | 이유                                        |
| --------------------------------------------- | --------------- | ------------------------------------------- |
| `team-table.tsx`                              | **전면 재작성** | 리스트형 → 스프레드시트 2행 구조로 교체     |
| `team-detail-modal.tsx`                       | **폐기 (삭제)** | 모든 정보가 시트에 인라인 노출되므로 불필요 |
| `admin-actions.ts` (`toggleDepositConfirmed`) | 유지            | 입금확인 토글은 그대로 사용                 |

**`team-table.tsx` 재작성 시 유지할 기능:**

- `SerializedTeam`, `SerializedMember` 타입 (새 필드 추가)
- `CopyButton` 컴포넌트
- `participationTypeLabel`, `experienceLevelLabel` 맵
- `formatDateTime` 유틸
- 페이지네이션 (PAGE_SIZE = 20)
- 검색 (이름/이메일)

**새로 추가할 것:**

- 2행 렌더링 로직 (각 팀이 `<tr>` 2개)
- 인라인 select (상태, 모집상태)
- 멤버 이동 팝오버
- 필터 바 컴포넌트
- 상태별 색상 맵

#### 5-7. `SerializedTeam` 타입 확장

```typescript
// 기존 필드 유지 + 새 필드 추가
export type SerializedTeam = {
  // ... 기존 필드 모두 유지
  status: string; // TeamStatus enum
  recruitmentStatus: string; // RecruitmentStatus enum
  recruitmentNote: string | null;
};
```

#### 5-8. 관리자 API 추가 목록

| 메서드  | 경로                                     | 설명                                                 |
| ------- | ---------------------------------------- | ---------------------------------------------------- |
| `PATCH` | `/api/admin/teams/[teamId]/status`       | 팀 상태 변경 (PENDING/CONFIRMED/WAITLISTED/REFUNDED) |
| `PATCH` | `/api/admin/teams/[teamId]/recruitment`  | 모집 상태 변경 (NOT_RECRUITING/RECRUITING/CLOSED)    |
| `PATCH` | `/api/admin/members/[memberId]/transfer` | 멤버 팀 이동                                         |

---

### Phase 6. 구현 순서 (작업 단위)

#### Step 1: 스키마 + 마이그레이션

1. `prisma/schema.prisma`에 enum 2개, 필드 3개 추가
2. `pnpm prisma migrate dev --name add-team-status-and-recruitment`
3. 기존 데이터 마이그레이션 스크립트 (depositConfirmed === true → status = CONFIRMED 동기화)

#### Step 2: 신청 폼 수정

1. `lib/validations/team.ts` Zod 스키마 수정
2. `app/_components/registration-form.tsx` UI 수정
3. `app/api/register/route.ts` 저장 로직 수정

#### Step 3: 관리자 — 스프레드시트형 테이블

1. `app/admin/_components/team-detail-modal.tsx` 삭제
2. `app/admin/_components/team-table.tsx` 전면 재작성 (2행 구조, 인라인 편집, 필터 바)
3. `app/admin/page.tsx` 쿼리에 새 필드 포함, SerializedTeam 확장
4. `PATCH /api/admin/teams/[teamId]/status` API 추가
5. `PATCH /api/admin/teams/[teamId]/recruitment` API 추가

#### Step 4: 멤버 이동 기능

1. `PATCH /api/admin/members/[memberId]/transfer` API 추가
2. 멤버 컬럼에 팀 이동 팝오버 구현

#### Step 5: NextAuth 설정

1. `pnpm add next-auth@beta`
2. `lib/auth.ts` NextAuth 설정
3. `app/api/auth/[...nextauth]/route.ts` 라우트
4. `proxy.ts` 경로 보호 (Next.js 16)
5. `app/team-building/login/page.tsx` 로그인 페이지

#### Step 6: 팀 모집 게시판

1. `app/team-building/layout.tsx` 레이아웃 (헤더, 로그아웃)
2. `app/team-building/page.tsx` 서버 컴포넌트 (auth 체크 + redirect)
3. `app/team-building/_components/team-building-board.tsx` 게시판 클라이언트 컴포넌트
4. `GET /api/team-building/teams` API
5. 검색/필터 기능

---

### 영향 범위 정리

| 파일                                                 | 변경 유형       | 설명                                                        |
| ---------------------------------------------------- | --------------- | ----------------------------------------------------------- |
| `prisma/schema.prisma`                               | 수정            | enum 2개 추가, Team 필드 3개 추가                           |
| `lib/validations/team.ts`                            | 수정            | recruitmentStatus, recruitmentNote 추가, teamName 조건 변경 |
| `lib/auth.ts`                                               | **신규**        | NextAuth v5 beta 설정                                       |
| `proxy.ts`                                                  | **신규**        | /team-building 경로 보호 (Next.js 16 proxy)                 |
| `app/_components/registration-form.tsx`                     | 수정            | 모집 여부 선택, 소개글 필드 추가                            |
| `app/api/register/route.ts`                                 | 수정            | 새 필드 저장 로직                                           |
| `app/api/auth/[...nextauth]/route.ts`                       | **신규**        | NextAuth API 핸들러                                         |
| `app/api/team-building/teams/route.ts`                      | **신규**        | 모집 팀 조회 API                                            |
| `app/api/admin/teams/[teamId]/status/route.ts`              | **신규**        | 팀 상태 변경 API                                            |
| `app/api/admin/teams/[teamId]/recruitment/route.ts`         | **신규**        | 모집 상태 변경 API                                          |
| `app/api/admin/members/[memberId]/transfer/route.ts`        | **신규**        | 멤버 이동 API                                               |
| `app/team-building/layout.tsx`                              | **신규**        | 팀빌딩 레이아웃 (헤더, 로그아웃)                            |
| `app/team-building/login/page.tsx`                          | **신규**        | 로그인 페이지                                               |
| `app/team-building/page.tsx`                                | **신규**        | 서버 컴포넌트 (auth 체크 + redirect)                        |
| `app/team-building/_components/team-building-board.tsx`     | **신규**        | 모집 게시판 클라이언트 컴포넌트                             |
| `app/admin/page.tsx`                                        | 수정            | 쿼리에 새 필드 포함                                         |
| `app/admin/_components/team-table.tsx`                      | **전면 재작성** | 리스트형 → 스프레드시트 2행 구조, 인라인 편집, 필터 바      |
| `app/admin/_components/team-detail-modal.tsx`               | **폐기 (삭제)** | 시트에 모든 정보 인라인 노출                                |

### 미정/후속 작업

- **메일 발송**: 상태 변경 시 자동 메일 발송 (외부 메일 서비스 연동 필요 — Resend, SendGrid 등)
- **구글 시트 Fallback**: 위 기능으로 커버 불가능 시 `googleapis` 연동

---

## 구현 완료 사항 (Phase 1~6 이후 추가)

### 멤버 환불계좌 분리

**배경**: 팀 환불계좌는 Team 모델에만 존재했으나, 멤버가 다른 팀으로 이동하면 환불계좌 정보가 유실됨.

**변경 내용**:

1. **Member 모델에 환불계좌 칼럼 추가** (옵셔널)
   ```prisma
   model Member {
     // ...기존 필드
     refundBank          String? @map("refund_bank")
     refundAccount       String? @map("refund_account")
     refundAccountHolder String? @map("refund_account_holder")
   }
   ```

2. **신청 시 리더 멤버에 팀 환불계좌 복제**
   - `POST /api/register` — 팀 생성 시 리더 멤버의 `refundBank`, `refundAccount`, `refundAccountHolder`에 동일 값 저장
   - 일반 팀원은 `null` (별도 환불계좌 미보유)

3. **어드민 테이블에서 멤버별 환불계좌 표시**
   - 리더 행: 멤버의 환불계좌 표시 (Team이 아닌 Member 기준)
   - 멤버 행: 환불계좌가 있으면 표시, 없으면 `-`

4. **기존 데이터 마이그레이션**: 기존 리더 멤버에 팀 환불계좌를 백필

### 신청자 팀 이동 (셀프)

**배경**: 팀 모집 게시판에서 신청자가 직접 다른 팀으로 이동할 수 있어야 함.

**구현 내용**:

1. **`POST /api/team-building/transfer`** — 신청자가 직접 팀 이동
   - NextAuth 세션 인증 (memberId 기반)
   - 대상 팀이 RECRUITING 상태이고 4명 미만인지 검증
   - 팀장 이동 시 남은 멤버 중 첫 번째를 팀장으로 승격, 팀 대표 정보 갱신
   - `participationType` 자동 변경: 1명 → INDIVIDUAL, 2명+ → TEAM
   - **1인 팀 이동 시 빈 팀 자동 삭제**

2. **팀 빌딩 게시판 UI** (`team-building-board.tsx`)
   - 내 팀 항상 표시 (모집중: 강조, 비모집: 흐리게 + 상태 표기)
   - 다른 팀 카드 클릭 → 컨펌 모달 → 이동
   - 모집중이 아니거나 꽉 찬 팀은 클릭 불가 (opacity-50, "마감" 배지)
   - 상단에 유저 이름 + 로그아웃 버튼

3. **JWT 세션 갱신** (`lib/auth.ts`)
   - JWT callback에서 매 요청마다 DB에서 최신 `teamId` 조회
   - 팀 이동 후 새로고침 시 즉시 반영
