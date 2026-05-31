/**
 * 키움증권 Open API REST 클라이언트
 * Base URL: https://api.kiwoom.com
 * 인증: POST /oauth2/token (JSON body) → token
 * 요청: POST + 헤더 { api-id, cont-yn, next-key }
 *
 * 확인된 TR 매핑:
 *   ka10001 → /api/dostk/stkinfo   주식기본정보 (현재가·등락률·거래량·52w·재무)
 *   ka10004 → /api/dostk/mrkcond   주식호가 (매수/매도 10단계)
 *   ka10007 → /api/dostk/mrkcond   주식현재가
 *   ka10023 → /api/dostk/rkinfo    거래량급증요청
 *   ka10027 → /api/dostk/rkinfo    전일대비등락률상위
 *   ka10030 → /api/dostk/rkinfo    당일거래량상위
 *   ka10032 → /api/dostk/rkinfo    거래대금상위 ★
 *   ka10035 → /api/dostk/rkinfo    외인연속순매매상위
 *   ka10062 → /api/dostk/rkinfo    장중투자자별매매상위
 *   ka10098 → /api/dostk/rkinfo    외국인기관매매상위
 */

const BASE       = "https://api.kiwoom.com";
const APP_KEY    = () => process.env.KIWOOM_APP_KEY    ?? "";
const APP_SECRET = () => process.env.KIWOOM_APP_SECRET ?? "";

// ─── 토큰 캐시 ────────────────────────────────────────────────────

interface CachedToken { value: string; expiresAt: number }
let _token: CachedToken | null = null;

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
    const dt = data.expires_dt ?? "";
    const exp = dt.length === 14
      ? new Date(`${dt.slice(0,4)}-${dt.slice(4,6)}-${dt.slice(6,8)}T${dt.slice(8,10)}:${dt.slice(10,12)}:${dt.slice(12,14)}+09:00`).getTime()
      : Date.now() + 86_400_000;
    _token = { value: data.token, expiresAt: exp };
    return _token.value;
  } catch { return null; }
}

async function kPost<T>(
  endpoint: string,
  apiId: string,
  body: Record<string, string>,
  revalidate = 60
): Promise<T | null> {
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
      next: { revalidate },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { return_code: number } & T;
    return data.return_code === 0 ? data : null;
  } catch { return null; }
}

// ─── 헬퍼 ────────────────────────────────────────────────────────

/** "+317000" → 317000, "-5000" → -5000 */
export function parseKiwoomNumber(s: string | undefined): number {
  if (!s) return 0;
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return s.startsWith("-") ? -n : n;
}

/** "005930_AL" → "005930" */
export function cleanTicker(raw: string): string {
  return raw.split("_")[0];
}

// ─── 공개 타입 ────────────────────────────────────────────────────

export interface KiwoomStockInfo {
  stk_cd: string; stk_nm: string;
  cur_prc: string; pred_pre: string; flu_rt: string;
  trde_qty: string; mac: string;
  "250hgst": string; "250lwst": string;
  "250hgst_pric_dt": string; "250lwst_pric_dt": string;
  per: string; pbr: string; roe: string; eps: string; bps: string;
  for_exh_rt: string;
  return_code: number; return_msg: string;
}

export interface KiwoomRankItem {
  stk_cd:       string; // 종목코드 (suffix 포함)
  stk_nm:       string; // 종목명
  now_rank:     string; // 현재 순위
  pred_rank:    string; // 전일 순위
  cur_prc:      string; // 현재가
  pred_pre:     string; // 전일대비
  flu_rt:       string; // 등락률
  now_trde_qty: string; // 현재 거래량
  pred_trde_qty:string; // 전일 거래량
  trde_prica:   string; // 거래대금 (백만원)
  sel_bid:      string; // 매도1호가
  buy_bid:      string; // 매수1호가
}

interface RkInfoResponse {
  trde_prica_upper?: KiwoomRankItem[];
  [key: string]: unknown;
}

// ─── 공개 함수 ────────────────────────────────────────────────────

/** 주식기본정보 (ka10001) — 개별 종목 */
export async function getStockInfo(ticker: string): Promise<KiwoomStockInfo | null> {
  return kPost<KiwoomStockInfo>("/api/dostk/stkinfo", "ka10001", { stk_cd: ticker });
}

/**
 * 거래대금 상위 (ka10032)
 * mrkt_tp: "000"전체, "001"코스피, "101"코스닥
 */
export async function getTradingValueRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  count = 30
): Promise<KiwoomRankItem[]> {
  const res = await kPost<RkInfoResponse>("/api/dostk/rkinfo", "ka10032", {
    mrkt_tp,
    mang_stk_incls: "1",
    stex_tp: "3",
  });
  return (res?.trde_prica_upper ?? []).slice(0, count);
}

/**
 * 등락률 상위 (ka10027)
 * flu_tp: "1"상승, "2"하락
 */
export async function getChangeRateRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  flu_tp: "1" | "2" = "1",
  count = 20
): Promise<KiwoomRankItem[]> {
  const res = await kPost<RkInfoResponse>("/api/dostk/rkinfo", "ka10027", {
    mrkt_tp, flu_tp, stex_tp: "3",
  });
  const key = Object.keys(res ?? {}).find((k) => Array.isArray((res as Record<string,unknown>)[k]));
  return key ? ((res as Record<string,unknown>)[key] as KiwoomRankItem[]).slice(0, count) : [];
}

/**
 * 거래량 급증 (ka10023)
 */
export async function getVolumeSpike(
  mrkt_tp: "000" | "001" | "101" = "001",
  count = 20
): Promise<KiwoomRankItem[]> {
  const res = await kPost<RkInfoResponse>("/api/dostk/rkinfo", "ka10023", {
    mrkt_tp, stex_tp: "3",
  });
  const key = Object.keys(res ?? {}).find((k) => Array.isArray((res as Record<string,unknown>)[k]));
  return key ? ((res as Record<string,unknown>)[key] as KiwoomRankItem[]).slice(0, count) : [];
}

/**
 * 외인연속순매매상위 (ka10035)
 * for_tp: "1"매수, "2"매도
 */
export async function getForeignContinuousRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  for_tp: "1" | "2" = "1",
  count = 10
): Promise<KiwoomRankItem[]> {
  const res = await kPost<RkInfoResponse>("/api/dostk/rkinfo", "ka10035", {
    mrkt_tp, for_tp, stex_tp: "3",
  });
  const key = Object.keys(res ?? {}).find((k) => Array.isArray((res as Record<string,unknown>)[k]));
  return key ? ((res as Record<string,unknown>)[key] as KiwoomRankItem[]).slice(0, count) : [];
}
