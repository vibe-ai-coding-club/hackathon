# Navigation

- Source: `app/_components/navigation.tsx`
- Role: 상단 고정 네비게이션(UI) 제공.
- UI:
  - 공통: 반투명 흰색 배경(`bg-white/20`) + 블러(`10px`) + 하단 흰색 보더.
  - 좌측: `Logo` 컴포넌트 배치.
  - 메뉴: `행사 소개`, `갤러리` 링크.
  - PC(768px 이상): CTA 버튼 `딸깍톤 신청하기` 노출.
  - Mobile(767px 이하): CTA 숨김, 텍스트 메뉴만 노출.
- Links:
  - 행사 소개: `/#intro`
  - 갤러리: `/#gallery`
  - 신청 버튼: `/register`
