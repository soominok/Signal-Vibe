import { hotSectors } from "@/lib/mock-data";
import HotSectorCard from "./HotSectorCard";

export default function HotSectorGrid() {
  const sorted = [...hotSectors].sort((a, b) => b.changePercent - a.changePercent);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">오늘의 섹터 동향</h2>
        <span className="text-xs text-muted-foreground">상승률 순</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((sector) => (
          <HotSectorCard key={sector.id} sector={sector} />
        ))}
      </div>
    </section>
  );
}
