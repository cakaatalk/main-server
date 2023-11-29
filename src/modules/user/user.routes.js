const express = require("express");

const UserController = require("./user.controller");
const userController = new UserController();
const authController = require("../auth/auth.controller");

const userRouter = express.Router();

userRouter.get(
  "/friends",
  authController.checkUserSession,
  userController.getFriendsList
);
userRouter.get(
  "/profile/:userId",
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
userRouter.get("/findAll", userController.findAllUser);

module.exports = userRouter;
