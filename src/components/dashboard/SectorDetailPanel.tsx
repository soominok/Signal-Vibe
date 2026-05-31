"use client";

import { useState } from "react";
import { X, ChevronRight, ExternalLink } from "lucide-react";
import { type HotSector, type MoneyFlowLevel } from "@/lib/mock-data";

const moneyFlowLabel: Record<MoneyFlowLevel, string> = {
  "strong-in":  "강한 유입",
  "in":         "유입",
  "neutral":    "보합",
  "out":        "유출",
  "strong-out": "강한 유출",
};

const moneyFlowClass: Record<MoneyFlowLevel, string> = {
  "strong-in":  "bg-rose-100 text-rose-700",
  "in":         "bg-orange-100 text-orange-700",
  "neutral":    "bg-muted text-muted-foreground",
  "out":        "bg-sky-100 text-sky-700",
  "strong-out": "bg-blue-100 text-blue-700",
};

interface Props {
  sector: HotSector;
  onClose: () => void;
}

export default function SectorDetailPanel({ sector, onClose }: Props) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  const filteredNews = activeKeyword
    ? sector.relatedNews.filter((n) => n.keywords.includes(activeKeyword))
    : sector.relatedNews;

  const isUp = sector.changePercent >= 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-y-auto bg-background shadow-2xl sm:w-[500px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{sector.name}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${moneyFlowClass[sector.moneyFlow]}`}>
              {moneyFlowLabel[sector.moneyFlow]}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5">
          {/* Change & summary */}
          <div>
            <p className={`text-2xl font-bold ${isUp ? "text-rose-500" : "text-blue-500"}`}>
              {isUp ? "+" : ""}{sector.changePercent.toFixed(2)}%
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{sector.summary}</p>
          </div>

          {/* Keywords */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              주요 뉴스 키워드
            </p>
            <div className="flex flex-wrap gap-2">
              {sector.keywords.map((kw) => (
                <button
                  key={kw.keyword}
                  onClick={() =>
                    setActiveKeyword(activeKeyword === kw.keyword ? null : kw.keyword)
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
                    activeKeyword === kw.keyword
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {kw.keyword}
                  <span className="text-xs opacity-60">{kw.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* News list */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              관련 뉴스{activeKeyword ? ` — ${activeKeyword}` : ""}
            </p>
            {filteredNews.length === 0 ? (
              <p className="text-sm text-muted-foreground">해당 키워드의 뉴스가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredNews.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{article.title}</p>
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {article.summary}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{article.source}</span>
                      <span>·</span>
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Value chain */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              밸류체인
            </p>
            <div className="flex flex-col gap-0">
              {sector.valueChain.map((stage, i) => (
                <div key={stage.stage} className="flex items-stretch gap-0">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-px bg-border" style={{ visibility: i === 0 ? "hidden" : "visible" }} />
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 w-px bg-border" style={{ visibility: i === sector.valueChain.length - 1 ? "hidden" : "visible" }} />
                  </div>
                  <div className="ml-3 mb-3 flex-1 rounded-lg border border-border bg-card p-3">
                    <p className="text-xs font-semibold text-primary">{stage.stage}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {stage.companies.map((company) => (
                        <span
                          key={company}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related tickers */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              주요 종목
            </p>
            <div className="flex flex-wrap gap-2">
              {sector.topTickers.map((ticker) => (
                <span
                  key={ticker}
                  className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                >
                  {ticker}
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
