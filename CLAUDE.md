# CLAUDE.md

## 프로젝트 개요

바이브 코딩 기반의 1인 창업 프로젝트. AI를 활용해 수익형 웹 프로덕트를 빠르게 만들고 배포하는 것이 목표다.
참고 강좌: [바이브 코딩 1인 창업 부트캠프](https://www.youtube.com/watch?v=P3jFI-VpyLg&list=PLU9-uwewPMe27GtNWsIorePtRO_3vwidD)

## 배포 환경

- **저장소**: https://github.com/hamsigi-lab/clinamen
- **배포**: Cloudflare Pages (clinamen.pages.dev)
- **CI/CD**: GitHub Actions (main 브랜치 push → 자동 배포)

## 자기 검토 원칙

코드 작성 후 반드시 아래 항목을 스스로 점검하고, 문제가 있으면 수정 후 재실행한다.

### 체크리스트
- [ ] 브라우저에서 실제로 동작하는가
- [ ] 모바일 화면에서도 깨지지 않는가
- [ ] 불필요한 코드나 중복이 없는가
- [ ] 보안 취약점(XSS, 민감 정보 노출 등)이 없는가
- [ ] Cloudflare Pages에서 정적 파일로 서빙 가능한가

### 피드백 루프
문제 발견 시 다음 순서로 처리한다:
1. 문제 원인을 한 줄로 명시
2. 수정 사항 적용
3. 재확인 후 완료 보고

## 개발 철학 (바이브 코딩)

- **일단 동작하게 만든다** — 완벽함보다 빠른 배포
- **작게 시작한다** — 기능 하나씩 추가
- **실제 사용자 관점** — 만드는 사람이 아닌 쓰는 사람 기준
- **수익 연결** — 모든 기능은 가치 제공 또는 수익과 연결되어야 함

## 기술 스택

- HTML / CSS / JavaScript (바닐라 우선, 필요 시 프레임워크 도입)
- Cloudflare Pages (정적 호스팅)
- GitHub Actions (자동 배포)
- Claude AI (개발 파트너)
