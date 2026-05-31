/**
 * 뉴스 API 클라이언트
 * 용도: 주식 관련 뉴스 수집
 * 설정: .env.local에 NEWS_API_KEY 추가
 * 발급: https://newsapi.org/ (무료 100 calls/day, 개발자 플랜)
 * 대안: 뉴스1·머니투데이 RSS 파싱 (별도 구현)
 */

const BASE_URL = "https://newsapi.org/v2";

function key(): string | null {
  return process.env.NEWS_API_KEY ?? null;
}

export interface NewsApiArticle {
  title: string;
  description: string | null;
  url: string;
  source: string;
  publishedAt: string;
}

/**
 * 키워드로 뉴스 검색 (한국 + 영어 혼합)
 * API 키 없으면 빈 배열 반환 → mock 데이터 사용.
 */
export async function searchNews(
  query: string,
  options: { pageSize?: number; language?: string } = {}
): Promise<NewsApiArticle[]> {
  const apiKey = key();
  if (!apiKey) return [];

  const params = new URLSearchParams({
    q: query,
    pageSize: String(options.pageSize ?? 10),
    language: options.language ?? "ko",
    sortBy: "publishedAt",
    apiKey,
  });

  const res = await fetch(`${BASE_URL}/everything?${params}`, {
    next: { revalidate: 600 }, // 10분 캐시 (비용 절감)
  });
  if (!res.ok) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { articles: any[] };
  return (data.articles ?? []).map((a) => ({
    title:       a.title as string,
    description: a.description as string | null,
    url:         a.url as string,
    source:      (a.source?.name ?? "Unknown") as string,
    publishedAt: a.publishedAt as string,
  }));
}

/**
 * 특정 섹터의 최신 뉴스 조회
 */
export async function getSectorNews(sectorName: string, count = 5): Promise<NewsApiArticle[]> {
  return searchNews(`${sectorName} 주식 OR 반도체 OR 코스피`, { pageSize: count });
}
