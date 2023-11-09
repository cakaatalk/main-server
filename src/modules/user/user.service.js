const db = require("../../common/database");


exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM USER WHERE email = ?`;
    db.query(query, [email], (error, rows) => {
      if (error) {
        return reject(error);
      }
      if (rows.length > 0) {
        return resolve(rows);
      } else {
        return reject('User not found');
      }
    });
  })
}

// 동재 코드

exports.getFriendsList = (userId) => {
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

exports.getProfile = (userId) => {
  const query = "SELECT * FROM PROFILE WHERE user_id = ?";
  db.query(query, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ data: results[0] });
  });
};

exports.addFriend = (userId, friendId) => {
  const query = "INSERT INTO FRIENDS (user_id, friend_id) VALUES (?, ?)";
  db.query(query, [userId, friendId], (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ message: "Friend added!" });
  });
};

exports.updateProfile = (userId, imageUrl, comment) => {
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

exports.searchUser = (name) => {
  const query = "SELECT id, user_name FROM USER WHERE user_name LIKE ?";
  db.query(query, [name], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ data: results });
  });
};

exports.addUser = (userName, email, password) => {
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

exports.deleteUser = (userId) => {
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