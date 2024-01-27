const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: "User" },
  followee: { type: Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", NotificationsSchema);
