# 스타랩 홈페이지 Armory 스타일 리디자인 — 설계 문서

날짜: 2026-06-13
상태: 승인 대기

## 목표

기존 콘텐츠(한글 카피, 서비스 3종, FAQ 3개, 통계, 연락처)를 전부 유지하면서, 페이지 전체 디자인을
[Armory Framer 템플릿](https://armory.framer.ai)의 디자인 언어로 재구성한다.
유료 템플릿이므로 에셋·코드·이미지를 복사하지 않고, 디자인 언어(레이아웃 구조, 컬러, 타이포 스타일)를
원본 코드로 재현한다. 최우선 요구사항은 구글·네이버 SEO 최적화.

## 확정된 결정 사항

| 항목 | 결정 |
|---|---|
| 360° 파노라마(Pannellum) | 제거. 정적 다크 그라디언트 + 도트 그리드 배경으로 교체 |
| 섹션 구조 | Armory 리듬에 맞춰 재배치 (아래 섹션 명세 참조) |
| 한글 폰트 | Pretendard Variable (다이나믹 서브셋 woff2, CDN) |
| 보조 폰트 | Geist Mono (라벨/번호 전용, 라틴 문자만 사용) |
| 도메인 | https://starlab.ai.kr (canonical, sitemap, OG, JSON-LD 전부 통일) |
| 애니메이션 | "더 화려하게" — 패럴럭스, 글자/라인 스태거, 카운트업, 마키 등 |
| 반응형 | 모바일 완전 대응 (375px~) |
| 기술 스택 | 현재 유지: Vite + 바닐라 HTML/CSS/JS, 외부 런타임 의존성 0개 |

## 디자인 시스템

### 컬러 토큰
```
--bg:            #060606   (페이지 기본 배경)
--surface:       #0c0c0c   (카드/아이콘 배경)
--border:        #1c1c1c   (구분선)
--border-hover:  #555
--text:          #ffffff
--text-muted:    #9a9a9a
--text-dim:      #555–#777 (라벨, 인덱스)
--light-bg:      #ededeb   (FAQ 라이트 섹션)
--light-text:    #0a0a0a
--light-border:  #d4d4d0
```
모노크롬 초고대비. 별도 강조색 없음 (CTA는 흰 배경 + 검은 텍스트 반전).

### 타이포그래피
- 헤드라인/본문: `"Pretendard Variable", Pretendard, sans-serif`
- 라벨/번호/캡션: `"Geist Mono", Menlo, monospace` — 대문자, letter-spacing 0.12em, `//` 프리픽스 관용구
- h1: `clamp(48px, 8.5vw, 110px)`, weight 800, letter-spacing -0.035em, line-height 1.0
- 섹션 타이틀(h2): `clamp(30px, 4vw, 48px)`, weight 800
- 메트릭 숫자: `clamp(56px, 7vw, 96px)`, weight 800, tabular-nums

### 질감
- 도트 그리드: `radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)`, 24px 간격 — 히어로·서비스 섹션
- 히어로 배경: 다크 radial-gradient 2개 겹침 (외부 이미지 없음)
- 1px 보더 라인으로 그리드 분할 (Armory 특유의 청사진 느낌)

## 섹션 명세 (위→아래)

1. **고정 헤더** — 볼트(번개) 마크 + STARLAB 워드마크(좌), 흰색 CTA 버튼 "상담 신청하기"(우).
   `rgba(6,6,6,0.7)` + backdrop blur. 스크롤 시 항상 고정.
2. **히어로 (100vh)** — 우상단: 번호 매긴 세로 네비(01 AI 교육·강의 / 02 AI 컨설팅 / 03 AI 마케팅 / 04 자주 묻는 질문).
   좌하단: 모노 태그라인(`// 부산·울산·경남 No.1 인공지능 파트너`) → 초대형 h1 3줄 → 설명문 → CTA 2개(흰 버튼 + 고스트 버튼).
   기존 hero-stats-panel은 메트릭 섹션으로 이동.
3. **키워드 마키** — 무한 흐름 띠: "부산 AI 교육 · 울산 인공지능 강의 · 경남 AI 강사 · AI 컨설팅 · AI 마케팅".
   `aria-hidden="true"` (장식용, 스크린리더 제외). SEO 키워드는 본문에 이미 존재하므로 중복 부담 없음.
4. **서비스 (`#services`)** — `// Services` 라벨 + "스타랩 비즈니스 솔루션" h2.
   기존 서비스 카드 3개를 1px 보더로 분할된 3컬럼 그리드로. 각 카드: 라인 아이콘 박스(SVG 유지) → h3 → 요약 → 상세 리스트(→ 불릿) → 문의 링크.
   기존 앵커 id(`services-edu`, `services-consulting`, `services-marketing`) 유지.
5. **메트릭** — `// Track Record` 라벨 + 리드 문장("숫자로 증명하는 부울경 AI 교육 성과...") +
   대형 숫자 3개: 500+(수료생) / 98%(만족도) / 50+(컨설팅 실적). 보더 분할 3컬럼.
6. **FAQ (`#faq`, 라이트 섹션)** — 페이지 유일의 반전 섹션(#ededeb). `// FAQ` 라벨 + h2 +
   `/1 /2 /3` 모노 인덱스가 붙은 행 그리드. 기존 질문/답변 텍스트 그대로.
7. **CTA 밴드** — "AI 도입, 지금 시작하세요" + 안내문 + 흰색 CTA 버튼.
8. **푸터** — 3컬럼(// Contact: 이메일·주소 / // Services: 앵커 링크 / // Info: FAQ·상담) →
   화면 폭을 가득 채우는 초대형 STARLAB 워드마크(`font-size: 18.5vw`, 하단 크롭) → 카피라이트 라인.

모든 CTA는 기존 Tally 링크(`https://tally.so/r/n12345`), `target="_blank" rel="noopener noreferrer"` + aria-label 유지.

## 애니메이션 명세 ("화려하게" 등급)

외부 라이브러리 없이 CSS transform/opacity + IntersectionObserver만 사용 (CLS 0 보장).

1. **히어로 진입**: h1 라인 마스크 리빌(3줄 순차, cubic-bezier(0.16,1,0.3,1)) + 태그라인/설명/CTA 스태거 페이드업
2. **글자 단위 스태거**: 섹션 타이틀(h2)은 글자별 순차 리빌 (JS로 span 분할, aria-label로 원문 보존)
3. **스크롤 리빌**: 모든 섹션 요소 페이드업 + 계단식 딜레이 (threshold 0.2, 1회만)
4. **패럴럭스**: 히어로 배경 그라디언트·도트 그리드가 스크롤에 따라 느리게 이동 (`transform: translateY`, rAF 스로틀)
5. **카운트업**: 메트릭 숫자 0 → 목표값, ease-out cubic, 1.4s
6. **마키**: 28s 무한 루프, 호버 시 일시정지
7. **호버**: 서비스 카드(배경 밝아짐 + 아이콘 점프/회전), 버튼(들림 + 색 변화), 링크(화살표 슬라이드 + 보더 강조), 네비(색상 + 들여쓰기)
8. **헤더**: 스크롤 다운 시 축소(패딩 감소), 업 시 복원
9. **접근성**: `prefers-reduced-motion: reduce` 시 모든 모션 비활성화 (글자 분할 포함 즉시 표시)

## 반응형 명세

| 브레이크포인트 | 변경 사항 |
|---|---|
| ≤1024px | 서비스/메트릭 그리드 3→2컬럼 (마지막 항목 풀폭), h1 축소(clamp 자동) |
| ≤768px | 모든 그리드 1컬럼 스택. 히어로 세로 네비는 헤드라인 위(상단 우측 정렬 → 좌측 정렬 블록)로 이동하고 폰트 크기 축소(24px→17px). FAQ 인덱스 컬럼 80px→질문 위 인라인. CTA 밴드 세로 스택. 푸터 3컬럼→1컬럼 |
| ≤480px | 패딩 40px→20px, 버튼 풀폭, 워드마크 자동 축소(vw 단위라 자연 대응) |

- 터치 타겟 최소 44px
- 마키·패럴럭스는 모바일에서도 동작하되 부담 없는 transform만 사용
- 가로 스크롤 발생 금지 (overflow-x: hidden은 워드마크 컨테이너에만 국소 적용)

## SEO 명세 (구글 + 네이버)

### 메타 (head)
- `<title>` 기존 유지: "스타랩 | 부산 AI 교육 · 울산 인공지능 강의 · 경남 AI 강사 특강 전문"
- description/keywords/author 기존 유지
- `<link rel="canonical" href="https://starlab.ai.kr/">` 신규
- OG: og:url을 `https://starlab.ai.kr`로, og:image를 `https://starlab.ai.kr/assets/starlab-og.png` 절대경로로 수정. og:locale(ko_KR), og:site_name 추가
- Twitter Card(summary_large_image) 신규
- `<meta name="naver-site-verification" content="">` 자리 추가 (값은 서치어드바이저 등록 시 입력)
- `<meta name="robots" content="index, follow">`

### JSON-LD
- 기존 `EducationalOrganization` 유지, url/logo를 starlab.ai.kr로 갱신
- **`FAQPage` 스키마 신규** — FAQ 3개 질문/답변 매핑 (구글 리치 결과 대상)

### 신규 파일
- `public/robots.txt` — 전체 허용(User-agent: * / Allow: /), `Sitemap: https://starlab.ai.kr/sitemap.xml` 명시
- `public/sitemap.xml` — 단일 URL + lastmod

### 성능 (Core Web Vitals)
- Pannellum CSS/JS CDN 2개 제거 (외부 런타임 의존성 0)
- Pretendard 다이나믹 서브셋: `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css` (preconnect + font-display: swap 내장)
- Geist Mono: Google Fonts, 필요 weight(400,500)만
- 애니메이션은 transform/opacity 전용 — CLS 0
- 이미지: starlab-studio-360.webp는 더 이상 사용하지 않음(파일은 보관), OG 이미지만 유지

### 시맨틱 마크업
- h1 1개(히어로) → h2(섹션 타이틀) → h3(서비스 카드, FAQ 질문) 위계
- `<header>` / `<main>` / `<section>` / `<footer>` 랜드마크 유지
- 마키는 `aria-hidden`, 글자 분할 타이틀은 `aria-label` 원문 제공
- 모든 링크 aria-label 기존 수준 유지

## 파일 변경 계획

| 파일 | 작업 |
|---|---|
| `index.html` | 전면 재작성 (콘텐츠 텍스트는 그대로, 구조·메타 갱신) |
| `src/style.css` | 전면 재작성 (디자인 토큰 + 섹션 스타일 + 반응형 + 모션) |
| `src/main.js` | 재작성: Pannellum 초기화 제거 → 리빌 옵저버, 카운트업, 패럴럭스, 마키, 헤더 축소, 글자 분할 |
| `src/utils.js` | 유지 + 카운트업 이징 등 순수 함수 추가 (테스트 대상) |
| `tests/utils.test.js` | 신규 순수 함수 테스트 추가 |
| `public/robots.txt` | 신규 |
| `public/sitemap.xml` | 신규 |
| `public/assets/starlab-studio-360.webp` | 미사용 처리 (삭제하지 않고 보관) |

## 테스트 / 검증

1. `npm test` — utils 순수 함수(이징, 카운트업 계산 등) 단위 테스트
2. `npm run build` 성공 확인
3. `/browse`로 데스크톱(1440px)·태블릿(768px)·모바일(375px) 스크린샷 검증
4. 콘솔 에러 0, 404 리소스 0 확인
5. JSON-LD를 구글 리치 결과 테스트 형식에 맞게 구조 검증 (필수 필드 존재 확인)
6. `prefers-reduced-motion` 동작 확인

## 범위 제외 (YAGNI)

- 다국어(영문) 페이지, 블로그/서브페이지, CMS 연동
- 폰트 셀프호스팅 (CDN 서브셋으로 충분; 추후 필요 시 전환)
- 네이버 서치어드바이저/구글 서치콘솔 실제 등록 (배포 후 사용자가 수행, verification 메타 자리만 제공)
- 이메일 주소 등 콘텐츠 텍스트 변경 (contact@starlab-ai.com 그대로 유지)
