const express = require("express");
const router = express.Router();

const userController = require("./modules/user/user.controller");

router.get("/friends", userController.getFriendsList);
router.get("/profile/:userId", userController.getProfile);
router.post("/addFriend/:friendId", userController.addFriend);
router.post("/updateProfile", userController.updateProfile);
router.get("/searchUser", userController.searchUser);
router.post("/addUser", userController.addUser);
router.post("/deleteUser/:userId", userController.deleteUser);
router.get("/findUser", userController.findUserByEmail);
router.get("/findAll", userController.findAllUser);

module.exports = router;
