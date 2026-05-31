import MarketSummary from "@/components/dashboard/MarketSummary";
import HotSectorGrid from "@/components/dashboard/HotSectorGrid";

export default function DashboardPage() {
  const now = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">재테크 레이더</h1>
        <p className="mt-1 text-sm text-muted-foreground">{now} 기준 · 지연 데이터</p>
      </div>

      <div className="flex flex-col gap-8">
        <MarketSummary />
        <HotSectorGrid />
      </div>
    </main>
  );
}
