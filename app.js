const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { initWebSocket } = require("./src/modules/socket/chatws.controller.js");
const routes = require("./src/route");
const { dongception } = require("#dongception");

require("dotenv").config();
const app = express();
const port = 8080;
const socketPort = 3001;

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
initWebSocket(wss);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
});
app.use("/api", routes);

app.use(dongception);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.listen(socketPort, () => {
  console.log("running on port " + socketPort);
});
