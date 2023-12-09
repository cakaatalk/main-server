// database/userQueries.js
const query = require("./query");

const getvUserFriends = (userId) => {
  const sql = `
    SELECT p.image_url, u.user_name, p.comment
    FROM FRIENDS f
    JOIN USER u ON f.friend_id = u.id
    JOIN PROFILE p ON f.friend_id = p.user_id
    WHERE f.user_id = ?;
  `;
  return query(sql, [userId]);
};

const getProfile = (userId) => {
  return db.selectQuery("SELECT * FROM PROFILE WHERE user_id = ?", [userId]);
};

module.exports = {
  getvUserFriends,
  getProfile,
};
