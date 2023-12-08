const db = require("../../common/database");
const User = require("../../entities/user.entity");
const BaseController = require("../../common/dongpring/baseController");

class ChatController extends BaseController {
  constructor(chatService) {
    super();
    this.chatService = chatService;
  }

  async getPersonalRoomId(req, res) {
    const user1Id = req.user.id;
    const user2Id = req.params.userId;

    return await this.chatService.getPersonalRoomId(user1Id, user2Id);
  }

  async getMessages(req, res) {
    const roomId = req.params.roomId;
    const startId = req.query.startId || 0;

    return await this.chatService.getMessage(roomId, startId);
  }
}

module.exports = ChatController;
