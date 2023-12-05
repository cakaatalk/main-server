class RoomRepository {
  constructor(connection) {
    this.connection = connection;
  }

  makeRoom(userId, roomName) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO rooms (room_name) VALUES (?)",
        [roomName],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            const roomId = results.insertId;
            this.joinRoom([userId], roomId).then(resolve).catch(reject);
          }
        }
      );
    });
  }
  joinRoom(userIds, roomId) {
    return new Promise((resolve, reject) => {
      const queries = userIds.map((userId) => {
        return new Promise((res, rej) => {
          this.connection.query(
            "INSERT INTO user_in_room (room_id, user_id) VALUES (?, ?)",
            [roomId, userId],
            (error) => {
              if (error) rej(error);
              else res();
            }
          );
        });
      });

      Promise.all(queries)
        .then(() => resolve())
        .catch(reject);
    });
  }
  getUsers(roomId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT user_id FROM user_in_room WHERE room_id = ?",
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
  sendMessage(userId, roomId, content, timestamp) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO messages (content, sender, room_id, timestamp) VALUES (?, ?, ?, ?)",
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
  getMessage(roomId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp DESC",
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
}

module.exports = RoomRepository;
