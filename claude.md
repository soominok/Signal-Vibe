# CLAUDE.md — 에이전트 작업 규칙 (하네스)

> 이 파일은 코딩 에이전트가 매 작업마다 따르는 규칙이다.
> Claude Code / Cursor 등은 이 파일을 자동으로 읽는다.

## 작업 시작 전 (항상)
1. `info.txt`를 읽어 프로젝트 맥락을 확인한다.
2. `plan.md`의 "현재 단계"를 확인하고, 그 단계의 미완료 체크박스 중
   하나만 골라 작업한다. 범위를 임의로 넓히지 않는다.
3. 불확실하면 코드를 짜기 전에 먼저 질문한다.

## 작업 끝난 후 (항상)
1. 타입 체크 / 린트 / 빌드를 실행해 통과를 확인한다.
2. 개발 서버를 띄워 실제 동작을 확인(가능하면 스크린샷/응답 확인)한다.
3. 끝난 체크박스를 `plan.md`에서 [x]로 바꾼다.
4. 변경 요약을 2~3줄로 보고한다.

## 코딩 컨벤션
- 언어: TypeScript (strict). `any` 금지, 불가피하면 주석으로 이유 명시.
- 구조: 기능 단위 폴더. UI(컴포넌트) / 로직(lib) / 데이터(db) 분리.
- 네이밍: `info.txt`의 용어집(Glossary)을 그대로 사용한다.
- 한 파일이 300줄을 넘으면 분리를 제안한다.
- 외부 API 호출은 반드시 `lib/`의 전용 클라이언트를 통해서만 한다.

## 절대 규칙 (Guardrails) — 위반 금지
- [면책] 분석을 보여주는 모든 페이지에 면책 고지 컴포넌트를 포함한다.
- [개인화 금지] 특정 사용자에게 "사라/팔라"는 1:1 매매 지시 UI/문구를
  만들지 않는다. 정보는 "참고용"으로만 제시한다.
- [출처] LLM이 생성한 텍스트(Insight)에는 "AI 생성" 라벨과 근거 링크를 단다.
- [비밀키] API 키·시크릿을 코드/저장소에 하드코딩하지 않는다. `.env`만 사용.
- [비용] 외부 데이터/LLM 호출은 캐시한다. 동일 요청 반복 호출 금지.
- [데이터 소스] 약관상 불명확한 크롤링 금지. 공식 API 우선.

## 검증 명령어 (이 프로젝트의 표준 루프)
```bash
npm run typecheck   # 타입 검사
npm run lint        # 린트
npm run build       # 빌드 통과 확인
npm run dev         # 로컬 동작 확인
```
※ 위 스크립트가 없으면 package.json에 먼저 추가하고 진행한다.

## 하지 말 것
- plan.md에 없는 기능을 "겸사겸사" 추가하지 않는다.
- 한 번에 여러 단계를 동시에 진행하지 않는다.
- 임의로 스택(라이브러리)을 바꾸지 않는다. 바꿔야 하면 먼저 제안·승인.

## 개발 실수 기록 (Lessons Learned)
> 실제 작업 중 발생한 문제와 해결책. 반복 방지용.

### 환경 설정
- **Node.js PATH 미반영**: winget으로 Node.js 설치 후 같은 PowerShell 세션에서 `npx` 인식 안 됨.
  → 같은 세션에서 쓸 때는 `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH` 먼저 실행.
- **create-next-app이 비어 있지 않은 디렉터리 거부**: 기존 파일(info.txt, plan.md 등)이 있으면 실패.
  → 임시 하위 디렉터리(`tmp-init`)에 생성 후 파일을 루트로 이동. 언더스코어 시작 이름(`_tmp`) 불가.
- **create-next-app이 CLAUDE.md를 자동 생성**: `@AGENTS.md` 한 줄짜리 파일로 우리 CLAUDE.md를 덮어쓸 수 있음.
  → 이동 시 CLAUDE.md를 건너뛰고 기존 파일 보존.

### Git / 파일 관리
- **`.env*` gitignore 패턴이 `.env.local.example`도 제외**: `.env.local.example`은 커밋해야 하는 템플릿.
  → `.gitignore`에 `!.env.local.example` 예외 추가 필수.
- **`next-env.d.ts`는 gitignore 대상**: Next.js 기본 `.gitignore`에 포함됨 — `git add` 시 명시적으로 넣지 말 것.

### TypeScript / IDE
- **IDE 진단이 파일 저장 직후 순간적으로 오래된 오류를 표시**: 실제 오류가 아닐 수 있음.
  → IDE 메시지만 보지 말고 반드시 `npm run typecheck`로 확인.
- **"use client" 경계**: HotSectorGrid처럼 onClick 함수 prop을 받는 컴포넌트는 클라이언트 컴포넌트 트리 안에 있어야 함. Server Component에서 함수 prop 직접 전달 불가.

### 스크린샷 검증
- **playwright는 프로젝트 devDependency로 유지하지 않음**: 스크린샷 목적으로만 임시 설치, 완료 후 `npm uninstall playwright` 및 임시 스크립트 삭제.
  → 매번 `npm install --save-dev playwright`로 재설치하거나, 향후 전용 스크립트 파일로 관리.

### Windows/PowerShell 특이사항
- **Bash 도구에서 Windows 경로 사용 시 실패**: `c:\Users\...` 대신 PowerShell 도구 사용.
- **절대경로에 공백 포함 시**: 반드시 큰따옴표로 감쌀 것 (`"C:\Program Files\..."`).

### UI/컴포넌트 설계
- **섹터 상세 패널(SectorDetailPanel)처럼 여러 상태를 가진 슬라이드오버**: 내부 뷰(sector → company)를 스택으로 관리할 것. 패널 하나에 모든 드릴다운을 구현하면 복잡도가 급증함.
- **mock-data.ts가 300줄을 넘으면 도메인별로 분리**: `mock-sectors.ts`, `mock-stocks.ts`, `mock-market.ts` 등으로 나눌 것.