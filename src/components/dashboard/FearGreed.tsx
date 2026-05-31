import { fearGreed, type FearGreedLevel } from "@/lib/mock-data";

const levelConfig: Record<FearGreedLevel, { label: string; color: string; bg: string }> = {
  "extreme-fear":  { label: "극단적 공포", color: "text-blue-700",  bg: "bg-blue-100"  },
  "fear":          { label: "공포",         color: "text-sky-600",   bg: "bg-sky-100"   },
  "neutral":       { label: "중립",         color: "text-muted-foreground", bg: "bg-muted" },
  "greed":         { label: "탐욕",         color: "text-orange-600", bg: "bg-orange-100" },
  "extreme-greed": { label: "극단적 탐욕",  color: "text-rose-700",  bg: "bg-rose-100"  },
};

export default function FearGreed() {
  const { score, level, prevScore, weekScore, factors } = fearGreed;
  const cfg = levelConfig[level];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">시장 심리 지수</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      {/* 점수 */}
      <div className="mb-3 flex items-end gap-3">
        <p className={`text-4xl font-bold tabular-nums ${cfg.color}`}>{score}</p>
        <div className="mb-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span>어제 {prevScore}</span>
          <span>1주 전 {weekScore}</span>
        </div>
      </div>

      {/* 게이지 바 */}
      <div className="relative mb-3 h-2.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-rose-500">
        <div
          className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-foreground shadow"
          style={{ left: `calc(${score}% - 2px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 공포</span>
        <span>탐욕 100</span>
      </div>

      {/* 주요 요인 */}
      <div className="mt-3 border-t border-border pt-3">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">주요 요인</p>
        <div className="flex flex-col gap-1">
          {factors.map((f) => (
            <div key={f.name} className="flex items-center gap-2 text-xs">
              <span className={f.contribution === "positive" ? "text-rose-500" : f.contribution === "negative" ? "text-blue-500" : "text-muted-foreground"}>
                {f.contribution === "positive" ? "▲" : f.contribution === "negative" ? "▼" : "—"}
              </span>
              <span className="text-muted-foreground">{f.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
