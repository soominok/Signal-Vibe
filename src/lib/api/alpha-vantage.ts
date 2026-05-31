/**
 * Alpha Vantage API 클라이언트
 * 용도: 해외 주가·지수 실데이터
 * 설정: .env.local에 ALPHA_VANTAGE_API_KEY 추가
 * 발급: https://www.alphavantage.co/support/#api-key (무료, 500 calls/day, 5/min)
 */

const BASE_URL = "https://www.alphavantage.co/query";

function key(): string | null {
  return process.env.ALPHA_VANTAGE_API_KEY ?? null;
}

export interface AvQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  latestTradingDay: string;
}

/**
 * 해외 주식 현재가 조회 (미국 티커 기준)
 * API 키 없으면 null 반환.
 */
export async function getGlobalQuote(ticker: string): Promise<AvQuote | null> {
  const apiKey = key();
  if (!apiKey) return null;

  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { "Global Quote": any };
  const q = data["Global Quote"];
  if (!q || !q["05. price"]) return null;

  return {
    ticker,
    price:            Number(q["05. price"]),
    change:           Number(q["09. change"]),
    changePercent:    parseFloat(q["10. change percent"]),
    volume:           Number(q["06. volume"]),
    latestTradingDay: q["07. latest trading day"] as string,
  };
}

export interface AvMarketStatus {
  market_type: string;
  region: string;
  primary_exchanges: string;
  local_open: string;
  local_close: string;
  current_status: "open" | "closed";
}

/**
 * 시장 개장 여부 확인
 */
export async function getMarketStatus(): Promise<AvMarketStatus[] | null> {
  const apiKey = key();
  if (!apiKey) return null;

  const res = await fetch(`${BASE_URL}?function=MARKET_STATUS&apikey=${apiKey}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { markets: AvMarketStatus[] };
  return data.markets ?? null;
}
