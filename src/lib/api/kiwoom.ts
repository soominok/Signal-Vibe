/**
 * 키움증권 Open API REST 클라이언트
 * 용도: 국내 주가·수급 실데이터 (KIS 대체)
 * 설정: KIWOOM_APP_KEY, KIWOOM_APP_SECRET (.env.local)
 * 문서: https://developers.kiwoom.com/
 *
 * ⚠️ 키움 REST API는 비교적 최근 출시됨.
 *    정확한 엔드포인트/헤더는 개발자 포털에서 확인 필요.
 *    현재는 토큰 발급 + 현재가 조회 패턴을 구현함.
 */

const BASE_URL = "https://openapi.kiwoom.com:9443";

interface KiwoomToken {
  access_token: string;
  expires_at: number;
}

let _token: KiwoomToken | null = null;

async function getAccessToken(): Promise<string | null> {
  const appKey    = process.env.KIWOOM_APP_KEY;
  const appSecret = process.env.KIWOOM_APP_SECRET;
  if (!appKey) return null;

  // 토큰이 유효하면 재사용
  if (_token && _token.expires_at > Date.now() + 60_000) return _token.access_token;

  try {
    const res = await fetch(`${BASE_URL}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey:    appKey,
        secretkey: appSecret ?? "",
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { token: string; expires_dt: string };
    // expires_dt 형식: "20261231235959"
    const exp = data.expires_dt
      ? new Date(
          `${data.expires_dt.slice(0, 4)}-${data.expires_dt.slice(4, 6)}-${data.expires_dt.slice(6, 8)}T${data.expires_dt.slice(8, 10)}:${data.expires_dt.slice(10, 12)}:${data.expires_dt.slice(12, 14)}+09:00`
        ).getTime()
      : Date.now() + 86_400_000;

    _token = { access_token: data.token, expires_at: exp };
    return _token.access_token;
  } catch {
    return null;
  }
}

export interface KiwoomQuote {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  change: number;
  volume: number;
  tradingValue: number;
  high: number;
  low: number;
  open: number;
  high52w: number;
  low52w: number;
}

/**
 * 국내 주식 현재가 조회
 * ticker: 6자리 종목코드 (예: "005930")
 * API 키 없거나 오류 시 null 반환 → 호출부에서 mock 사용.
 */
export async function getKiwoomQuote(ticker: string): Promise<KiwoomQuote | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${ticker}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          appkey:    process.env.KIWOOM_APP_KEY!,
          secretkey: process.env.KIWOOM_APP_SECRET ?? "",
          tr_id:     "FHKST01010100",
          "Content-Type": "application/json; charset=UTF-8",
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as { output: any };
    const o = data.output;
    return {
      ticker,
      name:          o.hts_kor_isnm as string,
      price:         Number(o.stck_prpr),
      changePercent: Number(o.prdy_ctrt),
      change:        Number(o.prdy_vrss),
      volume:        Number(o.acml_vol),
      tradingValue:  Number(o.acml_tr_pbmn),
      high:          Number(o.stck_hgpr),
      low:           Number(o.stck_lwpr),
      open:          Number(o.stck_oprc),
      high52w:       Number(o.w52_hgpr),
      low52w:        Number(o.w52_lwpr),
    };
  } catch {
    return null;
  }
}

export interface KiwoomRankItem {
  rank: number;
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  tradingValue: number;
}

/**
 * 거래대금 상위 종목 조회 (코스피/코스닥)
 * market: "J" = 코스피, "Q" = 코스닥
 */
export async function getTopByTradingValue(
  market: "J" | "Q" = "J",
  count = 20
): Promise<KiwoomRankItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/uapi/domestic-stock/v1/ranking/volume?FID_COND_MRKT_DIV_CODE=${market}&FID_COND_SCR_DIV_CODE=20171&FID_INPUT_ISCD=0000&FID_DIV_CLS_CODE=0&FID_BLNG_CLS_CODE=0&FID_TRGT_CLS_CODE=111111111&FID_TRGT_EXLS_CLS_CODE=0000000000&FID_INPUT_PRICE_1=&FID_INPUT_PRICE_2=&FID_VOL_CNT=&FID_INPUT_DATE_1=`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          appkey:    process.env.KIWOOM_APP_KEY!,
          secretkey: process.env.KIWOOM_APP_SECRET ?? "",
          tr_id:     "FHPST01710000",
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as { output: any[] };
    return (data.output ?? []).slice(0, count).map((o, i) => ({
      rank:          i + 1,
      ticker:        o.mksc_shrn_iscd as string,
      name:          o.hts_kor_isnm as string,
      price:         Number(o.stck_prpr),
      changePercent: Number(o.prdy_ctrt),
      tradingValue:  Number(o.acml_tr_pbmn),
    }));
  } catch {
    return [];
  }
}
