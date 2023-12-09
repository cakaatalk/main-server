const express = require("express");
const ChatService = require("./chat.service");
const ChatController = require("./chat.controller");
const RoomRepository = require("../../repositories/room.repository");
const db = require("../../common/database");
const roomRepository = new RoomRepository(db);
const chatService = new ChatService(roomRepository);
const chatController = new ChatController(chatService);

const AuthController = require("../auth/auth.controller");
const AuthService = require("../auth/auth.service");
const AuthRepository = require("../../repositories/auth.repository");
const jwtController = require("../../common/jwt/jwt.controller");

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository, jwtController);
const authController = new AuthController(authService);

const chatRouter = express.Router();

chatRouter.get(
  "/roomId/:userId",
  authController.checkUserSession,
  chatController.getPersonalRoomId
);

chatRouter.get(
  "/roomlist",
  authController.checkUserSession,
  chatController.getRoomList
);

module.exports = chatRouter;
