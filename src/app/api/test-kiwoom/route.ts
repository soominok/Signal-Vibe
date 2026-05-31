/**
 * GET /api/test-kiwoom?q=stkinfo  — ka10001 실데이터 ✅
 * GET /api/test-kiwoom?q=curprc   — ka10007 현재가 ✅ (mrkcond 공유)
 * GET /api/test-kiwoom?q=findrank — 거래대금 순위 TR 탐색 (브루트포스)
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

async function kPost(token: string, endpoint: string, apiId: string, body: Record<string, string>) {
  const res = await fetch(BASE + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "authorization": `Bearer ${token}`,
      "cont-yn": "N", "next-key": "",
      "api-id": apiId,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  const text = await res.text();
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  const ok = typeof parsed === "object" && parsed !== null && (parsed as Record<string,unknown>)["return_code"] === 0;
  const msg = typeof parsed === "object" && parsed !== null ? (parsed as Record<string,unknown>)["return_msg"] : parsed;
  return { endpoint, apiId, ok, msg, full: ok ? parsed : undefined };
}

export async function GET(req: Request) {
  const q     = new URL(req.url).searchParams.get("q") ?? "stkinfo";
  const token = await getToken();
  if (!token) return Response.json({ error: "토큰 발급 실패" });

  if (q === "stkinfo") {
    // ✅ 확인된 TR — 주식기본정보 (현재가·등락률·거래량·재무지표 모두 포함)
    const res = await fetch(BASE + "/api/dostk/stkinfo", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8", "authorization": `Bearer ${token}`, "cont-yn": "N", "next-key": "", "api-id": "ka10001" },
      body: JSON.stringify({ stk_cd: "005930" }),
    });
    return Response.json(await res.json());
  }

  if (q === "findrank") {
    // 거래대금 순위 TR 탐색
    // 패턴: 알려진 rank 경로에 ka10030~ka10100, ka10110~ka10180 범위 시도
    const rankPaths = ["/api/dostk/volrank", "/api/dostk/trdrk", "/api/dostk/trdamt", "/api/dostk/trdvol", "/api/dostk/rank"];
    const trCodes   = ["ka10030","ka10031","ka10059","ka10060","ka10086","ka10090","ka10091","ka10092","ka10093","ka10094","ka10095","ka10100","ka10110","ka10111","ka10115","ka10130","ka10171","ka10172"];
    const rankBody  = { mrkt_tp: "0", stex_tp: "1" };

    // volrank 경로에 모든 TR 시도 (가장 그럴듯한 경로)
    const byPath = await Promise.all(
      trCodes.map((id) => kPost(token, "/api/dostk/volrank", id, rankBody))
    );
    const hits = byPath.filter((r) => r.ok);
    if (hits.length > 0) return Response.json({ found: true, hits });

    // 모든 경로 × 여러 TR 조합
    const allResults = await Promise.all(
      rankPaths.flatMap((ep) =>
        ["ka10059","ka10086","ka10095","ka10171"].map((id) => kPost(token, ep, id, rankBody))
      )
    );
    const allHits = allResults.filter((r) => r.ok);
    return Response.json({ found: allHits.length > 0, hits: allHits, misses: allResults.filter((r) => !r.ok).map((r) => `${r.endpoint}/${r.apiId}: ${r.msg}`) });
  }

  return Response.json({ token_ok: true });
}
