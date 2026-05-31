import { type MacroSnapshot } from "@/lib/api/ecos";

interface Props {
  data: MacroSnapshot;
}

function Cell({
  label,
  value,
  unit,
  time,
}: {
  label: string;
  value: number | null;
  unit: string;
  time: string;
}) {
  const display =
    value !== null
      ? `${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}${unit}`
      : "–";

  const period = time
    ? `${time.slice(0, 4)}년 ${time.slice(4, 6)}월`
    : "";

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{display}</p>
      <p className="mt-0.5 text-xs text-muted-foreground/70">{period}</p>
    </div>
  );
}

export default function MacroIndicators({ data }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">거시경제 지표</h2>
        <span className="text-xs text-muted-foreground">한국은행 ECOS</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Cell
          label="기준금리"
          value={data.baseRate?.value ?? null}
          unit="%"
          time={data.baseRate?.time ?? ""}
        />
        <Cell
          label="소비자물가 (CPI)"
          value={data.cpi?.value ?? null}
          unit="%"
          time={data.cpi?.time ?? ""}
        />
        <Cell
          label="원/달러 (평균)"
          value={data.usdKrw?.value ?? null}
          unit="원"
          time={data.usdKrw?.time ?? ""}
        />
      </div>
    </section>
  );
}
