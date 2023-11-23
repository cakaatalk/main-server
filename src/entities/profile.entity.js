const BaseEntity = require("../common/database/entity/baseEntity");
class Profile extends BaseEntity {
  constructor({
    id = null,
    user_id = null,
    image_url = "",
    comment = "",
  } = {}) {
    super({ id, user_id, image_url, comment });
    this.id = id;
    this.user_id = user_id;
    this.image_url = image_url;
    this.comment = comment;
  }

  static get tableName() {
    return "PROFILE";
  }
}

module.exports = Profile;
