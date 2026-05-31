# 재테크 레이더 — 개발 히스토리 (history.md)

> **목적**: 다른 PC / 다른 세션에서 이 파일 하나만 보고 "어디까지 됐는지, 무슨 문제가 있는지, 어디서 시작할지" 파악하기 위한 문서.
> **마지막 업데이트**: 2026-05-31

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | 재테크 레이더 (Jaeteck Radar) |
| 목적 | 기사·커뮤니티·지표를 따로 찾지 않고 **이 사이트만 보고 투자 판단** 가능한 대시보드 |
| 1차 목표 | 창업자 본인이 매일 접속해 매수/매도 타이밍 판단에 실제 활용 |
| 2차 목표 | 소액 구독 결제 (월 4,900원 / 19,900원) 기반 수익화 |
| 핵심 가치 | "돈의 흐름" 관점으로 시황·뉴스·섹터·종목을 한 화면에 |

---

## 2. 기술 스택

| 레이어 | 기술 | 선택 이유 |
|--------|------|-----------|
| 프레임워크 | Next.js 16 (App Router) | SEO, 서버 컴포넌트로 API 키 보호 |
| 언어 | TypeScript strict | any 금지, 타입 안전성 |
| 스타일 | Tailwind v4 + shadcn/ui | 빠른 UI, 컴포넌트 재사용 |
| DB / 인증 | Supabase (PostgreSQL + Auth) | 무료 시작, 확장 용이 |
| 배포 | Vercel | Next.js 최적화 |
| AI | Anthropic Claude (haiku) | 뉴스 감성 분석, Insight 생성 |
| 국내 데이터 | 키움증권 REST API | REST 기반, KIS 대비 계좌 발급 상대적 용이 |
| 거시지표 | 한국은행 ECOS API | 무료 공개 API |
| 해외 데이터 | Twelve Data (예정) | 800 calls/day 무료, 빠름 |
| 뉴스 | 네이버 뉴스 검색 API (예정) | 한국어 뉴스 25,000건/day 무료 |

---

## 3. 레포지토리 구조

```
signal_vibe/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 요약 탭 (async 서버 컴포넌트)
│   │   ├── domestic/page.tsx           # 국내 주식
│   │   ├── global/page.tsx             # 해외 주식
│   │   ├── auto-trading/page.tsx       # 자동트레이딩 (개발 예정)
│   │   └── api/
│   │       └── test-kiwoom/route.ts    # 키움 API 연결 테스트 (개발용)
│   ├── components/
│   │   ├── common/
│   │   │   ├── NavBar.tsx              # 4탭 상단 네비게이션
│   │   │   └── Disclaimer.tsx         # 면책 고지 (모든 페이지 하단)
│   │   └── dashboard/
│   │       ├── MarketSummary.tsx       # 국내·해외 지수 카드
│   │       ├── MacroIndicators.tsx     # 거시경제 (ECOS 실데이터)
│   │       ├── SupplyDemand.tsx        # 수급 현황 (외국인·기관·개인)
│   │       ├── FearGreed.tsx           # 시장 심리 지수
│   │       ├── UpcomingEvents.tsx      # 이번 주 경제 이벤트
│   │       ├── FiftyTwoWeek.tsx        # 52주 신고가/신저가
│   │       ├── HotSectorGrid.tsx       # 섹터 카드 그리드 (client)
│   │       ├── HotSectorCard.tsx       # 섹터 카드
│   │       ├── SectorDetailPanel.tsx   # 섹터 상세 슬라이드 패널
│   │       ├── NewsSummary.tsx         # 뉴스 + 감성 분석 배지
│   │       └── WatchlistPanel.tsx      # 관심종목 (localStorage)
│   └── lib/
│       ├── mock-data.ts                # 모든 목업 데이터 (295줄, 분리 예정)
│       ├── supabase.ts                 # Supabase 클라이언트
│       ├── hooks/
│       │   └── useWatchlist.ts         # localStorage 관심종목 훅
│       └── api/
│           ├── anthropic.ts            # Claude API (감성 분석, Insight)
│           ├── ecos.ts                 # 한국은행 ECOS API
│           ├── kiwoom.ts               # 키움증권 REST API
│           ├── alpha-vantage.ts        # Alpha Vantage (대체: Twelve Data)
│           └── news.ts                 # NewsAPI (대체: 네이버 뉴스 API)
├── info.txt                            # 프로젝트 단일 진실 공급원
├── plan.md                             # 빌드 플랜 (체크박스)
├── CLAUDE.md                           # 에이전트 작업 규칙 + 실수 기록
├── AGENTS.md                           # 에이전트 추가 컨텍스트
├── history.md                          # 이 파일
├── .env.local                          # 환경 변수 (git 제외)
└── .env.local.example                  # 환경 변수 템플릿
```

---

## 4. Git 브랜치 구조

```
main
├── v0/project-init   ← Next.js + shadcn/ui 초기화 완료
├── v0/supabase-init  ← Supabase 클라이언트 연결 완료
└── v0/dashboard-ui   ← 현재 작업 브랜치 (UI + 실API 연결)
```

> **중요**: 모든 작업은 `v0/dashboard-ui`에 있습니다. main에는 아직 머지되지 않았습니다.
> 새 PC에서 시작 시: `git checkout v0/dashboard-ui`

---

## 5. 개발 타임라인

### Phase 1: 프로젝트 초기화 (`v0/project-init`)

**수행 내용:**
- Node.js가 설치되어 있지 않았음 → `winget install OpenJS.NodeJS.LTS`로 설치
- `create-next-app`이 기존 파일(info.txt, plan.md, CLAUDE.md) 때문에 실행 거부 → `tmp-init` 디렉터리에 생성 후 루트로 이동
- shadcn/ui 초기화 (`npx shadcn@latest init --yes --defaults`)
- `package.json`에 `typecheck` 스크립트 추가 (`tsc --noEmit`)
- typecheck ✅ lint ✅ build ✅ 확인

**함정:**
- `create-next-app`이 `CLAUDE.md`를 자동 생성함 → 기존 CLAUDE.md를 덮어쓰지 않도록 이동 시 스킵
- `.env*` gitignore 패턴이 `.env.local.example`도 무시 → `!.env.local.example` 예외 추가 필요

---

### Phase 2: Supabase 연결 (`v0/supabase-init`)

**수행 내용:**
- `@supabase/supabase-js` 설치
- `src/lib/supabase.ts` 생성 (환경변수 누락 시 즉시 Error throw)
- `.env.local.example` 추가
- `.gitignore`에 `!.env.local.example` 예외 추가

**Supabase 프로젝트 URL:** `https://qlugzdrzbnsvjerqndzm.supabase.co`
(별도 Supabase 대시보드에서 테이블 생성 등 진행 필요)

---

### Phase 3: 대시보드 UI 전체 구현 (`v0/dashboard-ui`)

**Phase 3-1: 기본 대시보드**
- 시장 지수 카드 (KOSPI, KOSDAQ, 원/달러)
- Hot Sector 카드 6개 (목업 데이터)
- 면책 고지 컴포넌트 (모든 페이지 하단 고정)
- NavBar 컴포넌트 (4탭: 요약/국내/해외/자동트레이딩)

**Phase 3-2: UI 전면 개편**
- 시장 지수 → 국내/해외 분리 (DOW, NASDAQ, S&P500, RUSSELL 2000 추가)
- 섹터 카드 클릭 → 슬라이드 오버 패널 (SectorDetailPanel)
  - 키워드 클릭 → 뉴스 필터링
  - 밸류체인 시각화
  - 밸류체인 기업 클릭 → 기업 상세 드릴다운 (가격·주간등락·설명·동일단계 기업)
- 거래대금 순위 + 코멘트 (국내 12종목, 해외 8종목)
- 오늘의 주요 뉴스 섹션 (출처·키워드)

**Phase 3-3: 새 위젯 추가**
- 수급 현황 (외국인·기관·개인 순매수 바 차트 + 연속 순매수 뱃지)
- 시장 심리 지수 (공포/탐욕 0-100 게이지 + 주요 요인)
- 이번 주 경제 이벤트 (FOMC·NFP 날짜·예상치·영향도)
- 52주 신고가/신저가 목록 + 52w 범위 내 현재 위치 바
- 뉴스 감성 분석 배지 (긍정/부정/중립 + 0-100 점수)
- 관심종목 Watchlist (localStorage 기반, 별표 버튼, 요약 페이지 상단 표시)
- 거시경제 지표 위젯 (기준금리·CPI·원달러 — ECOS API 실데이터)
- 자동트레이딩 페이지 (전략설정·백테스트·수익현황 탭, 법규 경고 배너)

**Phase 3-4: API 실연결**
- Anthropic API 연결 → 뉴스 감성 분석 서버 사이드 자동 실행 (1시간 캐시)
- ECOS API 연결 → 기준금리·CPI·원달러 실데이터 (1시간 캐시)
- API 클라이언트 파일 생성: `kiwoom.ts`, `alpha-vantage.ts`, `ecos.ts`, `news.ts`

---

## 6. 현재 화면 구성 (목업 데이터 기반)

### 탭 1: 요약 (/)
| 섹션 | 데이터 소스 | 상태 |
|------|-------------|------|
| 관심종목 Watchlist | localStorage | ✅ 동작 |
| 시장 지수 (국내·해외) | mock-data.ts | ⬜ mock |
| 거시경제 지표 (금리·CPI·환율) | ECOS API | ✅ **실데이터** |
| 수급 현황 | mock-data.ts | ⬜ mock |
| 시장 심리 지수 | mock-data.ts | ⬜ mock |
| 이번 주 경제 이벤트 | mock-data.ts | ⬜ mock |
| 52주 신고가/신저가 | mock-data.ts | ⬜ mock |
| 섹터 동향 (클릭→상세) | mock-data.ts | ⬜ mock |
| 주요 뉴스 + 감성 분석 | Anthropic API | ✅ **실데이터** |

### 탭 2: 국내 (/)domestic)
| 섹션 | 상태 |
|------|------|
| 국내 지수 카드 | ⬜ mock |
| 시장 폭 바 (상승·보합·하락) | ⬜ mock |
| 거래대금 순위 + 코멘트 (12종목) | ⬜ mock |
| ★ 관심종목 버튼 | ✅ 동작 |

### 탭 3: 해외 (/global)
| 섹션 | 상태 |
|------|------|
| 해외 지수 4종 | ⬜ mock |
| 환율 4종 | ⬜ mock |
| 글로벌 종목 순위 + 코멘트 (8종목) | ⬜ mock |

### 탭 4: 자동트레이딩 (/auto-trading)
| 섹션 | 상태 |
|------|------|
| 전략 설정 탭 | ⬜ 개발 예정 |
| 백테스트 탭 | ⬜ 개발 예정 |
| 수익 현황 탭 | ⬜ 개발 예정 |

---

## 7. API 연결 현황

### 연결 완료
| API | 환경변수 | 용도 |
|-----|----------|------|
| Anthropic (Claude Haiku) | `ANTHROPIC_API_KEY` | 뉴스 감성 분석, Insight 생성 |
| 한국은행 ECOS | `ECOS_API_KEY` | 기준금리·CPI·원달러 실데이터 |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | DB (테이블 미생성) |

### 연결 대기 — 키 있음, 데이터 엔드포인트 미확인
| API | 환경변수 | 상황 |
|-----|----------|------|
| 키움증권 REST | `KIWOOM_APP_KEY`, `KIWOOM_APP_SECRET` | **토큰 발급 성공** / 데이터 엔드포인트 500 오류 |

**키움 API 현황 상세:**
- 토큰: `POST https://api.kiwoom.com/oauth2/token` + JSON body → **200 OK** ✅
- 데이터: 모든 경로(`/uapi/...`, `/v1/...`, TR 코드 방식 등) → **500** ⚠️
- **원인 추정**: 개발자 포털에서 데이터 API를 별도로 신청/활성화해야 할 가능성
- **해결 방법**: [developers.kiwoom.com](https://developers.kiwoom.com) → 앱 상세 → "사용 가능한 API" 목록 확인 후 데이터 API 신청
- **가이드 URL**: https://openapi.kiwoom.com/guide/apiguide

### 연결 예정 — 키 발급 필요
| API | 환경변수 | 발급처 | 용도 |
|-----|----------|--------|------|
| Twelve Data | `TWELVE_DATA_API_KEY` | twelvedata.com (무료, 즉시) | 해외 지수·종목 실데이터 |
| 네이버 뉴스 검색 | `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` | developers.naver.com → "검색" API | 한국 주식 뉴스 수집 |

---

## 8. 알려진 이슈 & 주의사항

### 환경 설정
| 이슈 | 해결법 |
|------|--------|
| 새 PowerShell에서 `npx` 인식 안 됨 | `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH` 실행 |
| Node.js 미설치 시 | `winget install OpenJS.NodeJS.LTS` |
| `npm run dev` 시 포트 충돌 | 이전 서버 종료 (`taskkill /PID {PID} /F`) 또는 자동으로 3001로 이동 |

### 코드
| 이슈 | 상황 |
|------|------|
| IDE 진단이 파일 저장 직후 잘못된 오류 표시 | 실제 오류가 아님. `npm run typecheck` 로 확인 |
| `mock-data.ts` 파일 크기 | 현재 약 500줄 — 향후 도메인별 분리 필요 (mock-sectors, mock-stocks, mock-market) |
| CRLF 경고 | Windows 개발 환경에서 git이 LF→CRLF 변환 경고를 계속 표시. 무해함, 무시 가능. `.gitattributes`로 해소 가능 |

### 법규 / 서비스 정책
| 이슈 | 상황 |
|------|------|
| 자동트레이딩 실매매 | 자본시장법상 유사투자자문업 신고 대상. **반드시 법률 검토 후** 활성화 |
| 유료 결제 | 유사투자자문업 신고 + 약관·면책·환불 정책 완비 후 켜기 |
| 크롤링 | 네이버·다음 금융 크롤링 약관 위반 소지 → 공식 API만 사용 |
| 감성 분석 | AI 생성 텍스트에 "AI 생성" 라벨 + 출처 필수 (현재 구현됨) |

---

## 9. 로컬 개발 환경 세팅 (새 PC)

```powershell
# 1. 레포 클론 후 대시보드 브랜치로
git clone https://github.com/soominok/Signal-Vibe.git
cd Signal-Vibe
git checkout v0/dashboard-ui

# 2. 의존성 설치
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
npm install

# 3. 환경 변수 설정
copy .env.local.example .env.local
# .env.local 파일을 열고 아래 값들을 채운다

# 4. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

### `.env.local`에 채워야 할 값
```
NEXT_PUBLIC_SUPABASE_URL=https://qlugzdrzbnsvjerqndzm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...(Supabase 대시보드에서 확인)...

ANTHROPIC_API_KEY=sk-ant-api03-...(발급자에게 확인)...
ECOS_API_KEY=JKQS6B4ZWET8AAAKZFPJ

KIWOOM_APP_KEY=6ICYxxurRP-YiAyazAUq2tLeEPxv0Dc68PilVj3Mpc0
KIWOOM_APP_SECRET=7vKTqajnkOlQDXbG64rq-Gpv6Td2sJujrhvIbAhUK8A

# 아직 미연결 (발급 후 추가)
TWELVE_DATA_API_KEY=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

### 검증 명령어
```powershell
npm run typecheck   # 타입 검사
npm run lint        # ESLint
npm run build       # 프로덕션 빌드 확인
```

---

## 10. 다음 작업 (우선순위순)

### 즉시 가능
- [ ] **키움 데이터 API 활성화**: [developers.kiwoom.com](https://developers.kiwoom.com) 접속 → 앱 상세 → "데이터 API" 신청 → 승인 후 `kiwoom.ts` 엔드포인트 확인
- [ ] **네이버 뉴스 API 연결**: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 발급 후 `src/lib/api/news.ts` 활성화
- [ ] **Twelve Data 연결**: 해외 지수 실데이터 (twelvedata.com 무료 발급)

### 단기 (v0 완료 기준)
- [ ] 일/주/월/년 기간 토글 (섹터·지수 공통)
- [ ] 종목 상세 페이지 (차트 + 재무 + 뉴스)
- [ ] Supabase 테이블 생성 (sectors, tickers, money_flow, insights)
- [ ] `mock-data.ts` 도메인별 분리

### 중기 (v1)
- [ ] 키움 API로 국내 주식 실데이터 연결 (거래대금 순위, 현재가)
- [ ] LLM 섹터 Insight 생성 (Claude API, 출처 링크 포함)
- [ ] 뉴스 API로 실시간 뉴스 수집

### 장기 (v2+)
- [ ] 로그인 + Watchlist DB 저장
- [ ] 뉴스·종목 연결고리 분석
- [ ] 알림 (이메일/웹푸시)
- [ ] 포트폴리오 진단 도구
- [ ] 자동트레이딩 (법규 검토 후)

---

## 11. 핵심 파일 변경 시 주의사항

| 파일 | 주의 |
|------|------|
| `src/lib/mock-data.ts` | 인터페이스 변경 시 모든 컴포넌트 영향 — typecheck 필수 |
| `src/app/layout.tsx` | NavBar, Disclaimer 포함 — 전체 페이지 영향 |
| `src/components/dashboard/SectorDetailPanel.tsx` | 3개 상태 관리 (sector, keyword, company) — 복잡도 높음 |
| `.env.local` | git에 절대 커밋 금지 |
| `CLAUDE.md` | 에이전트 작업 규칙 — 여기서 정의한 규칙이 AI 에이전트 동작을 제어함 |
| `plan.md` | 체크박스 기반 진행상황 — 작업 완료 시 반드시 [x] 처리 |

---

## 12. 원격 저장소

- **GitHub**: https://github.com/soominok/Signal-Vibe
- **현재 브랜치**: `v0/dashboard-ui`
- **PR URL**: https://github.com/soominok/Signal-Vibe/pull/new/v0/dashboard-ui
