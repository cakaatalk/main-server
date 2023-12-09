const express = require("express");
const ChatService = require("./chat.service");
const ChatController = require("./chat.controller");
const RoomRepository = require("../../repositories/room.repository");
const UserRepository = require("../../repositories/user.repository");
const db = require("../../common/database");
const userRepository = new UserRepository(db);
const roomRepository = new RoomRepository(db);
const chatService = new ChatService(roomRepository, userRepository);
const chatController = new ChatController(chatService);

const AuthController = require("../auth/auth.controller");
const AuthService = require("../auth/auth.service");
const AuthRepository = require("../../repositories/auth.repository");
const jwtController = require("../../common/jwt/jwt.controller");

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository, jwtController);
const authController = new AuthController(authService);

const chatRouter = express.Router();

chatRouter.post(
  "/roomId",
  authController.checkUserSession,
  chatController.getRoomId
);

chatRouter.get(
  "/roomList",
  authController.checkUserSession,
  chatController.getRoomList
);

chatRouter.get(
  "/messages/:roomId",
  authController.checkUserSession,
  chatController.getMessages
);

module.exports = chatRouter;
