class RoomRepository {
  constructor(connection) {
    this.connection = connection;
  }

  getPersonalRoomList(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM USERS_IN_PERSONALCHAT WHERE user1_id = (?) OR user2_id = (?)",
        [userId, userId],
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

  getUsersFromGroupChat(roomId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT user_id FROM USERS_IN_GROUPCHAT WHERE room_id= ?",
        [roomId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.map((el) => el.user_id));
          }
        }
      );
    });
  }

  getAllRooms() {
    return new Promise((resolve, reject) => {
      this.connection.query("SELECT * FROM ROOMS", [], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  getGroupRoomIds(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT room_id FROM USERS_IN_GROUPCHAT WHERE user_id=?",
        [userId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.map((el) => el.room_id));
          }
        }
      );
    });
  }

  addPersonalRoom(user1Id, user2Id, roomName = "") {
    if (Number(user1Id) > Number(user2Id)) {
      let temp = user1Id;
      user1Id = user2Id;
      user2Id = temp;
    }
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO ROOMS (room_name) VALUES (?)",
        [roomName],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            const roomId = results.insertId;
            this.addUsersInPersonalRoom(user1Id, user2Id, roomId)
              .then(resolve(roomId))
              .catch(reject);
          }
        }
      );
    });
  }

  addUsersInPersonalRoom(user1Id, user2Id, roomId) {
    if (Number(user1Id) > Number(user2Id)) {
      let temp = user1Id;
      user1Id = user2Id;
      user2Id = temp;
    }
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO USERS_IN_PERSONALCHAT (user1_id,user2_id,room_id) VALUES (?,?,?)",
        [user1Id, user2Id, roomId],
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

  getPersonalRoomId(user1Id, user2Id) {
    if (Number(user1Id) > Number(user2Id)) {
      let temp = user1Id;
      user1Id = user2Id;
      user2Id = temp;
    }
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT room_id FROM USERS_IN_PERSONALCHAT WHERE user1_id = ? and user2_id= ? ",
        [user1Id, user2Id],
        (error, result) => {
          console.log(result);
          if (error) {
            reject(error);
          } else {
            if (result.length < 1) {
              resolve(null);
            } else {
              resolve(result[0].room_id);
            }
          }
        }
      );
    });
  }

  addGroupRoom(userIds, roomName = "") {
    userIds.sort();
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO ROOMS (room_name) VALUES (?)",
        [roomName],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            const roomId = results.insertId;

            this.joinGroupChat(userIds, roomId)
              .then(resolve(roomId))
              .catch(reject);

            // this.addUsersInPersonalRoom(user1Id, user2Id, roomId)
            //   .then(resolve(roomId))
            //   .catch(reject);
          }
        }
      );
    });
  }

  joinGroupChat(userIds, roomId) {
    return new Promise((resolve, reject) => {
      const queries = userIds.map((userId) => {
        return new Promise((res, rej) => {
          this.connection.query(
            "INSERT INTO USERS_IN_GROUPCHAT (room_id, user_id) VALUES (?, ?)",
            [roomId, userId],
            (error) => {
              if (error) rej(error);
              else res();
            }
          );
        });
      });

      Promise.all(queries)
        .then(() => resolve(roomId))
        .catch(reject);
    });
  }

  getUserFromGroupChat(roomId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT user_id FROM USERS_IN_GROUPCHAT WHERE room_id = ?",
        [roomId],
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
  saveMessage(userId, roomId, content, timestamp) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO MESSAGES (content, sender, room_id, timestamp) VALUES (?, ?, ?, ?)",
        [content, userId, roomId, timestamp],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.insertId);
          }
        }
      );
    });
  }
  getAllMessage(roomId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM MESSAGES WHERE room_id = ? ORDER BY id DESC",
        [roomId],
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

  getMessageByPaging(roomId, startId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM MESSAGES WHERE room_id = ? AND id < ? AND id >= ? ORDER BY id DESC",
        [roomId, startId, startId - 20],
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
}

module.exports = RoomRepository;
