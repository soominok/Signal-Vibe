import { marketIndices, type MarketIndex } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

function IndexCard({ index }: { index: MarketIndex }) {
  const isUp = index.changePercent >= 0;

  return (
    <div className="rounded-lg border border-border bg-card px-5 py-4">
      <p className="text-sm text-muted-foreground">{index.name}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {index.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
      </p>
      <div className={`mt-1 flex items-center gap-1 text-sm font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
        {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        <span>
          {isUp ? "+" : ""}
          {index.change.toFixed(2)} ({isUp ? "+" : ""}
          {index.changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}

export default function MarketSummary() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">시장 지수</h2>
      <div className="grid grid-cols-3 gap-3">
        {marketIndices.map((index) => (
          <IndexCard key={index.name} index={index} />
        ))}
      </div>
    </section>
  );
}
