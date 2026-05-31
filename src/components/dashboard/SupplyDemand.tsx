import { supplyDemand } from "@/lib/mock-data";

function formatAmount(amount: number) {
  const abs = Math.abs(amount);
  return (amount >= 0 ? "+" : "-") + abs.toLocaleString("ko-KR") + "억";
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;
  const isPos = streak > 0;
  const label = `${Math.abs(streak)}일 연속 ${isPos ? "순매수" : "순매도"}`;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isPos ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"}`}>
      {label}
    </span>
  );
}

export default function SupplyDemand() {
  const maxAbs = Math.max(...supplyDemand.flatMap((m) => m.players.map((p) => Math.abs(p.amount))));

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">수급 현황</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {supplyDemand.map((market) => (
          <div key={market.market} className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{market.market}</p>
            <div className="flex flex-col gap-3">
              {market.players.map((player) => {
                const isPos = player.amount >= 0;
                const barWidth = (Math.abs(player.amount) / maxAbs) * 100;
                return (
                  <div key={player.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{player.name}</span>
                        <StreakBadge streak={player.streak} />
                      </div>
                      <span className={`text-sm font-semibold tabular-nums ${isPos ? "text-rose-500" : "text-blue-500"}`}>
                        {formatAmount(player.amount)}
                      </span>
                    </div>
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${isPos ? "bg-rose-400" : "bg-blue-400"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
