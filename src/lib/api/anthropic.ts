/**
 * Anthropic API 클라이언트
 * 용도: 뉴스 감성 분석, Insight 텍스트 생성
 * 설정: .env.local에 ANTHROPIC_API_KEY=sk-ant-... 추가
 * 발급: https://console.anthropic.com/
 */

import Anthropic from "@anthropic-ai/sdk";
import { type Sentiment } from "@/lib/mock-data";

let _client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

export interface SentimentResult {
  sentiment: Sentiment;
  score: number;       // 0-100
  reason: string;      // 한 줄 이유
}

/**
 * 뉴스 기사 제목+요약을 분석해 감성 점수를 반환합니다.
 * API 키가 없으면 null 반환 → 호출부에서 mock 값 사용.
 */
export async function analyzeNewsSentiment(
  title: string,
  summary: string
): Promise<SentimentResult | null> {
  const client = getClient();
  if (!client) return null;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `다음 주식 뉴스의 시장 영향을 분석해주세요.
제목: ${title}
요약: ${summary}

JSON 형식으로만 답하세요:
{"sentiment":"positive"|"negative"|"neutral","score":0-100,"reason":"한 줄 이유"}
score는 긍정 방향(높을수록 긍정, 50=중립)입니다.`,
      },
    ],
  });

  try {
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(text) as SentimentResult;
    return result;
  } catch {
    return null;
  }
}

/**
 * 섹터 상승/하락 원인을 한 문단으로 요약합니다.
 * API 키가 없으면 null 반환.
 */
export async function generateSectorInsight(
  sectorName: string,
  changePercent: number,
  newsTitles: string[]
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `오늘 ${sectorName} 섹터가 ${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}% 변동했습니다.
관련 뉴스: ${newsTitles.join(" / ")}
투자자 관점에서 원인을 3문장 이내로 요약해주세요. 한국어로 작성하세요.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : null;
}
