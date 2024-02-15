const mongoose = require('mongoose');

const RecentChatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  recentChats: [
    {
      userId: String,
      firstname: String,
      lastname: String,
    },
  ],
});

module.exports = mongoose.model('RecentChat', RecentChatSchema);