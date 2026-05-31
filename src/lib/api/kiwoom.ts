/**
 * 키움증권 Open API REST 클라이언트
 * Base URL: https://api.kiwoom.com
 * 인증: POST /oauth2/token → token (Bearer)
 * 요청 방식: POST + api-id 헤더 (TR 코드)
 *
 * 확인된 TR 매핑:
 *   ka10001 → /api/dostk/stkinfo  (주식기본정보: 현재가·등락률·거래량·52w·재무)
 *   ka10004 → /api/dostk/mrkcond  (주식호가: 매수/매도 10단계)
 *   ka10007 → /api/dostk/mrkcond  (주식현재가정보)
 */

const BASE       = "https://api.kiwoom.com";
const APP_KEY    = () => process.env.KIWOOM_APP_KEY    ?? "";
const APP_SECRET = () => process.env.KIWOOM_APP_SECRET ?? "";

// ─── 토큰 캐시 ────────────────────────────────────────────────────

interface KiwoomToken { value: string; expiresAt: number }
let _token: KiwoomToken | null = null;

async function getToken(): Promise<string | null> {
  if (!APP_KEY() || !APP_SECRET()) return null;
  if (_token && _token.expiresAt > Date.now() + 60_000) return _token.value;

  try {
    const res = await fetch(`${BASE}/oauth2/token`, {
      method:  "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ grant_type: "client_credentials", appkey: APP_KEY(), secretkey: APP_SECRET() }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string; expires_dt?: string };
    if (!data.token) return null;

    // expires_dt: "YYYYMMDDHHmmss" KST
    const exp = data.expires_dt
      ? new Date(`${data.expires_dt.slice(0,4)}-${data.expires_dt.slice(4,6)}-${data.expires_dt.slice(6,8)}T${data.expires_dt.slice(8,10)}:${data.expires_dt.slice(10,12)}:${data.expires_dt.slice(12,14)}+09:00`).getTime()
      : Date.now() + 86_400_000;

    _token = { value: data.token, expiresAt: exp };
    return _token.value;
  } catch { return null; }
}

async function kPost<T>(endpoint: string, apiId: string, body: Record<string, string>): Promise<T | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const res = await fetch(BASE + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "authorization": `Bearer ${token}`,
        "cont-yn":  "N",
        "next-key": "",
        "api-id":   apiId,
      },
      body: JSON.stringify(body),
      next: { revalidate: 60 }, // 1분 캐시
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { return_code: number } & T;
    if (data.return_code !== 0) return null;
    return data;
  } catch { return null; }
}

// ─── 공개 타입 ────────────────────────────────────────────────────

export interface KiwoomStockInfo {
  stk_cd:       string;  // 종목코드
  stk_nm:       string;  // 종목명
  cur_prc:      string;  // 현재가 ("+317000" 형식)
  pred_pre:     string;  // 전일대비
  flu_rt:       string;  // 등락률
  trde_qty:     string;  // 거래량
  mac:          string;  // 시가총액 (억원)
  "250hgst":    string;  // 52주 최고가
  "250lwst":    string;  // 52주 최저가
  "250hgst_pric_dt": string; // 52주 최고일
  "250lwst_pric_dt": string; // 52주 최저일
  per:          string;
  pbr:          string;
  roe:          string;
  eps:          string;
  bps:          string;
  for_exh_rt:   string;  // 외국인 보유율
  return_code:  number;
  return_msg:   string;
}

/** 숫자 문자열 파싱 ("+317000" → 317000, "-5000" → -5000) */
export function parseKiwoomNumber(s: string): number {
  return parseFloat(s.replace(/[^0-9.-]/g, "")) * (s.startsWith("-") ? -1 : 1);
}

// ─── 공개 함수 ────────────────────────────────────────────────────

/**
 * 주식기본정보 조회 (ka10001)
 * 현재가·등락률·거래량·52주·재무지표 모두 포함
 * API 키 없으면 null 반환 → 호출부에서 mock 사용
 */
export async function getStockInfo(ticker: string): Promise<KiwoomStockInfo | null> {
  return kPost<KiwoomStockInfo>("/api/dostk/stkinfo", "ka10001", { stk_cd: ticker });
}

/**
 * 여러 종목 일괄 조회 + 거래대금 기준 정렬
 * tickers: 6자리 종목코드 배열
 * API 키 없으면 빈 배열 반환
 */
export async function getStocksRankedByValue(tickers: string[]): Promise<KiwoomStockInfo[]> {
  const results = await Promise.all(tickers.map((t) => getStockInfo(t)));
  return results
    .filter((r): r is KiwoomStockInfo => r !== null)
    .sort((a, b) => {
      // 거래대금 ≈ 거래량 × 현재가
      const valA = parseKiwoomNumber(a.trde_qty) * parseKiwoomNumber(a.cur_prc);
      const valB = parseKiwoomNumber(b.trde_qty) * parseKiwoomNumber(b.cur_prc);
      return valB - valA;
    });
}
