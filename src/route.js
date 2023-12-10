const express = require("express");

const UserService = require("#module/user/user.service.js");
const UserController = require("#module/user/user.controller.js");
const UserRepository = require("#repository/user.repository.js");
const db = require("#common/database/index.js");
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const AuthController = require("#module/auth/auth.controller.js");
const AuthService = require("#module/auth/auth.service.js");
const AuthRepository = require("#repository/auth.repository.js");
const jwtController = require("#common/jwt/jwt.controller.js");

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository, jwtController);
const authController = new AuthController(authService);

const authRouter = require("#module/auth/auth.routes.js");
const UserRouter = require("#module/user/user.routes.js");
const chatRouter = require("#module/chat/chat.routes.js");

const userRouter = new UserRouter(authController, userController).getRouter();
const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/chat", chatRouter);

module.exports = router;
