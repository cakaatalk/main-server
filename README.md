# Boiler Template

## 💪 협업합시다~

## directory architecture

```shell
src
|-common # 직접 구현할 외부모듈(jwt token, socket.io, typeorm, configmodule 등)
|--config # .env를 사용할 수 있게 해주는 모듈
|--database # DB를 편하게 사용할 수 있게 해주는 orm
|--jwt # jwt 모듈
|-entities # 추후 db migration에 사용하기 위한 디비 스키마들
|  profile.entities.sql
|  user.entities.sql
|-modules # 실제 서비스 코드
|--auth # 로그인 인증 인가. 기본적인 파일 구조 따르기
|   auth.controller.js
|   auth.service.js
|   auth.routes.js
|--user # 친구 추가 등
|   user.controller.js
|   user.service.js
|   user.routes.js
|-routes.js # route를 한번에 모아 app.js로 export시키기 위함

app.js
```

```
docker run --name mysql-cakaatalk -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=cakaatalk -e MYSQL_ROOT_HOST=% -p 4040:3306 -d mysql
```
