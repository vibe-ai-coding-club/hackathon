# RegistrationForm

- Source: `app/register/_components/registration-form.tsx`
- Role: 참가 신청 입력/검증/제출 UI. 섹션별 하위 컴포넌트로 구성.
- Form Model:
  - `participationType`: `INDIVIDUAL | TEAM`
  - 공통: `name`, `email`, `phone`, `experienceLevel`, `motivation`
  - 팀: `members[]` (최대 3명, 팀장 제외)
  - 참가비: `refundBank`, `refundAccount`, `refundAccountHolder`, `hasDeposited`
  - 동의: `privacyConsent`
- Section 렌더 순서:
  1. `ParticipationTypeSection` — 참가 유형 라디오
  2. `PersonalInfoSection` — 이름/이메일/연락처 (개인 참여 시)
  3. `TeamMembersSection` — 팀장 + 팀원 카드 (팀 참여 시)
  4. `PaymentSection` — 참가비 안내/환불계좌/입금여부
  5. `ExperienceSection` — 개발 경험 라디오
  6. `MotivationSection` — 참여 동기 textarea
  7. `PrivacySection` — 개인정보 동의
- Validation:
  - 참가 유형/경험 수준 필수.
  - 이름, 이메일 형식(`EMAIL_REGEX`: ASCII만 허용), 휴대폰(숫자 11자리/국내 형식) 필수.
  - 팀: 팀원 이름/이메일/연락처 필수.
  - 환불 계좌 (은행명/계좌번호/예금주) 필수.
  - 개인정보 동의 필수.
  - `teamName`: 입력 없이 `"{이름}의 팀"` 자동 생성.
- Submission:
  - `POST /api/register`로 JSON 전송.
  - 성공/실패 토스트 표시.
  - 성공 시 폼 초기화.
- UX:
  - 전화번호 자동 하이픈 포맷.
  - 이메일 `onBlur` 자동 중복확인 (description 동적 변경: idle → checking → available / error).
  - 허니팟 필드(`website`) 포함.
  - 제출 버튼: 입력 준비도(`isReady`)에 따라 `primary | gray` 스타일 변경.
  - 버튼 하단 안내: "제출된 정보는 행사 운영 목적으로만 사용돼요".
  - 섹션 간격: Mobile `32px`, Desktop `28px`.
