const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 4040,
  user: "root",
  password: "1234",
  database: "cakaatalk",
});

// SQL 파일 실행 함수
function executeSQLFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, sql) => {
      if (err) {
        reject(`Error reading file ${filePath}: ${err}`);
        return;
      }

      connection.query(sql, (queryErr, results) => {
        if (queryErr) {
          reject(`Error executing SQL in ${filePath}: ${queryErr}`);
          return;
        }

        console.log(`Executed SQL from ${filePath}:`, results);
        resolve();
      });
    });
  });
}

// 테이블 이름 추출 함수
function extractTableName(sql) {
  const match = sql.match(/CREATE TABLE (\w+)/i);
  return match ? match[1] : null;
}

// 연결 및 파일 실행
connection.connect(async (err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL");

  try {
    const schemaPath = path.join(__dirname, "schema");
    const fileNames = fs
      .readdirSync(schemaPath)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // 파일 이름 순으로 정렬

    // 테이블 삭제 (역순으로 실행)
    for (const fileName of [...fileNames].reverse()) {
      const filePath = path.join(schemaPath, fileName);
      const sql = fs.readFileSync(filePath, "utf8");
      const tableName = extractTableName(sql);

      if (tableName) {
        // 테이블 삭제
        await connection.promise().query(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`Dropped table ${tableName}`);
      }
    }

    // 테이블 생성 (원래 순서대로 실행)
    for (const fileName of fileNames) {
      const filePath = path.join(schemaPath, fileName);
      await executeSQLFile(filePath);
    }
  } catch (e) {
    console.error("Error during SQL execution:", e);
  } finally {
    connection.end();
  }
});
