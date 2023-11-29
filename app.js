const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = 8080;

const routes = require("./src/route");
const authRouter = require("./src/modules/auth/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", routes);
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
