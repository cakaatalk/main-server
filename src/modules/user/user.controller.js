const db = require("../../common/database");

exports.getFriendsList = (req, res) => {
  const userId = req.headers.userid;

  const query = `
    SELECT p.image_url, u.user_name, p.comment
    FROM FRIENDS f
    JOIN USER u ON f.friend_id = u.id
    JOIN PROFILE p ON f.friend_id = p.user_id
    WHERE f.user_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ data: results });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM PROFILE WHERE user_id = ?";
  db.query(query, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ data: results[0] });
  });
};

exports.addFriend = (req, res) => {
  const userId = req.headers.userid;
  const friendId = req.params.friendId;
  const query = "INSERT INTO FRIENDS (user_id, friend_id) VALUES (?, ?)";
  db.query(query, [userId, friendId], (error) => {
    if (error) {
      console.log(results);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ message: "Friend added!" });
  });
};

exports.findUserByEmail = (req, res) => {
  const email = req.query.email;
  const query = `SELECT * FROM USER WHERE email = ?`;
  db.query(query, [email], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    if (results.length != 0) {
      res.json({ data: results });
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  })
}

exports.findAllUser = (req, res) => {
  const query = `SELECT * FROM USER`;
  db.query(query, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    console.log(results);
    res.json({ data: results });
  })
}

exports.updateProfile = (req, res) => {
  const userId = req.headers.userid;
  const imageUrl = req.body.imageUrl;
  const comment = req.body.comment;
  const query =
    "UPDATE PROFILE SET image_url = ?, comment = ? WHERE user_id = ?";
  db.query(query, [imageUrl, comment, userId], (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ message: "Profile updated!" });
  });
};

exports.searchUser = (req, res) => {
  const searchTerm = `%${req.query.name}%`;
  console.log(searchTerm);
  const query = "SELECT id, user_name FROM USER WHERE user_name LIKE ?";
  db.query(query, [searchTerm], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ data: results });
  });
};

exports.addUser = (req, res) => {
  const { userName, email, password } = req.body;

  db.query(
    "INSERT INTO USER (user_name, email, password) VALUES (?, ?, ?)",
    [userName, email, password],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const userId = results.insertId;
      db.query("INSERT INTO PROFILE (user_id) VALUES (?)", [userId], (err2) => {
        if (err2) {
          res.status(500).json({ error: err2.message });
          return;
        }
        res.json({
          message: "User and profile added successfully",
          userId: userId,
        });
      });
    }
  );
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
