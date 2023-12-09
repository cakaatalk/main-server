const express = require("express");
const UserService = require("./user.service");
const UserController = require("./user.controller");
const UserRepository = require("../../repositories/user.repository");
const db = require("../../common/database");
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const AuthController = require("./../auth/auth.controller");
const AuthService = require("./../auth/auth.service");
const AuthRepository = require("./../../repositories/auth.repository");
const jwtController = require("./../../common/jwt/jwt.controller");

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository, jwtController);
const authController = new AuthController(authService);

const userRouter = express.Router();

userRouter.get(
  "/friends",
  authController.checkUserSession,
  userController.getFriendsList
);
userRouter.get(
  "/profile",
  authController.checkUserSession,
  userController.getProfile
);
userRouter.post(
  "/addFriend",
  authController.checkUserSession,
  userController.addFriend
);
userRouter.post(
  "/updateProfile",
  authController.checkUserSession,
  userController.updateProfile
);
userRouter.get("/searchUser", userController.searchUser);
userRouter.post("/addUser", userController.addUser);
userRouter.post("/deleteUser/:userId", userController.deleteUser);
userRouter.get("/findUser", userController.findUserByEmail);
userRouter.get(
  "/findAll",
  authController.checkUserSession,
  userController.findAllUser
);

module.exports = userRouter;
