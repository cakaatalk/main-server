const db = require("../../common/database");
const UserRepository = require("../../repositories/user.repository");
const User = require("../../entities/user.entity");
const userRepository = new UserRepository(db);

function asyncWrapper(handler) {
  return async function (req, res, next) {
    try {
      await handler.call(this, req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

class UserController {
  constructor() {
    Object.getOwnPropertyNames(UserController.prototype)
      .filter(
        (prop) => typeof this[prop] === "function" && prop !== "constructor"
      )
      .forEach((method) => {
        this[method] = asyncWrapper(this[method]);
      });
  }

  async getFriendsList(req, res) {
    const userId = req.user.id;
    const user = await userRepository.findFriends(userId);
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;

    const user = await userRepository.findProfileById(userId);
    console.log(user);
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

  async addFriend(req, res) {
    const userId = req.user.id;
    const friendId = req.body.friendId;

    const user = await userRepository.addFriend(userId, friendId);
    if (user) {
      res.json({ message: "Friend added!" });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

  async findUserByEmail(req, res) {
    const email = req.query.email;

    const user = await userRepository.findByEmail(email);
    if (user) {
      res.json({ data: result });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

  async findAllUser(req, res) {
    const user = await userRepository.findAll();
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

  async updateProfile(req, res) {
    const userId = req.user.id;
    const imageUrl = req.body.imageUrl;
    const comment = req.body.comment;

    const user = await userRepository.updateProfile(userId, imageUrl, comment);
    if (user) {
      res.json({ message: "Profile updated!" });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

  async searchUser(req, res) {
    const nameForSearch = `%${req.query.name}%`;

    const user = await userRepository.searchUserByName(nameForSearch);
    if (user) {
      res.json({ data: results });
    } else {
      res.status(404).send({ error: "User not found" });
    }
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
