import { topNews } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";

export default function NewsSummary() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">오늘의 주요 뉴스</h2>
      <div className="flex flex-col gap-3">
        {topNews.map((article, i) => (
          <div
            key={article.id}
            className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
          >
            <span className="shrink-0 text-2xl font-bold tabular-nums text-muted-foreground/30 leading-none mt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{article.title}</p>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{article.summary}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{article.source}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{article.publishedAt}</span>
                <div className="ml-auto flex flex-wrap gap-1">
                  {article.keywords.map((kw) => (
                    <span key={kw} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        AI 생성 요약 · 출처: 각 매체 기사 기준 · 투자 판단은 원문을 직접 확인하세요
      </p>
    </section>
  );
}
