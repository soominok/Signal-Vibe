<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 재테크 레이더 — 에이전트 추가 컨텍스트

> **CLAUDE.md를 반드시 먼저 읽을 것.** 이 파일은 Next.js 버전 경고 + 프로젝트 보충 정보다.

## 프로젝트 핵심 요약
- **목적**: 기사·커뮤니티 없이 이 사이트만 보고 투자 판단 가능한 대시보드
- **현재 상태**: 목업 데이터 기반 UI 완성, 실데이터 API 연결 준비 중
- **스택**: Next.js 16 (App Router) · TypeScript strict · Tailwind v4 · shadcn/ui · Supabase

## 현재 파일 구조 (핵심)
```
src/
  app/
    page.tsx              # 요약 탭
    domestic/page.tsx     # 국내 주식
    global/page.tsx       # 해외 주식
    auto-trading/page.tsx # 자동트레이딩 (개발 예정)
  components/
    common/    NavBar, Disclaimer
    dashboard/ MarketSummary, HotSectorGrid, HotSectorCard,
               SectorDetailPanel, NewsSummary, SupplyDemand,
               FearGreed, UpcomingEvents, WatchlistPanel, FiftyTwoWeek
  lib/
    mock-data.ts          # 모든 목업 데이터 (API 연결 전 임시)
    supabase.ts           # Supabase 클라이언트
    hooks/
      useWatchlist.ts     # localStorage 기반 관심종목
    api/                  # 외부 API 클라이언트 (키 없으면 mock 반환)
      kis.ts, news.ts, alpha-vantage.ts, anthropic.ts, ecos.ts
```

## 데이터 연결 진행 순서
1. Anthropic API → 뉴스 감성 분석 + Insight LLM
2. Alpha Vantage API → 해외 지수·종목 실시간
3. 한국은행 ECOS API → 금리·환율 거시 지표
4. KIS Developers API → 국내 시세·수급 (계좌 발급 필요)
5. 뉴스 API (NewsAPI.org 또는 RSS) → 뉴스 수집

## 코딩 규칙 요약 (CLAUDE.md 전문 참고)
- `any` 금지, mock-data.ts 300줄 초과 시 분리
- 외부 API는 `lib/api/` 전용 클라이언트만 통해서 호출
- 모든 분석 화면에 Disclaimer 컴포넌트 포함
- LLM 생성 텍스트에는 "AI 생성" 라벨 + 출처 필수
