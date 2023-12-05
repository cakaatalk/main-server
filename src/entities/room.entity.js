const BaseEntity = require("../common/database/entity/baseEntity");
class Room extends BaseEntity {
  constructor({
    id = null,
    user_id = null,
    image_url = "",
    comment = "",
  } = {}) {
    super({ id, user_id, image_url, comment });
    this.
  }
}

module.exports = Profile;
