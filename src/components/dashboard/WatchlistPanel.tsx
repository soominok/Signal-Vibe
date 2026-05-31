"use client";

import { Star, TrendingUp, TrendingDown, X } from "lucide-react";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import { companyDetails } from "@/lib/mock-data";

export function StarButton({
  ticker,
  size = "sm",
}: {
  ticker: string;
  size?: "sm" | "md";
}) {
  const { isWatching, toggle, ready } = useWatchlist();
  if (!ready) return null;

  const watching = isWatching(ticker);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(ticker); }}
      title={watching ? "관심종목 제거" : "관심종목 추가"}
      className={`transition-colors ${
        size === "sm" ? "p-1" : "p-1.5"
      } rounded ${watching ? "text-amber-400 hover:text-amber-500" : "text-muted-foreground/40 hover:text-amber-400"}`}
    >
      <Star className={`${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} ${watching ? "fill-current" : ""}`} />
    </button>
  );
}

export default function WatchlistPanel() {
  const { watchlist, remove, ready } = useWatchlist();

  if (!ready || watchlist.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <h2 className="text-sm font-medium text-muted-foreground">관심종목</h2>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {watchlist.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {watchlist.map((ticker) => {
          const info = companyDetails[ticker];
          const isUp = (info?.changePercent ?? 0) > 0;
          const isFlat = (info?.changePercent ?? 0) === 0;
          const color = isFlat
            ? "text-muted-foreground"
            : isUp
            ? "text-rose-500"
            : "text-blue-500";
          const Icon = isFlat ? null : isUp ? TrendingUp : TrendingDown;
          return (
            <div
              key={ticker}
              className="relative flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <button
                onClick={() => remove(ticker)}
                className="absolute right-1.5 top-1.5 rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="pr-4 text-sm font-medium leading-tight">{ticker}</p>
              {info && info.ticker !== "-" ? (
                <>
                  <p className="text-base font-semibold tabular-nums">
                    {info.price.toLocaleString("ko-KR")}
                  </p>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${color}`}>
                    {Icon && <Icon className="h-3 w-3" />}
                    {isUp ? "+" : ""}{info.changePercent.toFixed(2)}%
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">미상장</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
