/**
 * 최종 TR 테스트
 * GET /api/test-kiwoom?q=ka90009
 * GET /api/test-kiwoom?q=ka10027
 * GET /api/test-kiwoom?q=all_confirmed  — 확인된 TR 전체 요약
 */

const BASE       = "https://api.kiwoom.com";
const APP_KEY    = () => process.env.KIWOOM_APP_KEY    ?? "";
const APP_SECRET = () => process.env.KIWOOM_APP_SECRET ?? "";

async function getToken(): Promise<string | null> {
  const res = await fetch(`${BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: APP_KEY(), secretkey: APP_SECRET() }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return ((await res.json()) as { token?: string }).token ?? null;
}

async function kPost(token: string, apiId: string, body: Record<string, string>) {
  const res = await fetch(`${BASE}/api/dostk/rkinfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "authorization": `Bearer ${token}`,
      "cont-yn": "N", "next-key": "",
      "api-id": apiId,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json() as Record<string, unknown>;
  const arrayKeys = Object.keys(data).filter((k) => Array.isArray(data[k]));
  const first = arrayKeys.length > 0 ? (data[arrayKeys[0]] as Record<string,unknown>[])[0] : null;
  return {
    apiId,
    code: data.return_code, msg: data.return_msg,
    arrayKeys, count: arrayKeys.length > 0 ? (data[arrayKeys[0]] as unknown[]).length : 0,
    sampleKeys: first ? Object.keys(first) : [],
    sample: first,
  };
}

const base = { mrkt_tp: "001", stex_tp: "3", mang_stk_incls: "1", stk_cnd: "0", crd_cnd: "0", trde_qty_cnd: "0" };

export async function GET(req: Request) {
  const q     = new URL(req.url).searchParams.get("q") ?? "all_confirmed";
  const token = await getToken();
  if (!token) return Response.json({ error: "토큰 발급 실패" });

  if (q === "ka90009") {
    return Response.json(await kPost(token, "ka90009", { ...base, trde_tp: "1", sort_tp: "1" }));
  }

  if (q === "ka10027") {
    return Response.json(await kPost(token, "ka10027", { ...base, flu_tp: "1", sort_tp: "1", updown_incls: "1", pric_cnd: "0" }));
  }

  if (q === "all_confirmed") {
    const trs = [
      { id: "ka10032", body: { mrkt_tp: "001", mang_stk_incls: "1", stex_tp: "3" } },
      { id: "ka10035", body: { ...base, trde_tp: "1", for_tp: "1", base_dt_tp: "1" } },
      { id: "ka10023", body: { ...base, sort_tp: "1", tm_tp: "1", trde_qty_tp: "1", trde_tp: "1", unit_tp: "1", pric_tp: "0", sort_cnd: "1", sort_base: "1", updown_incls: "1", pric_cnd: "0", base_dt_tp: "1", trde_prica: "0", crd_tp: "0", trde_prica_tp: "1" } },
      { id: "ka10098", body: { ...base, sort_tp: "1", sort_cnd: "1", sort_base: "1", updown_incls: "1", pric_cnd: "0", base_dt_tp: "1", trde_prica: "0", crd_tp: "0", trde_prica_tp: "1", trde_tp: "1", unit_tp: "1", pric_tp: "0", for_tp: "1", flu_tp: "1", tm_tp: "1" } },
      { id: "ka90009", body: { ...base, trde_tp: "1", sort_tp: "1" } },
      { id: "ka10027", body: { ...base, flu_tp: "1", sort_tp: "1", updown_incls: "1", pric_cnd: "0" } },
    ];
    const results = await Promise.all(trs.map(({ id, body }) => kPost(token, id, body)));
    return Response.json(results.map((r) => ({
      id: r.apiId, code: r.code, ok: r.code === 0,
      msg: r.code !== 0 ? r.msg : "OK",
      keys: r.arrayKeys, count: r.count, sampleKeys: r.sampleKeys,
    })));
  }

  return Response.json({ token_ok: true });
}
