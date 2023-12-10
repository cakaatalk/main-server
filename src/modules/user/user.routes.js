const express = require("express");

class UserRouter {
  constructor(authController, userController) {
    this.authController = authController;
    this.userController = userController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/friends",
      this.authController.checkUserSession,
      this.userController.getFriendsList
    );

    this.router.get(
      "/profile",
      this.authController.checkUserSession,
      this.userController.getProfile
    );

    this.router.post(
      "/addFriend",
      this.authController.checkUserSession,
      this.userController.addFriend
    );

    this.router.post(
      "/updateProfile",
      this.authController.checkUserSession,
      this.userController.updateProfile
    );

    this.router.get("/searchUser", this.userController.searchUser);
    this.router.post("/addUser", this.userController.addUser);
    this.router.post("/deleteUser/:userId", this.userController.deleteUser);
    this.router.get("/findUser", this.userController.findUserByEmail);

    this.router.get(
      "/findAll",
      this.authController.checkUserSession,
      this.userController.findAllUser
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UserRouter;
