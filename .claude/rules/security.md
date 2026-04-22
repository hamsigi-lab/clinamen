# 보안 규칙

## API 키 / 시크릿 관리

- API 키, 토큰, 비밀번호는 절대 코드에 직접 작성하지 않는다
- `.env` 파일에 보관하며, `.gitignore`에 반드시 포함
- 프론트엔드(브라우저)에서 실행되는 코드에는 민감한 키를 넣지 않는다
  - 브라우저에서 실행되는 코드는 누구나 볼 수 있다
  - 외부 API 호출이 필요하면 Cloudflare Workers를 프록시로 사용한다
- 환경변수 예시는 `.env.example`에 키 이름만 남기고 값은 비워둔다

## Cloudflare Pages 환경변수 설정 방법

1. Cloudflare 대시보드 → Workers & Pages → clinamen
2. Settings → Variables and Secrets → Add
3. 변수명과 값 입력 후 저장
4. 코드에서는 `VARIABLE_NAME` 형태로 참조 (Workers의 경우)

## 커밋 전 확인

- `git diff --staged`로 스테이징된 내용 확인
- API 키, 토큰, 패스워드가 포함되지 않았는지 검토
- `.env` 파일이 스테이징되지 않았는지 확인

## 금지 사항

- `.env` 파일 커밋
- API 키를 JavaScript 변수에 하드코딩
- 클라이언트 코드에서 서드파티 API 직접 호출 (키 노출 위험)
- `console.log`에 민감한 데이터 출력
