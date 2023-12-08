const WebSocket = require("ws");
const RoomRepository = require("../../repositories/room.repository");
const db = require("../../common/database");
const roomRepository = new RoomRepository(db);

let rooms = [];

class Chat {
  constructor(roomId, message, sender, timestamp) {
    this.roomId = roomId;
    this.message = message;
    this.sender = sender;
    this.timestamp = timestamp;
  }
}

function initWebSocket(wss) {
  wss.on("connection", (ws) => {
    console.log(`Connected. Socket ID: ${ws._socket.remoteAddress}`);

    ws.on("message", (data) => {
      const message = JSON.parse(data);
      handleWebSocketMessage(ws, message);
    });

    ws.on("close", () => {
      console.log(`Disconnected. Socket ID: ${ws._socket.remoteAddress}`);
    });
  });
}

function handleWebSocketMessage(ws, message) {
  switch (message.type) {
    case "joinRoom":
      let exists = false;
      rooms.forEach((room) => {
        if (room.roomId == message.data.roomId) {
          exists = true;
        }
      });
      if (!exists) {
        rooms[message.data.roomId] = {
          roomId: message.data.roomId,
          users: [ws],
        };
      } else {
        rooms[message.data.roomId].users = [
          ...rooms[message.data.roomId].users,
          ws,
        ];
      }
      break;
    case "sendmsg":
      if (message.data) {
        const timestamp = new Date();
        let chatData = new Chat(
          message.data.roomId,
          message.data.message,
          message.data.userName,
          timestamp
        );
        roomRepository.saveMessage(
          chatData.sender,
          chatData.roomId,
          chatData.message,
          chatData.timestamp
        );
        broadcastToRoom(chatData.roomId, "getmsg", chatData);
      }
      break;

    default:
      break;
  }
}

function broadcastToRoom(roomId, type, data) {
  console.log(data)
  rooms[roomId].users.forEach((user) => {
    if (user.readyState === WebSocket.OPEN) {
      user.send(JSON.stringify({ type: type, data: data }));
    }
  });
}

module.exports = { initWebSocket };
