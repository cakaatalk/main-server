// database/query.js
const connection = require("./index"); // 연결 풀을 가져옵니다.

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

module.exports = query;
