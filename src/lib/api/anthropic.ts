/**
 * Anthropic API 클라이언트
 * 용도: 뉴스 감성 분석, Insight 텍스트 생성
 * 설정: ANTHROPIC_API_KEY (서버 전용, NEXT_PUBLIC_ 붙이지 말 것)
 */

import Anthropic from "@anthropic-ai/sdk";
import { type Sentiment, type NewsArticle } from "@/lib/mock-data";

let _client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

export interface SentimentResult {
  sentiment: Sentiment;
  score: number;   // 0-100 (높을수록 긍정)
  reason: string;
}

/** 뉴스 기사 하나의 감성 분석. API 키 없으면 null. */
export async function analyzeNewsSentiment(
  title: string,
  summary: string
): Promise<SentimentResult | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `주식 뉴스의 시장 영향을 분석해 JSON으로만 답하세요.
제목: ${title}
요약: ${summary}
형식: {"sentiment":"positive"|"negative"|"neutral","score":0-100,"reason":"한 줄"}
score는 긍정 방향(50=중립, 높을수록 긍정).`,
        },
      ],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
    // JSON 블록 추출 (```json ... ``` 감싸진 경우 대비)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as SentimentResult;
  } catch {
    return null;
  }
}

/**
 * topNews 배열 전체를 감성 분석해 enriched 배열로 반환.
 * API 키 없거나 오류 시 원본 mock 값 그대로 유지.
 * 비용 절감을 위해 병렬 실행 후 캐싱 레이어에서 제어.
 */
export async function enrichNewsWithSentiment(
  articles: NewsArticle[]
): Promise<NewsArticle[]> {
  const client = getClient();
  if (!client) return articles; // 키 없으면 mock 데이터 그대로

  const results = await Promise.allSettled(
    articles.map((a) => analyzeNewsSentiment(a.title, a.summary))
  );

  return articles.map((article, i) => {
    const r = results[i];
    if (r.status === "fulfilled" && r.value) {
      return {
        ...article,
        sentiment:      r.value.sentiment,
        sentimentScore: r.value.score,
      };
    }
    return article; // 실패 시 원본 유지
  });
}

/**
 * 섹터 상승/하락 원인을 한 문단으로 요약합니다. (Insight 생성)
 * API 키 없으면 null.
 */
export async function generateSectorInsight(
  sectorName: string,
  changePercent: number,
  newsTitles: string[]
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `오늘 ${sectorName} 섹터가 ${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}% 변동했습니다.
관련 뉴스: ${newsTitles.join(" / ")}
투자자 관점에서 원인을 3문장 이내로 요약하세요. 한국어로.`,
        },
      ],
    });

    return msg.content[0].type === "text" ? msg.content[0].text : null;
  } catch {
    return null;
  }
}
