const db = require("../../common/database");
const { ErrorResponse } = require("#dongception");
const { response } = require("express");

class ChatService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async getPersonalRoomId(user1Id, user2Id) {
    let roomId = await this.roomRepository.getPersonalRoomId(user1Id, user2Id);
    if (!roomId) {
      roomId = await this.roomRepository.addPersonalRoom(user1Id, user2Id, "");
    }
    console.log(roomId);
    return roomId;
  }

  async getMessage(roomId, startId) {
    let response = {
      nextId: 0,
      messages: [],
    };
    if (!startId) {
      const allMessages = await this.roomRepository.getAllMessage(roomId);
      console.log(allMessages);
      response.messages = allMessages.slice(0, 20);
      response.nextId = response.messages[20].id;
      return response;
    }
    response.messages = await this.roomRepository.getMessage(roomId, startId);
    response.nextId = await this.response.messages[response.messages.length].id;
    return response;
  }
}

module.exports = ChatService;
