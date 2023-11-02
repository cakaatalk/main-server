# 기능 요구사항

- 사용자의 로그인
- Access Token을 Request의 Authorization Header 에서 추출해서 검증
  - 유효할 시 로그인
  - 무효할 시 Refresh Token 검사
- Refresh Token 생성
- 사용자 로그아웃 시 Token 파괴
- 특정 URL 요청에 api/auth/session 을 자동으로 실행하도록 미들웨어 만들기
- 이미 Token을 발행한 유저가 로그인을 시도할 시, 기존 토큰 파괴 & 강제 로그아웃 => <b> DB에 Token을 저장해햐하는 이유 </b>

### JWT 를 사용하는 이유

Session

- Session을 사용하여 처리할 경우, 사용자가 앱을 이용할 때마다 서버 메모리에 접근해야한다
- Session은 서버 메모리에 저장되기 때문에, 분산 서비스를 구축할 때 세션을 공유할 수 있도록 DB 서버를 만들어야한다.

JWT

- JWT는 토큰 자체에 정보가 저장되어있기 때문에 서버 메모리 접근이 필요없다. (토큰을 회수할 때 제외)

### DB 결과 처리

- SEELCT 결과 값이 null : length == 0
- DELETE, UPDATE, INSERT 결과 : result.affectedRows
