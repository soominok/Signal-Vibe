/**
 * 키움 API TR 코드 기반 탐색 (개발용)
 * 키움 REST API는 TR 코드(ka10001 등) 기반 구조
 * GET /api/test-kiwoom?q=tr   — TR 코드 방식 시도
 * GET /api/test-kiwoom?q=rank — 거래대금 순위 (ka10039)
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

const authHeaders = (token: string) => ({
  Authorization:  `Bearer ${token}`,
  appkey:         APP_KEY(),
  secretkey:      APP_SECRET(),
  "Content-Type": "application/json; charset=UTF-8",
});

async function tryPost(label: string, url: string, token: string, body: Record<string, unknown>, extraHeaders: Record<string, string> = {}) {
  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: { ...authHeaders(token), ...extraHeaders },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(6000),
    });
    const text = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { parsed = text.slice(0, 500); }
    return { label, status: res.status, body: parsed };
  } catch (e) {
    return { label, error: String(e) };
  }
}

export async function GET(req: Request) {
  const q     = new URL(req.url).searchParams.get("q") ?? "tr";
  const token = await getToken();
  if (!token) return Response.json({ error: "토큰 발급 실패" });

  if (q === "tr") {
    // ka10001: 기본정보조회 (주식기본정보) — 삼성전자
    const body = { stk_cd: "005930" };
    const results = await Promise.all([
      // 방식 1: /v1/{tr_code}
      tryPost("v1/ka10001", `${BASE}/v1/ka10001`, token, body),
      // 방식 2: /uapi/domestic-stock/v1/{tr_code}
      tryPost("uapi/ka10001", `${BASE}/uapi/domestic-stock/v1/ka10001`, token, body),
      // 방식 3: /api/v1/{tr_code}
      tryPost("api/v1/ka10001", `${BASE}/api/v1/ka10001`, token, body),
      // 방식 4: /v1/quotations/ka10001
      tryPost("v1/quotations/ka10001", `${BASE}/v1/quotations/ka10001`, token, body),
      // 방식 5: tr_id 헤더로 전달
      tryPost("tr_id-header", `${BASE}/v1/quotations`, token, body, { tr_id: "ka10001" }),
      // 방식 6: tr_code 헤더로 전달
      tryPost("tr_code-header", `${BASE}/v1/domestic-stock`, token, body, { tr_code: "ka10001" }),
    ]);
    return Response.json({ token_ok: true, results });
  }

  if (q === "rank") {
    // ka10039: 증권사별매매상위요청 or 거래대금 순위
    const body = { mrkt_tp: "0", trde_tp: "2", sort_tp: "1" };
    const results = await Promise.all([
      tryPost("v1/ka10039", `${BASE}/v1/ka10039`, token, body),
      tryPost("uapi/ka10039", `${BASE}/uapi/domestic-stock/v1/ka10039`, token, body),
      // ka10095: 거래대금 상위 (다른 가능한 TR 코드)
      tryPost("v1/ka10095", `${BASE}/v1/ka10095`, token, { mrkt_tp: "0" }),
    ]);
    return Response.json({ token_ok: true, results });
  }

  return Response.json({ token_ok: true, token_preview: token.slice(0, 20) + "..." });
}
