const db = require("../../common/database");
const UserRepository = require("../../repositories/user.repository");
const User = require("../../entities/user.entities");
const userRepository = new UserRepository(db);
// exports.getFriendsList = (req, res) => {
//   const userId = req.headers.userid;

//   const query = `
//     SELECT p.image_url, u.user_name, p.comment
//     FROM FRIENDS f
//     JOIN USER u ON f.friend_id = u.id
//     JOIN PROFILE p ON f.friend_id = p.user_id
//     WHERE f.user_id = ?;
//   `;

//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       res.status(500).json({ error: error.message });
//       return;
//     }
//     res.json({ data: results });
//   });
// };

exports.getFriendsList = async (req, res) => {
  const userId = req.headers.userId;
  console.log(req);
  try {
    // const userRepository = new UserRepository(db);
    const user = await userRepository.findFriendsByEmail(userId);
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findById(userId);
    if (user) {
      res.json({ data: results[0] });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFriend = async (req, res) => {
  const userId = req.headers.userid;
  const friendId = req.params.friendId;

  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.addFriend(userId, friendId);
    if (user) {
      res.json({ message: "Friend added!" });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findUserByEmail = async (req, res) => {
  const email = req.query.email;

  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findByEmail(email);
    if (user) {
      res.json({ data: result });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findAllUser = async (req, res) => {
  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findAll();
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.headers.userid;
  const imageUrl = req.body.imageUrl;
  const comment = req.body.comment;

  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.updateProfile(userId, imageUrl, comment);
    if (user) {
      res.json({ message: "Profile updated!" });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchUser = async (req, res) => {
  const nameForSearch = `%${req.query.name}%`;

  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.searchUserByName(nameForSearch);
    if (user) {
      res.json({ data: results });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const user = new User({
      user_name: userName,
      email: email,
      password: password,
    });

    const result = await userRepository.saveUser(user);
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteUser = (req, res) => {
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
};
