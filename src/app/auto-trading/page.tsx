"use client";

import { useState } from "react";
import { AlertTriangle, Bot, FlaskConical, BarChart3 } from "lucide-react";

type Tab = "strategy" | "backtest" | "result";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "strategy", label: "전략 설정",   icon: <Bot className="h-4 w-4" /> },
  { id: "backtest", label: "백테스트",    icon: <FlaskConical className="h-4 w-4" /> },
  { id: "result",   label: "수익 현황",   icon: <BarChart3 className="h-4 w-4" /> },
];

function PlaceholderBox({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
      <p className="text-base font-medium text-muted-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground/70">{description}</p>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        개발 예정
      </span>
    </div>
  );
}

export default function AutoTradingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("strategy");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-xl font-bold">자동트레이딩</h1>

      {/* 법규 면책 배너 */}
      <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">실매매 연동 전 법규 검토 필수</p>
          <p className="mt-0.5 leading-relaxed">
            자동매매 기능은 자본시장법상 유사투자자문업 신고 및 투자일임업 인가 대상이 될 수 있습니다.
            실거래 연동 전 반드시 법률 전문가 확인을 완료하세요. 현재 이 페이지는 전략 설계 및
            백테스트 전용으로만 사용됩니다.
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "strategy" && (
        <div className="flex flex-col gap-4">
          <PlaceholderBox
            title="전략 설정"
            description="섹터 모멘텀, 이동평균선, 돈의 흐름(MoneyFlow) 등 다양한 알고리즘을 조합해 자동매매 전략을 구성합니다."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["섹터 모멘텀 전략", "이동평균 크로스 전략", "MoneyFlow 추종 전략"].map((name) => (
              <div key={name} className="rounded-xl border border-dashed border-border bg-card p-4">
                <p className="text-sm font-medium">{name}</p>
                <p className="mt-1 text-xs text-muted-foreground">개발 예정</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "backtest" && (
        <PlaceholderBox
          title="백테스트 결과"
          description="설정한 전략을 과거 데이터에 적용해 수익률, MDD(최대낙폭), 샤프지수 등을 시뮬레이션합니다."
        />
      )}

      {activeTab === "result" && (
        <PlaceholderBox
          title="수익 현황"
          description="실행 중인 전략의 수익률, 보유 종목, 매매 이력을 한눈에 확인합니다. 증권사 API 연동 후 활성화됩니다."
        />
      )}
    </main>
  );
}
