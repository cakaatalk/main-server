const db = require("../../common/database");
const { ErrorResponse } = require("#dongception");
const { response } = require("express");

class ChatService {
  constructor(roomRepository, userRepository) {
    this.roomRepository = roomRepository;
    this.userRepository = userRepository;
  }
  async getRoomInfo(userId, roomId) {
    const allRooms = await this.getRoomList(userId);

    for (let room of allRooms) {
      if (room.roomId == roomId) {
        return { roomName: room.roomName, roomSize: room.users.length };
      }
    }
    return { roomName: "", roomSize: 0 };
  }

  async getRoomList(userId) {
    let roomList = [];
    const allUserInfo = await this.userRepository.findAll();
    let personalRoomList = await this.roomRepository.getPersonalRoomList(
      userId
    );
    for (let el of personalRoomList) {
      const otherUserId = el.user1_id == userId ? el.user2_id : el.user1_id;
      let temp = {
        roomId: el.room_id,
        roomName: "",
        roomImage: "",
        users: [el.user1_id, el.user2_id],
        lastMessage: "",
        timestamp: null,
      };
      for (let user of allUserInfo) {
        if (user.id == otherUserId) {
          temp.roomName = user.name;
          temp.roomImage = user.profileImage;
          break;
        }
      }

      const lastMessage = (
        await this.roomRepository.getAllMessage(el.room_id)
      )[0];
      if (lastMessage) {
        temp.lastMessage = lastMessage.content;
        temp.timestamp = lastMessage.timestamp;
      }

      roomList.push(temp);
    }

    const groupRoomIds = await this.roomRepository.getGroupRoomIds(userId);
    const groupRooms = await this.roomRepository.getAllRooms();
    for (let roomId of groupRoomIds) {
      let temp = {
        roomId: roomId,
        roomName: "",
        roomImage: "",
        users: [],
        lastMessage: "",
        timestamp: null,
      };

      for (let x of groupRooms) {
        if (x.id == roomId) {
          temp.roomName = x.room_name;
          break;
        }
      }

      const users = await this.roomRepository.getUsersFromGroupChat(roomId);
      temp.users = users;

      temp.roomImage = "https://cakaatalk.aolda.net/uploads/default-group.png";

      const lastMessage = (await this.roomRepository.getAllMessage(roomId))[0];
      if (lastMessage) {
        temp.lastMessage = lastMessage.content;
        temp.timestamp = lastMessage.timestamp;
      }

      roomList.push(temp);
    }
    roomList.sort((a, b) => {
      // 두 객체 모두에서 timestamp가 null이거나 undefined인 경우를 처리
      if (!a.timestamp) return 1; // a가 null이거나 undefined면 b를 앞으로
      if (!b.timestamp) return -1; // b가 null이거나 undefined면 a를 앞으로

      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    return roomList;
  }

  async getRoomId(myUserId, userIds, roomName) {
    let roomId = 0;
    if (userIds.length == 1) {
      roomId = await this.roomRepository.getPersonalRoomId(
        myUserId,
        userIds[0]
      );
      if (!roomId) {
        roomId = await this.roomRepository.addPersonalRoom(
          myUserId,
          userIds[0],
          ""
        );
      }
      return { roomId: roomId };
    }
    userIds.push(myUserId);
    userIds.sort();
    roomId = await this.roomRepository.addGroupRoom(userIds, roomName);
    return { roomId: roomId };
  }

  async getMessage(roomId, startId) {
    let response = {
      nextId: 0,
      messages: [],
    };
    if (startId < 1) {
      const allMessages = await this.roomRepository.getAllMessage(roomId);
      response.messages = allMessages.slice(0, 20);
      if (!response.messages.length) {
        return [];
      }
      response.nextId = response.messages[response.messages.length - 1].id;
      response.messages.sort((a, b) => {
        // 두 객체 모두에서 timestamp가 null이거나 undefined인 경우를 처리
        if (!a.timestamp) return 1; // a가 null이거나 undefined면 b를 앞으로
        if (!b.timestamp) return -1; // b가 null이거나 undefined면 a를 앞으로

        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      return response;
    }
    response.messages = await this.roomRepository.getMessageByPaging(
      roomId,
      startId
    );
    if (!response.messages.length) {
      return [];
    }
    response.nextId = response.messages[response.messages.length - 1].id;
    response.messages.sort((a, b) => {
      // 두 객체 모두에서 timestamp가 null이거나 undefined인 경우를 처리
      if (!a.timestamp) return 1; // a가 null이거나 undefined면 b를 앞으로
      if (!b.timestamp) return -1; // b가 null이거나 undefined면 a를 앞으로

      return new Date(a.timestamp) - new Date(b.timestamp);
    });
    return response;
  }
}

module.exports = ChatService;
