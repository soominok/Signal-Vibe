/**
 * 한국은행 ECOS API 클라이언트
 * 용도: 기준금리, GDP, CPI, 환율 등 거시경제 지표
 * 설정: .env.local에 ECOS_API_KEY 추가
 * 발급: https://ecos.bok.or.kr/ → 인증키 신청 (무료, 즉시 발급)
 */

const BASE_URL = "https://ecos.bok.or.kr/api";

function key(): string | null {
  return process.env.ECOS_API_KEY ?? null;
}

export interface EcosStatItem {
  statCode: string;
  statName: string;
  itemCode: string;
  itemName: string;
  dataValue: number;
  unit: string;
  time: string; // YYYYMM or YYYYMMDD
}

/**
 * ECOS 통계 조회 범용 함수
 * @param statCode - 통계 코드 (예: "722Y001" = 기준금리)
 * @param itemCode - 항목 코드
 * @param startTime - 시작 시점 (YYYYMM)
 * @param endTime   - 종료 시점 (YYYYMM)
 */
export async function getEcosStat(
  statCode: string,
  itemCode: string,
  startTime: string,
  endTime: string
): Promise<EcosStatItem[]> {
  const apiKey = key();
  if (!apiKey) return [];

  const url = `${BASE_URL}/StatisticSearch/${apiKey}/json/kr/1/100/${statCode}/MM/${startTime}/${endTime}/${itemCode}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // 1시간 캐시
  if (!res.ok) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { StatisticSearch?: { row: any[] } };
  const rows = data.StatisticSearch?.row ?? [];

  return rows.map((r) => ({
    statCode,
    statName:  r.STAT_NAME as string,
    itemCode:  r.ITEM_CODE1 as string,
    itemName:  r.ITEM_NAME1 as string,
    dataValue: Number(r.DATA_VALUE),
    unit:      r.UNIT_NAME as string,
    time:      r.TIME as string,
  }));
}

/**
 * 기준금리 최근 12개월 조회 (통계코드 722Y001)
 */
export async function getBaseRate(): Promise<EcosStatItem[]> {
  const now = new Date();
  const end = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const startDate = new Date(now);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const start = `${startDate.getFullYear()}${String(startDate.getMonth() + 1).padStart(2, "0")}`;
  return getEcosStat("722Y001", "0101000", start, end);
}
