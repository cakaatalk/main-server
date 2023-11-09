const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authTokenSchema = new Schema({
    authId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

module.exports = AuthToken;