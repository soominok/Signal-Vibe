/**
 * 한국은행 ECOS API 클라이언트
 * 용도: 기준금리, CPI, 원달러 환율, M2 등 거시경제 지표
 * 설정: ECOS_API_KEY (서버 전용)
 * 발급: https://ecos.bok.or.kr/ → 인증키 신청 (무료, 즉시)
 * 캐시: revalidate 3600 (1시간) — 거시지표는 자주 바뀌지 않음
 */

const BASE_URL = "https://ecos.bok.or.kr/api";

function key(): string | null {
  return process.env.ECOS_API_KEY ?? null;
}

export interface EcosItem {
  time: string;       // YYYYMM
  value: number;
  unit: string;
}

async function fetchStat(
  statCode: string,
  itemCode: string,
  periodDiv: "MM" | "QQ" | "YY",
  startTime: string,
  endTime: string
): Promise<EcosItem[]> {
  const apiKey = key();
  if (!apiKey) return [];

  const url = `${BASE_URL}/StatisticSearch/${apiKey}/json/kr/1/100/${statCode}/${periodDiv}/${startTime}/${endTime}/${itemCode}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      StatisticSearch?: { row: Record<string, string>[] };
    };
    return (data.StatisticSearch?.row ?? []).map((r) => ({
      time:  r.TIME,
      value: Number(r.DATA_VALUE),
      unit:  r.UNIT_NAME,
    }));
  } catch {
    return [];
  }
}

function monthRange(monthsBack: number): { start: string; end: string } {
  const now = new Date();
  const end = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const d = new Date(now);
  d.setMonth(d.getMonth() - monthsBack);
  const start = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  return { start, end };
}

// ─── 공개 함수 ────────────────────────────────────────────────────

/** 기준금리 (통계코드 722Y001, 항목 0101000) — 최근 13개월 */
export async function getBaseRate(): Promise<EcosItem[]> {
  const { start, end } = monthRange(12);
  return fetchStat("722Y001", "0101000", "MM", start, end);
}

/** 소비자물가지수 CPI (통계코드 901Y009, 항목 0) — 최근 13개월 */
export async function getCpi(): Promise<EcosItem[]> {
  const { start, end } = monthRange(12);
  return fetchStat("901Y009", "0", "MM", start, end);
}

/** 원달러 환율 (통계코드 731Y004, 항목 0000003) — 최근 13개월 */
export async function getUsdKrwRate(): Promise<EcosItem[]> {
  const { start, end } = monthRange(12);
  return fetchStat("731Y004", "0000003", "MM", start, end);
}

export interface MacroSnapshot {
  baseRate:    { value: number; unit: string; time: string } | null;
  cpi:         { value: number; unit: string; time: string } | null;
  usdKrw:      { value: number; unit: string; time: string } | null;
}

/** 최신 거시지표 한 줄씩 반환 */
export async function getMacroSnapshot(): Promise<MacroSnapshot> {
  const [baseRates, cpis, usdKrws] = await Promise.all([
    getBaseRate(),
    getCpi(),
    getUsdKrwRate(),
  ]);

  const last = <T extends EcosItem>(arr: T[]) =>
    arr.length > 0 ? arr[arr.length - 1] : null;

  return {
    baseRate: last(baseRates),
    cpi:      last(cpis),
    usdKrw:   last(usdKrws),
  };
}
