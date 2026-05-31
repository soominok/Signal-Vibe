import { marketIndices, type MarketIndex } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function IndexCard({ index }: { index: MarketIndex }) {
  const isUp = index.changePercent > 0;
  const isFlat = index.changePercent === 0;
  const color = isFlat ? "text-muted-foreground" : isUp ? "text-rose-500" : "text-blue-500";
  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 transition-shadow hover:shadow-sm cursor-default">
      <p className="text-xs text-muted-foreground">{index.name}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">
        {index.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
      </p>
      <div className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3" />
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
  const domestic = marketIndices.filter((i) => i.market === "domestic");
  const global   = marketIndices.filter((i) => i.market === "global");

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">시장 지수</h2>
      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">국내</p>
          <div className="grid grid-cols-3 gap-2.5">
            {domestic.map((idx) => <IndexCard key={idx.id} index={idx} />)}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">해외</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {global.map((idx) => <IndexCard key={idx.id} index={idx} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
