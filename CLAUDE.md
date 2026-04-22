# CLAUDE.md

## 프로젝트

바이브 코딩 기반 1인 창업 프로덕트. AI를 활용해 수익형 웹 서비스를 빠르게 만들고 배포한다.
참고: [바이브 코딩 1인 창업 부트캠프](https://www.youtube.com/watch?v=P3jFI-VpyLg&list=PLU9-uwewPMe27GtNWsIorePtRO_3vwidD)

## 배포

- 저장소: https://github.com/hamsigi-lab/clinamen
- 라이브: https://clinamen.pages.dev
- CI/CD: main 브랜치 push → GitHub Actions → Cloudflare Pages 자동 배포

## 기술 스택

- HTML / CSS / Vanilla JS (복잡도가 필요할 때만 프레임워크 도입)
- Cloudflare Pages (정적 호스팅)
- 외부 API 연동 시 Cloudflare Workers 활용

## 핵심 규칙

- 코드 작성 전 반드시 계획을 먼저 세운다 — 파일 구조, 변경 범위, 가정사항 명시
- 기능 하나 완성 → 즉시 자기 검토 → 문제 있으면 원인 한 줄 명시 후 재수정
- 컨텍스트가 길어지면 /compact 또는 새 세션으로 정확도 유지
- 민감 정보(API 키, 토큰)는 절대 코드에 포함하지 않는다

## 자기 검토 체크리스트

코드 작성 후 반드시 확인:
- [ ] 브라우저에서 실제로 동작하는가
- [ ] 모바일(375px)에서 깨지지 않는가
- [ ] 하드코딩된 시크릿이 없는가
- [ ] 불필요한 코드/중복이 없는가
- [ ] Cloudflare Pages 정적 서빙과 호환되는가

## 바이브 코딩 철학

- **일단 동작** — 완벽함보다 빠른 배포
- **작게 시작** — MVP 먼저, 기능은 검증 후 추가
- **사용자 관점** — 만드는 사람이 아닌 쓰는 사람 기준
- **수익 연결** — 모든 기능은 가치 제공 또는 수익과 연결
