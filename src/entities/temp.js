// const BaseEntity = require("../common/database/entity/baseEntity");

// class User extends BaseEntity {
//   /**
//    * User 클래스의 생성자
//    * @param {Object} param0 - 생성자 파라미터
//    * @param {number} param0.id - 사용자 ID
//    * @param {string} param0.user_name - 사용자 이름
//    * @param {string} param0.email - 이메일 주소
//    * @param {string} param0.password - 비밀번호
//    */
//   constructor({ id, user_name, email, password }) {
//     super({ id, user_name, email, password });
//     /** @type {number} */
//     this.id = id;
//     /** @type {string} */
//     this.user_name = user_name;
//     /** @type {string} */
//     this.email = email;
//     /** @type {string} */
//     this.password = password;
//   }

//   static get tableName() {
//     return "USER";
//   }

//   // 필요한 경우 User 클래스에 특화된 메소드 추가
// }

// module.exports = User;

// /**
//  * 클래스 프로퍼티의 타입 정보를 이용해 CREATE TABLE SQL문을 생성합니다.
//  * @param {Function} entityClass - 엔티티 클래스
//  * @returns {string} - CREATE TABLE SQL문
//  */
// function generateCreateTableSQL(entityClass) {
//   const typeMappings = {
//     number: "INT",
//     string: "VARCHAR(255)", // 기본적으로 VARCHAR(255)를 사용합니다. 필요에 따라 조정할 수 있습니다.
//     // 여기에 더 많은 JavaScript 타입에 대한 SQL 타입 매핑을 추가할 수 있습니다.
//   };

//   const columnsSQL = Object.entries(entityClass.prototype)
//     .filter(
//       ([propertyName]) =>
//         propertyName !== "constructor" &&
//         typeof entityClass.prototype[propertyName] !== "function"
//     )
//     .map(([propertyName, propertyValue]) => {
//       const typeComment = propertyValue
//         .toString()
//         .match(/\/\*\* @type {(\w+)} \*\//);
//       const sqlType = typeComment
//         ? typeMappings[typeComment[1]]
//         : "VARCHAR(255)";
//       return `\`${propertyName}\` ${sqlType}`;
//     })
//     .join(",\n  ");

//   return `CREATE TABLE \`${entityClass.tableName}\` (\n  ${columnsSQL}\n);`;
// }

// // 사용 예:
// const createTableSQL = generateCreateTableSQL(User);
// console.log(createTableSQL);
