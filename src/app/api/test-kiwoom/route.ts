/**
 * 키움 API 엔드포인트 탐색 (개발용)
 * GET /api/test-kiwoom?q=auth   — 다양한 인증 방식 시도
 * GET /api/test-kiwoom?q=quote  — 현재가 조회
 * GET /api/test-kiwoom?q=rank   — 거래대금 순위
 */

const BASE       = "https://api.kiwoom.com";
const APP_KEY    = () => process.env.KIWOOM_APP_KEY    ?? "";
const APP_SECRET = () => process.env.KIWOOM_APP_SECRET ?? "";

async function getToken(): Promise<string | null> {
  const res = await fetch(`${BASE}/oauth2/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: APP_KEY(), secretkey: APP_SECRET() }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return ((await res.json()) as { token?: string }).token ?? null;
}

async function tryFetch(label: string, url: string, headers: Record<string, string>, body?: string) {
  try {
    const res = await fetch(url, {
      method:  body ? "POST" : "GET",
      headers,
      body,
      signal:  AbortSignal.timeout(5000),
    });
    const text = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { parsed = text.slice(0, 400); }
    return { label, status: res.status, body: parsed };
  } catch (e) {
    return { label, error: String(e) };
  }
}

export async function GET(req: Request) {
  const q     = new URL(req.url).searchParams.get("q") ?? "auth";
  const token = await getToken();
  if (!token) return Response.json({ error: "토큰 발급 실패" });

  if (q === "auth") {
    // 인증 방식 변형 실험 — 삼성전자 조회로 어떤 방식이 작동하는지 확인
    const path = "/uapi/domestic-stock/v1/quotations/inquire-price";
    const qs   = "?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930";
    const results = await Promise.all([
      // 1. Bearer + appkey/secretkey
      tryFetch("bearer+keys", BASE + path + qs, {
        Authorization: `Bearer ${token}`, appkey: APP_KEY(), secretkey: APP_SECRET(),
        tr_id: "FHKST01010100", custtype: "P", "Content-Type": "application/json",
      }),
      // 2. Bearer만 (appkey 없음)
      tryFetch("bearer-only", BASE + path + qs, {
        Authorization: `Bearer ${token}`, tr_id: "FHKST01010100", "Content-Type": "application/json",
      }),
      // 3. token 헤더 (Bearer 없음)
      tryFetch("token-header", BASE + path + qs, {
        token, appkey: APP_KEY(), secretkey: APP_SECRET(), tr_id: "FHKST01010100",
      }),
      // 4. access_token 헤더
      tryFetch("access_token-header", BASE + path + qs, {
        access_token: token, appkey: APP_KEY(), secretkey: APP_SECRET(),
      }),
      // 5. KIS 스타일 (appsecret, tr_id, custtype)
      tryFetch("kis-style", BASE + path + qs, {
        Authorization: `Bearer ${token}`, appkey: APP_KEY(), appsecret: APP_SECRET(),
        tr_id: "FHKST01010100", custtype: "P", "Content-Type": "application/json",
      }),
      // 6. Content-Type 없는 순수 GET
      tryFetch("no-content-type", BASE + path + qs, {
        Authorization: `Bearer ${token}`, appkey: APP_KEY(), secretkey: APP_SECRET(),
      }),
    ]);
    return Response.json({ token_ok: true, results });
  }

  if (q === "quote") {
    const baseH = {
      Authorization: `Bearer ${token}`, appkey: APP_KEY(), secretkey: APP_SECRET(),
      tr_id: "FHKST01010100", custtype: "P", "Content-Type": "application/json",
    };
    const results = await Promise.all([
      tryFetch("/uapi GET",   BASE + "/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930", baseH),
      tryFetch("/v1/price GET", BASE + "/v1/domestic-stock/price?stk_code=005930", baseH),
      tryFetch("/v2/price GET", BASE + "/v2/domestic-stock/price?stk_code=005930", baseH),
      tryFetch("/v1/stocks GET", BASE + "/v1/stocks?code=005930&market=KOSPI", baseH),
    ]);
    return Response.json({ token_ok: true, results });
  }

  if (q === "rank") {
    const baseH = {
      Authorization: `Bearer ${token}`, appkey: APP_KEY(), secretkey: APP_SECRET(),
      tr_id: "FHPST01710000", custtype: "P", "Content-Type": "application/json",
    };
    const results = await Promise.all([
      tryFetch("uapi GET",  BASE + "/uapi/domestic-stock/v1/ranking/volume?FID_COND_MRKT_DIV_CODE=J&FID_COND_SCR_DIV_CODE=20171&FID_INPUT_ISCD=0000&FID_DIV_CLS_CODE=0&FID_BLNG_CLS_CODE=0&FID_TRGT_CLS_CODE=111111111&FID_TRGT_EXLS_CLS_CODE=0000000000&FID_INPUT_PRICE_1=&FID_INPUT_PRICE_2=&FID_VOL_CNT=&FID_INPUT_DATE_1=", baseH),
      tryFetch("v1 GET",    BASE + "/v1/domestic-stock/ranking/trading-value?market=J", baseH),
    ]);
    return Response.json({ token_ok: true, results });
  }

  return Response.json({ token_ok: true, token_preview: token.slice(0, 20) + "..." });
}
