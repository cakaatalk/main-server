const db = require("../../common/database");
const { ErrorResponse } = require("#dongception");
const { response } = require("express");

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

  async getProfile(userId, user) {
    const userProfile = await this.userRepository.findProfileById(userId);
    return {
      id: user.id,
      name: user.user_name,
      email: user.email,
      profileImage: userProfile.image_url,
      comment: userProfile.comment,
    };
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

  async findAllUserWithoutMe(userId) {
    const users = await this.userRepository.findAll();
    const filteredUsers = users.filter((user) => user.id !== userId);

    return filteredUsers;
  }

  async updateProfile(userId, imageUrl, comment) {
    const userProfile = await this.userRepository.findProfileById(userId);
    if (userProfile.id == null) {
      await this.userRepository.createProfile(userId, imageUrl, comment);
    } else {
      await this.userRepository.updateProfile(userId, imageUrl, comment);
    }

    return { message: "Profile updated!", ok: true };
  }

  async searchUser(nameForSearch) {
    let response = [];
    const users = await this.userRepository.searchUserByName(nameForSearch);
    for (let el of users) {
      const userProfile = await this.userRepository.findProfileById(el.id);
      response.push({
        id: el.id,
        name: el.user_name,
        email: el.email,
        comment: userProfile.comment || "",
        profileImage: userProfile.imageUrl || "",
      });
    }
    return response;
  }
}

module.exports = UserService;
