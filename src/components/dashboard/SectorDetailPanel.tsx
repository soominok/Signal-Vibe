"use client";

import { useState } from "react";
import { X, ChevronLeft, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  type HotSector,
  type MoneyFlowLevel,
  type ValueChainStage,
  companyDetails,
} from "@/lib/mock-data";

// ─── 설정 ────────────────────────────────────────────────────────

const moneyFlowLabel: Record<MoneyFlowLevel, string> = {
  "strong-in": "강한 유입", in: "유입", neutral: "보합", out: "유출", "strong-out": "강한 유출",
};
const moneyFlowClass: Record<MoneyFlowLevel, string> = {
  "strong-in": "bg-rose-100 text-rose-700", in: "bg-orange-100 text-orange-700",
  neutral: "bg-muted text-muted-foreground", out: "bg-sky-100 text-sky-700",
  "strong-out": "bg-blue-100 text-blue-700",
};

// ─── 기업 상세 뷰 ────────────────────────────────────────────────

function CompanyDetailView({
  companyName,
  stage,
  allStages,
  onBack,
}: {
  companyName: string;
  stage: string;
  allStages: ValueChainStage[];
  onBack: () => void;
}) {
  const info = companyDetails[companyName];
  const sameStage = allStages.find((s) => s.stage === stage);
  const siblings = sameStage?.companies.filter((c) => c !== companyName) ?? [];

  const isUp   = (info?.changePercent ?? 0) > 0;
  const isFlat = (info?.changePercent ?? 0) === 0;
  const weekUp = (info?.weekChangePercent ?? 0) > 0;

  const changeColor = isFlat
    ? "text-muted-foreground"
    : isUp
    ? "text-rose-500"
    : "text-blue-500";
  const ChangeIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const weekColor = weekUp ? "text-rose-500" : "text-blue-500";

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        섹터 상세로 돌아가기
      </button>

      {/* 기업 헤더 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{companyName}</h3>
            {info?.ticker && info.ticker !== "-" && (
              <p className="text-xs text-muted-foreground">{info.ticker}</p>
            )}
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {stage}
          </span>
        </div>

        {info ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">현재가</p>
              {info.ticker !== "-" ? (
                <>
                  <p className="mt-0.5 text-base font-semibold tabular-nums">
                    {info.price.toLocaleString("ko-KR")}원
                  </p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${changeColor}`}>
                    <ChangeIcon className="h-3 w-3" />
                    {isUp ? "+" : ""}{info.changePercent.toFixed(2)}%
                  </div>
                </>
              ) : (
                <p className="mt-0.5 text-sm text-muted-foreground">미상장</p>
              )}
            </div>
            <div className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">주간 등락</p>
              {info.ticker !== "-" ? (
                <p className={`mt-0.5 text-base font-semibold tabular-nums ${weekColor}`}>
                  {weekUp ? "+" : ""}{info.weekChangePercent.toFixed(2)}%
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-muted-foreground">-</p>
              )}
              <p className="text-xs text-muted-foreground">최근 5거래일</p>
            </div>
          </div>
        ) : null}

        {info && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{info.description}</p>
        )}
      </div>

      {/* 같은 밸류체인 단계 기업 */}
      {siblings.length > 0 && (
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            같은 단계 ({stage}) 기업
          </p>
          <div className="flex flex-col gap-2">
            {siblings.map((name) => {
              const d = companyDetails[name];
              const up = (d?.changePercent ?? 0) > 0;
              const flat = (d?.changePercent ?? 0) === 0;
              const color = flat ? "text-muted-foreground" : up ? "text-rose-500" : "text-blue-500";
              const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
              return (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    {d?.ticker && d.ticker !== "-" && (
                      <p className="text-xs text-muted-foreground">{d.ticker}</p>
                    )}
                  </div>
                  {d && d.ticker !== "-" ? (
                    <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {up ? "+" : ""}{d.changePercent.toFixed(2)}%
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">미상장</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!info && (
        <p className="text-center text-sm text-muted-foreground py-8">
          기업 상세 정보 준비 중입니다.
        </p>
      )}
    </div>
  );
}

// ─── 섹터 상세 뷰 ────────────────────────────────────────────────

interface SelectedCompany {
  name: string;
  stage: string;
}

interface Props {
  sector: HotSector;
  onClose: () => void;
}

export default function SectorDetailPanel({ sector, onClose }: Props) {
  const [activeKeyword, setActiveKeyword]     = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);

  const filteredNews = activeKeyword
    ? sector.relatedNews.filter((n) => n.keywords.includes(activeKeyword))
    : sector.relatedNews;

  const isUp = sector.changePercent >= 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* 패널 */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-y-auto bg-background shadow-2xl sm:w-[500px]">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {selectedCompany ? selectedCompany.name : sector.name}
            </h2>
            {!selectedCompany && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${moneyFlowClass[sector.moneyFlow]}`}>
                {moneyFlowLabel[sector.moneyFlow]}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 기업 상세 뷰 */}
        {selectedCompany ? (
          <CompanyDetailView
            companyName={selectedCompany.name}
            stage={selectedCompany.stage}
            allStages={sector.valueChain}
            onBack={() => setSelectedCompany(null)}
          />
        ) : (
          /* 섹터 상세 뷰 */
          <div className="flex flex-col gap-6 p-5">
            {/* 등락률 + 요약 */}
            <div>
              <p className={`text-2xl font-bold ${isUp ? "text-rose-500" : "text-blue-500"}`}>
                {isUp ? "+" : ""}{sector.changePercent.toFixed(2)}%
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{sector.summary}</p>
            </div>

            {/* 키워드 */}
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                주요 뉴스 키워드
              </p>
              <div className="flex flex-wrap gap-2">
                {sector.keywords.map((kw) => (
                  <button
                    key={kw.keyword}
                    onClick={() => setActiveKeyword(activeKeyword === kw.keyword ? null : kw.keyword)}
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

            {/* 관련 뉴스 */}
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                관련 뉴스{activeKeyword ? ` — ${activeKeyword}` : ""}
              </p>
              {filteredNews.length === 0 ? (
                <p className="text-sm text-muted-foreground">해당 키워드의 뉴스가 없습니다.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredNews.map((article) => (
                    <div key={article.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{article.title}</p>
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{article.summary}</p>
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

            {/* 밸류체인 */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                밸류체인 — 기업 이름을 클릭하면 상세 정보를 볼 수 있습니다
              </p>
              <div className="flex flex-col">
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
                        {stage.companies.map((company) => {
                          const d = companyDetails[company];
                          const up   = (d?.changePercent ?? 0) > 0;
                          const flat = (d?.changePercent ?? 0) === 0;
                          const color = flat ? "" : up ? "text-rose-500" : "text-blue-500";
                          return (
                            <button
                              key={company}
                              onClick={() => setSelectedCompany({ name: company, stage: stage.stage })}
                              className="group flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              <span>{company}</span>
                              {d && d.ticker !== "-" && (
                                <span className={`font-medium ${color}`}>
                                  {up ? "+" : ""}{d.changePercent.toFixed(1)}%
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 주요 종목 */}
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">주요 종목</p>
              <div className="flex flex-wrap gap-2">
                {sector.topTickers.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => {
                      const stage = sector.valueChain.find((s) => s.companies.includes(ticker));
                      if (stage) setSelectedCompany({ name: ticker, stage: stage.stage });
                    }}
                    className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {ticker}
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
