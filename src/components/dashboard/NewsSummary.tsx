import { topNews, type Sentiment } from "@/lib/mock-data";
import { ExternalLink, Sparkles } from "lucide-react";

const sentimentConfig: Record<Sentiment, { label: string; className: string }> = {
  positive: { label: "긍정",  className: "bg-rose-100 text-rose-700" },
  negative: { label: "부정",  className: "bg-blue-100 text-blue-700" },
  neutral:  { label: "중립",  className: "bg-muted text-muted-foreground" },
};

export default function NewsSummary() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">오늘의 주요 뉴스</h2>
        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" /> AI 감성 분석
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {topNews.map((article, i) => {
          const sc = article.sentiment ? sentimentConfig[article.sentiment] : null;
          return (
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
                  {sc && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.className}`}>
                      {sc.label} {article.sentimentScore}
                    </span>
                  )}
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
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        AI 생성 감성 분석 · 실제 Claude API 연동 후 자동 갱신 예정 · 투자 판단은 원문을 직접 확인하세요
      </p>
    </section>
  );
}
