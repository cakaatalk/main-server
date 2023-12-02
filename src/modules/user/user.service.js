const db = require("../../common/database");
const { ErrorResponse } = require("#dongception");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getFriendsList(userId) {
    const users = await this.userRepository.findFriends(userId);
    if (!users) {
      throw new ErrorResponse(404, "User not found");
    }
    return { users };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findProfileById(userId);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }
    return user;
  }

  async addFriend(userId, friendId) {
    const user = await this.userRepository.addFriend(userId, friendId);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }
    return { message: "Friend added!" };
  }

  async findUserByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }
    return user;
  }

  async findAllUser() {
    const user = await this.userRepository.findAll();
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }
    return user;
  }

  async updateProfile(userId, imageUrl, comment) {
    const user = await this.userRepository.updateProfile(
      userId,
      imageUrl,
      comment
    );
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }
    return { message: "Profile updated!" };
  }

  async searchUse(nameForSearch) {
    const user = await this.userRepository.searchUserByName(nameForSearch);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    return user;
  }
}

module.exports = UserService;
