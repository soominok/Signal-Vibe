import { upcomingEvents, type EventImpact } from "@/lib/mock-data";

const impactConfig: Record<EventImpact, { dot: string; label: string }> = {
  high:   { dot: "bg-rose-500",   label: "고" },
  medium: { dot: "bg-amber-400",  label: "중" },
  low:    { dot: "bg-muted-foreground", label: "저" },
};

export default function UpcomingEvents() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground">이번 주 경제 이벤트</p>
      <div className="flex flex-col">
        {upcomingEvents.map((ev, i) => {
          const cfg = impactConfig[ev.impact];
          return (
            <div
              key={i}
              className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
            >
              <div className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} title={`영향도: ${cfg.label}`} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium leading-snug">{ev.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{ev.country}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{ev.date} {ev.time}</span>
                  {ev.forecast && <span>예상 {ev.forecast}</span>}
                  {ev.previous && <span className="opacity-60">이전 {ev.previous}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground/60">
        ● 고영향 &nbsp;● 중영향 &nbsp;● 저영향 · 시간은 한국 기준
      </p>
    </div>
  );
}
