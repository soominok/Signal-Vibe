/**
 * 키움증권 Open API REST 클라이언트
 * Base: https://api.kiwoom.com
 * 인증: POST /oauth2/token (JSON) → token
 * 요청: POST /api/dostk/{endpoint} + 헤더 { api-id, cont-yn, next-key }
 *
 * ── 확인된 TR 매핑 (엔드포인트: /api/dostk/rkinfo) ──────────────
 * ka10001 → /api/dostk/stkinfo   주식기본정보 (현재가·52w·재무)
 * ka10004 → /api/dostk/mrkcond   주식호가 (10단계)
 * ka10007 → /api/dostk/mrkcond   주식현재가
 * ka10023 → /api/dostk/rkinfo    거래량급증 (장중)
 * ka10032 → /api/dostk/rkinfo    거래대금상위 ★
 * ka10035 → /api/dostk/rkinfo    외인연속순매매상위 ★
 * ka10098 → /api/dostk/rkinfo    시간외단일가등락률순위 ★
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
    const dt  = data.expires_dt ?? "";
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

/** "+317000" → 317000  |  "-5000" → -5000 */
export function parseKiwoomNumber(s: string | undefined): number {
  if (!s || s === "0") return 0;
  const sign = s.startsWith("-") ? -1 : 1;
  return sign * parseFloat(s.replace(/[^0-9.]/g, ""));
}

/** "005930_AL" → "005930" */
export function cleanTicker(raw: string): string {
  return raw.split("_")[0];
}

/** 거래대금 백만원 → "1.2조" / "3,456억" 표기 */
export function formatTradingValue(millionWon: number): string {
  if (millionWon >= 1_000_000) return `${(millionWon / 1_000_000).toFixed(1)}조`;
  if (millionWon >= 10_000)    return `${Math.floor(millionWon / 10_000).toLocaleString("ko-KR")}억`;
  return `${millionWon.toLocaleString("ko-KR")}백만`;
}

// ─── 공개 타입 ────────────────────────────────────────────────────

export interface KiwoomStockInfo {
  stk_cd: string; stk_nm: string;
  cur_prc: string; pred_pre: string; flu_rt: string; trde_qty: string;
  mac: string; "250hgst": string; "250lwst": string;
  "250hgst_pric_dt": string; "250lwst_pric_dt": string;
  per: string; pbr: string; roe: string; eps: string; bps: string;
  for_exh_rt: string;
  return_code: number; return_msg: string;
}

/** ka10032 거래대금상위 항목 */
export interface KiwoomTradeValueItem {
  stk_cd: string; stk_nm: string;
  now_rank: string; pred_rank: string;
  cur_prc: string; pred_pre_sig: string; pred_pre: string; flu_rt: string;
  sel_bid: string; buy_bid: string;
  now_trde_qty: string; pred_trde_qty: string; trde_prica: string;
}

/** ka10035 외인연속순매매 항목 */
export interface KiwoomForeignContinuousItem {
  stk_cd: string; stk_nm: string;
  cur_prc: string; pred_pre_sig: string; pred_pre: string;
  dm1: string;  // 1일 순매수
  dm2: string;  // 2일 순매수
  dm3: string;  // 3일 순매수
  tot: string;  // 합계
  limit_exh_rt: string;  // 외인 한도 소진율
  pred_pre_1: string; pred_pre_2: string; pred_pre_3: string;
}

/** ka10098 시간외단일가등락률 항목 */
export interface KiwoomOvertimeItem {
  rank: string; stk_cd: string; stk_nm: string;
  cur_prc: string; pred_pre_sig: string; pred_pre: string; flu_rt: string;
  sel_tot_req: string; buy_tot_req: string;
  acc_trde_qty: string; acc_trde_prica: string;
  tdy_close_pric: string; tdy_close_pric_flu_rt: string;
}

/** ka10023 거래량급증 항목 */
export interface KiwoomVolumeSpike {
  stk_cd: string; stk_nm: string;
  cur_prc: string; pred_pre: string; flu_rt: string;
  now_trde_qty: string; prev_trde_qty: string; trde_incrs_rt: string;
}

// ─── 공개 함수 ────────────────────────────────────────────────────

/** 주식기본정보 (ka10001) */
export async function getStockInfo(ticker: string): Promise<KiwoomStockInfo | null> {
  return kPost<KiwoomStockInfo>("/api/dostk/stkinfo", "ka10001", { stk_cd: ticker });
}

/** 거래대금 상위 (ka10032) */
export async function getTradingValueRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  count = 30
): Promise<KiwoomTradeValueItem[]> {
  const res = await kPost<{ trde_prica_upper?: KiwoomTradeValueItem[] }>(
    "/api/dostk/rkinfo", "ka10032",
    { mrkt_tp, mang_stk_incls: "1", stex_tp: "3" }
  );
  return (res?.trde_prica_upper ?? []).slice(0, count);
}

/** 외인 연속 순매수 상위 (ka10035) — trde_tp: "1"=매수, "2"=매도 */
export async function getForeignContinuousRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  trde_tp: "1" | "2" = "1",
  count = 20
): Promise<KiwoomForeignContinuousItem[]> {
  const res = await kPost<{ for_cont_nettrde_upper?: KiwoomForeignContinuousItem[] }>(
    "/api/dostk/rkinfo", "ka10035",
    { mrkt_tp, stex_tp: "3", trde_tp, for_tp: "1", base_dt_tp: "1" }
  );
  return (res?.for_cont_nettrde_upper ?? []).slice(0, count);
}

/** 시간외단일가 등락률 순위 (ka10098) */
export async function getOvertimePriceRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  count = 20
): Promise<KiwoomOvertimeItem[]> {
  const all = {
    mrkt_tp, stex_tp: "3",
    mang_stk_incls: "1", stk_cnd: "0", crd_cnd: "0", trde_qty_cnd: "0",
    sort_tp: "1", sort_cnd: "1", sort_base: "1",
    trde_qty_tp: "1", trde_prica: "0", crd_tp: "0", trde_prica_tp: "1",
    flu_tp: "1", for_tp: "1", trde_tp: "1", updown_incls: "1",
    base_dt_tp: "1", tm_tp: "1", unit_tp: "1", pric_tp: "0",
    pric_cnd: "0", strt_dt: new Date().toISOString().slice(0,10).replace(/-/g,""),
  };
  const res = await kPost<{ ovt_sigpric_flu_rt_rank?: KiwoomOvertimeItem[] }>(
    "/api/dostk/rkinfo", "ka10098", all
  );
  return (res?.ovt_sigpric_flu_rt_rank ?? []).slice(0, count);
}

/** 거래량 급증 (ka10023) — 장중에만 데이터 반환 */
export async function getVolumeSpikeRank(
  mrkt_tp: "000" | "001" | "101" = "001",
  count = 10
): Promise<KiwoomVolumeSpike[]> {
  const all = {
    mrkt_tp, stex_tp: "3",
    mang_stk_incls: "1", stk_cnd: "0", crd_cnd: "0", trde_qty_cnd: "0",
    sort_tp: "1", sort_cnd: "1", sort_base: "1",
    trde_qty_tp: "1", trde_prica: "0", crd_tp: "0", trde_prica_tp: "1",
    flu_tp: "1", for_tp: "1", trde_tp: "1", updown_incls: "1",
    base_dt_tp: "1", tm_tp: "1", unit_tp: "1", pric_tp: "0",
    pric_cnd: "0", strt_dt: new Date().toISOString().slice(0,10).replace(/-/g,""),
  };
  const res = await kPost<{ trde_qty_sdnin?: KiwoomVolumeSpike[] }>(
    "/api/dostk/rkinfo", "ka10023", all
  );
  return (res?.trde_qty_sdnin ?? []).slice(0, count);
}
