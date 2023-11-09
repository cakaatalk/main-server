const mysql = require("mysql2");
const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3000,
  user: "root",
  password: "1234",
  database: "cakaotalk", // TODO: cakaatalk 으로 수정 필요
});

const connectMongodb = async () => {
  try {
    await mongoose.connect(MONGODB_URL,
      { useUnifiedTopology: true, useNewUrlParser: true });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectMongodb();

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }

  console.log("Connected to MySQL");

  console.log("Connected to MySQL with ID", connection.threadId);

  // connection.query(`
  //     CREATE TABLE USER (
  //         id INT PRIMARY KEY AUTO_INCREMENT,
  //         user_name VARCHAR(45),
  //         email VARCHAR(45) NOT NULL UNIQUE,
  //         password VARCHAR(45) NOT NULL
  //     );

  //     CREATE TABLE PROFILE (
  //         id INT PRIMARY KEY AUTO_INCREMENT,
  //         user_id INT,
  //         image_url VARCHAR(255),  -- S3 URL 또는 로컬 파일 경로
  //         comment VARCHAR(45),
  //         FOREIGN KEY (user_id) REFERENCES USER(id)
  //     );

  //     CREATE TABLE FRIENDS (
  //         user_id INT,
  //         friend_id INT,
  //         PRIMARY KEY (user_id, friend_id),
  //         FOREIGN KEY (user_id) REFERENCES USER(id),
  //         FOREIGN KEY (friend_id) REFERENCES USER(id)
  //     );
  //   `);
});

module.exports = connection;
