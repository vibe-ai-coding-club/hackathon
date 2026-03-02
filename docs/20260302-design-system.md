# Design System

## Colors

### 가이드라인

- 토큰화된 컬러 이외의 새로운 컬러가 필요한 경우, index/커버페이지와 같은 단기적인 페이지라면 사용 가능
- 서비스 내 페이지에 해당하고 장기적으로 사용할 요소인 경우 **토큰화된 컬러 사용 권장**
- 적합한 컬러가 없는 경우 장기적으로 사용 가능한 컬러인지 의논 후 새로 토큰화
- `#000000` (pure black)은 가급적 사용하지 않음
- 다른 개체 위로 올라가는 개체가 아니라면 `opacity` 값을 조정하지 않음 (연산 비용으로 성능 영향)
- Handoff System의 컬러는 토큰화되어 있지 않으므로 디자인에 사용하지 않음

### Primary

브랜드 메인 컬러. 한 화면 내에서 가장 중요한 버튼이나 강조할 정보에 사용.

| Scale | Hex | CSS Variable | Tailwind Class |
|-------|---------|---------------------------|---------------------|
| 900 | #003B59 | `--color-primary-900` | `primary-900` |
| 800 | #004C73 | `--color-primary-800` | `primary-800` |
| 700 | #006599 | `--color-primary-700` | `primary-700` |
| 600 | #0087CC | `--color-primary-600` | `primary-600` |
| 500 | #0097E6 | `--color-primary-500` | `primary-500` |
| **400** | **#00A8FF** | `--color-primary-400` | `primary-400` |
| 300 | #1AB0FF | `--color-primary-300` | `primary-300` |
| 200 | #4DC2FF | `--color-primary-200` | `primary-200` |
| 100 | #7AD2FF | `--color-primary-100` | `primary-100` |
| 075 | #B0E4FF | `--color-primary-075` | `primary-075` |
| 050 | #D9F2FF | `--color-primary-050` | `primary-050` |
| 025 | #E6F6FF | `--color-primary-025` | `primary-025` |

> Primary 400이 브랜드 기본 컬러

### Grayscale

| Scale | Hex | CSS Variable | Tailwind Class |
|-------|---------|---------------------------|---------------------|
| 950 | #0A0D0F | `--color-gray-950` | `gray-950` |
| 900 | #15191E | `--color-gray-900` | `gray-900` |
| 850 | #333B45 | `--color-gray-850` | `gray-850` |
| 800 | #454E57 | `--color-gray-800` | `gray-800` |
| 700 | #5E6973 | `--color-gray-700` | `gray-700` |
| 600 | #7B8591 | `--color-gray-600` | `gray-600` |
| 500 | #8F98A3 | `--color-gray-500` | `gray-500` |
| 400 | #AAB1BC | `--color-gray-400` | `gray-400` |
| 300 | #CDD3DC | `--color-gray-300` | `gray-300` |
| 200 | #E5E8ED | `--color-gray-200` | `gray-200` |
| 100 | #EFF2F5 | `--color-gray-100` | `gray-100` |
| 50 | #F4F7F9 | `--color-gray-50` | `gray-50` |
| 0 | #FFFFFF | `--color-gray-0` | `gray-0` |

---

## Font System

서비스 내에서 일관된 글자를 제공할 수 있도록 명시된 글자 문서. 디자인 산출물은 100% 기준이며, 추가 배율은 별도 디자인하지 않음.

### 글꼴

**Pretendard**를 기본 폰트로 사용.

- SemiBold, ExtraBold 굵기 지원
- 가변(Variable) 속성 지원

### Headline

| Token | Level | font-size | weight | line-height | letter-spacing |
|-----------|-------|-----------|-----------|-------------|----------------|
| headline1 | H1 | 46px | Bold/700 | 64px | -0.4px |
| headline2 | H2 | 42px | Bold/700 | 60px | -0.4px |
| headline3 | H3 | 34px | Bold/700 | 52px | -0.4px |
| headline4 | H4 | 28px | Bold/700 | 40px | -0.4px |
| headline5 | H5 | 24px | Bold/700 | 34px | -0.4px |
| headline6 | H6 | 20px | Bold/700 | 30px | -0.4px |
| headline7 | H7 | 18px | Bold/700 | 26px | -0.4px |

### Subtitle

| Token | Level | font-size | weight | line-height | letter-spacing |
|-----------|-----------|-----------|------------|-------------|----------------|
| subtitle1 | subtitle1 | 16px | Bold/700 | 24px | -0.2px |
| subtitle2 | subtitle2 | 14px | Bold/700 | 22px | -0.2px |
| subtitle3 | subtitle3 | 16px | Medium/500 | 24px | -0.2px |
| subtitle4 | subtitle4 | 14px | Medium/500 | 22px | -0.2px |

### Body

| Token | Level | font-size | weight | line-height | letter-spacing |
|-------|-------|-----------|-------------|-------------|----------------|
| body1 | body1 | 16px | Regular/400 | 26px | -0.4px |
| body2 | body2 | 15px | Regular/400 | 25px | -0.4px |
| body3 | body3 | 14px | Regular/400 | 24px | -0.4px |

### Button

| Token | Level | font-size | weight | line-height | letter-spacing |
|---------|-------|-----------|------------|-------------|----------------|
| button1 | btn1 | 18px | Medium/500 | 26px | 0px |
| button2 | btn2 | 16px | Medium/500 | 24px | 0px |
| button3 | btn3 | 14px | Medium/500 | 22px | 0px |
| button4 | btn4 | 12px | Medium/500 | 20px | 0px |

### Caption

| Token | Level | font-size | weight | line-height | letter-spacing |
|----------|----------|-----------|-------------|-------------|----------------|
| caption1 | caption1 | 12px | Regular/400 | 20px | -0.2px |
| caption2 | caption2 | 10px | Regular/400 | 18px | -0.2px |

---

## 사용법 (Tailwind CSS)

### 컬러

```html
<!-- 배경색 -->
<div class="bg-primary-400">Primary 배경</div>
<div class="bg-gray-100">회색 배경</div>

<!-- 텍스트 색상 -->
<p class="text-primary-600">강조 텍스트</p>
<p class="text-gray-700">본문 텍스트</p>

<!-- 테두리 -->
<div class="border border-gray-200">카드</div>
```

### 타이포그래피

```html
<h1 class="typo-h1">Headline 1</h1>
<h2 class="typo-h2">Headline 2</h2>
<p class="typo-subtitle1">Subtitle Bold</p>
<p class="typo-body1">Body Text</p>
<button class="typo-btn1">Button</button>
<span class="typo-caption1">Caption</span>
```
