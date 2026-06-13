# 스타랩 홈페이지 Armory 스타일 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 콘텐츠를 전부 유지하면서 페이지 전체를 Armory 디자인 언어(블랙 모노크롬, Pretendard, 도트 그리드, 화려한 모션)로 재구성하고 구글·네이버 SEO를 최적화한다.

**Architecture:** Vite + 바닐라 HTML/CSS/JS 스택 유지. `index.html`(구조+메타+JSON-LD), `src/style.css`(디자인 토큰+반응형+모션 CSS), `src/main.js`(IntersectionObserver 리빌, 카운트업, 패럴럭스, 마키, 헤더 축소, 글자 분할)를 전면 재작성. Pannellum 제거로 외부 런타임 의존성 0개. `public/robots.txt` + `public/sitemap.xml` 신규.

**Tech Stack:** Vite 5, Vitest(happy-dom), Pretendard Variable(다이나믹 서브셋 CDN), Geist Mono(Google Fonts), 순수 CSS 애니메이션 + IntersectionObserver.

**승인된 스펙:** `docs/superpowers/specs/2026-06-13-armory-redesign-design.md`

---

## File Structure

| 파일 | 역할 |
|---|---|
| `index.html` | 전면 재작성 — 시맨틱 구조, SEO 메타, JSON-LD 2종(EducationalOrganization + FAQPage) |
| `src/style.css` | 전면 재작성 — 디자인 토큰, 8개 섹션 스타일, 반응형(1024/768/480), 모션 CSS |
| `src/main.js` | 재작성 — 모션 오케스트레이션(리빌/카운트업/패럴럭스/마키/헤더/글자분할) |
| `src/utils.js` | 순수 함수: `easeOutCubic`, `countValue` 추가, `isWebGLSupported` 제거 |
| `tests/utils.test.js` | 새 순수 함수 테스트로 교체 |
| `public/robots.txt` | 신규 — 크롤러 허용 + sitemap 위치 |
| `public/sitemap.xml` | 신규 — 단일 URL |
| `.gitignore` | `.superpowers/` 추가 |

---

### Task 1: SEO 인프라 파일 (robots.txt, sitemap.xml, .gitignore)

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `.gitignore`

- [ ] **Step 1: robots.txt 생성**

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://starlab.ai.kr/sitemap.xml
```

- [ ] **Step 2: sitemap.xml 생성**

`public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://starlab.ai.kr/</loc>
    <lastmod>2026-06-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: .gitignore에 .superpowers/ 추가**

기존 `.gitignore` 끝에 한 줄 추가:

```
.superpowers/
```

- [ ] **Step 4: 빌드 시 public 파일이 dist로 복사되는지 확인**

Run: `npm run build && ls dist/robots.txt dist/sitemap.xml`
Expected: 두 파일 경로가 출력됨 (Vite는 public/ 내용을 dist 루트로 복사)

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/sitemap.xml .gitignore
git commit -m "feat: add robots.txt and sitemap.xml for Google/Naver SEO"
```

---

### Task 2: 카운트업 순수 함수 (TDD)

**Files:**
- Modify: `src/utils.js` (전체 교체)
- Modify: `tests/utils.test.js` (전체 교체)

`isWebGLSupported`는 Pannellum 제거와 함께 더 이상 사용처가 없으므로 이 태스크에서 함께 제거한다 (main.js의 import는 Task 5에서 함께 사라지므로, 이 태스크 직후 일시적으로 main.js가 깨진 import를 갖지만 Task 5 완료 전까지 빌드하지 않는다 — 빌드 검증은 Task 6에서 수행).

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/utils.test.js` 전체를 다음으로 교체:

```javascript
import { describe, it, expect } from 'vitest';
import { easeOutCubic, countValue } from '../src/utils.js';

describe('easeOutCubic', () => {
  it('returns 0 at progress 0', () => {
    expect(easeOutCubic(0)).toBe(0);
  });

  it('returns 1 at progress 1', () => {
    expect(easeOutCubic(1)).toBe(1);
  });

  it('eases out: midpoint progress is past linear midpoint', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 5);
  });

  it('clamps progress below 0 to 0', () => {
    expect(easeOutCubic(-0.5)).toBe(0);
  });

  it('clamps progress above 1 to 1', () => {
    expect(easeOutCubic(1.5)).toBe(1);
  });
});

describe('countValue', () => {
  it('returns 0 at progress 0', () => {
    expect(countValue(500, 0)).toBe(0);
  });

  it('returns the target at progress 1', () => {
    expect(countValue(500, 1)).toBe(500);
  });

  it('returns an eased integer mid-animation', () => {
    expect(countValue(100, 0.5)).toBe(88); // round(100 * 0.875)
  });

  it('returns integers for fractional eased values', () => {
    expect(Number.isInteger(countValue(98, 0.3))).toBe(true);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test`
Expected: FAIL — `easeOutCubic`/`countValue` is not exported (SyntaxError 또는 undefined)

- [ ] **Step 3: 최소 구현 작성**

`src/utils.js` 전체를 다음으로 교체:

```javascript
/**
 * Cubic ease-out. Progress is clamped to [0, 1].
 * @param {number} t - raw progress (0..1)
 * @returns {number} eased progress (0..1)
 */
export function easeOutCubic(t) {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Eased integer value for a count-up animation frame.
 * @param {number} target - final number to count up to
 * @param {number} progress - raw progress (0..1)
 * @returns {number} integer between 0 and target
 */
export function countValue(target, progress) {
  return Math.round(target * easeOutCubic(progress));
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 9 tests passed

- [ ] **Step 5: Commit**

```bash
git add src/utils.js tests/utils.test.js
git commit -m "feat: replace WebGL util with count-up easing pure functions (TDD)"
```

---

### Task 3: index.html 전면 재작성

**Files:**
- Modify: `index.html` (전체 교체)

콘텐츠 텍스트(한글 카피, 서비스 상세, FAQ, 연락처, Tally 링크)는 기존과 동일하게 유지. 구조와 메타만 변경.

- [ ] **Step 1: index.html 전체 교체**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>스타랩 | 부산 AI 교육 · 울산 인공지능 강의 · 경남 AI 강사 특강 전문</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="부산 AI 교육, 울산 인공지능 강의, 경남 AI 강사 및 부울경 AI 워크숍/특강/컨설팅/마케팅까지! 스타랩은 지역 비즈니스의 DX 성장을 지원하는 인공지능 전문 강사진과 솔루션을 제공합니다.">
  <meta name="keywords" content="부산 AI 교육, 부산 인공지능 강의, 부산 AI 강사, 부산 AI 특강, 부산 AI 워크숍, 부산 인공지능 교육, 부산 생성형 AI 강의, 울산 AI 교육, 울산 인공지능 강의, 울산 AI 컨설팅, 경남 AI 교육, 경남 AI 강사, 경남 AI 마케팅, 부울경 AI 특강, 부울경 인공지능 워크숍, 스타랩, Starlab">
  <meta name="author" content="Starlab">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://starlab.ai.kr/">
  <meta name="naver-site-verification" content="">

  <!-- Open Graph (SNS Optimization) -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="스타랩 | 부산 AI 교육 · 울산 인공지능 강의 · 경남 AI 강사 특강">
  <meta property="og:description" content="부산, 울산, 경남 지역의 비즈니스를 혁신하는 AI 교육, 강의, 강사 파견 및 비즈니스 컨설팅/마케팅 전문 스타랩.">
  <meta property="og:image" content="https://starlab.ai.kr/assets/starlab-og.png">
  <meta property="og:url" content="https://starlab.ai.kr/">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:site_name" content="스타랩 Starlab">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="스타랩 | 부산 AI 교육 · 울산 인공지능 강의 · 경남 AI 강사 특강">
  <meta name="twitter:description" content="부산, 울산, 경남 지역의 비즈니스를 혁신하는 AI 교육, 강의, 강사 파견 및 비즈니스 컨설팅/마케팅 전문 스타랩.">
  <meta name="twitter:image" content="https://starlab.ai.kr/assets/starlab-og.png">

  <!-- Fonts: Pretendard dynamic subset + Geist Mono -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap">

  <!-- Custom Style -->
  <link rel="stylesheet" href="/src/style.css">

  <!-- Structured Schema JSON-LD: Organization -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "스타랩",
    "alternateName": "Starlab",
    "description": "부산, 울산, 경남(부울경) 지역 비즈니스의 성공적인 DX를 위한 부산 AI 교육, 부산 AI 컨설팅, 부산 AI 마케팅 및 인공지능 강의/강사 파견 전문 파트너",
    "url": "https://starlab.ai.kr",
    "logo": "https://starlab.ai.kr/assets/logo.png",
    "email": "contact@starlab-ai.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "해양로 301-1 스타랩 타워 12F",
      "addressLocality": "Busan",
      "addressCountry": "KR"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Busan" },
      { "@type": "AdministrativeArea", "name": "Ulsan" },
      { "@type": "AdministrativeArea", "name": "Gyeongsangnam-do" }
    ],
    "knowsAbout": [
      "Artificial Intelligence Education",
      "AI Consulting",
      "AI Marketing",
      "Generative AI Lecture",
      "AI Instructor"
    ]
  }
  </script>

  <!-- Structured Schema JSON-LD: FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "부산, 울산, 경남(부울경) 지역에서 스타랩의 AI 교육과 특강 강의는 어떻게 신청하나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스타랩의 교육 서비스는 온라인 문의 양식을 통해 교육 대상, 기간, 희망 주제를 접수해 주시면 개별 맞춤형 상담 전화를 드립니다. 기업 임직원 맞춤형 워크숍부터 대규모 인공지능 강의까지 다채로운 프로그램이 마련되어 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "스타랩 AI 강사진의 전문성과 교육 분야는 어떻게 되나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "스타랩은 부산 및 경남 지역에서 활발히 검증된 생성형 AI 전문 강사진을 보유하고 있습니다. 단순 툴 소개에 그치지 않고, 업무 자동화, 기획서 작성, 코딩 보조, AI 예술 디자인 생성에 이르기까지 비즈니스 실무에 직결되는 고효율 인공지능 특강을 책임집니다."
        }
      },
      {
        "@type": "Question",
        "name": "부산 AI 컨설팅 및 인공지능 마케팅 도입 시 기대 효과는 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "중소기업의 디지털 전환(DX) 시 AI 컨설팅은 불필요한 비용을 최소화하고 꼭 필요한 자율 에이전트 및 LLM 솔루션을 설계해 드립니다. 또한 AI 마케팅 도입 시, 콘텐츠 제작 속도를 혁신적으로 줄여 마케팅 예산 대비 전환 성과를 극대화할 수 있습니다."
        }
      }
    ]
  }
  </script>
</head>
<body>
  <!-- GNB Header -->
  <header class="main-header" id="main-header">
    <a href="/" class="logo" aria-label="스타랩 홈으로">
      <span class="logo-bolt" aria-hidden="true"></span>STARLAB
    </a>
    <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="상담 신청하기 (새 창)" class="btn btn-primary header-cta">
      <span class="btn-x" aria-hidden="true">↗</span>상담 신청하기
    </a>
  </header>

  <main>
    <!-- Hero Section -->
    <section id="hero" class="hero" aria-label="스타랩 소개">
      <div class="hero-bg" aria-hidden="true"></div>

      <nav class="hero-nav" aria-label="주요 서비스 바로가기">
        <a href="#services-edu"><span class="mono" aria-hidden="true">01</span>AI 교육·강의</a>
        <a href="#services-consulting"><span class="mono" aria-hidden="true">02</span>AI 컨설팅</a>
        <a href="#services-marketing"><span class="mono" aria-hidden="true">03</span>AI 마케팅</a>
        <a href="#faq"><span class="mono" aria-hidden="true">04</span>자주 묻는 질문</a>
      </nav>

      <div class="hero-main">
        <p class="hero-tagline mono">// 부산·울산·경남 No.1 인공지능 파트너</p>
        <h1 class="hero-title">
          <span class="line-mask"><span>부산 AI 교육과</span></span>
          <span class="line-mask"><span>인공지능 강의의 기준</span></span>
          <span class="line-mask"><span>스타랩</span></span>
        </h1>
        <p class="hero-desc reveal reveal-d2">
          부울경 지역의 기업, 공공기관 및 대학교를 위해 최첨단 생성형 AI 특강, 비즈니스 자동화 워크숍 및 검증된 전문 AI 강사를 매칭합니다. 기업의 성공적인 AI 컨설팅과 마케팅 혁신을 시작하세요.
        </p>
        <div class="hero-actions reveal reveal-d3">
          <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="AI 교육 및 특강 문의 (새 창)" class="btn btn-primary">
            <span class="btn-x" aria-hidden="true">↗</span>AI 교육 및 특강 문의
          </a>
          <a href="#services" class="btn btn-ghost">서비스 자세히 보기</a>
        </div>
      </div>
    </section>

    <!-- Keyword Marquee (decorative) -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track" id="marquee-track">
        <span><b>부산 AI 교육</b> · 생성형 AI 특강</span>
        <span><b>울산 인공지능 강의</b> · 제조업 DX</span>
        <span><b>경남 AI 강사</b> · 실무 워크숍</span>
        <span><b>AI 컨설팅</b> · 도입 설계</span>
        <span><b>AI 마케팅</b> · 자동화</span>
      </div>
    </div>

    <!-- Services Section -->
    <section id="services" class="services">
      <p class="sec-label mono reveal">// Services</p>
      <h2 class="sec-title split-chars">스타랩 비즈니스 솔루션</h2>

      <div class="svc-grid">
        <article id="services-edu" class="svc reveal">
          <div class="svc-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h3>AI 교육 · 강의 및 강사 파견</h3>
          <p class="svc-summary">부산, 울산, 경남 지역을 아우르는 검증된 AI 전문 강사 매칭</p>
          <ul class="svc-details">
            <li><strong>부산 AI 특강</strong>: 최신 트렌드를 다루는 단기 세미나</li>
            <li><strong>울산 AI 강의</strong>: 제조업 DX를 위한 인공지능 기초</li>
            <li><strong>경남 AI 강사 파견</strong>: 대학 및 기업 실무 생성형 AI 워크숍</li>
          </ul>
          <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="AI 강의 및 특강 문의하기 (새 창)" class="svc-link">AI 강의 및 특강 문의하기 <i aria-hidden="true">→</i></a>
        </article>

        <article id="services-consulting" class="svc reveal reveal-d1">
          <div class="svc-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h3>부산 AI 컨설팅 및 도입 설계</h3>
          <p class="svc-summary">로컬 비즈니스의 성공적인 DX를 위한 AI 아키텍처 로드맵</p>
          <ul class="svc-details">
            <li>비즈니스 구조 분석 및 도입 타당성 검토</li>
            <li>자율형 AI 에이전트 도입 기획 및 아키텍처 설계</li>
            <li>국가 R&amp;D 및 지자체 AI 솔루션 사업 연계</li>
          </ul>
          <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="무료 컨설팅 상담 신청 (새 창)" class="svc-link">무료 컨설팅 상담 신청 <i aria-hidden="true">→</i></a>
        </article>

        <article id="services-marketing" class="svc reveal reveal-d2">
          <div class="svc-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 6l-9.5 9.5-5-5L1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <h3>부산 AI 마케팅 및 자동화</h3>
          <p class="svc-summary">인공지능 도구를 활용한 대량 콘텐츠 제작 및 성과 극대화</p>
          <ul class="svc-details">
            <li>AI 광고 문구 및 소셜 미디어 디자인 생성 자동화</li>
            <li>오디언스 데이터 분석 기반 고도화된 리드 타겟팅</li>
            <li>AI 기반 마케팅 워크플로우 생산성 300% 향상</li>
          </ul>
          <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="AI 마케팅 제안 요청하기 (새 창)" class="svc-link">AI 마케팅 제안 요청하기 <i aria-hidden="true">→</i></a>
        </article>
      </div>
    </section>

    <!-- Metrics Section -->
    <section id="metrics" class="metrics" aria-label="스타랩 실적">
      <p class="sec-label mono reveal">// Track Record</p>
      <h2 class="metrics-lead reveal">숫자로 증명하는 부울경 AI 교육 성과. <em>모든 교육과 컨설팅의 결과를 측정합니다.</em></h2>
      <div class="met-grid">
        <div class="met reveal">
          <span class="met-num" data-count="500" data-suffix="+">500+</span>
          <span class="met-cap mono">부울경 AI 교육 수료생 (명)</span>
        </div>
        <div class="met reveal reveal-d1">
          <span class="met-num" data-count="98" data-suffix="%">98%</span>
          <span class="met-cap mono">강의 만족도 지표</span>
        </div>
        <div class="met reveal reveal-d2">
          <span class="met-num" data-count="50" data-suffix="+">50+</span>
          <span class="met-cap mono">기업 AI 컨설팅 실적 (건)</span>
        </div>
      </div>
    </section>

    <!-- GEO optimized Q&A (FAQ) Section — light -->
    <section id="faq" class="faq">
      <p class="sec-label mono reveal">// FAQ</p>
      <h2 class="sec-title split-chars">자주 묻는 질문</h2>
      <p class="faq-sub reveal">부산·울산·경남 AI 교육과 컨설팅에 대해 가장 많이 받는 질문들입니다.</p>

      <div class="faq-row reveal">
        <span class="faq-idx mono" aria-hidden="true">/1</span>
        <div>
          <h3>부산, 울산, 경남(부울경) 지역에서 스타랩의 AI 교육과 특강 강의는 어떻게 신청하나요?</h3>
          <p>스타랩의 교육 서비스는 <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="온라인 문의 양식 (새 창)">온라인 문의 양식</a>을 통해 교육 대상, 기간, 희망 주제를 접수해 주시면 개별 맞춤형 상담 전화를 드립니다. 기업 임직원 맞춤형 워크숍부터 대규모 인공지능 강의까지 다채로운 프로그램이 마련되어 있습니다.</p>
        </div>
      </div>
      <div class="faq-row reveal">
        <span class="faq-idx mono" aria-hidden="true">/2</span>
        <div>
          <h3>스타랩 AI 강사진의 전문성과 교육 분야는 어떻게 되나요?</h3>
          <p>스타랩은 부산 및 경남 지역에서 활발히 검증된 생성형 AI 전문 강사진을 보유하고 있습니다. 단순 툴 소개에 그치지 않고, 업무 자동화, 기획서 작성, 코딩 보조, AI 예술 디자인 생성에 이르기까지 비즈니스 실무에 직결되는 고효율 인공지능 특강을 책임집니다.</p>
        </div>
      </div>
      <div class="faq-row reveal">
        <span class="faq-idx mono" aria-hidden="true">/3</span>
        <div>
          <h3>부산 AI 컨설팅 및 인공지능 마케팅 도입 시 기대 효과는 무엇인가요?</h3>
          <p>중소기업의 디지털 전환(DX) 시 AI 컨설팅은 불필요한 비용을 최소화하고 꼭 필요한 자율 에이전트 및 LLM 솔루션을 설계해 드립니다. 또한 AI 마케팅 도입 시, 콘텐츠 제작 속도를 혁신적으로 줄여 마케팅 예산 대비 전환 성과를 극대화할 수 있습니다.</p>
        </div>
      </div>
    </section>

    <!-- CTA Band -->
    <section class="cta-band" aria-label="상담 신청">
      <div class="cta-txt reveal">
        <h2>AI 도입, 지금 시작하세요</h2>
        <p>교육·컨설팅·마케팅 무엇이든 부담 없이 문의해 주세요. 24시간 내 회신드립니다.</p>
      </div>
      <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="상담 신청하기 (새 창)" class="btn btn-primary reveal reveal-d1">
        <span class="btn-x" aria-hidden="true">↗</span>상담 신청하기
      </a>
    </section>
  </main>

  <!-- Footer -->
  <footer class="main-footer">
    <div class="foot-cols">
      <div class="reveal">
        <p class="col-label mono">// Contact</p>
        <p>contact@starlab-ai.com</p>
        <p>부산광역시 영도구 해양로 301-1 스타랩 타워 12F (부울경 본부)</p>
      </div>
      <div class="reveal reveal-d1">
        <p class="col-label mono">// Services</p>
        <a href="#services-edu">AI 교육·강의</a>
        <a href="#services-consulting">AI 컨설팅</a>
        <a href="#services-marketing">AI 마케팅</a>
      </div>
      <div class="reveal reveal-d2">
        <p class="col-label mono">// Info</p>
        <a href="#faq">자주 묻는 질문</a>
        <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" aria-label="상담 신청 (새 창)">상담 신청</a>
      </div>
    </div>
    <p class="wordmark reveal" aria-hidden="true">STARLAB</p>
    <p class="copyright mono">© 2026 STARLAB. ALL RIGHTS RESERVED.</p>
  </footer>

  <!-- Script Entry -->
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: HTML 구조 검증 (스모크)**

Run: `grep -c 'application/ld+json' index.html && grep -c '<h1' index.html && grep -c 'pannellum' index.html; true`
Expected: `2` (JSON-LD 2개), `1` (h1 1개), `0` (pannellum 참조 없음)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite index.html with Armory structure, FAQPage JSON-LD, canonical/OG/Twitter meta"
```

---

### Task 4: style.css 전면 재작성

**Files:**
- Modify: `src/style.css` (전체 교체)

- [ ] **Step 1: style.css 전체 교체**

```css
/* ============================================================
   STARLAB — Armory-style redesign
   Design tokens
   ============================================================ */
:root {
  --bg: #060606;
  --surface: #0c0c0c;
  --border: #1c1c1c;
  --border-hover: #555;
  --text: #ffffff;
  --text-muted: #9a9a9a;
  --text-dim: #777;
  --text-faint: #555;
  --light-bg: #ededeb;
  --light-text: #0a0a0a;
  --light-muted: #555;
  --light-border: #d4d4d0;

  --font-sans: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', Menlo, monospace;

  --pad-x: 40px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

a { color: inherit; text-decoration: none; }
ul { list-style: none; }

.mono {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 3px;
}

/* ============================================================
   Buttons
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 4px;
  min-height: 44px;
  transition: background 0.25s, color 0.25s, transform 0.25s var(--ease-out);
}

.btn-primary { background: var(--text); color: #000; }
.btn-primary:hover { background: #d6d6d6; transform: translateY(-2px); }

.btn-x {
  font-family: var(--font-mono);
  background: #000;
  color: var(--text);
  padding: 2px 6px;
  font-size: 11px;
  border-radius: 2px;
  transition: transform 0.35s var(--ease-bounce);
}
.btn-primary:hover .btn-x { transform: rotate(45deg); }

.btn-ghost {
  background: transparent;
  border: 1px solid #333;
  color: #ccc;
  font-weight: 500;
}
.btn-ghost:hover { background: #161616; color: var(--text); transform: translateY(-2px); }

/* ============================================================
   Reveal animations
   ============================================================ */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out);
}
.reveal.in { opacity: 1; transform: none; }
.reveal-d1 { transition-delay: 0.12s; }
.reveal-d2 { transition-delay: 0.24s; }
.reveal-d3 { transition-delay: 0.36s; }

/* hero h1 line mask reveal */
.line-mask { display: block; overflow: hidden; }
.line-mask > span {
  display: block;
  transform: translateY(115%);
  transition: transform 1s var(--ease-out);
}
body.loaded .line-mask > span { transform: none; }
.line-mask:nth-child(2) > span { transition-delay: 0.12s; }
.line-mask:nth-child(3) > span { transition-delay: 0.24s; }

/* section title char stagger (spans injected by main.js) */
.split-chars .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.6em) rotate(4deg);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}
.split-chars.in .char { opacity: 1; transform: none; }

/* ============================================================
   Header
   ============================================================ */
.main-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px var(--pad-x);
  background: rgba(6, 6, 6, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: padding 0.35s var(--ease-out);
}
.main-header.scrolled { padding: 10px var(--pad-x); }

.logo {
  font-weight: 800;
  font-size: 17px;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-bolt {
  width: 18px;
  height: 18px;
  background: var(--text);
  clip-path: polygon(60% 0, 15% 58%, 45% 58%, 40% 100%, 85% 42%, 55% 42%);
}

/* ============================================================
   Hero
   ============================================================ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 110px var(--pad-x) 64px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: -14% 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 15%, rgba(58, 58, 70, 0.5), transparent 60%),
    radial-gradient(ellipse 60% 50% at 15% 95%, rgba(40, 40, 50, 0.55), transparent 65%),
    radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px) 0 0 / 24px 24px,
    var(--bg);
  will-change: transform;
  z-index: 0;
}

.hero-nav { margin-left: auto; position: relative; z-index: 1; }
.hero-nav a {
  display: block;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.75;
  transition: color 0.2s, padding-left 0.25s var(--ease-out);
}
.hero-nav a .mono {
  color: var(--text-faint);
  font-size: 12px;
  margin-right: 12px;
  vertical-align: middle;
}
.hero-nav a:hover { color: var(--text-muted); padding-left: 8px; }

.hero-main { margin-top: auto; position: relative; z-index: 1; }

.hero-tagline {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 22px;
}

.hero-title {
  font-size: clamp(44px, 8.5vw, 110px);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.035em;
}

.hero-desc {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.75;
  max-width: 560px;
  margin-top: 26px;
}

.hero-actions { margin-top: 34px; display: flex; gap: 12px; flex-wrap: wrap; }

/* ============================================================
   Marquee
   ============================================================ */
.marquee {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  padding: 14px 0;
}
.marquee-track {
  display: flex;
  gap: 48px;
  width: max-content;
  animation: marquee-scroll 22s linear infinite;
}
.marquee:hover .marquee-track { animation-play-state: paused; }
.marquee-track span { color: #666; font-size: 12px; white-space: nowrap; }
.marquee-track span b { color: var(--text); font-weight: 500; }
@keyframes marquee-scroll { to { transform: translateX(-50%); } }

/* ============================================================
   Sections (shared)
   ============================================================ */
section { padding: 110px var(--pad-x); }
.hero { padding-top: 110px; } /* hero keeps its own top padding */

.sec-label { color: var(--text-dim); font-size: 11px; margin-bottom: 14px; }
.sec-title {
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 56px;
}

/* ============================================================
   Services
   ============================================================ */
.services {
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.svc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-left: 1px solid var(--border);
}

.svc {
  border-right: 1px solid var(--border);
  padding: 8px 30px 24px;
  transition: background 0.3s;
}
.svc:hover { background: rgba(255, 255, 255, 0.025); }

.svc-icon {
  width: 52px;
  height: 52px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  margin-bottom: 80px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s var(--ease-bounce), border-color 0.3s;
}
.svc-icon svg { width: 24px; height: 24px; }
.svc:hover .svc-icon { transform: translateY(-6px) rotate(-6deg); border-color: var(--border-hover); }

.svc h3 { font-size: 19px; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.01em; }
.svc-summary { color: #8d8d8d; font-size: 14px; line-height: 1.65; margin-bottom: 16px; }
.svc-details li { color: #aaa; font-size: 13px; line-height: 1.9; }
.svc-details li::before { content: "→ "; color: var(--text-faint); }

.svc-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #444;
  padding-bottom: 3px;
  transition: border-color 0.2s;
}
.svc-link:hover { border-color: var(--text); }
.svc-link i { font-style: normal; display: inline-block; transition: transform 0.25s var(--ease-out); }
.svc-link:hover i { transform: translateX(5px); }

/* ============================================================
   Metrics
   ============================================================ */
.metrics-lead {
  font-size: clamp(22px, 2.6vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  max-width: 640px;
  margin-bottom: 64px;
  line-height: 1.35;
}
.metrics-lead em { color: #666; font-style: normal; }

.met-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--border);
}
.met { padding: 44px 30px; border-right: 1px solid var(--border); display: flex; flex-direction: column; }
.met:last-child { border-right: 0; }
.met-num {
  font-size: clamp(56px, 7vw, 96px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.met-cap { color: var(--text-dim); font-size: 11px; margin-top: 18px; }

/* ============================================================
   FAQ (light section)
   ============================================================ */
.faq { background: var(--light-bg); color: var(--light-text); }
.faq .sec-label { color: #888; }
.faq .sec-title { margin-bottom: 8px; }
.faq-sub {
  color: var(--light-muted);
  font-size: 15px;
  max-width: 540px;
  margin-bottom: 48px;
  line-height: 1.6;
}

.faq-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 24px;
  border-top: 1px solid var(--light-border);
  padding: 34px 0;
  transition: background 0.25s;
}
.faq-row:hover { background: rgba(0, 0, 0, 0.025); }
.faq-idx { color: var(--light-muted); font-size: 13px; }
.faq-row h3 { font-size: 19px; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.01em; }
.faq-row p { color: var(--light-muted); font-size: 14.5px; line-height: 1.75; max-width: 760px; }
.faq-row a { text-decoration: underline; text-underline-offset: 3px; }

/* ============================================================
   CTA band
   ============================================================ */
.cta-band {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  border-top: 1px solid var(--border);
  padding: 72px var(--pad-x);
  flex-wrap: wrap;
}
.cta-txt h2 {
  display: block;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}
.cta-txt p { color: #999; font-size: 14px; max-width: 480px; line-height: 1.7; }

/* ============================================================
   Footer
   ============================================================ */
.main-footer {
  border-top: 1px solid var(--border);
  padding: 64px var(--pad-x) 0;
  overflow: hidden;
}

.foot-cols {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 72px;
}
.col-label { color: var(--text-faint); font-size: 10px; margin-bottom: 16px; }
.foot-cols a, .foot-cols p:not(.col-label) {
  color: #999;
  font-size: 13px;
  line-height: 2.1;
  display: block;
  transition: color 0.2s;
}
.foot-cols a:hover { color: var(--text); }

.wordmark {
  font-weight: 900;
  font-size: 18.5vw;
  line-height: 0.72;
  letter-spacing: -0.05em;
  text-align: center;
  margin-bottom: -0.06em;
  user-select: none;
  white-space: nowrap;
}

.copyright {
  border-top: 1px solid var(--border);
  padding: 18px 0;
  text-align: center;
  color: var(--text-faint);
  font-size: 10px;
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 1024px) {
  .svc-grid, .met-grid { grid-template-columns: repeat(2, 1fr); }
  .svc:last-child, .met:last-child {
    grid-column: 1 / -1;
    border-top: 1px solid var(--border);
    border-right: 0;
  }
  .svc-icon { margin-bottom: 48px; }
}

@media (max-width: 768px) {
  :root { --pad-x: 24px; }

  .hero { padding-top: 96px; min-height: auto; padding-bottom: 56px; }
  .hero-nav { margin-left: 0; margin-bottom: 48px; }
  .hero-nav a { font-size: 17px; line-height: 2; }

  section { padding: 72px var(--pad-x); }

  .svc-grid, .met-grid { grid-template-columns: 1fr; border-left: 0; }
  .svc {
    border-right: 0;
    border-top: 1px solid var(--border);
    padding: 24px 0;
  }
  .svc:first-child { border-top: 0; }
  .svc:last-child { border-top: 1px solid var(--border); }
  .svc-icon { margin-bottom: 28px; }
  .met { border-right: 0; border-top: 1px solid var(--border); padding: 32px 0; }
  .met:first-child { border-top: 0; }

  .faq-row { grid-template-columns: 1fr; gap: 8px; padding: 26px 0; }

  .cta-band { flex-direction: column; align-items: flex-start; padding: 56px var(--pad-x); }

  .foot-cols { grid-template-columns: 1fr; gap: 28px; }
}

@media (max-width: 480px) {
  :root { --pad-x: 20px; }
  .hero-actions .btn { width: 100%; justify-content: center; }
  .header-cta { font-size: 13px; padding: 10px 16px; }
}

/* ============================================================
   Reduced motion
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal, .split-chars .char { opacity: 1; transform: none; transition: none; }
  .reveal-d1, .reveal-d2, .reveal-d3 { transition-delay: 0s; }
  .line-mask > span { transform: none; transition: none; }
  .line-mask:nth-child(2) > span,
  .line-mask:nth-child(3) > span { transition-delay: 0s; }
  .marquee-track { animation: none; }
  .btn, .svc-icon, .svc-link i { transition: none; }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공 (main.js의 깨진 import는 Task 5에서 해소 — 이 시점에 실패하면 Task 5 완료 후 재확인)

참고: Task 2에서 `isWebGLSupported`를 제거했으므로 기존 main.js가 빌드 에러를 낼 수 있다. 이 경우 이 Step은 건너뛰고 Task 5 완료 후 빌드를 확인한다.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: rewrite style.css with Armory design tokens, responsive grid, motion system"
```

---

### Task 5: main.js 재작성 (모션 오케스트레이션)

**Files:**
- Modify: `src/main.js` (전체 교체)

- [ ] **Step 1: main.js 전체 교체**

```javascript
import { countValue } from './utils.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COUNT_DURATION_MS = 1400;
const PARALLAX_FACTOR = 0.25;
const CHAR_STAGGER_MS = 35;

/** Duplicate marquee content once for a seamless 50% loop. */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/** Split section titles into per-char spans for staggered reveal. */
function initCharSplit() {
  document.querySelectorAll('.split-chars').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('aria-hidden', 'true');
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.transitionDelay = `${i * CHAR_STAGGER_MS}ms`;
      wrapper.appendChild(span);
    });
    el.replaceChildren(wrapper);
  });
}

/** Animate a metric number from 0 to its data-count target. */
function startCountUp(numEl) {
  if (numEl.dataset.done) return;
  numEl.dataset.done = '1';
  const target = Number(numEl.dataset.count);
  const suffix = numEl.dataset.suffix || '';
  if (!Number.isFinite(target)) return;
  const t0 = performance.now();
  const tick = (now) => {
    const progress = (now - t0) / COUNT_DURATION_MS;
    numEl.textContent = countValue(target, progress) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Reveal-on-scroll for .reveal and .split-chars elements. */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .split-chars');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      const num = entry.target.querySelector('.met-num');
      if (num) startCountUp(num);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  targets.forEach((el) => io.observe(el));
}

/** Hero background parallax (transform-only, rAF-throttled). */
function initParallax() {
  const bg = document.querySelector('.hero-bg');
  const hero = document.getElementById('hero');
  if (!bg || !hero) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < hero.offsetHeight) {
        bg.style.transform = `translateY(${y * PARALLAX_FACTOR}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
}

/** Shrink fixed header after scrolling past the fold start. */
function initHeaderShrink() {
  const header = document.getElementById('main-header');
  if (!header) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  initMarquee();

  if (REDUCED_MOTION) {
    // CSS already forces visible state; ensure metric numbers show final values.
    document.querySelectorAll('.met-num').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    document.body.classList.add('loaded');
    return;
  }

  initCharSplit();
  initReveal();
  initParallax();
  initHeaderShrink();

  // Hero entrance (double rAF so initial styles are committed first)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  }));
});
```

- [ ] **Step 2: 테스트 + 빌드 확인**

Run: `npm test && npm run build`
Expected: 테스트 9개 PASS, 빌드 성공 (이 시점부터 깨진 import 없음)

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: rewrite main.js with reveal/count-up/parallax/marquee/header motion"
```

---

### Task 6: 통합 검증 (브라우저 QA)

**Files:** 없음 (검증 전용)

- [ ] **Step 1: dev 서버 기동**

Run (백그라운드): `npm run dev`
Expected: `Local: http://localhost:5173/` 출력

- [ ] **Step 2: 데스크톱 검증**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://localhost:5173
$B console --errors
$B network
$B viewport 1440x900
$B screenshot /tmp/redesign-desktop.png
```

Expected: 콘솔 에러 0, 실패한 네트워크 요청 0 (404 없음). 스크린샷을 Read 도구로 확인 — 히어로 헤드라인/네비/CTA가 시안과 일치.

- [ ] **Step 3: 반응형 검증**

```bash
$B responsive /tmp/redesign
```

Expected: `/tmp/redesign-mobile.png`(375px), `-tablet.png`(768px), `-desktop.png`(1280px) 생성. Read 도구로 3장 모두 확인 — 모바일에서 1컬럼 스택, 가로 스크롤 없음, 버튼 풀폭.

- [ ] **Step 4: 핵심 요소 동작 확인**

```bash
$B js "JSON.stringify({h1: !!document.querySelector('h1'), jsonld: document.querySelectorAll('script[type=\"application/ld+json\"]').length, canonical: document.querySelector('link[rel=canonical]')?.href, marqueeChildren: document.getElementById('marquee-track').children.length})"
$B js "window.scrollTo(0, document.body.scrollHeight); 'ok'"
$B js "document.querySelector('.met-num').textContent"
```

Expected: `h1: true`, `jsonld: 2`, `canonical: "https://starlab.ai.kr/"`, `marqueeChildren: 10` (5×2 복제). 스크롤 후 met-num이 `500+` (카운트업 완료).

- [ ] **Step 5: JSON-LD 구조 검증**

```bash
$B js "JSON.stringify([...document.querySelectorAll('script[type=\"application/ld+json\"]')].map(s => { const d = JSON.parse(s.textContent); return { type: d['@type'], valid: d['@type'] === 'FAQPage' ? d.mainEntity.every(q => q['@type'] === 'Question' && q.acceptedAnswer['@type'] === 'Answer') : !!d.url }; }))"
```

Expected: `[{"type":"EducationalOrganization","valid":true},{"type":"FAQPage","valid":true}]`

- [ ] **Step 6: dev 서버 종료 후 최종 빌드 + 커밋 (잔여 변경이 있을 때만)**

```bash
npm run build
git status --short
```

Expected: 빌드 성공. 변경 파일이 남아 있으면 검토 후 `fix:` 커밋, 없으면 종료.

---

## Self-Review 결과

- **스펙 커버리지**: 섹션 8개(Task 3), 디자인 토큰·반응형·모션 CSS(Task 4), JS 모션 6종(Task 5), SEO 메타·JSON-LD(Task 3), robots/sitemap(Task 1), 테스트(Task 2, 6) — 스펙의 모든 요구사항에 대응하는 태스크 존재.
- **글자 분할 aria**: `aria-label` 원문 + 내부 `aria-hidden` 래퍼로 스크린리더 호환 처리(Task 5 Step 1).
- **타입/네이밍 일관성**: `countValue`(Task 2 정의 → Task 5 사용), `.split-chars`/`.char`(Task 4 CSS ↔ Task 5 JS), `data-count`/`data-suffix`(Task 3 HTML ↔ Task 5 JS), `#marquee-track`/`#main-header`/`.hero-bg`(Task 3 ↔ Task 5) 모두 일치 확인.
- **Task 2~5 사이 일시적 빌드 깨짐**: Task 2 직후 main.js가 제거된 export를 import하는 상태 — Task 4 Step 2와 Task 5 Step 2에 명시적으로 안내함.
