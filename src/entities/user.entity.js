const BaseEntity = require("../common/database/entity/baseEntity");

class User extends BaseEntity {
  /**
   * User 클래스의 생성자
   * @param {Object} param0 - 생성자 파라미터
   * @param {number} param0.id - 사용자 ID
   * @param {string} param0.user_name - 사용자 이름
   * @param {string} param0.email - 이메일 주소
   * @param {string} param0.password - 비밀번호
   */
  constructor({ id, user_name, email, password }) {
    super({ id, user_name, email, password });
    this.id = id;
    this.user_name = user_name;
    this.email = email;
    this.password = password;
  }

  static get tableName() {
    return "USER";
  }

  // 필요한 경우 User 클래스에 특화된 메소드 추가
}

module.exports = User;
