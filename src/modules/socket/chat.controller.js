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

class chat {
    constructor(roomName, message, sender, timestamp) {
        this.roomName = roomName;
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
    }
    message;
    sender;
    roomName;
    timestamp;
}

function initSocket(io) {
    io.on('connection', (socket) => {
        console.log(`Connected. Socket ID: ${socket.id}`);

        socket.on('getRooms', (callback) => {
            callback(rooms);
        });

        socket.on('isRoomExist', (roomName, callback) => {
            const isRoomExist = rooms.find(room => room.roomName === roomName);
            callback(isRoomExist);
        });

        socket.on('createRoom', (roomName) => {
            rooms.push({ roomName, users: [socket.id], chat: [] });
            socket.join(roomName);
            socket.to(roomName).emit('getRoomsChange', rooms);
        });

        socket.on('joinRoom', (roomName) => {
            const roomIndex = rooms.findIndex(room => room.roomName === roomName);
            console.log(roomIndex, roomName, rooms);
            rooms[roomIndex].users.push(socket.id);
            socket.join(roomName);
            socket.to(roomName).emit('getRoomsChange', rooms);
        });

        socket.on('initmsg', (roomName, callback) => {
            const roomIndex = rooms.findIndex(room => room.roomName === roomName);
            if (rooms[roomIndex].chat) {
                callback(rooms[roomIndex].chat);
            }
        });

        socket.on('sendmsg', (roomName, message) => {
            console.log('Msg from ' + socket.id + ': ' + JSON.stringify(message));

            if (message) {
                const timestamp = new Date().toLocaleString();
                let chatData = new chat(roomName, message, socket.id, timestamp);
                const roomIndex = rooms.findIndex(room => room.roomName === roomName);

                rooms[roomIndex].chat = !rooms[roomIndex].chat ? [chatData] : [chatData, ...rooms[roomIndex].chat];
                io.to(roomName).emit('getmsg', rooms[roomIndex].chat);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected. Socket ID: ${socket.id}`);
        });
    });
}

module.exports = { initSocket };