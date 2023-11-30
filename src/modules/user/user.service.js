const db = require("../../common/database");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async friendsList(userId) {
    const users = await this.userRepository.findFriends(userId);
    if (!users) {
      throw new ErrorResponse(404, "User not found");
    }
    return { data: users };
  }

  // 다른 메소드들...
}
module.exports = UserService;

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM USER WHERE email = ?`;
    db.query(query, [email], (error, rows) => {
      if (error) {
        return reject(error);
      }
      return resolve(rows);
    });
  });
};
