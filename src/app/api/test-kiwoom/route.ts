/**
 * 키움 API 테스트 — 확인된 엔드포인트
 * GET /api/test-kiwoom?q=rank32  — ka10032 거래대금상위 (rkinfo)
 * GET /api/test-kiwoom?q=rank27  — ka10027 등락률상위
 * GET /api/test-kiwoom?q=rank23  — ka10023 거래량급증
 * GET /api/test-kiwoom?q=rank35  — ka10035 외인연속순매매상위
 * GET /api/test-kiwoom?q=stkinfo — ka10001 주식기본정보 (확인됨)
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
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json();
  return { apiId, status: res.status, data };
}

export async function GET(req: Request) {
  const q     = new URL(req.url).searchParams.get("q") ?? "rank32";
  const token = await getToken();
  if (!token) return Response.json({ error: "토큰 발급 실패" });

  // 거래대금상위 (ka10032) — 문서 확인된 엔드포인트
  if (q === "rank32") {
    return Response.json(await kPost(token, "/api/dostk/rkinfo", "ka10032", {
      mrkt_tp: "001",       // 001=코스피, 101=코스닥, 000=전체
      mang_stk_incls: "1", // 1=관리종목 포함
      stex_tp: "3",         // 3=통합(KRX+NXT)
    }));
  }

  // 등락률상위 (ka10027)
  if (q === "rank27") {
    return Response.json(await kPost(token, "/api/dostk/rkinfo", "ka10027", {
      mrkt_tp: "001",
      stex_tp: "3",
      flu_tp: "1",          // 1=상위
    }));
  }

  // 거래량급증 (ka10023)
  if (q === "rank23") {
    return Response.json(await kPost(token, "/api/dostk/rkinfo", "ka10023", {
      mrkt_tp: "001",
      stex_tp: "3",
    }));
  }

  // 외인연속순매매상위 (ka10035)
  if (q === "rank35") {
    return Response.json(await kPost(token, "/api/dostk/rkinfo", "ka10035", {
      mrkt_tp: "001",
      for_tp: "1",          // 1=연속매수
      stex_tp: "3",
    }));
  }

  // 외국인기관매매상위 (ka90009)
  if (q === "rank90009") {
    return Response.json(await kPost(token, "/api/dostk/rkinfo", "ka90009", {
      mrkt_tp: "001",
      stex_tp: "3",
    }));
  }

  // stkinfo 확인
  if (q === "stkinfo") {
    return Response.json(await kPost(token, "/api/dostk/stkinfo", "ka10001", { stk_cd: "005930" }));
  }

  return Response.json({ token_ok: true });
}
