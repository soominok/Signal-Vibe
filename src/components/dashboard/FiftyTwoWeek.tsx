import { newHighStocks, newLowStocks, type FiftyTwoWeekStock } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

function StockRow({ stock, type }: { stock: FiftyTwoWeekStock; type: "high" | "low" }) {
  const isUp = stock.changePercent > 0;
  const changeColor = isUp ? "text-rose-500" : "text-blue-500";

  const range52w = stock.high52w - stock.low52w;
  const position = range52w > 0
    ? ((stock.price - stock.low52w) / range52w) * 100
    : 50;

  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{stock.name}</p>
        <p className="text-xs text-muted-foreground">{stock.ticker}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold tabular-nums">{stock.price.toLocaleString("ko-KR")}</p>
        <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${changeColor}`}>
          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
        </div>
      </div>
      <div className="w-16 shrink-0">
        <div className="relative h-1.5 w-full rounded-full bg-muted">
          <div
            className={`absolute top-0 h-1.5 w-1 -translate-x-1/2 rounded-full ${type === "high" ? "bg-rose-500" : "bg-blue-500"}`}
            style={{ left: `${Math.max(2, Math.min(98, position))}%` }}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-xs text-muted-foreground/60">
          <span>{(stock.low52w / 1000).toFixed(0)}k</span>
          <span>{(stock.high52w / 1000).toFixed(0)}k</span>
        </div>
      </div>
    </div>
  );
}

export default function FiftyTwoWeek() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">52주 신고가 / 신저가</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* 신고가 */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <p className="text-xs font-semibold text-rose-700">신고가 갱신</p>
          </div>
          {newHighStocks.map((s) => <StockRow key={s.ticker} stock={s} type="high" />)}
        </div>
        {/* 신저가 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <p className="text-xs font-semibold text-blue-700">신저가 갱신</p>
          </div>
          {newLowStocks.map((s) => <StockRow key={s.ticker} stock={s} type="low" />)}
        </div>
      </div>
    </section>
  );
}
