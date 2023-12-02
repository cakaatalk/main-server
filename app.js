const express = require("express");
const http = require('http');
const { initWebSocket } = require('./src/modules/socket/chatws.controller.js');
const { initSocket } = require('./src/modules/socket/chat.controller');

require('dotenv').config();
const app = express();
const port = 8080;
const socketPort = 3001;
const mode = 0; // 0 is socketio, 1 is websocket

const server = http.createServer(app);

if (mode == 0) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  initSocket(io);
}
else {
  const wss = new WebSocket.Server({ server });
  initWebSocket(wss);
}

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

server.listen(socketPort, () => {
  console.log('running on port ' + socketPort);
});