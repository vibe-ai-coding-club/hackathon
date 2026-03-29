# StaffCard

## 목적

운영진 1명의 프로필 정보를 카드 형태로 표시한다.

## Props

- `item: StaffItem`

## 동작/UI

- 좌측에 더 큰 원형 프로필 영역을 배치한다. `profileImage`가 있으면 이미지, 없으면 이니셜 플레이스홀더를 노출한다.
- 우측에는 `nickname`, `role`, `oneLiner`를 세로로 노출한다.
- GitHub/LinkedIn 아이콘은 카드 우측 상단에 배치하고 클릭 시 새 탭으로 이동한다.
- `githubUrl`, `linkedinUrl`은 optional이며, 값이 없는 소셜 아이콘은 렌더링하지 않는다.
- 프로필 이미지는 `fill` + `sizes`를 함께 사용해 모바일 `88px`, 데스크탑 `112px` 원형 영역에 맞는 리소스를 요청한다.
- 카드 배경은 반투명 white + blur 조합을 사용한다.
- 모바일 최소 너비 `272px`, 데스크탑 최소 너비 `340px`을 보장한다.
