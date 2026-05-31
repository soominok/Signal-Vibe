export type MoneyFlowLevel = "strong-in" | "in" | "neutral" | "out" | "strong-out";
export type Market = "domestic" | "global";

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  market: Market;
}

export interface SectorKeyword {
  keyword: string;
  count: number;
}

export type Sentiment = "positive" | "negative" | "neutral";

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  keywords: string[];
  sentiment?: Sentiment;
  sentimentScore?: number; // 0-100 (높을수록 긍정)
}

export interface ValueChainStage {
  stage: string;
  companies: string[];
}

export interface HotSector {
  id: string;
  name: string;
  changePercent: number;
  moneyFlow: MoneyFlowLevel;
  topTickers: string[];
  summary: string;
  keywords: SectorKeyword[];
  valueChain: ValueChainStage[];
  relatedNews: NewsArticle[];
}

export const marketIndices: MarketIndex[] = [
  { id: "kospi",       name: "KOSPI",        value: 2650.23,  change: 21.54,   changePercent: 0.82,  market: "domestic" },
  { id: "kosdaq",      name: "KOSDAQ",       value: 852.41,   change: -2.67,   changePercent: -0.31, market: "domestic" },
  { id: "usdkrw",     name: "원/달러",       value: 1382.5,   change: -3.5,    changePercent: -0.25, market: "domestic" },
  { id: "dow",         name: "DOW",          value: 42580.12, change: 312.45,  changePercent: 0.74,  market: "global"   },
  { id: "nasdaq",      name: "NASDAQ",       value: 19843.67, change: 158.23,  changePercent: 0.80,  market: "global"   },
  { id: "sp500",       name: "S&P 500",      value: 5891.43,  change: 42.17,   changePercent: 0.72,  market: "global"   },
  { id: "russell2000", name: "RUSSELL 2000", value: 2187.34,  change: -8.91,   changePercent: -0.41, market: "global"   },
];

export const hotSectors: HotSector[] = [
  {
    id: "semiconductor",
    name: "반도체",
    changePercent: 3.21,
    moneyFlow: "strong-in",
    topTickers: ["삼성전자", "SK하이닉스", "한미반도체"],
    summary: "AI 서버 수요 급증으로 HBM 공급 부족 우려, 외국인 대규모 순매수",
    keywords: [
      { keyword: "HBM",        count: 47 },
      { keyword: "AI 서버",    count: 38 },
      { keyword: "엔비디아",   count: 29 },
      { keyword: "외국인 순매수", count: 21 },
      { keyword: "TSMC",       count: 18 },
    ],
    valueChain: [
      { stage: "소재",    companies: ["SK머티리얼즈", "솔브레인"] },
      { stage: "장비",    companies: ["원익IPS", "피에스케이", "한미반도체"] },
      { stage: "파운드리", companies: ["삼성전자", "DB하이텍"] },
      { stage: "메모리",  companies: ["삼성전자", "SK하이닉스"] },
      { stage: "패키징",  companies: ["한미반도체", "ISC", "두산테스나"] },
    ],
    relatedNews: [
      {
        id: "semi-1",
        title: "SK하이닉스, HBM4 양산 일정 앞당겨…엔비디아 공급 확대",
        source: "한국경제",
        publishedAt: "2026-05-31 09:12",
        summary: "SK하이닉스가 차세대 HBM4 메모리 양산 일정을 6개월 앞당기며 엔비디아向 공급 물량을 확대할 계획이라고 밝혔다.",
        keywords: ["HBM", "엔비디아", "AI 서버"],
      },
      {
        id: "semi-2",
        title: "삼성전자, 파운드리 2나노 수율 70% 돌파…TSMC 추격 가속",
        source: "전자신문",
        publishedAt: "2026-05-31 08:45",
        summary: "삼성전자 파운드리 사업부가 2nm 공정 수율을 70% 이상 확보했다고 업계가 전했다. TSMC와의 격차를 좁히고 있다는 평가다.",
        keywords: ["TSMC"],
      },
      {
        id: "semi-3",
        title: "외국인, 반도체株 3,200억 순매수…코스피 상승 견인",
        source: "머니투데이",
        publishedAt: "2026-05-31 10:01",
        summary: "외국인 투자자들이 삼성전자·SK하이닉스 중심으로 반도체 업종에서 3,200억 원을 순매수하며 코스피 지수를 끌어올렸다.",
        keywords: ["외국인 순매수", "AI 서버"],
      },
    ],
  },
  {
    id: "ai-sw",
    name: "AI/소프트웨어",
    changePercent: 2.15,
    moneyFlow: "in",
    topTickers: ["NAVER", "카카오", "더존비즈온"],
    summary: "국내 LLM 도입 확산, 엔터프라이즈 AI 전환 수요 증가",
    keywords: [
      { keyword: "AI 도입",  count: 33 },
      { keyword: "LLM",      count: 28 },
      { keyword: "B2B SaaS", count: 19 },
      { keyword: "클라우드", count: 15 },
    ],
    valueChain: [
      { stage: "인프라",   companies: ["KT클라우드", "네이버클라우드"] },
      { stage: "플랫폼",   companies: ["NAVER", "카카오"] },
      { stage: "솔루션",   companies: ["더존비즈온", "영림원소프트랩"] },
      { stage: "서비스",   companies: ["뤼튼", "솔트룩스"] },
    ],
    relatedNews: [
      {
        id: "ai-1",
        title: "NAVER, 기업용 AI '클로바X 엔터프라이즈' 출시",
        source: "ZDNet Korea",
        publishedAt: "2026-05-31 09:30",
        summary: "네이버가 국내 기업을 대상으로 한 AI 어시스턴트 '클로바X 엔터프라이즈'를 공식 출시하고 업무 자동화 기능을 강조했다.",
        keywords: ["AI 도입", "LLM", "B2B SaaS"],
      },
      {
        id: "ai-2",
        title: "더존비즈온, ERP에 AI 접목…중소기업 재무 자동화 솔루션 출시",
        source: "디지털타임스",
        publishedAt: "2026-05-31 08:20",
        summary: "더존비즈온이 자사 ERP 플랫폼에 AI를 결합해 중소기업 재무·회계 자동화 솔루션을 선보였다.",
        keywords: ["AI 도입", "B2B SaaS"],
      },
    ],
  },
  {
    id: "defense",
    name: "방산",
    changePercent: 1.87,
    moneyFlow: "in",
    topTickers: ["한화에어로스페이스", "LIG넥스원", "현대로템"],
    summary: "유럽·중동 수출 계약 기대감, 국방 예산 증가 수혜",
    keywords: [
      { keyword: "K-방산 수출", count: 41 },
      { keyword: "NATO",       count: 24 },
      { keyword: "국방 예산",  count: 20 },
      { keyword: "폴란드 계약", count: 16 },
    ],
    valueChain: [
      { stage: "소재·부품",     companies: ["풍산", "한화"] },
      { stage: "체계종합",      companies: ["한화에어로스페이스", "현대로템", "LIG넥스원"] },
      { stage: "MRO",          companies: ["한국항공우주", "대한항공"] },
      { stage: "수출 에이전시", companies: ["현대무벡스", "퍼스텍"] },
    ],
    relatedNews: [
      {
        id: "def-1",
        title: "한화에어로, 폴란드 K-9 자주포 2차 계약 임박…2.3조 규모",
        source: "조선비즈",
        publishedAt: "2026-05-31 09:55",
        summary: "한화에어로스페이스가 폴란드 정부와 K-9 자주포 추가 도입 2차 계약 협상을 마무리 단계에 접어들었다고 업계 소식통이 전했다.",
        keywords: ["K-방산 수출", "폴란드 계약"],
      },
    ],
  },
  {
    id: "bio",
    name: "바이오/제약",
    changePercent: 0.64,
    moneyFlow: "neutral",
    topTickers: ["셀트리온", "삼성바이오로직스", "유한양행"],
    summary: "글로벌 임상 결과 대기, 위탁생산(CMO) 수주 지속",
    keywords: [
      { keyword: "CMO 수주",    count: 22 },
      { keyword: "임상 3상",    count: 18 },
      { keyword: "FDA 허가",    count: 14 },
      { keyword: "바이오시밀러", count: 11 },
    ],
    valueChain: [
      { stage: "원료의약품", companies: ["에스티팜", "한미약품"] },
      { stage: "CMO/CDMO",  companies: ["삼성바이오로직스", "롯데바이오로직스"] },
      { stage: "바이오시밀러", companies: ["셀트리온", "동아에스티"] },
      { stage: "신약개발",   companies: ["유한양행", "종근당", "보령"] },
    ],
    relatedNews: [
      {
        id: "bio-1",
        title: "삼성바이오로직스, 글로벌 빅파마와 역대 최대 CMO 계약 체결",
        source: "바이오스펙테이터",
        publishedAt: "2026-05-31 08:10",
        summary: "삼성바이오로직스가 글로벌 빅파마와 5년 장기 CMO 계약을 체결했다고 공시했다. 계약 규모는 약 1.8조 원으로 역대 최대 수준이다.",
        keywords: ["CMO 수주"],
      },
    ],
  },
  {
    id: "secondary-battery",
    name: "2차전지",
    changePercent: -0.53,
    moneyFlow: "out",
    topTickers: ["LG에너지솔루션", "POSCO홀딩스", "에코프로비엠"],
    summary: "전기차 수요 둔화 우려, 미국 IRA 세액공제 불확실성 지속",
    keywords: [
      { keyword: "IRA 세액공제", count: 35 },
      { keyword: "전기차 수요",  count: 29 },
      { keyword: "리튬 가격",    count: 18 },
      { keyword: "배터리 재활용", count: 12 },
    ],
    valueChain: [
      { stage: "광물",    companies: ["POSCO홀딩스", "포스코인터내셔널"] },
      { stage: "양극재",  companies: ["에코프로비엠", "엘앤에프", "포스코퓨처엠"] },
      { stage: "음극재",  companies: ["포스코케미칼", "대주전자재료"] },
      { stage: "셀",      companies: ["LG에너지솔루션", "삼성SDI", "SK온"] },
      { stage: "팩·시스템", companies: ["현대모비스", "LG마그나"] },
    ],
    relatedNews: [
      {
        id: "bat-1",
        title: "美 IRA 세액공제 축소 논의 재점화…국내 배터리株 동반 하락",
        source: "한국경제",
        publishedAt: "2026-05-31 09:20",
        summary: "미국 의회에서 IRA 전기차 세액공제 축소 개정안 논의가 불거지면서 국내 배터리 관련주가 일제히 하락했다.",
        keywords: ["IRA 세액공제", "전기차 수요"],
      },
    ],
  },
  {
    id: "construction",
    name: "건설",
    changePercent: -1.24,
    moneyFlow: "strong-out",
    topTickers: ["현대건설", "GS건설", "대우건설"],
    summary: "PF 리스크 우려 재부각, 금리 인하 지연으로 수익성 압박",
    keywords: [
      { keyword: "PF 리스크", count: 44 },
      { keyword: "금리 동결", count: 31 },
      { keyword: "미분양",   count: 26 },
      { keyword: "해외 수주", count: 14 },
    ],
    valueChain: [
      { stage: "시행·분양", companies: ["HDC현대산업개발", "GS건설"] },
      { stage: "시공",      companies: ["현대건설", "대우건설", "DL이앤씨"] },
      { stage: "자재·설비", companies: ["한샘", "KCC글라스", "LX하우시스"] },
      { stage: "금융·PF",   companies: ["메리츠금융", "한국토지신탁"] },
    ],
    relatedNews: [
      {
        id: "con-1",
        title: "한은, 5월 금리 동결 결정…건설·부동산株 약세",
        source: "매일경제",
        publishedAt: "2026-05-31 10:30",
        summary: "한국은행이 5월 금융통화위원회에서 기준금리를 3.25%로 동결했다. 금리 인하 기대가 후퇴하면서 건설·부동산 관련주가 하락 압력을 받고 있다.",
        keywords: ["금리 동결", "PF 리스크"],
      },
    ],
  },
];

export const topNews: NewsArticle[] = [
  {
    id: "top-1",
    title: "연준, 6월 금리 동결 시사…'인플레 목표 달성까지 시간 더 필요'",
    source: "블룸버그 / 연합뉴스",
    publishedAt: "2026-05-31 07:00",
    summary: "제롬 파월 연준 의장이 연내 금리 인하 신중론을 재확인하면서 글로벌 증시에 영향을 미치고 있다.",
    keywords: ["연준", "금리"],
    sentiment: "negative", sentimentScore: 32,
  },
  {
    id: "top-2",
    title: "외국인, 코스피서 5거래일 연속 순매수…반도체·방산 집중",
    source: "한국거래소 / 머니투데이",
    publishedAt: "2026-05-31 09:05",
    summary: "외국인 투자자가 코스피에서 5거래일 연속 순매수를 기록했다. 반도체와 방산 업종이 주요 매수 대상이다.",
    keywords: ["외국인 순매수", "반도체", "방산"],
    sentiment: "positive", sentimentScore: 81,
  },
  {
    id: "top-3",
    title: "엔비디아 블랙웰 공급 차질 해소…HBM 수요 재확인",
    source: "Reuters / 전자신문",
    publishedAt: "2026-05-31 06:30",
    summary: "엔비디아 블랙웰 GPU의 공급 차질이 해소되면서 국내 HBM 공급사들의 수혜 기대감이 다시 높아지고 있다.",
    keywords: ["엔비디아", "HBM", "AI 서버"],
    sentiment: "positive", sentimentScore: 76,
  },
  {
    id: "top-4",
    title: "원·달러 환율, 1,380원 초반 안정…무역수지 흑자 영향",
    source: "서울외국환중개 / 연합인포맥스",
    publishedAt: "2026-05-31 10:15",
    summary: "원·달러 환율이 1,382원대에서 안정세를 보이고 있다. 수출 호조에 따른 무역수지 흑자가 원화 강세를 지지하고 있다.",
    keywords: ["환율", "무역수지"],
    sentiment: "neutral", sentimentScore: 53,
  },
];

// ─── 52주 신고가 / 신저가 ─────────────────────────────────────────

export interface FiftyTwoWeekStock {
  name: string;
  ticker: string;
  price: number;
  changePercent: number;
  high52w: number;
  low52w: number;
}

export const newHighStocks: FiftyTwoWeekStock[] = [
  { name: "한화에어로스페이스", ticker: "012450", price: 524000, changePercent:  2.88, high52w: 524000, low52w: 280000 },
  { name: "한미반도체",         ticker: "042700", price: 138500, changePercent:  2.44, high52w: 138500, low52w:  68000 },
  { name: "LIG넥스원",          ticker: "079550", price: 218500, changePercent:  2.10, high52w: 218500, low52w: 118000 },
  { name: "삼성바이오로직스",   ticker: "207940", price: 912000, changePercent:  0.55, high52w: 912000, low52w: 680000 },
  { name: "현대로템",           ticker: "064350", price:  82100, changePercent:  1.65, high52w:  82100, low52w:  38500 },
];

export const newLowStocks: FiftyTwoWeekStock[] = [
  { name: "GS건설",        ticker: "006360", price: 17850, changePercent: -1.66, high52w: 39800, low52w: 17850 },
  { name: "에코프로비엠",  ticker: "247540", price: 94200, changePercent: -0.85, high52w: 215000, low52w: 94200 },
  { name: "POSCO홀딩스",   ticker: "005490", price: 298500, changePercent: -0.50, high52w: 520000, low52w: 298500 },
  { name: "대우건설",      ticker: "047040", price:  4285, changePercent: -1.15, high52w:   8950, low52w:  4285 },
  { name: "카카오",        ticker: "035720", price: 41350, changePercent:  1.22, high52w:  72800, low52w: 38200 },
];

// ─── 기업 상세 ────────────────────────────────────────────────────

export interface CompanyDetail {
  ticker: string;
  price: number;
  changePercent: number;
  weekChangePercent: number;
  description: string;
}

export const companyDetails: Record<string, CompanyDetail> = {
  "삼성전자":        { ticker: "005930", price: 87400,  changePercent:  3.21, weekChangePercent:  5.12, description: "글로벌 1위 메모리(DRAM·NAND·HBM) 및 파운드리 2위. 스마트폰·가전 수직 계열화." },
  "SK하이닉스":      { ticker: "000660", price: 241000, changePercent:  4.15, weekChangePercent:  7.83, description: "HBM 세계 1위 공급사. 엔비디아 AI GPU에 HBM3E를 독점 납품 중." },
  "한미반도체":      { ticker: "042700", price: 138500, changePercent:  2.44, weekChangePercent:  6.10, description: "HBM 후공정(TC 본더) 장비 글로벌 1위. SK하이닉스의 핵심 파트너." },
  "SK머티리얼즈":    { ticker: "036490", price: 198000, changePercent:  1.82, weekChangePercent:  3.44, description: "반도체 특수가스(NF3, WF6) 국내 1위 공급사." },
  "솔브레인":        { ticker: "357780", price: 312500, changePercent:  1.20, weekChangePercent:  2.80, description: "반도체·디스플레이 식각 케미칼 전문. 삼성·SK 양사에 납품." },
  "원익IPS":         { ticker: "240810", price: 47850,  changePercent:  2.10, weekChangePercent:  4.20, description: "반도체 증착(CVD·ALD) 장비 국내 1위. 삼성전자 주요 납품처." },
  "피에스케이":      { ticker: "319660", price: 61200,  changePercent:  1.55, weekChangePercent:  2.90, description: "반도체 PR 애셔·에처 장비 전문. HBM 패키징 공정에 적용 확대." },
  "DB하이텍":        { ticker: "000990", price: 52300,  changePercent:  0.77, weekChangePercent:  1.40, description: "국내 유일 파운드리 전문 기업. 아날로그·전력반도체 8인치 팹 운영." },
  "ISC":             { ticker: "095340", price: 39800,  changePercent:  1.30, weekChangePercent:  2.60, description: "반도체 테스트 소켓 전문. HBM 테스트 수요 증가 수혜." },
  "두산테스나":      { ticker: "131970", price: 29450,  changePercent:  0.68, weekChangePercent:  1.20, description: "반도체 후공정(번인 테스트) 전문. 파운드리 고객사 다변화 중." },
  "NAVER":           { ticker: "035420", price: 198500, changePercent:  1.94, weekChangePercent:  3.82, description: "국내 1위 포털·클라우드·LLM(HyperCLOVA X) 기업. B2B AI 전환 모멘텀." },
  "카카오":          { ticker: "035720", price: 41350,  changePercent:  1.22, weekChangePercent:  2.44, description: "국내 최대 메신저 플랫폼. AI 기반 광고·커머스 전환 진행 중." },
  "더존비즈온":      { ticker: "012510", price: 89200,  changePercent:  2.87, weekChangePercent:  5.60, description: "국내 1위 ERP·HR SaaS 기업. AI 접목 중소기업 재무 자동화 솔루션 출시." },
  "KT클라우드":      { ticker: "-",      price: 0,      changePercent:  0.00, weekChangePercent:  0.00, description: "KT 클라우드 자회사. IDC·GPU 클라우드 서비스 확장 중. (미상장)" },
  "솔트룩스":        { ticker: "304100", price: 18750,  changePercent:  3.40, weekChangePercent:  6.80, description: "국내 LLM 기업. 공공·금융 AI 솔루션 전문. 정부 AI 예산 수혜 기대." },
  "한화에어로스페이스": { ticker: "012450", price: 524000, changePercent: 2.88, weekChangePercent: 5.70, description: "한국 방산 최대 기업. K-9 자주포·FA-50 전투기 수출 주도. 폴란드·UAE 계약 확대." },
  "LIG넥스원":       { ticker: "079550", price: 218500, changePercent:  2.10, weekChangePercent:  4.20, description: "유도무기·전자전 시스템 전문 방산 기업. 중동·동남아 수출 증가." },
  "현대로템":        { ticker: "064350", price: 82100,  changePercent:  1.65, weekChangePercent:  3.30, description: "K2 전차 생산 기업. 폴란드 K2 추가 계약 기대감. 수소전기열차 병행." },
  "한국항공우주":    { ticker: "047810", price: 73400,  changePercent:  1.42, weekChangePercent:  2.84, description: "KAI. T-50·수리온 생산. FA-50 수출 증가. 우주발사체 사업 확대." },
  "풍산":            { ticker: "103140", price: 62800,  changePercent:  0.96, weekChangePercent:  1.92, description: "방산 탄약·동 소재 국내 1위. 전쟁 장기화로 탄약 공급 수요 증가." },
  "셀트리온":        { ticker: "068270", price: 178500, changePercent:  0.73, weekChangePercent:  1.46, description: "국내 1위 바이오시밀러 기업. CT-P59(렉키로나) 글로벌 판매 확대." },
  "삼성바이오로직스": { ticker: "207940", price: 912000, changePercent: 0.55, weekChangePercent: 1.10, description: "글로벌 CMO 2위. 역대 최대 5조원 수주 잔고. 5공장 증설 완료 임박." },
  "유한양행":        { ticker: "000100", price: 118000, changePercent:  0.85, weekChangePercent:  1.70, description: "렉라자(비소세포폐암) 미국 FDA 허가. 로슈와 공동 판매. 신약 모멘텀." },
  "에스티팜":        { ticker: "237690", price: 87600,  changePercent:  0.46, weekChangePercent:  0.92, description: "올리고핵산·mRNA 원료의약품 국내 1위. 글로벌 빅파마 CMO 수주 확대." },
  "LG에너지솔루션":  { ticker: "373220", price: 312000, changePercent: -0.96, weekChangePercent: -1.92, description: "국내 배터리 1위. 미 GM·포드향 공급 확대. IRA 세액공제 불확실성 지속." },
  "삼성SDI":         { ticker: "006400", price: 218500, changePercent: -0.68, weekChangePercent: -1.36, description: "프리미엄 배터리(원통형·각형) 전문. BMW·스텔란티스 주요 공급처." },
  "에코프로비엠":    { ticker: "247540", price: 94200,  changePercent: -0.85, weekChangePercent: -1.70, description: "양극재(NCA) 국내 1위. 리튬 가격 하락으로 수익성 압박. IRA 불확실성 지속." },
  "POSCO홀딩스":     { ticker: "005490", price: 298500, changePercent: -0.50, weekChangePercent: -1.00, description: "철강·리튬·니켈 수직 계열화. 아르헨티나 리튬 염호 개발 진행 중." },
  "포스코케미칼":    { ticker: "003670", price: 168000, changePercent: -0.59, weekChangePercent: -1.18, description: "음극재·양극재 겸업. 포스코그룹 배터리 소재 사업 핵심 계열사." },
  "현대건설":        { ticker: "000720", price: 38450,  changePercent: -1.41, weekChangePercent: -2.82, description: "국내 건설 1위. PF 리스크 노출 축소 중. 사우디 네옴시티 수주 기대." },
  "GS건설":          { ticker: "006360", price: 17850,  changePercent: -1.66, weekChangePercent: -3.32, description: "자이 브랜드 주택·플랜트 전문. PF 충당금 적립으로 실적 압박." },
  "대우건설":        { ticker: "047040", price: 4285,   changePercent: -1.15, weekChangePercent: -2.30, description: "주택·해외 플랜트 전문. 중흥그룹 인수 후 재무 안정화 진행 중." },
};

// ─── 수급 현황 ────────────────────────────────────────────────────

export interface SupplyDemandPlayer {
  name: string;
  amount: number;     // 순매수 금액 (억원, 음수 = 순매도)
  streak: number;     // 연속 순매수(+) / 순매도(-) 일수
}

export interface SupplyDemandData {
  date: string;
  market: "KOSPI" | "KOSDAQ";
  players: SupplyDemandPlayer[];
}

export const supplyDemand: SupplyDemandData[] = [
  {
    date: "2026-05-31",
    market: "KOSPI",
    players: [
      { name: "외국인",  amount:  3241, streak:  5 },
      { name: "기관",    amount: -1182, streak: -2 },
      { name: "개인",    amount: -2059, streak: -5 },
    ],
  },
  {
    date: "2026-05-31",
    market: "KOSDAQ",
    players: [
      { name: "외국인",  amount:   428, streak:  3 },
      { name: "기관",    amount:   312, streak:  2 },
      { name: "개인",    amount:  -740, streak: -3 },
    ],
  },
];

// ─── 시장 심리 지수 (공포/탐욕) ──────────────────────────────────

export type FearGreedLevel = "extreme-fear" | "fear" | "neutral" | "greed" | "extreme-greed";

export interface FearGreedData {
  score: number;              // 0-100
  level: FearGreedLevel;
  prevScore: number;          // 어제
  weekScore: number;          // 일주일 전
  factors: { name: string; contribution: "positive" | "negative" | "neutral" }[];
}

export const fearGreed: FearGreedData = {
  score: 72,
  level: "greed",
  prevScore: 68,
  weekScore: 61,
  factors: [
    { name: "외국인 연속 순매수",   contribution: "positive" },
    { name: "시장 폭 (상승 종목 ↑)", contribution: "positive" },
    { name: "거래대금 증가",         contribution: "positive" },
    { name: "원/달러 강세",          contribution: "positive" },
    { name: "금리 동결 우려",        contribution: "negative" },
  ],
};

// ─── 이번 주 경제 이벤트 ─────────────────────────────────────────

export type EventImpact = "high" | "medium" | "low";

export interface EconomicEvent {
  date: string;
  time: string;
  country: string;
  name: string;
  impact: EventImpact;
  forecast?: string;
  previous?: string;
}

export const upcomingEvents: EconomicEvent[] = [
  { date: "06/02(월)", time: "23:00", country: "미국", name: "ISM 제조업 PMI",      impact: "medium", forecast: "49.6", previous: "48.7" },
  { date: "06/04(수)", time: "21:15", country: "미국", name: "ADP 민간 고용",       impact: "high",   forecast: "+17.5만", previous: "+15.6만" },
  { date: "06/04(수)", time: "23:00", country: "미국", name: "ISM 서비스 PMI",      impact: "medium", forecast: "51.2", previous: "51.6" },
  { date: "06/05(목)", time: "20:15", country: "유럽", name: "ECB 기준금리 결정",   impact: "high",   forecast: "2.25% 동결", previous: "2.25%" },
  { date: "06/05(목)", time: "21:30", country: "미국", name: "신규 실업수당 청구",  impact: "medium", forecast: "22.0만", previous: "21.9만" },
  { date: "06/06(금)", time: "21:30", country: "미국", name: "비농업 고용(NFP)",    impact: "high",   forecast: "+18.5만", previous: "+17.7만" },
  { date: "06/06(금)", time: "21:30", country: "미국", name: "실업률",              impact: "high",   forecast: "4.2%",   previous: "4.2%"   },
];

// ─── 국내 종목 거래대금 순위 ──────────────────────────────────────

export interface DomesticStock {
  rank: number;
  name: string;
  ticker: string;
  price: number;
  changePercent: number;
  tradingValue: number;  // 거래대금 (억원)
  volume: number;        // 거래량 (주)
  comment: string;       // 왜 이 종목이 뜨는지
}

export const domesticTopStocks: DomesticStock[] = [
  { rank: 1,  name: "삼성전자",         ticker: "005930", price: 87400,  changePercent:  3.21, tradingValue: 33420, volume: 38241200, comment: "외국인 3,200억 순매수. AI 서버용 HBM 수요 급증으로 실적 상향 기대." },
  { rank: 2,  name: "SK하이닉스",       ticker: "000660", price: 241000, changePercent:  4.15, tradingValue: 30880, volume: 12803100, comment: "HBM4 양산 일정 조기화 보도. 엔비디아 2025년 연간 공급 계약 체결 루머." },
  { rank: 3,  name: "한화에어로스페이스", ticker: "012450", price: 524000, changePercent: 2.88, tradingValue: 12590, volume:  2401500, comment: "폴란드 K-9 2차 계약 임박 보도 (2.3조 규모). 방산 ETF 자금 유입 가속." },
  { rank: 4,  name: "NAVER",            ticker: "035420", price: 198500, changePercent:  1.94, tradingValue: 7570,  volume:  3812700, comment: "클로바X 엔터프라이즈 출시. B2B AI 수익화 기대로 목표주가 상향 증권사 속출." },
  { rank: 5,  name: "LG에너지솔루션",  ticker: "373220", price: 312000, changePercent: -0.96, tradingValue: 3760,  volume:  1204300, comment: "IRA 세액공제 축소 논의로 매도 압력. 단, GM 공급 계약 유지로 낙폭 제한." },
  { rank: 6,  name: "삼성바이오로직스", ticker: "207940", price: 912000, changePercent:  0.55, tradingValue: 5030,  volume:   551200, comment: "역대 최대 CMO 계약(1.8조) 공시. 5공장 가동 시 생산 능력 64만L 돌파." },
  { rank: 7,  name: "카카오",           ticker: "035720", price: 41350,  changePercent:  1.22, tradingValue: 4210,  volume: 10182000, comment: "AI 광고 플랫폼 베타 출시. 카카오톡 광고 단가 인상 기대." },
  { rank: 8,  name: "현대건설",         ticker: "000720", price: 38450,  changePercent: -1.41, tradingValue: 1580,  volume:  4109800, comment: "금리 동결 발표로 PF 부담 지속. 기관 매도세. 사우디 수주 소식은 호재." },
  { rank: 9,  name: "한미반도체",       ticker: "042700", price: 138500, changePercent:  2.44, tradingValue: 1920,  volume:  1386400, comment: "HBM4용 TC 본더 수주 기대. SK하이닉스 주가 상승에 후공정 장비株 동반 강세." },
  { rank: 10, name: "에코프로비엠",     ticker: "247540", price: 94200,  changePercent: -0.85, tradingValue: 1340,  volume:  1422500, comment: "리튬 가격 하락 지속 + IRA 불확실성으로 양극재 주가 약세. 공매도 잔고 증가." },
  { rank: 11, name: "셀트리온",         ticker: "068270", price: 178500, changePercent:  0.73, tradingValue: 2190,  volume:  1227000, comment: "CT-P16 유럽 허가 기대 임박. 바이오시밀러 시장 확대로 중장기 성장 모멘텀." },
  { rank: 12, name: "포스코홀딩스",     ticker: "005490", price: 298500, changePercent: -0.50, tradingValue: 1480,  volume:   495800, comment: "리튬 가격 하락으로 2차전지 소재 부문 수익성 압박. 철강 부문은 선방." },
];

// ─── 해외 종목 거래대금 순위 ──────────────────────────────────────

export interface GlobalStock {
  rank: number;
  name: string;
  ticker: string;
  exchange: string;
  price: number;
  changePercent: number;
  marketCap: string;  // 시가총액 (조원 환산)
  comment: string;
}

export const globalTopStocks: GlobalStock[] = [
  { rank: 1, name: "NVIDIA",    ticker: "NVDA", exchange: "NASDAQ", price: 1089.23, changePercent:  4.21, marketCap: "약 3,500조원", comment: "블랙웰 공급 차질 해소 + 차세대 루빈 아키텍처 발표. AI 투자 사이클 수혜 최전방." },
  { rank: 2, name: "Apple",     ticker: "AAPL", exchange: "NASDAQ", price:  213.45, changePercent:  0.84, marketCap: "약 4,500조원", comment: "AI폰(iPhone 17) 기대감. 인도 생산 확대로 공급망 다변화. 워렌 버핏 보유 유지." },
  { rank: 3, name: "Microsoft", ticker: "MSFT", exchange: "NASDAQ", price:  421.80, changePercent:  1.12, marketCap: "약 4,200조원", comment: "코파일럿 기업 구독 매출 급성장. 애저(Azure) AI 서비스 수요 분기 사상 최고." },
  { rank: 4, name: "Tesla",     ticker: "TSLA", exchange: "NASDAQ", price:  182.34, changePercent: -1.38, marketCap: "약  800조원", comment: "중국 BYD와 가격 경쟁 심화. 사이버트럭 리콜 이슈. 풀셀프드라이빙 규제 불확실." },
  { rank: 5, name: "Amazon",    ticker: "AMZN", exchange: "NASDAQ", price:  198.67, changePercent:  0.63, marketCap: "약 2,900조원", comment: "AWS 클라우드 AI 매출 가속. 광고 사업 성장세. 베드록(Bedrock) LLM 플랫폼 확장." },
  { rank: 6, name: "Meta",      ticker: "META", exchange: "NASDAQ", price:  582.10, changePercent:  1.94, marketCap: "약 2,100조원", comment: "AI 광고 타겟팅으로 광고 단가 상승. 라마(Llama) 오픈소스 전략으로 생태계 확장." },
  { rank: 7, name: "Alphabet",  ticker: "GOOGL",exchange: "NASDAQ", price:  178.42, changePercent:  0.51, marketCap: "약 3,100조원", comment: "제미나이(Gemini) 성능 개선으로 AI 검색 우려 해소. 유튜브 광고 강세 지속." },
  { rank: 8, name: "TSMC",      ticker: "TSM",  exchange: "NYSE",   price:  185.23, changePercent:  2.90, marketCap: "약 1,600조원", comment: "애플·엔비디아·AMD 3nm 파운드리 수요 급증. 2nm 수율 목표 달성 보도." },
];
