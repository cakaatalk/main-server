const { ErrorResponse } = require("../common/dongpring/dongception");
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
            resolve(true);
          }
        }
      );
    });
  }

  findFriends(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        SELECT 
            u.id,
            u.user_name AS name, 
            u.email, 
            p.comment, 
            p.image_url AS imageURL
        FROM 
            FRIENDS f
            JOIN USER u ON f.friend_id = u.id
            LEFT JOIN PROFILE p ON u.id = p.user_id
        WHERE 
            f.user_id = ?;
        `,
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `
        SELECT 
          u.id,
          u.user_name AS name, 
          u.email, 
          p.comment, 
          p.image_url AS imageURL
        FROM 
          USER u
          LEFT JOIN PROFILE p ON u.id = p.user_id;
            `,
        [],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  updateProfile(id, imageUrl, comment) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE PROFILE SET image_url = ?, comment = ? WHERE user_id = ?",
        [imageUrl, comment, id],
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

  addProfile(id, imageUrl, comment) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE PROFILE SET image_url = ?, comment = ? WHERE user_id = ?",
        [imageUrl, comment, id],
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
        "SELECT id, user_name,email FROM USER WHERE user_name LIKE ?",
        [name],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
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
