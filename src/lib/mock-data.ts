export type MoneyFlowLevel = "strong-in" | "in" | "neutral" | "out" | "strong-out";

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface HotSector {
  id: string;
  name: string;
  changePercent: number;
  moneyFlow: MoneyFlowLevel;
  topTickers: string[];
  summary: string;
}

export const marketIndices: MarketIndex[] = [
  { name: "KOSPI", value: 2650.23, change: 21.54, changePercent: 0.82 },
  { name: "KOSDAQ", value: 852.41, change: -2.67, changePercent: -0.31 },
  { name: "원/달러", value: 1382.5, change: -3.5, changePercent: -0.25 },
];

export const hotSectors: HotSector[] = [
  {
    id: "semiconductor",
    name: "반도체",
    changePercent: 3.21,
    moneyFlow: "strong-in",
    topTickers: ["삼성전자", "SK하이닉스", "한미반도체"],
    summary: "AI 서버 수요 급증으로 HBM 공급 부족 우려, 외국인 대규모 순매수",
  },
  {
    id: "ai-sw",
    name: "AI/소프트웨어",
    changePercent: 2.15,
    moneyFlow: "in",
    topTickers: ["NAVER", "카카오", "더존비즈온"],
    summary: "국내 LLM 도입 확산, 엔터프라이즈 AI 전환 수요 증가",
  },
  {
    id: "defense",
    name: "방산",
    changePercent: 1.87,
    moneyFlow: "in",
    topTickers: ["한화에어로스페이스", "LIG넥스원", "현대로템"],
    summary: "유럽·중동 수출 계약 기대감, 국방 예산 증가 수혜",
  },
  {
    id: "bio",
    name: "바이오/제약",
    changePercent: 0.64,
    moneyFlow: "neutral",
    topTickers: ["셀트리온", "삼성바이오로직스", "유한양행"],
    summary: "글로벌 임상 결과 대기, 위탁생산(CMO) 수주 지속",
  },
  {
    id: "secondary-battery",
    name: "2차전지",
    changePercent: -0.53,
    moneyFlow: "out",
    topTickers: ["LG에너지솔루션", "POSCO홀딩스", "에코프로비엠"],
    summary: "전기차 수요 둔화 우려, 미국 IRA 세액공제 불확실성 지속",
  },
  {
    id: "construction",
    name: "건설",
    changePercent: -1.24,
    moneyFlow: "strong-out",
    topTickers: ["현대건설", "GS건설", "대우건설"],
    summary: "PF 리스크 우려 재부각, 금리 인하 지연으로 수익성 압박",
  },
];
