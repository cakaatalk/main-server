const express = require("express");
const app = express();
const port = 8080;

// const db = require("./db");

const routes = require("./src/route");
const authRouter = require("./src/modules/auth/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
