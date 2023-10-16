const express = require("express");
const router = express.Router();

const controller = require("../controllers");

router.get("/friends", controller.getFriendsList);
router.get("/profile/:userId", controller.getProfile);
router.post("/addFriend/:friendId", controller.addFriend);
router.post("/updateProfile", controller.updateProfile);
router.get("/searchUser", controller.searchUser);
router.post("/addUser", controller.addUser);
router.post("/deleteUser/:userId", controller.deleteUser);

module.exports = router;
