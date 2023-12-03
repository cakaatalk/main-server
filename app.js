const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 8080;

let corsOptions = {
  origin: '*'
}

const routes = require("./src/route");
const { dongception } = require("#dongception");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인에서의 요청을 허용
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use("/api", routes);

app.use(dongception);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
