import MarketSummary from "@/components/dashboard/MarketSummary";
import HotSectorGrid from "@/components/dashboard/HotSectorGrid";
import NewsSummary from "@/components/dashboard/NewsSummary";
import SupplyDemand from "@/components/dashboard/SupplyDemand";
import FearGreed from "@/components/dashboard/FearGreed";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import WatchlistPanel from "@/components/dashboard/WatchlistPanel";
import FiftyTwoWeek from "@/components/dashboard/FiftyTwoWeek";
import MacroIndicators from "@/components/dashboard/MacroIndicators";
import { enrichNewsWithSentiment } from "@/lib/api/anthropic";
import { getMacroSnapshot } from "@/lib/api/ecos";
import { topNews } from "@/lib/mock-data";

// 1시간 캐시 — 매 요청마다 Anthropic·ECOS 호출 방지
export const revalidate = 3600;

export default async function SummaryPage() {
  const now = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });

  // 병렬 데이터 페치 (실패해도 mock 유지)
  const [enrichedNews, macro] = await Promise.all([
    enrichNewsWithSentiment(topNews),
    getMacroSnapshot(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <p className="mb-6 text-sm text-muted-foreground">{now} 기준</p>

      <div className="flex flex-col gap-10">
        {/* 관심종목 (비어있으면 숨김) */}
        <WatchlistPanel />

        {/* 시장 지수 */}
        <MarketSummary />

        {/* 거시경제 지표 (ECOS 실데이터) */}
        <MacroIndicators data={macro} />

        {/* 수급 현황 + 심리 지수 + 이벤트 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">시장 심리 · 수급 · 이벤트</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SupplyDemand />
            </div>
            <div className="flex flex-col gap-3">
              <FearGreed />
              <UpcomingEvents />
            </div>
          </div>
        </section>

        {/* 52주 신고가/신저가 */}
        <FiftyTwoWeek />

        {/* 섹터 동향 */}
        <HotSectorGrid />

        {/* 주요 뉴스 (Anthropic 감성 분석 실데이터) */}
        <NewsSummary articles={enrichedNews} />
      </div>
    </main>
  );
}
