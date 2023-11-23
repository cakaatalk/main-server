const Profile = require("../entities/profile.entity");
const User = require("../entities/user.entity");

class UserRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findAllByEmail(email) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM USER WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new User(results[0]) : null);
          }
        }
      );
    });
  }

  findProfileById(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM PROFILE WHERE user_id = ?",
        [id],
        (error, results) => {
          console.log(results);
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new Profile(results[0]) : new Profile());
          }
        }
      );
    });
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM USER WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new User(results[0]) : null);
          }
        }
      );
    });
  }

  addFriend(userId, friendId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO FRIENDS (user_id, friend_id) VALUES (?, ?)",
        [userId, friendId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new User(results[0]) : null);
          }
        }
      );
    });
  }

  findFriendsByEmail(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
          SELECT p.image_url, u.user_name, p.comment
          FROM FRIENDS f
          JOIN USER u ON f.friend_id = u.id
          JOIN PROFILE p ON f.friend_id = p.user_id
          WHERE f.user_id = ?;
        `,
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new User(results[0]) : null);
          }
        }
      );
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.connection.query("SELECT * FROM USER;", [], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.map((user) => new User(user)));
        }
      });
    });
  }

  updateProfile(id, imageUrl, comment) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE PROFILE SET image_url = ?, comment = ? WHERE user_id = ?",
        [id, imageUrl, comment],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new User(results[0]) : null);
          }
        }
      );
    });
  }

  searchUserByName(name) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT id, user_name FROM USER WHERE user_name LIKE ?",
        [name],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0] ? new User(results[0]) : null);
          }
        }
      );
    });
  }

  saveUser(user) {
    return new Promise((resolve, reject) => {
      user.save((error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM USER WHERE id = ?`;
      this.connection.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = UserRepository;
