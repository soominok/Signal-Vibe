import { marketIndices, domesticTopStocks } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StarButton } from "@/components/dashboard/WatchlistPanel";
import {
  getTradingValueRank,
  parseKiwoomNumber,
  cleanTicker,
  type KiwoomRankItem,
} from "@/lib/api/kiwoom";

export const revalidate = 60; // 1분 캐시

const marketBreadth = { up: 521, flat: 89, down: 388, total: 998 };

/** 거래대금 (백만원) → "1조 2,345억" 표기 */
function formatTradingValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}조`;
  if (v >= 10_000)    return `${Math.floor(v / 10_000).toLocaleString("ko-KR")}억`;
  return `${v.toLocaleString("ko-KR")}백만`;
}

function LiveStockTable({ stocks }: { stocks: KiwoomRankItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground w-8">#</th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">종목</th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground hidden sm:table-cell">현재가</th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">등락률</th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground hidden md:table-cell">거래대금</th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground hidden lg:table-cell">전일순위</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => {
            const changePercent = parseKiwoomNumber(stock.flu_rt);
            const price         = parseKiwoomNumber(stock.cur_prc);
            const trdeVal       = parseKiwoomNumber(stock.trde_prica);
            const isUp = changePercent > 0;
            const ticker = cleanTicker(stock.stk_cd);
            const rankDiff = parseInt(stock.pred_rank) - parseInt(stock.now_rank);

            return (
              <tr key={stock.stk_cd} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="px-3 py-3 text-muted-foreground tabular-nums font-medium">{stock.now_rank}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <div>
                      <p className="font-medium">{stock.stk_nm}</p>
                      <p className="text-xs text-muted-foreground">{ticker}</p>
                    </div>
                    <StarButton ticker={stock.stk_nm} />
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-right tabular-nums font-medium sm:table-cell">
                  {price.toLocaleString("ko-KR")}
                </td>
                <td className={`px-3 py-3 text-right tabular-nums font-medium ${isUp ? "text-rose-500" : changePercent < 0 ? "text-blue-500" : "text-muted-foreground"}`}>
                  <span className="flex items-center justify-end gap-1">
                    {isUp ? <TrendingUp className="h-3 w-3" /> : changePercent < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                    {isUp ? "+" : ""}{changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="hidden px-3 py-3 text-right tabular-nums text-muted-foreground md:table-cell">
                  {formatTradingValue(trdeVal)}
                </td>
                <td className="hidden px-3 py-3 text-right lg:table-cell">
                  <span className={`text-xs font-medium ${rankDiff > 0 ? "text-rose-500" : rankDiff < 0 ? "text-blue-500" : "text-muted-foreground"}`}>
                    {rankDiff > 0 ? `▲${rankDiff}` : rankDiff < 0 ? `▼${Math.abs(rankDiff)}` : "—"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MockStockTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-8">#</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">종목</th>
            <th className="px-4 py-2.5 text-right font-medium text-muted-foreground hidden sm:table-cell">현재가</th>
            <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">등락률</th>
          </tr>
        </thead>
        <tbody>
          {domesticTopStocks.map((stock, i) => {
            const isUp = stock.changePercent > 0;
            return (
              <>
                <tr key={stock.ticker} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{stock.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div>
                        <p className="font-medium">{stock.name}</p>
                        <p className="text-xs text-muted-foreground">{stock.ticker}</p>
                      </div>
                      <StarButton ticker={stock.name} />
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums font-medium sm:table-cell">
                    {stock.price.toLocaleString("ko-KR")}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums font-medium ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                    <span className="flex items-center justify-end gap-1">
                      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </span>
                  </td>
                </tr>
                <tr key={`${stock.ticker}-c`} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td /><td colSpan={3} className="px-4 pb-3 pt-0">
                    <p className="text-xs text-muted-foreground border-l-2 border-border pl-2">{stock.comment}</p>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function DomesticPage() {
  const domestic    = marketIndices.filter((i) => i.market === "domestic");
  const liveKospi   = await getTradingValueRank("001", 50);
  const liveKosdaq  = await getTradingValueRank("101", 50);
  const isLive      = liveKospi.length > 0;

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
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <span className="font-medium text-rose-500">▲ 상승 {marketBreadth.up}종목</span>
              <span className="text-muted-foreground">—</span>
              <span className="font-medium text-muted-foreground">보합 {marketBreadth.flat}종목</span>
              <span className="text-muted-foreground">—</span>
              <span className="font-medium text-blue-500">▼ 하락 {marketBreadth.down}종목</span>
            </div>
            <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full">
              <div className="bg-rose-400" style={{ width: `${(marketBreadth.up / marketBreadth.total) * 100}%` }} />
              <div className="bg-muted"    style={{ width: `${(marketBreadth.flat / marketBreadth.total) * 100}%` }} />
              <div className="bg-blue-400" style={{ width: `${(marketBreadth.down / marketBreadth.total) * 100}%` }} />
            </div>
          </div>
        </section>

        {/* 거래대금 순위 — 코스피 */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">코스피 거래대금 순위</h2>
            <span className={`text-xs font-medium ${isLive ? "text-rose-500" : "text-muted-foreground"}`}>
              {isLive ? "🔴 키움 실데이터 · 1분 갱신" : "목업 데이터"}
            </span>
          </div>
          {isLive ? <LiveStockTable stocks={liveKospi} /> : <MockStockTable />}
        </section>

        {/* 거래대금 순위 — 코스닥 */}
        {isLive && liveKosdaq.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">코스닥 거래대금 순위</h2>
              <span className="text-xs text-rose-500 font-medium">🔴 키움 실데이터</span>
            </div>
            <LiveStockTable stocks={liveKosdaq} />
          </section>
        )}
      </div>
    </main>
  );
}
