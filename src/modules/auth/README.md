# 기능 요구사항

- 사용자의 로그인
- Access Token을 Request의 Authorization Header 에서 추출해서 검증
  - 유효할 시 로그인
  - 무효할 시 Refresh Token 검사
- Refresh Token 생성
- 사용자 로그아웃 시 Token 파괴
