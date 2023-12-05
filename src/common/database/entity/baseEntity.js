const connection = require("../index");

class BaseEntity {
  constructor(attributes) {
    Object.assign(this, attributes);
  }

  static get tableName() {
    // 클래스 이름을 가져와서 스네이크 케이스로 변환합니다.
    return this.name
      .replace(/([A-Z])/g, "_$1")
      .toUpperCase()
      .slice(1);
  }

  save(callback) {
    if (this.id) {
      // 데이터베이스에서 엔티티 업데이트
      connection.query(
        `UPDATE ${this.constructor.tableName} SET ? WHERE id = ?`,
        [this, this.id],
        callback
      );
    } else {
      // 데이터베이스에서 새 엔티티 생성
      connection.query(
        `INSERT INTO ${this.constructor.tableName} SET ?`,
        this,
        (error, results) => {
          if (error) {
            callback(error);
          } else {
            this.id = results.insertId;
            callback(null, results);
          }
        }
      );
    }
  }

  static findById(id, callback) {
    connection.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          const result = results[0] ? new this(results[0]) : null;
          callback(null, result);
        }
      }
    );
  }

  delete(callback) {
    if (this.id) {
      connection.query(
        `DELETE FROM ${this.constructor.tableName} WHERE id = ?`,
        [this.id],
        callback
      );
    }
  }
}
module.exports = BaseEntity;
