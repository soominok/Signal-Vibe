import MarketSummary from "@/components/dashboard/MarketSummary";
import HotSectorGrid from "@/components/dashboard/HotSectorGrid";
import NewsSummary from "@/components/dashboard/NewsSummary";
import SupplyDemand from "@/components/dashboard/SupplyDemand";
import FearGreed from "@/components/dashboard/FearGreed";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

export default function SummaryPage() {
  const now = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <p className="mb-6 text-sm text-muted-foreground">{now} 기준 · 지연 데이터</p>

      <div className="flex flex-col gap-10">
        {/* 시장 지수 */}
        <MarketSummary />

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

        {/* 섹터 동향 */}
        <HotSectorGrid />

        {/* 주요 뉴스 */}
        <NewsSummary />
      </div>
    </main>
  );
}
