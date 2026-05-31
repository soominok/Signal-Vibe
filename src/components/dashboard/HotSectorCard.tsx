import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { type HotSector, type MoneyFlowLevel } from "@/lib/mock-data";

const moneyFlowConfig: Record<MoneyFlowLevel, { label: string; className: string }> = {
  "strong-in":  { label: "강한 유입",  className: "bg-rose-100 text-rose-700" },
  "in":         { label: "유입",       className: "bg-orange-100 text-orange-700" },
  "neutral":    { label: "보합",       className: "bg-muted text-muted-foreground" },
  "out":        { label: "유출",       className: "bg-sky-100 text-sky-700" },
  "strong-out": { label: "강한 유출",  className: "bg-blue-100 text-blue-700" },
};

interface Props {
  sector: HotSector;
  onClick: () => void;
}

export default function HotSectorCard({ sector, onClick }: Props) {
  const isUp = sector.changePercent > 0;
  const isFlat = sector.changePercent === 0;
  const color = isFlat ? "text-muted-foreground" : isUp ? "text-rose-500" : "text-blue-500";
  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const flow = moneyFlowConfig[sector.moneyFlow];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{sector.name}</h3>
          <div className={`mt-0.5 flex items-center gap-1 text-sm font-medium ${color}`}>
            <Icon className="h-3.5 w-3.5" />
            <span>{isUp ? "+" : ""}{sector.changePercent.toFixed(2)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${flow.className}`}>
            {flow.label}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{sector.summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {sector.topTickers.map((ticker) => (
          <span key={ticker} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {ticker}
          </span>
        ))}
      </div>
    </button>
  );
}
