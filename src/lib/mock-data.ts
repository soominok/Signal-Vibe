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

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  keywords: string[];
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
  },
  {
    id: "top-2",
    title: "외국인, 코스피서 5거래일 연속 순매수…반도체·방산 집중",
    source: "한국거래소 / 머니투데이",
    publishedAt: "2026-05-31 09:05",
    summary: "외국인 투자자가 코스피에서 5거래일 연속 순매수를 기록했다. 반도체와 방산 업종이 주요 매수 대상이다.",
    keywords: ["외국인 순매수", "반도체", "방산"],
  },
  {
    id: "top-3",
    title: "엔비디아 블랙웰 공급 차질 해소…HBM 수요 재확인",
    source: "Reuters / 전자신문",
    publishedAt: "2026-05-31 06:30",
    summary: "엔비디아 블랙웰 GPU의 공급 차질이 해소되면서 국내 HBM 공급사들의 수혜 기대감이 다시 높아지고 있다.",
    keywords: ["엔비디아", "HBM", "AI 서버"],
  },
  {
    id: "top-4",
    title: "원·달러 환율, 1,380원 초반 안정…무역수지 흑자 영향",
    source: "서울외국환중개 / 연합인포맥스",
    publishedAt: "2026-05-31 10:15",
    summary: "원·달러 환율이 1,382원대에서 안정세를 보이고 있다. 수출 호조에 따른 무역수지 흑자가 원화 강세를 지지하고 있다.",
    keywords: ["환율", "무역수지"],
  },
];
