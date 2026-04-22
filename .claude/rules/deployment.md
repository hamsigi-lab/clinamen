# 배포 규칙

## Cloudflare Pages 제약
- 서버 사이드 코드 실행 불가 — 순수 정적 파일만 서빙
- API 호출은 클라이언트 사이드 fetch 또는 Cloudflare Workers로 처리
- 빌드 없이 직접 서빙 — 파일 그대로 배포됨

## Git 규칙
- main 브랜치 직접 push = 즉시 프로덕션 배포
- 커밋 메시지: `타입: 내용` (feat, fix, docs, style, refactor)
- 기능 하나 = 커밋 하나 원칙

## 배포 전 확인
- index.html 경로가 올바른가
- 외부 리소스(폰트, CDN)가 HTTPS인가
- 환경변수가 필요한 경우 Cloudflare Pages 대시보드에서 설정했는가
