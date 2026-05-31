/**
 * 한국투자증권(KIS) Developers API 클라이언트
 * 용도: 국내 주가·수급·체결 데이터
 * 설정: .env.local에 KIS_APP_KEY, KIS_APP_SECRET 추가
 * 발급: https://apiportal.koreainvestment.com/
 * 참고: 계좌 없이 모의투자 앱키로 일부 조회 가능 (실시간 시세 제한)
 */

const BASE_URL = "https://openapi.koreainvestment.com:9443";

interface KisToken {
  access_token: string;
  expires_at: number; // ms timestamp
}

let _token: KisToken | null = null;

async function getAccessToken(): Promise<string | null> {
  if (!process.env.KIS_APP_KEY || !process.env.KIS_APP_SECRET) return null;
  if (_token && _token.expires_at > Date.now() + 60_000) return _token.access_token;

  const res = await fetch(`${BASE_URL}/oauth2/tokenP`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: process.env.KIS_APP_KEY,
      appsecret: process.env.KIS_APP_SECRET,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token: string; expires_in: number };
  _token = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return _token.access_token;
}

export interface KisQuote {
  ticker: string;
  price: number;
  changePercent: number;
  change: number;
  volume: number;
  tradingValue: number; // 거래대금 (원)
  high: number;
  low: number;
  open: number;
}

/**
 * 국내 주식 현재가 조회 (코스피/코스닥 공통)
 * API 키 없으면 null 반환 → 호출부에서 mock 사용.
 */
export async function getKisQuote(ticker: string): Promise<KisQuote | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(
    `${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${ticker}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        appkey: process.env.KIS_APP_KEY!,
        appsecret: process.env.KIS_APP_SECRET!,
        tr_id: "FHKST01010100",
      },
      next: { revalidate: 60 }, // 1분 캐시
    }
  );
  if (!res.ok) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { output: any };
  const o = data.output;
  return {
    ticker,
    price:         Number(o.stck_prpr),
    changePercent: Number(o.prdy_ctrt),
    change:        Number(o.prdy_vrss),
    volume:        Number(o.acml_vol),
    tradingValue:  Number(o.acml_tr_pbmn),
    high:          Number(o.stck_hgpr),
    low:           Number(o.stck_lwpr),
    open:          Number(o.stck_oprc),
  };
}

export interface KisInvestorFlow {
  foreign: number;      // 외국인 순매수 (주)
  institution: number;  // 기관 순매수
  individual: number;   // 개인 순매수
}

/**
 * 투자자별 매매동향 조회
 */
export async function getInvestorFlow(ticker: string): Promise<KisInvestorFlow | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(
    `${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-investor?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${ticker}&FID_INPUT_DATE_1=&FID_INPUT_DATE_2=&FID_PERIOD_DIV_CODE=D`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        appkey: process.env.KIS_APP_KEY!,
        appsecret: process.env.KIS_APP_SECRET!,
        tr_id: "FHKST01010900",
      },
      next: { revalidate: 300 },
    }
  );
  if (!res.ok) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { output1: any[] };
  const latest = data.output1?.[0];
  if (!latest) return null;
  return {
    foreign:     Number(latest.frgn_ntby_qty),
    institution: Number(latest.orgn_ntby_qty),
    individual:  Number(latest.indv_ntby_qty),
  };
}
