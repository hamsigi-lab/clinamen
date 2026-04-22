# 아키텍처

## 현재 구조

```
clinamen/
├── index.html          # 진입점
├── .github/
│   └── workflows/
│       └── deploy.yml  # 자동 배포
├── .claude/
│   └── rules/          # 도메인별 규칙
├── memory-bank/        # 프로젝트 컨텍스트 문서
└── CLAUDE.md
```

## 데이터 흐름

```
사용자 → Cloudflare Pages (정적 파일)
              ↓ (필요 시)
        Cloudflare Workers (API/서버 로직)
              ↓
        외부 API / DB
```

## 결정 사항

| 항목 | 선택 | 이유 |
|------|------|------|
| 호스팅 | Cloudflare Pages | 무료, 빠름, GitHub 연동 |
| JS 프레임워크 | Vanilla 우선 | 복잡도 최소화 |
| CSS | 순수 CSS | 빌드 과정 제거 |

## 코드 작성 전 이 파일을 항상 먼저 확인할 것
