const db = require("../../common/database");
const User = require("../../entities/user.entity");
const BaseController = require("../../common/dongpring/baseController");

class ChatController extends BaseController {
  constructor(chatService) {
    super();
    this.chatService = chatService;
  }

  async getRoomList(req, res) {
    return await this.chatService.getRoomList(req.user.id);
  }

  async getRoomId(req, res) {
    const myUserId = req.user.id;
    const userIds = req.body.userIds;
    const roomName = req.body.roomName;
    return await this.chatService.getRoomId(myUserId, userIds, roomName);
  }

  async getRoomInfo(req, res) {
    const myUserId = req.user.id;
    const roomId = req.params.roomId;
    return await this.chatService.getRoomInfo(myUserId, roomId);
  }

  async getMessages(req, res) {
    const roomId = req.params.roomId;
    const startId = req.query.startId || 0;
    return await this.chatService.getMessage(roomId, startId);
  }
}

module.exports = ChatController;
