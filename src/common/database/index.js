const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3000,
  user: "root",
  password: "1234",
  database: "cakaatalk",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }

  console.log("Connected to MySQL");
});

module.exports = connection;
