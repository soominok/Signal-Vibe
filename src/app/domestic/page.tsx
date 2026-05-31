import { marketIndices } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

const topStocks = [
  { name: "삼성전자",      ticker: "005930", price: 87400,  changePercent:  3.21, volume: "38,241,200" },
  { name: "SK하이닉스",    ticker: "000660", price: 241000, changePercent:  4.15, volume: "12,803,100" },
  { name: "한화에어로스페이스", ticker: "012450", price: 524000, changePercent:  2.88, volume:  "2,401,500" },
  { name: "NAVER",         ticker: "035420", price: 198500, changePercent:  1.94, volume:  "3,812,700" },
  { name: "LG에너지솔루션", ticker: "373220", price: 312000, changePercent: -0.96, volume:  "1,204,300" },
  { name: "현대건설",       ticker: "000720", price:  38450, changePercent: -1.41, volume:  "4,109,800" },
];

const marketBreadth = { up: 521, flat: 89, down: 388 };

export default function DomesticPage() {
  const domestic = marketIndices.filter((i) => i.market === "domestic");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-bold">국내 주식</h1>

      <div className="flex flex-col gap-8">
        {/* 지수 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">국내 지수</h2>
          <div className="grid grid-cols-3 gap-3">
            {domestic.map((idx) => {
              const isUp = idx.changePercent > 0;
              return (
                <div key={idx.id} className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">{idx.name}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {idx.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
                  </p>
                  <p className={`mt-0.5 text-xs font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                    {isUp ? "+" : ""}{idx.changePercent.toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 시장 폭 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">시장 폭 (코스피 기준)</h2>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-rose-500">▲ 상승 {marketBreadth.up}종목</span>
              <span className="text-muted-foreground">—</span>
              <span className="font-medium text-muted-foreground">보합 {marketBreadth.flat}종목</span>
              <span className="text-muted-foreground">—</span>
              <span className="font-medium text-blue-500">▼ 하락 {marketBreadth.down}종목</span>
            </div>
            <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full">
              <div className="bg-rose-400" style={{ width: `${(marketBreadth.up / 998) * 100}%` }} />
              <div className="bg-muted" style={{ width: `${(marketBreadth.flat / 998) * 100}%` }} />
              <div className="bg-blue-400" style={{ width: `${(marketBreadth.down / 998) * 100}%` }} />
            </div>
          </div>
        </section>

        {/* 거래대금 상위 종목 */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">거래대금 상위 종목</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">종목</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">현재가</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">등락률</th>
                  <th className="hidden px-4 py-2.5 text-right font-medium text-muted-foreground sm:table-cell">거래량</th>
                </tr>
              </thead>
              <tbody>
                {topStocks.map((stock, i) => {
                  const isUp = stock.changePercent > 0;
                  return (
                    <tr key={stock.ticker} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{stock.name}</p>
                        <p className="text-xs text-muted-foreground">{stock.ticker}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        {stock.price.toLocaleString("ko-KR")}
                      </td>
                      <td className={`px-4 py-3 text-right tabular-nums font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                        <span className="flex items-center justify-end gap-1">
                          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-right tabular-nums text-muted-foreground sm:table-cell">
                        {stock.volume}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">목업 데이터 · KIS API 연동 후 실데이터로 교체 예정</p>
        </section>
      </div>
    </main>
  );
}
