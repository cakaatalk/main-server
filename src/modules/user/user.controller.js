const db = require("../../common/database");
const User = require("../../entities/user.entity");
const BaseController = require("../../common/dongpring/baseController");
const UserRepository = require("../../repositories/user.repository");
const userRepository = new UserRepository(db);
class UserController extends BaseController {
  constructor(userService) {
    super();
    this.userService = userService;
  }

  async getFriendsList(req, res) {
    const userId = req.user.id;
    return await this.userService.getFriendsList(userId);
  }

  async getProfile(req, res) {
    const userId = req.user.id;
    return await this.userService.getProfile(userId);
  }

  async addFriend(req, res) {
    const userId = req.user.id;
    const friendId = req.body.friendId;
    return await this.userService.addFriend(userId, friendId);
  }

  async findUserByEmail(req, res) {
    const email = req.query.email;
    return await this.userService.findUserByEmail(email);
  }

  async findAllUser(req, res) {
    return await this.userService.findAllUser();
  }

  async updateProfile(req, res) {
    const userId = req.user.id;
    const imageUrl = req.body.imageUrl;
    const comment = req.body.comment;

    return await this.userService.updateProfile(userId, imageUrl, comment);
  }

  async searchUser(req, res) {
    const nameForSearch = `%${req.query.name}%`;

    return await this.userService.searchUser(nameForSearch);
  }

  async addUser(req, res) {
    const { userName, email, password } = req.body;

    const user = new User({
      user_name: userName,
      email: email,
      password: password,
    });

    const result = await userRepository.saveUser(user);
    res.json({ data: result });
  }

  async deleteUser(req, res) {
    const userId = req.params.userId;

    db.query("DELETE FROM PROFILE WHERE user_id = ?", [userId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.query("DELETE FROM USER WHERE id = ?", [userId], (err2) => {
        if (err2) {
          res.status(500).json({ error: err2.message });
          return;
        }
        res.json({ message: "User and profile deleted successfully" });
      });
    });
  }
}

module.exports = UserController;
