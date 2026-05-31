"use client";

import { useState } from "react";
import { hotSectors, type HotSector } from "@/lib/mock-data";
import HotSectorCard from "./HotSectorCard";
import SectorDetailPanel from "./SectorDetailPanel";

export default function HotSectorGrid() {
  const [selected, setSelected] = useState<HotSector | null>(null);
  const sorted = [...hotSectors].sort((a, b) => b.changePercent - a.changePercent);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">오늘의 섹터 동향</h2>
        <span className="text-xs text-muted-foreground">클릭하면 상세 보기 · 상승률 순</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((sector) => (
          <HotSectorCard
            key={sector.id}
            sector={sector}
            onClick={() => setSelected(sector)}
          />
        ))}
      </div>

      {selected && (
        <SectorDetailPanel sector={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
