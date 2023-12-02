
let rooms = [
  {
    roomName: "방이름",
    users: [],
    chat: []
  },
  {
    roomName: "방이름12",
    users: [],
    chat: []
  },
];

class Chat {
  constructor(roomName, message, sender, timestamp) {
    this.roomName = roomName;
    this.message = message;
    this.sender = sender;
    this.timestamp = timestamp;
  }
}

function initWebSocket(wss) {
  wss.on('connection', (ws) => {
    console.log(`Connected. Socket ID: ${ws._socket.remoteAddress}`);

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      handleWebSocketMessage(ws, message);
    });

    ws.on('close', () => {
      console.log(`Disconnected. Socket ID: ${ws._socket.remoteAddress}`);
    });
  });
}

function handleWebSocketMessage(ws, message) {
  switch (message.type) {
    case 'getRooms':
      ws.send(JSON.stringify({ type: 'getRooms', data: rooms }));
      break;

    case 'isRoomExist':
      const isRoomExist = rooms.find(room => room.roomName === message.data.roomName);
      ws.send(JSON.stringify({ type: 'isRoomExist', data: isRoomExist }));
      break;

    case 'createRoom':
      rooms.push({ roomName: message.data.roomName, users: [ws._socket.remoteAddress], chat: [] });
      ws.join(message.data.roomName);
      broadcastToRoom(message.data.roomName, 'getRoomsChange', rooms);
      break;

    case 'joinRoom':
      const roomIndex = rooms.findIndex(room => room.roomName === message.data.roomName);
      rooms[roomIndex].users.push(ws._socket.remoteAddress);
      ws.join(message.data.roomName);
      broadcastToRoom(message.data.roomName, 'getRoomsChange', rooms);
      break;

    case 'initmsg':
      const initRoomIndex = rooms.findIndex(room => room.roomName === message.data.roomName);
      if (rooms[initRoomIndex].chat) {
        ws.send(JSON.stringify({ type: 'initmsg', data: rooms[initRoomIndex].chat }));
      }
      break;

    case 'sendmsg':
      if (message.data) {
        const timestamp = new Date().toLocaleString();
        let chatData = new Chat(message.data.roomName, message.data.message, ws._socket.remoteAddress, timestamp);
        const sendMsgRoomIndex = rooms.findIndex(room => room.roomName === message.data.roomName);
        rooms[sendMsgRoomIndex].chat = !rooms[sendMsgRoomIndex].chat ? [chatData] : [chatData, ...rooms[sendMsgRoomIndex].chat];
        broadcastToRoom(message.data.roomName, 'getmsg', rooms[sendMsgRoomIndex].chat);
      }
      break;

    default:
      break;
  }
}

function broadcastToRoom(roomName, type, data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.rooms.has(roomName)) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}

module.exports = { initWebSocket };
