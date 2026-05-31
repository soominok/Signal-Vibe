import MarketSummary from "@/components/dashboard/MarketSummary";
import HotSectorGrid from "@/components/dashboard/HotSectorGrid";
import NewsSummary from "@/components/dashboard/NewsSummary";

export default function SummaryPage() {
  const now = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <p className="mb-6 text-sm text-muted-foreground">{now} 기준 · 지연 데이터</p>
      <div className="flex flex-col gap-10">
        <MarketSummary />
        <HotSectorGrid />
        <NewsSummary />
      </div>
    </main>
  );
}
