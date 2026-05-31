import { marketIndices } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

const topGlobalStocks = [
  { name: "NVIDIA",    ticker: "NVDA",  price: 1089.23, changePercent:  4.21, exchange: "NASDAQ" },
  { name: "Apple",     ticker: "AAPL",  price:  213.45, changePercent:  0.84, exchange: "NASDAQ" },
  { name: "Microsoft", ticker: "MSFT",  price:  421.80, changePercent:  1.12, exchange: "NASDAQ" },
  { name: "Tesla",     ticker: "TSLA",  price:  182.34, changePercent: -1.38, exchange: "NASDAQ" },
  { name: "Amazon",    ticker: "AMZN",  price:  198.67, changePercent:  0.63, exchange: "NASDAQ" },
  { name: "Meta",      ticker: "META",  price:  582.10, changePercent:  1.94, exchange: "NASDAQ" },
];

const currencyRates = [
  { pair: "원/달러",   value: 1382.5,  change: -3.5,  changePercent: -0.25 },
  { pair: "원/엔",     value:   9.42,  change:  0.08, changePercent:  0.86 },
  { pair: "원/유로",   value: 1521.3,  change:  4.2,  changePercent:  0.28 },
  { pair: "달러/엔",   value: 147.12,  change:  0.42, changePercent:  0.29 },
];

export default function GlobalPage() {
  const global = marketIndices.filter((i) => i.market === "global");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-bold">해외 주식</h1>

      <div className="flex flex-col gap-8">
        {/* 해외 지수 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">해외 지수</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {global.map((idx) => {
              const isUp = idx.changePercent > 0;
              return (
                <div key={idx.id} className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">{idx.name}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {idx.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </p>
                  <p className={`mt-0.5 text-xs font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                    {isUp ? "+" : ""}{idx.changePercent.toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 환율 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">환율</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {currencyRates.map((rate) => {
              const isUp = rate.changePercent > 0;
              return (
                <div key={rate.pair} className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">{rate.pair}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {rate.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
                  </p>
                  <p className={`mt-0.5 text-xs font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                    {isUp ? "+" : ""}{rate.changePercent.toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 글로벌 주요 종목 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">글로벌 주요 종목</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">종목</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">현재가 (USD)</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">등락률</th>
                  <th className="hidden px-4 py-2.5 text-right font-medium text-muted-foreground sm:table-cell">거래소</th>
                </tr>
              </thead>
              <tbody>
                {topGlobalStocks.map((stock, i) => {
                  const isUp = stock.changePercent > 0;
                  return (
                    <tr key={stock.ticker} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{stock.name}</p>
                        <p className="text-xs text-muted-foreground">{stock.ticker}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        ${stock.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-4 py-3 text-right tabular-nums font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                        <span className="flex items-center justify-end gap-1">
                          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                        {stock.exchange}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">목업 데이터 · 해외 API 연동 후 실데이터로 교체 예정</p>
        </section>
      </div>
    </main>
  );
}
