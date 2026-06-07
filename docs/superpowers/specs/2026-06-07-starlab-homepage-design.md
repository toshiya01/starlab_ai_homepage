# 스타랩 360° 몰입형 반응형 웹사이트 디자인 스펙

* **작성일**: 2026-06-07
* **버전**: v1.0
* **상태**: 승인됨 (Approved)
* **대상 경로**: `docs/superpowers/specs/2026-06-07-starlab-homepage-design.md`

---

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 부산, 울산, 경남(부울경) 지역을 중심으로 AI 교육, AI 컨설팅, AI 마케팅 서비스를 제공하는 기업 **'스타랩 (Starlab)'**의 공식 랜딩 페이지 개발입니다. 
구글 검색엔진 최적화(SEO) 및 생성형 AI 검색 최적화(GEO) 기술을 극대화하여 설계되었으며, 모바일 반응형 디자인과 최첨단 360° 몰입형 공간 비주얼(Pannellum 기반)을 특징으로 합니다.

## 2. 핵심 목표 및 요구사항 (Core Objectives & Requirements)

1. **디자인 레퍼런스 준수**: `360° Immersive Website Development Guide`를 참고하여, 360° 가상 스튜디오 배경 위에 깔끔하고 프리미엄한 글래스모피즘(Glassmorphism) UI를 레이어링합니다.
2. **다차원 키워드 조합 최적화 (SEO/GEO)**: 
   * **지역 키워드** (부산, 울산, 경남, 부울경) × **AI 키워드** (AI, 인공지능, 생성형 AI, LLM) × **교육 서비스 키워드** (교육, 강의, 강사, 특강, 워크숍, 컨설팅, 마케팅) 조합을 마크업, 메타 태그, 온페이지 텍스트에 다채롭고 밀도 있게 반영합니다.
   * 대표 키워드 예시: '부산 AI 교육', '울산 AI 강의', '경남 AI 강사', '부울경 AI 특강/워크숍', '부산 인공지능 강사', '부산 AI 컨설팅', '부산 AI 마케팅' 등.
3. **페이지 로딩 속도 최적화**: 360° 파노라마의 대용량 이미지가 초기 페이지 로드 속도(특히 LCP 지표)를 저해하지 않도록 정교하게 자원 로딩을 제어합니다.
4. **모바일 반응형 및 인터랙션 수정**: 화면 크기에 따라 적응하는 반응형 레이아웃을 구축하고, UI 오버레이와 360° 배경 드래그 영역 간의 마우스/터치 포인터 충돌을 방지(`pointer-events` 계층화)합니다.
5. **외부 문의 폼 연동**: 내장 입력 폼 대신 네이버 폼, 구글 폼, Tally 등 외부 문의 링크로 사용자를 리다이렉트하는 CTA 방식을 취합니다.

---

## 3. 기술 스택 (Technology Stack)

* **빌드 도구**: Vite (고성능 번들링 및 정적 자산 압축 최적화)
* **언어 및 프레임워크**: 순수 HTML5, Vanilla JavaScript, Vanilla CSS (테일윈드 없이 정밀 제어)
* **360° 엔진**: Pannellum 2.5.6 (WebGL 기반 경량 파노라마 뷰어, CDN 연동)
* **폰트**: Space Grotesk (Display), Noto Sans KR / Pretendard (Body)
* **아이콘**: 인라인 SVG 코드 (HTTP 요청 최소화)

---

## 4. 디렉터리 및 파일 구조 (Directory Structure)

```text
starlab_ai_homepage/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-06-07-starlab-homepage-design.md  # 본 디자인 스펙 파일
├── public/
│   └── assets/
│       └── starlab-studio-360.webp                    # 4K equirectangular 최적화 WebP 배경
├── src/
│   ├── main.js                                        # Pannellum 로딩 제어 및 드래그 보완 스크립트
│   └── style.css                                      # 프리미엄 다크 테마 및 글래스모피즘 스타일시트
├── index.html                                         # SEO/GEO 최적화 및 메인 레이아웃 엔트리
├── package.json                                       # Vite 빌드 설정
└── README.md
```

---

## 5. 레이아웃 및 컴포넌트 상세 (Layout & Components)

### 5.1 GNB (Global Navigation Bar)
* **구성**: 스타랩 텍스트 로고(좌측), 서비스 메뉴 링크(우측: 교육과정, 컨설팅, 마케팅 전략, 지역 협업), 외부 상담 신청 링크(CTA 버튼).
* **스타일**: 글래스모피즘 스타일의 상단 고정 바 (`backdrop-filter: blur(12px)`).

### 5.2 360° Hero Section (몰입형 영웅 섹션)
* **360° 배경**: 데이터 시각화 차트와 디지털 대시보드가 빛나는 첨단 AI 미디어 스튜디오 공간(WebP, 2:1 비율 파노라마).
* **UI 레이어링**: 
  * 좌측: **"부산 AI 교육과 인공지능 강의의 새로운 기준, 스타랩"** 헤드라인 및 **"울산·경남 기업을 위한 맞춤형 AI 강사 및 컨설팅 솔루션"** 서브 카피.
  * 하단: 주요 성과 카드 수치 오버레이 (예: "부울경 AI 교육 누적 500명 돌파", "지역 기업 DX 및 AI 컨설팅 50건 이상" 등 구조화된 데이터 제시).
  * CTA 버튼: **"무료 맞춤 컨설팅 및 AI 특강 문의"** (외부 폼 링크 연결).

### 5.3 Services Section (핵심 서비스 소개)
* **AI 교육 & 강의 (부산/울산/경남 AI 강사단)**: 
  * 기업 임직원 실무 생성형 AI 워크숍, 공공기관 및 교육기관 코딩/AI 기초 강의, 대학생 맞춤형 인공지능 특강 포트폴리오 리스트 제공. 
  * 부울경 최고 수준의 전문 AI 강사진의 맞춤형 커리큘럼 소개.
* **AI 컨설팅 (부산/울산/경남 AI 컨설팅)**: 
  * 지역 중소기업 비즈니스 구조를 분석하여 최신 AI 기술 및 자율 에이전트 도입을 돕는 단계별 기술 컨설팅 가이드.
* **AI 마케팅 (부산/울산/경남 AI 마케팅)**: 
  * AI 툴을 접목한 데이터 분석, 인공지능 기반 콘텐츠 생성 자동화 솔루션을 통해 로컬 비즈니스의 성장 지원.

### 5.4 GEO 최적화 Q&A (FAQ Section)
AI 모델이 정확하게 정보를 추출할 수 있도록 일치하는 핵심 키워드 조합으로 구성된 Q&A를 배치합니다.
* *Q: 부산, 울산, 경남(부울경) 지역에서 스타랩의 AI 교육과 특강 강의는 어떻게 신청하나요?*
* *Q: 스타랩 AI 강사진의 전문성과 교육 분야는 어떻게 되나요?*
* *Q: 부산 AI 컨설팅 및 인공지능 마케팅 도입 시 기대 효과는 무엇인가요?*

### 5.5 Footer (하단 정보)
* 스타랩의 주소 정보(부울경 지역 사무소 강조), 연락처, 이메일, 그리고 검색 로봇 크롤러용 스키마 메타데이터 대응 구조.

---

## 6. SEO 및 GEO 상세 기술 사양 (SEO & GEO Specifications)

### 6.1 키워드 조합 인덱스 테이블 (Keyword Combination Index)
웹페이지 구조에 녹여내어 크롤러와 AI 모델이 즉시 인지하도록 하는 주요 키워드 매트릭스입니다:

| 지역 키워드 | AI 기술 키워드 | 서비스 형태 키워드 | 타겟 조합 키워드 예시 |
| :--- | :--- | :--- | :--- |
| **부산** | AI / 인공지능 / 생성형 AI | 교육 / 강의 / 강사 / 특강 / 워크숍 | 부산 AI 교육, 부산 인공지능 강의, 부산 AI 강사, 부산 생성형 AI 특강 |
| **울산** | AI / 인공지능 | 교육 / 강의 / 컨설팅 | 울산 AI 교육, 울산 인공지능 강의, 울산 AI 컨설팅 |
| **경남** | AI / 인공지능 | 교육 / 강의 / 강사 / 마케팅 | 경남 AI 교육, 경남 AI 강사, 경남 AI 마케팅 |
| **부울경** | AI / 인공지능 / 생성형 AI | 교육 / 특강 / 워크숍 | 부울경 AI 특강, 부울경 인공지능 워크숍, 부울경 AI 교육 |

### 6.2 JSON-LD Structured Data 마크업
```json
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
```

### 6.3 검색 의도에 맞춘 텍스트 배치
* "부산 AI 강사 파견", "울산 인공지능 강의 추천", "경남 생성형 AI 워크숍", "부울경 AI 교육 비용" 등의 세부 검색 의도(Long-tail Query)에 모두 대응할 수 있도록 온페이지 텍스트에 상세 매칭 구문을 삽입합니다.

---

## 7. 최적화 및 접근성 상세 (Performance & Accessibility)

### 7.1 Pannellum 인터랙션 차단 우회 (`pointer-events` 제어)
360° 파노라마 드래그를 방해하는 UI 레이어를 해결하기 위해 아래의 CSS 규칙을 엄격히 적용합니다:
* UI 오버레이 최상위 컨테이너: `pointer-events: none;`
* 실질적인 클릭 대상(GNB 네비게이션, GNB CTA 버튼, 서비스 설명 카드, 전환 CTA 버튼): `pointer-events: auto;`
* `<main>` 태그 등 배경을 포함하는 부모 컨테이너: `pointer-events: none;`
* Pannellum이 들어가는 백그라운드 `#panorama`: `pointer-events: auto;`

### 7.2 초기 렌더링 최적화 (LCP 개선)
1. **Pannellum 스크립트 비동기화**: 메인 렌더링을 방해하지 않도록 `<script src="..." defer>` 처리.
2. **지연된 파노라마 초기화 (Lazy Init)**: DOMContentLoaded 이벤트 이후 Pannellum 로드를 시동하며, 로드 전에는 경량의 다크 블루 그라디언트(`background: radial-gradient(...)`)를 제공하여 사용자 경험 저하를 방지.
3. **WebP 파노라마 최적화**: 2:1 에셋의 해상도를 유지하면서 파일 용량을 1.5MB 미만으로 줄여 초기 데이터 부하를 경감.

---

## 8. 승인 및 피드백 루프 (Approval & Sign-off)

본 설계 문서는 사용자의 최종 피드백을 수용하여 작성되었습니다. 사용자의 최종 검토 후 본 문서를 바탕으로 구현 작업(Implementation Plan 수립 및 코드 작성)으로 전환합니다.
