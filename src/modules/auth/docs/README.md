# 기능 요구사항

## 사용자의 Authentication

### 회원가입 기능, 로그인 기능

- <b> 회원가입 </b>
- <b> 사용자의 로그인 정보가 있는지 검증 </b>
  #### 로그인 정보가 없을 시
  이메일 존재하지 않는다는 응답
  ##### 로그인 정보가 있을 시
  - AccessToken 생성, RefreshToken 생성
  - RefreshToken은 DB와 HttpOnly 쿠키에 저장 AccessToken은 응답으로 전달(프론트에서 헤더의 Authorization에 저장 필요)
  - RefreshToken을 DB에 저장할 때, 이미 email, user_name으로 생성된 RefreshToken이 있을 경우 삭제

### 유저 세션 관리 기능

- Access Token을 Request의 Authorization Header 에서 추출해서 검증
  - 유효할 시 정상 응답
  - 무효할 시 Refresh Token 검사
    - Refresh Token 유효할 시, Access Token 재발급, 정상 응답 처리
    - Refresh Token이 무효할 시 로그인 필요하다는 응답
- Refresh Token 생성

### JWT 토큰 파괴

- 사용자가 로그아웃 또는 Token이 존재하는 상태에서 로그인 시 기존 토큰 파괴

### 추가 기능

- 특정 URL 요청에 api/auth/session 을 자동으로 실행하도록 미들웨어 만들기
- 이미 Token을 발행한 유저가 로그인을 시도할 시, 기존 토큰 파괴 & 강제 로그아웃 => <b> DB에 Token을 저장해햐하는 이유 </b>

### JWT 를 사용하는 이유

<b>Session</b>

- Session 방식은 stateless하지 않다
- Session을 사용하여 처리할 경우, 사용자가 앱을 이용할 때마다 서버 메모리에 접근해야한다
- Session은 서버 메모리에 저장되기 때문에, 분산 서비스를 구축할 때 세션을 공유할 수 있도록 DB 서버를 만들어야한다.

<b>JWT</b>

- JWT는 토큰 자체에 정보가 저장되어있기 때문에 서버 메모리 접근이 필요없다. (토큰을 회수할 때 제외)

### DB 결과 처리

- SEELCT 결과 값이 null : length == 0
- DELETE, UPDATE, INSERT 결과 : result.affectedRows

### JWT 를 DB에 저장해야하는 이유

- 다른 브라우저, 다른 환경에선 토큰이 없어서 로그인 시도를 할 것이다. 로그인에 성공하면 토큰을 주고 기존에 발행했던 토큰을 삭제해야하는데, 삭제하기 위해 DB에 저장해두고 관리할 필요가 있다.
- 만약 토큰을 삭제하지 않는다면, 2명의 유저가 하나의 아이디로 동시에 로그인할 수 있는 일이 발생한다.
