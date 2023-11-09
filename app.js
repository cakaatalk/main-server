const express = require("express");
const app = express();
const port = 3000;

// const db = require("./db");

const routes = require("./src/route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
