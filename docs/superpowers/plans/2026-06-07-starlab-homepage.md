# Starlab Immersive Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a highly-optimized, mobile-responsive, immersive 360° landing page for Starlab using Vite, Pannellum, and custom vanilla CSS/JS, fully optimized for regional SEO/GEO keyword combinations.

**Architecture:** A static single-page application built with Vite. The background features a WebGL 360° panorama viewer (Pannellum 2.5.6) loaded asynchronously. Layout layers are positioned using modern CSS grid and flexbox with pointer-events configurations to prevent overlay interaction blocking.

**Tech Stack:** Vite, Vanilla HTML5, Vanilla CSS, Vanilla JavaScript, Pannellum 2.5.6 (CDN), Vitest (for unit testing)

---

### Task 1: Project Setup and Dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Test: `tests/utils.test.js`

- [x] **Step 1: Create package.json**
  Create `package.json` with scripts for dev, build, preview, and test.
  ```json
  {
    "name": "starlab-homepage",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "test": "vitest run"
    },
    "devDependencies": {
      "vite": "^5.0.0",
      "vitest": "^1.0.0",
      "happy-dom": "^12.0.0"
    }
  }
  ```

- [x] **Step 2: Create vite.config.js**
  Create `vite.config.js` to configure the Vite build process.
  ```javascript
  import { defineConfig } from 'vite';

  export default defineConfig({
    root: './',
    build: {
      outDir: 'dist',
      minify: 'esbuild',
    },
    test: {
      environment: 'happy-dom',
    }
  });
  ```

- [x] **Step 3: Run npm install**
  Run: `npm install`
  Expected: Installation finishes successfully and creates `node_modules`.

- [x] **Step 4: Commit**
  Run:
  ```bash
  git add package.json vite.config.js package-lock.json
  git commit -m "chore: initialize project dependencies and configuration"
  ```

---

### Task 2: Implement WebGL Support Detection (TDD)

**Files:**
- Create: `src/utils.js`
- Create: `tests/utils.test.js`

- [x] **Step 1: Write failing test for isWebGLSupported**
  Create `tests/utils.test.js` with a test case checking that WebGL is detected.
  ```javascript
  import { describe, it, expect } from 'vitest';
  import { isWebGLSupported } from '../src/utils.js';

  describe('isWebGLSupported', () => {
    it('should return true when WebGL context is available', () => {
      const mockCanvas = {
        getContext: (type) => {
          if (type === 'webgl' || type === 'experimental-webgl') {
            return {};
          }
          return null;
        }
      };
      const mockWindow = {
        WebGLRenderingContext: {},
        document: {
          createElement: () => mockCanvas
        }
      };
      expect(isWebGLSupported(mockWindow)).toBe(true);
    });

    it('should return false when WebGL context is unavailable', () => {
      const mockCanvas = {
        getContext: () => null
      };
      const mockWindow = {
        WebGLRenderingContext: {},
        document: {
          createElement: () => mockCanvas
        }
      };
      expect(isWebGLSupported(mockWindow)).toBe(false);
    });
  });
  ```

- [x] **Step 2: Run test to verify it fails**
  Run: `npm run test`
  Expected: FAIL with "isWebGLSupported is not defined" or similar export error.

- [x] **Step 3: Implement minimal code in src/utils.js**
  Create `src/utils.js` and implement the detection helper.
  ```javascript
  export function isWebGLSupported(win = window) {
    try {
      const canvas = win.document.createElement('canvas');
      return !!(win.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  ```

- [x] **Step 4: Run test to verify it passes**
  Run: `npm run test`
  Expected: PASS

- [x] **Step 5: Commit**
  Run:
  ```bash
  git add src/utils.js tests/utils.test.js
  git commit -m "feat: add webgl support detection helper with tests"
  ```

---

### Task 3: Create HTML Entry with Meta tags (SEO/GEO)

**Files:**
- Create: `index.html`

- [x] **Step 1: Create index.html layout**
  Write the index.html file with SEO meta tags, title, link to CSS, script entry, and external CDN for Pannellum. Make sure to use combinations of [부산, 울산, 경남, 부울경] + [AI, 인공지능] + [교육, 강의, 강사, 컨설팅, 마케팅].
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
    
    <!-- Open Graph (SNS Optimization) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="스타랩 | 부산 AI 교육 · 울산 인공지능 강의 · 경남 AI 강사 특강">
    <meta property="og:description" content="부산, 울산, 경남 지역의 비즈니스를 혁신하는 AI 교육, 강의, 강사 파견 및 비즈니스 컨설팅/마케팅 전문 스타랩.">
    <meta property="og:image" content="/assets/starlab-og.png">
    <meta property="og:url" content="https://starlab-ai.com">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- Pannellum CSS CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
    
    <!-- Custom Style -->
    <link rel="stylesheet" href="/src/style.css">
  </head>
  <body>
    <!-- Background Panorama Container -->
    <div id="panorama-container">
      <div id="panorama"></div>
      <div class="panorama-fallback"></div>
      <div class="panorama-overlay"></div>
    </div>

    <!-- UI Overlay Wrap -->
    <div class="ui-wrapper">
      <!-- GNB Header -->
      <header class="main-header">
        <div class="header-container">
          <a href="#" class="logo">STARLAB</a>
          <nav class="nav-links">
            <a href="#services-edu">AI 교육·강의</a>
            <a href="#services-consulting">AI 컨설팅</a>
            <a href="#services-marketing">AI 마케팅</a>
            <a href="#faq">자주 묻는 질문</a>
          </nav>
          <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" class="btn-cta header-cta">상담 신청하기</a>
        </div>
      </header>

      <!-- Main Layout -->
      <main class="main-content">
        <!-- Hero Section -->
        <section id="hero" class="hero-section">
          <div class="hero-content">
            <span class="hero-tagline">부산·울산·경남 No.1 인공지능 파트너</span>
            <h1 class="hero-title">부산 AI 교육과<br>인공지능 강의의 기준<br><span class="brand-highlight">스타랩</span></h1>
            <p class="hero-description">
              부울경 지역의 기업, 공공기관 및 대학교를 위해 최첨단 생성형 AI 특강, 비즈니스 자동화 워크숍 및 검증된 전문 AI 강사를 매칭합니다. 기업의 성공적인 AI 컨설팅과 마케팅 혁신을 시작하세요.
            </p>
            <div class="hero-actions">
              <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" class="btn-cta hero-cta-primary">AI 교육 및 특강 문의</a>
              <a href="#services-edu" class="btn-cta hero-cta-secondary">서비스 자세히 보기</a>
            </div>
          </div>
          
          <!-- Stat cards layout -->
          <div class="hero-stats-panel">
            <div class="stat-card">
              <span class="stat-value">500+명</span>
              <span class="stat-label">부울경 AI 교육 수료생</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">98%</span>
              <span class="stat-label">강의 만족도 지표</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">50+건</span>
              <span class="stat-label">기업 AI 컨설팅 실적</span>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Script Entry -->
    <script type="module" src="/src/main.js"></script>
    <!-- Pannellum JS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" defer></script>
  </body>
  </html>
  ```

- [x] **Step 2: Verify HTML loading in dev mode**
  Create a temporary empty file `src/style.css` and `src/main.js` so that Vite doesn't fail.
  Run: `touch src/style.css src/main.js`
  Run: `npm run build`
  Expected: Build succeeds and produces the static page.

- [x] **Step 3: Commit**
  Run:
  ```bash
  git add index.html src/style.css src/main.js
  git commit -m "feat: add main HTML entry file with complete SEO meta tags and GNB/Hero layout"
  ```

---

### Task 4: Implement CSS Styles and Layout Base

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Write Reset and Global Variables in style.css**
  Define color tokens, typography settings, and the custom pointer-events configuration.
  ```css
  :root {
    --color-bg: #0A1128;
    --color-bg-rgb: 10, 17, 40;
    --color-surface: #1C2541;
    --color-accent: #00F5D4;
    --color-text: #FFFFFF;
    --color-text-muted: #8E9AAF;
    
    --font-display: 'Space Grotesk', 'Noto Sans KR', sans-serif;
    --font-body: 'Noto Sans KR', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-family: var(--font-body);
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  body {
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* 360 Panorama Container Styles */
  #panorama-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none; /* Let drag events pass through to #panorama */
  }

  #panorama {
    width: 100%;
    height: 100%;
    pointer-events: auto; /* Re-enable pointer events on the panorama to allow dragging */
  }

  .panorama-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #1C2541 0%, #0A1128 100%);
    opacity: 1;
    transition: opacity 1s ease-in-out;
    z-index: 2;
  }

  .panorama-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(10, 17, 40, 0.4) 0%, rgba(10, 17, 40, 0.8) 100%);
    z-index: 3;
    pointer-events: none;
  }

  /* UI Layering & Pointer Events Fix */
  .ui-wrapper {
    position: relative;
    width: 100%;
    z-index: 10;
    pointer-events: none; /* Let empty spaces fall through to panorama */
  }

  .main-header, .main-content {
    pointer-events: none;
  }

  .header-container, .hero-content, .hero-stats-panel, .btn-cta, .nav-links a {
    pointer-events: auto; /* Explicitly re-enable clicks on buttons and content */
  }

  /* Header & Navigation */
  .main-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 100;
  }

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: rgba(28, 37, 65, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0 0 16px 16px;
  }

  .logo {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
    text-decoration: none;
    letter-spacing: 2px;
  }

  .nav-links {
    display: flex;
    gap: 32px;
  }

  .nav-links a {
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .nav-links a:hover {
    color: var(--color-accent);
  }

  /* Buttons & Interactions */
  .btn-cta {
    display: inline-block;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    font-size: 15px;
  }

  .header-cta {
    background: transparent;
    color: var(--color-accent);
    border: 1px solid var(--color-accent);
  }

  .header-cta:hover {
    background: var(--color-accent);
    color: var(--color-bg);
    box-shadow: 0 0 15px rgba(0, 245, 212, 0.4);
  }

  .hero-cta-primary {
    background: var(--color-accent);
    color: var(--color-bg);
    border: 1px solid var(--color-accent);
  }

  .hero-cta-primary:hover {
    box-shadow: 0 0 20px rgba(0, 245, 212, 0.5);
    transform: translateY(-2px);
  }

  .hero-cta-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: 16px;
  }

  .hero-cta-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  /* Hero Layout */
  .hero-section {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 120px 24px 80px;
  }

  .hero-content {
    max-width: 650px;
    background: rgba(10, 17, 40, 0.5);
    padding: 40px;
    border-radius: 24px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.03);
    margin-bottom: 40px;
  }

  .hero-tagline {
    font-family: var(--font-display);
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
    font-weight: 700;
    display: block;
    margin-bottom: 16px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 48px;
    line-height: 1.2;
    margin-bottom: 24px;
  }

  .brand-highlight {
    color: var(--color-accent);
    text-shadow: 0 0 10px rgba(0, 245, 212, 0.2);
  }

  .hero-description {
    color: var(--color-text-muted);
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  /* Stats Overlay */
  .hero-stats-panel {
    display: flex;
    gap: 24px;
    margin-top: auto;
  }

  .stat-card {
    background: rgba(28, 37, 65, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px 32px;
    flex: 1;
    backdrop-filter: blur(12px);
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
  }

  .stat-value {
    display: block;
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: 8px;
  }

  .stat-label {
    color: var(--color-text-muted);
    font-size: 14px;
    font-weight: 500;
  }

  /* Mobile Responsive adjustments (initial specs) */
  @media (max-width: 768px) {
    .nav-links {
      display: none; /* Simple mobile nav hiding for now */
    }
    
    .hero-title {
      font-size: 36px;
    }
    
    .hero-stats-panel {
      flex-direction: column;
      gap: 16px;
    }

    .hero-cta-secondary {
      margin-left: 0;
      margin-top: 12px;
    }

    .hero-actions {
      display: flex;
      flex-direction: column;
    }
  }
  ```

- [ ] **Step 2: Compile and verify styles**
  Run: `npm run build`
  Expected: Style bundle compiles successfully without error.

- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add src/style.css
  git commit -m "style: implement global variables, layout structure, reset, and GNB/Hero typography"
  ```

---

### Task 5: Integrate Pannellum 360° Background

**Files:**
- Modify: `src/main.js`
- Create: `public/assets/placeholder.webp` (placeholder for missing image)

- [ ] **Step 1: Create background image generation placeholder script**
  Since we need a beautiful 360° background image (WebP, 2:1 aspect ratio), write a script in `/Users/jo/projects/starlab_ai_homepage/generate_pano.py` using Python's PIL (if available) or simply download/generate a futuristic gradient canvas image. Wait, the `generate_image` tool generates beautiful images!
  Let's use `generate_image` tool to create a 360° high-tech equirectangular image!
  Prompt: "Futuristic high-tech media studio with large data visualization screens, neon cyan and deep navy lighting, floating digital dashboards, equirectangular 360 panorama 2:1 aspect ratio"
  Image Name: `starlab-studio-360` (saves to artifact/workspace).
  We will move it to `public/assets/starlab-studio-360.webp`.

- [ ] **Step 2: Generate the image**
  Invoke `generate_image` tool with Prompt: `A futuristic high-tech digital media studio, filled with glowing holographic data screens, neon cyan and deep navy ambient lighting, digital marketing dashboards, smooth cyber tech design, equirectangular 360 degrees panoramic view, 2:1 aspect ratio, high resolution.`
  Target Image Name: `starlab-studio-360`.

- [ ] **Step 3: Copy image to public/assets/**
  Move the generated image to `public/assets/starlab-studio-360.webp`.
  Run command:
  ```bash
  mkdir -p public/assets
  mv /Users/jo/.gemini/antigravity-cli/brain/dc3c168f-f592-4488-9b60-a7de170b80fe/starlab-studio-360.png public/assets/starlab-studio-360.webp
  ```
  Wait, the image might be PNG, we can convert it or just load it. Let's make sure it's placed in `public/assets/starlab-studio-360.webp` (or adjust our code if it is `.png`).

- [ ] **Step 4: Implement src/main.js initialization**
  Write the JS logic to detect WebGL, initialize Pannellum, and hide the fallback gradient.
  ```javascript
  import { isWebGLSupported } from './utils.js';

  window.addEventListener('DOMContentLoaded', () => {
    const fallbackEl = document.querySelector('.panorama-fallback');

    // Check if WebGL is supported
    if (!isWebGLSupported(window)) {
      console.warn('WebGL is not supported. Displaying fallback gradient.');
      return;
    }

    // Initialize Pannellum if lib loaded and WebGL supported
    if (typeof pannellum !== 'undefined') {
      const viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: '/public/assets/starlab-studio-360.webp',
        autoLoad: true,
        autoRotate: -0.8,
        mouseZoom: true,
        hfov: 95,
        minHfov: 50,
        maxHfov: 120,
        showControls: false
      });

      viewer.on('load', () => {
        if (fallbackEl) {
          fallbackEl.style.opacity = '0';
          setTimeout(() => {
            fallbackEl.style.display = 'none';
          }, 1000);
        }
      });
    } else {
      console.error('Pannellum is not loaded from CDN.');
    }
  });
  ```

- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add src/main.js public/assets/starlab-studio-360.webp
  git commit -m "feat: integrate Pannellum viewer with high-tech media studio 360 panorama background"
  ```

---

### Task 6: Implement Services and GEO FAQ Sections

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`

- [ ] **Step 1: Add Services and FAQ sections to index.html**
  Inject the Services list and Q&A block right after the Hero section in `index.html`. Optimize content for [Geographic Region] + [AI] + [Education/Lecturer/Instructor/Consulting/Marketing] keyword combinations.
  Target location in `index.html`: Inside `<main class="main-content">` after the `#hero` section.
  ```html
        <!-- Services Section -->
        <section id="services" class="services-section">
          <h2 class="section-title">스타랩 비즈니스 솔루션</h2>
          
          <div class="services-grid">
            <div id="services-edu" class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3>AI 교육 · 강의 및 강사 파견</h3>
              <p class="service-summary">부산, 울산, 경남 지역을 아우르는 검증된 AI 전문 강사 매칭</p>
              <ul class="service-details">
                <li><strong>부산 AI 특강</strong>: 최신 트렌드를 다루는 단기 세미나</li>
                <li><strong>울산 AI 강의</strong>: 제조업 DX를 위한 인공지능 기초</li>
                <li><strong>경남 AI 강사 파견</strong>: 대학 및 기업 실무 생성형 AI 워크숍</li>
              </ul>
              <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" class="service-link">AI 강의 및 특강 문의하기 →</a>
            </div>

            <div id="services-consulting" class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3>부산 AI 컨설팅 및 도입 설계</h3>
              <p class="service-summary">로컬 비즈니스의 성공적인 DX를 위한 AI 아키텍처 로드맵</p>
              <ul class="service-details">
                <li>비즈니스 구조 분석 및 도입 타당성 검토</li>
                <li>자율형 AI 에이전트 도입 기획 및 아키텍처 설계</li>
                <li>국가 R&D 및 지자체 AI 솔루션 사업 연계</li>
              </ul>
              <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" class="service-link">무료 컨설팅 상담 신청 →</a>
            </div>

            <div id="services-marketing" class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 6l-9.5 9.5-5-5L1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <h3>부산 AI 마케팅 및 자동화</h3>
              <p class="service-summary">인공지능 도구를 활용한 대량 콘텐츠 제작 및 성과 극대화</p>
              <ul class="service-details">
                <li>AI 광고 문구 및 소셜 미디어 디자인 생성 자동화</li>
                <li>오디언스 데이터 분석 기반 고도화된 리드 타겟팅</li>
                <li>AI 기반 마케팅 워크플로우 생산성 300% 향상</li>
              </ul>
              <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer" class="service-link">AI 마케팅 제안 요청하기 →</a>
            </div>
          </div>
        </section>

        <!-- GEO optimized Q&A (FAQ) Section -->
        <section id="faq" class="faq-section">
          <h2 class="section-title">자주 묻는 질문 (FAQ)</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3 class="faq-question">Q. 부산, 울산, 경남(부울경) 지역에서 스타랩의 AI 교육과 특강 강의는 어떻게 신청하나요?</h3>
              <p class="faq-answer">
                A. 스타랩의 교육 서비스는 <a href="https://tally.so/r/n12345" target="_blank" rel="noopener noreferrer">온라인 문의 양식</a>을 통해 교육 대상, 기간, 희망 주제를 접수해 주시면 개별 맞춤형 상담 전화를 드립니다. 기업 임직원 맞춤형 워크숍부터 대규모 인공지능 강의까지 다채로운 프로그램이 마련되어 있습니다.
              </p>
            </div>
            <div class="faq-item">
              <h3 class="faq-question">Q. 스타랩 AI 강사진의 전문성과 교육 분야는 어떻게 되나요?</h3>
              <p class="faq-answer">
                A. 스타랩은 부산 및 경남 지역에서 활발히 검증된 생성형 AI 전문 강사진을 보유하고 있습니다. 단순 툴 소개에 그치지 않고, 업무 자동화, 기획서 작성, 코딩 보조, AI 예술 디자인 생성에 이르기까지 비즈니스 실무에 직결되는 고효율 인공지능 특강을 책임집니다.
              </p>
            </div>
            <div class="faq-item">
              <h3 class="faq-question">Q. 부산 AI 컨설팅 및 인공지능 마케팅 도입 시 기대 효과는 무엇인가요?</h3>
              <p class="faq-answer">
                A. 중소기업의 디지털 전환(DX) 시 AI 컨설팅은 불필요한 비용을 최소화하고 꼭 필요한 자율 에이전트 및 LLM 솔루션을 설계해 드립니다. 또한 AI 마케팅 도입 시, 콘텐츠 제작 속도를 혁신적으로 줄여 마케팅 예산 대비 전환 성과를 극대화할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
  ```

- [ ] **Step 2: Add CSS layout styles for Services and FAQ sections**
  Append styles to `src/style.css`.
  ```css
  /* Services Section */
  .services-section {
    padding: 80px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 36px;
    text-align: center;
    margin-bottom: 50px;
    color: var(--color-text);
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .service-card {
    background: rgba(28, 37, 65, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 40px 32px;
    backdrop-filter: blur(12px);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    flex-direction: column;
    pointer-events: auto; /* Enable hover/clicks on card */
  }

  .service-card:hover {
    transform: translateY(-8px);
    border-color: var(--color-accent);
    box-shadow: 0 10px 30px rgba(0, 245, 212, 0.1);
  }

  .service-icon {
    width: 60px;
    height: 60px;
    background: rgba(0, 245, 212, 0.1);
    color: var(--color-accent);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .service-icon svg {
    width: 32px;
    height: 32px;
  }

  .service-card h3 {
    font-family: var(--font-display);
    font-size: 20px;
    margin-bottom: 12px;
  }

  .service-summary {
    color: var(--color-text-muted);
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .service-details {
    margin-bottom: 30px;
    list-style: none;
  }

  .service-details li {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 10px;
    color: var(--color-text-muted);
    position: relative;
    padding-left: 20px;
  }

  .service-details li::before {
    content: "•";
    color: var(--color-accent);
    position: absolute;
    left: 0;
    font-size: 18px;
    top: -2px;
  }

  .service-link {
    color: var(--color-accent);
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    margin-top: auto;
    transition: transform 0.2s ease;
  }

  .service-link:hover {
    text-decoration: underline;
  }

  /* FAQ Section */
  .faq-section {
    padding: 80px 24px;
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .faq-item {
    background: rgba(28, 37, 65, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    padding: 32px;
    backdrop-filter: blur(8px);
    pointer-events: auto;
  }

  .faq-question {
    font-size: 18px;
    margin-bottom: 12px;
    color: var(--color-text);
  }

  .faq-answer {
    color: var(--color-text-muted);
    font-size: 15px;
    line-height: 1.6;
  }

  .faq-answer a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .faq-answer a:hover {
    text-decoration: underline;
  }

  /* Responsive Adjustments */
  @media (max-width: 992px) {
    .services-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  ```

- [ ] **Step 3: Build and check CSS**
  Run: `npm run build`
  Expected: Success without style compiling issues.

- [ ] **Step 4: Commit**
  Run:
  ```bash
  git add index.html src/style.css
  git commit -m "feat: implement responsive Services grid and GEO-optimized FAQ sections with SEO text"
  ```

---

### Task 7: Footer and Structured Schema JSON-LD

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`

- [ ] **Step 1: Add Footer and Schema script to index.html**
  Insert the Footer tag at the bottom of the `.ui-wrapper` container and place the JSON-LD script at the bottom of `<head>`.
  ```html
      <!-- Footer -->
      <footer class="main-footer">
        <div class="footer-container">
          <div class="footer-brand">
            <span class="footer-logo">STARLAB</span>
            <p>부산, 울산, 경남 비즈니스의 성공적인 DX 파트너</p>
          </div>
          <div class="footer-info">
            <p><strong>대표 문의</strong>: contact@starlab-ai.com</p>
            <p><strong>위치</strong>: 부산광역시 영도구 해양로 301-1 스타랩 타워 12F (부울경 본부)</p>
            <p class="copyright">© 2026 STARLAB. All rights reserved.</p>
          </div>
        </div>
      </footer>
  ```
  Inject the JSON-LD script into the `<head>` of `index.html`:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "스타랩",
    "alternateName": "Starlab",
    "description": "부산, 울산, 경남(부울경) 지역 비즈니스의 성공적인 DX를 위한 부산 AI 교육, 부산 AI 컨설팅, 부산 AI 마케팅 및 인공지능 강의/강사 파견 전문 파트너",
    "url": "https://starlab-ai.com",
    "logo": "https://starlab-ai.com/assets/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Busan",
      "addressCountry": "KR"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Busan"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Ulsan"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Gyeongsangnam-do"
      }
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
  ```

- [ ] **Step 2: Add CSS for Footer**
  Append styles to `src/style.css`:
  ```css
  /* Footer */
  .main-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(10, 17, 40, 0.85);
    padding: 60px 24px;
    pointer-events: auto;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 40px;
  }

  .footer-brand p {
    color: var(--color-text-muted);
    font-size: 14px;
    margin-top: 8px;
  }

  .footer-logo {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  .footer-info {
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 1.8;
  }

  .copyright {
    margin-top: 16px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }
  ```

- [ ] **Step 3: Compile bundle and run check**
  Run: `npm run build`
  Expected: Complete production build runs without warning or error.

- [ ] **Step 4: Commit**
  Run:
  ```bash
  git add index.html src/style.css
  git commit -m "feat: add Footer section and structured JSON-LD schema markup for SEO/GEO"
  ```

---

### Task 8: Performance Verification and Deployment Build Check

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Check mobile responsive behavior and lazy load**
  Double-check the performance optimizations. Let's make sure the background loading doesn't block DOM parsing. We verify our LCP optimization in `src/main.js` is active.
  Let's run a production build:
  Run: `npm run build`
  Expected: Build finishes, creating a minified CSS and JS pack inside `dist/`.

- [ ] **Step 2: Commit final build configuration**
  Run:
  ```bash
  git commit --allow-empty -m "perf: finalize production build and confirm responsive layouts"
  ```
